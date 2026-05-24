const express = require('express');
const router = express.Router();

// Helper to calculate estimated time
const calculateEstimatedTime = async (supabase, doctor_id) => {
    // Get doctor's avg consult time
    const { data: doctor } = await supabase
        .from('doctors')
        .select('avg_consult_time')
        .eq('doctor_id', doctor_id)
        .single();

    if (!doctor) throw new Error('Doctor not found');

    // Count people in queue for this doctor
    const { count } = await supabase
        .from('queue')
        .select('*', { count: 'exact' })
        .eq('doctor_id', doctor_id);

    // Simple calculation: (count) * avg_time
    // If count is 0, estimate is 0 (immediate)
    // We can add current time + estimate
    const minutes = count * doctor.avg_consult_time;
    const estimatedDate = new Date();
    estimatedDate.setMinutes(estimatedDate.getMinutes() + minutes);

    return estimatedDate;
};

// POST /registerPatient
router.post('/registerPatient', async (req, res) => {
    const { name, age, phone, priority } = req.body;

    try {
        const { data, error } = await supabase(req)
            .from('patients')
            .insert([{ name, age, phone, priority }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /patients/:id
router.get('/patients/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { data: patient, error } = await supabase(req)
            .from('patients')
            .select('*')
            .eq('patient_id', id)
            .single();

        if (error) throw error;
        if (!patient) return res.status(404).json({ error: 'Patient not found' });

        res.json(patient);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- AUTHENTICATION ROUTES ---

// POST /login/admin
router.post('/login/admin', async (req, res) => {
    const { password, email } = req.body; // Expect email now, or default to admin@hospital.com if not sent
    // For backward compatibility with frontend sending only password, assume default admin email
    const adminEmail = email || 'admin@hospital.com';

    try {
        const { data: admin, error } = await supabase(req)
            .from('admins')
            .select('*')
            .eq('email', adminEmail)
            .single();

        if (error || !admin) {
            // Fallback for hardcoded if DB not ready? No, strict DB now.
            return res.status(401).json({ error: 'Admin not found' });
        }

        // Simple password check. If no password is set, require setup/reset instead of allowing a default.
        const adminDbPass = admin.password;
        if (!adminDbPass) {
            return res.status(401).json({ error: 'Admin account requires password setup (contact owner)' });
        }

        if (password === adminDbPass) {
            res.json({ success: true, role: 'admin', admin: { email: admin.email } });
        } else {
            res.status(401).json({ error: 'Invalid Password' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /login/doctor
router.post('/login/doctor', async (req, res) => {
    const { doctor_id, password } = req.body;
    try {
        const { data: doctor, error } = await supabase(req)
            .from('doctors')
            .select('*')
            .eq('doctor_id', doctor_id)
            .single();

        if (error || !doctor) return res.status(401).json({ error: 'Doctor not found' });

        // Simple password check (plaintext for demo, hash in prod)
        // Do not assume a plaintext default password; require password setup/reset if missing.
        const dbPass = doctor.password;
        if (!dbPass) return res.status(401).json({ error: 'Doctor account requires password setup' });

        if (password === dbPass) {
            res.json({ success: true, role: 'doctor', doctor });
        } else {
            res.status(401).json({ error: 'Invalid Password' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /login/patient
router.post('/login/patient', async (req, res) => {
    const { patient_id, name } = req.body;
    try {
        // Validate 4-digit code input
        const code = parseInt(patient_id);
        if (isNaN(code)) {
            return res.status(400).json({ error: 'Patient ID must be a 4-digit number' });
        }

        const { data: patient, error } = await supabase(req)
            .from('patients')
            .select('*')
            .eq('patient_code', code)
            .single();

        if (error || !patient) return res.status(401).json({ error: 'Patient not found' });

        if (patient.name.toLowerCase().trim() === name.toLowerCase().trim()) {
            res.json({ success: true, role: 'patient', patient });
        } else {
            res.status(401).json({ error: 'Name does not match ID' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /addDoctor
router.post('/addDoctor', async (req, res) => {
    const { name, department, avg_consult_time, password, email } = req.body;
    try {
        const { data, error } = await supabase(req)
            .from('doctors')
            .insert([{
                name,
                department,
                avg_consult_time,
                // Do not set a plaintext default password; require explicit password or password setup flow.
                password: password || null,
                email: email || null
            }])
            .select()
            .single();
        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        console.error('Add Doctor Error:', err);
        res.status(400).json({ error: err.message });
    }
});

// POST /forgot-password
router.post('/forgot-password', async (req, res) => {
    const { email, role } = req.body;
    const sb = supabase(req);

    if (!email) return res.status(400).json({ error: 'Email is required' });

    try {
        let table = 'doctors';
        if (role === 'admin') table = 'admins';

        // Check if user exists
        const { data: user, error } = await sb
            .from(table)
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(404).json({ error: 'User not found with this email' });
        }

        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        // Save OTP
        const idField = role === 'admin' ? 'admin_id' : 'doctor_id';
        const { error: updateError } = await sb
            .from(table)
            .update({
                reset_token: otp,
                reset_expires_at: expiresAt
            })
            .eq(idField, user[idField]);

        if (updateError) throw updateError;

        // Simulate Email Sending
        console.log(`[MOCK EMAIL] To: ${email}, OTP: ${otp}`);

        res.json({
            success: true,
            message: 'OTP sent to email (Check Console/Alert)',
            debug_otp: otp // For testing convenience
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /reset-password
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword, role } = req.body;
    const sb = supabase(req);

    try {
        let table = 'doctors';
        if (role === 'admin') table = 'admins';

        // Verify User & OTP
        const { data: user, error } = await sb
            .from(table)
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) return res.status(404).json({ error: 'User not found' });

        if (user.reset_token !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        if (new Date() > new Date(user.reset_expires_at)) {
            return res.status(400).json({ error: 'OTP Expired' });
        }

        // Update Password
        const idField = role === 'admin' ? 'admin_id' : 'doctor_id';
        const { error: updateError } = await sb
            .from(table)
            .update({
                password: newPassword,
                reset_token: null,
                reset_expires_at: null
            })
            .eq(idField, user[idField]);

        if (updateError) throw updateError;

        res.json({ success: true, message: 'Password Reset Successful' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /doctors
router.get('/doctors', async (req, res) => {
    try {
        const { data, error } = await supabase(req).from('doctors').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST /bookAppointment
router.post('/bookAppointment', async (req, res) => {
    const { patient_id, doctor_id } = req.body;
    const sb = supabase(req);

    try {
        // 1. Get Patient Details for Priority
        const { data: patient } = await sb
            .from('patients')
            .select('priority')
            .eq('patient_id', patient_id)
            .single();

        if (!patient) throw new Error('Patient not found');

        // Priority mapping
        const priorityMap = { 'Emergency': 1, 'Senior': 2, 'Normal': 3 };
        const priorityLevel = priorityMap[patient.priority] || 3;

        // 2. Generate Token Number (Sequential per day per doctor? Or just global sequential?)
        // Requirement says "queue_size + 1". Let's do daily token for doctor.
        // Count appointments for this doctor today
        const startOfDay = new Date().toISOString().split('T')[0];
        const { count: tokenCount } = await sb
            .from('appointments')
            .select('*', { count: 'exact' })
            .eq('doctor_id', doctor_id)
            .gte('created_at', startOfDay);

        const token_number = (tokenCount || 0) + 1;

        // 3. Create Appointment
        const { data: appointment, error: appError } = await sb
            .from('appointments')
            .insert([{
                patient_id,
                doctor_id,
                token_number,
                status: 'Waiting'
            }])
            .select()
            .single();

        if (appError) throw appError;

        // 4. Calculate Estimated Time & Add to Queue
        // For estimation, we need current queue size, not total appointments
        const estimatedTime = await calculateEstimatedTime(sb, doctor_id);

        const { error: queueError } = await sb
            .from('queue')
            .insert([{
                doctor_id,
                appointment_id: appointment.appointment_id,
                priority_level: priorityLevel,
                estimated_time: estimatedTime
            }]);

        if (queueError) {
            // Rollback appointment if queue fails? (For simplicity, just error out, but in prod use transaction)
            throw queueError;
        }

        res.status(201).json({
            appointment,
            estimated_time: estimatedTime,
            token_number
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /queue/:doctorId
router.get('/queue/:doctorId', async (req, res) => {
    const { doctorId } = req.params;
    try {
        // Join with appointments and patients to get names
        const { data, error } = await supabase(req)
            .from('queue')
            .select(`
        *,
        appointments (
          token_number,
          status,
          patients (name, priority, age)
        )
      `)
            .eq('doctor_id', doctorId)
            .order('priority_level', { ascending: true }) // 1=Emergency first
            .order('created_at', { ascending: true }); // Then FIFO

        if (error) throw error;

        // Transform for frontend
        const formatted = data.map(q => ({
            queue_id: q.queue_id,
            patient_name: q.appointments.patients.name,
            token_number: q.appointments.token_number,
            priority: q.appointments.patients.priority, // or q.priority_level
            estimated_time: q.estimated_time
        }));

        res.json(formatted);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST /nextPatient/:doctorId
router.post('/nextPatient/:doctorId', async (req, res) => {
    const { doctorId } = req.params;
    const sb = supabase(req);
    try {
        // Get top of queue
        const { data: queueItems, error: fetchError } = await sb
            .from('queue')
            .select('queue_id, appointment_id')
            .eq('doctor_id', doctorId)
            .order('priority_level', { ascending: true })
            .order('created_at', { ascending: true })
            .limit(1);

        if (fetchError) throw fetchError;
        if (!queueItems || queueItems.length === 0) {
            return res.status(200).json({ message: 'No patients in queue' });
        }

        const nextItem = queueItems[0];

        // Update Appointment Status to 'In Progress'
        const { error: updateAppError } = await sb
            .from('appointments')
            .update({ status: 'In Progress' })
            .eq('appointment_id', nextItem.appointment_id);

        if (updateAppError) throw updateAppError;

        // Remove from Queue (or keep and mark status? Requirement implies Queue is waiting list)
        // "Mark consultation as completed" is separate. 
        // Usually "Next Patient" moves them from "Waiting" to "In Progress". 
        // And removes them from "Waiting Queue" or they stay in "In Progress Queue"?
        // Let's remove from 'queue' table as table represents 'Waiting Queue'. 
        // But 'queue' table might be useful for display?
        // Let's delete from queue table to signify they are now with doctor.

        const { error: deleteQueueError } = await sb
            .from('queue')
            .delete()
            .eq('queue_id', nextItem.queue_id);

        if (deleteQueueError) throw deleteQueueError;

        res.json({ message: 'Next patient called', appointment_id: nextItem.appointment_id });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST /completeAppointment
router.post('/completeAppointment', async (req, res) => {
    const { appointment_id } = req.body;
    try {
        const { data, error } = await supabase(req)
            .from('appointments')
            .update({ status: 'Completed' })
            .eq('appointment_id', appointment_id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /admin/stats
router.get('/admin/stats', async (req, res) => {
    try {
        // Active Doctors: Count total doctors in system
        const { count: doctorCount, error: doctorError } = await supabase(req)
            .from('doctors')
            .select('*', { count: 'exact', head: true });

        if (doctorError) throw doctorError;

        // Total Patients: Count total registered patients
        const { count: patientCount, error: patientError } = await supabase(req)
            .from('patients')
            .select('*', { count: 'exact', head: true });

        if (patientError) throw patientError;

        res.json({ doctors: doctorCount || 0, patients: patientCount || 0 });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /admin/live-queues
router.get('/admin/live-queues', async (req, res) => {
    try {
        const { data, error } = await supabase(req)
            .from('queue')
            .select(`
                queue_id,
                priority_level,
                estimated_time,
                doctor_id,
                doctors (name, department),
                appointments (
                    token_number,
                    status,
                    patients (patient_id, name, patient_code, priority)
                )
            `)
            .order('priority_level', { ascending: true }) // Emergency first
            .order('created_at', { ascending: true }); // FIFO

        if (error) throw error;

        // Group by doctor
        const groups = {};
        data.forEach(q => {
            const doctor = q.doctors;
            const appointment = q.appointments;
            if (!doctor || !appointment) return;

            const docId = q.doctor_id;
            if (!groups[docId]) {
                groups[docId] = {
                    doctor_id: docId,
                    name: doctor.name,
                    department: doctor.department,
                    patients: []
                };
            }

            groups[docId].patients.push({
                queue_id: q.queue_id,
                token_number: appointment.token_number,
                status: appointment.status,
                patient_id: appointment.patients.patient_id,
                name: appointment.patients.name,
                patient_code: appointment.patients.patient_code,
                priority: appointment.patients.priority,
                estimated_time: q.estimated_time
            });
        });

        const result = Object.values(groups);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /patient/:patientId/appointments
router.get('/patient/:patientId/appointments', async (req, res) => {
    const { patientId } = req.params;
    try {
        const { data, error } = await supabase(req)
            .from('appointments')
            .select(`
                appointment_id,
                token_number,
                status,
                created_at,
                doctors (name),
                queue (estimated_time)
            `)
            .eq('patient_id', patientId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const formatted = data.map(apt => {
            const queueItem = apt.queue && apt.queue.length > 0 ? apt.queue[0] : null;
            let estTime = queueItem?.estimated_time;
            if (!estTime) {
                const fallbackDate = new Date(apt.created_at);
                fallbackDate.setMinutes(fallbackDate.getMinutes() + 15);
                estTime = fallbackDate.toISOString();
            }

            return {
                appointment_id: apt.appointment_id,
                token_number: apt.token_number,
                status: apt.status,
                doctor_name: apt.doctors?.name || 'Doctor',
                estimated_time: estTime
            };
        });

        res.json(formatted);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /doctor/:doctorId/active
router.get('/doctor/:doctorId/active', async (req, res) => {
    const { doctorId } = req.params;
    try {
        const { data, error } = await supabase(req)
            .from('appointments')
            .select(`
                appointment_id,
                token_number,
                status,
                created_at,
                patients (name, priority, age, patient_id)
            `)
            .eq('doctor_id', doctorId)
            .eq('status', 'In Progress')
            .order('created_at', { ascending: false })
            .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
            const apt = data[0];
            res.json({
                appointment_id: apt.appointment_id,
                token_number: apt.token_number,
                status: apt.status,
                patient_name: apt.patients?.name || 'Patient',
                patient_id: apt.patients?.patient_id,
                priority: apt.patients?.priority,
                age: apt.patients?.age
            });
        } else {
            res.json(null);
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Helper for req.supabase
function supabase(req) {
    return req.supabase;
}

module.exports = router;
