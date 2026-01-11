import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/connection';
import { User } from './User';

export interface ReportAttributes {
  id: number;
  reportNumber: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
  referredBy: string;
  reportDate: Date;
  totalAmount: number;
  status: 'draft' | 'completed';
  notes?: string;
  createdBy: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReportCreationAttributes extends Optional<ReportAttributes, 'id' | 'status' | 'notes' | 'createdAt' | 'updatedAt'> {}

export class Report extends Model<ReportAttributes, ReportCreationAttributes> implements ReportAttributes {
  public id!: number;
  public reportNumber!: string;
  public patientName!: string;
  public patientAge!: number;
  public patientSex!: string;
  public referredBy!: string;
  public reportDate!: Date;
  public totalAmount!: number;
  public status!: 'draft' | 'completed';
  public notes?: string;
  public createdBy!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Report.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    reportNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    patientName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    patientAge: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    patientSex: {
      type: DataTypes.STRING,
      allowNull: false
    },
    referredBy: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reportDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'completed'),
      allowNull: false,
      defaultValue: 'draft'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'reports',
    timestamps: true
  }
);

// Associations are set up in models/index.ts
