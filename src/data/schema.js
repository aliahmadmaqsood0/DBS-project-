// ============================================================
// DRYPORT MANAGEMENT SYSTEM — Normalized Relational Data
// Strictly follows the ER Diagram (Dryport Management System)
// ============================================================

// ─── USERS ─────────────────────────────────────────────────
export const users = [
  { UserID: 'U001', Name: 'Arjun Mehta',    Email: 'admin@dryport.com',      Password: 'admin123',     Role: 'Admin',          Phone: '+92-300-1234567' },
  { UserID: 'U002', Name: 'Sara Qureshi',   Email: 'sara@logistics.pk',      Password: 'cust123',      Role: 'Customer',       Phone: '+92-321-9876543' },
  { UserID: 'U003', Name: 'Bilal Khan',     Email: 'bilal@transport.pk',     Password: 'trans123',     Role: 'Transporter',    Phone: '+92-333-5551234' },
  { UserID: 'U004', Name: 'Ayesha Siddiqui',Email: 'ayesha@customs.gov.pk',  Password: 'customs123',   Role: 'CustomsOfficer', Phone: '+92-345-7778899' },
  { UserID: 'U005', Name: 'Usman Tariq',    Email: 'usman@shipping.pk',      Password: 'cust456',      Role: 'Customer',       Phone: '+92-312-4445566' },
  { UserID: 'U006', Name: 'Fatima Noor',    Email: 'fatima@customs.gov.pk',  Password: 'customs456',   Role: 'CustomsOfficer', Phone: '+92-301-2223344' },
];

// ─── CUSTOMERS (linked to Users via UserID FK) ─────────────
export const customers = [
  { CustomerID: 'C001', UserID: 'U002', CompanyName: 'Qureshi Logistics Pvt Ltd',  Address: '14-B, Industrial Area, Karachi' },
  { CustomerID: 'C002', UserID: 'U005', CompanyName: 'Tariq International Trading', Address: '88 Commercial Zone, Lahore' },
];

// ─── SHIPMENTS ─────────────────────────────────────────────
// Status: Placed → InTransit → Stored → Settled → Completed
export const shipments = [
  { ShipmentID: 'SH001', Type: 'Import',  Date: '2026-04-10', Status: 'Stored',    CustomerID: 'C001' },
  { ShipmentID: 'SH002', Type: 'Export',  Date: '2026-04-12', Status: 'InTransit', CustomerID: 'C001' },
  { ShipmentID: 'SH003', Type: 'Import',  Date: '2026-04-15', Status: 'Placed',    CustomerID: 'C002' },
  { ShipmentID: 'SH004', Type: 'Transit', Date: '2026-04-18', Status: 'Settled',   CustomerID: 'C002' },
  { ShipmentID: 'SH005', Type: 'Import',  Date: '2026-04-20', Status: 'Completed', CustomerID: 'C001' },
  { ShipmentID: 'SH006', Type: 'Export',  Date: '2026-04-25', Status: 'Placed',    CustomerID: 'C002' },
  { ShipmentID: 'SH007', Type: 'Import',  Date: '2026-04-28', Status: 'InTransit', CustomerID: 'C001' },
];

// ─── CONTAINERS (linked to Shipment via ShipmentID FK) ─────
export const containers = [
  { ContainerID: 'CN001', Size: '20ft',    Status: 'Stored',    Type: 'Dry',           ShipmentID: 'SH001' },
  { ContainerID: 'CN002', Size: '40ft',    Status: 'Stored',    Type: 'Refrigerated',  ShipmentID: 'SH001' },
  { ContainerID: 'CN003', Size: '20ft',    Status: 'InTransit', Type: 'Dry',           ShipmentID: 'SH002' },
  { ContainerID: 'CN004', Size: '40ft HC', Status: 'InTransit', Type: 'Open Top',      ShipmentID: 'SH002' },
  { ContainerID: 'CN005', Size: '20ft',    Status: 'Pending',   Type: 'Dry',           ShipmentID: 'SH003' },
  { ContainerID: 'CN006', Size: '40ft',    Status: 'Released',  Type: 'Flat Rack',     ShipmentID: 'SH004' },
  { ContainerID: 'CN007', Size: '40ft HC', Status: 'Released',  Type: 'Refrigerated',  ShipmentID: 'SH005' },
  { ContainerID: 'CN008', Size: '20ft',    Status: 'Pending',   Type: 'Dry',           ShipmentID: 'SH006' },
  { ContainerID: 'CN009', Size: '40ft',    Status: 'InTransit', Type: 'Dry',           ShipmentID: 'SH007' },
];

