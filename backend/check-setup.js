// Quick setup checker
const fs = require('fs');
const path = require('path');

console.log('=== Backend Setup Checker ===\n');

// Check .env file
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✓ .env file exists');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'];
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`✓ ${varName} is set`);
    } else {
      console.log(`✗ ${varName} is missing`);
    }
  });
} else {
  console.log('✗ .env file is missing');
  console.log('  Create backend/.env file with database credentials');
}

// Check node_modules
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✓ node_modules exists');
} else {
  console.log('✗ node_modules missing - run: npm install');
}

// Check TypeScript
const tsConfigPath = path.join(__dirname, 'tsconfig.json');
if (fs.existsSync(tsConfigPath)) {
  console.log('✓ tsconfig.json exists');
} else {
  console.log('✗ tsconfig.json missing');
}

console.log('\n=== Next Steps ===');
console.log('1. Ensure PostgreSQL is running');
console.log('2. Create database: createdb clinical_lab');
console.log('3. Run: npm install (if node_modules missing)');
console.log('4. Run: npm run dev');
