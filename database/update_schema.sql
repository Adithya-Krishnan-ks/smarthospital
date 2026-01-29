-- Run this in your Supabase SQL Editor to fix the missing column

ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS password TEXT DEFAULT '123456';

-- Optional: Update existing rows to have this password if the default didn't apply
UPDATE doctors SET password = '123456' WHERE password IS NULL;
