# 66 Scenario LLM Generation Timeout Guard

## 问题
第 02 步进入页面后主动调用 LLM 生成用户角色和业务场景，如果后端或 DeepSeek 请求长时间不返回，前端会一直停留在“生成中...”状态。

## 修改内容
- `ScenarioIdentificationView.vue` 增加 `LLM_REQUEST_TIMEOUT_MS = 30000`。
- 自动场景生成请求使用 `AbortController`，超过 30 秒自动中断。
- 增加防重复请求：已有生成请求进行中时，不再重复发起新的自动生成。
- 组件卸载时主动 abort 挂起请求。
- 超时、失败或返回结构异常时，自动回退本地规则生成草案，并恢复按钮状态。

## 验证
- 已运行 `npm run build`，构建通过。

## 备注
如果浏览器已经卡在旧请求，需要刷新页面才能加载新的超时保护逻辑。
