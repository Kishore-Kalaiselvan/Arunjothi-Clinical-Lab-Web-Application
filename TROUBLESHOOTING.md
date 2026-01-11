# Troubleshooting Backend Server Errors

## Common Errors and Solutions

### 1. Database Connection Error

**Error:** `Unable to connect to the database` or `Connection refused`

**Solutions:**
- Ensure PostgreSQL is running:
  ```bash
  # Windows (if installed as service)
  # Check Services app or run:
  net start postgresql-x64-15
  
  # Or check if it's running:
  psql -U postgres -c "SELECT version();"
  ```

- Verify database credentials in `backend/.env`:
  ```env
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=clinical_lab
  DB_USER=postgres
  DB_PASSWORD=your_password
  ```

- Create the database if it doesn't exist:
  ```bash
  createdb clinical_lab
  # Or using psql:
  psql -U postgres
  CREATE DATABASE clinical_lab;
  ```

### 2. Module Not Found Errors

**Error:** `Cannot find module 'xxx'` or `Module not found`

**Solution:**
```bash
cd backend
npm install
```

### 3. TypeScript Compilation Errors

**Error:** Type errors when starting

**Solution:**
```bash
cd backend
npm run build
# Check for errors, then:
npm run dev
```

### 4. Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
- Change port in `backend/.env`:
  ```env
  PORT=5001
  ```

- Or kill the process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Linux/Mac
  lsof -ti:5000 | xargs kill
  ```

### 5. Environment Variables Not Loading

**Error:** `undefined` values for environment variables

**Solution:**
- Ensure `.env` file exists in `backend/` directory
- Check file name is exactly `.env` (not `.env.txt`)
- Verify format (no spaces around `=`)
  ```env
  DB_HOST=localhost
  ```

### 6. Association Errors

**Error:** `Association with alias 'xxx' does not exist`

**Solution:**
- The models are set up in `backend/src/models/index.ts`
- Ensure all models are imported before associations are set up
- Restart the server after making model changes

### 7. Missing Dependencies

**Error:** Package not found

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

## Step-by-Step Debugging

1. **Check if dependencies are installed:**
   ```bash
   cd backend
   ls node_modules
   ```

2. **Verify database connection:**
   ```bash
   psql -U postgres -d clinical_lab -c "SELECT 1;"
   ```

3. **Test environment variables:**
   ```bash
   cd backend
   node -e "require('dotenv').config(); console.log(process.env.DB_HOST)"
   ```

4. **Check TypeScript compilation:**
   ```bash
   cd backend
   npm run build
   ```

5. **Run with verbose logging:**
   ```bash
   cd backend
   DEBUG=* npm run dev
   ```

## Quick Fix Commands

```bash
# Complete reset (if nothing works)
cd backend
rm -rf node_modules dist package-lock.json
npm install
npm run build
npm run dev
```

## Still Having Issues?

1. Check the full error message in the terminal
2. Verify PostgreSQL is installed and running
3. Ensure all environment variables are set correctly
4. Check that port 5000 is not in use
5. Review the error stack trace for specific file/line issues
