
async function testStats() {
    try {
        console.log('Testing Admin Stats...');
        const res = await fetch('http://localhost:5000/api/admin/stats');

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

testStats();
