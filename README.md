# JobTracker

A fullstack job application tracker to organize and monitor your job search. Built with React + FastAPI + SQLite.

**Live:** [job-tracker-pyaa.onrender.com](https://job-tracker-pyaa.onrender.com/)

## Features

- **Track applications** — company, role, location, pay, status, next stage, referral, notes
- **User accounts** — register/login with email and password (JWT auth)
- **Dashboard stats** — total applied, response rate %, next stage rate %, rejected, no reply, referrals
- **Search & filter** — search by company/role/location/notes, filter by status or next stage
- **Sortable columns** — click any column header to sort
- **Per-user data** — each user sees only their own applications

## Status Options

| Status | Description |
|--------|-------------|
| Waiting | Applied, no response yet |
| Replied | Got a response back |
| Rejected | Application rejected |
| Offer | Received an offer |
| Role Filled | Position was filled |

## Next Stage Options

Coding Assessment, Phone Screen, Behavioral, Technical Interview, Onsite

## Tech Stack

- **Frontend:** React, Vite, Lucide Icons
- **Backend:** FastAPI, SQLAlchemy, SQLite
- **Auth:** JWT (python-jose), bcrypt (passlib)
- **Hosting:** Render

## Run Locally

```bash
# Backend
cd backend
pip install -r ../requirements.txt
python -m uvicorn main:app --port 8000

# Frontend (separate terminal)
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)
