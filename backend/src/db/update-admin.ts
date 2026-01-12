import { sequelize } from './connection';
import { User, UserRole } from '../models/User';
import bcrypt from 'bcryptjs';

const updateAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Find existing admin user
    const admin = await User.findOne({ where: { role: UserRole.ADMIN } });
    
    if (admin) {
      const newPassword = await bcrypt.hash('Arunachalam!', 10);
      await admin.update({
        username: 'Kalaiselvan',
        password: newPassword
      });
      console.log('Admin user updated successfully!');
      console.log('Username: Kalaiselvan');
      console.log('Password: Arunachalam!');
    } else {
      console.log('No admin user found. Creating new admin user...');
      const adminPassword = await bcrypt.hash('Arunachalam!', 10);
      await User.create({
        username: 'Kalaiselvan',
        email: 'admin@labcare.com',
        password: adminPassword,
        role: UserRole.ADMIN
      });
      console.log('Admin user created successfully!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error updating admin:', error);
    process.exit(1);
  }
};

updateAdmin();
