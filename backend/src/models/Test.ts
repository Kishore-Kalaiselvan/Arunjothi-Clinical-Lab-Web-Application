import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/connection';

export enum TestCategory {
  HAEMATOLOGY = 'Haematology',
  BIOCHEMISTRY = 'Biochemistry',
  SEROLOGY = 'Serology',
  URINE_ANALYSIS = 'Urine Analysis',
  LIPID_PROFILE = 'Lipid Profile',
  LIVER_FUNCTION = 'Liver Function Test',
  THYROID_FUNCTION = 'Thyroid Function Test',
  KIDNEY_FUNCTION = 'Kidney Function Test',
  CORD_BLOOD = 'Cord Blood',
  SPUTUM = 'Sputum',
  ENDOCRINOLOGY = 'Endocrinology',
  MICROBIOLOGY = 'Microbiology',
  OTHER = 'Other'
}

export interface TestAttributes {
  id: number;
  name: string;
  category: TestCategory;
  price: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TestCreationAttributes extends Optional<TestAttributes, 'id' | 'description' | 'createdAt' | 'updatedAt'> {}

export class Test extends Model<TestAttributes, TestCreationAttributes> implements TestAttributes {
  public id!: number;
  public name!: string;
  public category!: TestCategory;
  public price!: number;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Test.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM(...Object.values(TestCategory)),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'tests',
    timestamps: true
  }
);
