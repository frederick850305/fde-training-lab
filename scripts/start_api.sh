#!/bin/bash

# 启动 FastAPI 服务脚本
# 使用方式: bash scripts/start_api.sh

set -e

PROJECT_ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$PROJECT_ROOT"

echo "📌 项目路径: $PROJECT_ROOT"
echo "🚀 启动 FastAPI 服务..."
echo "📍 访问地址: http://127.0.0.1:8001/docs"
echo "⚠️  按 Ctrl+C 停止服务"
echo ""

${PYTHON_BIN:-python3} -m uvicorn src.api.main:app --reload --host 127.0.0.1 --port 8001
