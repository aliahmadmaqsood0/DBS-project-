-- ============================================================
-- DRYPORT MANAGEMENT SYSTEM — Database Schema
-- Follows the ER Diagram with all FK constraints
-- ============================================================

CREATE DATABASE IF NOT EXISTS dryport_management;
USE dryport_management;

-- ─── USER TABLE ────────────────────────────────
CREATE TABLE `User` (
    UserID      VARCHAR(10) PRIMARY KEY,
    Name        VARCHAR(100) NOT NULL,
    Email       VARCHAR(100) NOT NULL UNIQUE,
    Password    VARCHAR(255) NOT NULL,
    Role        ENUM('Admin','Customer','Transporter','CustomsOfficer') NOT NULL,
    Phone       VARCHAR(20)
);

-- ─── CUSTOMER TABLE (FK → User) ───────────────
CREATE TABLE Customer (
    CustomerID  VARCHAR(10) PRIMARY KEY,
    UserID      VARCHAR(10) NOT NULL UNIQUE,
    CompanyName VARCHAR(150) NOT NULL,
    Address     VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES `User`(UserID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ─── SHIPMENT TABLE (FK → Customer) ───────────
CREATE TABLE Shipment (
    ShipmentID  VARCHAR(10) PRIMARY KEY,
    Type        ENUM('Import','Export','Transit') NOT NULL,
    Date        DATE NOT NULL,
    Status      ENUM('Placed','InTransit','Stored','Settled','Completed') NOT NULL DEFAULT 'Placed',
    CustomerID  VARCHAR(10) NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ─── CONTAINER TABLE (FK → Shipment) ──────────
CREATE TABLE Container (
    ContainerID VARCHAR(10) PRIMARY KEY,
    Size        ENUM('20ft','40ft','40ft HC') NOT NULL,
    Status      ENUM('Pending','InTransit','Stored','Released') NOT NULL DEFAULT 'Pending',
    Type        VARCHAR(50) NOT NULL,
    ShipmentID  VARCHAR(10) NOT NULL,
    FOREIGN KEY (ShipmentID) REFERENCES Shipment(ShipmentID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ─── GOODS / ITEMS TABLE (FK → Container) ─────
CREATE TABLE Goods (
    ItemID       VARCHAR(10) PRIMARY KEY,
    Description  VARCHAR(255) NOT NULL,
    Weight       DECIMAL(10,2) NOT NULL,
    Quantity     INT NOT NULL,
    Value        DECIMAL(12,2) NOT NULL,
    ContainerID  VARCHAR(10) NOT NULL,
    FOREIGN KEY (ContainerID) REFERENCES Container(ContainerID)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- ─── YARD TABLE ────────────────────────────────
CREATE TABLE Yard (
    YardID    VARCHAR(10) PRIMARY KEY,
    Name      VARCHAR(100) NOT NULL,
    Location  VARCHAR(255),
    Capacity  INT NOT NULL
);

-- ─── YARD SLOT TABLE (FK → Yard, Container) ───
CREATE TABLE YardSlot (
    SlotID       VARCHAR(10) PRIMARY KEY,
    YardID       VARCHAR(10) NOT NULL,
    ContainerID  VARCHAR(10) DEFAULT NULL,
    SlotStatus   ENUM('Free','Occupied','Reserved') NOT NULL DEFAULT 'Free',
    AssignedDate DATE DEFAULT NULL,
    ReleasedDate DATE DEFAULT NULL,
    FOREIGN KEY (YardID) REFERENCES Yard(YardID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (ContainerID) REFERENCES Container(ContainerID)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- ─── DRIVER TABLE ──────────────────────────────
CREATE TABLE Driver (
    DriverID   VARCHAR(10) PRIMARY KEY,
    Name       VARCHAR(100) NOT NULL,
    LicenseNo  VARCHAR(50) NOT NULL UNIQUE,
    Phone      VARCHAR(20),
    Status     ENUM('Available','OnTrip','OffDuty') NOT NULL DEFAULT 'Available'
);

-- ─── TRUCK TABLE ───────────────────────────────
CREATE TABLE Truck (
    TruckID     VARCHAR(10) PRIMARY KEY,
    PlateNumber VARCHAR(20) NOT NULL UNIQUE,
    Capacity    VARCHAR(20) NOT NULL,
    Status      ENUM('Available','OnRoute','Maintenance') NOT NULL DEFAULT 'Available'
);

-- ─── TRUCK DISPATCH / EXECUTE (FK → Truck, Shipment, Driver) ──
CREATE TABLE TruckDispatch (
    DispatchID   VARCHAR(10) PRIMARY KEY,
    TruckID      VARCHAR(10) NOT NULL,
    ShipmentID   VARCHAR(10) NOT NULL,
    DriverID     VARCHAR(10) NOT NULL,
    DispatchDate DATE NOT NULL,
    ReturnDate   DATE DEFAULT NULL,
    Status       ENUM('Pending','InTransit','Completed') NOT NULL DEFAULT 'Pending',
    RouteInfo    VARCHAR(255),
    FOREIGN KEY (TruckID) REFERENCES Truck(TruckID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (ShipmentID) REFERENCES Shipment(ShipmentID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (DriverID) REFERENCES Driver(DriverID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ─── INVOICE TABLE (FK → Shipment) ────────────
-- Amount is DYNAMICALLY CALCULATED from YardSlot duration
CREATE TABLE Invoice (
    InvoiceID   VARCHAR(10) PRIMARY KEY,
    ShipmentID  VARCHAR(10) NOT NULL,
    Amount      DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    IssueDate   DATE NOT NULL,
    DueDate     DATE NOT NULL,
    Status      ENUM('Pending','Paid','Overdue') NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (ShipmentID) REFERENCES Shipment(ShipmentID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ─── PAYMENT TABLE (FK → Invoice) ─────────────
CREATE TABLE Payment (
    PaymentID    VARCHAR(10) PRIMARY KEY,
    InvoiceID    VARCHAR(10) NOT NULL,
    Amount       DECIMAL(12,2) NOT NULL,
    PaymentDate  DATE NOT NULL,
    Method       VARCHAR(50) NOT NULL,
    Status       ENUM('Pending','Confirmed','Failed') NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (InvoiceID) REFERENCES Invoice(InvoiceID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ─── CUSTOMS CLEARANCE TABLE (FK → Shipment, User) ──
CREATE TABLE CustomsClearance (
    ClearanceID   VARCHAR(10) PRIMARY KEY,
    ShipmentID    VARCHAR(10) NOT NULL,
    OfficerID     VARCHAR(10) NOT NULL,
    Status        ENUM('Pending','UnderReview','Cleared','Rejected') NOT NULL DEFAULT 'Pending',
    ClearanceDate DATE DEFAULT NULL,
    Remarks       TEXT,
    FOREIGN KEY (ShipmentID) REFERENCES Shipment(ShipmentID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (OfficerID) REFERENCES `User`(UserID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);
