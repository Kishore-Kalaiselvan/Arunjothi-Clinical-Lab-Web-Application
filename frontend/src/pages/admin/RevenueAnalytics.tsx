import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './RevenueAnalytics.css';

interface RevenueData {
  daily: { revenue: number; change: number; previous: number };
  weekly: { revenue: number; change: number; previous: number };
  monthly: { revenue: number; change: number; previous: number };
}

interface TrendData {
  date?: string;
  week?: string;
  month?: string;
  revenue: number;
}

const RevenueAnalytics: React.FC = () => {
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenue();
  }, []);

  useEffect(() => {
    fetchTrends();
  }, [period]);

  const fetchRevenue = async () => {
    try {
      const response = await axios.get('/api/admin/revenue');
      setRevenue(response.data);
    } catch (error) {
      console.error('Error fetching revenue:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrends = async () => {
    try {
      const response = await axios.get(`/api/admin/revenue/trends?period=${period}`);
      setTrends(response.data);
    } catch (error) {
      console.error('Error fetching trends:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const getChartData = () => {
    if (period === 'daily') {
      return trends.map((t) => ({ name: t.date?.split('-')[2] || '', revenue: t.revenue }));
    } else if (period === 'weekly') {
      return trends.map((t) => ({ name: t.week || '', revenue: t.revenue }));
    } else {
      return trends.map((t) => ({ name: t.month?.substring(0, 3) || '', revenue: t.revenue }));
    }
  };

  return (
    <div className="revenue-analytics">
      <div className="revenue-cards">
        <div className="revenue-card">
          <div className="card-icon">📅</div>
          <div className="card-content">
            <h3>Daily Revenue</h3>
            <div className="card-amount">₹{revenue?.daily.revenue.toLocaleString() || '0'}</div>
            <div className="card-date">Today ({new Date().toLocaleDateString()})</div>
            <div className={`card-change ${revenue?.daily.change && revenue.daily.change >= 0 ? 'positive' : 'negative'}`}>
              {revenue?.daily.change && revenue.daily.change >= 0 ? '↑' : '↓'} {revenue?.daily.change ? Math.abs(revenue.daily.change).toFixed(1) : '0'}% from yesterday
            </div>
          </div>
        </div>

        <div className="revenue-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Weekly Revenue</h3>
            <div className="card-amount">₹{revenue?.weekly.revenue.toLocaleString() || '0'}</div>
            <div className="card-date">This Week (Week {Math.ceil((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))})</div>
            <div className={`card-change ${revenue?.weekly.change && revenue.weekly.change >= 0 ? 'positive' : 'negative'}`}>
              {revenue?.weekly.change && revenue.weekly.change >= 0 ? '↑' : '↓'} {revenue?.weekly.change ? Math.abs(revenue.weekly.change).toFixed(1) : '0'}% from last week
            </div>
          </div>
        </div>

        <div className="revenue-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Monthly Revenue</h3>
            <div className="card-amount">₹{revenue?.monthly.revenue.toLocaleString() || '0'}</div>
            <div className="card-date">This Month ({new Date().toLocaleString('default', { month: 'long', year: 'numeric' })})</div>
            <div className={`card-change ${revenue?.monthly.change && revenue.monthly.change >= 0 ? 'positive' : 'negative'}`}>
              {revenue?.monthly.change && revenue.monthly.change >= 0 ? '↑' : '↓'} {revenue?.monthly.change ? Math.abs(revenue.monthly.change).toFixed(1) : '0'}% from last month
            </div>
          </div>
        </div>
      </div>

      <div className="revenue-trends">
        <div className="trends-header">
          <div>
            <h2>Revenue Trends</h2>
            <p>View revenue patterns across different time periods</p>
          </div>
        </div>
        <div className="trends-tabs">
          <button
            className={`trend-tab ${period === 'daily' ? 'active' : ''}`}
            onClick={() => setPeriod('daily')}
          >
            Daily
          </button>
          <button
            className={`trend-tab ${period === 'weekly' ? 'active' : ''}`}
            onClick={() => setPeriod('weekly')}
          >
            Weekly
          </button>
          <button
            className={`trend-tab ${period === 'monthly' ? 'active' : ''}`}
            onClick={() => setPeriod('monthly')}
          >
            Monthly
          </button>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#667eea"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Revenue (₹)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
