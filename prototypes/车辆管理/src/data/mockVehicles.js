export const vehicleItem = {
  vehicleId: 'V001',
  plateNo: '京A·12345',
  vehicleType: '厢式货车',
  company: '本公司',
  driverName: '李四',
  driverPhone: '13800138001',
  annualInspectionExpiry: '2025-12-31',
  insuranceExpiry: '2025-10-01',
  status: '启用'
};

export const vehicleSaveParams = {
  vehicleId: 'V001',
  vehicleType: '厢式货车',
  plateNo: '京A·12345',
  company: '本公司',
  driverName: '李四',
  driverPhone: '13800138001',
  annualInspectionExpiry: '2025-12-31',
  insuranceExpiry: '2025-10-01'
};

export const operationLog = {
  logId: 'LOG-001',
  operator: '管理员赵',
  operateTime: '2025-06-15 08:30',
  operationType: '编辑',
  vehicleId: 'V001',
  changeDetail: '修改保险到期日'
};

export const vehicleFilter = {
  vehicleType: '厢式货车',
  company: '本公司',
  status: '启用',
  expiryStatus: '正常',
  keyword: '京A'
};

export const operationLogs = [
  {
    ...operationLog,
    id: operationLog.logId,
    vehiclePlate: vehicleItem.plateNo,
    type: operationLog.operationType,
    before: { insuranceExpiry: '2025-09-01' },
    after: { insuranceExpiry: operationLog.changeDetail },
  },
  { ...operationLog, id: 'LOG-002', logId: 'LOG-002', operationType: '新增', type: '新增', operator: '管理员钱', vehiclePlate: '京B·67890', before: {}, after: { status: '启用' } },
  { ...operationLog, id: 'LOG-003', logId: 'LOG-003', operationType: '停用', type: '停用', operator: '管理员孙', vehiclePlate: '京C·24680', before: { status: '启用' }, after: { status: '停用' } },
];

function normalizeVehicle(source, index = 0) {
  const disabled = source.status === '停用' || source.status === 'disabled';
  const plate = source.plateNumber || source.plateNo;
  return {
    ...source,
    id: source.id || source.vehicleId,
    plateNumber: plate,
    plate: plate,
    department: source.department || source.company,
    driver: source.driver || source.driverName,
    status: disabled ? 'disabled' : 'enabled',
    statusText: disabled ? '停用' : '启用',
    expireStatus: index === 0 ? '即将到期' : '正常',
    remainingDays: index === 0 ? 18 : 120,
    expireType: index === 0 ? '保险' : '年检',
  };
}

const vehicleList = [
  normalizeVehicle(vehicleItem, 0),
  normalizeVehicle({ ...vehicleItem, vehicleId: 'V002', plateNo: '京B·67890', vehicleType: '平板车', status: '启用', driverName: '王五' }, 1),
  normalizeVehicle({ ...vehicleItem, vehicleId: 'V003', plateNo: '京C·24680', vehicleType: '小型货车', status: '停用', driverName: '赵六' }, 2),
];

export async function getVehicleList() {
  return {
    list: vehicleList,
    total: vehicleList.length,
  };
}

export async function toggleVehicleStatus(id, status) {
  return {
    success: true,
    id,
    status,
  };
}

export async function getVehicleDetail(id) {
  const found = vehicleList.find(item => item.id === id || item.vehicleId === id) || vehicleList[0];
  return {
    ...found,
    id,
    plateNumber: found.plateNumber,
    organization: found.department,
    inspectionDate: found.annualInspectionExpiry,
    insuranceDate: found.insuranceExpiry,
    accessDate: '2025-12-31',
    certificateImages: [
      { id: 'cert-1', type: 'license', typeLabel: '行驶证', url: '', status: '有效' },
      { id: 'cert-2', type: 'insurance', typeLabel: '保险单', url: '', status: '即将到期' },
    ],
  };
}

export async function saveVehicle(payload) {
  return {
    success: true,
    data: payload,
  };
}

export async function getOperationLogs() {
  return operationLogs;
}

export function getExpiringVehicles() {
  return vehicleList
    .filter(item => item.expireStatus === '即将到期')
    .map(item => ({
      id: item.id,
      plateNumber: item.plateNumber,
      expireType: item.expireType,
      remainingDays: item.remainingDays,
    }));
}
