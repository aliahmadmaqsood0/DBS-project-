-- ============================================================
-- DRYPORT MANAGEMENT SYSTEM — Sample Data (INSERT)
-- Matches the normalized data used in the React frontend
-- ============================================================

USE dryport_management;

-- ─── USERS ─────────────────────────────────────
INSERT INTO `User` (UserID, Name, Email, Password, Role, Phone) VALUES
('U001', 'Arjun Mehta',     'admin@dryport.com',      'admin123',   'Admin',          '+92-300-1234567'),
('U002', 'Sara Qureshi',    'sara@logistics.pk',      'cust123',    'Customer',       '+92-321-9876543'),
('U003', 'Bilal Khan',      'bilal@transport.pk',     'trans123',   'Transporter',    '+92-333-5551234'),
('U004', 'Ayesha Siddiqui', 'ayesha@customs.gov.pk',  'customs123', 'CustomsOfficer', '+92-345-7778899'),
('U005', 'Usman Tariq',     'usman@shipping.pk',      'cust456',    'Customer',       '+92-312-4445566'),
('U006', 'Fatima Noor',     'fatima@customs.gov.pk',  'customs456', 'CustomsOfficer', '+92-301-2223344');

-- ─── CUSTOMERS ─────────────────────────────────
INSERT INTO Customer (CustomerID, UserID, CompanyName, Address) VALUES
('C001', 'U002', 'Qureshi Logistics Pvt Ltd',   '14-B, Industrial Area, Karachi'),
('C002', 'U005', 'Tariq International Trading',  '88 Commercial Zone, Lahore');

-- ─── SHIPMENTS ─────────────────────────────────
INSERT INTO Shipment (ShipmentID, Type, Date, Status, CustomerID) VALUES
('SH001', 'Import',  '2026-04-10', 'Stored',    'C001'),
('SH002', 'Export',  '2026-04-12', 'InTransit', 'C001'),
('SH003', 'Import',  '2026-04-15', 'Placed',    'C002'),
('SH004', 'Transit', '2026-04-18', 'Settled',   'C002'),
('SH005', 'Import',  '2026-04-20', 'Completed', 'C001'),
('SH006', 'Export',  '2026-04-25', 'Placed',    'C002'),
('SH007', 'Import',  '2026-04-28', 'InTransit', 'C001');

-- ─── CONTAINERS ────────────────────────────────
INSERT INTO Container (ContainerID, Size, Status, Type, ShipmentID) VALUES
('CN001', '20ft',    'Stored',    'Dry',          'SH001'),
('CN002', '40ft',    'Stored',    'Refrigerated', 'SH001'),
('CN003', '20ft',    'InTransit', 'Dry',          'SH002'),
('CN004', '40ft HC', 'InTransit', 'Open Top',     'SH002'),
('CN005', '20ft',    'Pending',   'Dry',          'SH003'),
('CN006', '40ft',    'Released',  'Flat Rack',    'SH004'),
('CN007', '40ft HC', 'Released',  'Refrigerated', 'SH005'),
('CN008', '20ft',    'Pending',   'Dry',          'SH006'),
('CN009', '40ft',    'InTransit', 'Dry',          'SH007');

-- ─── GOODS / ITEMS ─────────────────────────────
INSERT INTO Goods (ItemID, Description, Weight, Quantity, Value, ContainerID) VALUES
('G001', 'Textile Raw Cotton Bales',   2400.00,  120,  48000.00,  'CN001'),
('G002', 'Surgical Instruments Set',   350.00,   500,  125000.00, 'CN001'),
('G003', 'Frozen Seafood Prawns',      8000.00,  200,  96000.00,  'CN002'),
('G004', 'Basmati Rice Premium Grade', 12000.00, 600,  72000.00,  'CN003'),
('G005', 'Leather Finished Goods',     3200.00,  80,   64000.00,  'CN004'),
('G006', 'Auto Spare Parts',           5600.00,  340,  102000.00, 'CN005'),
('G007', 'Pharmaceutical Tablets',     900.00,   1500, 230000.00, 'CN006'),
('G008', 'Ceramic Tiles Assorted',     15000.00, 3000, 45000.00,  'CN006'),
('G009', 'Frozen Mangoes Export',      6000.00,  300,  54000.00,  'CN007'),
('G010', 'Cotton Yarn Cones',          7500.00,  450,  67500.00,  'CN008'),
('G011', 'Steel Coils Industrial',     20000.00, 10,   180000.00, 'CN009'),
('G012', 'Plastic Granules HDPE',      4200.00,  200,  33600.00,  'CN009');

