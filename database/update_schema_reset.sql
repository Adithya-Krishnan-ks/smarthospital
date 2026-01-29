-- 1. Add Email and Reset Token columns to Doctors table
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS reset_token TEXT,
ADD COLUMN IF NOT EXISTS reset_expires_at TIMESTAMP WITH TIME ZONE;

-- 2. Create Admins table
CREATE TABLE IF NOT EXISTS admins (
    admin_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT, -- Store hashed passwords in production
    reset_token TEXT,
    reset_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Seed Default Admin (if not exists)
-- Create a default admin account without a plaintext password.
INSERT INTO admins (email, password)
VALUES ('admin@hospital.com', NULL)
ON CONFLICT (email) DO NOTHING;

-- Optional: Update existing doctors with dummy emails for testing
-- UPDATE doctors SET email = 'doc' || substring(cast(doctor_id as text), 1, 4) || '@hospital.com' WHERE email IS NULL;
