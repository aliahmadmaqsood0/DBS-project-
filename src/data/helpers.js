// ============================================================
// DRYPORT MANAGEMENT SYSTEM — Relational Query Helpers
// These functions simulate JOINs across the normalized schema
// ============================================================

import {
  users, customers, shipments, containers, goods,
  yards, yardSlots, drivers, trucks, truckDispatches,
  invoices, payments, customsClearances, BILLING_RATES
} from './schema';

// ─── USER / CUSTOMER HELPERS ───────────────────────────────

export function getUserById(userID) {
  return users.find(u => u.UserID === userID);
}

export function getCustomerByUserId(userID) {
  return customers.find(c => c.UserID === userID);
}

export function getCustomerById(customerID) {
  return customers.find(c => c.CustomerID === customerID);
}

export function getUserByCustomerId(customerID) {
  const cust = getCustomerById(customerID);
  return cust ? getUserById(cust.UserID) : null;
}

// ─── SHIPMENT HELPERS ──────────────────────────────────────

export function getShipmentsByCustomer(customerID) {
  return shipments.filter(s => s.CustomerID === customerID);
}

export function getShipmentById(shipmentID) {
  return shipments.find(s => s.ShipmentID === shipmentID);
}

export function getShipmentsForUser(user) {
  if (!user) return [];
  switch (user.Role) {
    case 'Admin':
      return [...shipments];
    case 'Customer': {
      const cust = getCustomerByUserId(user.UserID);
      return cust ? getShipmentsByCustomer(cust.CustomerID) : [];
    }
    case 'Transporter': {
      const dispatchShipmentIds = truckDispatches.map(d => d.ShipmentID);
      return shipments.filter(s => dispatchShipmentIds.includes(s.ShipmentID));
    }
    case 'CustomsOfficer': {
      const clearanceShipmentIds = customsClearances
        .filter(c => c.OfficerID === user.UserID)
        .map(c => c.ShipmentID);
      return shipments.filter(s => clearanceShipmentIds.includes(s.ShipmentID));
    }
    default:
      return [];
  }
}

// ─── CONTAINER HELPERS ─────────────────────────────────────

export function getContainersByShipment(shipmentID) {
  return containers.filter(c => c.ShipmentID === shipmentID);
}

export function getContainerById(containerID) {
  return containers.find(c => c.ContainerID === containerID);
}

// ─── GOODS / ITEMS HELPERS ─────────────────────────────────

export function getItemsByContainer(containerID) {
  return goods.filter(g => g.ContainerID === containerID);
}

export function getTotalValueByContainer(containerID) {
  return getItemsByContainer(containerID).reduce((sum, g) => sum + g.Value, 0);
}

export function getTotalWeightByContainer(containerID) {
  return getItemsByContainer(containerID).reduce((sum, g) => sum + g.Weight, 0);
}

// ─── YARD & YARD SLOT HELPERS ──────────────────────────────

export function getYardById(yardID) {
  return yards.find(y => y.YardID === yardID);
}

export function getYardSlotsByYard(yardID) {
  return yardSlots.filter(ys => ys.YardID === yardID);
}

export function getYardSlotByContainer(containerID) {
  return yardSlots.find(ys => ys.ContainerID === containerID);
}

export function getYardOccupancy(yardID) {
  const slots = getYardSlotsByYard(yardID);
  const occupied = slots.filter(s => s.SlotStatus === 'Occupied').length;
  const reserved = slots.filter(s => s.SlotStatus === 'Reserved').length;
  return { total: slots.length, occupied, reserved, free: slots.length - occupied - reserved };
}

// ─── TRUCK DISPATCH HELPERS ────────────────────────────────

export function getDispatchesByShipment(shipmentID) {
  return truckDispatches.filter(d => d.ShipmentID === shipmentID);
}

export function getDriverById(driverID) {
  return drivers.find(d => d.DriverID === driverID);
}

export function getTruckById(truckID) {
  return trucks.find(t => t.TruckID === truckID);
}

// ─── DYNAMIC BILLING ENGINE ───────────────────────────────
// Calculates invoice amount from YardSlot.AssignedDate → ReleasedDate

