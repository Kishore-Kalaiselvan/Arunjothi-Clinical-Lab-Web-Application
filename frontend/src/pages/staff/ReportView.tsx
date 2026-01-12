import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Report, ReportTest } from '../../types';
import './ReportView.css';

const ReportView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [reportTests, setReportTests] = useState<ReportTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchReport();
    }
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await axios.get(`/api/reports/${id}`);
      setReport(response.data);
      setReportTests(response.data.reportTests || []);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestUpdate = (reportTestId: number, field: string, value: string) => {
    setReportTests((prev) =>
      prev.map((rt) =>
        rt.id === reportTestId ? { ...rt, [field]: value } : rt
      )
    );
  };

  const handleSave = async () => {
    // Validate all results are entered
    const allResultsEntered = reportTests.every((rt) => rt.result && rt.result.trim() !== '');
    if (!allResultsEntered) {
      alert('Please enter all test results before saving');
      return;
    }

    setSaving(true);
    try {
      await axios.put(`/api/reports/${id}`, {
        reportTests: reportTests.map((rt) => ({
          id: rt.id,
          result: rt.result,
          unit: rt.unit,
          referenceRange: rt.referenceRange
        })),
        status: 'completed'
      });
      alert('Report saved successfully!');
      fetchReport();
    } catch (error: any) {
      console.error('Error saving report:', error);
      alert(error.response?.data?.error || 'Error saving report');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    // Validate all results are entered
    const allResultsEntered = reportTests.every((rt) => rt.result && rt.result.trim() !== '');
    if (!allResultsEntered) {
      alert('Please enter all test results before printing');
      return;
    }

    // Save first
    handleSave().then(() => {
      window.print();
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!report) {
    return <div>Report not found</div>;
  }

  return (
    <div className="report-view">
      <div className="report-actions print-hide">
        <button onClick={() => navigate('/staff/registration')} className="back-btn">
          ← Back to Registration
        </button>
        <button onClick={handlePrint} className="print-btn">
          🖨️ Print Report
        </button>
      </div>

      <div className="report-container">
        <div className="report-header print-hide">
          <h1>Arunjothi Clinical Laboratory</h1>
          <div className="header-divider"></div>
        </div>

        <div className="report-info-grid">
          <div className="info-section print-hide">
            <h2>Patient Information</h2>
            <div className="info-item">
              <strong>Name:</strong> {report.patientName}
            </div>
            <div className="info-item">
              <strong>Age:</strong> {report.patientAge} years
            </div>
            <div className="info-item">
              <strong>Sex:</strong> {report.patientSex}
            </div>
            <div className="info-item">
              <strong>Referred By:</strong> Dr. {report.referredBy}
            </div>
          </div>

          <div className="info-section print-hide">
            <h2>Report Details</h2>
            <div className="info-item">
              <strong>Date:</strong> {new Date(report.reportDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Print-only patient info - matches scanned report format */}
        <div className="print-patient-info">
          <div className="print-patient-grid">
            <div className="print-info-item">
              <strong>Pt's Name :</strong> {report.patientName}
            </div>
            <div className="print-info-item">
              <strong>Ref by Dr :</strong> {report.referredBy}
            </div>
            <div className="print-info-item">
              <strong>Sex :</strong> {report.patientSex === 'Male' ? 'M' : report.patientSex === 'Female' ? 'F' : report.patientSex} / {report.patientAge} yrs
            </div>
            <div className="print-info-item">
              <strong>Date :</strong> {new Date(report.reportDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
              }).replace(/\//g, '.')}
            </div>
          </div>
        </div>

        <div className="test-results-section">
          <h2 className="print-hide">Laboratory Test Results</h2>
          <table className="results-table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Result</th>
                <th>Unit</th>
                <th>Reference Range</th>
              </tr>
            </thead>
            <tbody>
              {reportTests.map((rt) => (
                <tr key={rt.id}>
                  <td>
                    <div className="test-name-cell">
                      <strong>{rt.test?.name}</strong>
                      <span className="test-category">{rt.test?.category}</span>
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={rt.result || ''}
                      onChange={(e) => handleTestUpdate(rt.id, 'result', e.target.value)}
                      placeholder="Enter value"
                      className="result-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={rt.unit || ''}
                      onChange={(e) => handleTestUpdate(rt.id, 'unit', e.target.value)}
                      placeholder="Unit"
                      className="unit-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={rt.referenceRange || ''}
                      onChange={(e) => handleTestUpdate(rt.id, 'referenceRange', e.target.value)}
                      placeholder="Reference range"
                      className="range-input"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="signatures-section print-hide">
          <div className="signature-box signature-right">
            <div className="signature-line"></div>
            <p>Lab Technician</p>
          </div>
        </div>

        <div className="report-footer print-hide">
          <p>This report is electronically generated and is valid without signature.</p>
          <p>For any queries, please contact us at info@labcare.com or call (555) 123-4567</p>
        </div>
      </div>

      <div className="report-actions-bottom">
        <button onClick={handleSave} className="save-btn" disabled={saving}>
          {saving ? 'Saving...' : 'Save Report'}
        </button>
      </div>
    </div>
  );
};

export default ReportView;
