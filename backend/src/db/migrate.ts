import { sequelize } from './connection';
import { seedDatabase } from './seed';

const migrate = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');

    await seedDatabase();
    console.log('Database seeded successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrate();
