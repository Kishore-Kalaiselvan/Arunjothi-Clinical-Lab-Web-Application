import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { UserRole } from '../models/User';
import { Test, TestCategory } from '../models/Test';
import { Report } from '../models/Report';
import { Op } from 'sequelize';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subWeeks, subMonths } from 'date-fns';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireRole(UserRole.ADMIN));

// Get all tests
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

// Create test
router.post(
  '/tests',
  [
    body('name').notEmpty().withMessage('Test name is required'),
    body('category').isIn(Object.values(TestCategory)).withMessage('Invalid category'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number')
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const test = await Test.create(req.body);
      res.status(201).json(test);
    } catch (error) {
      console.error('Error creating test:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Update test
router.put(
  '/tests/:id',
  [
    body('name').optional().notEmpty().withMessage('Test name cannot be empty'),
    body('category').optional().isIn(Object.values(TestCategory)).withMessage('Invalid category'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number')
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const test = await Test.findByPk(req.params.id);
      if (!test) {
        return res.status(404).json({ error: 'Test not found' });
      }

      await test.update(req.body);
      res.json(test);
    } catch (error) {
      console.error('Error updating test:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Delete test
router.delete('/tests/:id', async (req: AuthRequest, res: Response) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    await test.destroy();
    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    console.error('Error deleting test:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get revenue analytics
router.get('/revenue', async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const yesterdayStart = startOfDay(subDays(now, 1));
    const yesterdayEnd = endOfDay(subDays(now, 1));
    const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // Today's revenue
    const todayRevenue = await Report.sum('totalAmount', {
      where: {
        reportDate: {
          [Op.between]: [todayStart, todayEnd]
        },
        status: 'completed'
      }
    }) || 0;

    // Yesterday's revenue
    const yesterdayRevenue = await Report.sum('totalAmount', {
      where: {
        reportDate: {
          [Op.between]: [yesterdayStart, yesterdayEnd]
        },
        status: 'completed'
      }
    }) || 0;

    // This week's revenue
    const weekRevenue = await Report.sum('totalAmount', {
      where: {
        reportDate: {
          [Op.between]: [weekStart, weekEnd]
        },
        status: 'completed'
      }
    }) || 0;

    // Last week's revenue
    const lastWeekRevenue = await Report.sum('totalAmount', {
      where: {
        reportDate: {
          [Op.between]: [lastWeekStart, lastWeekEnd]
        },
        status: 'completed'
      }
    }) || 0;

    // This month's revenue
    const monthRevenue = await Report.sum('totalAmount', {
      where: {
        reportDate: {
          [Op.between]: [monthStart, monthEnd]
        },
        status: 'completed'
      }
    }) || 0;

    // Last month's revenue
    const lastMonthRevenue = await Report.sum('totalAmount', {
      where: {
        reportDate: {
          [Op.between]: [lastMonthStart, lastMonthEnd]
        },
        status: 'completed'
      }
    }) || 0;

    // Calculate percentage changes
    const dailyChange = yesterdayRevenue > 0 
      ? ((Number(todayRevenue) - Number(yesterdayRevenue)) / Number(yesterdayRevenue)) * 100 
      : 0;
    
    const weeklyChange = lastWeekRevenue > 0
      ? ((Number(weekRevenue) - Number(lastWeekRevenue)) / Number(lastWeekRevenue)) * 100
      : 0;

    const monthlyChange = lastMonthRevenue > 0
      ? ((Number(monthRevenue) - Number(lastMonthRevenue)) / Number(lastMonthRevenue)) * 100
      : 0;

    res.json({
      daily: {
        revenue: Number(todayRevenue),
        change: dailyChange,
        previous: Number(yesterdayRevenue)
      },
      weekly: {
        revenue: Number(weekRevenue),
        change: weeklyChange,
        previous: Number(lastWeekRevenue)
      },
      monthly: {
        revenue: Number(monthRevenue),
        change: monthlyChange,
        previous: Number(lastMonthRevenue)
      }
    });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get revenue trends (for charts)
router.get('/revenue/trends', async (req: AuthRequest, res: Response) => {
  try {
    const { period = 'weekly' } = req.query;
    const now = new Date();
    let data: any[] = [];

    if (period === 'daily') {
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);

        const revenue = await Report.sum('totalAmount', {
          where: {
            reportDate: {
              [Op.between]: [dayStart, dayEnd]
            },
            status: 'completed'
          }
        }) || 0;

        data.push({
          date: date.toISOString().split('T')[0],
          revenue: Number(revenue)
        });
      }
    } else if (period === 'weekly') {
      // Last 8 weeks
      for (let i = 7; i >= 0; i--) {
        const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
        const weekEnd = endOfWeek(subWeeks(now, i), { weekStartsOn: 1 });

        const revenue = await Report.sum('totalAmount', {
          where: {
            reportDate: {
              [Op.between]: [weekStart, weekEnd]
            },
            status: 'completed'
          }
        }) || 0;

        const weekNumber = Math.ceil((weekStart.getTime() - new Date(weekStart.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));

        data.push({
          week: `Week ${weekNumber}`,
          revenue: Number(revenue)
        });
      }
    } else if (period === 'monthly') {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const monthStart = startOfMonth(subMonths(now, i));
        const monthEnd = endOfMonth(subMonths(now, i));

        const revenue = await Report.sum('totalAmount', {
          where: {
            reportDate: {
              [Op.between]: [monthStart, monthEnd]
            },
            status: 'completed'
          }
        }) || 0;

        data.push({
          month: monthStart.toLocaleString('default', { month: 'long', year: 'numeric' }),
          revenue: Number(revenue)
        });
      }
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching revenue trends:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
