-- ============================================================
-- DRYPORT MANAGEMENT SYSTEM — Business Logic Queries
-- Dynamic Billing, Reports, and Useful Views
-- ============================================================

USE dryport_management;

-- ═══════════════════════════════════════════════
-- BILLING RATES TABLE
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS BillingRate (
    Size      VARCHAR(10) PRIMARY KEY,
    RatePerDay DECIMAL(10,2) NOT NULL
);

INSERT INTO BillingRate (Size, RatePerDay) VALUES
('20ft',    50.00),
('40ft',    85.00),
('40ft HC', 120.00)
ON DUPLICATE KEY UPDATE RatePerDay = VALUES(RatePerDay);

-- ═══════════════════════════════════════════════
-- DYNAMIC BILLING: Calculate invoice from YardSlot dates
-- ═══════════════════════════════════════════════

-- View: Billing breakdown per container
CREATE OR REPLACE VIEW vw_BillingBreakdown AS
SELECT
    s.ShipmentID,
    c.ContainerID,
    c.Size,
    ys.AssignedDate,
    ys.ReleasedDate,
    DATEDIFF(COALESCE(ys.ReleasedDate, CURDATE()), ys.AssignedDate) AS Days,
    br.RatePerDay,
    DATEDIFF(COALESCE(ys.ReleasedDate, CURDATE()), ys.AssignedDate) * br.RatePerDay AS Cost
FROM Shipment s
JOIN Container c ON c.ShipmentID = s.ShipmentID
JOIN YardSlot ys ON ys.ContainerID = c.ContainerID
JOIN BillingRate br ON br.Size = c.Size
WHERE ys.AssignedDate IS NOT NULL;

-- View: Total invoice amount per shipment
CREATE OR REPLACE VIEW vw_InvoiceTotal AS
SELECT
    ShipmentID,
    SUM(Cost) AS CalculatedAmount
FROM vw_BillingBreakdown
GROUP BY ShipmentID;

-- Procedure: Update all invoice amounts dynamically
DELIMITER //
CREATE PROCEDURE sp_UpdateInvoiceAmounts()
BEGIN
    UPDATE Invoice i
    JOIN vw_InvoiceTotal vt ON vt.ShipmentID = i.ShipmentID
    SET i.Amount = vt.CalculatedAmount;
END //
DELIMITER ;

-- Run it to populate amounts
CALL sp_UpdateInvoiceAmounts();

-- ═══════════════════════════════════════════════
-- USEFUL VIEWS & QUERIES
-- ═══════════════════════════════════════════════

-- Shipment full details with customer info
CREATE OR REPLACE VIEW vw_ShipmentDetails AS
SELECT
    s.ShipmentID, s.Type, s.Date, s.Status,
    c.CustomerID, c.CompanyName, c.Address,
    u.Name AS CustomerName, u.Email, u.Phone
FROM Shipment s
JOIN Customer c ON c.CustomerID = s.CustomerID
JOIN `User` u ON u.UserID = c.UserID;

-- Container with goods summary
CREATE OR REPLACE VIEW vw_ContainerGoods AS
SELECT
    c.ContainerID, c.Size, c.Type, c.Status, c.ShipmentID,
    COUNT(g.ItemID) AS TotalItems,
    COALESCE(SUM(g.Weight), 0) AS TotalWeight,
    COALESCE(SUM(g.Value), 0) AS TotalValue
FROM Container c
LEFT JOIN Goods g ON g.ContainerID = c.ContainerID
GROUP BY c.ContainerID, c.Size, c.Type, c.Status, c.ShipmentID;

-- Yard occupancy summary
CREATE OR REPLACE VIEW vw_YardOccupancy AS
SELECT
    y.YardID, y.Name, y.Location, y.Capacity,
    SUM(CASE WHEN ys.SlotStatus = 'Occupied' THEN 1 ELSE 0 END) AS Occupied,
    SUM(CASE WHEN ys.SlotStatus = 'Free' THEN 1 ELSE 0 END) AS Free,
    SUM(CASE WHEN ys.SlotStatus = 'Reserved' THEN 1 ELSE 0 END) AS Reserved,
    COUNT(ys.SlotID) AS TotalSlots,
    ROUND(SUM(CASE WHEN ys.SlotStatus = 'Occupied' THEN 1 ELSE 0 END) * 100.0 / COUNT(ys.SlotID), 1) AS OccupancyPct
