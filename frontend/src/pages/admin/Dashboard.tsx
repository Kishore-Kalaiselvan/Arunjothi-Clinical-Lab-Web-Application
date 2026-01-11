import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Overview from './Overview';
import TestManagement from './TestManagement';
import RevenueAnalytics from './RevenueAnalytics';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="tests" element={<TestManagement />} />
        <Route path="revenue" element={<RevenueAnalytics />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
