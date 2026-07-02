# 06 API 契约

- 步骤标识：`api`
- 保存时间：2026-07-02T03:26:35.151816+00:00
- 用途：作为下一步工作台的输入来源。

## 内容摘要

- 已保存该步骤的结构化输出。

## 结构化数据

<!-- FDE_STEP_RESULT_JSON_START -->
```json
{
  "contracts": [
    {
      "key": "contract-scenario-1782831312544-0-page-1-0-query",
      "method": "GET",
      "name": "查询调度工作台数据",
      "path": "/api/dispatch/dashboard",
      "goal": "获取区域筛选、车辆状态概览、异常告警等聚合数据，用于工作台整体展示",
      "trigger": "页面加载、区域筛选变更、状态概览区卡片点击",
      "resourceGroupKey": "dispatch",
      "resourceGroupLabel": "调度管理",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "success": true,
        "message": "接口处理成功",
        "data": {
          "key": "contract-scenario-1782831312544-0-page-1-0-query",
          "records": [],
          "summary": {}
        },
        "error_code": null
      },
      "errorResponse": {
        "success": false,
        "message": "接口处理失败",
        "data": null,
        "error_code": "DISPATCH_FAILED"
      },
      "errorCodes": [
        {
          "code": "DISPATCH_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "DISPATCH_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-0-page-2-1-queryApplications",
      "method": "GET",
      "name": "查询用车申请列表",
      "path": "/api/dispatch/applications",
      "goal": "获取待审批的用车申请列表，支持筛选和排序",
      "trigger": "页面加载、状态切换",
      "resourceGroupKey": "dispatch",
      "resourceGroupLabel": "调度管理",
      "requestParams": [
        {
          "name": "page",
          "type": "integer",
          "required": false,
          "description": "当前页码，默认1"
        },
        {
          "name": "pageSize",
          "type": "integer",
          "required": false,
          "description": "每页条数，默认20"
        },
        {
          "name": "status",
          "type": "string",
          "required": false,
          "description": "审批状态筛选，如 pending/approved/rejected"
        },
        {
          "name": "keyword",
          "type": "string",
          "required": false,
          "description": "申请单号或用车人模糊搜索"
        },
        {
          "name": "sortBy",
          "type": "string",
          "required": false,
          "description": "排序字段，如 applyTime/priority"
        },
        {
          "name": "sortOrder",
          "type": "string",
          "required": false,
          "description": "排序方向，asc/desc"
        }
      ],
      "successResponse": {
        "success": true,
        "message": "查询成功",
        "data": {
          "list": [
            {
              "id": "string",
              "applicant": "string",
              "applyTime": "string",
              "status": "string",
              "purpose": "string",
              "region": "string",
              "vehicleType": "string",
              "priority": "string"
            }
          ],
          "total": 0,
          "page": 1,
          "pageSize": 20
        },
        "error_code": 0
      },
      "errorResponse": {
        "success": false,
        "message": "请求异常",
        "data": null,
        "error_code": 5001
      },
      "errorCodes": [
        {
          "code": "API_FAILED",
          "meaning": "成功",
          "frontendAdvice": "正常处理返回数据"
        },
        {
          "code": 4001,
          "meaning": "请求参数校验失败",
          "frontendAdvice": "提示用户检查筛选条件"
        },
        {
          "code": 5001,
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示错误提示，提供重试按钮"
        },
        {
          "code": 5002,
          "meaning": "数据库查询异常",
          "frontendAdvice": "稍后重试，若持续失败联系管理员"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-0-page-2-1-approve",
      "method": "PUT",
      "name": "审批用车申请",
      "path": "/api/dispatch/applications/{id}/approve",
      "goal": "对用车申请进行通过或驳回操作",
      "trigger": "审核通过、审核驳回",
      "resourceGroupKey": "dispatch",
      "resourceGroupLabel": "调度管理",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "success": true,
        "message": "接口处理成功",
        "data": {
          "key": "contract-scenario-1782831312544-0-page-2-1-approve",
          "records": [],
          "summary": {}
        },
        "error_code": null
      },
      "errorResponse": {
        "success": false,
        "message": "接口处理失败",
        "data": null,
        "error_code": "DISPATCH_FAILED"
      },
      "errorCodes": [
        {
          "code": "DISPATCH_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "DISPATCH_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-0-page-2-1-dispatchTask",
      "method": "POST",
      "name": "下发派车任务",
      "path": "/api/dispatch/tasks",
      "goal": "将审批通过的申请与选定车辆绑定并下发任务给司机",
      "trigger": "下发派车按钮点击",
      "resourceGroupKey": "dispatch",
      "resourceGroupLabel": "调度管理",
      "requestParams": [
        {
          "name": "applicationId",
          "type": "string",
          "required": true,
          "description": "用车申请的唯一标识，从已审批通过的列表中选取"
        },
        {
          "name": "selectedVehicle",
          "type": "string",
          "required": true,
          "description": "派车车辆ID，由智能推荐或手动选择确定"
        },
        {
          "name": "priorityOverride",
          "type": "string",
          "required": false,
          "description": "手动调整的任务优先级，可选值：high/medium/low"
        },
        {
          "name": "dispatchRemark",
          "type": "string",
          "required": false,
          "description": "派车额外说明信息，如作业点、注意事项"
        }
      ],
      "successResponse": {
        "success": true,
        "message": "派车任务下发成功",
        "data": {
          "taskId": "任务ID",
          "status": "dispatched"
        },
        "error_code": null
      },
      "errorResponse": {
        "success": false,
        "message": "派车任务下发失败",
        "data": null,
        "error_code": "DISPATCH_FAILED"
      },
      "errorCodes": [
        {
          "code": "DISPATCH_FAILED",
          "meaning": "系统内部错误导致下发失败",
          "frontendAdvice": "提示用户稍后重试，或联系管理员"
        },
        {
          "code": "VEHICLE_UNAVAILABLE",
          "meaning": "所选车辆已被其他任务占用或离线",
          "frontendAdvice": "提示用户重新选择车辆，并刷新可用车辆列表"
        },
        {
          "code": "APPLICATION_NOT_APPROVED",
          "meaning": "用车申请未通过审核或状态异常",
          "frontendAdvice": "提示用户检查申请状态，确保已通过审核"
        },
        {
          "code": "PARAM_MISSING",
          "meaning": "缺少必要参数（如未选择车辆或申请）",
          "frontendAdvice": "提示用户补全必填项后再下发"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-0-page-3-2-queryTaskList",
      "method": "GET",
      "name": "查询任务列表",
      "path": "/api/tasks",
      "goal": "按条件查询任务列表，支持状态、区域、关键字筛选",
      "trigger": "页面加载、筛选任务、刷新任务列表",
      "resourceGroupKey": "dispatch",
      "resourceGroupLabel": "调度管理",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "success": true,
        "message": "接口处理成功",
        "data": {
          "key": "contract-scenario-1782831312544-0-page-3-2-queryTaskList",
          "records": [],
          "summary": {}
        },
        "error_code": null
      },
      "errorResponse": {
        "success": false,
        "message": "接口处理失败",
        "data": null,
        "error_code": "DISPATCH_FAILED"
      },
      "errorCodes": [
        {
          "code": "DISPATCH_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "DISPATCH_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-0-page-3-2-updateTaskStatus",
      "method": "PUT",
      "name": "更新任务状态",
      "path": "/api/tasks/{id}/status",
      "goal": "取消任务、标记异常、重新派车等状态变更操作",
      "trigger": "取消任务、标记异常、重新派车",
      "resourceGroupKey": "dispatch",
      "resourceGroupLabel": "调度管理",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": true,
          "description": "任务ID，路径参数"
        },
        {
          "name": "status",
          "type": "string",
          "required": true,
          "description": "目标状态：cancelled（取消）、abnormal（异常）、redispatched（重新派车）"
        },
        {
          "name": "reason",
          "type": "string",
          "required": false,
          "description": "状态变更原因，取消或标记异常时必填"
        },
        {
          "name": "newVehiclePlate",
          "type": "string",
          "required": false,
          "description": "重新派车时的新车牌号"
        },
        {
          "name": "newDriverName",
          "type": "string",
          "required": false,
          "description": "重新派车时的司机姓名"
        }
      ],
      "successResponse": {
        "success": true,
        "message": "任务状态更新成功",
        "data": {},
        "error_code": null
      },
      "errorResponse": {
        "success": false,
        "message": "任务状态更新失败",
        "data": null,
        "error_code": "UPDATE_FAILED"
      },
      "errorCodes": [
        {
          "code": "TASK_NOT_FOUND",
          "meaning": "任务不存在",
          "frontendAdvice": "提示用户任务已失效，建议刷新列表"
        },
        {
          "code": "INVALID_STATUS_TRANSITION",
          "meaning": "不允许的状态变更",
          "frontendAdvice": "提示用户当前状态无法执行该操作，并提供可操作的状态列表"
        },
        {
          "code": "MISSING_REASON",
          "meaning": "缺少变更原因",
          "frontendAdvice": "提示用户填写原因，聚焦到原因输入框"
        },
        {
          "code": "VEHICLE_UNAVAILABLE",
          "meaning": "所选车辆不可用",
          "frontendAdvice": "提示用户选择其他车辆，并提供可用车辆列表"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-0-page-4-3-queryAlerts",
      "method": "GET",
      "name": "查询异常告警列表",
      "path": "/api/alerts",
      "goal": "获取异常告警记录，支持按类型、状态筛选",
      "trigger": "页面加载、筛选",
      "resourceGroupKey": "dispatch",
      "resourceGroupLabel": "调度管理",
      "requestParams": [
        {
          "name": "exceptionType",
          "type": "string",
          "required": false,
          "description": "异常类型：排队超时、重复派车、车辆故障、位置偏移等"
        },
        {
          "name": "status",
          "type": "string",
          "required": false,
          "description": "异常状态：待处理、处理中、已处理"
        },
        {
          "name": "vehiclePlate",
          "type": "string",
          "required": false,
          "description": "车辆牌照"
        },
        {
          "name": "driverName",
          "type": "string",
          "required": false,
          "description": "司机姓名"
        }
      ],
      "successResponse": {
        "success": true,
        "message": "查询成功",
        "data": {
          "list": [
            {
              "id": "string",
              "exceptionType": "string",
              "exceptionDescription": "string",
              "vehiclePlate": "string",
              "driverName": "string",
              "handlerName": "string",
              "actionType": "string",
              "remark": "string",
              "status": "string",
              "createTime": "string",
              "updateTime": "string"
            }
          ],
          "total": 0,
          "page": 1,
          "pageSize": 20
        },
        "error_code": 0
      },
      "errorResponse": {
        "success": false,
        "message": "请求失败",
        "data": null,
        "error_code": 50000
      },
      "errorCodes": [
        {
          "code": 40000,
          "meaning": "请求参数错误",
          "frontendAdvice": "检查筛选条件是否合法"
        },
        {
          "code": 40100,
          "meaning": "未授权",
          "frontendAdvice": "请重新登录"
        },
        {
          "code": 50000,
          "meaning": "服务器内部错误",
          "frontendAdvice": "请稍后重试或联系管理员"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-0-page-4-3-handleAlert",
      "method": "PUT",
      "name": "处理异常告警",
      "path": "/api/alerts/{id}/handle",
      "goal": "确认处理异常，包括增派车辆、修改路线等操作",
      "trigger": "处理异常、确认处理",
      "resourceGroupKey": "dispatch",
      "resourceGroupLabel": "调度管理",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "success": true,
        "message": "接口处理成功",
        "data": {
          "key": "contract-scenario-1782831312544-0-page-4-3-handleAlert",
          "records": [],
          "summary": {}
        },
        "error_code": null
      },
      "errorResponse": {
        "success": false,
        "message": "接口处理失败",
        "data": null,
        "error_code": "DISPATCH_FAILED"
      },
      "errorCodes": [
        {
          "code": "DISPATCH_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "DISPATCH_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-1-page-1-0-queryStatistics",
      "method": "GET",
      "name": "查询统计分析数据",
      "path": "/api/statistics/overview",
      "goal": "按报表类型、时间范围、区域等获取统计图表与指标数据",
      "trigger": "页面加载、切换报表、刷新数据",
      "resourceGroupKey": "statistics",
      "resourceGroupLabel": "统计分析",
      "requestParams": [
        {
          "name": "reportType",
          "type": "string",
          "required": true,
          "description": "报表类型，如 vehicleUtilization, taskCompletionRate 等"
        },
        {
          "name": "timeRange",
          "type": "object",
          "required": true,
          "description": "时间范围，包含 startDate 和 endDate 字段，格式 yyyy-MM-dd"
        },
        {
          "name": "region",
          "type": "string",
          "required": false,
          "description": "作业区域编码，为空时查询全部区域"
        },
        {
          "name": "vehicleType",
          "type": "string",
          "required": false,
          "description": "车辆类型编码，为空时查询全部类型"
        }
      ],
      "successResponse": {
        "success": true,
        "message": "操作成功",
        "data": {
          "charts": [],
          "indicators": {}
        },
        "error_code": 0
      },
      "errorResponse": {
        "success": false,
        "message": "请求失败",
        "data": null,
        "error_code": 400
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数错误或缺失必填参数",
          "frontendAdvice": "检查表单输入是否完整，提示用户修正参数"
        },
        {
          "code": 403,
          "meaning": "无权限访问该接口",
          "frontendAdvice": "提示用户无权限，联系管理员赋权"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示系统异常提示，引导用户稍后重试或联系支持"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-1-page-1-0-exportReport",
      "method": "POST",
      "name": "导出统计报表",
      "path": "/api/statistics/export",
      "goal": "根据当前报表类型和时间范围导出文件",
      "trigger": "导出报表",
      "resourceGroupKey": "statistics",
      "resourceGroupLabel": "统计分析",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "success": true,
        "message": "接口处理成功",
        "data": {
          "key": "contract-scenario-1782831312544-1-page-1-0-exportReport",
          "records": [],
          "summary": {}
        },
        "error_code": null
      },
      "errorResponse": {
        "success": false,
        "message": "接口处理失败",
        "data": null,
        "error_code": "STATISTICS_FAILED"
      },
      "errorCodes": [
        {
          "code": "STATISTICS_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "STATISTICS_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-1-page-2-1-queryFeeAnalysis",
      "method": "GET",
      "name": "查询费用分析数据",
      "path": "/api/statistics/fees",
      "goal": "按时间范围、车辆类型等获取费用统计数据和明细记录",
      "trigger": "查询、下钻",
      "resourceGroupKey": "statistics",
      "resourceGroupLabel": "统计分析",
      "requestParams": [
        {
          "name": "startDate",
          "type": "date",
          "required": true,
          "description": "统计时间范围的起始日期"
        },
        {
          "name": "endDate",
          "type": "date",
          "required": true,
          "description": "统计时间范围的结束日期"
        },
        {
          "name": "vehicleType",
          "type": "string",
          "required": false,
          "description": "按车辆类型筛选（如外协、临时等）"
        },
        {
          "name": "vehiclePlate",
          "type": "string",
          "required": false,
          "description": "按车牌号模糊搜索"
        }
      ],
      "successResponse": {
        "success": true,
        "message": "success",
        "data": {
          "totalCost": 0,
          "count": 0,
          "records": []
        },
        "error_code": 0
      },
      "errorResponse": {
        "success": false,
        "message": "请求失败，请稍后重试",
        "data": null,
        "error_code": 500
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "参数校验失败",
          "frontendAdvice": "请检查输入参数是否符合要求后重试"
        },
        {
          "code": 401,
          "meaning": "未授权访问",
          "frontendAdvice": "请重新登录后重试"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "请联系系统管理员或稍后重试"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-1-page-3-2-exportReport",
      "method": "POST",
      "name": "导出报表文件",
      "path": "/api/statistics/export",
      "goal": "按选择的报表类型、时间范围、格式导出文件",
      "trigger": "导出按钮点击",
      "resourceGroupKey": "statistics",
      "resourceGroupLabel": "统计分析",
      "requestParams": [
        {
          "name": "reportType",
          "type": "String",
          "required": true,
          "description": "选择要导出的报表类型，例如车辆利用率报表、任务完成率报表等。"
        },
        {
          "name": "timeRange",
          "type": "String",
          "required": true,
          "description": "选择数据导出涵盖的时间范围，格式为起始日期,结束日期 (yyyy-MM-dd,yyyy-MM-dd)。"
        },
        {
          "name": "exportFormat",
          "type": "String",
          "required": true,
          "description": "选择导出文件格式，支持Excel或PDF。"
        },
        {
          "name": "scope",
          "type": "String",
          "required": false,
          "description": "可选：全部数据、当前视图数据、所选下钻数据。"
        },
        {
          "name": "fileName",
          "type": "String",
          "required": false,
          "description": "自定义导出文件的名称，留空则使用默认名称。"
        }
      ],
      "successResponse": {
        "success": true,
        "message": "导出任务已提交",
        "data": {
          "taskId": "string",
          "estimatedWaitTime": "number"
        },
        "error_code": 0
      },
      "errorResponse": {
        "success": false,
        "message": "导出失败",
        "data": null,
        "error_code": 1001
      },
      "errorCodes": [
        {
          "code": 1001,
          "meaning": "参数校验失败，必填项缺失或格式错误",
          "frontendAdvice": "请检查报表类型、时间范围、导出格式是否填写正确，时间范围不能超过90天。"
        },
        {
          "code": 1002,
          "meaning": "数据量过大，导出超时",
          "frontendAdvice": "请缩小时间范围或选择更细粒度的导出范围后重试。"
        },
        {
          "code": 1003,
          "meaning": "系统内部异常",
          "frontendAdvice": "请稍后重试或联系管理员。"
        },
        {
          "code": 1004,
          "meaning": "不支持的导出格式",
          "frontendAdvice": "请选择Excel或PDF格式。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-1-page-4-3-queryDrillDown",
      "method": "GET",
      "name": "查询数据下钻明细",
      "path": "/api/statistics/drilldown",
      "goal": "根据下钻条件获取明细数据，支持司机、车辆详情查看",
      "trigger": "下钻至详情、查看司机/车辆详情",
      "resourceGroupKey": "statistics",
      "resourceGroupLabel": "统计分析",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "success": true,
        "message": "接口处理成功",
        "data": {
          "key": "contract-scenario-1782831312544-1-page-4-3-queryDrillDown",
          "records": [],
          "summary": {}
        },
        "error_code": null
      },
      "errorResponse": {
        "success": false,
        "message": "接口处理失败",
        "data": null,
        "error_code": "STATISTICS_FAILED"
      },
      "errorCodes": [
        {
          "code": "STATISTICS_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "STATISTICS_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-2-page-1-0-queryTaskList",
      "method": "GET",
      "name": "查询司机任务列表",
      "path": "/api/driver/tasks",
      "goal": "按状态、日期、关键字获取当前司机的任务列表",
      "trigger": "搜索、查看历史任务",
      "resourceGroupKey": "driver",
      "resourceGroupLabel": "司机任务",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "success": true,
        "message": "接口处理成功",
        "data": {
          "key": "contract-scenario-1782831312544-2-page-1-0-queryTaskList",
          "records": [],
          "summary": {}
        },
        "error_code": null
      },
      "errorResponse": {
        "success": false,
        "message": "接口处理失败",
        "data": null,
        "error_code": "DRIVER_FAILED"
      },
      "errorCodes": [
        {
          "code": "DRIVER_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "DRIVER_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-2-page-2-1-queryNavigation",
      "method": "GET",
      "name": "查询导航路线",
      "path": "/api/driver/navigation",
      "goal": "根据当前任务获取推荐路线、距离、预计时间等信息",
      "trigger": "开始导航、切换路线、刷新路线",
      "resourceGroupKey": "driver",
      "resourceGroupLabel": "司机任务",
      "requestParams": [
        {
          "name": "currentPosition",
          "type": "string",
          "required": false,
          "description": "当前GPS坐标，格式为'经度,纬度'，不传则服务端自动获取"
        },
        {
          "name": "destination",
          "type": "string",
          "required": true,
          "description": "目的作业点标识或地址，从任务中获取"
        },
        {
          "name": "routeType",
          "type": "string",
          "required": true,
          "description": "导航方式，枚举值：driving / walking，默认driving"
        },
        {
          "name": "voiceGuide",
          "type": "boolean",
          "required": false,
          "description": "是否开启语音播报（影响响应是否包含语音数据）"
        }
      ],
      "successResponse": {
        "success": true,
        "message": "success",
        "data": {
          "routeList": [
            {
              "routeId": "string",
              "distance": "number（单位:米）",
              "estimatedTime": "number（单位:秒）",
              "polyline": "string（路线编码）",
              "voiceGuideEnabled": "boolean"
            }
          ],
          "totalDistance": "number",
          "estimatedTime": "number",
          "currentPosition": "string",
          "destination": "string"
        },
        "error_code": 0
      },
      "errorResponse": {
        "success": false,
        "message": "string",
        "data": null,
        "error_code": "number"
      },
      "errorCodes": [
        {
          "code": 1001,
          "meaning": "定位权限未开启或无法获取GPS信号",
          "frontendAdvice": "提示用户检查定位权限并确保GPS开启"
        },
        {
          "code": 1002,
          "meaning": "目的地不在系统作业点范围内",
          "frontendAdvice": "提示用户确认作业点正确或联系调度"
        },
        {
          "code": 1003,
          "meaning": "网络连接失败",
          "frontendAdvice": "提示用户检查网络连接后重试"
        },
        {
          "code": 1004,
          "meaning": "路线规划失败",
          "frontendAdvice": "提示用户稍后重试或联系调度员"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-2-page-3-2-submitArrival",
      "method": "POST",
      "name": "提交到达确认",
      "path": "/api/driver/arrival",
      "goal": "上传现场照片、GPS位置，完成签到确认",
      "trigger": "签到确认按钮点击",
      "resourceGroupKey": "driver",
      "resourceGroupLabel": "司机任务",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "key": "contract-scenario-1782831312544-2-page-3-2-submitArrival",
          "records": [],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 0
          },
          "summary": {}
        },
        "traceId": "trace-id"
      },
      "errorResponse": {
        "code": 500,
        "message": "接口处理失败",
        "data": null,
        "error": {
          "code": "DRIVER_FAILED",
          "message": "业务处理失败或状态流转不合法。",
          "details": []
        },
        "traceId": "trace-id"
      },
      "errorCodes": [
        {
          "code": "DRIVER_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "DRIVER_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-2-page-4-3-submitTaskCompletion",
      "method": "POST",
      "name": "提交任务完成报告",
      "path": "/api/driver/tasks/{id}/complete",
      "goal": "填写装卸数量、作业结果、异常情况并关闭任务",
      "trigger": "关闭任务、提交异常报告",
      "resourceGroupKey": "driver",
      "resourceGroupLabel": "司机任务",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": true,
          "description": "任务ID，路径参数"
        },
        {
          "name": "cargoQuantity",
          "type": "number",
          "required": true,
          "description": "实际装卸数量"
        },
        {
          "name": "operationResult",
          "type": "string",
          "required": true,
          "description": "作业结果，取值：COMPLETED / ABNORMAL"
        },
        {
          "name": "remarks",
          "type": "string",
          "required": false,
          "description": "备注"
        },
        {
          "name": "abnormalDescription",
          "type": "string",
          "required": false,
          "description": "异常情况描述，当operationResult为ABNORMAL时必填"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "taskId": "string",
          "completionTime": "string (ISO 8601)",
          "status": "CLOSED"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 40001,
        "message": "任务状态不允许关闭",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 40001,
          "meaning": "任务状态错误，无法关闭",
          "frontendAdvice": "提示用户任务状态已变更，请刷新后重试"
        },
        {
          "code": 40002,
          "meaning": "必填参数缺失",
          "frontendAdvice": "检查表单必填项是否填写"
        },
        {
          "code": 404,
          "meaning": "任务不存在",
          "frontendAdvice": "提示用户任务已被删除或ID错误"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-3-page-1-0-verifyEntry",
      "method": "POST",
      "name": "核验入场车辆",
      "path": "/api/gate/entry/verify",
      "goal": "通过车牌号或扫描码进行入场核验，返回核验结果",
      "trigger": "扫描车牌、手动输入后核验",
      "resourceGroupKey": "gate",
      "resourceGroupLabel": "门岗核验",
      "requestParams": [
        {
          "name": "plateNo",
          "type": "string",
          "required": false,
          "description": "车牌号，与scanCode至少填写一个"
        },
        {
          "name": "scanCode",
          "type": "string",
          "required": false,
          "description": "入场二维码/条形码扫描码，与plateNo至少填写一个"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "vehicleInfo": {
            "plateNo": "京A12345",
            "vehicleType": "大型货车",
            "driver": "张三",
            "phone": "13800138000"
          },
          "permission": {
            "allowed": true,
            "validUntil": "2025-12-31 23:59:59",
            "area": "生产区A"
          }
        },
        "traceId": "trace-id-string"
      },
      "errorResponse": {
        "code": 1001,
        "message": "车辆未登记",
        "data": null,
        "traceId": "trace-id-string"
      },
      "errorCodes": [
        {
          "code": "VEHICLE_NOT_FOUND",
          "meaning": "车辆在系统内未登记",
          "frontendAdvice": "提示用户车辆未登记，引导联系门岗管理员"
        },
        {
          "code": "VEHICLE_NO_ENTRY_PERMISSION",
          "meaning": "车辆无入场权限或权限已过期",
          "frontendAdvice": "提示无入场权限，展示原因和联系方式"
        },
        {
          "code": "INVALID_SCAN_CODE",
          "meaning": "扫描码无效或已过期",
          "frontendAdvice": "提示重新扫描或手动输入车牌号"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-3-page-1-0-releaseVehicle",
      "method": "POST",
      "name": "放行车辆入场",
      "path": "/api/gate/entry/release",
      "goal": "记录放行操作，联动门禁抬杆",
      "trigger": "放行按钮点击",
      "resourceGroupKey": "gate",
      "resourceGroupLabel": "门岗核验",
      "requestParams": [
        {
          "name": "vehiclePlate",
          "type": "string",
          "required": true,
          "description": "车牌号，例：京A12345"
        },
        {
          "name": "driverName",
          "type": "string",
          "required": false,
          "description": "司机姓名"
        },
        {
          "name": "orderId",
          "type": "string",
          "required": false,
          "description": "关联订单号，若为空则只做入场登记"
        },
        {
          "name": "releaseOperator",
          "type": "string",
          "required": true,
          "description": "放行操作人账号"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "releaseId": "REL20250321001",
          "vehiclePlate": "京A12345",
          "entryTime": "2025-03-21T10:30:00Z",
          "gateId": "GATE-01"
        },
        "traceId": "trace-001"
      },
      "errorResponse": {
        "code": -1,
        "message": "操作失败",
        "data": null,
        "traceId": "trace-002"
      },
      "errorCodes": [
        {
          "code": "VEHICLE_NOT_FOUND",
          "meaning": "车辆预约记录不存在或已过期",
          "frontendAdvice": "提示用户确认预约信息或重新预约"
        },
        {
          "code": "GATE_DEVICE_ERROR",
          "meaning": "门禁设备响应超时或故障",
          "frontendAdvice": "提示稍后重试，并记录设备异常"
        },
        {
          "code": "PERMISSION_DENIED",
          "meaning": "当前用户无该门岗的放行权限",
          "frontendAdvice": "提示联系管理员分配权限"
        },
        {
          "code": "RELEASE_LOCKED",
          "meaning": "该车辆正在被其他操作员处理",
          "frontendAdvice": "提示等待或联系当前操作员"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-3-page-2-1-verifyExit",
      "method": "POST",
      "name": "核验出场车辆",
      "path": "/api/gate/exit/verify",
      "goal": "通过扫描或输入车牌进行出场核验，返回车辆信息和任务状态",
      "trigger": "扫描车牌/二维码、核验通过/不通过",
      "resourceGroupKey": "gate",
      "resourceGroupLabel": "门岗核验",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "key": "contract-scenario-1782831312544-3-page-2-1-verifyExit",
          "records": [],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 0
          },
          "summary": {}
        },
        "traceId": "trace-id"
      },
      "errorResponse": {
        "code": 500,
        "message": "接口处理失败",
        "data": null,
        "error": {
          "code": "GATE_FAILED",
          "message": "业务处理失败或状态流转不合法。",
          "details": []
        },
        "traceId": "trace-id"
      },
      "errorCodes": [
        {
          "code": "GATE_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "GATE_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": "2026-07-01T14:58:12.502Z"
    },
    {
      "key": "contract-scenario-1782831312544-3-page-3-2-handleException",
      "method": "POST",
      "name": "处理核验异常",
      "path": "/api/gate/exception/handle",
      "goal": "记录异常原因、处理结果和通知对象",
      "trigger": "放行、拒绝、通知",
      "resourceGroupKey": "gate",
      "resourceGroupLabel": "门岗核验",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "key": "contract-scenario-1782831312544-3-page-3-2-handleException",
          "records": [],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 0
          },
          "summary": {}
        },
        "traceId": "trace-id"
      },
      "errorResponse": {
        "code": 500,
        "message": "接口处理失败",
        "data": null,
        "error": {
          "code": "GATE_FAILED",
          "message": "业务处理失败或状态流转不合法。",
          "details": []
        },
        "traceId": "trace-id"
      },
      "errorCodes": [
        {
          "code": "GATE_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "GATE_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-3-page-4-3-queryLogs",
      "method": "GET",
      "name": "查询核验日志",
      "path": "/api/gate/logs",
      "goal": "按车牌、时间范围、结果、方向查询核验记录",
      "trigger": "查询、重置、查看详情",
      "resourceGroupKey": "gate",
      "resourceGroupLabel": "门岗核验",
      "requestParams": [
        {
          "name": "plateNumber",
          "type": "string",
          "required": false,
          "description": "车牌号，支持模糊查询"
        },
        {
          "name": "startTime",
          "type": "string",
          "required": false,
          "description": "开始时间，格式 yyyy-MM-dd HH:mm:ss"
        },
        {
          "name": "endTime",
          "type": "string",
          "required": false,
          "description": "结束时间，格式 yyyy-MM-dd HH:mm:ss"
        },
        {
          "name": "result",
          "type": "string",
          "required": false,
          "description": "核验结果：pass/fail/unknown"
        },
        {
          "name": "direction",
          "type": "string",
          "required": false,
          "description": "方向：in/out"
        },
        {
          "name": "page",
          "type": "number",
          "required": false,
          "description": "当前页码，从1开始，默认1"
        },
        {
          "name": "pageSize",
          "type": "number",
          "required": false,
          "description": "每页条数，默认20"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "records": [
            {
              "id": "string",
              "plateNumber": "string",
              "direction": "string",
              "result": "string",
              "time": "string",
              "imageUrl": "string"
            }
          ],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 0
          },
          "summary": {
            "totalPass": 0,
            "totalFail": 0
          }
        },
        "traceId": "uuid"
      },
      "errorResponse": {
        "code": -1,
        "message": "error",
        "data": {
          "error": {
            "code": "VEHICLE_VALIDATION_FAILED",
            "message": "车辆核验失败",
            "details": []
          }
        },
        "traceId": "uuid"
      },
      "errorCodes": [
        {
          "code": "VEHICLE_VALIDATION_FAILED",
          "meaning": "车辆核验失败",
          "frontendAdvice": "提示用户重试或联系管理员"
        },
        {
          "code": "INVALID_PARAMETER",
          "meaning": "请求参数不合法",
          "frontendAdvice": "前端校验参数格式"
        },
        {
          "code": "SYSTEM_ERROR",
          "meaning": "系统内部错误",
          "frontendAdvice": "显示错误页面并提供重试按钮"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-4-page-1-0-createReservation",
      "method": "POST",
      "name": "创建预约申请",
      "path": "/api/reservation/applications",
      "goal": "提交外协车辆入场预约申请，含车辆、司机、时间信息",
      "trigger": "提交预约申请",
      "resourceGroupKey": "reservation",
      "resourceGroupLabel": "外协车辆预约",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "key": "contract-scenario-1782831312544-4-page-1-0-createReservation",
          "records": [],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 0
          },
          "summary": {}
        },
        "traceId": "trace-id"
      },
      "errorResponse": {
        "code": 500,
        "message": "接口处理失败",
        "data": null,
        "error": {
          "code": "RESERVATION_FAILED",
          "message": "业务处理失败或状态流转不合法。",
          "details": []
        },
        "traceId": "trace-id"
      },
      "errorCodes": [
        {
          "code": "RESERVATION_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "RESERVATION_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-4-page-2-1-queryAuthorization",
      "method": "GET",
      "name": "查询授权凭证",
      "path": "/api/reservation/authorization/{id}",
      "goal": "获取预约审批通过后生成的授权二维码和凭证信息",
      "trigger": "查看预约详情、下载凭证",
      "resourceGroupKey": "reservation",
      "resourceGroupLabel": "外协车辆预约",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "key": "contract-scenario-1782831312544-4-page-2-1-queryAuthorization",
          "records": [],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 0
          },
          "summary": {}
        },
        "traceId": "trace-id"
      },
      "errorResponse": {
        "code": 500,
        "message": "接口处理失败",
        "data": null,
        "error": {
          "code": "RESERVATION_FAILED",
          "message": "业务处理失败或状态流转不合法。",
          "details": []
        },
        "traceId": "trace-id"
      },
      "errorCodes": [
        {
          "code": "RESERVATION_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "RESERVATION_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-4-page-3-2-verifyEntry",
      "method": "POST",
      "name": "核验预约入场",
      "path": "/api/reservation/entry/verify",
      "goal": "通过授权码扫描或手动输入，核验并登记入场",
      "trigger": "扫描入场授权码、确认登记",
      "resourceGroupKey": "reservation",
      "resourceGroupLabel": "外协车辆预约",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "key": "contract-scenario-1782831312544-4-page-3-2-verifyEntry",
          "records": [],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 0
          },
          "summary": {}
        },
        "traceId": "trace-id"
      },
      "errorResponse": {
        "code": 500,
        "message": "接口处理失败",
        "data": null,
        "error": {
          "code": "RESERVATION_FAILED",
          "message": "业务处理失败或状态流转不合法。",
          "details": []
        },
        "traceId": "trace-id"
      },
      "errorCodes": [
        {
          "code": "RESERVATION_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "RESERVATION_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782831312544-4-page-4-3-verifyExit",
      "method": "POST",
      "name": "核验预约出场",
      "path": "/api/reservation/exit/verify",
      "goal": "核验出场车辆，更新预约状态为已核销",
      "trigger": "扫描入场凭证、核验出场",
      "resourceGroupKey": "reservation",
      "resourceGroupLabel": "外协车辆预约",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "key": "contract-scenario-1782831312544-4-page-4-3-verifyExit",
          "records": [],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 0
          },
          "summary": {}
        },
        "traceId": "trace-id"
      },
      "errorResponse": {
        "code": 500,
        "message": "接口处理失败",
        "data": null,
        "error": {
          "code": "RESERVATION_FAILED",
          "message": "业务处理失败或状态流转不合法。",
          "details": []
        },
        "traceId": "trace-id"
      },
      "errorCodes": [
        {
          "code": "RESERVATION_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "RESERVATION_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782887819107-0-page-1-0-queryMapData",
      "method": "GET",
      "name": "查询地图监控数据",
      "path": "/api/siteDispatch/map",
      "goal": "获取车辆实时位置、状态、告警等信息用于地图展示",
      "trigger": "页面加载、筛选变更、切换图层",
      "resourceGroupKey": "siteDispatch",
      "resourceGroupLabel": "现场调度地图",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "key": "contract-scenario-1782887819107-0-page-1-0-queryMapData",
          "records": [],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 0
          },
          "summary": {}
        },
        "traceId": "trace-id"
      },
      "errorResponse": {
        "code": 500,
        "message": "接口处理失败",
        "data": null,
        "error": {
          "code": "SITEDISPATCH_FAILED",
          "message": "业务处理失败或状态流转不合法。",
          "details": []
        },
        "traceId": "trace-id"
      },
      "errorCodes": [
        {
          "code": "SITEDISPATCH_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "SITEDISPATCH_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782887819107-0-page-2-1-queryVehicleList",
      "method": "GET",
      "name": "查询现场车辆列表",
      "path": "/api/siteDispatch/vehicles",
      "goal": "按类型、状态、区域、关键字筛选车辆列表",
      "trigger": "应用筛选、重置、切换视图",
      "resourceGroupKey": "siteDispatch",
      "resourceGroupLabel": "现场调度地图",
      "requestParams": [
        {
          "name": "type",
          "type": "string",
          "required": false,
          "description": "车辆类型筛选"
        },
        {
          "name": "status",
          "type": "string",
          "required": false,
          "description": "车辆状态筛选"
        },
        {
          "name": "area",
          "type": "string",
          "required": false,
          "description": "区域筛选"
        },
        {
          "name": "keyword",
          "type": "string",
          "required": false,
          "description": "关键字搜索车辆"
        },
        {
          "name": "page",
          "type": "integer",
          "required": false,
          "description": "当前页码，默认为1"
        },
        {
          "name": "pageSize",
          "type": "integer",
          "required": false,
          "description": "每页条数，默认为20"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "records": [],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 0
          },
          "summary": {}
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": -1,
        "message": "error message",
        "data": null,
        "traceId": "string",
        "error": {
          "code": "VEHICLE_VALIDATION_FAILED",
          "message": "具体的错误原因",
          "details": []
        }
      },
      "errorCodes": [
        {
          "code": "VEHICLE_VALIDATION_FAILED",
          "meaning": "车辆参数校验失败",
          "frontendAdvice": "显示具体字段错误提示"
        },
        {
          "code": "VEHICLE_NOT_FOUND",
          "meaning": "车辆不存在",
          "frontendAdvice": "提示用户重新选择"
        },
        {
          "code": "VEHICLE_SYNC_FAILED",
          "meaning": "车辆数据同步失败",
          "frontendAdvice": "提供重试按钮"
        },
        {
          "code": "500",
          "meaning": "服务器内部错误",
          "frontendAdvice": "统一错误弹窗并提供重试"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782887819107-0-page-3-2-createDispatch",
      "method": "POST",
      "name": "创建现场派车任务",
      "path": "/api/siteDispatch/dispatch",
      "goal": "根据用车申请或紧急派车请求，指定车辆、作业点、优先级后创建并派发任务",
      "trigger": "派发按钮点击",
      "resourceGroupKey": "siteDispatch",
      "resourceGroupLabel": "现场调度地图",
      "requestParams": [
        {
          "name": "dispatchType",
          "type": "string",
          "required": true,
          "description": "派车类型：APPLICATION（用车申请）或 EMERGENCY（紧急派车）"
        },
        {
          "name": "applicationId",
          "type": "string",
          "required": false,
          "description": "当 dispatchType=APPLICATION 时必填，关联的用车申请单ID"
        },
        {
          "name": "vehicleId",
          "type": "string",
          "required": true,
          "description": "指定派发的车辆ID"
        },
        {
          "name": "workPointId",
          "type": "string",
          "required": true,
          "description": "作业点ID（即目的地）"
        },
        {
          "name": "priority",
          "type": "integer",
          "required": true,
          "description": "任务优先级：1-低，2-中，3-高，4-紧急"
        },
        {
          "name": "remark",
          "type": "string",
          "required": false,
          "description": "派车备注信息"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "dispatchId": "string",
          "dispatchStatus": "string",
          "vehicleId": "string",
          "vehiclePlate": "string",
          "driverName": "string",
          "workPointName": "string",
          "priority": "integer",
          "estimatedArrivalTime": "string",
          "createdAt": "string"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": "integer",
        "message": "string",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": "VEHICLE_NOT_FOUND",
          "meaning": "指定的车辆不存在或已停用",
          "frontendAdvice": "提示用户重新选择车辆，并刷新车辆列表"
        },
        {
          "code": "WORK_POINT_INVALID",
          "meaning": "作业点无效或不在可调度范围内",
          "frontendAdvice": "提示用户选择有效的作业点"
        },
        {
          "code": "PRIORITY_INVALID",
          "meaning": "优先级数值不合法",
          "frontendAdvice": "提示用户选择正确的优先级"
        },
        {
          "code": "APPLICATION_NOT_FOUND",
          "meaning": "关联的用车申请单不存在或已取消",
          "frontendAdvice": "提示用户确认申请单状态，或转为紧急派车"
        },
        {
          "code": "DISPATCH_FAILED",
          "meaning": "派车创建失败，系统内部错误",
          "frontendAdvice": "提示用户稍后重试，或者联系运维"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782887819107-0-page-4-3-queryAlerts",
      "method": "GET",
      "name": "查询现场异常告警",
      "path": "/api/siteDispatch/alerts",
      "goal": "按告警类型、状态、时间范围查询告警列表",
      "trigger": "筛选、查询历史告警",
      "resourceGroupKey": "siteDispatch",
      "resourceGroupLabel": "现场调度地图",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "key": "contract-scenario-1782887819107-0-page-4-3-queryAlerts",
          "records": [],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 0
          },
          "summary": {}
        },
        "traceId": "trace-id"
      },
      "errorResponse": {
        "code": 500,
        "message": "接口处理失败",
        "data": null,
        "error": {
          "code": "SITEDISPATCH_FAILED",
          "message": "业务处理失败或状态流转不合法。",
          "details": []
        },
        "traceId": "trace-id"
      },
      "errorCodes": [
        {
          "code": "SITEDISPATCH_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "SITEDISPATCH_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782887819107-1-page-1-0-queryTaskList",
      "method": "GET",
      "name": "查询司机任务列表(移动端)",
      "path": "/api/mobile/tasks",
      "goal": "按状态筛选获取任务列表，支持分页加载",
      "trigger": "下拉刷新、分页加载、接收通知",
      "resourceGroupKey": "taskList",
      "resourceGroupLabel": "移动端任务",
      "requestParams": [
        {
          "name": "page",
          "type": "number",
          "required": true,
          "description": "当前页码，从1开始"
        },
        {
          "name": "pageSize",
          "type": "number",
          "required": true,
          "description": "每页条数"
        },
        {
          "name": "status",
          "type": "string",
          "required": false,
          "description": "任务状态筛选，可选值：WAITING / PROCESSING / COMPLETED / CANCELLED"
        },
        {
          "name": "keyword",
          "type": "string",
          "required": false,
          "description": "搜索关键词，匹配任务编号或目的地"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "records": [],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 100
          },
          "summary": {}
        },
        "traceId": "xxx-trace-id"
      },
      "errorResponse": {
        "code": -1,
        "message": "请求处理失败",
        "data": null,
        "traceId": "xxx-trace-id"
      },
      "errorCodes": [
        {
          "code": "TASK_NOT_FOUND",
          "meaning": "任务不存在或已被删除",
          "frontendAdvice": "提示用户任务已失效，建议刷新列表"
        },
        {
          "code": "STATUS_INVALID",
          "meaning": "传入的状态参数不合法",
          "frontendAdvice": "前端应校验状态值，错误时提示用户重新筛选"
        },
        {
          "code": "SERVER_ERROR",
          "meaning": "服务器内部错误",
          "frontendAdvice": "弹窗提示‘服务器繁忙，请稍后重试’，并提供重试按钮"
        },
        {
          "code": "PARAM_MISSING",
          "meaning": "缺少必填参数",
          "frontendAdvice": "前端需要确保 page 和 pageSize 不为空，否则提示参数错误"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782887819107-1-page-2-1-queryTaskDetail",
      "method": "GET",
      "name": "查询任务详情",
      "path": "/api/mobile/tasks/{id}",
      "goal": "获取任务完整信息，包括车辆、司机、作业点等",
      "trigger": "点击任务项",
      "resourceGroupKey": "taskList",
      "resourceGroupLabel": "移动端任务",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "key": "contract-scenario-1782887819107-1-page-2-1-queryTaskDetail",
          "records": [],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 0
          },
          "summary": {}
        },
        "traceId": "trace-id"
      },
      "errorResponse": {
        "code": 500,
        "message": "接口处理失败",
        "data": null,
        "error": {
          "code": "TASKLIST_FAILED",
          "message": "业务处理失败或状态流转不合法。",
          "details": []
        },
        "traceId": "trace-id"
      },
      "errorCodes": [
        {
          "code": "TASKLIST_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "TASKLIST_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782887819107-1-page-3-2-queryNavigation",
      "method": "GET",
      "name": "查询导航路径",
      "path": "/api/mobile/navigation",
      "goal": "根据当前位置和目标作业点获取路线、距离、预计时间",
      "trigger": "开始导航、切换路线、刷新路线",
      "resourceGroupKey": "taskList",
      "resourceGroupLabel": "移动端任务",
      "requestParams": [
        {
          "name": "latitude",
          "type": "number",
          "required": true,
          "description": "当前位置纬度（WGS84）"
        },
        {
          "name": "longitude",
          "type": "number",
          "required": true,
          "description": "当前位置经度（WGS84）"
        },
        {
          "name": "targetTaskId",
          "type": "string",
          "required": true,
          "description": "目标作业任务 ID，用于定位目标点"
        },
        {
          "name": "mode",
          "type": "string",
          "required": false,
          "description": "导航模式，可选值：driving（默认）、walking"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "route": {
            "waypoints": [
              {
                "latitude": 22.543,
                "longitude": 113.943,
                "name": "当前位置"
              },
              {
                "latitude": 22.548,
                "longitude": 113.95,
                "name": "目标作业点A"
              }
            ],
            "distance": 1200,
            "estimatedTime": 480
          }
        },
        "traceId": "generated-trace-id"
      },
      "errorResponse": {
        "code": -1,
        "message": "error",
        "data": {
          "error": {
            "code": "NAVIGATION_FAILED",
            "message": "无法计算导航路径",
            "details": []
          }
        },
        "traceId": "generated-trace-id"
      },
      "errorCodes": [
        {
          "code": "TASK_NOT_FOUND",
          "meaning": "目标作业任务不存在或已被删除",
          "frontendAdvice": "提示用户任务已失效，返回任务列表"
        },
        {
          "code": "NAVIGATION_FAILED",
          "meaning": "路线计算失败（如起点/终点无效、无通行路径）",
          "frontendAdvice": "显示失败原因，建议用户检查位置或稍后重试"
        },
        {
          "code": "VEHICLE_VALIDATION_FAILED",
          "meaning": "当前车辆不符合导航条件（如未授权、未激活）",
          "frontendAdvice": "引导用户联系管理员或切换到其他车辆"
        },
        {
          "code": "INTERNAL_SERVER_ERROR",
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示网络异常，自动重试最多3次"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782887819107-1-page-4-3-submitFeedback",
      "method": "POST",
      "name": "提交现场反馈",
      "path": "/api/mobile/tasks/{id}/feedback",
      "goal": "上传到达确认时间、照片和备注",
      "trigger": "到达确认、提交反馈",
      "resourceGroupKey": "taskList",
      "resourceGroupLabel": "移动端任务",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": true,
          "description": "任务ID（路径参数）"
        },
        {
          "name": "arrivalTime",
          "type": "string",
          "required": true,
          "description": "到达确认时间，格式 yyyy-MM-dd HH:mm:ss"
        },
        {
          "name": "photos",
          "type": "array",
          "required": false,
          "description": "现场照片URL列表"
        },
        {
          "name": "remark",
          "type": "string",
          "required": false,
          "description": "备注信息"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "feedbackId": "生成的反馈记录ID"
        },
        "traceId": "请求链路追踪ID"
      },
      "errorResponse": {
        "code": 40001,
        "message": "请求参数错误",
        "data": {
          "error": {
            "code": "PARAM_ERROR",
            "message": "参数校验失败详情",
            "details": []
          }
        },
        "traceId": "请求链路追踪ID"
      },
      "errorCodes": [
        {
          "code": "PARAM_ERROR",
          "meaning": "请求参数校验失败",
          "frontendAdvice": "检查必填字段和格式，提示用户修正"
        },
        {
          "code": "UPLOAD_FAILED",
          "meaning": "文件上传失败",
          "frontendAdvice": "请检查网络后重试"
        },
        {
          "code": "TASK_NOT_FOUND",
          "meaning": "任务不存在",
          "frontendAdvice": "请刷新任务列表"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782887819107-2-page-1-0-verifyEntry",
      "method": "POST",
      "name": "核验入场（门岗移动端）",
      "path": "/api/mobile/entry/verify",
      "goal": "通过扫描车牌或二维码进行入场核验",
      "trigger": "扫描车牌/二维码、手动核验",
      "resourceGroupKey": "entryCheck",
      "resourceGroupLabel": "移动端入场核验",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "key": "contract-scenario-1782887819107-2-page-1-0-verifyEntry",
          "records": [],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 0
          },
          "summary": {}
        },
        "traceId": "trace-id"
      },
      "errorResponse": {
        "code": 500,
        "message": "接口处理失败",
        "data": null,
        "error": {
          "code": "ENTRYCHECK_FAILED",
          "message": "业务处理失败或状态流转不合法。",
          "details": []
        },
        "traceId": "trace-id"
      },
      "errorCodes": [
        {
          "code": "ENTRYCHECK_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "ENTRYCHECK_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782887819107-2-page-2-1-releaseVehicle",
      "method": "POST",
      "name": "放行车辆（门岗移动端）",
      "path": "/api/mobile/entry/release",
      "goal": "确认放行或拒绝入场，记录时间与备注",
      "trigger": "确认放行、拒绝入场、批量放行",
      "resourceGroupKey": "entryCheck",
      "resourceGroupLabel": "移动端入场核验",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "key": "contract-scenario-1782887819107-2-page-2-1-releaseVehicle",
          "records": [],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 0
          },
          "summary": {}
        },
        "traceId": "trace-id"
      },
      "errorResponse": {
        "code": 500,
        "message": "接口处理失败",
        "data": null,
        "error": {
          "code": "ENTRYCHECK_FAILED",
          "message": "业务处理失败或状态流转不合法。",
          "details": []
        },
        "traceId": "trace-id"
      },
      "errorCodes": [
        {
          "code": "ENTRYCHECK_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "ENTRYCHECK_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782887819107-2-page-3-2-queryAlerts",
      "method": "GET",
      "name": "查询入场告警（门岗移动端）",
      "path": "/api/mobile/entry/alerts",
      "goal": "获取入场违规与安全告警列表",
      "trigger": "筛选、查询历史告警",
      "resourceGroupKey": "entryCheck",
      "resourceGroupLabel": "移动端入场核验",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "key": "contract-scenario-1782887819107-2-page-3-2-queryAlerts",
          "records": [],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 0
          },
          "summary": {}
        },
        "traceId": "trace-id"
      },
      "errorResponse": {
        "code": 500,
        "message": "接口处理失败",
        "data": null,
        "error": {
          "code": "ENTRYCHECK_FAILED",
          "message": "业务处理失败或状态流转不合法。",
          "details": []
        },
        "traceId": "trace-id"
      },
      "errorCodes": [
        {
          "code": "ENTRYCHECK_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "ENTRYCHECK_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782887819107-2-page-4-3-queryReleaseRecords",
      "method": "GET",
      "name": "查询放行记录",
      "path": "/api/mobile/entry/releaseRecords",
      "goal": "按时间、车牌、结果查询历史放行记录",
      "trigger": "查询、重置、查看详情",
      "resourceGroupKey": "entryCheck",
      "resourceGroupLabel": "移动端入场核验",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "key": "contract-scenario-1782887819107-2-page-4-3-queryReleaseRecords",
          "records": [],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 0
          },
          "summary": {}
        },
        "traceId": "trace-id"
      },
      "errorResponse": {
        "code": 500,
        "message": "接口处理失败",
        "data": null,
        "error": {
          "code": "ENTRYCHECK_FAILED",
          "message": "业务处理失败或状态流转不合法。",
          "details": []
        },
        "traceId": "trace-id"
      },
      "errorCodes": [
        {
          "code": "ENTRYCHECK_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "ENTRYCHECK_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782887819107-3-page-1-0-queryOperationReport",
      "method": "GET",
      "name": "查询车辆运营报表",
      "path": "/api/report/operations",
      "goal": "按日期范围获取车辆运营统计数据",
      "trigger": "查询、查看详情",
      "resourceGroupKey": "operationReport",
      "resourceGroupLabel": "运营报表",
      "requestParams": [
        {
          "name": "startDate",
          "type": "string",
          "required": true,
          "description": "查询起始日期，格式 yyyy-MM-dd"
        },
        {
          "name": "endDate",
          "type": "string",
          "required": true,
          "description": "查询结束日期，格式 yyyy-MM-dd"
        },
        {
          "name": "page",
          "type": "number",
          "required": false,
          "description": "当前页码，从 1 开始，默认 1"
        },
        {
          "name": "pageSize",
          "type": "number",
          "required": false,
          "description": "每页条数，默认 20"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "records": [],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 0
          },
          "summary": {}
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 1000,
        "message": "error message",
        "data": {
          "error": {
            "code": "ERROR_CODE",
            "message": "详细错误描述",
            "details": []
          }
        },
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": "INVALID_PARAMS",
          "meaning": "请求参数校验失败",
          "frontendAdvice": "检查必填参数是否符合格式要求"
        },
        {
          "code": "SERVER_ERROR",
          "meaning": "服务器内部错误",
          "frontendAdvice": "稍后重试或联系管理员"
        },
        {
          "code": "DATA_NOT_FOUND",
          "meaning": "未找到匹配数据",
          "frontendAdvice": "展示空状态，提示用户调整查询条件"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782887819107-3-page-2-1-exportReport",
      "method": "POST",
      "name": "导出报表数据",
      "path": "/api/report/export",
      "goal": "按格式和范围导出报表文件",
      "trigger": "导出、重置",
      "resourceGroupKey": "operationReport",
      "resourceGroupLabel": "运营报表",
      "requestParams": [
        {
          "name": "exportFormat",
          "type": "string",
          "required": true,
          "description": "导出文件格式，例如 xlsx、csv"
        },
        {
          "name": "exportScope",
          "type": "string",
          "required": true,
          "description": "导出范围，可选值：currentPage, all, selected"
        },
        {
          "name": "selectedIds",
          "type": "array",
          "required": false,
          "description": "当 exportScope 为 selected 时，需要传入选中记录的 ID 数组"
        },
        {
          "name": "filters",
          "type": "object",
          "required": false,
          "description": "当前报表的筛选条件，用于导出全部时保持与页面一致的筛选"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "fileUrl": "string",
          "fileName": "string"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": -1,
        "message": "导出失败",
        "data": {
          "error": {
            "code": "EXPORT_ERROR",
            "message": "具体错误原因",
            "details": []
          }
        },
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": "EXPORT_FORMAT_NOT_SUPPORTED",
          "meaning": "不支持的导出格式",
          "frontendAdvice": "提示用户选择支持的格式"
        },
        {
          "code": "EXPORT_DATA_TOO_LARGE",
          "meaning": "导出数据量过大",
          "frontendAdvice": "提示用户缩小导出范围或分批导出"
        },
        {
          "code": "EXPORT_SERVICE_ERROR",
          "meaning": "导出服务异常",
          "frontendAdvice": "提示用户稍后重试"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    },
    {
      "key": "contract-scenario-1782887819107-3-page-3-2-queryOptimizationAdvice",
      "method": "GET",
      "name": "查询资源配置优化建议",
      "path": "/api/report/optimization",
      "goal": "根据时间范围、车辆类型、区域获取热点图、推荐列表和费用汇总",
      "trigger": "查询分析、预览优化报告",
      "resourceGroupKey": "operationReport",
      "resourceGroupLabel": "运营报表",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "key": "contract-scenario-1782887819107-3-page-3-2-queryOptimizationAdvice",
          "records": [],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 0
          },
          "summary": {}
        },
        "traceId": "trace-id"
      },
      "errorResponse": {
        "code": 500,
        "message": "接口处理失败",
        "data": null,
        "error": {
          "code": "OPERATIONREPORT_FAILED",
          "message": "业务处理失败或状态流转不合法。",
          "details": []
        },
        "traceId": "trace-id"
      },
      "errorCodes": [
        {
          "code": "OPERATIONREPORT_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "OPERATIONREPORT_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": ""
    }
  ],
  "selectedContract": {
    "key": "contract-scenario-1782831312544-3-page-2-1-verifyExit",
    "method": "POST",
    "name": "核验出场车辆",
    "path": "/api/gate/exit/verify",
    "goal": "通过扫描或输入车牌进行出场核验，返回车辆信息和任务状态",
    "trigger": "扫描车牌/二维码、核验通过/不通过",
    "resourceGroupKey": "gate",
    "resourceGroupLabel": "门岗核验",
    "requestParams": [
      {
        "name": "id",
        "type": "string",
        "required": false,
        "description": "业务对象标识，按接口场景可选。"
      }
    ],
    "successResponse": {
      "code": 0,
      "message": "success",
      "data": {
        "key": "contract-scenario-1782831312544-3-page-2-1-verifyExit",
        "records": [],
        "pagination": {
          "page": 1,
          "pageSize": 20,
          "total": 0
        },
        "summary": {}
      },
      "traceId": "trace-id"
    },
    "errorResponse": {
      "code": 500,
      "message": "接口处理失败",
      "data": null,
      "error": {
        "code": "GATE_FAILED",
        "message": "业务处理失败或状态流转不合法。",
        "details": []
      },
      "traceId": "trace-id"
    },
    "errorCodes": [
      {
        "code": "GATE_VALIDATION_FAILED",
        "meaning": "请求参数或状态流转不合法。",
        "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
      },
      {
        "code": "GATE_SYNC_FAILED",
        "meaning": "服务端保存或同步失败。",
        "frontendAdvice": "展示失败原因并提供重试入口。"
      }
    ],
    "detailGenerated": true,
    "detailStatus": "done",
    "detailError": "",
    "detailGeneratedAt": "2026-07-01T14:58:12.502Z"
  },
  "responseStandard": {
    "sections": [
      {
        "key": "legacy",
        "title": "统一返回 Envelope",
        "description": "历史保存的响应格式已兼容显示，后续重新生成会采用新的统一结构。",
        "items": [
          {
            "name": "code",
            "description": 0
          },
          {
            "name": "message",
            "description": "success"
          },
          {
            "name": "data",
            "description": {}
          }
        ]
      },
      {
        "key": "pagination",
        "title": "列表分页 Data",
        "description": "查询列表类接口统一把分页、统计和数据记录放在 data 内，避免每个接口重复定义。",
        "items": [
          {
            "name": "data.records",
            "description": "array。当前页业务记录。"
          },
          {
            "name": "data.pagination.page",
            "description": "number。当前页码，从 1 开始。"
          },
          {
            "name": "data.pagination.pageSize",
            "description": "number。每页条数。"
          },
          {
            "name": "data.pagination.total",
            "description": "number。符合筛选条件的总记录数。"
          },
          {
            "name": "data.summary",
            "description": "object。当前查询范围内的统计摘要，可为空对象。"
          }
        ]
      },
      {
        "key": "error",
        "title": "失败与错误信息",
        "description": "失败响应仍保留统一外壳，错误原因放入 error，方便前端统一弹窗、字段提示和重试。",
        "items": [
          {
            "name": "error.code",
            "description": "string。稳定错误码，例如 VEHICLE_VALIDATION_FAILED。"
          },
          {
            "name": "error.message",
            "description": "string。失败原因的可读说明。"
          },
          {
            "name": "error.details",
            "description": "array。字段级错误、状态流转错误或校验详情。"
          }
        ]
      },
      {
        "key": "frontend",
        "title": "前端处理规则",
        "description": "每个接口契约只描述自身参数和业务 data，下面这些规则作为全局约定复用。",
        "items": [
          {
            "name": "成功判断",
            "description": "code === 0 视为成功；否则进入统一错误处理。"
          },
          {
            "name": "表单错误",
            "description": "error.details 中带 field 时，优先落到对应字段旁。"
          },
          {
            "name": "空状态",
            "description": "records 为空数组且 code 为 0 时展示空状态，不作为异常。"
          },
          {
            "name": "重试入口",
            "description": "网络错误、5xx 或 *_SYNC_FAILED 错误码需要保留重试操作。"
          }
        ]
      }
    ]
  },
  "generationSource": {
    "interactionPageCount": 35
  },
  "confirmedAt": "2026-07-02T03:26:35.146Z"
}
```
<!-- FDE_STEP_RESULT_JSON_END -->
