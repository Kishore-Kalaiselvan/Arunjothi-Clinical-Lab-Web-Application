# Arunjothi Clinical Laboratory Management System

An enterprise-level web application for managing clinical laboratory operations, including test management, patient registration, report generation, and revenue analytics.

## Features

### Admin Features
- **Test Management**: Add, edit, delete, and set prices for laboratory tests
- **Revenue Analytics**: View daily, weekly, and monthly revenue with trends
- **Dashboard Overview**: Quick overview of tests and revenue metrics

### Staff Features
- **Patient Registration**: Register new patients and select required tests
- **Report Generation**: Generate lab reports with editable templates
- **Test Result Entry**: Enter test results, units, and reference ranges
- **Print Reports**: Print professional lab reports

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT-based authentication
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)
- PostgreSQL 15+ (if running without Docker)

## Installation

### Option 1: Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd Arunjothi-Clinical-Lab
```

2. Create environment files:
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

3. Start services:
```bash
docker-compose up -d
```

4. Initialize database:
```bash
docker-compose exec backend npm run migrate
```

5. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Option 2: Local Development

1. Install dependencies:
```bash
# Root
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

2. Set up PostgreSQL database:
```bash
createdb clinical_lab
```

3. Configure environment:
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your database credentials
```

4. Initialize database:
```bash
cd backend
npm run migrate
```

5. Start development servers:
```bash
# From root directory
npm run dev

# Or separately:
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start
```

## Default Credentials

- **Admin**: 
  - Username: `admin`
  - Password: `admin123`

- **Staff**: 
  - Username: `staff`
  - Password: `staff123`

**⚠️ Important**: Change these default passwords in production!

## Project Structure

```
.
├── backend/                 # Backend API
│   ├── src/
│   │   ├── db/            # Database connection and migrations
│   │   ├── models/        # Sequelize models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   └── server.ts      # Express server
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   └── types/          # TypeScript types
│   ├── public/
│   └── package.json
├── docker-compose.yml      # Production Docker setup
├── docker-compose.dev.yml  # Development Docker setup
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/init` - Initialize default users

### Admin Routes (Requires Admin Role)
- `GET /api/admin/tests` - Get all tests
- `POST /api/admin/tests` - Create test
- `PUT /api/admin/tests/:id` - Update test
- `DELETE /api/admin/tests/:id` - Delete test
- `GET /api/admin/revenue` - Get revenue analytics
- `GET /api/admin/revenue/trends` - Get revenue trends

### Staff Routes (Requires Staff/Admin Role)
- `GET /api/staff/tests` - Get all tests

### Report Routes (Requires Authentication)
- `POST /api/reports` - Create new report
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get report by ID
- `PUT /api/reports/:id` - Update report

## Available Tests

The system comes pre-loaded with tests from your lab prescription, including:
- Haematology (CBC, Haemoglobin, ESR, etc.)
- Biochemistry (Blood Sugar, HBA1c, etc.)
- Serology (HBsAg, HIV, HCV, etc.)
- Urine Analysis
- Lipid Profile
- Liver Function Test
- Thyroid Function Test
- Kidney Function Test
- And more...

## Production Deployment

1. Update environment variables in `docker-compose.yml`
2. Change JWT_SECRET to a strong random string
3. Update database passwords
4. Build and start:
```bash
docker-compose build
docker-compose up -d
```

## Future Enhancements

- Offline mode support
- Multi-language support
- Advanced reporting features
- Email notifications
- Mobile app

## Support

For issues or questions, please contact the development team.

## License

Proprietary - All rights reserved
