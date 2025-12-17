name: Build and Push Docker Image

on:
  push:
    branches: [ "main" ]  # 当代码推送到 main 分支时触发
  workflow_dispatch:      # 允许手动触发执行

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    
    # 【核心修复】这里必须明确授予 packages 的写入权限
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Log in to the Container registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata (tags, labels) for Docker
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=raw,value=latest
            type=sha

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ id.meta.outputs.tags }}
          labels: ${{ id.meta.outputs.labels }}
