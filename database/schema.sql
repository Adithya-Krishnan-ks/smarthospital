-- ==========================================
-- SMART HOSPITAL COMPLETE DATABASE SETUP
-- Copy and run this script in your Supabase SQL Editor
-- ==========================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Enum Types
DO $$ BEGIN
    CREATE TYPE priority_level AS ENUM ('Normal', 'Senior', 'Emergency');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM ('Waiting', 'In Progress', 'Completed', 'Cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Create Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    avg_consult_time INT NOT NULL DEFAULT 10, -- in minutes
    password TEXT, -- Plaintext for demo/hashed in production
    email TEXT UNIQUE,
    reset_token TEXT,
    reset_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Patients Table
CREATE TABLE IF NOT EXISTS patients (
    patient_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    age INT NOT NULL,
    phone TEXT NOT NULL,
    priority priority_level NOT NULL DEFAULT 'Normal',
    patient_code SERIAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reset sequence to start from 1000 (gives patient IDs starting at 1000)
ALTER SEQUENCE IF EXISTS patients_patient_code_seq RESTART WITH 1000;

-- Index for fast patient code lookup
CREATE INDEX IF NOT EXISTS idx_patients_code ON patients(patient_code);

-- 5. Create Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(doctor_id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    token_number INT NOT NULL,
    status appointment_status NOT NULL DEFAULT 'Waiting',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create Queue Table (Live tracking)
CREATE TABLE IF NOT EXISTS queue (
    queue_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(appointment_id) ON DELETE CASCADE,
    priority_level INT NOT NULL, -- 1=Emergency, 2=Senior, 3=Normal (Mapped from Enum for sorting)
    estimated_time TIMESTAMP WITH TIME ZONE, -- The absolute estimated time of consultation
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queue sorting/lookups
CREATE INDEX IF NOT EXISTS idx_queue_doctor_priority ON queue(doctor_id, priority_level ASC, created_at ASC);

-- 7. Create Admins Table
CREATE TABLE IF NOT EXISTS admins (
    admin_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT, -- Store hashed passwords in production
    reset_token TEXT,
    reset_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Seed Default Admin (Requires password setup / change in production)
INSERT INTO admins (email, password)
VALUES ('admin@hospital.com', 'admin123')
ON CONFLICT (email) DO NOTHING;

-- 9. Seed Default Doctors
INSERT INTO doctors (name, department, avg_consult_time, password, email) VALUES 
('Dr. Smith', 'General Medicine', 10, '123456', 'smith@hospital.com'),
('Dr. Jones', 'Cardiology', 20, '123456', 'jones@hospital.com'),
('Dr. Emily', 'Pediatrics', 15, '123456', 'emily@hospital.com')
ON CONFLICT DO NOTHING;
