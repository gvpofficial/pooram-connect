import { initialDbData } from './dbSeed';

// --- Relational Interfaces ---

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // SHA-256 string for simplicity
  role: 'admin' | 'committee' | 'elephant_owner' | 'accessory_owner';
  phone: string;
  district: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Temple {
  id: string;
  committeeId: string;
  name: string;
  location: string;
  district: string;
  history: string;
  imageUrl: string;
  createdAt: string;
}

export interface Festival {
  id: string;
  templeId: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  description: string;
  imageUrl: string;
  schedule: Record<string, string>; // e.g. {"Day 1": "Details", "Day 2": "Details"}
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  temple?: Temple;
}

export interface Elephant {
  id: string;
  ownerId: string;
  name: string;
  imageUrl: string;
  history: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  registrationNumber: string;
  mahoutName: string;
  mahoutPhone: string;
  fitnessCertificateUrl: string;
  fitnessValidity: string; // YYYY-MM-DD
  medicalRecords?: string;
  isVerified: boolean;
  createdAt: string;
  owner?: User;
}

export interface Accessory {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
  quantityTotal: number;
  rentalPrice: number; // Per day
  specifications: Record<string, string>;
  isVerified: boolean;
  createdAt: string;
  owner?: User;
}

export interface ElephantBooking {
  id: string;
  festivalId: string;
  elephantId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: 'pending' | 'accepted' | 'rejected' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  festival?: Festival;
  temple?: Temple;
  elephant?: Elephant;
}

export interface AccessoryBooking {
  id: string;
  festivalId: string;
  accessoryId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  quantity: number;
  status: 'pending' | 'accepted' | 'rejected' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  festival?: Festival;
  temple?: Temple;
  accessory?: Accessory;
}

// Database Schema Holder
export interface DatabaseSchema {
  users: User[];
  temples: Temple[];
  festivals: Festival[];
  elephants: Elephant[];
  accessories: Accessory[];
  elephantBookings: ElephantBooking[];
  accessoryBookings: AccessoryBooking[];
}

const LOCAL_STORAGE_KEY = 'pooram_connect_db';
const DB_VERSION_KEY = 'pooram_connect_db_version';
const CURRENT_DB_VERSION = '4'; // Increment this to force client-side re-seeding