export function daysBetween(date1Str, date2Str) {
  const d1 = new Date(date1Str);
  const d2 = date2Str ? new Date(date2Str) : new Date(); // If not released, bill to today
  const diffMs = Math.abs(d2 - d1);
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function calculateInvoiceAmount(shipmentID) {
  const shipContainers = getContainersByShipment(shipmentID);
  let total = 0;
  const breakdown = [];

  for (const container of shipContainers) {
    const slot = getYardSlotByContainer(container.ContainerID);
    if (slot && slot.AssignedDate) {
      const days = daysBetween(slot.AssignedDate, slot.ReleasedDate);
      const rate = BILLING_RATES[container.Size] || 50;
      const cost = days * rate;
      total += cost;
      breakdown.push({
        containerID: container.ContainerID,
        size: container.Size,
        days,
        rate,
        cost,
        assignedDate: slot.AssignedDate,
        releasedDate: slot.ReleasedDate || 'Ongoing',
      });
    }
  }

  return { total, breakdown };
}

// ─── INVOICE & PAYMENT HELPERS ─────────────────────────────

export function getInvoicesByShipment(shipmentID) {
  return invoices.filter(inv => inv.ShipmentID === shipmentID);
}

export function getPaymentsByInvoice(invoiceID) {
  return payments.filter(p => p.InvoiceID === invoiceID);
}

export function getInvoicesForUser(user) {
  if (!user) return [];
  if (user.Role === 'Admin') return [...invoices];
  if (user.Role === 'Customer') {
    const cust = getCustomerByUserId(user.UserID);
    if (!cust) return [];
    const shipIds = getShipmentsByCustomer(cust.CustomerID).map(s => s.ShipmentID);
    return invoices.filter(inv => shipIds.includes(inv.ShipmentID));
  }
  return [];
}

// ─── CUSTOMS CLEARANCE HELPERS ─────────────────────────────

export function getClearancesByShipment(shipmentID) {
  return customsClearances.filter(c => c.ShipmentID === shipmentID);
}

export function getClearancesForUser(user) {
  if (!user) return [];
  if (user.Role === 'Admin') return [...customsClearances];
  if (user.Role === 'CustomsOfficer') {
    return customsClearances.filter(c => c.OfficerID === user.UserID);
  }
  if (user.Role === 'Customer') {
    const cust = getCustomerByUserId(user.UserID);
    if (!cust) return [];
    const shipIds = getShipmentsByCustomer(cust.CustomerID).map(s => s.ShipmentID);
    return customsClearances.filter(c => shipIds.includes(c.ShipmentID));
  }
  return [];
}

// ─── TRACKING TIMELINE ─────────────────────────────────────
// Aggregates data from Shipment + TruckDispatch + YardSlot + Customs

export function getTrackingTimeline(identifier) {
  // identifier can be ShipmentID or ContainerID
  let shipment = shipments.find(s => s.ShipmentID === identifier);
  let targetContainers;

  if (!shipment) {
    // Try as ContainerID
    const container = getContainerById(identifier);
    if (!container) return null;
    shipment = getShipmentById(container.ShipmentID);
    targetContainers = [container];
  } else {
    targetContainers = getContainersByShipment(shipment.ShipmentID);
  }

  if (!shipment) return null;

  const timeline = [];
  const customer = getCustomerById(shipment.CustomerID);
  const customerUser = customer ? getUserById(customer.UserID) : null;

  // 1. Shipment Placed
  timeline.push({
    step: 'Placed',
    title: 'Shipment Placed',
    date: shipment.Date,
    detail: `${shipment.Type} shipment placed by ${customerUser?.Name || 'Customer'}`,
    status: 'completed',
    icon: '📦',
  });

  // 2. Truck Dispatched
  const dispatches = getDispatchesByShipment(shipment.ShipmentID);
  if (dispatches.length > 0) {
    const dispatch = dispatches[0];
    const driver = getDriverById(dispatch.DriverID);
    const truck = getTruckById(dispatch.TruckID);
    timeline.push({
      step: 'Dispatched',
      title: 'Truck Dispatched',
      date: dispatch.DispatchDate,
      detail: `Driver: ${driver?.Name || 'N/A'} | Truck: ${truck?.PlateNumber || 'N/A'} | Route: ${dispatch.RouteInfo}`,
      status: dispatch.Status === 'InTransit' ? 'active' : 'completed',
      icon: '🚛',
    });

    // 3. In Transit
    if (dispatch.Status === 'InTransit') {
      timeline.push({
        step: 'InTransit',
        title: 'In Transit',
        date: dispatch.DispatchDate,
        detail: `Currently en route: ${dispatch.RouteInfo}`,
        status: 'active',
        icon: '🛣️',
      });
    }

    // 4. Arrived / Return
    if (dispatch.ReturnDate) {
      timeline.push({
        step: 'Arrived',
        title: 'Arrived at Destination',
        date: dispatch.ReturnDate,
        detail: `Truck returned on ${dispatch.ReturnDate}`,
        status: 'completed',
        icon: '✅',
      });
    }
  }

  // 5. Stored in Yard
  for (const container of targetContainers) {
    const slot = getYardSlotByContainer(container.ContainerID);
    if (slot) {
      const yard = getYardById(slot.YardID);
      timeline.push({
        step: 'Stored',
        title: `Container ${container.ContainerID} Stored`,
        date: slot.AssignedDate,
        detail: `${yard?.Name || 'Yard'} — Slot ${slot.SlotID} | Size: ${container.Size}`,
        status: slot.ReleasedDate ? 'completed' : 'active',
        icon: '🏗️',
      });

      if (slot.ReleasedDate) {
        timeline.push({
          step: 'Released',
          title: `Container ${container.ContainerID} Released`,
          date: slot.ReleasedDate,
          detail: `Released from ${yard?.Name || 'Yard'} Slot ${slot.SlotID}`,
          status: 'completed',
          icon: '📤',
        });
      }
    }
  }

  // 6. Customs Clearance
  const clearances = getClearancesByShipment(shipment.ShipmentID);
  if (clearances.length > 0) {
    const cl = clearances[0];
    const officer = getUserById(cl.OfficerID);
    timeline.push({
      step: 'CustomsClearance',
      title: 'Customs Clearance',
      date: cl.ClearanceDate || 'Pending',
      detail: `Officer: ${officer?.Name || 'N/A'} | Status: ${cl.Status}${cl.Remarks ? ' — ' + cl.Remarks : ''}`,
      status: cl.Status === 'Cleared' ? 'completed' : cl.Status === 'UnderReview' ? 'active' : 'pending',
      icon: '🛂',
    });
  }

  // 7. Invoice / Settlement
  const invs = getInvoicesByShipment(shipment.ShipmentID);
  if (invs.length > 0) {
    const inv = invs[0];
    const billing = calculateInvoiceAmount(shipment.ShipmentID);
    timeline.push({
      step: 'Settled',
      title: 'Invoice Generated',
      date: inv.IssueDate,
      detail: `Invoice ${inv.InvoiceID} — Amount: $${billing.total.toLocaleString()} | Status: ${inv.Status}`,
      status: inv.Status === 'Paid' ? 'completed' : 'active',
      icon: '💰',
    });
  }

  // 8. Payment
  for (const inv of invs) {
    const pays = getPaymentsByInvoice(inv.InvoiceID);
    for (const pay of pays) {
      timeline.push({
        step: 'Payment',
        title: 'Payment Received',
        date: pay.PaymentDate,
        detail: `$${pay.Amount.toLocaleString()} via ${pay.Method} — ${pay.Status}`,
        status: 'completed',
        icon: '✅',
      });
    }
  }

  // Sort by date
  timeline.sort((a, b) => {
    if (a.date === 'Pending') return 1;
    if (b.date === 'Pending') return -1;
    return new Date(a.date) - new Date(b.date);
  });

  return { shipment, containers: targetContainers, timeline };
}

// ─── DASHBOARD STATS ───────────────────────────────────────

export function getDashboardStats(user) {
  const userShipments = getShipmentsForUser(user);
  const allSlots = yardSlots;
  const occupiedSlots = allSlots.filter(s => s.SlotStatus === 'Occupied').length;
  const totalSlots = allSlots.length;

  let totalRevenue = 0;
  for (const inv of invoices) {
    const billing = calculateInvoiceAmount(inv.ShipmentID);
    totalRevenue += billing.total;
  }

  return {
    totalShipments: userShipments.length,
    activeContainers: containers.filter(c => c.Status === 'Stored' || c.Status === 'InTransit').length,
    yardOccupancy: Math.round((occupiedSlots / totalSlots) * 100),
    occupiedSlots,
    totalSlots,
    totalRevenue,
    pendingClearances: customsClearances.filter(c => c.Status !== 'Cleared').length,
    activeTrucks: trucks.filter(t => t.Status === 'OnRoute').length,
    shipmentsByStatus: {
      Placed: userShipments.filter(s => s.Status === 'Placed').length,
      InTransit: userShipments.filter(s => s.Status === 'InTransit').length,
      Stored: userShipments.filter(s => s.Status === 'Stored').length,
      Settled: userShipments.filter(s => s.Status === 'Settled').length,
      Completed: userShipments.filter(s => s.Status === 'Completed').length,
    }
  };
}
