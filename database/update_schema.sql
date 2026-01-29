-- Run this in your Supabase SQL Editor to fix the missing column

ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS password TEXT;

-- NOTE: Do NOT set plaintext default passwords. Run a secure migration to set
-- hashed passwords for existing users or require password reset for all users.
