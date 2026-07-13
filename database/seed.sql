-- Kerala Pooram Management Portal - Seed Data Script
-- Populates the relational database with realistic demo accounts, temples, festivals, elephants, and accessory rentals.

-- 1. Seed Users (Passwords are hashed as SHA-256 for 'password123': 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f' or similar)
-- Admin
INSERT INTO users (id, name, email, password_hash, role, phone, district, is_verified) VALUES
('u-admin', 'Kerala Devaswom Commissioner', 'admin@devaswom.gov.in', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'admin', '04712300000', 'Trivandrum', TRUE);

-- Committees
INSERT INTO users (id, name, email, password_hash, role, phone, district, is_verified) VALUES
('u-comm-thrissur', 'Thrissur Pooram Central Committee', 'committee.thrissur@pooramconnect.org', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'committee', '9876543210', 'Thrissur', TRUE),
('u-comm-nemmara', 'Nemmara-Vellangi Committee', 'committee.nemmara@pooramconnect.org', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'committee', '9876543211', 'Palakkad', TRUE);

-- Elephant Owners
INSERT INTO users (id, name, email, password_hash, role, phone, district, is_verified) VALUES
('u-owner-ramachandran', 'Thechikottukavu Devaswom Trust', 'owner.ramachandran@pooramconnect.org', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'elephant_owner', '9876543212', 'Thrissur', TRUE),
('u-owner-karnan', 'Mangalamkunnu Elephant Syndicate', 'owner.karnan@pooramconnect.org', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'elephant_owner', '9876543213', 'Palakkad', TRUE);

-- Accessory Owners
INSERT INTO users (id, name, email, password_hash, role, phone, district, is_verified) VALUES
('u-acc-owner-1', 'Kerala Traditional Crafts & Rentals', 'crafts.rentals@pooramconnect.org', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'accessory_owner', '9876543214', 'Thrissur', TRUE),
('u-acc-owner-2', 'Malabar Temple Decorators', 'malabar.decor@pooramconnect.org', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'accessory_owner', '9876543215', 'Palakkad', TRUE);


-- 2. Seed Temples
INSERT INTO temples (id, committee_id, name, location, district, history, image_url) VALUES
('t-vadakkunnathan', 'u-comm-thrissur', 'Vadakkunnathan Temple', 'Swaraj Round, Thrissur', 'Thrissur', 'The historic Shiva temple that serves as the main venue for the world-famous Thrissur Pooram. Founded by Sage Parasurama according to legend.', '/images/temples/vadakkunnathan.jpg'),
('t-nemmara', 'u-comm-nemmara', 'Nellikulangara Bhagavathy Temple', 'Nemmara, Palakkad', 'Palakkad', 'The holy shrine dedicated to Goddess Bhagavathy, hosting the annual Nemmara-Vellangi Vela, one of Keralas most vibrant visual spectacles.', '/images/temples/nemmara.jpg');


-- 3. Seed Festivals
INSERT INTO festivals (id, temple_id, name, start_date, end_date, description, image_url, schedule) VALUES
('f-thrissur-pooram-2026', 't-vadakkunnathan', 'Thrissur Pooram 2026', '2026-04-26', '2026-04-28', 'The mother of all Poorams, featuring the majestic Kudamattom (umbrella exchange) and the historic Ilanjithara Melam with over 200 artists.', '/images/festivals/thrissur-pooram.jpg', '{"Day 1": "Flag Hoisting & Kodiyettam", "Day 2": "Sample Vedikettu & Kudamattom", "Day 3": "Pakal Pooram & Farewell"}'),
('f-nemmara-vela-2026', 't-nemmara', 'Nemmara-Vellangi Vela 2026', '2026-04-03', '2026-04-05', 'Known for its giant decorated canopies (Aana Pandhal) and competing fireworks displays between the Nemmara and Vellangi wings.', '/images/festivals/nemmara-vela.jpg', '{"Day 1": "Temple rituals and Vela procession", "Day 2": "Grand fireworks and traditional Chenda Melam"}');


-- 4. Seed Elephants
INSERT INTO elephants (id, owner_id, name, image_url, history, age, height, weight, registration_number, mahout_name, mahout_phone, fitness_certificate_url, fitness_validity, medical_records, is_verified) VALUES
('e-ramachandran', 'u-owner-ramachandran', 'Thechikottukavu Ramachandran', '/images/elephants/ramachandran.jpg', 'The tallest living captive elephant in Asia, widely celebrated for his majestic presence and the unique privilege of opening the doors of Thrissur Pooram.', 61, 317, 5800, 'KERALA-DEV-E101', 'Mani Nair', '9446012345', '/docs/certificates/ramachandran_fit.pdf', '2027-03-31', 'Excellent health status, regularly checked by Devaswom veterinary board.', TRUE),
('e-karnan', 'u-owner-karnan', 'Mangalamkunnu Karnan', '/images/elephants/karnan.jpg', 'Renowned for his high head posture (Thala Pokkam) and calm temperament, making him a favorite for hoisting festival flags and leading processions.', 53, 308, 5100, 'KERALA-DEV-E102', 'Sasi G.', '9446054321', '/docs/certificates/karnan_fit.pdf', '2027-01-15', 'Fit for transport, no chronic medical issues reported.', TRUE);


-- 5. Seed Accessories
INSERT INTO accessories (id, owner_id, name, category, image_url, description, quantity_total, rental_price, specifications, is_verified) VALUES
('a-nettipattam-gold', 'u-acc-owner-1', 'Premium Gold-Plated Nettipattam (1.5m)', 'Nettipattam', '/images/accessories/nettipattam.jpg', 'Exquisite elephant forehead ornaments made of high-quality copper alloy double gold-plated, traditional round medallions reflecting sunlight beautifully.', 15, 3500.00, '{"Height": "150cm", "Material": "Copper & Gold-Plating", "Style": "Central Travancore Tradition"}', TRUE),
('a-muthukuda-velvet', 'u-acc-owner-1', 'Designer Silk Muthukuda (Assorted Colors)', 'Muthukuda', '/images/accessories/muthukuda.jpg', 'Vibrant traditional decorative umbrellas used during Kudamattom, available in deep maroon, bright yellow, royal blue, and gold-trimmed borders.', 50, 450.00, '{"Diameter": "90cm", "Fabric": "Silk Velvet", "Fringe": "Golden Zari"}', TRUE),
('a-chenda-brass', 'u-acc-owner-2', 'Asuravadyam Chenda Instrument Set', 'Chenda Melam instruments', '/images/accessories/chenda.jpg', 'Handcrafted traditional drums made of jackfruit wood and tightly stretched calfskin, tuned for both Uruttu Chenda and Veeku Chenda performances.', 20, 800.00, '{"Wood": "Varikka Plavu (Jackfruit)", "Skin": "Natural Cowhide", "Strap": "Coir & Hemp Cord"}', TRUE);


-- 6. Seed Elephant Bookings
INSERT INTO elephant_bookings (id, festival_id, elephant_id, start_date, end_date, status, notes) VALUES
('eb-1', 'f-thrissur-pooram-2026', 'e-ramachandran', '2026-04-26', '2026-04-27', 'confirmed', 'Confirmed for opening the southern entrance doorway (Thekke Gopura Vaatil).'),
('eb-2', 'f-thrissur-pooram-2026', 'e-karnan', '2026-04-27', '2026-04-28', 'confirmed', 'Booked for leading the Thiruvambady section of the procession.'),
('eb-3', 'f-nemmara-vela-2026', 'e-ramachandran', '2026-04-03', '2026-04-05', 'pending', 'Awaiting offline review of transportation and crowd safety measures.');


-- 7. Seed Accessory Bookings
INSERT INTO accessory_bookings (id, festival_id, accessory_id, start_date, end_date, quantity, status, notes) VALUES
('ab-1', 'f-thrissur-pooram-2026', 'a-nettipattam-gold', '2026-04-26', '2026-04-28', 15, 'confirmed', 'All 15 units reserved for the main elephant row during Kudamattom.'),
('ab-2', 'f-thrissur-pooram-2026', 'a-muthukuda-velvet', '2026-04-27', '2026-04-27', 30, 'confirmed', 'Set of 30 multi-colored Muthukudas for the competitive umbrella exchange.'),
('ab-3', 'f-nemmara-vela-2026', 'a-chenda-brass', '2026-04-03', '2026-04-05', 10, 'accepted', 'Accepted for renting 10 drums; down payment pending offline verification.');
