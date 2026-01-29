-- Insert Doctors
INSERT INTO doctors (name, department, avg_consult_time, password) VALUES 
('Dr. Smith', 'General Medicine', 10, '123456'),
('Dr. Jones', 'Cardiology', 20, '123456'),
('Dr. Emily', 'Pediatrics', 15, '123456');

-- Insert Patients (Optional, typically patients register themselves)
INSERT INTO patients (name, age, phone, priority) VALUES
('Alice', 30, '555-0101', 'Normal'),
('Bob', 70, '555-0102', 'Senior'),
('Charlie', 25, '555-0103', 'Emergency');

-- Note: Appointments and Queue are dynamic, best created via app flow.
