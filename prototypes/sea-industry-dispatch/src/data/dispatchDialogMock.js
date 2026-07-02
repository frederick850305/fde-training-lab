/**
 * OnsiteDispatchDialog Mock 数据
 * 现场派车 —— 待派发申请、预选车辆
 */

export const pendingApplications = [
  {
    id: 'APP-2026-0042',
    requester: '生产线A',
    jobSite: 'B区-成品仓 3号装货口',
    material: '成品钢材 28吨',
    priority: 'high',
    createdAt: '2026-07-02 08:00',
    deadline: '2026-07-02 12:00',
  },
  {
    id: 'APP-2026-0043',
    requester: '外协单位B',
    jobSite: 'C区-装卸点3',
    material: '钢管 15捆',
    priority: 'medium',
    createdAt: '2026-07-02 09:00',
    deadline: '2026-07-02 15:00',
  },
  {
    id: 'APP-2026-0044',
    requester: '3号工地',
    jobSite: 'C区-装卸点2',
    material: '临时物资 5吨',
    priority: 'low',
    createdAt: '2026-07-02 10:00',
    deadline: '2026-07-02 17:00',
  },
  {
    id: 'APP-2026-0045',
    requester: '维修车间',
    jobSite: 'D区-作业区',
    material: '发动机组件 3箱',
    priority: 'high',
    createdAt: '2026-07-02 06:00',
    deadline: '2026-07-02 10:00',
  },
]

export const preselectedVehicles = [
  {
    id: 'V008',
    plate: '沪H-89012',
    type: '物流车',
    status: 'idle',
    area: 'A区-停车场',
    driver: '吴师傅',
    loadCapacity: '15吨',
  },
  {
    id: 'V001',
    plate: '沪A-12345',
    type: '生产车',
    status: 'idle',
    area: 'A区-原料仓',
    driver: '张师傅',
    loadCapacity: '8吨',
  },
]
