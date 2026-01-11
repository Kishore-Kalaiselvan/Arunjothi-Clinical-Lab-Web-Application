import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StaffLayout from '../../components/staff/StaffLayout';
import PatientRegistration from './PatientRegistration';
import ReportView from './ReportView';

const StaffDashboard: React.FC = () => {
  return (
    <StaffLayout>
      <Routes>
        <Route path="/" element={<Navigate to="registration" replace />} />
        <Route path="registration" element={<PatientRegistration />} />
        <Route path="report/:id" element={<ReportView />} />
      </Routes>
    </StaffLayout>
  );
};

export default StaffDashboard;
