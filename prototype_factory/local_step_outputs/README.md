# FDE 方法步骤本地输出

这个目录用于保存 FDE 自助式原型工厂每一步的本地 Markdown 版本。

保存规则：

- `requirement.md`：01 需求拆解
- `scenario.md`：02 场景识别
- `feature.md`：03 功能设计
- `page.md`：04 页面设计
- `interaction.md`：05 交互设计
- `api.md`：06 API 契约
- `prototype.md`：07 前端原型方案

每个 Markdown 文件包含两部分：

1. 人工可读的内容摘要。
2. 页面继续工作所需的结构化 JSON 数据块。

进入下一步时，前端会通过本地 FastAPI 读取对应 Markdown 文件，并将结构化数据恢复到 `projectContext`。
