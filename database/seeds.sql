-- Insert Doctors
-- Insert Doctors without plaintext passwords. Set passwords via secure flow.
INSERT INTO doctors (name, department, avg_consult_time) VALUES 
('Dr. Smith', 'General Medicine', 10),
('Dr. Jones', 'Cardiology', 20),
('Dr. Emily', 'Pediatrics', 15);

-- Insert Patients (Optional, typically patients register themselves)
INSERT INTO patients (name, age, phone, priority) VALUES
('Alice', 30, '555-0101', 'Normal'),
('Bob', 70, '555-0102', 'Senior'),
('Charlie', 25, '555-0103', 'Emergency');

-- Note: Appointments and Queue are dynamic, best created via app flow.
