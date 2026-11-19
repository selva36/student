-- ========================================================
-- STUDENT MANAGEMENT SYSTEM - DATABASE SCHEMA & SAMPLE DATA
-- Subject: Java Programming Mini Project
-- Database: MySQL
-- ========================================================

-- Step 1: Create Database
CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

-- Step 2: Drop existing tables if they exist to prevent conflicts
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS admins;

-- Step 3: Create Admins Table for Authentication
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(30) DEFAULT 'Administrator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Create Students Table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    register_no VARCHAR(30) NOT NULL UNIQUE,
    dob DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    department VARCHAR(50) NOT NULL,
    year ENUM('1st Year', '2nd Year', '3rd Year', '4th Year') NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    status ENUM('Active', 'Inactive', 'Graduated') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Step 5: Insert Default Administrator Record
-- Default credentials: username = admin, password = admin123
INSERT INTO admins (username, password, full_name, email, role)
VALUES ('admin', 'admin123', 'System Administrator', 'admin@sms.edu', 'Administrator');

-- Step 6: Insert Sample Student Records (Diverse Departments & Years)
INSERT INTO students (student_id, name, register_no, dob, gender, department, year, email, phone, address, status) VALUES
('STU-1001', 'Aarav Sharma', 'REG2024CS001', '2003-05-14', 'Male', 'Computer Science', '3rd Year', 'aarav.sharma@example.edu', '+91 9876543210', '42 Tech Park Avenue, Bangalore, Karnataka', 'Active'),
('STU-1002', 'Diya Patel', 'REG2024IT002', '2004-08-22', 'Female', 'Information Technology', '2nd Year', 'diya.patel@example.edu', '+91 9812345678', '15 Lake View Road, Ahmedabad, Gujarat', 'Active'),
('STU-1003', 'Rohan Verma', 'REG2024EC003', '2002-11-09', 'Male', 'Electronics & Comm.', '4th Year', 'rohan.verma@example.edu', '+91 9723456789', '78 Green Glen Layout, Hyderabad, Telangana', 'Active'),
('STU-1004', 'Ananya Iyer', 'REG2024CS004', '2005-02-18', 'Female', 'Computer Science', '1st Year', 'ananya.iyer@example.edu', '+91 9934567890', '102 Temple Street, Chennai, Tamil Nadu', 'Active'),
('STU-1005', 'Vikram Malhotra', 'REG2024ME005', '2003-09-30', 'Male', 'Mechanical', '3rd Year', 'vikram.m@example.edu', '+91 9645678901', '55 Industrial Area, Pune, Maharashtra', 'Active'),
('STU-1006', 'Sneha Kulkarni', 'REG2024EE006', '2004-04-12', 'Female', 'Electrical & Electronics', '2nd Year', 'sneha.k@example.edu', '+91 9556789012', '23 Cyber City, Mumbai, Maharashtra', 'Active'),
('STU-1007', 'Karthik Raja', 'REG2024CV007', '2002-07-25', 'Male', 'Civil', '4th Year', 'karthik.r@example.edu', '+91 9467890123', '88 Hill View Colony, Coimbatore, Tamil Nadu', 'Graduated'),
('STU-1008', 'Pooja Nair', 'REG2024IT008', '2005-01-10', 'Female', 'Information Technology', '1st Year', 'pooja.nair@example.edu', '+91 9378901234', '14 Palm Grove, Kochi, Kerala', 'Active');

-- Step 7: Verify Data
SELECT COUNT(*) AS total_students FROM students;
SELECT department, COUNT(*) AS count_per_dept FROM students GROUP BY department;

