// 通用业务窗口配置注册表（驱动 BusinessWindow.vue）
// 非专用页面均通过此配置渲染 Filter + 列表 + 明细标签页。

import { lookups } from '../mock/index.js'

const noteTab = (id, label, text) => ({ id, label, fields: [{ key: '_note', label: '说明', type: 'readonly', value: text }] })

export const windowRegistry = {
  'component-types': {
    windowKey: 'component-types',
    windowTitle: 'Component Types',
    dataKey: 'componentTypes',
    statusField: 'status',
    statusOptions: ['Active', 'Obsolete', 'Blocked'],
    filterBasic: [
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Obsolete', 'Blocked'] },
      { key: 'maker', label: 'Maker', type: 'text' },
      { key: 'classCode', label: 'Class', type: 'text' },
    ],
    filterAdvanced: [
      { key: 'typeNumber', label: 'Type Number', type: 'text' },
      { key: 'name', label: 'Name', type: 'text' },
    ],
    columns: [
      { key: 'typeNumber', label: 'Type Number', width: '130px' },
      { key: 'name', label: 'Name' },
      { key: 'maker', label: 'Maker', width: '110px' },
      { key: 'classCode', label: 'Class', width: '80px' },
      { key: 'status', label: 'Status', width: '100px', tag: true },
      { key: 'jobs', label: 'Jobs', align: 'right', width: '70px' },
    ],
    detailTabs: [
      {
        id: 'general', label: 'General', fields: [
          { key: 'typeNumber', label: 'Type Number' },
          { key: 'name', label: 'Name' },
          { key: 'maker', label: 'Maker' },
          { key: 'model', label: 'Model' },
          { key: 'type', label: 'Type' },
          { key: 'classCode', label: 'Component Class' },
          { key: 'preferredVendor', label: 'Preferred Vendor', type: 'select', options: ['', ...lookups.vendors()] },
          { key: 'parentTypeNumber', label: 'Parent Component Type', type: 'lookup', lookupKey: 'componentTypes' },
          { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Obsolete', 'Blocked'] },
        ],
      },
      // 手册 2 / P37：Jobs tab 的 New/View 打开 Component Type Jobs（这里直接维护指向该类型的作业）
      {
        id: 'jobs', label: 'Jobs', type: 'subgrid',
        subSource: { dbKey: 'jobs', filterKey: 'targetId', filterModelKey: 'typeNumber' },
        newDefaults: { targetType: 'ComponentType', jobNo: '', description: '', frequency: '', planningMethod: 'Periodic', dueDate: '', status: 'Open', requiredDisciplines: [], requiredParts: [] },
        columns: [
          { key: 'jobNo', label: 'Job No.', width: '100px', default: '' },
          { key: 'description', label: 'Description', default: '' },
          { key: 'frequency', label: 'Frequency', width: '90px', default: '' },
          { key: 'planningMethod', label: 'Method', type: 'select', width: '100px', options: ['Periodic', 'Counter', 'MeasurePoint', 'Trigger'], default: 'Periodic' },
        ],
      },
      // 手册 2 / P38：Parts 为继承的备件清单；可互换件填 Alternative No.
      {
        id: 'parts', label: 'Parts', type: 'subgrid', subKey: 'parts',
        columns: [
          { key: 'stockTypeNo', label: 'Stock Type', type: 'lookup', lookupKey: 'stockTypes', width: '120px', default: '' },
          { key: 'alternativeNo', label: 'Alternative No.', width: '110px', default: '' },
        ],
      },
      // 手册 2 / P39 / P44：Counters 标签（定义该类型组件的计数器模板，注册为组件时继承）
      // 注：Depends On 字段按手册 P44 仅出现在 Components 窗口的 Counters 标签，类型级不设置依赖
      {
        id: 'counters', label: 'Counters', type: 'subgrid', subKey: 'counters',
        columns: [
          { key: 'code', label: 'Counter Code', width: '120px', default: '' },
          { key: 'description', label: 'Description', default: '' },
          { key: 'unit', label: 'Unit', width: '70px', default: '' },
        ],
      },
      // 手册 2 / P39 / P45：Measure Points 标签（定义测点模板；注册组件时继承为可编辑子表）
      {
        id: 'measure_points', label: 'Measure Points', type: 'subgrid', subKey: 'measurePointDefs',
        columns: [
          { key: 'code', label: 'Point Code', width: '120px', default: '' },
          { key: 'description', label: 'Description', default: '' },
          { key: 'trend', label: 'Trend', type: 'select', width: '90px', options: ['Up', 'Down', 'Stable'], default: 'Stable' },
          { key: 'unit', label: 'Unit', width: '70px', default: '' },
        ],
      },
      // 手册 2 / P39：Related tab 关联组件类型（创建组件时相关类型及其备件会被继承）
      {
        id: 'related', label: 'Related', type: 'subgrid', subKey: 'relatedTypes',
        columns: [
          { key: 'typeNumber', label: 'Related Component Type', type: 'lookup', lookupKey: 'componentTypes', width: '170px', default: '' },
        ],
      },
      { id: 'components', label: 'Components', fields: [] },
    ],
    options: [
      { label: 'Register as Component', action: 'register-component' },
      { label: 'View Job', action: 'view-job' },
      { label: 'Add Part', action: 'add-part' },
      { label: 'Copy', action: 'copy-type' },
      { label: 'Copy List', action: 'copy-list' },
      { label: 'Use Component Types', action: 'toggle-use-types' },
    ],
  },

  functions: {
    windowTitle: 'Functions',
    dataKey: 'functions',
    // 手册 Fleet 场景：列表按船（Installation）分组显示
    groupBy: 'installation',
    statusField: 'status',
    statusOptions: ['In Use', 'Scrapped'],
    filterBasic: [
      { key: 'status', label: 'Status', type: 'select', options: ['In Use', 'Scrapped'] },
      { key: 'location', label: 'Location', type: 'lookup', lookupKey: 'locations' },
    ],
    filterAdvanced: [{ key: 'functionNo', label: 'Function No.', type: 'text' }, { key: 'description', label: 'Description', type: 'text' }],
    columns: [
      { key: 'functionNo', label: 'Function No.', width: '130px' },
      { key: 'description', label: 'Description' },
      { key: 'parentFunctionNo', label: 'Parent', width: '120px' },
      { key: 'status', label: 'Status', width: '90px', tag: true },
      { key: 'criticality', label: 'Criticality', width: '100px' },
      { key: 'installedComponentId', label: 'Installed', width: '110px' },
    ],
    // 手册 Working with Functions：General 标签字段与截图示例一致
    detailTabs: [
      {
        id: 'general', label: 'General', fields: [
          { key: 'functionNo', label: 'Function No.' },
          { key: 'description', label: 'Description' },
          { key: 'reference', label: 'Reference' },
          { key: 'parentFunctionNo', label: 'Parent Function', type: 'lookup-with-name', lookupKey: 'functions' },
          // 手册 2 / P38-39：状态为指示性，修改统一走 Options > Change Status 对话框
          { key: 'status', label: 'Status', type: 'readonly' },
          { key: 'location', label: 'Location', type: 'lookup', lookupKey: 'locations' },
          { key: 'criticality', label: 'Criticality', type: 'select', options: ['Critical', 'High', 'Medium', 'Low'] },
          { key: 'installedComponentId', label: 'Component Performing the Function', type: 'component-performing' },
        ],
      },
      // 手册 Working with Functions：Details 标签
      {
        id: 'details', label: 'Details', fields: [
          { key: 'sfiCode', label: 'SFI Code' },
          { key: 'system', label: 'System' },
          { key: 'subSystem', label: 'Sub System' },
          { key: 'remarks', label: 'Remarks', type: 'textarea' },
        ],
      },
      // 手册 Working with Functions：Additional Info 标签
      {
        id: 'additional', label: 'Additional Info', fields: [
          { key: 'serialNo', label: 'Serial No.' },
          { key: 'maker', label: 'Maker' },
          { key: 'model', label: 'Model' },
          { key: 'tagNo', label: 'Tag No.' },
        ],
      },
      // 手册 Working with Functions：Financial Info 标签
      {
        id: 'financial', label: 'Financial Info', fields: [
          { key: 'assetValue', label: 'Asset Value', type: 'number' },
          { key: 'acquisitionDate', label: 'Acquisition Date', type: 'date' },
          { key: 'currency', label: 'Currency' },
          { key: 'depreciation', label: 'Depreciation', type: 'number' },
        ],
      },
      // 手册 Working with Functions：Counters 标签（功能位置计数器定义，可维护）
      {
        id: 'counters', label: 'Counters', type: 'subgrid', subKey: 'functionCounters',
        columns: [
          { key: 'code', label: 'Counter Code', width: '120px', default: '' },
          { key: 'description', label: 'Description', default: '' },
          { key: 'unit', label: 'Unit', width: '70px', default: '' },
          { key: 'lastValue', label: 'Last Reading', type: 'number', width: '110px', default: 0 },
        ],
      },
      // 手册 Working with Functions：Rotation Log 标签（组件安装 / 拆卸历史，只读）
      // 手册 P40：选择一行并点击 Notes 按钮可查看安装 / 拆卸时登记的 Details 评论
      {
        id: 'rotation', label: 'Rotation Log', type: 'rotation-log', sourceKey: 'rotationLog',
        subActions: [{ id: 'notes', label: 'Notes' }],
        columns: [
          { key: 'componentNo', label: 'Component No.', width: '120px' },
          { key: 'componentName', label: 'Component Name', width: '180px' },
          { key: 'installedAt', label: 'Installed', width: '110px' },
          { key: 'installedBy', label: 'Installed By', width: '120px' },
          { key: 'removedAt', label: 'Removed', width: '110px' },
          { key: 'removedBy', label: 'Removed By', width: '120px' },
        ],
      },
      // 手册 P40 step 5：只读的 Installed Component 标签，显示当前执行该功能位置的组件字段详情
      {
        id: 'installed', label: 'Installed Component', type: 'installed-component',
        fields: [
          { key: 'number', label: 'Component No.' },
          { key: 'name', label: 'Name' },
          { key: 'typeNumber', label: 'Type No.' },
          { key: 'status', label: 'Status' },
          { key: 'location', label: 'Location' },
          { key: 'maker', label: 'Maker' },
          { key: 'serialNo', label: 'Serial No.' },
        ],
      },
    ],
    options: [
      { label: 'Install Component', action: 'install-component' },
      { label: 'Remove Component', action: 'remove-component' },
      // 手册 2 / P38-39 Changing Function Status：Options > Change Status
      { label: 'Change Status', action: 'change-status' },
      // 手册 Copying Functions to Other Departments：Options > Copy Functions
      { label: 'Copy Functions', action: 'copy-functions' },
    ],
  },

  'component-type-jobs': {
    windowTitle: 'Component Type Jobs',
    dataKey: 'jobs',
    statusField: 'status',
    filterBasic: [{ key: 'targetType', label: 'Target', type: 'select', options: ['ComponentType', 'Component', 'Function'] }, { key: 'status', label: 'Status', type: 'text' }],
    filterAdvanced: [{ key: 'jobNo', label: 'Job No.', type: 'text' }, { key: 'description', label: 'Description', type: 'text' }],
    columns: [
      { key: 'jobNo', label: 'Job No.', width: '120px' },
      { key: 'description', label: 'Description' },
      { key: 'targetType', label: 'Target', width: '110px' },
      { key: 'frequency', label: 'Frequency', width: '100px' },
      { key: 'planningMethod', label: 'Method', width: '100px' },
      { key: 'dueDate', label: 'Due', width: '110px' },
    ],
    detailTabs: [
      {
        id: 'general', label: 'General', fields: [
          { key: 'jobNo', label: 'Job No.' },
          { key: 'description', label: 'Job Description' },
          { key: 'targetType', label: 'Target Type', type: 'select', options: ['ComponentType', 'Component', 'Function'] },
          { key: 'targetId', label: 'Target', type: 'lookup', lookupKey: 'componentTypes' },
          { key: 'frequency', label: 'Frequency' },
          { key: 'planningMethod', label: 'Planning Method', type: 'select', options: ['Periodic', 'Counter', 'MeasurePoint', 'Trigger'] },
          // 手册 P44：Counters 必须先列在 component/type 上，才能在 jobs 中选用；此字段仅当 Planning Method = Counter 时出现
          { key: 'counterCode', label: 'Counter Code', type: 'lookup', lookupKey: 'componentTypeJobCounters', showIf: { key: 'planningMethod', value: 'Counter' }, placeholder: '仅可选本类型已列计数器' },
          // 手册 P45：Measure Points 必须先列在类型上，才能在 component type jobs 中选用；此字段仅当 Planning Method = MeasurePoint 时出现
          { key: 'measurePointCode', label: 'Measure Point', type: 'lookup', lookupKey: 'componentTypeJobMeasurePoints', showIf: { key: 'planningMethod', value: 'MeasurePoint' }, placeholder: '仅可选本类型已列测点' },
          { key: 'dueDate', label: 'Due Date', type: 'date' },
        ],
      },
      noteTab('scheduling', 'Scheduling', '调度触发条件（周期 / 计数器 / 测点）。'),
      noteTab('parts', 'Parts', '所需备件。'),
      noteTab('disciplines', 'Disciplines', '所需工种。'),
      noteTab('risk', 'Risk Management', '风险管理标志与措施。'),
      noteTab('reporting', 'Reporting Options', '上报要求。'),
    ],
    options: [{ label: 'Spare Booking', action: 'spare-booking' }],
  },

  'component-jobs': {
    windowTitle: 'Component Jobs',
    dataKey: 'jobs',
    statusField: 'status',
    filterBasic: [{ key: 'targetType', label: 'Target', type: 'select', options: ['Component', 'ComponentType', 'Function'] }],
    filterAdvanced: [{ key: 'jobNo', label: 'Job No.', type: 'text' }],
    columns: [
      { key: 'jobNo', label: 'Job No.', width: '120px' },
      { key: 'description', label: 'Description' },
      { key: 'targetType', label: 'Target', width: '110px' },
      { key: 'frequency', label: 'Frequency', width: '100px' },
      { key: 'dueDate', label: 'Due', width: '110px' },
    ],
    detailTabs: [
      {
        id: 'general', label: 'General', fields: [
          { key: 'jobNo', label: 'Job No.' },
          { key: 'description', label: 'Job Description' },
          { key: 'targetId', label: 'Component', type: 'lookup', lookupKey: 'components' },
          { key: 'frequency', label: 'Frequency' },
          { key: 'planningMethod', label: 'Planning Method', type: 'select', options: ['Periodic', 'Counter', 'MeasurePoint', 'Trigger'] },
          // 手册 P44：Counters 必须先列在组件上，才能在 component jobs 中选用；此字段仅当 Planning Method = Counter 时出现
          { key: 'counterCode', label: 'Counter Code', type: 'lookup', lookupKey: 'componentJobCounters', showIf: { key: 'planningMethod', value: 'Counter' }, placeholder: '仅可选本组件已列计数器' },
          // 手册 P45：Measure Points 必须先列在组件上，才能在 component jobs 中选用；此字段仅当 Planning Method = MeasurePoint 时出现
          { key: 'measurePointCode', label: 'Measure Point', type: 'lookup', lookupKey: 'componentJobMeasurePoints', showIf: { key: 'planningMethod', value: 'MeasurePoint' }, placeholder: '仅可选本组件已列测点' },
          { key: 'dueDate', label: 'Due Date', type: 'date' },
        ],
      },
      noteTab('scheduling', 'Scheduling', '调度触发条件。'),
      noteTab('parts', 'Parts', '所需备件。'),
      noteTab('disciplines', 'Disciplines', '所需工种。'),
    ],
    options: [{ label: 'Spare Booking', action: 'spare-booking' }],
  },

  'job-planning': {
    windowTitle: 'Job Planning',
    dataKey: 'jobs',
    statusField: 'status',
    filterBasic: [{ key: 'planningMethod', label: 'Method', type: 'select', options: ['Periodic', 'Counter', 'MeasurePoint', 'Trigger'] }],
    filterAdvanced: [{ key: 'description', label: 'Description', type: 'text' }],
    columns: [
      { key: 'jobNo', label: 'Job No.', width: '120px' },
      { key: 'description', label: 'Description' },
      { key: 'planningMethod', label: 'Method', width: '110px' },
      { key: 'frequency', label: 'Frequency', width: '100px' },
      { key: 'dueDate', label: 'Due', width: '110px' },
    ],
    detailTabs: [
      { id: 'periodic', label: 'Periodic Frequencies', fields: [{ key: '_note', label: '说明', type: 'readonly', value: '按天 / 周 / 月周期调度。' }] },
      { id: 'counters', label: 'Counters', fields: [{ key: '_note', label: '说明', type: 'readonly', value: '按运行小时或计数器触发。' }] },
      { id: 'measure', label: 'Measure Points', fields: [{ key: '_note', label: '说明', type: 'readonly', value: '按测点读数触发。' }] },
      { id: 'triggers', label: 'Triggers', fields: [{ key: '_note', label: '说明', type: 'readonly', value: '由其他作业或状态触发。' }] },
    ],
    options: [{ label: 'Calculate Due Date', action: 'calc-due' }, { label: 'Generate Work Orders', action: 'gen-wo' }],
  },

  rounds: {
    windowTitle: 'Maintenance Rounds',
    dataKey: 'jobs',
    filterBasic: [{ key: 'status', label: 'Status', type: 'text' }],
    filterAdvanced: [{ key: 'jobNo', label: 'Code', type: 'text' }],
    columns: [
      { key: 'jobNo', label: 'Code', width: '120px' },
      { key: 'description', label: 'Description' },
      { key: 'frequency', label: 'Schedule', width: '110px' },
      { key: 'status', label: 'Status', width: '100px', tag: true },
    ],
    detailTabs: [
      { id: 'general', label: 'General', fields: [
        { key: 'description', label: 'Title' },
        { key: 'jobNo', label: 'Code' },
        { key: 'frequency', label: 'Schedule' },
        { key: 'outputFormat', label: 'Output Format', type: 'select', options: ['List', 'Extended List', 'Work Order'] },
        { key: 'historyTemplate', label: 'History Template' },
        { key: 'discipline', label: 'Discipline' },
      ] },
      noteTab('schedule', 'Schedule', '巡检周期设置（Periodic / Triggers）。'),
      noteTab('jobs', 'Jobs', '分配到轮次的作业。'),
      noteTab('triggers', 'Triggers', '轮次可链接的触发条件。'),
      noteTag('reporting', 'Reporting', '上报方式：简单 / 完整。'),
      noteTab('wo', 'Work Orders', '轮次工单。'),
    ],
    options: [{ label: 'Define Round', action: 'define-round' }, { label: 'Generate Round Work Order', action: 'gen-round-wo' }],
  },

  'work-planning': {
    windowTitle: 'Work Planning',
    dataKey: 'workOrders',
    statusField: 'status',
    filterBasic: [{ key: 'status', label: 'Status', type: 'select', options: ['Requested', 'Planned', 'Issued', 'Pending', 'Postponed', 'Cancelled', 'Completed', 'Controlled', 'Filed'] }],
    filterAdvanced: [{ key: 'functionNo', label: 'Function', type: 'text' }],
    columns: [
      { key: 'workOrderNo', label: 'WO No.', width: '130px' },
      { key: 'description', label: 'Description' },
      { key: 'componentId', label: 'Component', width: '110px' },
      { key: 'functionNo', label: 'Function', width: '110px' },
      { key: 'dueDate', label: 'Due', width: '110px' },
      { key: 'status', label: 'Status', width: '100px', tag: true },
    ],
    detailTabs: [
      { id: 'main', label: 'Work Orders', fields: [
        { key: 'workOrderNo', label: 'WO No.' },
        { key: 'description', label: 'Description' },
        { key: 'status', label: 'Status', type: 'select', options: ['Requested', 'Planned', 'Issued', 'Pending', 'Postponed', 'Cancelled', 'Completed', 'Controlled', 'Filed'] },
        { key: 'dueDate', label: 'Due Date', type: 'date' },
      ] },
    ],
    options: [{ label: 'Set Status', action: 'set-status' }, { label: 'Issue Work Orders', action: 'issue-wo' }, { label: 'Adjust Parts', action: 'adjust-parts' }],
  },

  projects: {
    windowTitle: 'Projects',
    dataKey: 'projects',
    statusField: 'status',
    filterBasic: [{ key: 'status', label: 'Status', type: 'select', options: ['Active', 'Closed', 'On Hold'] }],
    filterAdvanced: [{ key: 'projectNo', label: 'Project No.', type: 'text' }],
    columns: [
      { key: 'projectNo', label: 'Project No.', width: '130px' },
      { key: 'title', label: 'Title' },
      { key: 'status', label: 'Status', width: '90px', tag: true },
      { key: 'sections', label: 'Sections', align: 'right', width: '80px' },
      { key: 'cost', label: 'Cost', align: 'right', width: '100px' },
    ],
    detailTabs: [
      { id: 'general', label: 'General', fields: [{ key: 'projectNo', label: 'Project No.' }, { key: 'title', label: 'Title' }, { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Closed', 'On Hold'] }] },
      noteTab('sections', 'Sections', '项目分段。'),
      noteTab('access', 'Access Control', '访问控制。'),
      noteTab('jobs', 'Jobs', '项目作业。'),
      noteTab('wo', 'Work Orders', '项目工单。'),
      noteTab('sub', 'Sub-Contracting', '分包管理。'),
      noteTab('costs', 'Costs', '成本归集。'),
    ],
    options: [{ label: 'Add Section', action: 'add-section' }, { label: 'Generate Project Work Orders', action: 'gen-proj-wo' }],
  },

  'report-work': {
    windowTitle: 'Report Work',
    dataKey: 'workOrders',
    statusField: 'status',
    // 指南（手册 2，Reporting Work）：仅可对状态为 Issued 或 Started 的工单上报
    filterBasic: [{ key: 'status', label: 'Status', type: 'select', options: ['Issued', 'Started'] }],
    filterAdvanced: [{ key: 'workOrderNo', label: 'WO No.', type: 'text' }],
    columns: [
      { key: 'workOrderNo', label: 'WO No.', width: '130px' },
      { key: 'description', label: 'Description' },
      { key: 'status', label: 'Status', width: '100px', tag: true },
      { key: 'dueDate', label: 'Due', width: '110px' },
    ],
    detailTabs: [
      { id: 'general', label: 'General', fields: [
        { key: 'workOrderNo', label: 'WO No.' },
        { key: 'description', label: 'Description' },
        { key: 'status', label: 'Status', type: 'select', options: ['Issued', 'Started', 'Completed'] },
        { key: 'componentId', label: 'Component' },
        { key: 'functionNo', label: 'Function' },
        { key: 'priority', label: 'Priority' },
      ] },
      noteTab('resources', 'Resources Used', '人工 / 工时 / 工种。'),
      noteTab('stock', 'Stock Used', '消耗备件。'),
      noteTab('history', 'History', '维修历史描述。'),
      noteTab('measure', 'Measure Points', '执行时测点读数。'),
      noteTab('permit', 'Work Permit', '作业许可。'),
      noteTab('related', 'Related Jobs', '关联或依赖作业。'),
    ],
    options: [{ label: 'Complete Work Order', action: 'complete-wo' }, { label: 'Report Overdue', action: 'report-overdue' }],
  },

  'update-counters': {
    windowTitle: 'Update Counters',
    dataKey: 'counterLogs',
    filterBasic: [{ key: 'function', label: 'Function（按功能位置查找）', type: 'text' }],
    filterAdvanced: [{ key: 'component', label: 'Component', type: 'text' }],
    columns: [
      { key: 'component', label: 'Component', width: '110px' },
      { key: 'function', label: 'Function', width: '110px' },
      { key: 'counter', label: 'Counter', width: '120px' },
      { key: 'currentValue', label: 'Current', align: 'right', width: '90px' },
      { key: 'newValue', label: 'New', align: 'right', width: '90px' },
      { key: 'unit', label: 'Unit', width: '70px' },
      { key: 'readingDate', label: 'Date Read', width: '110px' },
    ],
    detailTabs: [
      { id: 'general', label: 'General', fields: [
        { key: 'component', label: 'Component', type: 'lookup', lookupKey: 'components' },
        { key: 'function', label: 'Function', type: 'lookup', lookupKey: 'functions' },
        { key: 'counter', label: 'Counter Code' },
        { key: 'currentValue', label: 'Current Value（总计值）', type: 'number' },
        { key: 'newValue', label: 'New Reading', type: 'number' },
        { key: 'unit', label: 'Unit' },
        { key: 'readingDate', label: 'Date Read', type: 'date' },
      ] },
      { id: 'note', label: 'Note', fields: [{ key: '_note', label: '说明', type: 'readonly', value: 'Current Value 为总计值：AMOS 中凡与 HOUR 工单相关之处均取总计值。建议更新前先打印当前计数器并核对。' }] },
    ],
    options: [],
  },

  'update-measure-points': {
    windowTitle: 'Update Measure Points',
    dataKey: 'measureLogs',
    filterBasic: [{ key: 'function', label: 'Function', type: 'text' }],
    filterAdvanced: [{ key: 'measurePoint', label: 'Measure Point', type: 'text' }],
    columns: [
      { key: 'component', label: 'Component', width: '110px' },
      { key: 'measurePoint', label: 'Measure Point', width: '130px' },
      { key: 'value', label: 'Value', align: 'right', width: '90px' },
      { key: 'trend', label: 'Trend', width: '90px', tag: true },
      { key: 'readingDate', label: 'Date', width: '110px' },
    ],
    detailTabs: [
      { id: 'general', label: 'General', fields: [
        { key: 'component', label: 'Component', type: 'lookup', lookupKey: 'components' },
        { key: 'measurePoint', label: 'Measure Point' },
        { key: 'value', label: 'Value', type: 'number' },
        { key: 'trend', label: 'Trend', type: 'select', options: ['Up', 'Down', 'Stable'] },
        { key: 'readingDate', label: 'Reading Date', type: 'date' },
      ] },
      noteTab('trends', 'Trends', '测点读数趋势图（完整系统中展示）。'),
    ],
    options: [],
  },

  'maintenance-history': {
    windowTitle: 'Maintenance History',
    dataKey: 'maintenanceLog',
    filterBasic: [{ key: 'jobState', label: 'Job State', type: 'select', options: ['Completed', 'PartlyDone'] }],
    filterAdvanced: [{ key: 'workOrder', label: 'WO No.', type: 'text' }],
    columns: [
      { key: 'date', label: 'Date', width: '110px' },
      { key: 'workOrder', label: 'WO No.', width: '120px' },
      { key: 'job', label: 'Job', width: '90px' },
      { key: 'jobState', label: 'State', width: '100px', tag: true },
      { key: 'reportedBy', label: 'Reported By', width: '110px' },
    ],
    detailTabs: [{ id: 'history', label: 'History', fields: [
      { key: 'date', label: 'Date' }, { key: 'workOrder', label: 'WO No.' }, { key: 'job', label: 'Job' },
      { key: 'jobState', label: 'Job State', type: 'select', options: ['Completed', 'PartlyDone'] },
      { key: 'reportedBy', label: 'Reported By' }, { key: 'text', label: 'History Text', type: 'textarea' },
    ] }],
    options: [],
  },

  'maintenance-log': {
    windowTitle: 'Maintenance Log',
    dataKey: 'maintenanceLog',
    filterBasic: [{ key: 'jobState', label: 'Job State', type: 'select', options: ['Completed', 'PartlyDone'] }],
    filterAdvanced: [{ key: 'workOrder', label: 'WO No.', type: 'text' }],
    columns: [
      { key: 'date', label: 'Date', width: '110px' },
      { key: 'workOrder', label: 'WO No.', width: '120px' },
      { key: 'job', label: 'Job', width: '90px' },
      { key: 'reportedBy', label: 'Reported By', width: '110px' },
      { key: 'text', label: 'Text' },
    ],
    detailTabs: [{ id: 'log', label: 'Log', fields: [
      { key: 'date', label: 'Date' }, { key: 'workOrder', label: 'WO No.' }, { key: 'job', label: 'Job' },
      { key: 'jobState', label: 'Job State', type: 'select', options: ['Completed', 'PartlyDone'] },
      { key: 'reportedBy', label: 'Reported By' }, { key: 'text', label: 'Log Text', type: 'textarea' },
    ] }],
    options: [],
  },

  'stock-types': {
    windowTitle: 'Stock Types',
    dataKey: 'stockTypes',
    statusField: 'status',
    statusOptions: ['Active', 'Obsolete', 'Scrapped'],
    filterBasic: [{ key: 'status', label: 'Status', type: 'select', options: ['Active', 'Obsolete', 'Scrapped'] }, { key: 'maker', label: 'Maker', type: 'text' }],
    filterAdvanced: [{ key: 'stockTypeNo', label: 'Stock Type No.', type: 'text' }],
    columns: [
      { key: 'stockTypeNo', label: 'Stock Type No.', width: '130px' },
      { key: 'description', label: 'Description' },
      { key: 'maker', label: 'Maker', width: '110px' },
      { key: 'unit', label: 'Unit', width: '70px' },
      { key: 'bestPrice', label: 'Best Price', align: 'right', width: '90px' },
      { key: 'status', label: 'Status', width: '90px', tag: true },
    ],
    detailTabs: [
      { id: 'general', label: 'General', fields: [
        { key: 'stockTypeNo', label: 'Stock Type No.' },
        { key: 'description', label: 'Description' },
        { key: 'maker', label: 'Maker' },
        { key: 'vendor', label: 'Vendor' },
        { key: 'grade', label: 'Grade' },
        { key: 'unit', label: 'Unit' },
        { key: 'bestPrice', label: 'Best Purchase Price', type: 'number' },
        { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Obsolete', 'Scrapped'] },
      ] },
      noteTab('makers', 'Makers', '制造商列表。'),
      noteTab('vendors', 'Vendors', '供应商列表。'),
      noteTab('grades', 'Grades', '等级。'),
      noteTab('ctypes', 'Component Types', '关联组件类型。'),
      noteTab('ph', 'Purchase History', '采购历史。'),
    ],
    options: [{ label: 'Register as Stock Item', action: 'register-stock' }, { label: 'Set Status', action: 'set-status' }],
  },

  transactions: {
    windowTitle: 'Stock Transactions',
    dataKey: 'transactions',
    filterBasic: [{ key: 'type', label: 'Type', type: 'select', options: ['In', 'Out', 'Move', 'Transferred In', 'Transferred Out', 'Reverse'] }],
    filterAdvanced: [{ key: 'stockItem', label: 'Stock Item', type: 'text' }],
    columns: [
      { key: 'transactionNo', label: 'TX No.', width: '120px' },
      { key: 'type', label: 'Type', width: '80px', tag: true },
      { key: 'stockItem', label: 'Stock Item', width: '110px' },
      { key: 'quantity', label: 'Qty', align: 'right', width: '70px' },
      { key: 'fromLocation', label: 'From', width: '110px' },
      { key: 'toLocation', label: 'To', width: '110px' },
      { key: 'date', label: 'Date', width: '110px' },
    ],
    detailTabs: [{ id: 'general', label: 'General', fields: [
      { key: 'transactionNo', label: 'TX No.' },
      { key: 'type', label: 'Type', type: 'select', options: ['In', 'Out', 'Move', 'Transferred In', 'Transferred Out', 'Reverse'] },
      { key: 'stockItem', label: 'Stock Item', type: 'lookup', lookupKey: 'stockItems' },
      { key: 'quantity', label: 'Quantity', type: 'number' },
      { key: 'fromLocation', label: 'From Location' },
      { key: 'toLocation', label: 'To Location' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'reference', label: 'Reference' },
    ] }],
    options: [{ label: 'Reverse Transaction', action: 'reverse-tx' }],
  },

  'transfer-documents': {
    windowTitle: 'Transfer Documents',
    dataKey: 'transferDocs',
    statusField: 'status',
    statusOptions: ['Created', 'Submitted', 'Approved', 'PartlyTransferred', 'Transferred', 'In Transit', 'Received'],
    filterBasic: [{ key: 'status', label: 'Status', type: 'select', options: ['Created', 'Submitted', 'Approved', 'PartlyTransferred', 'Transferred', 'In Transit', 'Received'] }],
    filterAdvanced: [{ key: 'docNo', label: 'Doc No.', type: 'text' }],
    columns: [
      { key: 'docNo', label: 'Doc No.', width: '120px' },
      { key: 'fromLocation', label: 'From', width: '110px' },
      { key: 'toLocation', label: 'To', width: '110px' },
      { key: 'items', label: 'Items', align: 'right', width: '70px' },
      { key: 'status', label: 'Status', width: '100px', tag: true },
    ],
    detailTabs: [
      { id: 'general', label: 'General', fields: [
        { key: 'docNo', label: 'Doc No.' },
        { key: 'fromLocation', label: 'From Location' },
        { key: 'toLocation', label: 'To Location' },
        { key: 'status', label: 'Status', type: 'select', options: ['Created', 'Submitted', 'Approved', 'PartlyTransferred', 'Transferred', 'In Transit', 'Received'] },
        { key: 'created', label: 'Created', type: 'date' },
      ] },
      noteTab('items', 'Items', '需转移的库存项。'),
      noteTab('approval', 'Approval', '审批。'),
      noteTab('transfer', 'Transfer', '转移执行。'),
      noteTab('receiving', 'Receiving', '接收。'),
    ],
    options: [{ label: 'Submit', action: 'submit' }, { label: 'Approve', action: 'approve' }, { label: 'Transfer Items', action: 'transfer' }, { label: 'Receive', action: 'receive' }],
  },

  'stock-control': {
    windowTitle: 'Stock Control',
    dataKey: 'stockItems',
    statusField: 'status',
    filterBasic: [{ key: 'status', label: 'Status', type: 'select', options: ['Active', 'Obsolete', 'Scrapped'] }],
    filterAdvanced: [{ key: 'stockTypeNo', label: 'Stock Type', type: 'text' }],
    columns: [
      { key: 'stockItemNo', label: 'Item No.', width: '110px' },
      { key: 'description', label: 'Description' },
      { key: 'quantity', label: 'Qty', align: 'right', width: '70px' },
      { key: 'location', label: 'Location', width: '110px' },
      { key: 'status', label: 'Status', width: '100px', tag: true },
    ],
    detailTabs: [{ id: 'general', label: 'General', fields: [
      { key: 'stockItemNo', label: 'Item No.' },
      { key: 'description', label: 'Description' },
      { key: 'quantity', label: 'Quantity', type: 'number' },
      { key: 'location', label: 'Location' },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Obsolete', 'Scrapped'] },
    ] }],
    options: [{ label: 'Set Status', action: 'set-status' }],
  },

  quotations: {
    windowTitle: 'Quotations',
    dataKey: 'quotations',
    filterBasic: [],
    filterAdvanced: [{ key: 'formNo', label: 'Query Form', type: 'text' }],
    columns: [
      { key: 'formNo', label: 'Query Form', width: '120px' },
      { key: 'vendor', label: 'Vendor' },
      { key: 'unitPrice', label: 'Unit Price', align: 'right', width: '100px' },
      { key: 'discount', label: 'Disc%', align: 'right', width: '70px' },
      { key: 'deliveryDays', label: 'Days', align: 'right', width: '70px' },
      { key: 'currency', label: 'Cur', width: '60px' },
    ],
    detailTabs: [{ id: 'general', label: 'General', fields: [
      { key: 'formNo', label: 'Query Form' },
      { key: 'vendor', label: 'Vendor' },
      { key: 'unitPrice', label: 'Unit Price', type: 'number' },
      { key: 'discount', label: 'Discount %', type: 'number' },
      { key: 'deliveryDays', label: 'Delivery Days', type: 'number' },
      { key: 'currency', label: 'Currency' },
      { key: 'note', label: 'Note', type: 'textarea' },
    ] }],
    options: [{ label: 'Add Quotation', action: 'add-quotation' }, { label: 'Print', action: 'print' }],
  },

  deliveries: {
    windowTitle: 'Deliveries',
    dataKey: 'deliveries',
    statusField: 'status',
    statusOptions: ['In Transit', 'Partly Received', 'Received', 'Rejected'],
    filterBasic: [{ key: 'status', label: 'Status', type: 'select', options: ['In Transit', 'Partly Received', 'Received', 'Rejected'] }],
    filterAdvanced: [{ key: 'formNo', label: 'PO Form', type: 'text' }],
    columns: [
      { key: 'deliveryNo', label: 'Delivery No.', width: '120px' },
      { key: 'formNo', label: 'PO Form', width: '120px' },
      { key: 'lineItems', label: 'Items', align: 'right', width: '70px' },
      { key: 'intermediate', label: 'Intermediate', width: '110px' },
      { key: 'status', label: 'Status', width: '110px', tag: true },
    ],
    detailTabs: [
      { id: 'general', label: 'General', fields: [
        { key: 'deliveryNo', label: 'Delivery No.' },
        { key: 'formNo', label: 'PO Form' },
        { key: 'status', label: 'Status', type: 'select', options: ['In Transit', 'Partly Received', 'Received', 'Rejected'] },
        { key: 'date', label: 'Date', type: 'date' },
      ] },
      noteTab('items', 'Line Items', '逐行到货数量。'),
      noteTab('inter', 'Intermediate Locations', '中转地点。'),
    ],
    options: [{ label: 'Register Delivery', action: 'register-delivery' }, { label: 'Receive', action: 'receive' }],
  },

  'transport-documents': {
    windowTitle: 'Transport Documents',
    dataKey: 'transportDocs',
    filterBasic: [],
    filterAdvanced: [{ key: 'docNo', label: 'Doc No.', type: 'text' }],
    columns: [
      { key: 'docNo', label: 'Doc No.', width: '120px' },
      { key: 'deliveries', label: 'Deliveries', width: '110px' },
      { key: 'intermediate', label: 'Intermediate', width: '110px' },
      { key: 'status', label: 'Status', width: '110px', tag: true },
    ],
    detailTabs: [
      { id: 'general', label: 'General', fields: [{ key: 'docNo', label: 'Doc No.' }, { key: 'status', label: 'Status' }] },
      noteTab('deliveries', 'Deliveries', '关联交付。'),
      noteTab('inter', 'Intermediate Locations', '中转地点更新。'),
    ],
    options: [{ label: 'Add Deliveries', action: 'add-deliveries' }, { label: 'Update Location', action: 'update-loc' }],
  },

  'quality-checks': {
    windowTitle: 'Quality Checks',
    dataKey: 'qualityChecks',
    statusField: 'status',
    statusOptions: ['Open', 'Passed', 'Rejected', 'Claimed'],
    filterBasic: [{ key: 'status', label: 'Status', type: 'select', options: ['Open', 'Passed', 'Rejected', 'Claimed'] }],
    filterAdvanced: [{ key: 'formNo', label: 'Form', type: 'text' }],
    columns: [
      { key: 'checkNo', label: 'Check No.', width: '120px' },
      { key: 'formNo', label: 'Form', width: '120px' },
      { key: 'result', label: 'Result', width: '90px' },
      { key: 'claim', label: 'Claim', width: '70px' },
      { key: 'status', label: 'Status', width: '100px', tag: true },
    ],
    detailTabs: [
      { id: 'general', label: 'General', fields: [
        { key: 'checkNo', label: 'Check No.' },
        { key: 'formNo', label: 'Form' },
        { key: 'status', label: 'Status', type: 'select', options: ['Open', 'Passed', 'Rejected', 'Claimed'] },
        { key: 'result', label: 'Result', type: 'select', options: ['Accept', 'Reject', ''] },
        { key: 'claim', label: 'Claim', type: 'select', options: ['Yes', 'No'] },
        { key: 'date', label: 'Date', type: 'date' },
      ] },
      noteTab('items', 'Items', '受检条目。'),
      noteTab('result', 'Result', '检查结果。'),
      noteTab('claim', 'Claim', '索赔。'),
      noteTab('return', 'Return Items', '退回报废项。'),
    ],
    options: [{ label: 'Accept', action: 'accept' }, { label: 'Reject', action: 'reject' }, { label: 'Escalate to Claim', action: 'escalate' }],
  },

  contracts: {
    windowTitle: 'Contracts',
    dataKey: 'contracts',
    statusField: 'status',
    statusOptions: ['Draft', 'Approved', 'Issued'],
    filterBasic: [{ key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Approved', 'Issued'] }, { key: 'vendor', label: 'Vendor', type: 'text' }],
    filterAdvanced: [{ key: 'contractNo', label: 'Contract No.', type: 'text' }],
    columns: [
      { key: 'contractNo', label: 'Contract No.', width: '130px' },
      { key: 'title', label: 'Title' },
      { key: 'vendor', label: 'Vendor', width: '120px' },
      { key: 'status', label: 'Status', width: '90px', tag: true },
    ],
    detailTabs: [
      { id: 'general', label: 'General', fields: [
        { key: 'contractNo', label: 'Contract No.' },
        { key: 'title', label: 'Title' },
        { key: 'vendor', label: 'Vendor' },
        { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Approved', 'Issued'] },
        { key: 'discount', label: 'Discount' },
        { key: 'deliveryZone', label: 'Delivery Zone' },
        { key: 'priceMatrix', label: 'Price Matrix' },
      ] },
      noteTab('discounts', 'Discounts', '各级别折扣。'),
      noteTab('zones', 'Delivery Zones', '交付区域。'),
      noteTab('groups', 'Product Groups', '产品组。'),
      noteTab('matrix', 'Price Matrix', '按产品组与地点维护价格。'),
      noteTab('items', 'Contract Items', '合同物料。'),
    ],
    options: [{ label: 'Approve', action: 'approve' }, { label: 'Issue', action: 'issue' }, { label: 'Create Price Matrix', action: 'price-matrix' }],
  },

  'custom-clearance-forms': {
    windowTitle: 'Custom Clearance Forms',
    dataKey: 'deliveries',
    filterBasic: [],
    filterAdvanced: [{ key: 'deliveryNo', label: 'Delivery', type: 'text' }],
    columns: [
      { key: 'deliveryNo', label: 'Delivery No.', width: '120px' },
      { key: 'formNo', label: 'PO Form', width: '120px' },
      { key: 'status', label: 'Status', width: '110px', tag: true },
    ],
    detailTabs: [
      { id: 'general', label: 'General', fields: [{ key: 'deliveryNo', label: 'Delivery No.' }, { key: 'formNo', label: 'PO Form' }] },
      noteTab('details', 'Details', '清关明细。'),
      noteTab('forms', 'Forms', '关联单据。'),
      noteTab('expenses', 'Expenses', '费用。'),
      noteTab('items', 'Items', '物品。'),
    ],
    options: [{ label: 'New Form', action: 'new-form' }, { label: 'Finalise Item', action: 'finalise' }],
  },
}

// 小工具：生成带说明的标签页（避免重复）
function noteTag(id, label, text) {
  return noteTab(id, label, text)
}
