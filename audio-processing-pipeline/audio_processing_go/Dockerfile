# Stage 1: Build the Go binary
FROM golang:1.26.1-alpine3.22 AS builder

RUN apk add --no-cache upx

WORKDIR /app

# Cache dependencies
COPY go.mod go.sum* ./

RUN go mod download

# Build static binary
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o audio_processor main.go

# Compress binary with UPX
RUN upx --best audio_processor

# Stage 2: Minimal runtime image
FROM alpine:3.22

LABEL org.opencontainers.image.description="Audio HLS transcoder for AWS Batch"

# Copy static FFmpeg binary (no shared library deps needed)
COPY --from=mwader/static-ffmpeg:7.1.1 /ffmpeg /usr/local/bin/ffmpeg

# Only ca-certificates needed for AWS SDK HTTPS
RUN apk add --no-cache ca-certificates && \
    adduser -D -g '' appuser

WORKDIR /app

COPY --from=builder /app/audio_processor .

USER appuser

ENTRYPOINT ["./audio_processor"]
