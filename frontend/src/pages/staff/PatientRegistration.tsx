import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Test } from '../../types';
import './PatientRegistration.css';

const PatientRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTests, setSelectedTests] = useState<number[]>([]);
  const [patientData, setPatientData] = useState({
    patientName: '',
    age: '',
    sex: 'Male',
    referredBy: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get('/api/staff/tests');
      setTests(response.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestToggle = (testId: number) => {
    setSelectedTests((prev) =>
      prev.includes(testId) ? prev.filter((id) => id !== testId) : [...prev, testId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTests.length === 0) {
      alert('Please select at least one test');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post('/api/reports', {
        patientName: patientData.patientName,
        patientAge: parseInt(patientData.age),
        patientSex: patientData.sex,
        referredBy: patientData.referredBy,
        reportDate: patientData.date,
        testIds: selectedTests
      });
      navigate(`/staff/report/${response.data.id}`);
    } catch (error: any) {
      console.error('Error creating report:', error);
      alert(error.response?.data?.error || 'Error creating report');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setPatientData({
      patientName: '',
      age: '',
      sex: 'Male',
      referredBy: '',
      date: new Date().toISOString().split('T')[0]
    });
    setSelectedTests([]);
  };

  const selectedTestsData = tests.filter((t) => selectedTests.includes(t.id));
  const totalAmount = selectedTestsData.reduce((sum, test) => sum + Number(test.price), 0);

  const groupedTests = tests.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = [];
    }
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, Test[]>);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="patient-registration">
      <div className="registration-container">
        <div className="registration-left">
          <h1>New Patient Test Registration</h1>
          <p>Enter patient details and select required tests</p>

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Patient Information</h2>
              <p className="section-subtitle">Enter the patient's basic details</p>

              <div className="form-row">
                <div className="form-group">
                  <label>Patient Name *</label>
                  <input
                    type="text"
                    value={patientData.patientName}
                    onChange={(e) => setPatientData({ ...patientData, patientName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Age *</label>
                  <input
                    type="number"
                    min="0"
                    value={patientData.age}
                    onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sex *</label>
                  <select
                    value={patientData.sex}
                    onChange={(e) => setPatientData({ ...patientData, sex: e.target.value })}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Referred By (Doctor) *</label>
                  <input
                    type="text"
                    value={patientData.referredBy}
                    onChange={(e) => setPatientData({ ...patientData, referredBy: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={patientData.date}
                  onChange={(e) => setPatientData({ ...patientData, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Select Tests</h2>
              <p className="section-subtitle">Choose the required laboratory tests</p>

              <div className="tests-list">
                {Object.entries(groupedTests).map(([category, categoryTests]) => (
                  <div key={category} className="test-category">
                    <h3>{category}</h3>
                    {categoryTests.map((test) => (
                      <label key={test.id} className="test-item">
                        <input
                          type="checkbox"
                          checked={selectedTests.includes(test.id)}
                          onChange={() => handleTestToggle(test.id)}
                        />
                        <span className="test-name">{test.name}</span>
                        <span className="test-price">₹{Number(test.price).toFixed(2)}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        <div className="registration-right">
          <div className="summary-card">
            <h2>Order Summary</h2>
            <div className="selected-tests">
              <p>Selected Tests ({selectedTests.length})</p>
              {selectedTestsData.length > 0 ? (
                <div className="tests-list-summary">
                  {selectedTestsData.map((test) => (
                    <div key={test.id} className="test-summary-item">
                      <span>{test.name}</span>
                      <span>₹{Number(test.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-tests">No tests selected</p>
              )}
            </div>
            <div className="total-amount">
              <span>Total Amount:</span>
              <span className="amount-value">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="summary-card">
            <h2>Patient Details</h2>
            <div className="patient-details">
              <p><strong>Name:</strong> {patientData.patientName || '-'}</p>
              <p><strong>Age:</strong> {patientData.age ? `${patientData.age} years` : '-'}</p>
              <p><strong>Sex:</strong> {patientData.sex}</p>
              <p><strong>Referred by:</strong> {patientData.referredBy ? `Dr. ${patientData.referredBy}` : '-'}</p>
            </div>
          </div>

          <div className="action-buttons">
            <button
              onClick={handleSubmit}
              className="generate-btn"
              disabled={submitting || selectedTests.length === 0}
            >
              📄 Generate Report
            </button>
            <button onClick={handleClear} className="clear-btn">
              Clear Form
            </button>
          </div>

          <div className="info-note">
            <p>Please ensure all patient information is accurate before generating the report.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;
