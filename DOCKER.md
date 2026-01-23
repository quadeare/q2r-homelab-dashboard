# Docker & GitHub Actions CI/CD Setup

This document explains how to build and deploy the q2r-dashboard as an OCI container image.

## Files Created

- **Dockerfile** - Multi-stage build (Node.js build → Nginx serve)
- **nginx.conf** - Custom Nginx configuration with caching and security headers
- **.dockerignore** - Excludes unnecessary files from Docker build context
- **.github/workflows/docker-build.yml** - GitHub Actions CI/CD workflow

## Building Locally

### Build the image:
```bash
docker build -t q2r-dashboard:latest .
```

### Run the container:
```bash
docker run -d -p 8080:80 --name q2r-dashboard q2r-dashboard:latest
```

Access the dashboard at http://localhost:8080

### Stop and remove:
```bash
docker stop q2r-dashboard
docker rm q2r-dashboard
```

## GitHub Actions CI/CD Pipeline

The pipeline automatically builds and pushes images to GitHub Container Registry (ghcr.io).

### Workflow Triggers:
- **Push to main/master** - Builds and pushes with `latest` tag
- **Push to other branches** - Builds and pushes with branch name as tag
- **Pull requests** - Builds only (no push to registry)
- **Tags (v*)** - Builds and pushes semantic versioned images

### Automatic Tagging:
The workflow automatically generates tags:
- `latest` - Always points to the latest main/master build
- `v1.0.0` - Full semantic version from git tag
- `v1.0` - Major.minor version
- `v1` - Major version only
- `develop` - Branch-specific builds

### Container Registry

Images are automatically pushed to GitHub Container Registry:
```
ghcr.io/<username>/q2r-dashboard:latest
ghcr.io/<username>/q2r-dashboard:v1.0.0
ghcr.io/<username>/q2r-dashboard:<branch-name>
```

### Making Packages Public

By default, GitHub packages are private. To make your image public:

1. Go to your repository on GitHub
2. Navigate to "Packages" on the right sidebar
3. Click on your package
4. Click "Package settings"
5. Scroll down and click "Change visibility"
6. Select "Public"

## Using the Image

### Pull from GitHub Container Registry:
```bash
# Login (if private)
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull the image
docker pull ghcr.io/<username>/q2r-dashboard:latest
```

### Run with Docker:
```bash
docker run -d -p 80:80 ghcr.io/<username>/q2r-dashboard:latest
```

### Run with Docker Compose:
```yaml
version: '3.8'
services:
  dashboard:
    image: ghcr.io/<username>/q2r-dashboard:latest
    ports:
      - "80:80"
    restart: unless-stopped
```

## GitHub Actions Configuration

The workflow file (`.github/workflows/docker-build.yml`) uses:

- **docker/build-push-action@v5** - Builds and pushes images
- **docker/metadata-action@v5** - Generates tags and labels
- **docker/setup-buildx-action@v3** - Sets up Docker Buildx
- **docker/login-action@v3** - Authenticates with GitHub Container Registry

### Caching

The workflow uses GitHub Actions cache to speed up builds:
```yaml
cache-from: type=gha
cache-to: type=gha,mode=max
```

This caches Docker layers between builds, significantly reducing build time.

## Customization

### Custom Nginx Config
Edit `nginx.conf` to customize:
- Server settings
- Caching policies
- Security headers
- Gzip compression

### Build Arguments
You can add build arguments to the Dockerfile:
```dockerfile
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine AS builder
```

Use in GitHub Actions:
```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    build-args: |
      NODE_VERSION=20
```

### Environment-Specific Builds

Add different workflows for staging/production:

```yaml
# .github/workflows/docker-staging.yml
on:
  push:
    branches:
      - staging

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}-staging
```

## Health Check

The container includes a health check:
- Endpoint: `/health`
- Interval: 30 seconds
- Timeout: 3 seconds

Check health:
```bash
docker inspect --format='{{.State.Health.Status}}' q2r-dashboard
```

## Image Size

The final image is optimized:
- Multi-stage build (build artifacts not included)
- Alpine Linux base (~50MB)
- Nginx static file serving
- No unnecessary dependencies

Expected size: ~50-70MB

## Troubleshooting

### Build fails with "npm ci" error:
Ensure package-lock.json is committed to the repository.

### Container starts but shows 404:
Check that the build stage created files in `/app/dist`.

### Nginx config errors:
Test nginx config locally:
```bash
docker run --rm -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro nginx:alpine nginx -t
```

### GitHub Actions workflow not running:
1. Check that the workflow file is in `.github/workflows/`
2. Verify the branch name matches the trigger conditions
3. Check Actions tab on GitHub for error messages

### Permission denied when pushing to registry:
The workflow uses `GITHUB_TOKEN` automatically. Ensure:
1. The workflow has `packages: write` permission (already configured)
2. Your repository allows Actions to create packages

### Image not appearing in Container Registry:
1. Check the Actions tab for workflow run status
2. Verify the workflow completed successfully
3. Check your GitHub profile/organization packages section
