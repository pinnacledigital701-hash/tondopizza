'use client';

import { MenuItem, ALL_MENU_ITEMS } from './data';
import {
  db,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  collection,
  OperationType,
  handleFirestoreError,
} from './firebase';

export type OrderStatus = 'NEW' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
export type ReservationStatus = 'NEW' | 'CONFIRMED' | 'SEATED' | 'COMPLETED' | 'CANCELLED' | 'NO SHOW';

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface OrderItemRecord {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string; // e.g. TND-1048
  customer: OrderCustomer;
  items: OrderItemRecord[];
  orderType: 'pickup' | 'dinein' | 'delivery';
  subtotal: number;
  tax: number;
  fees: number;
  discount?: number;
  total: number;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  status: OrderStatus;
  notes?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface ReservationRecord {
  id: string;
  bookingCode: string; // e.g. TND-8492
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  guests: number;
  date: string; // YYYY-MM-DD
  time: string; // e.g. 19:30
  status: ReservationStatus;
  specialRequests?: string;
  internalNotes?: string;
  tableNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerSummary {
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  totalReservations: number;
  lastReservationDate?: string;
  notes?: string;
}

export interface RestaurantSettingsData {
  restaurantName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  ovenTemp: string;
  pickupEstimatedMinutes: number;
  deliveryEstimatedMinutes: number;
  openingHours: {
    tueThu: string;
    friSat: string;
    sun: string;
    mon: string;
  };
  taxRatePercent: number;
  orderAcceptingEnabled: boolean;
  reservationAcceptingEnabled: boolean;
}

export interface ManagedMenuItem extends MenuItem {
  isAvailable: boolean;
  isSoldOut?: boolean;
}

const STORAGE_KEY_ORDERS = 'tondo_orders_v1';
const STORAGE_KEY_RESERVATIONS = 'tondo_reservations_v1';
const STORAGE_KEY_MENU = 'tondo_menu_v1';
const STORAGE_KEY_SETTINGS = 'tondo_settings_v1';
const STORAGE_KEY_AUTH = 'tondo_owner_session_v1';

// Format helper
const getTodayDateString = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const getIsoTimeToday = (hours: number, minutes: number, offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

const INITIAL_SETTINGS: RestaurantSettingsData = {
  restaurantName: 'Tondo Pizza Co.',
  tagline: 'Artisanal Woodfired Neapolitan Pizza',
  address: '112 Forno Street, Eastside Market District, Brooklyn, NY',
  phone: '(555) 014-2231',
  email: 'ciao@tondopizza.co',
  ovenTemp: '900°F (485°C)',
  pickupEstimatedMinutes: 20,
  deliveryEstimatedMinutes: 35,
  openingHours: {
    tueThu: '5:00 PM – 10:00 PM',
    friSat: '12:00 PM – 11:00 PM',
    sun: '12:00 PM – 9:00 PM',
    mon: 'Closed for Dough Fermentation',
  },
  taxRatePercent: 8.875,
  orderAcceptingEnabled: true,
  reservationAcceptingEnabled: true,
};

// Legacy mock item IDs to filter out from existing local storage & remote databases
const LEGACY_MOCK_ORDER_IDS = new Set([
  'ord-1048',
  'ord-1049',
  'ord-1050',
  'ord-1047',
  'ord-1046',
  'ord-1045',
]);

const LEGACY_MOCK_RES_IDS = new Set([
  'res-8491',
  'res-8492',
  'res-8493',
  'res-8494',
  'res-8495',
]);

const INITIAL_ORDERS: OrderRecord[] = [];
const INITIAL_RESERVATIONS: ReservationRecord[] = [];

// Helper to check window environment
const isClient = typeof window !== 'undefined';

// OWNER STORE CLASS
export const ownerStore = {
  // --- ORDERS ---
  getOrders(): OrderRecord[] {
    if (!isClient) return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (!stored) {
        return [];
      }
      const parsed: OrderRecord[] = JSON.parse(stored);
      const filtered = parsed.filter((o) => !LEGACY_MOCK_ORDER_IDS.has(o.id));
      if (filtered.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(filtered));
      }
      return filtered;
    } catch {
      return [];
    }
  },

  getOrderById(id: string): OrderRecord | undefined {
    const orders = this.getOrders();
    return orders.find((o) => o.id === id || o.orderNumber.toUpperCase() === id.toUpperCase());
  },

  saveOrder(order: OrderRecord): void {
    if (!isClient) return;
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === order.id);
    if (index >= 0) {
      orders[index] = { ...order, updatedAt: new Date().toISOString() };
    } else {
      orders.unshift(order);
    }
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    this.notifySubscribers();

    // Firestore Sync
    try {
      setDoc(doc(db, 'orders', order.id), order).catch((err) => {
        console.warn('Firestore order sync warning:', err);
      });
    } catch (e) {
      console.warn('Firestore setDoc failed:', e);
    }
  },

  deleteOrder(id: string): void {
    if (!isClient) return;
    const orders = this.getOrders().filter((o) => o.id !== id && o.orderNumber !== id);
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    this.notifySubscribers();

    // Firestore Sync
    try {
      deleteDoc(doc(db, 'orders', id)).catch((err) => {
        console.warn('Firestore delete order warning:', err);
      });
    } catch (e) {
      console.warn('Firestore deleteDoc failed:', e);
    }
  },

  clearAllOrders(): void {
    if (!isClient) return;
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify([]));
    this.notifySubscribers();
  },

  addOrder(order: OrderRecord): void {
    this.saveOrder(order);
  },

  updateOrderStatus(id: string, status: OrderStatus, internalNote?: string): OrderRecord | null {
    if (!isClient) return null;
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (index === -1) return null;

    const existing = orders[index];
    const updated: OrderRecord = {
      ...existing,
      status,
      notes: internalNote ? `${existing.notes ? existing.notes + ' | ' : ''}${internalNote}` : existing.notes,
      updatedAt: new Date().toISOString(),
    };
    orders[index] = updated;
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    this.notifySubscribers();

    // Firestore Sync
    try {
      updateDoc(doc(db, 'orders', existing.id), {
        status,
        ...(updated.notes !== undefined ? { notes: updated.notes } : {}),
        updatedAt: updated.updatedAt,
      }).catch((err) => {
        console.warn('Firestore update order warning:', err);
      });
    } catch (e) {
      console.warn('Firestore updateDoc failed:', e);
    }

    return updated;
  },

  createCustomerOrder(params: {
    customer: OrderCustomer;
    items: OrderItemRecord[];
    orderType: 'pickup' | 'dinein' | 'delivery';
    notes?: string;
  }): OrderRecord {
    const subtotal = params.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxRate = 0.08875;
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const fees = params.orderType === 'delivery' ? 4.5 : 0;
    const total = Math.round((subtotal + tax + fees) * 100) / 100;

    const orderNum = 'TND-' + Math.floor(1051 + Math.random() * 8000);
    const newOrder: OrderRecord = {
      id: 'ord-' + Date.now(),
      orderNumber: orderNum,
      customer: params.customer,
      items: params.items,
      orderType: params.orderType,
      subtotal,
      tax,
      fees,
      total,
      paymentStatus: 'PAID',
      status: 'NEW',
      notes: params.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.saveOrder(newOrder);
    return newOrder;
  },

  // --- RESERVATIONS ---
  getReservations(): ReservationRecord[] {
    if (!isClient) return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY_RESERVATIONS);
      if (!stored) {
        return [];
      }
      const parsed: ReservationRecord[] = JSON.parse(stored);
      const filtered = parsed.filter((r) => !LEGACY_MOCK_RES_IDS.has(r.id));
      if (filtered.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY_RESERVATIONS, JSON.stringify(filtered));
      }
      return filtered;
    } catch {
      return [];
    }
  },

  getReservationById(id: string): ReservationRecord | undefined {
    const res = this.getReservations();
    return res.find((r) => r.id === id || r.bookingCode.toUpperCase() === id.toUpperCase());
  },

  saveReservation(reservation: ReservationRecord): void {
    if (!isClient) return;
    const list = this.getReservations();
    const index = list.findIndex((r) => r.id === reservation.id);
    if (index >= 0) {
      list[index] = { ...reservation, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(reservation);
    }
    localStorage.setItem(STORAGE_KEY_RESERVATIONS, JSON.stringify(list));
    this.notifySubscribers();

    // Firestore Sync
    try {
      setDoc(doc(db, 'reservations', reservation.id), reservation).catch((err) => {
        console.warn('Firestore reservation sync warning:', err);
      });
    } catch (e) {
      console.warn('Firestore setDoc failed:', e);
    }
  },

  deleteReservation(id: string): void {
    if (!isClient) return;
    const list = this.getReservations().filter((r) => r.id !== id && r.bookingCode !== id);
    localStorage.setItem(STORAGE_KEY_RESERVATIONS, JSON.stringify(list));
    this.notifySubscribers();

    // Firestore Sync
    try {
      deleteDoc(doc(db, 'reservations', id)).catch((err) => {
        console.warn('Firestore delete reservation warning:', err);
      });
    } catch (e) {
      console.warn('Firestore deleteDoc failed:', e);
    }
  },

  clearAllReservations(): void {
    if (!isClient) return;
    localStorage.setItem(STORAGE_KEY_RESERVATIONS, JSON.stringify([]));
    this.notifySubscribers();
  },

  addReservation(reservation: ReservationRecord): void {
    this.saveReservation(reservation);
  },

  updateReservationStatus(id: string, status: ReservationStatus, internalNotes?: string, tableNumber?: string): ReservationRecord | null {
    if (!isClient) return null;
    const list = this.getReservations();
    const index = list.findIndex((r) => r.id === id || r.bookingCode === id);
    if (index === -1) return null;

    const existing = list[index];
    const updated: ReservationRecord = {
      ...existing,
      status,
      internalNotes: internalNotes !== undefined ? internalNotes : existing.internalNotes,
      tableNumber: tableNumber !== undefined ? tableNumber : existing.tableNumber,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    localStorage.setItem(STORAGE_KEY_RESERVATIONS, JSON.stringify(list));
    this.notifySubscribers();

    // Firestore Sync
    try {
      updateDoc(doc(db, 'reservations', existing.id), {
        status,
        ...(updated.internalNotes !== undefined ? { internalNotes: updated.internalNotes } : {}),
        ...(updated.tableNumber !== undefined ? { tableNumber: updated.tableNumber } : {}),
        updatedAt: updated.updatedAt,
      }).catch((err) => {
        console.warn('Firestore update reservation warning:', err);
      });
    } catch (e) {
      console.warn('Firestore updateDoc failed:', e);
    }

    return updated;
  },

  createCustomerReservation(params: {
    name: string;
    phone: string;
    email?: string;
    guests: number;
    date: string;
    time: string;
    specialRequests?: string;
  }): ReservationRecord {
    const code = 'TND-' + Math.floor(1000 + Math.random() * 9000);
    const newRes: ReservationRecord = {
      id: 'res-' + Date.now(),
      bookingCode: code,
      customer: {
        name: params.name,
        phone: params.phone || '(555) 000-0000',
        email: params.email,
      },
      guests: params.guests,
      date: params.date,
      time: params.time,
      status: 'NEW',
      specialRequests: params.specialRequests || '',
      internalNotes: 'Online booking via website',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.saveReservation(newRes);
    return newRes;
  },

  // --- MENU MANAGEMENT ---
  getMenuItems(): ManagedMenuItem[] {
    if (!isClient) {
      return ALL_MENU_ITEMS.map((item) => ({ ...item, isAvailable: true }));
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MENU);
      if (!stored) {
        const initial = ALL_MENU_ITEMS.map((item) => ({ ...item, isAvailable: true }));
        localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(stored);
    } catch {
      return ALL_MENU_ITEMS.map((item) => ({ ...item, isAvailable: true }));
    }
  },

  saveMenuItem(item: ManagedMenuItem): void {
    if (!isClient) return;
    const menu = this.getMenuItems();
    const index = menu.findIndex((m) => m.id === item.id);
    if (index >= 0) {
      menu[index] = item;
    } else {
      menu.push(item);
    }
    localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(menu));
    this.notifySubscribers();

    // Firestore Sync
    try {
      setDoc(doc(db, 'menuItems', item.id), item).catch((err) => {
        console.warn('Firestore menu item sync warning:', err);
      });
    } catch (e) {
      console.warn('Firestore setDoc failed:', e);
    }
  },

  deleteMenuItem(id: string): void {
    if (!isClient) return;
    const menu = this.getMenuItems().filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(menu));
    this.notifySubscribers();
  },

  toggleItemSoldOut(id: string): boolean {
    if (!isClient) return false;
    const menu = this.getMenuItems();
    const item = menu.find((m) => m.id === id);
    if (item) {
      item.isSoldOut = !item.isSoldOut;
      localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(menu));
      this.notifySubscribers();

      // Firestore Sync
      try {
        setDoc(doc(db, 'menuItems', item.id), item).catch((err) => {
          console.warn('Firestore toggle menu item warning:', err);
        });
      } catch (e) {
        console.warn('Firestore setDoc failed:', e);
      }

      return !!item.isSoldOut;
    }
    return false;
  },

  // --- RESTAURANT SETTINGS ---
  getSettings(): RestaurantSettingsData {
    if (!isClient) return INITIAL_SETTINGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(INITIAL_SETTINGS));
        return INITIAL_SETTINGS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(settings: RestaurantSettingsData): void {
    if (!isClient) return;
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    this.notifySubscribers();

    // Firestore Sync
    try {
      setDoc(doc(db, 'settings', 'general'), { id: 'general', ...settings }).catch((err) => {
        console.warn('Firestore settings sync warning:', err);
      });
    } catch (e) {
      console.warn('Firestore setDoc failed:', e);
    }
  },

  // --- CUSTOMER DIRECTORY DERIVATION ---
  getCustomers(): CustomerSummary[] {
    const orders = this.getOrders();
    const reservations = this.getReservations();
    const map = new Map<string, CustomerSummary>();

    orders.forEach((o) => {
      const key = o.customer.phone || o.customer.email || o.customer.name.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          name: o.customer.name,
          phone: o.customer.phone,
          email: o.customer.email,
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: o.createdAt,
          totalReservations: 0,
        });
      }
      const entry = map.get(key)!;
      entry.totalOrders += 1;
      if (o.status !== 'CANCELLED') {
        entry.totalSpent += o.total;
      }
      if (!entry.lastOrderDate || new Date(o.createdAt) > new Date(entry.lastOrderDate)) {
        entry.lastOrderDate = o.createdAt;
      }
    });

    reservations.forEach((r) => {
      const key = r.customer.phone || r.customer.email || r.customer.name.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          name: r.customer.name,
          phone: r.customer.phone,
          email: r.customer.email,
          totalOrders: 0,
          totalSpent: 0,
          totalReservations: 0,
          lastReservationDate: r.date,
        });
      }
      const entry = map.get(key)!;
      entry.totalReservations += 1;
      if (!entry.lastReservationDate || r.date > entry.lastReservationDate) {
        entry.lastReservationDate = r.date;
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  },

  getCustomerSummaries(): CustomerSummary[] {
    return this.getCustomers();
  },

  // --- AUTHENTICATION STATE ---
  isAuthenticated(): boolean {
    if (!isClient) return false;
    try {
      return sessionStorage.getItem(STORAGE_KEY_AUTH) === 'authorized_tondo_owner';
    } catch {
      return false;
    }
  },

  authenticate(pinOrPass: string): boolean {
    if (!isClient) return false;
    const clean = pinOrPass.trim();
    // Default Owner PIN 9004 or password 'tondo2026' or 'admin'
    if (clean === '9004' || clean.toLowerCase() === 'tondo2026' || clean.toLowerCase() === 'tondo') {
      sessionStorage.setItem(STORAGE_KEY_AUTH, 'authorized_tondo_owner');
      this.notifySubscribers();
      this.initFirebaseSync();
      return true;
    }
    return false;
  },

  setFirebaseAuthenticated(email?: string | null): void {
    if (!isClient) return;
    sessionStorage.setItem(STORAGE_KEY_AUTH, 'authorized_tondo_owner');
    if (email) {
      sessionStorage.setItem('tondo_owner_email', email);
    }
    this.notifySubscribers();
    this.initFirebaseSync();
  },

  logout(): void {
    if (!isClient) return;
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
    sessionStorage.removeItem('tondo_owner_email');
    this.notifySubscribers();
  },

  // --- FIREBASE FIRESTORE REALTIME SYNC ---
  firebaseSyncInitialized: false,
  initFirebaseSync(): void {
    if (!isClient || this.firebaseSyncInitialized) return;
    this.firebaseSyncInitialized = true;

    try {
      // Real-time Settings Sync
      onSnapshot(
        doc(db, 'settings', 'general'),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as RestaurantSettingsData;
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(data));
            this.notifySubscribers();
          }
        },
        () => {}
      );

      // Real-time Menu Items Sync
      onSnapshot(
        collection(db, 'menuItems'),
        (snapshot) => {
          if (!snapshot.empty) {
            const items: ManagedMenuItem[] = [];
            snapshot.forEach((d) => items.push(d.data() as ManagedMenuItem));
            if (items.length > 0) {
              localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(items));
              this.notifySubscribers();
            }
          }
        },
        () => {}
      );

      // Real-time Orders Sync (for authenticated owner/staff)
      onSnapshot(
        collection(db, 'orders'),
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteOrders: OrderRecord[] = [];
            snapshot.forEach((d) => {
              const data = d.data() as OrderRecord;
              if (data && !LEGACY_MOCK_ORDER_IDS.has(data.id)) {
                remoteOrders.push(data);
              }
            });
            const localOrders = this.getOrders().filter((o) => !LEGACY_MOCK_ORDER_IDS.has(o.id));
            const orderMap = new Map<string, OrderRecord>();
            localOrders.forEach((o) => orderMap.set(o.id, o));
            remoteOrders.forEach((o) => orderMap.set(o.id, o));
            const merged = Array.from(orderMap.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(merged));
            this.notifySubscribers();
          }
        },
        () => {}
      );

      // Real-time Reservations Sync (for authenticated owner/staff)
      onSnapshot(
        collection(db, 'reservations'),
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteRes: ReservationRecord[] = [];
            snapshot.forEach((d) => {
              const data = d.data() as ReservationRecord;
              if (data && !LEGACY_MOCK_RES_IDS.has(data.id)) {
                remoteRes.push(data);
              }
            });
            const localRes = this.getReservations().filter((r) => !LEGACY_MOCK_RES_IDS.has(r.id));
            const resMap = new Map<string, ReservationRecord>();
            localRes.forEach((r) => resMap.set(r.id, r));
            remoteRes.forEach((r) => resMap.set(r.id, r));
            const merged = Array.from(resMap.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            localStorage.setItem(STORAGE_KEY_RESERVATIONS, JSON.stringify(merged));
            this.notifySubscribers();
          }
        },
        () => {}
      );
    } catch (e) {
      console.warn('Firebase sync initialization warning:', e);
    }
  },

  // --- RESET DEMO DATA ---
  resetToDemo(): void {
    if (!isClient) return;
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEY_RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
    localStorage.setItem(
      STORAGE_KEY_MENU,
      JSON.stringify(ALL_MENU_ITEMS.map((item) => ({ ...item, isAvailable: true })))
    );
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    this.notifySubscribers();
  },

  // --- REACTIVE SUBSCRIBERS ---
  version: 1,
  getVersion(): number {
    return this.version;
  },
  listeners: new Set<() => void>(),
  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  },
  notifySubscribers(): void {
    this.version += 1;
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error('Owner store listener error', err);
      }
    });
  },
};