-- ─── YARDS ─────────────────────────────────────
INSERT INTO Yard (YardID, Name, Location, Capacity) VALUES
('Y001', 'Alpha Yard',   'North Block, Dryport Terminal', 24),
('Y002', 'Bravo Yard',   'South Block, Dryport Terminal', 20),
('Y003', 'Charlie Yard', 'East Wing, Cold Storage Zone',  12);

-- ─── YARD SLOTS ────────────────────────────────
-- Alpha Yard (24 slots)
INSERT INTO YardSlot (SlotID, YardID, ContainerID, SlotStatus, AssignedDate, ReleasedDate) VALUES
('YS001', 'Y001', 'CN001', 'Occupied', '2026-04-12', NULL),
('YS002', 'Y001', 'CN002', 'Occupied', '2026-04-12', NULL),
('YS003', 'Y001', NULL,    'Free',     NULL, NULL),
('YS004', 'Y001', NULL,    'Free',     NULL, NULL),
('YS005', 'Y001', NULL,    'Reserved', NULL, NULL),
('YS006', 'Y001', NULL,    'Free',     NULL, NULL),
('YS007', 'Y001', NULL,    'Free',     NULL, NULL),
('YS008', 'Y001', NULL,    'Free',     NULL, NULL),
('YS009', 'Y001', NULL,    'Free',     NULL, NULL),
('YS010', 'Y001', NULL,    'Free',     NULL, NULL),
('YS011', 'Y001', NULL,    'Free',     NULL, NULL),
('YS012', 'Y001', NULL,    'Free',     NULL, NULL),
('YS013', 'Y001', NULL,    'Free',     NULL, NULL),
('YS014', 'Y001', NULL,    'Free',     NULL, NULL),
('YS015', 'Y001', NULL,    'Free',     NULL, NULL),
('YS016', 'Y001', NULL,    'Free',     NULL, NULL),
('YS017', 'Y001', NULL,    'Free',     NULL, NULL),
('YS018', 'Y001', NULL,    'Free',     NULL, NULL),
('YS019', 'Y001', NULL,    'Free',     NULL, NULL),
('YS020', 'Y001', NULL,    'Free',     NULL, NULL),
('YS021', 'Y001', NULL,    'Free',     NULL, NULL),
('YS022', 'Y001', NULL,    'Free',     NULL, NULL),
('YS023', 'Y001', NULL,    'Free',     NULL, NULL),
('YS024', 'Y001', NULL,    'Free',     NULL, NULL);

-- Bravo Yard (20 slots)
INSERT INTO YardSlot (SlotID, YardID, ContainerID, SlotStatus, AssignedDate, ReleasedDate) VALUES
('YS025', 'Y002', 'CN006', 'Occupied', '2026-04-19', '2026-04-28'),
('YS026', 'Y002', 'CN007', 'Occupied', '2026-04-21', '2026-04-30'),
('YS027', 'Y002', NULL,    'Free',     NULL, NULL),
('YS028', 'Y002', NULL,    'Free',     NULL, NULL),
('YS029', 'Y002', NULL,    'Reserved', NULL, NULL),
('YS030', 'Y002', NULL,    'Free',     NULL, NULL),
('YS031', 'Y002', NULL,    'Free',     NULL, NULL),
('YS032', 'Y002', NULL,    'Free',     NULL, NULL),
('YS033', 'Y002', NULL,    'Free',     NULL, NULL),
('YS034', 'Y002', NULL,    'Free',     NULL, NULL),
('YS035', 'Y002', NULL,    'Free',     NULL, NULL),
('YS036', 'Y002', NULL,    'Free',     NULL, NULL),
('YS037', 'Y002', NULL,    'Free',     NULL, NULL),
('YS038', 'Y002', NULL,    'Free',     NULL, NULL),
('YS039', 'Y002', NULL,    'Free',     NULL, NULL),
('YS040', 'Y002', NULL,    'Free',     NULL, NULL),
('YS041', 'Y002', NULL,    'Free',     NULL, NULL),
('YS042', 'Y002', NULL,    'Free',     NULL, NULL),
('YS043', 'Y002', NULL,    'Free',     NULL, NULL),
('YS044', 'Y002', NULL,    'Free',     NULL, NULL);

