-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum Types
CREATE TYPE priority_level AS ENUM ('Normal', 'Senior', 'Emergency');
CREATE TYPE appointment_status AS ENUM ('Waiting', 'In Progress', 'Completed', 'Cancelled');

-- Doctors Table
CREATE TABLE doctors (
    doctor_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    avg_consult_time INT NOT NULL DEFAULT 10, -- in minutes
    password TEXT NOT NULL DEFAULT '123456',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients Table
CREATE TABLE patients (
    patient_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    age INT NOT NULL,
    phone TEXT NOT NULL,
    priority priority_level NOT NULL DEFAULT 'Normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments Table
CREATE TABLE appointments (
    appointment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(doctor_id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    token_number INT NOT NULL,
    status appointment_status NOT NULL DEFAULT 'Waiting',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Queue Table (Live tracking)
-- Note: In a simple design, we can query appointments, but a separate table helps for optimizing 'next patient' logic if we want to retain history in appointments but mutate queue. 
-- However, for this requirement, we can model the Queue as a view or query on Appointments.
-- But the requirement asks for a Queue table: "Queue(queue_id, doctor_id, appointment_id, priority, estimated_time)"
CREATE TABLE queue (
    queue_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(appointment_id) ON DELETE CASCADE,
    priority_level INT NOT NULL, -- 1=Emergency, 2=Senior, 3=Normal (Mapped from Enum for sorting)
    estimated_time TIMESTAMP WITH TIME ZONE, -- The absolute estimated time of consultation
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queue lookups
CREATE INDEX idx_queue_doctor_priority ON queue(doctor_id, priority_level ASC, created_at ASC);
