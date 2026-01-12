import { Test, TestCategory } from '../models/Test';
import { User, UserRole } from '../models/User';
import bcrypt from 'bcryptjs';

export const seedDatabase = async () => {
  try {
    // Create default users
    const adminExists = await User.findOne({ where: { role: UserRole.ADMIN } });
    if (!adminExists) {
      const adminPassword = await bcrypt.hash('Arunachalam!', 10);
      await User.create({
        username: 'Kalaiselvan',
        email: 'admin@labcare.com',
        password: adminPassword,
        role: UserRole.ADMIN
      });
      console.log('Admin user created');
    }

    const staffExists = await User.findOne({ where: { role: UserRole.STAFF } });
    if (!staffExists) {
      const staffPassword = await bcrypt.hash('staff123', 10);
      await User.create({
        username: 'staff',
        email: 'staff@labcare.com',
        password: staffPassword,
        role: UserRole.STAFF
      });
      console.log('Staff user created');
    }

    // Check if tests already exist
    const testCount = await Test.count();
    if (testCount > 0) {
      console.log('Tests already seeded');
      return;
    }

    // Seed tests based on lab prescription
    const tests = [
      // HAEMATOLOGY
      { name: 'CBC (Complete Blood Cell Count)', category: TestCategory.HAEMATOLOGY, price: 45.00 },
      { name: 'Haemoglobin', category: TestCategory.HAEMATOLOGY, price: 30.00 },
      { name: 'Total Count', category: TestCategory.HAEMATOLOGY, price: 25.00 },
      { name: 'Differential Count', category: TestCategory.HAEMATOLOGY, price: 35.00 },
      { name: 'E.S.R.', category: TestCategory.HAEMATOLOGY, price: 30.00 },
      { name: 'P.C.V.', category: TestCategory.HAEMATOLOGY, price: 25.00 },
      { name: 'RBC Count', category: TestCategory.HAEMATOLOGY, price: 30.00 },
      { name: 'Bleeding Time', category: TestCategory.HAEMATOLOGY, price: 20.00 },
      { name: 'Clotting Time', category: TestCategory.HAEMATOLOGY, price: 20.00 },
      { name: 'Platelet Count', category: TestCategory.HAEMATOLOGY, price: 35.00 },
      { name: 'Absolute Eosinophils Count', category: TestCategory.HAEMATOLOGY, price: 40.00 },
      { name: 'Blood Picture', category: TestCategory.HAEMATOLOGY, price: 50.00 },
      { name: 'Smear For MP', category: TestCategory.HAEMATOLOGY, price: 40.00 },
      { name: 'Smear For MF', category: TestCategory.HAEMATOLOGY, price: 40.00 },

      // BIO-CHEMISTRY
      { name: 'Blood Sugar (F)', category: TestCategory.BIOCHEMISTRY, price: 25.00 },
      { name: 'Blood Sugar (PP)', category: TestCategory.BIOCHEMISTRY, price: 25.00 },
      { name: 'Blood Sugar (R)', category: TestCategory.BIOCHEMISTRY, price: 25.00 },
      { name: 'HBA1c', category: TestCategory.BIOCHEMISTRY, price: 55.00 },
      { name: 'Blood Urea', category: TestCategory.BIOCHEMISTRY, price: 30.00 },
      { name: 'Serum Creatinine', category: TestCategory.BIOCHEMISTRY, price: 35.00 },
      { name: 'Serum Uric Acid', category: TestCategory.BIOCHEMISTRY, price: 40.00 },
      { name: 'Serum Cholesterol', category: TestCategory.BIOCHEMISTRY, price: 40.00 },
      { name: 'C.K. - M.B.', category: TestCategory.BIOCHEMISTRY, price: 80.00 },
      { name: 'Trop - T', category: TestCategory.BIOCHEMISTRY, price: 90.00 },
      { name: 'Calcium', category: TestCategory.BIOCHEMISTRY, price: 35.00 },
      { name: 'Phosphorous', category: TestCategory.BIOCHEMISTRY, price: 35.00 },
      { name: 'Amylase', category: TestCategory.BIOCHEMISTRY, price: 50.00 },

      // SEROLOGY
      { name: 'Blood Grouping', category: TestCategory.SEROLOGY, price: 30.00 },
      { name: 'Rh Typing', category: TestCategory.SEROLOGY, price: 30.00 },
      { name: 'V.D.R.L.', category: TestCategory.SEROLOGY, price: 40.00 },
      { name: 'Dengue Fever', category: TestCategory.SEROLOGY, price: 60.00 },
      { name: 'Widal', category: TestCategory.SEROLOGY, price: 50.00 },
      { name: 'HBs Ag', category: TestCategory.SEROLOGY, price: 50.00 },
      { name: 'H.I.V.', category: TestCategory.SEROLOGY, price: 60.00 },
      { name: 'H.C.V.', category: TestCategory.SEROLOGY, price: 60.00 },
      { name: 'R.A. Factor', category: TestCategory.SEROLOGY, price: 50.00 },
      { name: 'A.S.O. Titre', category: TestCategory.SEROLOGY, price: 45.00 },
      { name: 'C.R.P', category: TestCategory.SEROLOGY, price: 50.00 },
      { name: 'Coombs Test Direct & Indirect', category: TestCategory.SEROLOGY, price: 70.00 },

      // URINE ANALYSIS
      { name: 'Urine Complete', category: TestCategory.URINE_ANALYSIS, price: 35.00 },
      { name: 'Albumin', category: TestCategory.URINE_ANALYSIS, price: 20.00 },
      { name: 'Sugar', category: TestCategory.URINE_ANALYSIS, price: 20.00 },
      { name: 'Bile Salts', category: TestCategory.URINE_ANALYSIS, price: 25.00 },
      { name: 'Bile Pigments', category: TestCategory.URINE_ANALYSIS, price: 25.00 },
      { name: 'Acetone', category: TestCategory.URINE_ANALYSIS, price: 20.00 },
      { name: 'Urine For pregnancy test (Card Method)', category: TestCategory.URINE_ANALYSIS, price: 40.00 },

      // LIPID PROFILE
      { name: 'Serum Total Cholesterol', category: TestCategory.LIPID_PROFILE, price: 40.00 },
      { name: 'Serum HDL - Cholesterol', category: TestCategory.LIPID_PROFILE, price: 45.00 },
      { name: 'Serum Triglycerides', category: TestCategory.LIPID_PROFILE, price: 45.00 },
      { name: 'Serum LDL - Cholesterol', category: TestCategory.LIPID_PROFILE, price: 50.00 },
      { name: 'Lipid Panel', category: TestCategory.LIPID_PROFILE, price: 65.00 },

      // LIVER FUNCTION TEST
      { name: 'Serum Bilirubin', category: TestCategory.LIVER_FUNCTION, price: 40.00 },
      { name: 'Serum Total Protein', category: TestCategory.LIVER_FUNCTION, price: 45.00 },
      { name: 'Serum Albumin', category: TestCategory.LIVER_FUNCTION, price: 45.00 },
      { name: 'S.G.O.T.', category: TestCategory.LIVER_FUNCTION, price: 50.00 },
      { name: 'S.G.P.T.', category: TestCategory.LIVER_FUNCTION, price: 50.00 },
      { name: 'Serum Alkaline phosphatase', category: TestCategory.LIVER_FUNCTION, price: 50.00 },
      { name: 'Liver Function Test (LFT)', category: TestCategory.LIVER_FUNCTION, price: 75.00 },

      // THYROID FUNCTION TEST
      { name: 'Serum Free T3', category: TestCategory.THYROID_FUNCTION, price: 60.00 },
      { name: 'Serum Free T4', category: TestCategory.THYROID_FUNCTION, price: 60.00 },
      { name: 'Serum TSH', category: TestCategory.THYROID_FUNCTION, price: 65.00 },
      { name: 'Serum Prolactin', category: TestCategory.THYROID_FUNCTION, price: 70.00 },
      { name: 'A.N. Screening', category: TestCategory.THYROID_FUNCTION, price: 80.00 },
      { name: 'Thyroid Function Test', category: TestCategory.THYROID_FUNCTION, price: 85.00 },
      { name: 'Vitamin D Test', category: TestCategory.ENDOCRINOLOGY, price: 95.00 },

      // KIDNEY FUNCTION TEST
      { name: 'Kidney Function Test (KFT)', category: TestCategory.KIDNEY_FUNCTION, price: 70.00 },
      { name: 'Serum Potassium', category: TestCategory.KIDNEY_FUNCTION, price: 40.00 },

      // CORD BLOOD
      { name: 'Serum Bilirubin Total', category: TestCategory.CORD_BLOOD, price: 50.00 },
      { name: 'Serum Bilirubin Direct', category: TestCategory.CORD_BLOOD, price: 50.00 },
      { name: 'Serum Bilirubin Indirect', category: TestCategory.CORD_BLOOD, price: 50.00 },
      { name: 'Cord Blood Coombs Test', category: TestCategory.CORD_BLOOD, price: 70.00 },
      { name: 'Cord Blood Group', category: TestCategory.CORD_BLOOD, price: 30.00 },
      { name: 'Cord Blood Rh', category: TestCategory.CORD_BLOOD, price: 30.00 },
      { name: 'Cord Blood Haemoglobin', category: TestCategory.CORD_BLOOD, price: 35.00 },

      // SPUTUM
      { name: 'Sputum For AFB', category: TestCategory.SPUTUM, price: 50.00 },
      { name: 'Mantoux', category: TestCategory.SPUTUM, price: 40.00 },

      // OTHER
      { name: 'Semen Analysis', category: TestCategory.OTHER, price: 80.00 },
      { name: 'Motion Routine Test', category: TestCategory.OTHER, price: 40.00 },
      { name: 'Motion Ova & Cyst', category: TestCategory.OTHER, price: 50.00 },
      { name: 'Motion Occult Blood', category: TestCategory.OTHER, price: 45.00 },
      { name: 'X-Ray', category: TestCategory.OTHER, price: 200.00 },
      { name: 'E.C.G.', category: TestCategory.OTHER, price: 150.00 }
    ];

    await Test.bulkCreate(tests);
    console.log(`Seeded ${tests.length} tests`);
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};