FROM Yard y
JOIN YardSlot ys ON ys.YardID = y.YardID
GROUP BY y.YardID, y.Name, y.Location, y.Capacity;

-- Dispatch details with driver and truck info
CREATE OR REPLACE VIEW vw_DispatchDetails AS
SELECT
    td.DispatchID, td.DispatchDate, td.ReturnDate, td.Status, td.RouteInfo,
    td.ShipmentID,
    t.TruckID, t.PlateNumber, t.Capacity AS TruckCapacity,
    d.DriverID, d.Name AS DriverName, d.LicenseNo, d.Phone AS DriverPhone
FROM TruckDispatch td
JOIN Truck t ON t.TruckID = td.TruckID
JOIN Driver d ON d.DriverID = td.DriverID;

-- Tracking timeline for a shipment
CREATE OR REPLACE VIEW vw_TrackingTimeline AS
SELECT ShipmentID, 'Placed' AS Step, Date AS EventDate, CONCAT(Type, ' shipment placed') AS Detail FROM Shipment
UNION ALL
SELECT td.ShipmentID, 'Dispatched', td.DispatchDate, CONCAT('Driver: ', d.Name, ' | Truck: ', t.PlateNumber)
FROM TruckDispatch td JOIN Driver d ON d.DriverID = td.DriverID JOIN Truck t ON t.TruckID = td.TruckID
UNION ALL
SELECT c.ShipmentID, 'Stored', ys.AssignedDate, CONCAT('Container ', c.ContainerID, ' → Slot ', ys.SlotID)
FROM YardSlot ys JOIN Container c ON c.ContainerID = ys.ContainerID WHERE ys.AssignedDate IS NOT NULL
UNION ALL
SELECT s.ShipmentID, 'Customs', cc.ClearanceDate, CONCAT('Status: ', cc.Status, ' — ', COALESCE(cc.Remarks, ''))
FROM CustomsClearance cc JOIN Shipment s ON s.ShipmentID = cc.ShipmentID
UNION ALL
SELECT i.ShipmentID, 'Invoiced', i.IssueDate, CONCAT('Invoice ', i.InvoiceID, ' — $', i.Amount)
FROM Invoice i;

-- ═══════════════════════════════════════════════
-- SAMPLE QUERIES FOR EXAMINERS
-- ═══════════════════════════════════════════════

-- 1. Get all shipments for a specific customer
--SELECT * FROM vw_ShipmentDetails WHERE CustomerID = 'C001';

-- 2. Get goods inside a container
-- SELECT * FROM Goods WHERE ContainerID = 'CN001';

-- 3. Get yard occupancy
-- SELECT * FROM vw_YardOccupancy;

-- 4. Get billing breakdown for a shipment
-- SELECT * FROM vw_BillingBreakdown WHERE ShipmentID = 'SH001';

-- 5. Get tracking timeline for a shipment
-- SELECT * FROM vw_TrackingTimeline WHERE ShipmentID = 'SH001' ORDER BY EventDate;

-- 6. Dynamic billing total
-- SELECT * FROM vw_InvoiceTotal;

-- 7. Dashboard stats
-- SELECT
--     (SELECT COUNT(*) FROM Shipment) AS TotalShipments,
--     (SELECT COUNT(*) FROM Container WHERE Status IN ('Stored','InTransit')) AS ActiveContainers,
--     (SELECT ROUND(SUM(CASE WHEN SlotStatus='Occupied' THEN 1 ELSE 0 END)*100.0/COUNT(*),1) FROM YardSlot) AS YardOccupancyPct,
--     (SELECT COALESCE(SUM(Amount),0) FROM Invoice) AS TotalRevenue;