// ─── GOODS / ITEMS (linked to Container via ContainerID FK) ─
export const goods = [
  { ItemID: 'G001', Description: 'Textile Raw Cotton Bales',  Weight: 2400,  Quantity: 120, Value: 48000,  ContainerID: 'CN001' },
  { ItemID: 'G002', Description: 'Surgical Instruments Set',  Weight: 350,   Quantity: 500, Value: 125000, ContainerID: 'CN001' },
  { ItemID: 'G003', Description: 'Frozen Seafood Prawns',     Weight: 8000,  Quantity: 200, Value: 96000,  ContainerID: 'CN002' },
  { ItemID: 'G004', Description: 'Basmati Rice Premium Grade',Weight: 12000, Quantity: 600, Value: 72000,  ContainerID: 'CN003' },
  { ItemID: 'G005', Description: 'Leather Finished Goods',    Weight: 3200,  Quantity: 80,  Value: 64000,  ContainerID: 'CN004' },
  { ItemID: 'G006', Description: 'Auto Spare Parts',          Weight: 5600,  Quantity: 340, Value: 102000, ContainerID: 'CN005' },
  { ItemID: 'G007', Description: 'Pharmaceutical Tablets',    Weight: 900,   Quantity: 1500,Value: 230000, ContainerID: 'CN006' },
  { ItemID: 'G008', Description: 'Ceramic Tiles Assorted',    Weight: 15000, Quantity: 3000,Value: 45000,  ContainerID: 'CN006' },
  { ItemID: 'G009', Description: 'Frozen Mangoes Export',     Weight: 6000,  Quantity: 300, Value: 54000,  ContainerID: 'CN007' },
  { ItemID: 'G010', Description: 'Cotton Yarn Cones',         Weight: 7500,  Quantity: 450, Value: 67500,  ContainerID: 'CN008' },
  { ItemID: 'G011', Description: 'Steel Coils Industrial',    Weight: 20000, Quantity: 10,  Value: 180000, ContainerID: 'CN009' },
  { ItemID: 'G012', Description: 'Plastic Granules HDPE',     Weight: 4200,  Quantity: 200, Value: 33600,  ContainerID: 'CN009' },
];

// ─── YARDS ─────────────────────────────────────────────────
export const yards = [
  { YardID: 'Y001', Name: 'Alpha Yard',   Location: 'North Block, Dryport Terminal', Capacity: 24 },
  { YardID: 'Y002', Name: 'Bravo Yard',   Location: 'South Block, Dryport Terminal', Capacity: 20 },
  { YardID: 'Y003', Name: 'Charlie Yard',Location: 'East Wing, Cold Storage Zone',  Capacity: 12 },
];

