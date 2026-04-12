package main

import (
	"audio_processor/processor"
	"audio_processor/s3utils"
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
)

func main() {
	fmt.Println("Starting Audio Processor AWS Batch Task...")

	inputBucket := os.Getenv("INPUT_BUCKET")
	inputKey := os.Getenv("INPUT_KEY")
	outputBucket := os.Getenv("OUTPUT_BUCKET")

	if inputBucket == "" || inputKey == "" || outputBucket == "" {
		log.Fatalf("Missing required environment variables: INPUT_BUCKET, INPUT_KEY, OUTPUT_BUCKET")
	}

	ctx := context.TODO()

	// Load AWS config
	// Auto detects the credentials chain provided by AWS Batch Task Role
	optFns := []func(*config.LoadOptions) error{}

	if region := os.Getenv("AWS_REGION"); region != "" {
		optFns = append(optFns, config.WithRegion(region))
	}

	cfg, err := config.LoadDefaultConfig(ctx, optFns...)
	if err != nil {
		log.Fatalf("Failed to load AWS configuration: %v", err)
	}

	// Optional LocalStack support via BaseEndpoint on the S3 client
	// (replaces the deprecated config.WithEndpointResolverWithOptions)
	var s3OptFns []func(*s3utils.S3ClientOptions)
	if endPoint := os.Getenv("AWS_ENDPOINT_URL"); endPoint != "" {
		s3OptFns = append(s3OptFns, func(o *s3utils.S3ClientOptions) {
			o.BaseEndpoint = aws.String(endPoint)
		})
	}

	s3manager := s3utils.NewS3Client(cfg, s3OptFns...)


	fmt.Printf("Downloading s3://%s/%s ...\n", inputBucket, inputKey)

	workDir := filepath.Join(os.TempDir(), "audio_processing_job")
	os.RemoveAll(workDir)
	downloadDir := filepath.Join(workDir, "input")
	outputDir := filepath.Join(workDir, "output")

	localFilePath, err := s3manager.DownloadFile(ctx, inputBucket, inputKey, downloadDir)
	if err != nil {
		log.Fatalf("Failed to download file from S3: %v", err)
	}

	
	extension := filepath.Ext(inputKey)
	basePrefix := strings.TrimSuffix(inputKey, extension)
	basePrefix = strings.ReplaceAll(basePrefix, "+", " ") // Decode spaces safely

	fmt.Printf("File %s grabbed. Will generate output folder locally at %s\n", localFilePath, outputDir)

	
	err = processor.ProcessHLS(localFilePath, outputDir)
	if err != nil {
		log.Fatalf("Transcoding failed: %v", err)
	}

	fmt.Printf("Uploading processed HLS artifacts to s3://%s/%s ...\n", outputBucket, basePrefix)

	err = s3manager.UploadFolder(ctx, outputBucket, outputDir, basePrefix)
	if err != nil {
		log.Fatalf("Failed to upload output artifacts: %v", err)
	}

	fmt.Println("Audio Processing complete!")
}