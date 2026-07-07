// 系统管理模拟数据：用户、角色、流程、审计、监控、告警、报告、采购

export const users = [
  { id: 'U001', account: 'zhang.eng', name: '张工', department: '机务部', role: '岸基机务人员', status: '启用', lastLogin: '2026-07-07 08:50', email: 'zhang@hg.com' },
  { id: 'U002', account: 'chen.sea', name: '陈海', department: '船端-HG01', role: '船端一线作业人员', status: '启用', lastLogin: '2026-07-07 06:30', email: 'chen@hg.com' },
  { id: 'U003', account: 'lin.dispatch', name: '林涛', department: '调度中心', role: '船舶管理人员', status: '启用', lastLogin: '2026-07-07 07:00', email: 'lin@hg.com' },
  { id: 'U004', account: 'admin', name: '系统管理员', department: '信息技术部', role: '系统管理员', status: '启用', lastLogin: '2026-07-07 09:10', email: 'admin@hg.com' },
  { id: 'U005', account: 'ma.proc', name: '马力', department: '采办部', role: '采办协同人员', status: '启用', lastLogin: '2026-07-06 17:00', email: 'ma@hg.com' },
  { id: 'U006', account: 'wang.audit', name: '王审', department: '审计合规部', role: '审计员', status: '启用', lastLogin: '2026-07-06 16:20', email: 'wang.audit@hg.com' },
  { id: 'U007', account: 'liu.sea', name: '刘洋', department: '船端-HG01', role: '船端一线作业人员', status: '禁用', lastLogin: '2026-06-28 19:00', email: 'liu@hg.com' },
  { id: 'U008', account: 'zhao.sea', name: '赵峰', department: '船端-HG02', role: '船端一线作业人员', status: '启用', lastLogin: '2026-07-05 18:00', email: 'zhao@hg.com' },
]

export const roles = [
  { roleId: 'R01', roleName: '岸基机务人员', description: '设备维保计划与工单审核', userCount: 3, permissions: { maintenance: ['view', 'edit', 'approve'], voyage: ['view', 'execute'], workorder: ['view', 'approve', 'export'], sync: ['view'], procurement: ['view'], admin: [], monitor: ['view'], audit: ['view'] } },
  { roleId: 'R02', roleName: '船舶管理人员', description: '船舶运行监控与调度', userCount: 2, permissions: { maintenance: ['view'], voyage: ['view', 'execute'], workorder: ['view'], ship: ['view', 'edit', 'dispatch'], sync: ['view', 'execute', 'resolve'], admin: [], monitor: ['view'], audit: ['view'] } },
  { roleId: 'R03', roleName: '船端一线作业人员', description: '移动端工单执行与物资盘点', userCount: 8, permissions: { mobile: ['view', 'execute', 'offline'], inventory: ['view', 'execute', 'scan'], sync: ['view'], maintenance: [], workorder: ['execute'], admin: [], audit: [] } },
  { roleId: 'R04', roleName: '系统管理员', description: '组织权限与流程配置', userCount: 1, permissions: { admin: ['view', 'edit', 'publish', 'simulate'], monitor: ['view', 'edit', 'resolve'], audit: ['view', 'export'], maintenance: ['view'], voyage: ['view'], sync: ['view'] } },
  { roleId: 'R05', roleName: '审计员', description: '合规审查与日志导出', userCount: 1, permissions: { audit: ['view', 'mark', 'export'], monitor: ['view'], admin: ['view'], sync: ['view'], maintenance: ['view'], procurement: ['view'] } },
  { roleId: 'R06', roleName: '采办协同人员', description: '采购申请与到货验收', userCount: 1, permissions: { procurement: ['view', 'edit', 'approve', 'receipt'], inventory: ['view'], audit: ['view'] } },
]

