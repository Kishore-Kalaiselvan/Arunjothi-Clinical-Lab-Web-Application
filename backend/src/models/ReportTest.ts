import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/connection';
import { Report } from './Report';
import { Test } from './Test';

export interface ReportTestAttributes {
  id: number;
  reportId: number;
  testId: number;
  result?: string;
  unit?: string;
  referenceRange?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReportTestCreationAttributes extends Optional<ReportTestAttributes, 'id' | 'result' | 'unit' | 'referenceRange' | 'createdAt' | 'updatedAt'> {}

export class ReportTest extends Model<ReportTestAttributes, ReportTestCreationAttributes> implements ReportTestAttributes {
  public id!: number;
  public reportId!: number;
  public testId!: number;
  public result?: string;
  public unit?: string;
  public referenceRange?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ReportTest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    reportId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'reports',
        key: 'id'
      }
    },
    testId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tests',
        key: 'id'
      }
    },
    result: {
      type: DataTypes.STRING,
      allowNull: true
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true
    },
    referenceRange: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'report_tests',
    timestamps: true
  }
);

// Associations are set up in models/index.ts
