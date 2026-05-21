# DryPort Management System

A production-grade React SPA for managing dryport operations, built to follow a normalized relational database schema.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

### Demo Logins
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@dryport.com | admin123 |
| Customer | sara@logistics.pk | cust123 |
| Transporter | bilal@transport.pk | trans123 |
| Customs Officer | ayesha@customs.gov.pk | customs123 |

---

## 📊 Entity Relationship Diagram

### Tables & Relationships

```
USER (UserID PK, Name, Email, Password, Role, Phone)
  │  Role ∈ {Admin, Customer, Transporter, CustomsOfficer}
  │
  └──→ CUSTOMER (CustomerID PK, UserID FK → USER)
        │  CompanyName, Address
        │
        └──→ SHIPMENT (ShipmentID PK, Type, Date, Status, CustomerID FK → CUSTOMER)
              │  Status: Placed → InTransit → Stored → Settled → Completed
              │
              ├──→ CONTAINER (ContainerID PK, Size, Status, Type, ShipmentID FK → SHIPMENT)
              │     │
              │     ├──→ GOODS/ITEMS (ItemID PK, Description, Weight, Quantity, Value, ContainerID FK → CONTAINER)
              │     │
              │     └──→ YARD_SLOT (SlotID PK, YardID FK → YARD, ContainerID FK → CONTAINER)
              │           SlotStatus, AssignedDate, ReleasedDate
              │
              ├──→ TRUCK_DISPATCH (DispatchID PK, TruckID FK → TRUCK, ShipmentID FK, DriverID FK → DRIVER)
              │     DispatchDate, ReturnDate, Status, RouteInfo
              │
              ├──→ INVOICE (InvoiceID PK, ShipmentID FK, Amount [DYNAMIC], IssueDate, DueDate, Status)
              │     └──→ PAYMENT (PaymentID PK, InvoiceID FK, Amount, PaymentDate, Method, Status)
              │
              └──→ CUSTOMS_CLEARANCE (ClearanceID PK, ShipmentID FK, OfficerID FK → USER, Status, ClearanceDate, Remarks)

YARD (YardID PK, Name, Location, Capacity) ←── YARD_SLOT (1-to-Many)
TRUCK (TruckID PK, PlateNumber, Capacity, Status)
DRIVER (DriverID PK, Name, LicenseNo, Phone, Status)
```

### Cardinality
- 1 User → 1 Customer (for Customer role)
- 1 Customer → Many Shipments
- 1 Shipment → Many Containers
- 1 Container → Many Goods/Items
- 1 Yard → Many YardSlots
- 1 Container → 0..1 YardSlot
- 1 Shipment → Many TruckDispatches
- 1 Shipment → Many Invoices
- 1 Invoice → Many Payments

---

## 💡 Business Logic

### Dynamic Billing Engine
Invoice amounts are **not static**. They are calculated:
```
Amount = Σ (for each container in shipment):
  days = |YardSlot.ReleasedDate - YardSlot.AssignedDate|
  rate  = BILLING_RATES[Container.Size]
  cost  = days × rate

Rates: 20ft=$50/day | 40ft=$85/day | 40ft HC=$120/day
```

### RBAC Permissions
| Feature | Admin | Customer | Transporter | Customs Officer |
|---------|-------|----------|-------------|-----------------|
| Dashboard | Full | Own data | Dispatch view | Clearance view |
| Shipments | All | Own only | Assigned | Assigned |
| Yard Map | Full | Read-only | Read-only | — |
| Dispatch | Full | — | Full | — |
| Billing | Full | Own invoices | — | — |
| Customs | Full | View own | — | Full |
| Users | Full | — | — | — |

### Operational Workflow
1. Customer **Places** a Shipment
2. Admin assigns **Containers** to the Shipment
3. Admin creates **Truck_Dispatch** → Status: InTransit
4. Containers arrive → assigned to **YardSlots** → Status: Stored
5. Customs Officer processes **Clearance**
6. **Invoice** auto-generated from YardSlot duration → Status: Settled
7. Customer makes **Payment** → Shipment Completed

---

## 🏗️ Architecture

```
src/
├── context/AuthContext.jsx    # Auth + RBAC
├── data/
│   ├── schema.js              # Normalized data (13 tables)
│   └── helpers.js             # Relational queries + billing engine
├── components/
│   ├── Login.jsx              # Auth with demo logins
│   ├── Layout.jsx             # Sidebar + RBAC navigation
│   ├── Dashboard.jsx          # KPI stats + charts
│   ├── Shipments.jsx          # Primary entry + containers + goods
│   ├── YardMap.jsx            # Visual grid + slot details
│   ├── Tracking.jsx           # Timeline search
│   ├── TruckDispatch.jsx      # Dispatch operations
│   ├── Billing.jsx            # Dynamic invoices + payments
│   ├── Customs.jsx            # Clearance management
│   └── UserManagement.jsx     # Admin RBAC management
├── App.jsx                    # Routes + providers
├── main.jsx                   # Entry point
└── index.css                  # Design system
```

## Tech Stack
- React 18 + Vite
- React Router v6
- Vanilla CSS (glassmorphism dark theme)
- Context API + RBAC
