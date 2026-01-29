# Smart Hospital Appointment & Queue Management System

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

## Features
- **Patient**: Register, Book Appointment, View Live Token Status.
- **Doctor**: Login, View Queue, Call Next Patient.
- **Admin**: Add Doctor, View Stats.

## Usage
1. Open Admin Dashboard (`/admin`) to add a doctor first.
2. Open Patient Portal (`/patient`) to register and book that doctor.
3. Open Doctor Portal (`/doctor`) to view the queue and manage patients.
