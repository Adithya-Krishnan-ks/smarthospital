
async function testAuth() {
    console.log('--- Testing Authentication ---');

    const API = 'http://localhost:5000/api';

    // Helper for fetch
    const post = async (url, body) => {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            return { ok: res.ok, status: res.status, data };
        } catch (err) {
            return { ok: false, error: err.message };
        }
    };

    const get = async (url) => {
        try {
            const res = await fetch(url);
            const data = await res.json();
            return { ok: res.ok, status: res.status, data };
        } catch (err) {
            return { ok: false, error: err.message };
        }
    };

    // 1. Test Admin Login
    console.log('1. Admin Login (Correct)...');
    const adminRes = await post(`${API}/login/admin`, { password: 'admin123' });
    if (adminRes.ok) console.log('   Success:', adminRes.data.success);
    else console.error('   Failed:', adminRes.data || adminRes.error);

    console.log('1b. Admin Login (Wrong)...');
    const adminWrong = await post(`${API}/login/admin`, { password: 'wrong' });
    if (!adminWrong.ok) console.log('   Success: Rejected as expected');
    else console.error('   Failed: Should have been rejected', adminWrong.data);

    // 2. Test Doctor Login
    // Need a valid doctor ID first
    const docs = await get(`${API}/doctors`);
    if (docs.ok && docs.data.length > 0) {
        const doctorId = docs.data[0].doctor_id;
        console.log('2. Doctor Login (Using ID:', doctorId, ')...');
        const docRes = await post(`${API}/login/doctor`, { doctor_id: doctorId, password: '123456' });
        if (docRes.ok) console.log('   Success:', docRes.data.success);
        else console.error('   Failed:', docRes.data || docRes.error);
    } else {
        console.warn('   Skipping Doctor Login: No doctors found or API error');
    }

    // 3. Test Patient Login
    console.log('3. Register & Login Patient...');
    const regRes = await post(`${API}/registerPatient`, {
        name: 'TestAuth', age: 25, phone: '000', priority: 'Normal'
    });

    if (regRes.ok) {
        const pat = regRes.data;
        console.log('   Registered:', pat.patient_id);

        const patRes = await post(`${API}/login/patient`, {
            patient_id: pat.patient_id,
            name: 'TestAuth'
        });
        if (patRes.ok) console.log('   Login Success:', patRes.data.success);
        else console.error('   Failed:', patRes.data || patRes.error);
    } else {
        console.error('   Failed to Register Patient:', regRes.data || regRes.error);
    }
}

testAuth();
