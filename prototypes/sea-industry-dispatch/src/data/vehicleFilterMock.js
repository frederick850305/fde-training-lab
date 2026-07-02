/**
 * OnsiteVehicleFilter Mock 数据
 * 现场车辆快速筛选 —— 车辆列表、筛选条件
 */

export const vehicleStatusMap = {
  idle: { label: '空闲', color: '#16a34a' },
  queuing: { label: '排队', color: '#d97706' },
  onTask: { label: '任务中', color: '#2563eb' },
  abnormal: { label: '异常', color: '#dc2626' },
}

export const vehicleTypes = ['全部', '生产车', '物流车', '外协车', '临时车']

export const areas = [
  '全部区域',
  'A区-原料仓',
  'B区-成品仓',
  'C区-装卸区',
  'D区-作业区',
  '停车场',
]

export const filterVehicles = [
  {
    id: 'V001', plate: '沪A-12345', type: '生产车', status: 'idle',
    area: 'A区-原料仓', driver: '张师傅', distance: 0.8,
    loadCapacity: '8吨', lastUsed: '2026-07-02 10:30',
  },
  {
    id: 'V002', plate: '沪B-23456', type: '物流车', status: 'onTask',
    area: 'B区-成品仓', driver: '李师傅', distance: 1.2,
    loadCapacity: '12吨', lastUsed: '2026-07-02 09:00',
  },
  {
    id: 'V003', plate: '沪C-34567', type: '生产车', status: 'queuing',
    area: 'C区-装卸区', driver: '王师傅', distance: 2.5,
    loadCapacity: '8吨', lastUsed: '2026-07-02 11:00',
  },
  {
    id: 'V004', plate: '沪D-45678', type: '外协车', status: 'abnormal',
    area: 'D区-作业区', driver: '赵师傅', distance: 4.2,
    loadCapacity: '20吨', lastUsed: '2026-07-01 16:00',
  },
  {
    id: 'V005', plate: '沪E-56789', type: '物流车', status: 'onTask',
    area: 'A区-原料仓', driver: '钱师傅', distance: 1.5,
    loadCapacity: '12吨', lastUsed: '2026-07-02 08:30',
  },
  {
    id: 'V006', plate: '沪F-67890', type: '生产车', status: 'idle',
    area: 'B区-停车场', driver: '孙师傅', distance: 3.1,
    loadCapacity: '8吨', lastUsed: '2026-07-02 07:45',
  },
  {
    id: 'V007', plate: '沪G-78901', type: '临时车', status: 'queuing',
    area: 'C区-装卸区', driver: '周师傅', distance: 2.8,
    loadCapacity: '5吨', lastUsed: '2026-07-02 10:15',
  },
  {
    id: 'V008', plate: '沪H-89012', type: '物流车', status: 'idle',
    area: 'A区-停车场', driver: '吴师傅', distance: 0.5,
    loadCapacity: '15吨', lastUsed: '2026-07-02 06:00',
  },
  {
    id: 'V009', plate: '沪J-90123', type: '生产车', status: 'abnormal',
    area: 'D区-作业区', driver: '郑师傅', distance: 5.0,
    loadCapacity: '8吨', lastUsed: '2026-07-01 14:00',
  },
  {
    id: 'V010', plate: '沪K-01234', type: '外协车', status: 'onTask',
    area: 'B区-成品仓', driver: '冯师傅', distance: 1.8,
    loadCapacity: '25吨', lastUsed: '2026-07-02 05:30',
  },
  {
    id: 'V011', plate: '沪L-12346', type: '生产车', status: 'idle',
    area: 'C区-停车场', driver: '陈师傅', distance: 3.6,
    loadCapacity: '8吨', lastUsed: '2026-07-02 04:00',
  },
  {
    id: 'V012', plate: '沪M-23457', type: '物流车', status: 'queuing',
    area: 'A区-原料仓', driver: '林师傅', distance: 0.3,
    loadCapacity: '12吨', lastUsed: '2026-07-02 11:30',
  },
]
