#!/bin/bash

# 停止 FastAPI 服务脚本
# 使用方式: bash scripts/stop_api.sh

set -e

PROJECT_ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$PROJECT_ROOT"

echo "📌 项目路径: $PROJECT_ROOT"
echo "🛑 停止 FastAPI 服务..."

if pkill -f "uvicorn src.api.main:app"; then
    echo "✅ API 服务已成功停止"
else
    echo "⚠️  没有找到正在运行的服务进程"
    exit 1
fi
