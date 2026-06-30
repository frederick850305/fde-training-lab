# 04 页面设计

- 步骤标识：`page`
- 保存时间：2026-06-30T08:06:47.935924+00:00
- 用途：作为下一步工作台的输入来源。

## 内容摘要

- **场景**：门岗管理员查看业务状态
- **页面**：门岗管理员查看业务状态工作台

## 结构化数据

<!-- FDE_STEP_RESULT_JSON_START -->
```json
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
  "currentScenarioKey": "scenario-1782804838550-2",
  "selectedPageKey": "scenario-1782804838550-2-page-1",
  "page": {
    "key": "scenario-1782804838550-2-page-1",
    "priority": "P1",
    "type": "工作台页",
    "name": "门岗管理员查看业务状态工作台",
    "vueFile": "VehicleGateAccessCheckView.vue",
    "goal": "围绕「门岗管理员查看业务状态」生成的场景专属功能模块，支撑门岗管理员完成当前任务流程。",
    "features": [
      "提供查看业务状态列表",
      "提供状态筛选",
      "提供详情查看",
      "提供处理反馈",
      "支持进入查看业务状态页面"
    ],
    "featureText": "提供查看业务状态列表、提供状态筛选、提供详情查看、提供处理反馈、支持进入查看业务状态页面",
    "sections": [
      "门岗管理员查看业务状态状态概览",
      "车辆状态与待处理事项",
      "业务状态列表",
      "状态筛选",
      "详情查看",
      "处理反馈"
    ]
  },
  "currentPage": {
    "key": "scenario-1782804838550-2-page-1",
    "priority": "P1",
    "type": "工作台页",
    "name": "门岗管理员查看业务状态工作台",
    "vueFile": "VehicleGateAccessCheckView.vue",
    "goal": "围绕「门岗管理员查看业务状态」生成的场景专属功能模块，支撑门岗管理员完成当前任务流程。",
    "features": [
      "提供查看业务状态列表",
      "提供状态筛选",
      "提供详情查看",
      "提供处理反馈",
      "支持进入查看业务状态页面"
    ],
    "featureText": "提供查看业务状态列表、提供状态筛选、提供详情查看、提供处理反馈、支持进入查看业务状态页面",
    "sections": [
      "门岗管理员查看业务状态状态概览",
      "车辆状态与待处理事项",
      "业务状态列表",
      "状态筛选",
      "详情查看",
      "处理反馈"
    ]
  },
  "currentPageSections": [
    "门岗管理员查看业务状态状态概览",
    "车辆状态与待处理事项",
    "业务状态列表",
    "状态筛选",
    "详情查看",
    "处理反馈"
  ],
  "pageDesign": {
    "pages": [
      {
        "key": "scenario-1782804838550-2-page-1",
        "priority": "P1",
        "type": "工作台页",
        "name": "门岗管理员查看业务状态工作台",
        "vueFile": "VehicleGateAccessCheckView.vue",
        "goal": "围绕「门岗管理员查看业务状态」生成的场景专属功能模块，支撑门岗管理员完成当前任务流程。",
        "features": [
          "提供查看业务状态列表",
          "提供状态筛选",
          "提供详情查看",
          "提供处理反馈",
          "支持进入查看业务状态页面"
        ],
        "featureText": "提供查看业务状态列表、提供状态筛选、提供详情查看、提供处理反馈、支持进入查看业务状态页面",
        "sections": [
          "门岗管理员查看业务状态状态概览",
          "车辆状态与待处理事项",
          "业务状态列表",
          "状态筛选",
          "详情查看",
          "处理反馈"
        ]
      }
    ],
    "navigation": [
      {
        "label": "门岗管理员查看业务状态工作台",
        "target": "VehicleGateAccessCheckView.vue",
        "default": true
      }
    ],
    "fileStructure": {
      "views": [
        "VehicleGateAccessCheckView.vue"
      ],
      "components": [
        "ScenarioHeader.vue",
        "ScenarioFilterBar.vue",
        "ScenarioDetailPanel.vue",
        "StatusTag.vue",
        "DataTable.vue"
      ],
      "data": [
        "ScenarioMockData.js"
      ]
    }
  },
  "scenarioDesigns": {
    "scenario-1782804838550-0": {
      "pages": [
        {
          "key": "scenario-1782804838550-0-page-1",
          "priority": "P0",
          "type": "工作台页",
          "name": "调度员现场调度工作台",
          "vueFile": "VehicleOnsiteDispatchView.vue",
          "goal": "围绕「调度员现场调度」生成的场景专属功能模块，支撑调度员完成当前任务流程。",
          "features": [
            "提供现场调度列表",
            "提供状态筛选",
            "提供详情查看",
            "提供处理反馈",
            "支持进入现场调度页面"
          ],
          "featureText": "提供现场调度列表、提供状态筛选、提供详情查看、提供处理反馈、支持进入现场调度页面",
          "sections": [
            "调度员现场调度状态概览",
            "现场调度列表",
            "状态筛选",
            "详情查看",
            "进入现场调度页面操作区",
            "查看车辆状态和待处理事项操作区"
          ]
        },
        {
          "key": "scenario-1782804838550-0-page-2",
          "priority": "P1",
          "type": "辅助页",
          "name": "ProjectOverview",
          "vueFile": "ProjectOverviewView.vue",
          "goal": "为管理者提供车辆进度、关键节点、风险异常和资源占用的一屏式总览。",
          "features": [
            "展示车辆总体进度与完成率",
            "展示关键节点状态",
            "展示延期任务和异常问题数量",
            "支持按车辆和状态筛选风险事项"
          ],
          "featureText": "展示车辆总体进度与完成率、展示关键节点状态、展示延期任务和异常问题数量、支持按车辆和状态筛选风险事项",
          "sections": [
            "调度员现场调度状态概览",
            "现场调度列表",
            "状态筛选",
            "详情查看",
            "进入现场调度页面操作区",
            "查看车辆状态和待处理事项操作区"
          ]
        },
        {
          "key": "scenario-1782804838550-0-page-3",
          "priority": "P1",
          "type": "辅助页",
          "name": "ScheduleTracking",
          "vueFile": "ScheduleTrackingView.vue",
          "goal": "为执行人员提供车辆计划任务、工序状态、延期标记和调整建议的操作入口。",
          "features": [
            "展示车辆计划任务列表",
            "支持按车辆",
            "区域",
            "工序状态筛选",
            "标记延期",
            "阻塞和已完成任务",
            "展示车辆计划调整建议"
          ],
          "featureText": "展示车辆计划任务列表、支持按车辆、区域、工序状态筛选、标记延期、阻塞和已完成任务、展示车辆计划调整建议",
          "sections": [
            "调度员现场调度状态概览",
            "现场调度列表",
            "状态筛选",
            "详情查看",
            "进入现场调度页面操作区",
            "查看车辆状态和待处理事项操作区"
          ]
        },
        {
          "key": "scenario-1782804838550-0-page-4",
          "priority": "P1",
          "type": "辅助页",
          "name": "IssueTracking",
          "vueFile": "IssueTrackingView.vue",
          "goal": "支撑车辆日常作业中的异常登记、责任分派、处理进展跟踪和状态更新。",
          "features": [
            "新增车辆异常问题记录",
            "设置责任人和处理时限",
            "更新异常处理状态",
            "查看异常问题处理历史"
          ],
          "featureText": "新增车辆异常问题记录、设置责任人和处理时限、更新异常处理状态、查看异常问题处理历史",
          "sections": [
            "调度员现场调度状态概览",
            "现场调度列表",
            "状态筛选",
            "详情查看",
            "进入现场调度页面操作区",
            "查看车辆状态和待处理事项操作区"
          ]
        }
      ],
      "navigation": [
        {
          "label": "调度员现场调度工作台",
          "target": "VehicleOnsiteDispatchView.vue",
          "default": true
        },
        {
          "label": "ProjectOverview",
          "target": "ProjectOverviewView.vue",
          "default": false
        },
        {
          "label": "ScheduleTracking",
          "target": "ScheduleTrackingView.vue",
          "default": false
        },
        {
          "label": "IssueTracking",
          "target": "IssueTrackingView.vue",
          "default": false
        }
      ],
      "fileStructure": {
        "views": [
          "VehicleOnsiteDispatchView.vue",
          "ProjectOverviewView.vue",
          "ScheduleTrackingView.vue",
          "IssueTrackingView.vue"
        ],
        "components": [
          "ScenarioHeader.vue",
          "ScenarioFilterBar.vue",
          "ScenarioDetailPanel.vue",
          "StatusTag.vue",
          "DataTable.vue"
        ],
        "data": [
          "ScenarioMockData.js"
        ]
      }
    },
    "scenario-1782804838550-1": {
      "pages": [
        {
          "key": "scenario-1782804838550-1-page-1",
          "priority": "P1",
          "type": "工作台页",
          "name": "司机任务接收工作台",
          "vueFile": "VehicleTaskReceivingView.vue",
          "goal": "围绕「司机任务接收」生成的场景专属功能模块，支撑司机完成当前任务流程。",
          "features": [
            "提供任务接收列表",
            "提供状态筛选",
            "提供详情查看",
            "提供处理反馈",
            "支持进入任务接收页面"
          ],
          "featureText": "提供任务接收列表、提供状态筛选、提供详情查看、提供处理反馈、支持进入任务接收页面",
          "sections": [
            "司机任务接收状态概览",
            "任务接收列表",
            "状态筛选",
            "详情查看",
            "进入任务接收页面操作区",
            "查看车辆状态和待处理事项操作区"
          ]
        },
        {
          "key": "scenario-1782804838550-1-page-2",
          "priority": "P1",
          "type": "辅助页",
          "name": "ScheduleTracking",
          "vueFile": "ScheduleTrackingView.vue",
          "goal": "为执行人员提供车辆计划任务、工序状态、延期标记和调整建议的操作入口。",
          "features": [
            "展示车辆计划任务列表",
            "支持按车辆",
            "区域",
            "工序状态筛选",
            "标记延期",
            "阻塞和已完成任务",
            "展示车辆计划调整建议"
          ],
          "featureText": "展示车辆计划任务列表、支持按车辆、区域、工序状态筛选、标记延期、阻塞和已完成任务、展示车辆计划调整建议",
          "sections": [
            "司机任务接收状态概览",
            "任务接收列表",
            "状态筛选",
            "详情查看",
            "进入任务接收页面操作区",
            "查看车辆状态和待处理事项操作区"
          ]
        },
        {
          "key": "scenario-1782804838550-1-page-3",
          "priority": "P1",
          "type": "辅助页",
          "name": "IssueTracking",
          "vueFile": "IssueTrackingView.vue",
          "goal": "支撑车辆日常作业中的异常登记、责任分派、处理进展跟踪和状态更新。",
          "features": [
            "新增车辆异常问题记录",
            "设置责任人和处理时限",
            "更新异常处理状态",
            "查看异常问题处理历史"
          ],
          "featureText": "新增车辆异常问题记录、设置责任人和处理时限、更新异常处理状态、查看异常问题处理历史",
          "sections": [
            "司机任务接收状态概览",
            "任务接收列表",
            "状态筛选",
            "详情查看",
            "进入任务接收页面操作区",
            "查看车辆状态和待处理事项操作区"
          ]
        }
      ],
      "navigation": [
        {
          "label": "司机任务接收工作台",
          "target": "VehicleTaskReceivingView.vue",
          "default": true
        },
        {
          "label": "ScheduleTracking",
          "target": "ScheduleTrackingView.vue",
          "default": false
        },
        {
          "label": "IssueTracking",
          "target": "IssueTrackingView.vue",
          "default": false
        }
      ],
      "fileStructure": {
        "views": [
          "VehicleTaskReceivingView.vue",
          "ScheduleTrackingView.vue",
          "IssueTrackingView.vue"
        ],
        "components": [
          "ScenarioHeader.vue",
          "ScenarioFilterBar.vue",
          "ScenarioDetailPanel.vue",
          "StatusTag.vue",
          "DataTable.vue"
        ],
        "data": [
          "ScenarioMockData.js"
        ]
      }
    },
    "scenario-1782804838550-2": {
      "pages": [
        {
          "key": "scenario-1782804838550-2-page-1",
          "priority": "P1",
          "type": "工作台页",
          "name": "门岗管理员查看业务状态工作台",
          "vueFile": "VehicleGateAccessCheckView.vue",
          "goal": "围绕「门岗管理员查看业务状态」生成的场景专属功能模块，支撑门岗管理员完成当前任务流程。",
          "features": [
            "提供查看业务状态列表",
            "提供状态筛选",
            "提供详情查看",
            "提供处理反馈",
            "支持进入查看业务状态页面"
          ],
          "featureText": "提供查看业务状态列表、提供状态筛选、提供详情查看、提供处理反馈、支持进入查看业务状态页面",
          "sections": [
            "门岗管理员查看业务状态状态概览",
            "车辆状态与待处理事项",
            "业务状态列表",
            "状态筛选",
            "详情查看",
            "处理反馈"
          ]
        }
      ],
      "navigation": [
        {
          "label": "门岗管理员查看业务状态工作台",
          "target": "VehicleGateAccessCheckView.vue",
          "default": true
        }
      ],
      "fileStructure": {
        "views": [
          "VehicleGateAccessCheckView.vue"
        ],
        "components": [
          "ScenarioHeader.vue",
          "ScenarioFilterBar.vue",
          "ScenarioDetailPanel.vue",
          "StatusTag.vue",
          "DataTable.vue"
        ],
        "data": [
          "ScenarioMockData.js"
        ]
      }
    },
    "scenario-1782804838550-3": {
      "pages": [
        {
          "key": "scenario-1782804838550-3-page-1",
          "priority": "P1",
          "type": "工作台页",
          "name": "车辆管理员查看业务状态工作台",
          "vueFile": "VehicleBusinessStatusView.vue",
          "goal": "围绕「车辆管理员查看业务状态」生成的场景专属功能模块，支撑车辆管理员完成当前任务流程。",
          "features": [
            "提供查看业务状态列表",
            "提供状态筛选",
            "提供详情查看",
            "提供处理反馈",
            "支持进入查看业务状态页面"
          ],
          "featureText": "提供查看业务状态列表、提供状态筛选、提供详情查看、提供处理反馈、支持进入查看业务状态页面",
          "sections": [
            "车辆管理员查看业务状态状态概览",
            "查看业务状态列表",
            "状态筛选",
            "详情查看",
            "进入查看业务状态页面操作区",
            "查看车辆状态和待处理事项操作区"
          ]
        },
        {
          "key": "scenario-1782804838550-3-page-2",
          "priority": "P1",
          "type": "辅助页",
          "name": "ProjectOverview",
          "vueFile": "ProjectOverviewView.vue",
          "goal": "为管理者提供车辆进度、关键节点、风险异常和资源占用的一屏式总览。",
          "features": [
            "展示车辆总体进度与完成率",
            "展示关键节点状态",
            "展示延期任务和异常问题数量",
            "支持按车辆和状态筛选风险事项"
          ],
          "featureText": "展示车辆总体进度与完成率、展示关键节点状态、展示延期任务和异常问题数量、支持按车辆和状态筛选风险事项",
          "sections": [
            "车辆管理员查看业务状态状态概览",
            "查看业务状态列表",
            "状态筛选",
            "详情查看",
            "进入查看业务状态页面操作区",
            "查看车辆状态和待处理事项操作区"
          ]
        },
        {
          "key": "scenario-1782804838550-3-page-3",
          "priority": "P1",
          "type": "辅助页",
          "name": "ScheduleTracking",
          "vueFile": "ScheduleTrackingView.vue",
          "goal": "为执行人员提供车辆计划任务、工序状态、延期标记和调整建议的操作入口。",
          "features": [
            "展示车辆计划任务列表",
            "支持按车辆",
            "区域",
            "工序状态筛选",
            "标记延期",
            "阻塞和已完成任务",
            "展示车辆计划调整建议"
          ],
          "featureText": "展示车辆计划任务列表、支持按车辆、区域、工序状态筛选、标记延期、阻塞和已完成任务、展示车辆计划调整建议",
          "sections": [
            "车辆管理员查看业务状态状态概览",
            "查看业务状态列表",
            "状态筛选",
            "详情查看",
            "进入查看业务状态页面操作区",
            "查看车辆状态和待处理事项操作区"
          ]
        },
        {
          "key": "scenario-1782804838550-3-page-4",
          "priority": "P1",
          "type": "辅助页",
          "name": "IssueTracking",
          "vueFile": "IssueTrackingView.vue",
          "goal": "支撑车辆日常作业中的异常登记、责任分派、处理进展跟踪和状态更新。",
          "features": [
            "新增车辆异常问题记录",
            "设置责任人和处理时限",
            "更新异常处理状态",
            "查看异常问题处理历史"
          ],
          "featureText": "新增车辆异常问题记录、设置责任人和处理时限、更新异常处理状态、查看异常问题处理历史",
          "sections": [
            "车辆管理员查看业务状态状态概览",
            "查看业务状态列表",
            "状态筛选",
            "详情查看",
            "进入查看业务状态页面操作区",
            "查看车辆状态和待处理事项操作区"
          ]
        }
      ],
      "navigation": [
        {
          "label": "车辆管理员查看业务状态工作台",
          "target": "VehicleBusinessStatusView.vue",
          "default": true
        },
        {
          "label": "ProjectOverview",
          "target": "ProjectOverviewView.vue",
          "default": false
        },
        {
          "label": "ScheduleTracking",
          "target": "ScheduleTrackingView.vue",
          "default": false
        },
        {
          "label": "IssueTracking",
          "target": "IssueTrackingView.vue",
          "default": false
        }
      ],
      "fileStructure": {
        "views": [
          "VehicleBusinessStatusView.vue",
          "ProjectOverviewView.vue",
          "ScheduleTrackingView.vue",
          "IssueTrackingView.vue"
        ],
        "components": [
          "ScenarioHeader.vue",
          "ScenarioFilterBar.vue",
          "ScenarioDetailPanel.vue",
          "StatusTag.vue",
          "DataTable.vue"
        ],
        "data": [
          "ScenarioMockData.js"
        ]
      }
    }
  },
  "sectionGenerationSource": "llm",
  "savedAt": "2026-06-30T08:06:47.933Z"
}
```
<!-- FDE_STEP_RESULT_JSON_END -->
