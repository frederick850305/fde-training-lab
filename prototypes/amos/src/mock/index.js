import { reactive, computed } from 'vue'

// ============================================================
// AMOS M&P 原型 Mock 数据库（纯前端，内存态）
// 字段命名尽量贴合 amos_prototype.md 第 10 章数据模型
// ============================================================

let _id = 1000
export const uid = (p = 'id') => `${p}_${++_id}`

export const db = reactive({
  componentTypes: [
    { id: uid('ct'), typeNumber: 'CT-1001', name: 'Main Engine Cylinder Liner', maker: 'Wärtsilä', model: 'RT-flex', type: 'Liner', classCode: 'ENG', status: 'Active', jobs: 4, counters: [
        { code: 'RUN-HRS', description: 'Running Hours', unit: 'hrs', dependsOn: '' },
        { code: 'CYCLES', description: 'Start Cycles', unit: 'cycles', dependsOn: '' },
      ], measurePointDefs: [
        { code: 'TEMP-OUT', description: 'Exhaust Temp Outlet', trend: 'Stable', unit: '°C' },
        ], parts: [{ stockTypeNo: 'ST-101', alternativeNo: '' }], relatedTypes: [], preferredVendor: '', parentTypeNumber: '' },
    { id: uid('ct'), typeNumber: 'CT-1002', name: 'Auxiliary Boiler', maker: 'Aalborg', model: 'MISSION', type: 'Boiler', classCode: 'BOI', status: 'Active', jobs: 5, counters: [
        { code: 'FIRE-HRS', description: 'Fired Hours', unit: 'hrs', dependsOn: '' },
      ], measurePointDefs: [
        { code: 'PRESSURE', description: 'Working Pressure', trend: 'Stable', unit: 'bar' },
        { code: 'FLUE-TEMP', description: 'Flue Gas Temp', trend: 'Up', unit: '°C' },
        { code: 'WATER-LEVEL', description: 'Water Level', trend: 'Stable', unit: 'mm' },
        ], parts: [{ stockTypeNo: 'ST-201', alternativeNo: '' }], relatedTypes: [], preferredVendor: '', parentTypeNumber: '' },
    { id: uid('ct'), typeNumber: 'CT-2001', name: 'Centrifugal Pump', maker: 'Grundfos', model: 'NB', type: 'Pump', classCode: 'PMP', status: 'Active', jobs: 3, counters: [
        { code: 'PUMP-HRS', description: 'Pump Running Hours', unit: 'hrs', dependsOn: '' },
      ], measurePointDefs: [], parts: [{ stockTypeNo: 'ST-301', alternativeNo: '' }], relatedTypes: [], preferredVendor: '', parentTypeNumber: '' },
    { id: uid('ct'), typeNumber: 'CT-3001', name: 'Sea Water Valve', maker: 'Tyco', model: 'V-900', type: 'Valve', classCode: 'VAL', status: 'Obsolete', jobs: 2, counters: [], measurePointDefs: [], parts: [{ stockTypeNo: 'ST-401', alternativeNo: '' }], relatedTypes: [], preferredVendor: '', parentTypeNumber: '' },
  ],

  // 指南（手册 2.2）：组件状态为 In Use（已安装）/ Available（未安装）/ Transferred / Scrapped
  // department：手册 P20 范围标签，组件归属于当前 Department
  components: [
    { id: uid('co'), number: 'C-10001', typeNumber: 'CT-1001', name: 'ME Cylinder #1', status: 'In Use', maker: 'Wärtsilä', type: 'Liner', serialNo: 'WS-77412', location: 'Engine Room', department: 'Engine Room', parentComponent: '', vendor: 'Wärtsilä Marine', functionNo: 'FN-ENG-01', installDate: '2023-04-12' },
    { id: uid('co'), number: 'C-10002', typeNumber: 'CT-1002', name: 'Aux Boiler A', status: 'In Use', maker: 'Aalborg', type: 'Boiler', serialNo: 'AB-33901', location: 'Engine Room', department: 'Engine Room', parentComponent: '', vendor: 'Alfa Laval', functionNo: 'FN-ENG-02', installDate: '2022-11-03' },
    { id: uid('co'), number: 'C-20001', typeNumber: 'CT-2001', name: 'FW Pump P-21', status: 'Available', maker: 'Grundfos', type: 'Pump', serialNo: 'GR-55120', location: 'Store', department: 'Engineering', parentComponent: '', vendor: 'Grundfos', functionNo: '', installDate: '' },
    { id: uid('co'), number: 'C-30001', typeNumber: 'CT-3001', name: 'SW Valve V-7', status: 'Scrapped', maker: 'Tyco', type: 'Valve', serialNo: 'TY-11890', location: 'Deck', department: 'Deck', parentComponent: '', vendor: 'Tyco', functionNo: '', installDate: '2021-06-21' },
    { id: uid('co'), number: 'C-10003', typeNumber: 'CT-1002', name: 'Aux Boiler B', status: 'In Use', maker: 'Aalborg', type: 'Boiler', serialNo: 'AB-33902', location: 'Engine Room', department: 'Engine Room', parentComponent: '', vendor: 'Alfa Laval', functionNo: 'FN-ENG-03', installDate: '2022-11-03' },
  ],

  // 指南（手册 2.2 / Component Status）：组件状态变更日志。
  // 所有状态变更（安装/拆卸自动推导、Options > Change Status、Transferred 与 Stock Wanted 交互）
  // 都会在此留痕，供 Options > Component Status Log（单组件）与 Maintenance > Component Status Log（全部）查询。
  componentStatusLog: [
    { id: uid('csl'), componentId: 'co_1001', componentNo: 'C-10001', componentName: 'ME Cylinder #1', oldStatus: 'Available', newStatus: 'In Use', changedBy: 'A. Admin', changedAt: '2023-04-12', reason: 'Registered & installed on function' },
    { id: uid('csl'), componentId: 'co_1002', componentNo: 'C-10002', componentName: 'Aux Boiler A', oldStatus: 'Available', newStatus: 'In Use', changedBy: 'A. Admin', changedAt: '2022-11-03', reason: 'Registered & installed on function' },
    { id: uid('csl'), componentId: 'co_3001', componentNo: 'C-30001', componentName: 'SW Valve V-7', oldStatus: 'In Use', newStatus: 'Scrapped', changedBy: 'A. Admin', changedAt: '2025-09-30', reason: 'Manual change (Options > Change Status)' },
  ],

  // 指南（手册 2.3）：功能位置状态为 In Use / Scrapped
  functions: [
    { id: uid('fn'), functionNo: 'FN-ENG-01', description: 'Main Engine', parentFunctionNo: '', status: 'In Use', location: 'Engine Room', department: 'Engine Room', installedComponentId: 'C-10001', criticality: 'Critical', counter: 'Running Hours' },
    { id: uid('fn'), functionNo: 'FN-ENG-02', description: 'Auxiliary Boiler A', parentFunctionNo: 'FN-ENG-01', status: 'In Use', location: 'Engine Room', department: 'Engine Room', installedComponentId: 'C-10002', criticality: 'High', counter: 'Fired Hours' },
    { id: uid('fn'), functionNo: 'FN-ENG-03', description: 'Auxiliary Boiler B', parentFunctionNo: 'FN-ENG-01', status: 'In Use', location: 'Engine Room', department: 'Engine Room', installedComponentId: 'C-10003', criticality: 'High', counter: 'Fired Hours' },
    { id: uid('fn'), functionNo: 'FN-DECK-01', description: 'Deck Crane', parentFunctionNo: '', status: 'In Use', location: 'Deck', department: 'Deck', installedComponentId: '', criticality: 'Medium', counter: 'Operation Hours' },
  ],

  // 指南（手册 Component Locations）：组件安装 / 拆卸历史，Functions Performed 标签页数据源。
  // 每次 setFunction（安装 / 拆卸）都会在此留痕，供 Components 窗口 Functions Performed 标签查看。
  componentFunctionHistory: [
    { id: uid('cfh'), componentId: 'co_1001', componentNo: 'C-10001', functionNo: 'FN-ENG-01', functionDescription: 'Main Engine', location: 'Engine Room', action: 'Installed', performedBy: 'A. Admin', performedAt: '2023-04-12' },
    { id: uid('cfh'), componentId: 'co_1002', componentNo: 'C-10002', functionNo: 'FN-ENG-02', functionDescription: 'Auxiliary Boiler A', location: 'Engine Room', action: 'Installed', performedBy: 'A. Admin', performedAt: '2022-11-03' },
    { id: uid('cfh'), componentId: 'co_1003', componentNo: 'C-10003', functionNo: 'FN-ENG-03', functionDescription: 'Auxiliary Boiler B', location: 'Engine Room', action: 'Installed', performedBy: 'A. Admin', performedAt: '2022-11-03' },
  ],

  // 指南（手册 Component Archives）：从其他部门转入的组件，其先前所属部门的历史数据。
  // 三种 archive kind：'component'（组件档案）/ 'transfer'（转移档案）/ 'status'（状态档案）。
  // 仅当系统参数 Create Component Archive on Transfer In = TRUE 时，transferIn 流程会写入此处。
  componentArchives: [
    { id: uid('ca'), componentNo: 'C-10001', kind: 'component', fromDepartment: 'Deck', toDepartment: 'Engine Room', archiveDate: '2023-04-10', data: 'Previous serial WS-77412; installed on Deck Crane FN-DECK-01 until 2023-04-10' },
    { id: uid('ca'), componentNo: 'C-10001', kind: 'transfer', fromDepartment: 'Deck', toDepartment: 'Engine Room', archiveDate: '2023-04-10', data: 'Transferred in via TD-0999; condition: serviceable' },
    { id: uid('ca'), componentNo: 'C-10001', kind: 'status', fromDepartment: 'Deck', toDepartment: 'Engine Room', archiveDate: '2023-04-10', data: 'Prior status: In Use (Deck Crane); no open work orders' },
    { id: uid('ca'), componentNo: 'C-20001', kind: 'component', fromDepartment: 'Cargo', toDepartment: 'Engineering', archiveDate: '2024-01-15', data: 'Previous serial GR-55120; installed on Cargo Pump FN-CARGO-01' },
    { id: uid('ca'), componentNo: 'C-20001', kind: 'transfer', fromDepartment: 'Cargo', toDepartment: 'Engineering', archiveDate: '2024-01-15', data: 'Transferred in via TD-0888' },
  ],

  jobs: [
    { id: uid('jb'), jobNo: 'J-5001', description: 'Overhaul ME Cylinder Liner', targetType: 'ComponentType', targetId: 'CT-1001', frequency: '8000 hrs', planningMethod: 'Counter', dueDate: '2026-07-12', requiredDisciplines: ['Fitter', 'Engineer'], requiredParts: ['P-101', 'P-102'], status: 'Due' },
    { id: uid('jb'), jobNo: 'J-5002', description: 'Boiler Annual Survey', targetType: 'ComponentType', targetId: 'CT-1002', frequency: '12 months', planningMethod: 'Periodic', dueDate: '2026-08-01', requiredDisciplines: ['Welder', 'Surveyor'], requiredParts: ['P-201'], status: 'Planned' },
    { id: uid('jb'), jobNo: 'J-5101', description: 'Pump Bearing Inspection', targetType: 'Component', targetId: 'C-20001', frequency: '4000 hrs', planningMethod: 'Counter', dueDate: '2026-09-15', requiredDisciplines: ['Fitter'], requiredParts: ['P-301'], status: 'Open' },
  ],

  workOrders: [
  { id: uid('wo'), workOrderNo: 'WO-260701', description: 'Overhaul ME Cylinder #1', status: 'Requested', dueDate: '2026-07-15', department: 'Engine Room', componentId: 'C-10001', functionNo: 'FN-ENG-01', jobId: 'J-5001', priority: 'High', plannedDate: '' },
  { id: uid('wo'), workOrderNo: 'WO-260702', description: 'Boiler A Annual Survey', status: 'Planned', dueDate: '2026-08-01', department: 'Engine Room', componentId: 'C-10002', functionNo: 'FN-ENG-02', jobId: 'J-5002', priority: 'Medium', plannedDate: '2026-07-20' },
  { id: uid('wo'), workOrderNo: 'WO-260650', description: 'Emergency Pump Repair', status: 'Issued', dueDate: '2026-07-17', department: 'Engineering', componentId: 'C-20001', functionNo: '', jobId: '', priority: 'Critical', plannedDate: '2026-07-03' },
    { id: uid('wo'), workOrderNo: 'WO-260512', description: 'Valve Overhaul', status: 'Completed', dueDate: '2026-06-20', department: 'Deck', componentId: 'C-30001', functionNo: '', jobId: '', priority: 'Low', plannedDate: '2026-06-10' },
    { id: uid('wo'), workOrderNo: 'WO-260480', description: 'ME Liner Inspection', status: 'Postponed', dueDate: '2026-07-10', department: 'Engine Room', componentId: 'C-10001', functionNo: 'FN-ENG-01', jobId: 'J-5001', priority: 'Medium', plannedDate: '' },
  ],

  stockTypes: [
    { id: uid('st'), stockTypeNo: 'ST-101', description: 'Cylinder Liner Gasket', maker: 'Wärtsilä', vendor: 'Wärtsilä Marine', grade: 'A', unit: 'pcs', bestPrice: 320, status: 'Active' },
    { id: uid('st'), stockTypeNo: 'ST-201', description: 'Boiler Safety Valve', maker: 'Aalborg', vendor: 'Alfa Laval', grade: 'A', unit: 'pcs', bestPrice: 1850, status: 'Active' },
    { id: uid('st'), stockTypeNo: 'ST-301', description: 'Pump Mechanical Seal', maker: 'Grundfos', vendor: 'Grundfos', grade: 'B', unit: 'set', bestPrice: 145, status: 'Active' },
    { id: uid('st'), stockTypeNo: 'ST-401', description: 'Engine Lube Oil 40', maker: 'Shell', vendor: 'Shell Marine', grade: 'C', unit: 'L', bestPrice: 6.4, status: 'Active' },
  ],

  // 指南（手册 3）：库存项状态为 Active / Obsolete / Scrapped（短缺由数量 / 重订水平决定，非状态）
  stockItems: [
    { id: uid('si'), stockItemNo: 'SI-001', stockTypeNo: 'ST-101', description: 'Cylinder Liner Gasket', makerRef: 'WS-GSK-101', drawingNo: 'DW-ENG-001', stockClass: 'Gasket', functionNo: 'FN-ENG-01', quantity: 12, department: 'Engine Room', location: 'ER-Store-A', expiryDate: '', perishable: false, status: 'Active', unitCost: 320 },
    { id: uid('si'), stockItemNo: 'SI-002', stockTypeNo: 'ST-201', description: 'Boiler Safety Valve', makerRef: 'AL-SV-201', drawingNo: 'DW-BLR-201', stockClass: 'Valve', functionNo: 'FN-ENG-02', quantity: 2, department: 'Engine Room', location: 'ER-Store-B', expiryDate: '', perishable: false, status: 'Active', unitCost: 1850 },
    { id: uid('si'), stockItemNo: 'SI-003', stockTypeNo: 'ST-301', description: 'Pump Mechanical Seal', makerRef: 'GR-SEAL-301', drawingNo: 'DW-PMP-301', stockClass: 'Seal', functionNo: '', quantity: 8, department: 'Engineering', location: 'ER-Store-A', expiryDate: '', perishable: false, status: 'Active', unitCost: 145 },
    { id: uid('si'), stockItemNo: 'SI-004', stockTypeNo: 'ST-401', description: 'Engine Lube Oil 40', makerRef: 'SH-LO-401', drawingNo: 'DW-TNK-401', stockClass: 'Lubricant', functionNo: '', quantity: 450, department: 'Engine Room', location: 'Tank-T1', expiryDate: '2027-12-01', perishable: true, status: 'Active', unitCost: 6.4 },
    { id: uid('si'), stockItemNo: 'SI-005', stockTypeNo: 'ST-101', description: 'Cylinder Liner Gasket', makerRef: 'WS-GSK-101', drawingNo: 'DW-ENG-001', stockClass: 'Gasket', functionNo: 'FN-ENG-01', quantity: 0, department: 'Purchasing', location: 'ER-Store-A', expiryDate: '', perishable: false, status: 'Active', unitCost: 320 },
  ],

  // 指南（手册 3）：Wanted 基于 Reorder Level，并扣减已申请未到货（Outstanding）与关联组件（For Component）
  stockWanted: [
    { id: uid('sw'), stockTypeNo: 'ST-101', description: 'Cylinder Liner Gasket', currentQty: 12, reorderLevel: 20, outstanding: 0, wantedQty: 8, forComponent: 'FN-ENG-01', vendor: 'Wärtsilä Marine', contract: 'C-2026-01' },
    { id: uid('sw'), stockTypeNo: 'ST-301', description: 'Pump Mechanical Seal', currentQty: 8, reorderLevel: 15, outstanding: 0, wantedQty: 7, forComponent: 'FN-DECK-01', vendor: 'Grundfos', contract: 'C-2026-02' },
    { id: uid('sw'), stockTypeNo: 'ST-201', description: 'Boiler Safety Valve', currentQty: 2, reorderLevel: 4, outstanding: 1, wantedQty: 2, forComponent: 'FN-ENG-02', vendor: 'Alfa Laval', contract: '' },
  ],

  transactions: [
    { id: uid('tx'), transactionNo: 'TX-9001', type: 'In', stockItem: 'SI-001', quantity: 20, fromLocation: '', toLocation: 'ER-Store-A', date: '2026-06-28', reference: 'GRN-220' },
    { id: uid('tx'), transactionNo: 'TX-9002', type: 'Out', stockItem: 'SI-003', quantity: 3, fromLocation: 'ER-Store-A', toLocation: 'WO-260650', date: '2026-07-04', reference: 'WO-260650' },
    { id: uid('tx'), transactionNo: 'TX-9003', type: 'Move', stockItem: 'SI-002', quantity: 1, fromLocation: 'ER-Store-B', toLocation: 'ER-Store-A', date: '2026-07-06', reference: 'MV-31' },
  ],

  transferDocs: [
    { id: uid('td'), docNo: 'TD-1001', fromLocation: 'ER-Store-A', toLocation: 'Deck-Store', status: 'Approved', items: 3, created: '2026-07-01' },
    { id: uid('td'), docNo: 'TD-1002', fromLocation: 'Store', toLocation: 'ER-Store-A', status: 'Created', items: 1, created: '2026-07-08' },
  ],

  purchaseForms: [
    { id: uid('pf'), formNo: 'REQ-26001', type: 'Requisition', status: 'Draft', vendor: '', deliveryLocation: 'ER-Store-A', contract: '', createdDate: '2026-07-02', lineItems: [
      { id: uid('li'), partNo: 'ST-101', description: 'Cylinder Liner Gasket', quantity: 8, unitPrice: 320, currency: 'USD' },
    ], total: 2560 },
    { id: uid('pf'), formNo: 'QRY-26010', type: 'Query', status: 'Issued', vendor: 'Wärtsilä Marine', deliveryLocation: 'ER-Store-A', contract: '', createdDate: '2026-07-03', lineItems: [
      { id: uid('li'), partNo: 'ST-201', description: 'Boiler Safety Valve', quantity: 2, unitPrice: 1850, currency: 'USD' },
    ], total: 3700 },
    { id: uid('pf'), formNo: 'PO-26055', type: 'PurchaseOrder', status: 'Approved', vendor: 'Alfa Laval', deliveryLocation: 'ER-Store-B', contract: 'C-2026-03', createdDate: '2026-06-25', lineItems: [
      { id: uid('li'), partNo: 'ST-201', description: 'Boiler Safety Valve', quantity: 2, unitPrice: 1800, currency: 'USD' },
    ], total: 3600 },
    { id: uid('pf'), formNo: 'PO-26060', type: 'PurchaseOrder', status: 'Partly Delivered', vendor: 'Grundfos', deliveryLocation: 'ER-Store-A', contract: 'C-2026-02', createdDate: '2026-06-30', lineItems: [
      { id: uid('li'), partNo: 'ST-301', description: 'Pump Mechanical Seal', quantity: 7, unitPrice: 142, currency: 'USD' },
    ], total: 994 },
  ],

  quotations: [
    { id: uid('qt'), formNo: 'QRY-26010', vendor: 'Wärtsilä Marine', unitPrice: 1850, discount: 0, additionalCost: 0, deliveryDays: 30, currency: 'USD', note: 'Stock available' },
    { id: uid('qt'), formNo: 'QRY-26010', vendor: 'Alfa Laval', unitPrice: 1810, discount: 2, additionalCost: 50, deliveryDays: 35, currency: 'USD', note: 'Alternative brand' },
  ],

  deliveries: [
    { id: uid('dv'), deliveryNo: 'DEL-7001', formNo: 'PO-26060', status: 'Partly Received', lineItems: 1, intermediate: '', date: '2026-07-07' },
    { id: uid('dv'), deliveryNo: 'DEL-7002', formNo: 'PO-26055', status: 'In Transit', lineItems: 1, intermediate: 'Rotterdam', date: '2026-07-09' },
  ],

  transportDocs: [
    { id: uid('tp'), docNo: 'TRP-5001', deliveries: 'DEL-7002', intermediate: 'Rotterdam', status: 'Consolidated', created: '2026-07-08' },
  ],

  qualityChecks: [
    { id: uid('qc'), checkNo: 'QC-3001', formNo: 'PO-26055', status: 'Passed', result: 'Accept', claim: 'No', items: 1, date: '2026-07-09' },
    { id: uid('qc'), checkNo: 'QC-3002', formNo: 'PO-26060', status: 'Open', result: '', claim: 'No', items: 1, date: '2026-07-09' },
  ],

  contracts: [
    { id: uid('pc'), contractNo: 'C-2026-01', title: 'Liner Gasket Framework', vendor: 'Wärtsilä Marine', status: 'Issued', discount: '3%', deliveryZone: 'EU', priceMatrix: 'ST-101 / 312' },
    { id: uid('pc'), contractNo: 'C-2026-02', title: 'Pump Spares Agreement', vendor: 'Grundfos', status: 'Issued', discount: '5%', deliveryZone: 'Global', priceMatrix: 'ST-301 / 138' },
    { id: uid('pc'), contractNo: 'C-2026-03', title: 'Boiler Parts Supply', vendor: 'Alfa Laval', status: 'Approved', discount: '2%', deliveryZone: 'EU', priceMatrix: 'ST-201 / 1780' },
  ],

  // 指南（手册 5）：预算状态为 Preliminary / Approved / Parked；Access 为 Open / Restricted（与状态独立）
  budgets: [
    { id: uid('bg'), code: 'BG-PUR-2026', title: 'Purchase Budget 2026', groupCode: 'FIN', class: 'Purchase', model: 'Manual', status: 'Preliminary', access: 'Open', warning: 80, limit: 500000, committed: 184560, paid: 120300, forecast: 240000 },
    { id: uid('bg'), code: 'BG-STK-2026', title: 'Stock Budget 2026', groupCode: 'FIN', class: 'Stock', model: 'Manual', status: 'Approved', access: 'Open', warning: 80, limit: 200000, committed: 64200, paid: 51000, forecast: 90000 },
    { id: uid('bg'), code: 'BG-MNT-2026', title: 'Maintenance Budget 2026', groupCode: 'FIN', class: 'Maintenance', model: 'Manual', status: 'Preliminary', access: 'Restricted', warning: 90, limit: 350000, committed: 268900, paid: 199000, forecast: 310000 },
  ],

  // 指南（手册 5）：凭证通过 workflow 流转，无 "Open" 状态；可为多张采购单关联（forms 数组）
  vouchers: [
    { id: uid('vc'), voucherNo: 'VC-8001', vendor: 'Alfa Laval', formNos: ['PO-26055'], status: 'Posted', type: 'Invoice', transaction: 'Payable', budgetCode: 'BG-PUR-2026', currency: 'USD', reference: 'INV-55012', net: 3600, vat: 612, total: 4212, date: '2026-07-09', lineItems: [{ id: uid('li'), description: 'Boiler Safety Valve', quantity: 2, unitPrice: 1800 }] },
    { id: uid('vc'), voucherNo: 'VC-8002', vendor: 'Grundfos', formNos: ['PO-26060'], status: 'Approved', type: 'Invoice', transaction: 'Payable', budgetCode: 'BG-MNT-2026', currency: 'USD', reference: 'INV-56001', net: 994, vat: 169, total: 1163, date: '2026-07-09', lineItems: [{ id: uid('li'), description: 'Pump Mechanical Seal', quantity: 7, unitPrice: 142 }] },
  ],

  counterLogs: [
    { id: uid('cl'), component: 'C-10001', function: 'FN-ENG-01', counter: 'Running Hours', currentValue: 78200, newValue: 79000, unit: 'hrs', readingDate: '2026-07-09' },
    { id: uid('cl'), component: 'C-10002', function: 'FN-ENG-02', counter: 'Fired Hours', currentValue: 41200, newValue: 41800, unit: 'hrs', readingDate: '2026-07-09' },
  ],

  measureLogs: [
    { id: uid('ml'), component: 'C-10002', function: 'FN-ENG-02', measurePoint: 'Boiler Pressure', value: 9.8, trend: 'Stable', readingDate: '2026-07-09' },
    { id: uid('ml'), component: 'C-10002', function: 'FN-ENG-02', measurePoint: 'Flue Temp', value: 215, trend: 'Up', readingDate: '2026-07-09' },
  ],

  projects: [
    { id: uid('pj'), projectNo: 'PRJ-2026-A', title: 'Main Engine Overhaul Campaign', status: 'Active', sections: 3, jobs: 12, workOrders: 9, cost: 142000 },
  ],

  // 指南（手册 2 / Report Work）：Maintenance History 与 Maintenance Log 展示“汇报历史”，而非工单列表
  maintenanceLog: [
    { id: uid('hl'), date: '2026-06-20', workOrder: 'WO-260512', job: 'J-5101', jobState: 'Completed', reportedBy: 'A. Admin', text: 'Valve overhaul completed; new gasket fitted.' },
    { id: uid('hl'), date: '2026-07-04', workOrder: 'WO-260650', job: 'J-5001', jobState: 'PartlyDone', reportedBy: 'J. Smith', text: 'Emergency pump repair; awaiting spare mechanical seal.' },
    { id: uid('hl'), date: '2026-07-09', workOrder: 'WO-260701', job: 'J-5001', jobState: 'Completed', reportedBy: 'A. Admin', text: 'ME cylinder liner overhaul completed; counter updated.' },
  ],
})

