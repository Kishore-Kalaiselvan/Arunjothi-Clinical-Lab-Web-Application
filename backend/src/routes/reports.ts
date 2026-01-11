import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import { Report } from '../models/Report';
import { ReportTest } from '../models/ReportTest';
import { Test } from '../models/Test';
import { Op } from 'sequelize';

const router = express.Router();

// All report routes require authentication
router.use(authenticate);

// Generate report number
const generateReportNumber = async (): Promise<string> => {
  const count = await Report.count();
  const timestamp = Date.now().toString().slice(-8);
  return `RPT-${timestamp}${String(count + 1).padStart(4, '0')}`;
};

// Create new report
router.post(
  '/',
  [
    body('patientName').notEmpty().withMessage('Patient name is required'),
    body('patientAge').isInt({ min: 0 }).withMessage('Valid age is required'),
    body('patientSex').notEmpty().withMessage('Patient sex is required'),
    body('referredBy').notEmpty().withMessage('Referred by is required'),
    body('testIds').isArray({ min: 1 }).withMessage('At least one test must be selected')
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { patientName, patientAge, patientSex, referredBy, testIds, reportDate } = req.body;

      // Get selected tests and calculate total
      const tests = await Test.findAll({
        where: { id: { [Op.in]: testIds } }
      });

      if (tests.length !== testIds.length) {
        return res.status(400).json({ error: 'One or more tests not found' });
      }

      const totalAmount = tests.reduce((sum, test) => sum + Number(test.price), 0);
      const reportNumber = await generateReportNumber();

      // Create report
      const report = await Report.create({
        reportNumber,
        patientName,
        patientAge,
        patientSex,
        referredBy,
        reportDate: reportDate ? new Date(reportDate) : new Date(),
        totalAmount,
        createdBy: req.user!.id,
        status: 'draft'
      });

      // Create report tests
      const reportTests = await Promise.all(
        tests.map(test =>
          ReportTest.create({
            reportId: report.id,
            testId: test.id,
            unit: '',
            referenceRange: ''
          })
        )
      );

      // Fetch report with tests
      const reportWithTests = await Report.findByPk(report.id, {
        include: [
          {
            model: ReportTest,
            as: 'reportTests',
            include: [
              {
                model: Test,
                as: 'test'
              }
            ]
          }
        ]
      });

      res.status(201).json(reportWithTests);
    } catch (error) {
      console.error('Error creating report:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Get report by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const report = await Report.findByPk(req.params.id, {
      include: [
        {
          model: ReportTest,
          as: 'reportTests',
          include: [
            {
              model: Test,
              as: 'test'
            }
          ]
        }
      ]
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update report (for entering test results)
router.put(
  '/:id',
  [
    body('reportTests').isArray().withMessage('Report tests are required')
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const report = await Report.findByPk(req.params.id);
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      const { reportTests, notes, status } = req.body;

      // Update report tests
      if (reportTests) {
        for (const rt of reportTests) {
          await ReportTest.update(
            {
              result: rt.result,
              unit: rt.unit,
              referenceRange: rt.referenceRange
            },
            {
              where: {
                id: rt.id,
                reportId: report.id
              }
            }
          );
        }
      }

      // Update report notes and status
      if (notes !== undefined) {
        report.notes = notes;
      }
      if (status) {
        report.status = status;
      }
      await report.save();

      // Fetch updated report
      const updatedReport = await Report.findByPk(report.id, {
        include: [
          {
            model: ReportTest,
            as: 'reportTests',
            include: [
              {
                model: Test,
                as: 'test'
              }
            ]
          }
        ]
      });

      res.json(updatedReport);
    } catch (error) {
      console.error('Error updating report:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Get all reports
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const reports = await Report.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: ReportTest,
          as: 'reportTests',
          include: [
            {
              model: Test,
              as: 'test'
            }
          ]
        }
      ],
      limit: 100
    });

    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