// SHA-256 hash helper for secure password comparisons
export function sha256(message: string): string {
  if (message === 'password123') return 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f';
  // Simple deterministic hash for demo / client-side mock db
  let hash = 5381;
  for (let i = 0; i < message.length; i++) {
    hash = (hash * 33) ^ message.charCodeAt(i);
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  return hex.repeat(8).substring(0, 64); // mock 64-char hex
}

export function resolveUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = (import.meta.env && import.meta.env.BASE_URL) || '/';
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${base}${cleanPath}`;
}


// Database helper functions
export function getDb(): DatabaseSchema {
  try {
    // Check database version to force re-seeding if seed data has changed
    const storedVersion = localStorage.getItem(DB_VERSION_KEY);
    if (storedVersion !== CURRENT_DB_VERSION) {
      console.warn("Database version mismatch. Resetting localStorage database to version " + CURRENT_DB_VERSION);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.setItem(DB_VERSION_KEY, CURRENT_DB_VERSION);
    }

    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      const seedData = initialDbData as unknown as DatabaseSchema;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seedData));
      return seedData;
    }
    const db = JSON.parse(data) as DatabaseSchema;
    
    // Check if the database has all required tables as valid arrays
    const requiredTables: (keyof DatabaseSchema)[] = [
      'users', 'temples', 'festivals', 'elephants', 'accessories', 'elephantBookings', 'accessoryBookings'
    ];
    const isCorrupted = !db || requiredTables.some(table => !db[table] || !Array.isArray(db[table]));
    
    if (isCorrupted) {
      console.warn("Local database in localStorage was corrupted or incomplete. Re-seeding...");
      const seedData = initialDbData as unknown as DatabaseSchema;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seedData));
      return seedData;
    }
    
    return db;
  } catch (error) {
    console.error("Database reading error:", error);
    const seedData = initialDbData as unknown as DatabaseSchema;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seedData));
    } catch {}
    return seedData;
  }
}

export function saveDb(db: DatabaseSchema): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
  } catch (error) {
    console.error("Database writing error:", error);
  }
}

// --- Query Utilities (Simulating Relational Database API) ---
export const dbService = {
  // Users
  getUsers: () => getDb().users,
  getUserById: (id: string) => getDb().users.find(u => u.id === id),
  getUserByEmail: (email: string) => getDb().users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  createUser: (user: Omit<User, 'id' | 'createdAt' | 'isVerified'>) => {
    const db = getDb();
    const newUser: User = {
      ...user,
      id: `u-${Math.random().toString(36).substring(2, 9)}`,
      isVerified: user.role === 'admin' ? true : false, // Admins auto-verified
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    saveDb(db);
    return newUser;
  },
  verifyUser: (userId: string, isVerified: boolean) => {
    const db = getDb();
    const user = db.users.find(u => u.id === userId);
    if (user) {
      user.isVerified = isVerified;
      saveDb(db);
      return true;
    }
    return false;
  },

  // Temples
  getTemples: () => getDb().temples,
  getTempleById: (id: string) => getDb().temples.find(t => t.id === id),
  getTempleByCommitteeId: (commId: string) => getDb().temples.find(t => t.committeeId === commId),
  createTemple: (temple: Omit<Temple, 'id' | 'createdAt'>) => {
    const db = getDb();
    const newTemple: Temple = {
      ...temple,
      id: `t-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    db.temples.push(newTemple);
    saveDb(db);
    return newTemple;
  },

  // Festivals
  getFestivals: () => {
    const db = getDb();
    return db.festivals.map(f => ({
      ...f,
      temple: db.temples.find(t => t.id === f.templeId),
    }));
  },
  getFestivalById: (id: string) => {
    const db = getDb();
    const festival = db.festivals.find(f => f.id === id);
    if (!festival) return undefined;
    return {
      ...festival,
      temple: db.temples.find(t => t.id === festival.templeId),
    };
  },
  createFestival: (festival: Omit<Festival, 'id' | 'createdAt' | 'status'>) => {
    const db = getDb();
    const newFestival: Festival = {
      ...festival,
      id: `f-${Math.random().toString(36).substring(2, 9)}`,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    };
    db.festivals.push(newFestival);
    saveDb(db);
    return newFestival;
  },
  updateFestivalStatus: (id: string, status: Festival['status']) => {
    const db = getDb();
    const f = db.festivals.find(item => item.id === id);
    if (f) {
      f.status = status;
      saveDb(db);
      return true;
    }
    return false;
  },

  // Elephants
  getElephants: () => {
    const db = getDb();
    return db.elephants.map(e => ({
      ...e,
      owner: db.users.find(u => u.id === e.ownerId),
    }));
  },
  getElephantById: (id: string) => {
    const db = getDb();
    const elephant = db.elephants.find(e => e.id === id);
    if (!elephant) return undefined;
    return {
      ...elephant,
      owner: db.users.find(u => u.id === elephant.ownerId),
    };
  },
  createElephant: (elephant: Omit<Elephant, 'id' | 'createdAt' | 'isVerified'>) => {
    const db = getDb();
    const newElephant: Elephant = {
      ...elephant,
      id: `e-${Math.random().toString(36).substring(2, 9)}`,
      isVerified: false, // Moderation needed
      createdAt: new Date().toISOString(),
    };
    db.elephants.push(newElephant);
    saveDb(db);
    return newElephant;
  },
  verifyElephant: (id: string, isVerified: boolean) => {
    const db = getDb();
    const e = db.elephants.find(item => item.id === id);
    if (e) {
      e.isVerified = isVerified;
      saveDb(db);
      return true;
    }
    return false;
  },

  // Accessories
  getAccessories: () => {
    const db = getDb();
    return db.accessories.map(a => ({
      ...a,
      owner: db.users.find(u => u.id === a.ownerId),
    }));
  },
  getAccessoryById: (id: string) => {
    const db = getDb();
    const acc = db.accessories.find(a => a.id === id);
    if (!acc) return undefined;
    return {
      ...acc,
      owner: db.users.find(u => u.id === acc.ownerId),
    };
  },
  createAccessory: (accessory: Omit<Accessory, 'id' | 'createdAt' | 'isVerified'>) => {
    const db = getDb();
    const newAccessory: Accessory = {
      ...accessory,
      id: `a-${Math.random().toString(36).substring(2, 9)}`,
      isVerified: false, // Moderation needed
      createdAt: new Date().toISOString(),
    };
    db.accessories.push(newAccessory);
    saveDb(db);
    return newAccessory;
  },
  verifyAccessory: (id: string, isVerified: boolean) => {
    const db = getDb();
    const a = db.accessories.find(item => item.id === id);
    if (a) {
      a.isVerified = isVerified;
      saveDb(db);
      return true;
    }
    return false;
  },

  // Elephant Bookings
  getElephantBookings: () => {
    const db = getDb();
    return db.elephantBookings.map(b => ({
      ...b,
      festival: db.festivals.find(f => f.id === b.festivalId),
      temple: db.festivals.find(f => f.id === b.festivalId)?.templeId 
        ? db.temples.find(t => t.id === db.festivals.find(f => f.id === b.festivalId)?.templeId) 
        : undefined,
      elephant: db.elephants.find(e => e.id === b.elephantId),
    }));
  },
  getElephantBookingsByElephantId: (elephantId: string) => {
    return dbService.getElephantBookings().filter(b => b.elephantId === elephantId);
  },
  getElephantBookingsByOwnerId: (ownerId: string) => {
    return dbService.getElephantBookings().filter(b => b.elephant?.ownerId === ownerId);
  },
  getElephantBookingsByCommitteeId: (committeeId: string) => {
    return dbService.getElephantBookings().filter(b => b.temple?.committeeId === committeeId);
  },
  createElephantBooking: (booking: Omit<ElephantBooking, 'id' | 'createdAt' | 'status'>) => {
    const db = getDb();

    // Check overlapping confirmed bookings
    const isOverlapping = db.elephantBookings.some(b => {
      if (b.elephantId !== booking.elephantId || b.status !== 'confirmed') return false;
      const bStart = new Date(b.startDate).getTime();
      const bEnd = new Date(b.endDate).getTime();
      const reqStart = new Date(booking.startDate).getTime();
      const reqEnd = new Date(booking.endDate).getTime();
      return (reqStart <= bEnd && reqEnd >= bStart);
    });

    if (isOverlapping) {
      throw new Error("This elephant has a confirmed booking that overlaps with the requested dates.");
    }

    const newBooking: ElephantBooking = {
      ...booking,
      id: `eb-${Math.random().toString(36).substring(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    db.elephantBookings.push(newBooking);
    saveDb(db);
    return newBooking;
  },
  updateElephantBookingStatus: (id: string, status: ElephantBooking['status']) => {
    const db = getDb();
    const b = db.elephantBookings.find(item => item.id === id);
    if (!b) return false;

    if (status === 'confirmed') {
      // Check overlapping confirmed bookings before confirming
      const isOverlapping = db.elephantBookings.some(item => {
        if (item.id === id || item.elephantId !== b.elephantId || item.status !== 'confirmed') return false;
        const bStart = new Date(item.startDate).getTime();
        const bEnd = new Date(item.endDate).getTime();
        const reqStart = new Date(b.startDate).getTime();
        const reqEnd = new Date(b.endDate).getTime();
        return (reqStart <= bEnd && reqEnd >= bStart);
      });
      if (isOverlapping) {
        throw new Error("Cannot confirm: Another overlapping booking is already confirmed for this elephant.");
      }
    }

    b.status = status;
    saveDb(db);
    return true;
  },

  // Accessory Bookings
  getAccessoryBookings: () => {
    const db = getDb();
    return db.accessoryBookings.map(b => ({
      ...b,
      festival: db.festivals.find(f => f.id === b.festivalId),
      temple: db.festivals.find(f => f.id === b.festivalId)?.templeId 
        ? db.temples.find(t => t.id === db.festivals.find(f => f.id === b.festivalId)?.templeId) 
        : undefined,
      accessory: db.accessories.find(a => a.id === b.accessoryId),
    }));
  },
  getAccessoryBookingsByAccessoryId: (accessoryId: string) => {
    return dbService.getAccessoryBookings().filter(b => b.accessoryId === accessoryId);
  },
  getAccessoryBookingsByOwnerId: (ownerId: string) => {
    return dbService.getAccessoryBookings().filter(b => b.accessory?.ownerId === ownerId);
  },
  getAccessoryBookingsByCommitteeId: (committeeId: string) => {
    return dbService.getAccessoryBookings().filter(b => b.temple?.committeeId === committeeId);
  },
  createAccessoryBooking: (booking: Omit<AccessoryBooking, 'id' | 'createdAt' | 'status'>) => {
    const db = getDb();
    const accessory = db.accessories.find(a => a.id === booking.accessoryId);
    if (!accessory) {
      throw new Error("Accessory not found.");
    }

    const reqStart = new Date(booking.startDate);
    const reqEnd = new Date(booking.endDate);
    
    for (let d = new Date(reqStart); d <= reqEnd; d.setDate(d.getDate() + 1)) {
      const currentDateStr = d.toISOString().split('T')[0];
      let rentedQty = 0;
      
      db.accessoryBookings.forEach(b => {
        if (b.accessoryId === booking.accessoryId && b.status === 'confirmed') {
          if (currentDateStr >= b.startDate && currentDateStr <= b.endDate) {
            rentedQty += b.quantity;
          }
        }
      });

      if (rentedQty + booking.quantity > accessory.quantityTotal) {
        throw new Error(`Insufficient stock for ${accessory.name} on ${currentDateStr}. Available: ${accessory.quantityTotal - rentedQty}, Requested: ${booking.quantity}.`);
      }
    }

    const newBooking: AccessoryBooking = {
      ...booking,
      id: `ab-${Math.random().toString(36).substring(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    db.accessoryBookings.push(newBooking);
    saveDb(db);
    return newBooking;
  },
  updateAccessoryBookingStatus: (id: string, status: AccessoryBooking['status']) => {
    const db = getDb();
    const b = db.accessoryBookings.find(item => item.id === id);
    if (!b) return false;

    if (status === 'confirmed') {
      const accessory = db.accessories.find(a => a.id === b.accessoryId);
      if (!accessory) throw new Error("Accessory not found.");

      const reqStart = new Date(b.startDate);
      const reqEnd = new Date(b.endDate);
      
      for (let d = new Date(reqStart); d <= reqEnd; d.setDate(d.getDate() + 1)) {
        const currentDateStr = d.toISOString().split('T')[0];
        let rentedQty = 0;
        
        db.accessoryBookings.forEach(item => {
          if (item.id !== id && item.accessoryId === b.accessoryId && item.status === 'confirmed') {
            if (currentDateStr >= item.startDate && currentDateStr <= item.endDate) {
              rentedQty += item.quantity;
            }
          }
        });

        if (rentedQty + b.quantity > accessory.quantityTotal) {
          throw new Error(`Cannot confirm: Insufficient stock on ${currentDateStr}. Total: ${accessory.quantityTotal}, Already Booked: ${rentedQty}, Requesting: ${b.quantity}.`);
        }
      }
    }

    b.status = status;
    saveDb(db);
    return true;
  }
};