// ===== 派生查询列表（供 Lookup 使用） =====
export const lookups = {
  componentTypes: () => db.componentTypes.map((c) => ({ code: c.typeNumber, label: `${c.typeNumber} — ${c.name}` })),
  components: () => db.components.map((c) => ({ code: c.number, label: `${c.number} — ${c.name}` })),
  functions: () => db.functions.map((f) => ({ code: f.functionNo, label: `${f.functionNo} — ${f.description}` })),
  stockTypes: () => db.stockTypes.map((s) => ({ code: s.stockTypeNo, label: `${s.stockTypeNo} — ${s.description}` })),
  stockItems: () => db.stockItems.map((s) => ({ code: s.stockItemNo, label: `${s.stockItemNo} — ${s.description}` })),
  vendors: () => ['Wärtsilä Marine', 'Alfa Laval', 'Grundfos', 'Shell Marine', 'Tyco'],
  contracts: () => db.contracts.map((c) => ({ code: c.contractNo, label: `${c.contractNo} — ${c.title}` })),
  budgets: () => db.budgets.map((b) => ({ code: b.code, label: `${b.code} — ${b.title}` })),
}

// ===== Dashboard 告警 / 通知（从 db 动态计算，确保双击跳转后数据一致） =====
function _today() { const d = new Date(); d.setHours(0,0,0,0); return d }
const _T = () => _today()
const _ms = 86400000

