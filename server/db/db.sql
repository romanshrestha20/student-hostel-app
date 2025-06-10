-- db.sql
-- PostgreSQL schema for Hostel Booking Platform

-- Drop existing tables if needed (optional)
DROP TABLE IF EXISTS admin_actions, inquiries, favorites, photos, rooms, hostels, users CASCADE;

-- 1. Users
-- Users: Students, Owners, Admins
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('student', 'owner', 'admin')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hostels
CREATE TABLE hostels (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    amenities TEXT[],
    status VARCHAR(10) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms in Hostels
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    hostel_id INTEGER REFERENCES hostels(id) ON DELETE CASCADE,
    room_type VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    availability BOOLEAN DEFAULT TRUE
);

-- Hostel Photos
CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    hostel_id INTEGER REFERENCES hostels(id) ON DELETE CASCADE,
    url TEXT NOT NULL
);

-- Favorites by Students
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    hostel_id INTEGER REFERENCES hostels(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, hostel_id)
);

-- Inquiries from Students to Owners
CREATE TABLE inquiries (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    hostel_id INTEGER REFERENCES hostels(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Moderation Logs
CREATE TABLE admin_actions (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(10) CHECK (action_type IN ('approve', 'reject', 'remove')) NOT NULL,
    target_type VARCHAR(10) CHECK (target_type IN ('hostel', 'user', 'photo')) NOT NULL,
    target_id INTEGER NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_hostels_status ON hostels(status);
CREATE INDEX idx_rooms_hostel_id ON rooms(hostel_id);
CREATE INDEX idx_inquiries_hostel_id ON inquiries(hostel_id);
CREATE INDEX idx_favorites_student_id ON favorites(student_id);



-- Insert sample data for Hostel Booking Platform

-- 1. Insert Users (students, owners, admins)
INSERT INTO users (name, email, password_hash, role) VALUES
-- Admins
('Admin User', 'admin@hostelbook.com', '$2a$10$xJwL5v5Jz5UZ5Z5Z5Z5Z5u', 'admin'),
('System Admin', 'sysadmin@hostelbook.com', '$2a$10$xJwL5v5Jz5UZ5Z5Z5Z5Z5u', 'admin'),

-- Owners
('John HostelOwner', 'john@hostel.com', '$2a$10$xJwL5v5Jz5UZ5Z5Z5Z5Z5u', 'owner'),
('Sarah LodgeMaster', 'sarah@lodge.com', '$2a$10$xJwL5v5Jz5UZ5Z5Z5Z5Z5u', 'owner'),
('Mike InnKeeper', 'mike@inn.com', '$2a$10$xJwL5v5Jz5UZ5Z5Z5Z5Z5u', 'owner'),

-- Students
('Alice Student', 'alice@uni.edu', '$2a$10$xJwL5v5Jz5UZ5Z5Z5Z5Z5u', 'student'),
('Bob Undergrad', 'bob@college.edu', '$2a$10$xJwL5v5Jz5UZ5Z5Z5Z5Z5u', 'student'),
('Charlie Freshman', 'charlie@university.edu', '$2a$10$xJwL5v5Jz5UZ5Z5Z5Z5Z5u', 'student'),
('Diana Scholar', 'diana@campus.edu', '$2a$10$xJwL5v5Jz5UZ5Z5Z5Z5Z5u', 'student');

-- 2. Insert Hostels
INSERT INTO hostels (owner_id, name, description, address, location_lat, location_lng, amenities, status) VALUES
(3, 'University Hostel', 'Affordable accommodation near campus', '123 College Ave', 40.7128, -74.0060, '{"WiFi", "Laundry", "Kitchen"}', 'approved'),
(3, 'Downtown Dorm', 'Modern living in the city center', '456 Main St', 40.7129, -74.0061, '{"WiFi", "Gym", "TV Lounge"}', 'approved'),
(4, 'Campus Lodge', 'Quiet environment for studying', '789 Academic Rd', 40.7130, -74.0062, '{"WiFi", "Study Room", "Bike Storage"}', 'approved'),
(4, 'Student Haven', 'Friendly atmosphere for international students', '321 Scholar Lane', 40.7131, -74.0063, '{"WiFi", "Cafeteria", "Game Room"}', 'pending'),
(5, 'The Learning Inn', 'Focus on academic success', '654 Education Blvd', 40.7132, -74.0064, '{"WiFi", "Library", "Tutoring Space"}', 'approved'),
(5, 'Graduate House', 'Exclusive for postgraduate students', '987 Thesis Way', 40.7133, -74.0065, '{"WiFi", "Quiet Hours", "Research Lab"}', 'rejected');

-- 3. Insert Rooms
INSERT INTO rooms (hostel_id, room_type, price, availability) VALUES
-- University Hostel rooms
(1, 'Single', 500.00, TRUE),
(1, 'Double', 350.00, TRUE),
(1, 'Dormitory (4-bed)', 250.00, FALSE),

-- Downtown Dorm rooms
(2, 'Single', 600.00, TRUE),
(2, 'Double', 400.00, TRUE),
(2, 'Studio', 700.00, TRUE),

-- Campus Lodge rooms
(3, 'Single', 450.00, FALSE),
(3, 'Double', 300.00, TRUE),
(3, 'Dormitory (6-bed)', 200.00, TRUE),

-- Student Haven rooms
(4, 'Single', 480.00, TRUE),
(4, 'Double', 320.00, TRUE),

-- The Learning Inn rooms
(5, 'Single', 520.00, TRUE),
(5, 'Double', 360.00, FALSE),
(5, 'Study Room', 400.00, TRUE),

-- Graduate House rooms
(6, 'Single', 550.00, TRUE),
(6, 'Single Deluxe', 650.00, TRUE);

-- 4. Insert Photos
INSERT INTO photos (hostel_id, url) VALUES
-- University Hostel photos
(1, 'https://example.com/hostels/university-hostel-1.jpg'),
(1, 'https://example.com/hostels/university-hostel-2.jpg'),
(1, 'https://example.com/hostels/university-hostel-room.jpg'),

-- Downtown Dorm photos
(2, 'https://example.com/hostels/downtown-dorm-exterior.jpg'),
(2, 'https://example.com/hostels/downtown-dorm-lobby.jpg'),
(2, 'https://example.com/hostels/downtown-dorm-room.jpg'),

-- Campus Lodge photos
(3, 'https://example.com/hostels/campus-lodge-building.jpg'),
(3, 'https://example.com/hostels/campus-lodge-garden.jpg'),

-- Student Haven photos
(4, 'https://example.com/hostels/student-haven-1.jpg'),

-- The Learning Inn photos
(5, 'https://example.com/hostels/learning-inn-library.jpg'),
(5, 'https://example.com/hostels/learning-inn-room.jpg'),

-- Graduate House photos
(6, 'https://example.com/hostels/graduate-house-exterior.jpg');

-- 5. Insert Favorites
INSERT INTO favorites (student_id, hostel_id) VALUES
(6, 1),
(6, 3),
(7, 2),
(7, 5),
(8, 1),
(8, 4),
(9, 3);

-- 6. Insert Inquiries
INSERT INTO inquiries (student_id, hostel_id, message, is_read) VALUES
(6, 1, 'Is there a discount for semester-long stay?', FALSE),
(6, 3, 'What are the check-in times?', TRUE),
(7, 2, 'Do you have parking available?', TRUE),
(7, 5, 'Can I see more photos of the study room?', FALSE),
(8, 1, 'Is the dormitory mixed gender?', TRUE),
(9, 3, 'Do you provide bedding?', FALSE);

-- 7. Insert Admin Actions
INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, reason) VALUES
(1, 'approve', 'hostel', 1, 'Meets all requirements'),
(1, 'approve', 'hostel', 2, 'Good location and facilities'),
(2, 'approve', 'hostel', 3, 'Excellent student environment'),
(1, 'reject', 'hostel', 6, 'Incomplete documentation'),
(2, 'remove', 'user', 9, 'Inappropriate behavior');