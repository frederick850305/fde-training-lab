// 物资库存管理模拟数据

export const inventoryWorkbench = {
  pendingTasks: {
    inventory: 3,
    requisition: 2,
    return: 1,
  },
  networkStatus: '弱网',
  syncProgress: { pending: 4, synced: 18, failed: 1 },
  recentOperations: [
    { id: 'PC-882', type: '盘点', material: '消防泵密封件', time: '2026-07-07 08:30', status: '待同步' },
    { id: 'REQ-3301', type: '领料', material: '燃油滤芯 FP-200', time: '2026-07-06 18:00', status: '已同步' },
    { id: 'RET-2103', type: '退料', material: '液压油', time: '2026-07-06 20:15', status: '待同步' },
  ],
}

export const materials = [
  { code: 'FP-200', name: '燃油滤芯', category: '滤器', systemInventory: 12, unit: '件', location: '仓库A-3', safetyStock: 5, barcode: '6900000000200' },
  { code: 'FP-SEAL-01', name: '机械密封', category: '密封件', systemInventory: 1, unit: '件', location: '仓库B-1', safetyStock: 3, barcode: '6900000000201' },
  { code: 'OIL-HYD-46', name: '液压油 46号', category: '油料', systemInventory: 80, unit: '升', location: '油料库', safetyStock: 40, barcode: '6900000000202' },
  { code: 'GSKT-08', name: '密封垫片 8mm', category: '密封件', systemInventory: 6, unit: '片', location: '仓库B-2', safetyStock: 10, barcode: '6900000000203' },
  { code: 'BLT-M10', name: '不锈钢螺栓 M10', category: '紧固件', systemInventory: 200, unit: '颗', location: '仓库C-1', safetyStock: 100, barcode: '6900000000204' },
  { code: 'FLT-AIR', name: '空气滤芯', category: '滤器', systemInventory: 8, unit: '件', location: '仓库A-2', safetyStock: 4, barcode: '6900000000205' },
]

export const physicalCountRecords = [
  { taskId: 'PC-882', userId: '机工 刘洋', barcode: '6900000000201', materialCode: 'FP-SEAL-01', materialName: '机械密封', systemInventory: 1, actualQuantity: 1, diff: 0, attachmentMedia: 2, status: '待同步', time: '2026-07-07 08:30', location: '仓库B-1' },
  { taskId: 'PC-881', userId: '机工 刘洋', barcode: '6900000000200', materialCode: 'FP-200', materialName: '燃油滤芯', systemInventory: 12, actualQuantity: 11, diff: -1, attachmentMedia: 1, status: '已同步', time: '2026-07-07 08:10', location: '仓库A-3' },
  { taskId: 'PC-880', userId: '机工 周明', barcode: '6900000000202', materialCode: 'OIL-HYD-46', materialName: '液压油 46号', systemInventory: 80, actualQuantity: 76, diff: -4, attachmentMedia: 1, status: '已同步', time: '2026-07-06 19:00', location: '油料库' },
  { taskId: 'PC-879', userId: '机工 周明', barcode: '6900000000203', materialCode: 'GSKT-08', materialName: '密封垫片 8mm', systemInventory: 6, actualQuantity: 6, diff: 0, attachmentMedia: 0, status: '已同步', time: '2026-07-06 18:50', location: '仓库B-2' },
]

export const requisitionOrders = [
  { orderId: 'REQ-3301', materialCode: 'FP-200', materialName: '燃油滤芯', quantity: 2, unit: '件', purpose: '主机燃油泵保养', relatedOrder: 'WO-2026-1201', status: '已同步', operator: '轮机长 陈海', time: '2026-07-06 18:00', stockBefore: 14, stockAfter: 12 },
  { orderId: 'REQ-3300', materialCode: 'OIL-HYD-46', materialName: '液压油 46号', quantity: 20, unit: '升', purpose: '舵机液压站换油', relatedOrder: 'WO-2026-1190', status: '已同步', operator: '机工 孙磊', time: '2026-07-03 16:00', stockBefore: 100, stockAfter: 80 },
  { orderId: 'REQ-3299', materialCode: 'FLT-AIR', materialName: '空气滤芯', quantity: 1, unit: '件', purpose: '空压机组保养', relatedOrder: 'WO-2026-1185', status: '待同步', operator: '机工 刘洋', time: '2026-07-07 07:50', stockBefore: 9, stockAfter: 8 },
]

export const returnOrders = [
  { orderId: 'RET-2103', materialCode: 'OIL-HYD-46', materialName: '液压油 46号', returnQuantity: 3, unit: '升', returnReason: '领用结余', remark: '换油后剩余', status: '待同步', operator: '机工 孙磊', time: '2026-07-06 20:15', stockBefore: 77, stockAfter: 80 },
  { orderId: 'RET-2102', materialCode: 'BLT-M10', materialName: '不锈钢螺栓 M10', returnQuantity: 12, unit: '颗', returnReason: '规格不符', remark: '实际需M12', status: '已同步', operator: '机工 周明', time: '2026-07-05 15:00', stockBefore: 188, stockAfter: 200 },
  { orderId: 'RET-2101', materialCode: 'GSKT-08', materialName: '密封垫片 8mm', returnQuantity: 2, unit: '片', returnReason: '领用结余', remark: '', status: '已同步', operator: '机工 刘洋', time: '2026-07-04 11:20', stockBefore: 4, stockAfter: 6 },
]

export const inspectionRecords = [
  { inspectionId: 'INS-501', orderId: 'PO-2026-118', supplier: '中海物资', items: [{ name: '燃油滤芯 FP-200', qty: 20, spec: '原厂件' }], inspectionConclusion: '合格', defectReason: null, result: '入库', inspector: '采办协同 马力', time: '2026-07-06 10:00', budgetDeduct: 4800 },
  { inspectionId: 'INS-500', orderId: 'PO-2026-115', supplier: '远东密封', items: [{ name: '机械密封 FP-SEAL-01', qty: 10, spec: '氟橡胶' }], inspectionConclusion: '部分不合格', defectReason: '2件密封面有划痕', result: '退换货', inspector: '采办协同 马力', time: '2026-07-05 14:30', budgetDeduct: 0 },
  { inspectionId: 'INS-499', orderId: 'PO-2026-110', supplier: '壳牌润滑油', items: [{ name: '液压油 46号', qty: 200, spec: '208L桶装' }], inspectionConclusion: '合格', defectReason: null, result: '入库', inspector: '采办协同 马力', time: '2026-07-03 09:00', budgetDeduct: 9600 },
]

export const lowStockAlerts = [
  { code: 'FP-SEAL-01', name: '机械密封', systemInventory: 1, safetyStock: 3, shortage: 2 },
  { code: 'GSKT-08', name: '密封垫片 8mm', systemInventory: 6, safetyStock: 10, shortage: 4 },
]
