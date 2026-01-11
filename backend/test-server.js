// Quick test to see what error occurs
require('dotenv').config();
const { sequelize } = require('./dist/db/connection');

async function test() {
  try {
    await sequelize.authenticate();
    console.log('Database connection OK');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

test();
