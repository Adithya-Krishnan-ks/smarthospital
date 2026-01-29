
async function testAddDoctor() {
    try {
        console.log('Testing Add Doctor...');
        const res = await fetch('http://localhost:5000/api/addDoctor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Dr. Test',
                department: 'Cardio',
                avg_consult_time: 15
            })
        });

        if (res.ok) {
            const data = await res.json();
            console.log('Success:', data);
        } else {
            const err = await res.json();
            console.error('Error Status:', res.status);
            console.error('Error Message:', err);
        }
    } catch (err) {
        console.error('Network Error:', err.message);
    }
}

testAddDoctor();
