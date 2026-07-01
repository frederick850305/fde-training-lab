# 2-48 DeepSeek Key 根目录 .env 持久化修复

## 背景

点击“安全保存 Key”时出现 `Failed to fetch`，同时希望 Key 保存后后续默认从根目录 `.env` 读取，不需要每次重新填写。

## 本节改动

- `src/python_basics/llm_config.py`
  - 增加项目根目录 `.env` 的内置解析兜底。
  - 即使 `python-dotenv` 未安装，也会读取 `/Users/zhenghai/Code/fde-training-lab/.env`。
  - `load_llm_config()` 每次调用前都会从 `.env` 补齐环境变量。
- `src/api/routers/llm.py`
  - `GET /llm/config` 读取 `.env` 后同步写入当前进程环境变量，保证后续 DeepSeek 调用直接可用。
- `FactoryWorkbenchView.vue`
  - 保存失败时不再只显示 `Failed to fetch`，会明确提示启动 `bash scripts/start_api.sh` 并检查 FastAPI 地址。
  - 如果 `.env` 已经保存 Key，点击“安全保存 Key”时不再要求重复填写。
  - 保存成功提示改为：已保存到项目根目录 `.env`，后续默认读取。

## 验证

- `PYTHONDONTWRITEBYTECODE=1 python3 -c "from src.python_basics.llm_config import load_llm_config; c=load_llm_config(); print(c.model); print(c.base_url); print('config ok')"` 通过。
- `npm run build` 通过。
