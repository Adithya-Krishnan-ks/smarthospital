-- Add a user-friendly 4-digit ID column (auto-incrementing)
ALTER TABLE patients ADD COLUMN IF NOT EXISTS patient_code SERIAL;

-- Start the sequence at 1000 so the first patient gets ID 1000 (4 digits)
ALTER SEQUENCE patients_patient_code_seq RESTART WITH 1000;

-- Index for fast login lookup
CREATE INDEX IF NOT EXISTS idx_patients_code ON patients(patient_code);