export const permissionModules = [
  { key: 'maintenance', label: '设备维保计划', ops: ['view', 'edit', 'approve', 'export'] },
  { key: 'voyage', label: '航前健康校验', ops: ['view', 'execute', 'export'] },
  { key: 'workorder', label: '工单审核闭环', ops: ['view', 'execute', 'approve', 'export'] },
  { key: 'ship', label: '船舶运行调度', ops: ['view', 'edit', 'dispatch'] },
  { key: 'sync', label: '船岸数据同步', ops: ['view', 'execute', 'resolve', 'export'] },
  { key: 'inventory', label: '物资扫码盘点', ops: ['view', 'execute', 'scan'] },
  { key: 'admin', label: '权限流程配置', ops: ['view', 'edit', 'publish', 'simulate'] },
  { key: 'monitor', label: '系统监控审计', ops: ['view', 'edit', 'resolve', 'export'] },
  { key: 'audit', label: '审计日志', ops: ['view', 'mark', 'export'] },
  { key: 'procurement', label: '采购验收协同', ops: ['view', 'edit', 'approve', 'receipt'] },
]

export const workflows = [
  { id: 'WF-01', processType: '维保计划审批', canvasData: ['提交申请', '机务初审', '机务主任终审', '生效归档'], approvers: ['机务主管', '机务主任'], timeoutRule: '48小时未处理自动催办', transferRule: '可转交同级人员', versionLabel: 'v2.1', status: '已发布', updatedAt: '2026-06-20' },
  { id: 'WF-02', processType: '工单审核流转', canvasData: ['船端报工', '机务审核', '异常退回整改', '闭环归档'], approvers: ['轮机长', '机务主管'], timeoutRule: '24小时未审核升级', transferRule: '可转交机务主任', versionLabel: 'v1.3', status: '已发布', updatedAt: '2026-06-15' },
  { id: 'WF-03', processType: '航前健康豁免审批', canvasData: ['发起豁免', '机务评估', '船级社备案', '批准/驳回'], approvers: ['机务主管', '船级社联络员'], timeoutRule: '72小时', transferRule: '不可转交', versionLabel: 'v1.0', status: '草稿', updatedAt: '2026-07-01' },
]

export const configAuditLogs = [
  { id: 'ALOG-201', operator: '系统管理员', operationType: '权限修改', objectType: '角色', detail: '审计员角色新增 audit.mark 权限', timestamp: '2026-07-06 15:30', before: 'audit: [view, export]', after: 'audit: [view, mark, export]' },
  { id: 'ALOG-200', operator: '系统管理员', operationType: '流程发布', objectType: '审批流程', detail: '工单审核流转 v1.3 发布', timestamp: '2026-06-15 10:00', before: 'v1.2', after: 'v1.3' },
  { id: 'ALOG-199', operator: '系统管理员', operationType: '用户新增', objectType: '用户', detail: '新增用户 zhao.sea (船端-HG02)', timestamp: '2026-06-10 09:20', before: null, after: 'U008 赵峰' },
  { id: 'ALOG-198', operator: '系统管理员', operationType: '用户禁用', objectType: '用户', detail: '禁用用户 liu.sea', timestamp: '2026-06-29 14:00', before: '启用', after: '禁用' },
]

export const monitorOverview = {
  healthScore: 94,
  keyIndicators: [
    { label: 'CPU使用率', value: '38%', tone: 'ok' },
    { label: '内存使用率', value: '62%', tone: 'ok' },
    { label: '磁盘使用率', value: '71%', tone: 'warn' },
    { label: 'API平均响应', value: '128ms', tone: 'ok' },
    { label: '在线用户', value: 23, tone: 'ok' },
    { label: '今日请求数', value: '12.4万', tone: 'ok' },
  ],
  moduleMetrics: [
    { module: '设备维保', status: '正常', uptime: '99.98%', latency: '96ms' },
    { module: '航前健康', status: '正常', uptime: '99.95%', latency: '110ms' },
    { module: '工单引擎', status: '正常', uptime: '99.99%', latency: '85ms' },
    { module: '船岸同步', status: '降级', uptime: '97.20%', latency: '420ms' },
    { module: '物资库存', status: '正常', uptime: '99.97%', latency: '92ms' },
    { module: '权限中心', status: '正常', uptime: '100%', latency: '64ms' },
  ],
  alertSummary: { critical: 1, major: 2, minor: 4, info: 3 },
}

