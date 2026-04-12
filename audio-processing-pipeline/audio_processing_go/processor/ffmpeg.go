package processor

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)


func ProcessHLS(inputFile, outputDir string) error {
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return err
	}

	for _, dir := range []string{"64k", "128k", "192k"} {
		if err := os.MkdirAll(filepath.Join(outputDir, dir), 0755); err != nil {
			return err
		}
	}

	cmdArgs := []string{
		"-i", inputFile,

		"-map", "0:a",
		"-map", "0:a",
		"-map", "0:a",

		"-c:a", "aac",

		"-b:a:0", "64k",
		"-b:a:1", "128k",
		"-b:a:2", "192k",

		"-f", "hls",
		"-hls_time", "10",
		"-hls_playlist_type", "vod",

		"-hls_segment_filename", filepath.Join(outputDir, "%v", "segment_%03d.ts"),

		"-master_pl_name", "master.m3u8",
		"-var_stream_map", "a:0,name:64k a:1,name:128k a:2,name:192k",

		filepath.Join(outputDir, "%v", "playlist.m3u8"),
	}

	fmt.Println("Running FFMPEG command: ffmpeg", cmdArgs)
	
	cmd := exec.Command("ffmpeg", cmdArgs...)
	
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("ffmpeg processing failed: %v", err)
	}

	fmt.Println("Successfully processed audio file into HLS format")
	return nil
}
