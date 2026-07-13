-- Kerala Pooram Management Portal - Database Schema
-- RDBMS: PostgreSQL or SQLite compatible normalized schema

-- 1. Users Table (Handles all accounts with Role-Based Access Control)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('admin', 'committee', 'elephant_owner', 'accessory_owner')),
    phone VARCHAR(15) NOT NULL,
    district VARCHAR(50) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Temples Table (Owned by Festival Committees)
CREATE TABLE temples (
    id VARCHAR(36) PRIMARY KEY,
    committee_id VARCHAR(36) NOT NULL,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(255) NOT NULL,
    district VARCHAR(50) NOT NULL,
    history TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (committee_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Festivals Table (Created by Committees for a specific Temple)
CREATE TABLE festivals (
    id VARCHAR(36) PRIMARY KEY,
    temple_id VARCHAR(36) NOT NULL,
    name VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    schedule TEXT, -- JSON string or textual breakdown of events
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (temple_id) REFERENCES temples(id) ON DELETE CASCADE,
    CONSTRAINT chk_festival_dates CHECK (end_date >= start_date)
);

-- 4. Elephants Table (Registered by Elephant Owners)
CREATE TABLE elephants (
    id VARCHAR(36) PRIMARY KEY,
    owner_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    history TEXT NOT NULL,
    age INT NOT NULL,
    height INT NOT NULL, -- in cm
    weight INT NOT NULL, -- in kg
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    mahout_name VARCHAR(100) NOT NULL,
    mahout_phone VARCHAR(15) NOT NULL,
    fitness_certificate_url VARCHAR(500) NOT NULL,
    fitness_validity DATE NOT NULL,
    medical_records TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Accessories Table (Registered by Accessory Owners)
CREATE TABLE accessories (
    id VARCHAR(36) PRIMARY KEY,
    owner_id VARCHAR(36) NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g., 'Nettipattam', 'Venchamaram', 'Aalavattam', 'Muthukuda', etc.
    image_url VARCHAR(500) NOT NULL,
    description TEXT,
    quantity_total INT NOT NULL DEFAULT 1,
    rental_price DECIMAL(10, 2) NOT NULL, -- Per day rate
    specifications TEXT, -- JSON or text representation of size/materials
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Elephant Bookings Table (Manages Committee requests for Elephants)
CREATE TABLE elephant_bookings (
    id VARCHAR(36) PRIMARY KEY,
    festival_id VARCHAR(36) NOT NULL,
    elephant_id VARCHAR(36) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (festival_id) REFERENCES festivals(id) ON DELETE CASCADE,
    FOREIGN KEY (elephant_id) REFERENCES elephants(id) ON DELETE CASCADE,
    CONSTRAINT chk_booking_dates CHECK (end_date >= start_date)
);

-- 7. Accessory Bookings Table (Manages Committee requests for Accessories)
CREATE TABLE accessory_bookings (
    id VARCHAR(36) PRIMARY KEY,
    festival_id VARCHAR(36) NOT NULL,
    accessory_id VARCHAR(36) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (festival_id) REFERENCES festivals(id) ON DELETE CASCADE,
    FOREIGN KEY (accessory_id) REFERENCES accessories(id) ON DELETE CASCADE,
    CONSTRAINT chk_rental_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_rental_qty CHECK (quantity > 0)
);

-- Indexes for Quick Searching & Avoiding Conflicts
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_festivals_dates ON festivals(start_date, end_date);
CREATE INDEX idx_festivals_district ON temples(district);
CREATE INDEX idx_elephants_verified ON elephants(is_verified);
CREATE INDEX idx_accessories_verified ON accessories(is_verified);
CREATE INDEX idx_elephant_bookings_dates ON elephant_bookings(start_date, end_date, status);
CREATE INDEX idx_accessory_bookings_dates ON accessory_bookings(start_date, end_date, status);
