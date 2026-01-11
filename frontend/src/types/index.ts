export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'staff';
}

export interface Test {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Report {
  id: number;
  reportNumber: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
  referredBy: string;
  reportDate: string;
  totalAmount: number;
  status: 'draft' | 'completed';
  notes?: string;
  createdBy: number;
  reportTests?: ReportTest[];
}

export interface ReportTest {
  id: number;
  reportId: number;
  testId: number;
  result?: string;
  unit?: string;
  referenceRange?: string;
  test?: Test;
}

export interface RevenueData {
  daily: {
    revenue: number;
    change: number;
    previous: number;
  };
  weekly: {
    revenue: number;
    change: number;
    previous: number;
  };
  monthly: {
    revenue: number;
    change: number;
    previous: number;
  };
}
