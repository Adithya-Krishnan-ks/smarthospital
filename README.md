# Smart Hospital Appointment & Queue Management System

## Features
- **Patient**: Register, Book Appointment, View Live Token Status.
- **Doctor**: Login, View Queue, Call Next Patient.
- **Admin**: Add Doctor, View Stats.
<img width="1568" height="718" alt="Screenshot 2026-05-25 025443" src="https://github.com/user-attachments/assets/52673ab8-8b52-48f9-89ba-a20887c44405" />
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
Dark mode:
<img width="1255" height="725" alt="Screenshot 2026-05-25 025900" src="https://github.com/user-attachments/assets/0a72f944-cf7e-4f2e-a378-cc115ebbe54b" />
Other pages:
<img width="1549" height="876" alt="Screenshot 2026-05-25 025607" src="https://github.com/user-attachments/assets/137d44cd-9ea1-4117-9a4f-bf11c40dff31" />
<img width="1770" height="1002" alt="Screenshot 2026-05-25 025714" src="https://github.com/user-attachments/assets/d88edf91-f443-43e1-b2eb-e599bf8e2377" />
<img width="1249" height="972" alt="Screenshot 2026-05-25 025819" src="https://github.com/user-attachments/assets/7a846a6c-e244-4a31-8968-c4c4b3709faa" />





