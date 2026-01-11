# Quick Setup Guide

## Prerequisites
- Docker and Docker Compose installed
- Git (to clone the repository)

## Quick Start with Docker

1. **Clone and navigate to the project:**
```bash
git clone <repository-url>
cd Arunjothi-Clinical-Lab
```

2. **Start the services:**
```bash
docker-compose up -d
```

3. **Initialize the database (run once):**
```bash
docker-compose exec backend npm run migrate
```

4. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Default Login Credentials

**Admin:**
- Username: `admin`
- Password: `admin123`

**Staff:**
- Username: `staff`
- Password: `staff123`

⚠️ **Change these passwords in production!**

## Development Setup (Without Docker)

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Set Up PostgreSQL

Create a PostgreSQL database:
```bash
createdb clinical_lab
```

### 3. Configure Environment

Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clinical_lab
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### 4. Initialize Database

```bash
cd backend
npm run migrate
```

### 5. Start Development Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `psql -l | grep clinical_lab`

### Port Already in Use
- Change ports in `docker-compose.yml` or `.env` files
- Kill processes using ports 3000 or 5000

### Docker Issues
- Ensure Docker is running: `docker ps`
- Check logs: `docker-compose logs`
- Rebuild: `docker-compose build --no-cache`

## Production Deployment

1. Update environment variables in `docker-compose.yml`
2. Change `JWT_SECRET` to a strong random string
3. Update database passwords
4. Build and start:
```bash
docker-compose build
docker-compose up -d
```

## Features Overview

### Admin Dashboard
- Manage test prices
- View revenue analytics (daily, weekly, monthly)
- Add/edit/delete tests

### Staff Portal
- Register new patients
- Select tests for patients
- Generate and print lab reports
- Enter test results

## Support

For issues, check the logs:
```bash
docker-compose logs backend
docker-compose logs frontend
```
