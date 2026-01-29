-- 1. Fix Priority Level Type (Handle if exists)
DO $$ BEGIN
    CREATE TYPE priority_level AS ENUM ('Normal', 'Senior', 'Emergency');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add 'password' to doctors (Safe Add)
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS password TEXT DEFAULT '123456';

-- 3. Add 'patient_code' to patients (Safe Add + Sequence)
ALTER TABLE patients ADD COLUMN IF NOT EXISTS patient_code SERIAL;

-- Reset sequence to start from 1000 (Safe to run multiple times, will just reset start)
ALTER SEQUENCE IF EXISTS patients_patient_code_seq RESTART WITH 1000;

-- 4. Ensure Index Exists
CREATE INDEX IF NOT EXISTS idx_patients_code ON patients(patient_code);

-- 5. Optional: Backfill existing patients with codes if they have 0 or null (though SERIAL does this usually)
-- UPDATE patients SET patient_code = nextval('patients_patient_code_seq') WHERE patient_code IS NULL;
