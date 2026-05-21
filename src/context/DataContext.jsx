import { createContext, useContext, useState, useCallback } from 'react';
import {
  users as initialUsers,
  customers as initialCustomers,
  shipments as initialShipments,
  containers as initialContainers,
  goods as initialGoods,
  yards as initialYards,
  yardSlots as initialYardSlots,
  drivers as initialDrivers,
  trucks as initialTrucks,
  truckDispatches as initialDispatches,
  invoices as initialInvoices,
  payments as initialPayments,
  customsClearances as initialClearances,
  BILLING_RATES,
} from '../data/schema';

const DataContext = createContext(null);

function nextId(arr, prefix) {
  const nums = arr.map(item => {
    const key = Object.keys(item)[0];
    const val = item[key];
    const n = parseInt(val.replace(/\D/g, ''), 10);
    return isNaN(n) ? 0 : n;
  });
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `${prefix}${String(max + 1).padStart(3, '0')}`;
}

export function DataProvider({ children }) {
  const [users, setUsers] = useState([...initialUsers]);
  const [customers, setCustomers] = useState([...initialCustomers]);
  const [shipments, setShipments] = useState([...initialShipments]);
  const [containers, setContainers] = useState([...initialContainers]);
  const [goods, setGoods] = useState([...initialGoods]);
  const [yards] = useState([...initialYards]);
  const [yardSlots, setYardSlots] = useState([...initialYardSlots]);
  const [drivers, setDrivers] = useState([...initialDrivers]);
  const [trucks, setTrucks] = useState([...initialTrucks]);
  const [dispatches, setDispatches] = useState([...initialDispatches]);
  const [invoices, setInvoices] = useState([...initialInvoices]);
  const [payments, setPayments] = useState([...initialPayments]);
  const [clearances, setClearances] = useState([...initialClearances]);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  // ─── SHIPMENT CRUD ──────────────────────────────
  const addShipment = (data) => {
    const id = nextId(shipments.map(s => ({ ShipmentID: s.ShipmentID })), 'SH');
    const newItem = { ShipmentID: id, ...data };
    setShipments(prev => [...prev, newItem]);
    addToast(`Shipment ${id} created successfully`);
    return newItem;
  };
  const updateShipment = (id, data) => {
    setShipments(prev => prev.map(s => s.ShipmentID === id ? { ...s, ...data } : s));
    addToast(`Shipment ${id} updated`);
  };
  const deleteShipment = (id) => {
    setShipments(prev => prev.filter(s => s.ShipmentID !== id));
    addToast(`Shipment ${id} deleted`, 'danger');
  };

  // ─── CONTAINER CRUD ─────────────────────────────
  const addContainer = (data) => {
    const id = nextId(containers.map(c => ({ ContainerID: c.ContainerID })), 'CN');
    const newItem = { ContainerID: id, ...data };
    setContainers(prev => [...prev, newItem]);
    addToast(`Container ${id} created`);
    return newItem;
  };
  const updateContainer = (id, data) => {
    setContainers(prev => prev.map(c => c.ContainerID === id ? { ...c, ...data } : c));
    addToast(`Container ${id} updated`);
  };
  const deleteContainer = (id) => {
    setContainers(prev => prev.filter(c => c.ContainerID !== id));
    addToast(`Container ${id} deleted`, 'danger');
  };

  // ─── USER CRUD ──────────────────────────────────
  const addUser = (data) => {
    const id = nextId(users.map(u => ({ UserID: u.UserID })), 'U');
    const newItem = { UserID: id, ...data };
    setUsers(prev => [...prev, newItem]);
    addToast(`User ${data.Name} added`);
    return newItem;
  };
  const updateUser = (id, data) => {
    setUsers(prev => prev.map(u => u.UserID === id ? { ...u, ...data } : u));
    addToast(`User updated`);
  };
  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.UserID !== id));
    addToast(`User removed`, 'danger');
  };

  // ─── DISPATCH CRUD ──────────────────────────────
  const addDispatch = (data) => {
    const id = nextId(dispatches.map(d => ({ DispatchID: d.DispatchID })), 'TD');
    const newItem = { DispatchID: id, ...data };
    setDispatches(prev => [...prev, newItem]);
    addToast(`Dispatch ${id} created`);
    return newItem;
  };
  const updateDispatch = (id, data) => {
    setDispatches(prev => prev.map(d => d.DispatchID === id ? { ...d, ...data } : d));
    addToast(`Dispatch ${id} updated`);
  };
  const deleteDispatch = (id) => {
    setDispatches(prev => prev.filter(d => d.DispatchID !== id));
    addToast(`Dispatch ${id} deleted`, 'danger');
  };

  // ─── CLEARANCE CRUD ─────────────────────────────
  const updateClearance = (id, data) => {
    setClearances(prev => prev.map(c => c.ClearanceID === id ? { ...c, ...data } : c));
    addToast(`Clearance ${id} updated`);
  };
  const addClearance = (data) => {
    const id = nextId(clearances.map(c => ({ ClearanceID: c.ClearanceID })), 'CC');
    const newItem = { ClearanceID: id, ...data };
    setClearances(prev => [...prev, newItem]);
    addToast(`Clearance ${id} created`);
    return newItem;
  };

  // ─── YARD SLOT MANAGEMENT ──────────────────────
  const assignSlot = (slotID, containerID) => {
    setYardSlots(prev => prev.map(s => s.SlotID === slotID ? {
      ...s, ContainerID: containerID, SlotStatus: 'Occupied',
      AssignedDate: new Date().toISOString().split('T')[0], ReleasedDate: null
    } : s));
    addToast(`Slot ${slotID} assigned to ${containerID}`);
  };
  const releaseSlot = (slotID) => {
    setYardSlots(prev => prev.map(s => s.SlotID === slotID ? {
      ...s, ContainerID: null, SlotStatus: 'Free',
      ReleasedDate: new Date().toISOString().split('T')[0]
    } : s));
    addToast(`Slot ${slotID} released`);
  };

  // ─── INVOICE / PAYMENT ─────────────────────────
  const addInvoice = (data) => {
    const id = nextId(invoices.map(i => ({ InvoiceID: i.InvoiceID })), 'INV');
    const newItem = { InvoiceID: id, ...data };
    setInvoices(prev => [...prev, newItem]);
    addToast(`Invoice ${id} generated`);
    return newItem;
  };
  const updateInvoice = (id, data) => {
    setInvoices(prev => prev.map(i => i.InvoiceID === id ? { ...i, ...data } : i));
    addToast(`Invoice ${id} updated`);
  };
  const addPayment = (data) => {
    const id = nextId(payments.map(p => ({ PaymentID: p.PaymentID })), 'PAY');
    const newItem = { PaymentID: id, ...data };
    setPayments(prev => [...prev, newItem]);
    addToast(`Payment ${id} recorded`);
    return newItem;
  };

  // ─── DRIVER / TRUCK CRUD ───────────────────────
  const updateDriver = (id, data) => {
    setDrivers(prev => prev.map(d => d.DriverID === id ? { ...d, ...data } : d));
    addToast(`Driver updated`);
  };
  const updateTruck = (id, data) => {
    setTrucks(prev => prev.map(t => t.TruckID === id ? { ...t, ...data } : t));
    addToast(`Truck updated`);
  };

  const value = {
    users, customers, shipments, containers, goods,
    yards, yardSlots, drivers, trucks, dispatches,
    invoices, payments, clearances, BILLING_RATES, toasts,
    addShipment, updateShipment, deleteShipment,
    addContainer, updateContainer, deleteContainer,
    addUser, updateUser, deleteUser,
    addDispatch, updateDispatch, deleteDispatch,
    updateClearance, addClearance,
    assignSlot, releaseSlot,
    addInvoice, updateInvoice, addPayment,
    updateDriver, updateTruck, addToast,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be inside DataProvider');
  return ctx;
}
