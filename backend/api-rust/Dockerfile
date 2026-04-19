# Build stage
FROM rust:1.95-bookworm AS builder

# Install system dependencies for compilation (No OpenCV)
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the entire project
COPY . .

# Build the project in release mode
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/target/release/save-puppy-unified /app/save-puppy-unified

# Expose the API port
EXPOSE 3000

# Set logging level
ENV RUST_LOG=info

# Run the binary
CMD ["./save-puppy-unified"]
