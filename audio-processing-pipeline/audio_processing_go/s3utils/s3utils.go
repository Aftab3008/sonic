package s3utils

import (
	"context"
	"fmt"
	"io"
	"net/url"
	"os"
	"path/filepath"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/s3/transfermanager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

// S3ClientOptions holds optional configuration for the S3 client.
type S3ClientOptions struct {
	// BaseEndpoint overrides the default S3 endpoint (e.g. for LocalStack).
	// Replaces the deprecated config.WithEndpointResolverWithOptions approach.
	BaseEndpoint *string
}

// S3Client wraps the S3 service client and the new transfer manager.
// Replaces the deprecated feature/s3/manager Uploader/Downloader with
// the unified feature/s3/transfermanager Client.
type S3Client struct {
	Client          *s3.Client
	TransferManager *transfermanager.Client
}

// NewS3Client creates an S3Client using the modern transfermanager package.
// Optional S3ClientOptions can be provided to set a custom endpoint (e.g. LocalStack).
func NewS3Client(cfg aws.Config, optFns ...func(*S3ClientOptions)) *S3Client {
	opts := S3ClientOptions{}
	for _, fn := range optFns {
		fn(&opts)
	}

	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.UsePathStyle = true // Use path style when testing against localstack
		if opts.BaseEndpoint != nil {
			// Modern replacement for the deprecated EndpointResolver:
			// set BaseEndpoint directly on the service client options.
			o.BaseEndpoint = opts.BaseEndpoint
		}
	})

	// Create the unified transfer manager (replaces deprecated manager.NewUploader / manager.NewDownloader)
	tm := transfermanager.New(client)

	return &S3Client{
		Client:          client,
		TransferManager: tm,
	}
}

// DownloadFile downloads an object from S3 to local disk, preserving its filename.
// Uses the new transfermanager.DownloadObject which writes to an io.WriterAt,
// replacing the deprecated manager.Downloader.Download.
func (s *S3Client) DownloadFile(ctx context.Context, bucket, key, destDir string) (string, error) {
	// Decode URL-encoded keys (e.g., spaces as '+')
	decodedKey, err := url.QueryUnescape(key)
	if err != nil {
		decodedKey = key
	}

	destPath := filepath.Join(destDir, filepath.Base(decodedKey))

	// Ensure destination directory exists
	if err := os.MkdirAll(filepath.Dir(destPath), 0755); err != nil {
		return "", fmt.Errorf("failed to create destination directory: %w", err)
	}

	outFile, err := os.Create(destPath)
	if err != nil {
		return "", fmt.Errorf("failed to create destination file: %w", err)
	}
	defer outFile.Close()

	// Use the new transfermanager DownloadObject API.
	// os.File satisfies io.WriterAt, enabling concurrent part-based downloads.
	_, err = s.TransferManager.DownloadObject(ctx, &transfermanager.DownloadObjectInput{
		Bucket:  aws.String(bucket),
		Key:     aws.String(decodedKey),
		WriterAt: outFile,
	})
	if err != nil {
		// Clean up partial file on error
		os.Remove(destPath)
		return "", fmt.Errorf("failed to download s3://%s/%s: %w", bucket, decodedKey, err)
	}

	return destPath, nil
}

// UploadFolder recursively uploads a local folder to S3, preserving the folder
// structure under prefixKey.
// Uses the new transfermanager.UploadObject to replace deprecated manager.Uploader.Upload.
func (s *S3Client) UploadFolder(ctx context.Context, bucket, localDir, prefixKey string) error {
	return filepath.Walk(localDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}

		relPath, err := filepath.Rel(localDir, path)
		if err != nil {
			return fmt.Errorf("failed to compute relative path for %s: %w", path, err)
		}

		s3Key := prefixKey + "/" + filepath.ToSlash(relPath)

		file, err := os.Open(path)
		if err != nil {
			return fmt.Errorf("failed to open file %s: %w", path, err)
		}
		defer file.Close()

		// Get file size for the upload (ContentLength is *int64 in the transfermanager API)
		fileInfo, err := file.Stat()
		if err != nil {
			return fmt.Errorf("failed to stat file %s: %w", path, err)
		}
		contentLength := fileInfo.Size()

		// Use the new transfermanager UploadObject API
		_, err = s.TransferManager.UploadObject(ctx, &transfermanager.UploadObjectInput{
			Bucket:        aws.String(bucket),
			Key:           aws.String(s3Key),
			Body:          file,
			ContentLength: &contentLength,
		})

		if err == nil {
			fmt.Printf("Successfully uploaded %s to s3://%s/%s\n", path, bucket, s3Key)
		}
		return err
	})
}

// DownloadToReader downloads an S3 object and returns an io.Reader.
// This uses the transfermanager's GetObject which provides streaming reads
// with concurrent part-based downloads happening in the background.
// Note: The returned io.Reader does not implement io.Closer; the caller
// should consume all data from the reader when done.
func (s *S3Client) DownloadToReader(ctx context.Context, bucket, key string) (io.Reader, error) {
	result, err := s.TransferManager.GetObject(ctx, &transfermanager.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get object s3://%s/%s: %w", bucket, key, err)
	}

	return result.Body, nil
}
