# 03 功能设计

- 步骤标识：`feature`
- 保存时间：2026-06-30T08:27:37.032956+00:00
- 用途：作为下一步工作台的输入来源。

## 内容摘要

- **模块**：车辆管理员查看业务状态工作台

## 结构化数据

<!-- FDE_STEP_RESULT_JSON_START -->
```json
{
  "allMappings": [
    {
      "scenario": {
        "key": "scenario-1782804838550-0",
        "name": "调度员现场调度",
        "priority": "P0",
        "description": "调度员在车辆运营过程中，需要围绕“现场调度”完成信息查看、状态处理和异常反馈。",
        "workflow": [
          "进入现场调度页面",
          "查看车辆状态和待处理事项",
          "处理调度员负责的关键动作",
          "补充处理说明或异常反馈",
          "确认结果并同步给相关角色"
        ],
        "pageMapping": {
          "role": "调度员",
          "page": "VehicleOnsiteDispatchView.vue",
          "modules": [
            "现场调度列表",
            "状态筛选",
            "详情查看",
            "处理反馈"
          ]
        }
      },
      "modules": [
        {
          "key": "scenario-1782804838550-0-scenario-module",
          "priority": "P0",
          "name": "调度员现场调度工作台",
          "sourceScenario": "调度员现场调度",
          "description": "围绕「调度员现场调度」生成的场景专属功能模块，支撑调度员完成当前任务流程。",
          "features": [
            "提供现场调度列表",
            "提供状态筛选",
            "提供详情查看",
            "提供处理反馈",
            "支持进入现场调度页面"
          ],
          "pageSuggestion": "VehicleOnsiteDispatchView.vue",
          "apiSuggestion": "GET /api/scenarios/scenario-1782804838550-0",
          "scopeNote": "由当前业务场景动态生成，用于承接左侧选中场景。"
        }
      ]
    },
    {
      "scenario": {
        "key": "scenario-1782804838550-1",
        "name": "司机任务接收",
        "priority": "P1",
        "description": "司机在车辆运营过程中，需要围绕“任务接收”完成信息查看、状态处理和异常反馈。",
        "workflow": [
          "进入任务接收页面",
          "查看车辆状态和待处理事项",
          "处理司机负责的关键动作",
          "补充处理说明或异常反馈",
          "确认结果并同步给相关角色"
        ],
        "pageMapping": {
          "role": "司机",
          "page": "VehicleTaskReceivingView.vue",
          "modules": [
            "任务接收列表",
            "状态筛选",
            "详情查看",
            "处理反馈"
          ]
        }
      },
      "modules": [
        {
          "key": "scenario-1782804838550-1-scenario-module",
          "priority": "P1",
          "name": "司机任务接收工作台",
          "sourceScenario": "司机任务接收",
          "description": "围绕「司机任务接收」生成的场景专属功能模块，支撑司机完成当前任务流程。",
          "features": [
            "提供任务接收列表",
            "提供状态筛选",
            "提供详情查看",
            "提供处理反馈",
            "支持进入任务接收页面"
          ],
          "pageSuggestion": "VehicleTaskReceivingView.vue",
          "apiSuggestion": "GET /api/scenarios/scenario-1782804838550-1",
          "scopeNote": "由当前业务场景动态生成，用于承接左侧选中场景。"
        },
        {
          "key": "scheduleTracking",
          "priority": "P0",
          "name": "车辆任务跟踪",
          "sourceScenario": "计划员跟踪关键工序",
          "description": "为执行人员提供车辆计划任务、工序状态、延期标记和调整建议的操作入口。",
          "features": [
            "展示车辆计划任务列表",
            "支持按车辆、区域、工序状态筛选",
            "标记延期、阻塞和已完成任务",
            "展示车辆计划调整建议"
          ],
          "pageSuggestion": "ScheduleTrackingView.vue",
          "apiSuggestion": "GET /api/schedules/tasks",
          "scopeNote": "一期必须做，用于验证计划跟踪和进度偏差识别闭环。"
        },
        {
          "key": "issueTracking",
          "priority": "P0",
          "name": "车辆异常反馈",
          "sourceScenario": "现场调度员处理异常",
          "description": "支撑车辆日常作业中的异常登记、责任分派、处理进展跟踪和状态更新。",
          "features": [
            "新增车辆异常问题记录",
            "设置责任人和处理时限",
            "更新异常处理状态",
            "查看异常问题处理历史"
          ],
          "pageSuggestion": "IssueTrackingView.vue",
          "apiSuggestion": "POST /api/issues, PATCH /api/issues/{id}",
          "scopeNote": "一期必须做，用于体现从发现问题到闭环处理的核心价值。"
        }
      ]
    },
    {
      "scenario": {
        "key": "scenario-1782804838550-2",
        "name": "门岗管理员查看业务状态",
        "priority": "P1",
        "description": "门岗管理员在车辆运营过程中，需要围绕“查看业务状态”完成信息查看、状态处理和异常反馈。",
        "workflow": [
          "进入查看业务状态页面",
          "查看车辆状态和待处理事项",
          "处理门岗管理员负责的关键动作",
          "补充处理说明或异常反馈",
          "确认结果并同步给相关角色"
        ],
        "pageMapping": {
          "role": "门岗管理员",
          "page": "VehicleGateAccessCheckView.vue",
          "modules": [
            "查看业务状态列表",
            "状态筛选",
            "详情查看",
            "处理反馈"
          ]
        }
      },
      "modules": [
        {
          "key": "scenario-1782804838550-2-scenario-module",
          "priority": "P1",
          "name": "门岗管理员查看业务状态工作台",
          "sourceScenario": "门岗管理员查看业务状态",
          "description": "围绕「门岗管理员查看业务状态」生成的场景专属功能模块，支撑门岗管理员完成当前任务流程。",
          "features": [
            "提供查看业务状态列表",
            "提供状态筛选",
            "提供详情查看",
            "提供处理反馈",
            "支持进入查看业务状态页面"
          ],
          "pageSuggestion": "VehicleGateAccessCheckView.vue",
          "apiSuggestion": "GET /api/scenarios/scenario-1782804838550-2",
          "scopeNote": "由当前业务场景动态生成，用于承接左侧选中场景。"
        }
      ]
    },
    {
      "scenario": {
        "key": "scenario-1782804838550-3",
        "name": "车辆管理员查看业务状态",
        "priority": "P1",
        "description": "车辆管理员在车辆运营过程中，需要围绕“查看业务状态”完成信息查看、状态处理和异常反馈。",
        "workflow": [
          "进入查看业务状态页面",
          "查看车辆状态和待处理事项",
          "处理车辆管理员负责的关键动作",
          "补充处理说明或异常反馈",
          "确认结果并同步给相关角色"
        ],
        "pageMapping": {
          "role": "车辆管理员",
          "page": "VehicleBusinessStatusView.vue",
          "modules": [
            "查看业务状态列表",
            "状态筛选",
            "详情查看",
            "处理反馈"
          ]
        }
      },
      "modules": [
        {
          "key": "scenario-1782804838550-3-scenario-module",
          "priority": "P1",
          "name": "车辆管理员查看业务状态工作台",
          "sourceScenario": "车辆管理员查看业务状态",
          "description": "围绕「车辆管理员查看业务状态」生成的场景专属功能模块，支撑车辆管理员完成当前任务流程。",
          "features": [
            "提供查看业务状态列表",
            "提供状态筛选",
            "提供详情查看",
            "提供处理反馈",
            "支持进入查看业务状态页面"
          ],
          "pageSuggestion": "VehicleBusinessStatusView.vue",
          "apiSuggestion": "GET /api/scenarios/scenario-1782804838550-3",
          "scopeNote": "由当前业务场景动态生成，用于承接左侧选中场景。"
        },
        {
          "key": "projectOverview",
          "priority": "P0",
          "name": "车辆总览",
          "sourceScenario": "项目经理查看项目总览",
          "description": "为管理者提供车辆进度、关键节点、风险异常和资源占用的一屏式总览。",
          "features": [
            "展示车辆总体进度与完成率",
            "展示关键节点状态",
            "展示延期任务和异常问题数量",
            "支持按车辆和状态筛选风险事项"
          ],
          "pageSuggestion": "ProjectOverviewView.vue",
          "apiSuggestion": "GET /api/projects/overview",
          "scopeNote": "一期必须做，用于承接项目经理的核心演示场景。"
        },
        {
          "key": "scheduleTracking",
          "priority": "P0",
          "name": "车辆任务跟踪",
          "sourceScenario": "计划员跟踪关键工序",
          "description": "为执行人员提供车辆计划任务、工序状态、延期标记和调整建议的操作入口。",
          "features": [
            "展示车辆计划任务列表",
            "支持按车辆、区域、工序状态筛选",
            "标记延期、阻塞和已完成任务",
            "展示车辆计划调整建议"
          ],
          "pageSuggestion": "ScheduleTrackingView.vue",
          "apiSuggestion": "GET /api/schedules/tasks",
          "scopeNote": "一期必须做，用于验证计划跟踪和进度偏差识别闭环。"
        },
        {
          "key": "issueTracking",
          "priority": "P0",
          "name": "车辆异常反馈",
          "sourceScenario": "现场调度员处理异常",
          "description": "支撑车辆日常作业中的异常登记、责任分派、处理进展跟踪和状态更新。",
          "features": [
            "新增车辆异常问题记录",
            "设置责任人和处理时限",
            "更新异常处理状态",
            "查看异常问题处理历史"
          ],
          "pageSuggestion": "IssueTrackingView.vue",
          "apiSuggestion": "POST /api/issues, PATCH /api/issues/{id}",
          "scopeNote": "一期必须做，用于体现从发现问题到闭环处理的核心价值。"
        }
      ]
    }
  ],
  "module": {
    "key": "scenario-1782804838550-3-scenario-module",
    "priority": "P1",
    "name": "车辆管理员查看业务状态工作台",
    "sourceScenario": "车辆管理员查看业务状态",
    "description": "围绕「车辆管理员查看业务状态」生成的场景专属功能模块，支撑车辆管理员完成当前任务流程。",
    "features": [
      "提供查看业务状态列表",
      "提供状态筛选",
      "提供详情查看",
      "提供处理反馈",
      "支持进入查看业务状态页面"
    ],
    "pageSuggestion": "VehicleBusinessStatusView.vue",
    "apiSuggestion": "GET /api/scenarios/scenario-1782804838550-3",
    "scopeNote": "由当前业务场景动态生成，用于承接左侧选中场景。"
  },
  "revisedModulesByScenarioKey": {
    "scenario-1782804838550-2": [
      {
        "key": "scenario-1782804838550-2-scenario-module",
        "priority": "P1",
        "name": "门岗管理员查看业务状态工作台",
        "sourceScenario": "门岗管理员查看业务状态",
        "description": "围绕「门岗管理员查看业务状态」生成的场景专属功能模块，支撑门岗管理员完成当前任务流程。",
        "features": [
          "提供查看业务状态列表",
          "提供状态筛选",
          "提供详情查看",
          "提供处理反馈",
          "支持进入查看业务状态页面"
        ],
        "pageSuggestion": "VehicleGateAccessCheckView.vue",
        "apiSuggestion": "GET /api/scenarios/scenario-1782804838550-2",
        "scopeNote": "由当前业务场景动态生成，用于承接左侧选中场景。"
      }
    ],
    "scenario-1782804838550-0": [
      {
        "key": "scenario-1782804838550-0-scenario-module",
        "priority": "P0",
        "name": "调度员现场调度工作台",
        "sourceScenario": "调度员现场调度",
        "description": "围绕「调度员现场调度」生成的场景专属功能模块，支撑调度员完成当前任务流程。",
        "features": [
          "提供现场调度列表",
          "提供状态筛选",
          "提供详情查看",
          "提供处理反馈",
          "支持进入现场调度页面"
        ],
        "pageSuggestion": "VehicleOnsiteDispatchView.vue",
        "apiSuggestion": "GET /api/scenarios/scenario-1782804838550-0",
        "scopeNote": "由当前业务场景动态生成，用于承接左侧选中场景。"
      }
    ]
  }
}
```
<!-- FDE_STEP_RESULT_JSON_END -->
