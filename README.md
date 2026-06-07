# FUTURE_FS_02
# Mini CRM — Client Lead Management System

A full-stack CRM to manage client leads with React frontend + Node/Express backend + MongoDB.

## Project Structure

```
mini-crm/
├── backend/
│   ├── models/         # Mongoose models (Lead, User)
│   ├── routes/         # Express routes (auth, leads)
│   ├── middleware/     # JWT auth middleware
│   ├── server.js       # Entry point
│   ├── .env.example    # Environment variables template
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/ # AuthContext, LeadModal
    │   ├── pages/      # Login, Dashboard
    │   ├── api.js      # Axios instance
    │   └── App.js
    └── package.json
```

## Setup & Run

### 1. Install MongoDB
Make sure MongoDB is running locally on port 27017.
- Mac: `brew services start mongodb-community`
- Ubuntu: `sudo systemctl start mongod`
- Windows: Start MongoDB from Services

### 2. Backend Setup
```bash
cd mini-crm/backend
npm install
cp .env.example .env        # then edit .env with your values
node server.js              # or: npm run dev (uses nodemon)
```
Backend runs at: http://localhost:5000

### 3. Frontend Setup
```bash
cd mini-crm/frontend
npm install
npm start
```
Frontend runs at: http://localhost:3000

### 4. Create your first admin user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@example.com","password":"password123","role":"admin"}'
```

Then open http://localhost:3000 and log in.

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/leads | List leads (search/filter) |
| POST | /api/leads | Create lead |
| PUT | /api/leads/:id | Update lead |
| PATCH | /api/leads/:id/status | Quick status update |
| DELETE | /api/leads/:id | Delete lead |
