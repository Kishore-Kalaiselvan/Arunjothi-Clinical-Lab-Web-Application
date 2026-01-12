import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Test } from '../../types';
import './TestManagement.css';

const TestManagement: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: ''
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get('/api/admin/tests');
      setTests(response.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTest = () => {
    setEditingTest(null);
    setFormData({ name: '', category: '', price: '' });
    setShowModal(true);
  };

  const handleEditTest = (test: Test) => {
    setEditingTest(test);
    setFormData({
      name: test.name,
      category: test.category,
      price: test.price.toString()
    });
    setShowModal(true);
  };

  const handleDeleteTest = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this test?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/tests/${id}`);
      fetchTests();
    } catch (error) {
      console.error('Error deleting test:', error);
      alert('Error deleting test');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTest) {
        await axios.put(`/api/admin/tests/${editingTest.id}`, formData);
      } else {
        await axios.post('/api/admin/tests', {
          ...formData,
          price: parseFloat(formData.price)
        });
      }
      setShowModal(false);
      fetchTests();
    } catch (error: any) {
      console.error('Error saving test:', error);
      alert(error.response?.data?.error || 'Error saving test');
    }
  };

  const filteredTests = tests.filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(tests.map((t) => t.category)));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="test-management">
      <div className="test-management-header">
        <div>
          <h2>Laboratory Tests</h2>
          <p>Manage test names and pricing</p>
        </div>
        <button onClick={handleAddTest} className="add-test-btn">
          + Add New Test
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search tests by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="tests-table-container">
        <table className="tests-table">
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Added On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.map((test) => (
              <tr key={test.id}>
                <td>{test.name}</td>
                <td>{test.category}</td>
                <td>₹{Number(test.price).toFixed(2)}</td>
                <td>{test.createdAt ? new Date(test.createdAt).toISOString().split('T')[0] : '-'}</td>
                <td>
                  <button
                    onClick={() => handleEditTest(test)}
                    className="action-btn edit-btn"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteTest(test.id)}
                    className="action-btn delete-btn"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingTest ? 'Edit Test' : 'Add New Test'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Test Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingTest ? 'Update' : 'Add'} Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManagement;
