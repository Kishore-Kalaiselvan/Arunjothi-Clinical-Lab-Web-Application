import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Test } from '../../types';
import './Overview.css';

const Overview: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [revenue, setRevenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testsRes, revenueRes] = await Promise.all([
        axios.get('/api/admin/tests'),
        axios.get('/api/admin/revenue')
      ]);
      setTests(testsRes.data);
      setRevenue(revenueRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const recentTests = tests.slice(0, 3);
  const totalTests = tests.length;

  return (
    <div className="overview">
      <div className="overview-grid">
        <div className="overview-card test-management">
          <div className="card-header">
            <h2>Test Management</h2>
            <Link to="/admin/tests" className="add-test-button">
              + Add Test
            </Link>
          </div>
          <p className="card-subtitle">Quick overview of laboratory tests</p>
          <div className="test-summary">
            <p>Total Tests: {totalTests}</p>
          </div>
          <div className="test-list">
            {recentTests.map((test) => (
              <div key={test.id} className="test-item">
                <div className="test-info">
                  <div className="test-name">{test.name}</div>
                  <div className="test-category">{test.category}</div>
                </div>
                <div className="test-price">${Number(test.price).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-card revenue-summary">
          <h2>Revenue Summary</h2>
          <p className="card-subtitle">Current period overview</p>
          {revenue && (
            <>
              <div className="revenue-today">
                <div className="revenue-amount">${revenue.daily.revenue.toLocaleString()}</div>
                <div className={`revenue-change ${revenue.daily.change >= 0 ? 'positive' : 'negative'}`}>
                  {revenue.daily.change >= 0 ? '↑' : '↓'} {Math.abs(revenue.daily.change).toFixed(1)}% from yesterday
                </div>
              </div>
              <div className="revenue-periods">
                <div className="period-item">
                  <span>This Week</span>
                  <span className="period-amount">${(revenue.weekly.revenue / 1000).toFixed(1)}k</span>
                </div>
                <div className="period-item">
                  <span>This Month</span>
                  <span className="period-amount">${(revenue.monthly.revenue / 1000).toFixed(1)}k</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
