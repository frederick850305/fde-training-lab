export const prototypeWorkflowSteps = [
  {
    step: 1,
    key: 'requirement',
    title: '需求拆解',
    goal: '把客户原始需求转成业务背景、客户痛点、业务目标、用户角色和原型优先级。',
    input: '客户需求原文、会议纪要、招标片段、Word/PPT 方案材料。',
    output: '业务背景、客户痛点、业务目标、用户角色、核心业务场景、待确认问题。',
    templateFile: 'prototype_factory/02_requirement_analysis_template.md',
    promptHint: '先要求 AI 不写代码，只输出结构化需求分析。',
    status: 'ready'
  },
  {
    step: 2,
    key: 'scenario',
    title: '场景识别',
    goal: '明确谁在什么场景下使用系统，以及当前工作方式、痛点和系统支持方式。',
    input: '需求拆解结果。',
    output: '用户角色表、业务场景表、任务流程表、角色与页面映射表。',
    templateFile: 'prototype_factory/03_business_scenario_template.md',
    promptHint: '让 AI 区分执行者、管理者、决策者和支撑者。',
    status: 'ready'
  },
  {
    step: 3,
    key: 'feature',
    title: '功能设计',
    goal: '从 P0/P1 场景反推功能模块，并控制一期原型范围。',
    input: '业务场景识别结果和任务流程。',
    output: '功能模块总表、功能点明细、优先级、功能与页面/接口映射。',
    templateFile: 'prototype_factory/04_feature_design_template.md',
    promptHint: '要求 AI 按“必须做 / 可以做 / 暂不做”进行功能分级。',
    status: 'ready'
  },
  {
    step: 4,
    key: 'page',
    title: '页面设计',
    goal: '把功能模块转成页面清单、导航结构、页面状态和 Vue 文件建议。',
    input: '功能模块设计结果。',
    output: '页面总表、页面区域表、导航表、页面状态表、文件结构映射。',
    templateFile: 'prototype_factory/05_page_design_template.md',
    promptHint: '要求 AI 不要把每个功能机械拆成一个页面。',
    status: 'ready'
  },
  {
    step: 5,
    key: 'interaction',
    title: '交互设计',
    goal: '明确字段、按钮、校验、loading、成功、失败和网络异常状态。',
    input: '页面清单设计结果。',
    output: '字段表、按钮表、状态表、校验表、接口响应适配说明。',
    templateFile: 'prototype_factory/06_page_interaction_template.md',
    promptHint: '要求 AI 输出可直接指导 Vue3 表单和结果区的交互说明。',
    status: 'ready'
  },
  {
    step: 6,
    key: 'api',
    title: 'API 契约',
    goal: '明确前后端接口方法、路径、请求参数、响应结构和错误展示规则。',
    input: '页面字段与交互设计结果。',
    output: 'API 契约总表、接口详情、请求参数、成功响应、失败响应。',
    templateFile: 'prototype_factory/07_api_contract_template.md',
    promptHint: '要求 AI 适配 success/message/data/error_code 结构。',
    status: 'ready'
  },
  {
    step: 7,
    key: 'frontendPrototype',
    title: '前端原型建议',
    goal: '生成 Vue3 页面、组件拆分、目录结构和给 Codex/Copilot 的代码生成 Prompt。',
    input: '页面设计、交互设计和 API 契约。',
    output: 'Vue3 文件清单、组件建议、API 调用建议、可复制 Prompt。',
    templateFile: 'prototype_factory/09_dashboard_home_prompt.md',
    promptHint: '让 AI 生成 Vue3 + Vite 原型页面，先不引入复杂 UI 组件库。',
    status: 'next'
  }
]