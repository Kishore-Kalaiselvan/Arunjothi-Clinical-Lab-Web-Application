// Import all models first
import { User } from './User';
import { Test } from './Test';
import { Report } from './Report';
import { ReportTest } from './ReportTest';

// Set up associations after all models are imported
export function setupAssociations() {
  Report.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
  Report.hasMany(ReportTest, { foreignKey: 'reportId', as: 'reportTests' });
  ReportTest.belongsTo(Report, { foreignKey: 'reportId' });
  ReportTest.belongsTo(Test, { foreignKey: 'testId', as: 'test' });
}

// Initialize associations
setupAssociations();

export { User, Test, Report, ReportTest };
