import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './StaffLayout.css';

interface StaffLayoutProps {
  children: React.ReactNode;
}

const StaffLayout: React.FC<StaffLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="staff-layout">
      <header className="staff-header">
        <div className="header-left">
          <div className="logo">Arunjothi Clinical Lab - Staff</div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-name">{user?.username || 'Staff User'}</div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            → Logout
          </button>
        </div>
      </header>
      <main className="staff-main">{children}</main>
    </div>
  );
};

export default StaffLayout;
