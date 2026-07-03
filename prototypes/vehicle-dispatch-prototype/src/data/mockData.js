export const vehicles = [
  { id: 'V-001', plate: '沪A-37682', status: '空闲', type: '生产车', area: '总装一区', driver: '王海', distance: 0.8, task: '待命', x: 22, y: 36, speed: 18 },
  { id: 'V-002', plate: '沪B-91527', status: '任务中', type: '物流车', area: '码头堆场', driver: '赵林', distance: 1.6, task: '钢构件转运', x: 58, y: 28, speed: 32 },
  { id: 'V-003', plate: '苏E-2X781', status: '排队', type: '外协车', area: '门岗南区', driver: '陈军', distance: 2.4, task: '等待入场', x: 72, y: 68, speed: 0 },
  { id: 'V-004', plate: '临-5831', status: '异常', type: '临时车', area: '禁入边界', driver: '刘强', distance: 3.1, task: '未授权入场', x: 39, y: 74, speed: 46 },
  { id: 'V-005', plate: '沪D-64019', status: '空闲', type: '生产车', area: '涂装车间', driver: '孙亮', distance: 1.1, task: '待命', x: 45, y: 45, speed: 12 },
]

export const dispatchTasks = [
  { id: 'T-2307', point: '总装一区 A12', priority: '高', type: '生产车', material: '吊装辅材', status: '待派车', eta: '20 分钟' },
  { id: 'T-2311', point: '码头堆场 C05', priority: '中', type: '物流车', material: '分段配件', status: '待派车', eta: '35 分钟' },
  { id: 'T-2316', point: '物资库 B03', priority: '低', type: '外协车', material: '油漆耗材', status: '待派车', eta: '50 分钟' },
]

export const alerts = [
  { id: 'A-901', type: '超速', vehicle: '临-5831', severity: '高', time: '09:42', location: '禁入边界', status: '待处理', desc: '临时车辆在禁入边界超速行驶。' },
  { id: 'A-902', type: '异常停留', vehicle: '苏E-2X781', severity: '中', time: '10:05', location: '门岗南区', status: '已确认', desc: '外协车辆排队超过 25 分钟。' },
  { id: 'A-903', type: '证照过期', vehicle: '沪B-91527', severity: '低', time: '10:18', location: '码头堆场', status: '待处理', desc: '车辆保险信息将在 7 天内到期。' },
]

export const driverTasks = [
  { taskId: 'M-8012', workPointName: '总装一区 A12', status: '待接单', priority: '高', plannedArrivalTime: '10:40', estimatedArrivalTime: '10:36', distance: '1.8km', contact: '张工 138****2210', material: '吊装辅材', feedbackId: '' },
  { taskId: 'M-8013', workPointName: '物资库 B03', status: '进行中', priority: '中', plannedArrivalTime: '11:10', estimatedArrivalTime: '11:04', distance: '2.6km', contact: '李工 139****6601', material: '油漆耗材', feedbackId: 'FB-8841' },
  { taskId: 'M-8014', workPointName: '码头堆场 C05', status: '已完成', priority: '低', plannedArrivalTime: '09:10', estimatedArrivalTime: '09:06', distance: '3.2km', contact: '周工 137****9032', material: '分段配件', feedbackId: 'FB-8836' },
]

export const gateEntries = [
  { id: 'G-331', plateNumber: '苏E-2X781', vehicleType: '外协车', appointmentId: 'AP-2026070209', driver: '陈军', cargo: '分段配件', entryAllowed: true, entryTime: '10:30', releaseStatus: '待核验', inspector: '门岗一号', risk: '人车证一致' },
  { id: 'G-332', plateNumber: '临-5831', vehicleType: '临时车', appointmentId: 'AP-2026070214', driver: '刘强', cargo: '临时工具', entryAllowed: false, entryTime: '10:45', releaseStatus: '异常', inspector: '门岗二号', risk: '未匹配有效预约' },
  { id: 'G-333', plateNumber: '浙C-88210', vehicleType: '物流车', appointmentId: 'AP-2026070218', driver: '马磊', cargo: '焊材', entryAllowed: true, entryTime: '11:10', releaseStatus: '已入场', inspector: '门岗一号', risk: '预约任务匹配' },
]

export const reportRows = [
  { date: '07-01', vehicleUtilizationRate: 78, taskCompletionRate: 93, emptyDrivingRate: 14, outsourceVehicleCount: 26, abnormalEntryCount: 3 },
  { date: '07-02', vehicleUtilizationRate: 82, taskCompletionRate: 95, emptyDrivingRate: 12, outsourceVehicleCount: 23, abnormalEntryCount: 2 },
  { date: '07-03', vehicleUtilizationRate: 75, taskCompletionRate: 90, emptyDrivingRate: 18, outsourceVehicleCount: 31, abnormalEntryCount: 5 },
  { date: '07-04', vehicleUtilizationRate: 86, taskCompletionRate: 96, emptyDrivingRate: 10, outsourceVehicleCount: 21, abnormalEntryCount: 1 },
]
