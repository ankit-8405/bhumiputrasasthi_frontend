import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
import './HelplineAdmin.css';

export default function HelplineAdmin() {
  const { lang } = useLanguage();
  const [helplines, setHelplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'phone',
    title_hi: '',
    title_en: '',
    value: '',
    description_hi: '',
    description_en: '',
    icon: '📞',
    color: '#4CAF50',
    is_active: true,
    order: 1
  });

  useEffect(() => {
    fetchHelplines();
  }, []);

  const fetchHelplines = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/helpline/admin/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bps_token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setHelplines(data.helplines);
      }
    } catch (error) {
      console.error('Error fetching helplines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingId 
        ? `${API_BASE_URL}/api/helpline/${editingId}`
        : `${API_BASE_URL}/api/helpline`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('bps_token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editingId ? 'Helpline updated!' : 'Helpline created!');
        fetchHelplines();
        resetForm();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving helpline:', error);
      alert('Failed to save helpline');
    }
  };

  const handleEdit = (helpline) => {
    setFormData(helpline);
    setEditingId(helpline.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this helpline?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/helpline/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bps_token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Helpline deleted!');
        fetchHelplines();
      }
    } catch (error) {
      console.error('Error deleting helpline:', error);
      alert('Failed to delete helpline');
    }
  };

  const handleToggle = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/helpline/${id}/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bps_token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        fetchHelplines();
      }
    } catch (error) {
      console.error('Error toggling helpline:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'phone',
      title_hi: '',
      title_en: '',
      value: '',
      description_hi: '',
      description_en: '',
      icon: '📞',
      color: '#4CAF50',
      is_active: true,
      order: helplines.length + 1
    });
    setEditingId(null);
    setShowForm(false);
  };

  const typeOptions = [
    { value: 'phone', label: 'Phone Call', icon: '📞', color: '#4CAF50' },
    { value: 'sms', label: 'SMS', icon: '💬', color: '#2196F3' },
    { value: 'email', label: 'Email', icon: '📧', color: '#FF9800' },
    { value: 'whatsapp', label: 'WhatsApp', icon: '💚', color: '#25D366' },
    { value: 'portal', label: 'Web Portal', icon: '🌐', color: '#9C27B0' },
    { value: 'app', label: 'Mobile App', icon: '📱', color: '#E91E63' },
    { value: 'other', label: 'Other', icon: '📌', color: '#607D8B' }
  ];

  return (
    <div className="helpline-admin-page">
      <header className="admin-header">
        <h1>🔧 Helpline Management</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={20} /> Add New Helpline
        </button>
      </header>

      {loading && <p className="loading-text">Loading...</p>}

      {/* Helpline List */}
      <div className="helpline-list">
        {helplines.map((helpline) => (
          <div key={helpline.id} className={`helpline-card ${!helpline.is_active ? 'inactive' : ''}`}>
            <div className="helpline-icon" style={{ background: helpline.color }}>
              {helpline.icon}
            </div>
            <div className="helpline-info">
              <h3>{lang === 'hi' ? helpline.title_hi : helpline.title_en}</h3>
              <p className="helpline-value">{helpline.value}</p>
              <p className="helpline-desc">
                {lang === 'hi' ? helpline.description_hi : helpline.description_en}
              </p>
              <span className="helpline-type">{helpline.type}</span>
            </div>
            <div className="helpline-actions">
              <button 
                className="btn-icon" 
                onClick={() => handleToggle(helpline.id)}
                title={helpline.is_active ? 'Deactivate' : 'Activate'}
              >
                {helpline.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <button 
                className="btn-icon" 
                onClick={() => handleEdit(helpline)}
                title="Edit"
              >
                <Edit2 size={18} />
              </button>
              <button 
                className="btn-icon danger" 
                onClick={() => handleDelete(helpline.id)}
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Edit Helpline' : 'Add New Helpline'}</h2>
              <button className="btn-close" onClick={resetForm}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="helpline-form">
              {/* Type Selection */}
              <div className="form-group">
                <label>Type *</label>
                <select 
                  value={formData.type}
                  onChange={(e) => {
                    const selected = typeOptions.find(t => t.value === e.target.value);
                    setFormData({
                      ...formData,
                      type: e.target.value,
                      icon: selected?.icon || '📞',
                      color: selected?.color || '#4CAF50'
                    });
                  }}
                  required
                >
                  {typeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.icon} {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title Hindi */}
              <div className="form-group">
                <label>Title (Hindi) *</label>
                <input
                  type="text"
                  value={formData.title_hi}
                  onChange={(e) => setFormData({...formData, title_hi: e.target.value})}
                  placeholder="टोल-फ्री कॉल"
                  required
                />
              </div>

              {/* Title English */}
              <div className="form-group">
                <label>Title (English) *</label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                  placeholder="Toll-Free Call"
                  required
                />
              </div>

              {/* Value */}
              <div className="form-group">
                <label>Value (Phone/Email/URL) *</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  placeholder="1800-180-1551 or email@example.com"
                  required
                />
              </div>

              {/* Description Hindi */}
              <div className="form-group">
                <label>Description (Hindi)</label>
                <input
                  type="text"
                  value={formData.description_hi}
                  onChange={(e) => setFormData({...formData, description_hi: e.target.value})}
                  placeholder="24x7 उपलब्ध | निःशुल्क कॉल"
                />
              </div>

              {/* Description English */}
              <div className="form-group">
                <label>Description (English)</label>
                <input
                  type="text"
                  value={formData.description_en}
                  onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                  placeholder="24x7 Available | Free Call"
                />
              </div>

              {/* Icon & Color */}
              <div className="form-row">
                <div className="form-group">
                  <label>Icon</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    placeholder="📞"
                  />
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  />
                </div>
              </div>

              {/* Order & Active */}
              <div className="form-row">
                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    />
                    {' '}Active
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Save size={18} /> {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
