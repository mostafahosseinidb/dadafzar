#!/bin/bash

# Build script for dad-afzar application
set -e

echo "Building dad-afzar application..."

# Build the Docker image
docker build -t dad-afzar:latest .

echo "Build completed successfully!"
echo "To run the application:"
echo "  docker run -p 80:80 dad-afzar:latest"
echo "Or use docker-compose:"
echo "  docker-compose up -d"
