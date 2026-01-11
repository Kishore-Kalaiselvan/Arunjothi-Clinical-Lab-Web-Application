import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { UserRole } from '../models/User';
import { Test } from '../models/Test';

const router = express.Router();

// All staff routes require authentication and staff role
router.use(authenticate);
router.use(requireRole(UserRole.STAFF, UserRole.ADMIN)); // Admin can also access staff routes

// Get all tests (for selection)
router.get('/tests', async (req: AuthRequest, res: Response) => {
  try {
    const tests = await Test.findAll({
      order: [['category', 'ASC'], ['name', 'ASC']]
    });
    res.json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