export const alerts = [
  { alertId: 'ALT-301', severity: '紧急', type: '同步服务', message: 'HG-03 船岸同步服务连续3次心跳超时', occurTime: '2026-07-07 06:35', status: '处置中', handler: '系统管理员', resolveNote: '' },
  { alertId: 'ALT-300', severity: '主要', type: '磁盘空间', message: '数据库服务器磁盘使用率71%，预计7天内告警', occurTime: '2026-07-07 05:00', status: '处置中', handler: '系统管理员', resolveNote: '已申请扩容' },
  { alertId: 'ALT-299', severity: '主要', type: '证书临期', message: 'SSL证书将于14天后到期', occurTime: '2026-07-06 22:00', status: '待处置', handler: null, resolveNote: '' },
  { alertId: 'ALT-298', severity: '次要', type: 'API延迟', message: '物资查询接口P95延迟达680ms', occurTime: '2026-07-06 16:20', status: '已闭环', handler: '系统管理员', resolveNote: '已优化索引' },
  { alertId: 'ALT-297', severity: '次要', type: '登录异常', message: '账号 liu.sea 连续5次登录失败', occurTime: '2026-07-05 20:10', status: '已闭环', handler: '系统管理员', resolveNote: '已禁用账号' },
  { alertId: 'ALT-296', severity: '提示', type: '备份完成', message: '每日全量备份完成，大小18.2GB', occurTime: '2026-07-07 03:00', status: '已闭环', handler: '系统', resolveNote: '自动完成' },
]

export const operationLogs = [
  { id: 'OLOG-5001', operator: '机务主管 张工', operationType: '审批', objectType: '维保计划', detail: '通过 PLN-2026-004 舵机液压站计划', timestamp: '2026-07-06 10:30', ip: '10.2.1.34', compliant: true },
  { id: 'OLOG-5000', operator: '轮机长 陈海', operationType: '提交', objectType: '工单报工', detail: '提交 WO-2026-1201 报工数据', timestamp: '2026-07-06 16:20', ip: '10.5.3.12(船端)', compliant: true },
  { id: 'OLOG-4999', operator: '机务主管 张工', operationType: '退回', objectType: '工单', detail: '退回 WO-2026-1198，要求整改渗漏', timestamp: '2026-07-05 18:30', ip: '10.2.1.34', compliant: true },
  { id: 'OLOG-4998', operator: '调度主任 林涛', operationType: '下发', objectType: '调度指令', detail: '下发 CMD-2026-031 至 HG-01', timestamp: '2026-07-06 20:00', ip: '10.2.2.10', compliant: true },
  { id: 'OLOG-4997', operator: '系统管理员', operationType: '配置', objectType: '角色权限', detail: '修改审计员角色权限', timestamp: '2026-07-06 15:30', ip: '10.2.1.2', compliant: true },
  { id: 'OLOG-4996', operator: '未知账号', operationType: '登录', objectType: '认证', detail: '连续5次登录失败', timestamp: '2026-07-05 20:10', ip: '203.0.113.55', compliant: false },
  { id: 'OLOG-4995', operator: '采办协同 马力', operationType: '验收', objectType: '采购物资', detail: 'PO-2026-118 燃油滤芯验收合格入库', timestamp: '2026-07-06 10:00', ip: '10.2.4.8', compliant: true },
  { id: 'OLOG-4994', operator: '船舶管理员 孙莉', operationType: '忽略', objectType: '同步任务', detail: '忽略 SYNC-5001 旧版附件', timestamp: '2026-07-06 23:10', ip: '10.2.2.5', compliant: false },
]

export const reportTemplates = [
  { id: 'TPL-01', name: '月度运维合规报告', category: '合规', description: '含维保执行率、工单闭环率、审计摘要', fields: ['维保执行率', '工单闭环率', '异常工单', '审计摘要'] },
  { id: 'TPL-02', name: '船级社审查报告', category: '审查', description: 'ISM规则合规性、证书清单、缺陷整改', fields: ['ISM合规', '证书清单', '缺陷整改', '开航记录'] },
  { id: 'TPL-03', name: '系统运维健康报告', category: '运维', description: '系统监控指标、告警统计、同步健康度', fields: ['健康度', '告警统计', '同步健康', '模块状态'] },
  { id: 'TPL-04', name: '船岸同步审计报告', category: '审计', description: '同步成功率、冲突处理、异常追溯', fields: ['同步成功率', '冲突处理', '异常追溯'] },
]