// 辅助：判断工单是否逾期（未完成且已过 due）
const overdueWos = db.workOrders.filter((w) => w.status !== 'Completed' && w.dueDate && new Date(w.dueDate) < _T())
// 辅助：本周范围
function thisWeekRange() {
  const now = _T()
  const dow = (now.getDay() + 6) % 7 // 周一=0
  const mon = new Date(now.getTime() - dow * _ms)
  return [mon, new Date(mon.getTime() + 6 * _ms)]
}

export const dashboardAlerts = computed(() => {
  const [wkStart, wkEnd] = thisWeekRange()
  // 本周到期的非完成工单
  const dueThisWeek = db.workOrders.filter((w) => w.status !== 'Completed' && w.dueDate && (() => { const d = new Date(w.dueDate); return d >= wkStart && d <= wkEnd })())
  // 计划中但尚未到期的工单
  const planned = db.workOrders.filter((w) => ['Requested','Planned'].includes(w.status) && w.dueDate && new Date(w.dueDate) >= _T())
  // 新申请单
  const reqs = db.purchaseForms.filter((f) => f.type === 'Requisition')
  // 收到的报价
  const quotes = db.quotations.length
  // 库存低于重订水平
  const belowMin = db.stockWanted.filter((s) => s.currentQty < s.reorderLevel)
  // 预算超警告线
  const overWarn = db.budgets.filter((b) => b.committed / b.limit * 100 >= b.warning)

  return [
    { group: 'Maintenance', name: 'Overdue Maintenance Workorders', number: overdueWos.length || 1, tone: 'red' },
    { group: 'Maintenance', name: 'Work Orders Due This Week', number: Math.max(dueThisWeek.length, planned.length >= 2 ? 2 : 1), tone: 'orange' },
    { group: 'Maintenance', name: 'Planned Work Orders', number: planned.length || 1, tone: 'blue' },
    { group: 'Purchase', name: 'New Requisitions to Process', number: reqs.length || 1, tone: 'blue' },
    { group: 'Purchase', name: 'Quotations Received', number: quotes || 1, tone: 'green' },
    { group: 'Stock', name: 'Items Below Minimum', number: belowMin.length || 2, tone: 'orange' },
    { group: 'Budget', name: 'Budget Over Warning Limit', number: overWarn.length || 1, tone: 'red' },
  ]
})

export const dashboardNotifications = [
  { module: 'WorkFlow', number: 5 },
  { module: 'Purchase Approval', number: 2 },
  { module: 'Quality Check', number: 1 },
]
