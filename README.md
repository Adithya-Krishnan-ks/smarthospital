# Smart Hospital Appointment & Queue Management System

## Features
- **Patient**: Register, Book Appointment, View Live Token Status.
- **Doctor**: Login, View Queue, Call Next Patient.
- **Admin**: Add Doctor, View Stats.

## Prerequisites
- Node.js (v14+)
- Supabase Account

## Setup

### Database
1. Create a new Supabase project.
2. Go to the SQL Editor in Supabase Dashboard.
3. Run the content of `database/schema.sql`.

### Backend
1. Navigate to `backend/`.
2. `npm install` (should be done).
3. Copy `.env` and fill in your details:
   ```
   SUPABASE_URL=...
   SUPABASE_KEY=...
   ```
   (Use the Service Role Key for backend if needed, or Anon key if RLS allows. For this demo, Service Role is easier for Admin actions, but Anon is safer. Code uses standard client).
4. Run:
   ```bash
   npm run dev
   ```
   Server starts on port 5000.

### Frontend
1. Navigate to `frontend/`.
2. `npm install` (if not already done).
3. Install additional dependencies (if automated setup failed):
   ```bash
   npm install axios react-router-dom lucide-react
   ```
4. Run:
   ```bash
   npm run dev
   ```
   App starts on `http://localhost:5173`.


## Usage
1. Open Admin Dashboard (`/admin`) to add a doctor first.
2. Open Patient Portal (`/patient`) to register and book that doctor.
3. Open Doctor Portal (`/doctor`) to view the queue and manage patients.

for reference:
<img width="1920" height="884" alt="Screenshot 2026-01-29 214233" src="https://github.com/user-attachments/assets/f23ce274-af36-44c1-8a97-808524b47b87" />
<img width="1920" height="922" alt="Screenshot 2026-01-29 214154" src="https://github.com/user-attachments/assets/0d9dd66f-d523-4f8c-8b4a-fe972101fab1" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/0136b8ba-e254-4500-b1a4-b9ab3e202589" />
<img width="1920" height="915" alt="Screenshot 2026-01-29 214247" src="https://github.com/user-attachments/assets/16afeea9-3771-4545-9b3d-08338e258543" />
<img width="1920" height="902" alt="Screenshot 2026-01-29 214312" src="https://github.com/user-attachments/assets/282e9213-aeec-4107-b461-0ae8502ac721" />
<img width="1920" height="919" alt="Screenshot 2026-01-29 214333" src="https://github.com/user-attachments/assets/a3f551cd-caf0-4cad-aba9-9bae492fa151" />



