import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { User, UserRole } from '../models/User';

const router = express.Router();

// Login
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;

      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const jwtSecret: string = process.env.JWT_SECRET || 'secret';
      
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        jwtSecret,
        {
          expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        } as SignOptions
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Initialize default users (for first-time setup)
router.post('/init', async (req: Request, res: Response) => {
  try {
    const adminExists = await User.findOne({ where: { role: UserRole.ADMIN } });
    if (adminExists) {
      return res.status(400).json({ error: 'System already initialized' });
    }

    const adminPassword = await bcrypt.hash('admin123', 10);
    const staffPassword = await bcrypt.hash('staff123', 10);

    const admin = await User.create({
      username: 'admin',
      email: 'admin@labcare.com',
      password: adminPassword,
      role: UserRole.ADMIN
    });

    const staff = await User.create({
      username: 'staff',
      email: 'staff@labcare.com',
      password: staffPassword,
      role: UserRole.STAFF
    });

    res.json({
      message: 'Default users created successfully',
      admin: { username: admin.username, email: admin.email },
      staff: { username: staff.username, email: staff.email }
    });
  } catch (error) {
    console.error('Init error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