-- Charlie Yard (12 slots)
INSERT INTO YardSlot (SlotID, YardID, ContainerID, SlotStatus, AssignedDate, ReleasedDate) VALUES
('YS045', 'Y003', NULL, 'Free',     NULL, NULL),
('YS046', 'Y003', NULL, 'Free',     NULL, NULL),
('YS047', 'Y003', NULL, 'Free',     NULL, NULL),
('YS048', 'Y003', NULL, 'Free',     NULL, NULL),
('YS049', 'Y003', NULL, 'Reserved', NULL, NULL),
('YS050', 'Y003', NULL, 'Free',     NULL, NULL),
('YS051', 'Y003', NULL, 'Free',     NULL, NULL),
('YS052', 'Y003', NULL, 'Free',     NULL, NULL),
('YS053', 'Y003', NULL, 'Free',     NULL, NULL),
('YS054', 'Y003', NULL, 'Free',     NULL, NULL),
('YS055', 'Y003', NULL, 'Free',     NULL, NULL),
('YS056', 'Y003', NULL, 'Free',     NULL, NULL);

-- ─── DRIVERS ───────────────────────────────────
INSERT INTO Driver (DriverID, Name, LicenseNo, Phone, Status) VALUES
('D001', 'Rashid Ali',     'LHR-2024-9981', '+92-300-1112233', 'Available'),
('D002', 'Kamran Javed',   'KHI-2023-4455', '+92-311-4445566', 'OnTrip'),
('D003', 'Naveed Hussain', 'ISB-2025-7788', '+92-322-7778899', 'Available'),
('D004', 'Zubair Ahmed',   'KHI-2024-3321', '+92-333-1122334', 'OffDuty');

-- ─── TRUCKS ────────────────────────────────────
INSERT INTO Truck (TruckID, PlateNumber, Capacity, Status) VALUES
('T001', 'LHR-4521-AB', '20 Ton', 'Available'),
('T002', 'KHI-8834-CD', '40 Ton', 'OnRoute'),
('T003', 'ISB-2210-EF', '20 Ton', 'Available'),
('T004', 'KHI-6677-GH', '40 Ton', 'Maintenance');

-- ─── TRUCK DISPATCH ────────────────────────────
INSERT INTO TruckDispatch (DispatchID, TruckID, ShipmentID, DriverID, DispatchDate, ReturnDate, Status, RouteInfo) VALUES
('TD001', 'T001', 'SH001', 'D001', '2026-04-11', '2026-04-12', 'Completed', 'Karachi Port → Alpha Yard Dryport'),
('TD002', 'T002', 'SH002', 'D002', '2026-04-13', NULL,         'InTransit', 'Bravo Yard Dryport → Karachi Port'),
('TD003', 'T003', 'SH004', 'D003', '2026-04-19', '2026-04-20', 'Completed', 'Lahore Dry Port → Bravo Yard'),
('TD004', 'T001', 'SH005', 'D001', '2026-04-21', '2026-04-22', 'Completed', 'Karachi Port → Bravo Yard'),
('TD005', 'T002', 'SH007', 'D002', '2026-04-29', NULL,         'InTransit', 'Gwadar Port → Alpha Yard Dryport');

-- ─── INVOICES ──────────────────────────────────
-- Amount will be updated by the dynamic billing procedure
INSERT INTO Invoice (InvoiceID, ShipmentID, Amount, IssueDate, DueDate, Status) VALUES
('INV001', 'SH001', 0.00, '2026-04-30', '2026-05-15', 'Pending'),
('INV002', 'SH004', 0.00, '2026-04-29', '2026-05-14', 'Paid'),
('INV003', 'SH005', 0.00, '2026-05-01', '2026-05-16', 'Paid');

-- ─── PAYMENTS ──────────────────────────────────
INSERT INTO Payment (PaymentID, InvoiceID, Amount, PaymentDate, Method, Status) VALUES
('PAY001', 'INV002', 1615.00, '2026-04-30', 'Bank Transfer',  'Confirmed'),
('PAY002', 'INV003', 1530.00, '2026-05-02', 'Online Payment', 'Confirmed');

-- ─── CUSTOMS CLEARANCE ─────────────────────────
INSERT INTO CustomsClearance (ClearanceID, ShipmentID, OfficerID, Status, ClearanceDate, Remarks) VALUES
('CC001', 'SH001', 'U004', 'Cleared',     '2026-04-14', 'All documents verified. Goods conform to import regulations.'),
('CC002', 'SH004', 'U004', 'Cleared',     '2026-04-22', 'Transit clearance approved. Pharmaceutical license verified.'),
('CC003', 'SH005', 'U006', 'Cleared',     '2026-04-25', 'Export quality standards met.'),
('CC004', 'SH003', 'U006', 'UnderReview', NULL,          'Pending documentation for auto parts classification.'),
('CC005', 'SH007', 'U004', 'Pending',     NULL,          NULL);