// ─── YARD SLOTS (linked to Yard via YardID FK, Container via ContainerID FK) ─
export const yardSlots = [
  // Alpha Yard (Y001) — 24 slots
  { SlotID: 'YS001', YardID: 'Y001', ContainerID: 'CN001', SlotStatus: 'Occupied', AssignedDate: '2026-04-12', ReleasedDate: null },
  { SlotID: 'YS002', YardID: 'Y001', ContainerID: 'CN002', SlotStatus: 'Occupied', AssignedDate: '2026-04-12', ReleasedDate: null },
  { SlotID: 'YS003', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS004', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS005', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Reserved', AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS006', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS007', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS008', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS009', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS010', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS011', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS012', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS013', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS014', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS015', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS016', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS017', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS018', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS019', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS020', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS021', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS022', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS023', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS024', YardID: 'Y001', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },

  // Bravo Yard (Y002) — 20 slots
  { SlotID: 'YS025', YardID: 'Y002', ContainerID: 'CN006', SlotStatus: 'Occupied', AssignedDate: '2026-04-19', ReleasedDate: '2026-04-28' },
  { SlotID: 'YS026', YardID: 'Y002', ContainerID: 'CN007', SlotStatus: 'Occupied', AssignedDate: '2026-04-21', ReleasedDate: '2026-04-30' },
  { SlotID: 'YS027', YardID: 'Y002', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS028', YardID: 'Y002', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS029', YardID: 'Y002', ContainerID: null,    SlotStatus: 'Reserved', AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS030', YardID: 'Y002', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS031', YardID: 'Y002', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS032', YardID: 'Y002', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS033', YardID: 'Y002', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS034', YardID: 'Y002', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS035', YardID: 'Y002', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS036', YardID: 'Y002', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS037', YardID: 'Y002', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS038', YardID: 'Y002', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS039', YardID: 'Y002', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS040', YardID: 'Y002', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS041', YardID: 'Y002', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS042', YardID: 'Y002', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS043', YardID: 'Y002', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS044', YardID: 'Y002', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },

  // Charlie Yard (Y003) — 12 slots
  { SlotID: 'YS045', YardID: 'Y003', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS046', YardID: 'Y003', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS047', YardID: 'Y003', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS048', YardID: 'Y003', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS049', YardID: 'Y003', ContainerID: null,    SlotStatus: 'Reserved', AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS050', YardID: 'Y003', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS051', YardID: 'Y003', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS052', YardID: 'Y003', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS053', YardID: 'Y003', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS054', YardID: 'Y003', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS055', YardID: 'Y003', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
  { SlotID: 'YS056', YardID: 'Y003', ContainerID: null,    SlotStatus: 'Free',     AssignedDate: null,         ReleasedDate: null },
];

// ─── DRIVERS ───────────────────────────────────────────────
export const drivers = [
  { DriverID: 'D001', Name: 'Rashid Ali',     LicenseNo: 'LHR-2024-9981', Phone: '+92-300-1112233', Status: 'Available' },
  { DriverID: 'D002', Name: 'Kamran Javed',   LicenseNo: 'KHI-2023-4455', Phone: '+92-311-4445566', Status: 'OnTrip' },
  { DriverID: 'D003', Name: 'Naveed Hussain', LicenseNo: 'ISB-2025-7788', Phone: '+92-322-7778899', Status: 'Available' },
  { DriverID: 'D004', Name: 'Zubair Ahmed',   LicenseNo: 'KHI-2024-3321', Phone: '+92-333-1122334', Status: 'OffDuty' },
];

// ─── TRUCKS ────────────────────────────────────────────────
export const trucks = [
  { TruckID: 'T001', PlateNumber: 'LHR-4521-AB', Capacity: '20 Ton', Status: 'Available' },
  { TruckID: 'T002', PlateNumber: 'KHI-8834-CD', Capacity: '40 Ton', Status: 'OnRoute' },
  { TruckID: 'T003', PlateNumber: 'ISB-2210-EF', Capacity: '20 Ton', Status: 'Available' },
  { TruckID: 'T004', PlateNumber: 'KHI-6677-GH', Capacity: '40 Ton', Status: 'Maintenance' },
];

// ─── TRUCK DISPATCH (EXECUTE) ──────────────────────────────
// Links TruckID FK, ShipmentID FK, DriverID FK
export const truckDispatches = [
  { DispatchID: 'TD001', TruckID: 'T001', ShipmentID: 'SH001', DriverID: 'D001', DispatchDate: '2026-04-11', ReturnDate: '2026-04-12', Status: 'Completed', RouteInfo: 'Karachi Port → Alpha Yard Dryport' },
  { DispatchID: 'TD002', TruckID: 'T002', ShipmentID: 'SH002', DriverID: 'D002', DispatchDate: '2026-04-13', ReturnDate: null,         Status: 'InTransit',  RouteInfo: 'Bravo Yard Dryport → Karachi Port' },
  { DispatchID: 'TD003', TruckID: 'T003', ShipmentID: 'SH004', DriverID: 'D003', DispatchDate: '2026-04-19', ReturnDate: '2026-04-20', Status: 'Completed', RouteInfo: 'Lahore Dry Port → Bravo Yard' },
  { DispatchID: 'TD004', TruckID: 'T001', ShipmentID: 'SH005', DriverID: 'D001', DispatchDate: '2026-04-21', ReturnDate: '2026-04-22', Status: 'Completed', RouteInfo: 'Karachi Port → Bravo Yard' },
  { DispatchID: 'TD005', TruckID: 'T002', ShipmentID: 'SH007', DriverID: 'D002', DispatchDate: '2026-04-29', ReturnDate: null,         Status: 'InTransit',  RouteInfo: 'Gwadar Port → Alpha Yard Dryport' },
];

// ─── INVOICES ──────────────────────────────────────────────
// Amount is DYNAMICALLY CALCULATED from YardSlot duration
export const invoices = [
  { InvoiceID: 'INV001', ShipmentID: 'SH001', Amount: 0, IssueDate: '2026-04-30', DueDate: '2026-05-15', Status: 'Pending' },
  { InvoiceID: 'INV002', ShipmentID: 'SH004', Amount: 0, IssueDate: '2026-04-29', DueDate: '2026-05-14', Status: 'Paid' },
  { InvoiceID: 'INV003', ShipmentID: 'SH005', Amount: 0, IssueDate: '2026-05-01', DueDate: '2026-05-16', Status: 'Paid' },
];

// ─── PAYMENTS ──────────────────────────────────────────────
export const payments = [
  { PaymentID: 'PAY001', InvoiceID: 'INV002', Amount: 1615, PaymentDate: '2026-04-30', Method: 'Bank Transfer', Status: 'Confirmed' },
  { PaymentID: 'PAY002', InvoiceID: 'INV003', Amount: 1530, PaymentDate: '2026-05-02', Method: 'Online Payment', Status: 'Confirmed' },
];

// ─── CUSTOMS CLEARANCE ─────────────────────────────────────
export const customsClearances = [
  { ClearanceID: 'CC001', ShipmentID: 'SH001', OfficerID: 'U004', Status: 'Cleared',     ClearanceDate: '2026-04-14', Remarks: 'All documents verified. Goods conform to import regulations.' },
  { ClearanceID: 'CC002', ShipmentID: 'SH004', OfficerID: 'U004', Status: 'Cleared',     ClearanceDate: '2026-04-22', Remarks: 'Transit clearance approved. Pharmaceutical license verified.' },
  { ClearanceID: 'CC003', ShipmentID: 'SH005', OfficerID: 'U006', Status: 'Cleared',     ClearanceDate: '2026-04-25', Remarks: 'Export quality standards met.' },
  { ClearanceID: 'CC004', ShipmentID: 'SH003', OfficerID: 'U006', Status: 'UnderReview', ClearanceDate: null,         Remarks: 'Pending documentation for auto parts classification.' },
  { ClearanceID: 'CC005', ShipmentID: 'SH007', OfficerID: 'U004', Status: 'Pending',     ClearanceDate: null,         Remarks: '' },
];

// ─── BILLING RATES ─────────────────────────────────────────
export const BILLING_RATES = {
  '20ft':    50,  // $50/day
  '40ft':    85,  // $85/day
  '40ft HC': 120, // $120/day
};