export const reportTasks = [
  { taskId: 'RPT-021', templateId: 'TPL-01', templateName: '月度运维合规报告', period: '2026-06', status: '已完成', progress: 100, generatedAt: '2026-07-01 02:00', downloadUrl: '#', size: '2.3MB' },
  { taskId: 'RPT-020', templateId: 'TPL-03', templateName: '系统运维健康报告', period: '2026-06', status: '已完成', progress: 100, generatedAt: '2026-07-01 01:30', downloadUrl: '#', size: '1.1MB' },
  { taskId: 'RPT-019', templateId: 'TPL-02', templateName: '船级社审查报告', period: '2026上半年', status: '生成中', progress: 65, generatedAt: null, downloadUrl: null, size: null },
  { taskId: 'RPT-018', templateId: 'TPL-04', templateName: '船岸同步审计报告', period: '2026-06', status: '已完成', progress: 100, generatedAt: '2026-07-02 03:00', downloadUrl: '#', size: '0.8MB' },
]

export const procurementRequirements = [
  { id: 'PR-2026-061', source: '库存预警', materialCode: 'FP-SEAL-01', materialName: '机械密封', bomRef: 'EQ-FP-001 消防泵', requiredQty: 5, unit: '件', budgetRef: 'Q3维保预算', budgetOk: true, estimatedCost: 2500, status: '待审核', urgency: '高', generatedAt: '2026-07-06 22:00' },
  { id: 'PR-2026-060', source: '工单需求', materialCode: 'FP-200', materialName: '燃油滤芯', bomRef: 'EQ-ME-FP-001 主机燃油泵', requiredQty: 10, unit: '件', budgetRef: 'Q3维保预算', budgetOk: true, estimatedCost: 2400, status: '待审核', urgency: '中', generatedAt: '2026-07-05 14:00' },
  { id: 'PR-2026-059', source: '库存预警', materialCode: 'GSKT-08', materialName: '密封垫片 8mm', bomRef: '通用', requiredQty: 20, unit: '片', budgetRef: 'Q3维保预算', budgetOk: false, estimatedCost: 800, status: '待审核', urgency: '低', generatedAt: '2026-07-05 09:00' },
  { id: 'PR-2026-058', source: '工单需求', materialCode: 'OIL-HYD-46', materialName: '液压油 46号', bomRef: 'EQ-RUD-001 舵机液压站', requiredQty: 60, unit: '升', budgetRef: 'Q3维保预算', budgetOk: true, estimatedCost: 2880, status: '已转采购', urgency: '中', generatedAt: '2026-07-03 10:00' },
]

export const procurementOrders = [
  { orderNo: 'PO-2026-118', supplier: '中海物资', status: '已到货', items: [{ name: '燃油滤芯 FP-200', qty: 20, unit: '件' }], expectedDelivery: '2026-07-06', actualDelivery: '2026-07-06', amount: 4800, attachmentFileIds: ['PO118-1'], relatedReq: 'PR-2026-060', inspectionStatus: '已验收合格' },
  { orderNo: 'PO-2026-115', supplier: '远东密封', status: '部分到货', items: [{ name: '机械密封 FP-SEAL-01', qty: 10, unit: '件' }], expectedDelivery: '2026-07-05', actualDelivery: '2026-07-05', amount: 5000, attachmentFileIds: ['PO115-1'], relatedReq: 'PR-2026-061', inspectionStatus: '部分退换货' },
  { orderNo: 'PO-2026-110', supplier: '壳牌润滑油', status: '已到货', items: [{ name: '液压油 46号', qty: 200, unit: '升' }], expectedDelivery: '2026-07-03', actualDelivery: '2026-07-03', amount: 9600, attachmentFileIds: ['PO110-1', 'PO110-2'], relatedReq: 'PR-2026-058', inspectionStatus: '已验收合格' },
  { orderNo: 'PO-2026-121', supplier: '紧固件供应中心', status: '采购中', items: [{ name: '不锈钢螺栓 M10', qty: 500, unit: '颗' }], expectedDelivery: '2026-07-12', actualDelivery: null, amount: 1500, attachmentFileIds: [], relatedReq: null, inspectionStatus: null },
  { orderNo: 'PO-2026-120', supplier: '滤清器专营', status: '采购中', items: [{ name: '空气滤芯', qty: 20, unit: '件' }], expectedDelivery: '2026-07-11', actualDelivery: null, amount: 3600, attachmentFileIds: [], relatedReq: null, inspectionStatus: null },
]
