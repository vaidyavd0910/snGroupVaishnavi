import React, { useState } from 'react';
import { FiDollarSign, FiCreditCard, FiUsers, FiFolder, FiTag, FiTarget, FiFileText, FiBarChart2, FiPlus, FiX, FiSave } from 'react-icons/fi';
import axios from 'axios';
import { API_CONFIG, getAuthHeaders } from '../../config/api';
import './AdminDashboardCRM.css';

const AdminDashboardCRM = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const sections = [
    { key: 'dashboard', label: 'Dashboard', icon: <FiBarChart2 /> },
    { key: 'donations', label: 'Donations', icon: <FiDollarSign /> },
    { key: 'expenses', label: 'Expenses', icon: <FiCreditCard /> },
    { key: 'donors', label: 'Donors', icon: <FiUsers /> },
    { key: 'projects', label: 'Projects', icon: <FiFolder /> },
    { key: 'categories', label: 'Categories', icon: <FiTag /> },
    { key: 'campaigns', label: 'Campaigns', icon: <FiTarget /> },
    { key: 'receipts', label: 'Receipts', icon: <FiFileText /> }
  ];

  const handleAddNew = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <CRMDashboard />;
      case 'donations':
        return <DonationsSection onAddNew={() => handleAddNew('donation')} />;
      case 'expenses':
        return <ExpensesSection onAddNew={() => handleAddNew('expense')} />;
      case 'donors':
        return <DonorsSection onAddNew={() => handleAddNew('donor')} />;
      case 'projects':
        return <ProjectsSection onAddNew={() => handleAddNew('project')} />;
      case 'categories':
        return <CategoriesSection onAddNew={() => handleAddNew('category')} />;
      case 'campaigns':
        return <CampaignsSection onAddNew={() => handleAddNew('campaign')} />;
      case 'receipts':
        return <ReceiptsSection onAddNew={() => handleAddNew('receipt')} />;
      default:
        return <CRMDashboard />;
    }
  };

  return (
    <div className="crm-container">
      <div className="crm-header">
        <h2>Donation CRM System</h2>
        <p>Manage donations, expenses, donors, and reports</p>
      </div>
      
      <div className="crm-layout">
        <div className="crm-sidebar">
          <nav className="crm-nav">
            {sections.map(section => (
              <button
                key={section.key}
                className={`crm-nav-item ${activeSection === section.key ? 'active' : ''}`}
                onClick={() => setActiveSection(section.key)}
              >
                {section.icon}
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="crm-content">
          {renderSection()}
        </div>
      </div>

      {/* Modal for adding new items */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New {modalType.charAt(0).toUpperCase() + modalType.slice(1)}</h3>
              <button className="modal-close" onClick={closeModal}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <ModalForm type={modalType} onClose={closeModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Dashboard Component
const CRMDashboard = () => {
  const stats = [
    { title: 'Total Donations', value: '₹1,25,000', change: '+12%', icon: <FiDollarSign />, color: 'green' },
    { title: 'Total Expenses', value: '₹85,000', change: '+8%', icon: <FiCreditCard />, color: 'red' },
    { title: 'Active Donors', value: '156', change: '+5%', icon: <FiUsers />, color: 'blue' },
    { title: 'Active Projects', value: '8', change: '+2%', icon: <FiFolder />, color: 'purple' }
  ];

  return (
    <div className="crm-dashboard">
      <h3>Dashboard Overview</h3>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">
              {stat.icon}
            </div>
            <div className="stat-content">
              <h4>{stat.title}</h4>
              <p className="stat-value">{stat.value}</p>
              <span className="stat-change">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-activities">
        <h4>Recent Activities</h4>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">
              <FiDollarSign />
            </div>
            <div className="activity-content">
              <p>New donation received from John Doe</p>
              <span>₹5,000 - 2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <FiCreditCard />
            </div>
            <div className="activity-content">
              <p>Expense recorded for office supplies</p>
              <span>₹2,500 - 4 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <FiUsers />
            </div>
            <div className="activity-content">
              <p>New donor registered: Sarah Wilson</p>
              <span>1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder Components for other sections
const DonationsSection = ({ onAddNew }) => (
  <div className="crm-section">
    <div className="section-header">
      <h3>Donations Management</h3>
      <button className="crm-btn primary" onClick={onAddNew}>
        <FiPlus /> Add New Donation
      </button>
    </div>
    <div className="empty-state">
      <FiDollarSign className="empty-icon" />
      <h4>Donations Management</h4>
      <p>Manage all donation records, track payments, and generate receipts.</p>
    </div>
  </div>
);

const ExpensesSection = ({ onAddNew }) => (
  <div className="crm-section">
    <div className="section-header">
      <h3>Expenses Management</h3>
      <button className="crm-btn primary" onClick={onAddNew}>
        <FiPlus /> Add New Expense
      </button>
    </div>
    <div className="empty-state">
      <FiCreditCard className="empty-icon" />
      <h4>Expenses Management</h4>
      <p>Track and manage all organizational expenses and payments.</p>
    </div>
  </div>
);

const DonorsSection = ({ onAddNew }) => (
  <div className="crm-section">
    <div className="section-header">
      <h3>Donors Management</h3>
      <button className="crm-btn primary" onClick={onAddNew}>
        <FiPlus /> Add New Donor
      </button>
    </div>
    <div className="empty-state">
      <FiUsers className="empty-icon" />
      <h4>Donors Management</h4>
      <p>Manage donor information, contact details, and donation history.</p>
    </div>
  </div>
);

const ProjectsSection = ({ onAddNew }) => (
  <div className="crm-section">
    <div className="section-header">
      <h3>Projects Management</h3>
      <button className="crm-btn primary" onClick={onAddNew}>
        <FiPlus /> Add New Project
      </button>
    </div>
    <div className="empty-state">
      <FiFolder className="empty-icon" />
      <h4>Projects Management</h4>
      <p>Create and manage fundraising projects and initiatives.</p>
    </div>
  </div>
);

const CategoriesSection = ({ onAddNew }) => (
  <div className="crm-section">
    <div className="section-header">
      <h3>Categories Management</h3>
      <button className="crm-btn primary" onClick={onAddNew}>
        <FiPlus /> Add New Category
      </button>
    </div>
    <div className="empty-state">
      <FiTag className="empty-icon" />
      <h4>Categories Management</h4>
      <p>Organize donations and expenses with custom categories.</p>
    </div>
  </div>
);

const CampaignsSection = ({ onAddNew }) => (
  <div className="crm-section">
    <div className="section-header">
      <h3>Campaigns Management</h3>
      <button className="crm-btn primary" onClick={onAddNew}>
        <FiPlus /> Add New Campaign
      </button>
    </div>
    <div className="empty-state">
      <FiTarget className="empty-icon" />
      <h4>Campaigns Management</h4>
      <p>Create and track fundraising campaigns and their progress.</p>
    </div>
  </div>
);

const ReceiptsSection = ({ onAddNew }) => (
  <div className="crm-section">
    <div className="section-header">
      <h3>Receipts Management</h3>
      <button className="crm-btn primary" onClick={onAddNew}>
        <FiPlus /> Generate Receipt
      </button>
    </div>
    <div className="empty-state">
      <FiFileText className="empty-icon" />
      <h4>Receipts Management</h4>
      <p>Generate, manage, and print donation receipts.</p>
    </div>
  </div>
);

// Modal Form Component
const ModalForm = ({ type, onClose }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const API_BASE = API_CONFIG.BASE_URL;
      
      let endpoint = '';
      let payload = {};
      
      // Prepare API endpoint and payload based on type
      switch (type) {
        case 'donation':
          endpoint = `${API_BASE}/admin/donations`;
          payload = {
            donorId: formData.donorId || null,
            projectId: formData.project || null,
            categoryId: formData.category || null,
            paymentMode: formData.paymentMethod === 'cash' ? 'OFFLINE' : 'ONLINE',
            method: formData.paymentMethod?.toUpperCase() || 'CASH',
            reference: formData.reference || '',
            amount: parseFloat(formData.amount),
            currency: 'INR',
            dateReceived: formData.dateReceived ? new Date(formData.dateReceived) : new Date(),
            remarks: formData.notes || '',
            status: 'SUCCESS'
          };
          break;
          
        case 'expense':
          endpoint = `${API_BASE}/admin/expenses`;
          payload = {
            vendorName: formData.vendorName,
            billNo: formData.billNo || '',
            categoryId: formData.category,
            projectId: formData.project || null,
            paymentMode: formData.paymentMethod === 'cash' ? 'OFFLINE' : 'ONLINE',
            method: formData.paymentMethod?.toUpperCase() || 'CASH',
            reference: formData.reference || '',
            amount: parseFloat(formData.amount),
            currency: 'INR',
            datePaid: formData.datePaid ? new Date(formData.datePaid) : new Date(),
            notes: formData.notes || '',
            status: 'PAID'
          };
          break;
          
        case 'donor':
          endpoint = `${API_BASE}/admin/donors`;
          payload = {
            code: `DONOR${Date.now()}`, // Generate unique code
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone || '',
            address: formData.address || '',
            preferredContact: formData.preferredContact || 'email',
            tags: [],
            notes: ''
          };
          break;
          
        case 'project':
          endpoint = `${API_BASE}/admin/projects`;
          payload = {
            code: `PROJ${Date.now()}`, // Generate unique code
            name: formData.name,
            description: formData.description,
            targetAmount: parseFloat(formData.targetAmount) || 0,
            startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
            endDate: formData.endDate ? new Date(formData.endDate) : null,
            isActive: true
          };
          break;
          
        case 'category':
          endpoint = `${API_BASE}/admin/categories`;
          payload = {
            code: `CAT${Date.now()}`, // Generate unique code
            kind: formData.kind,
            name: formData.name,
            description: formData.description || '',
            isActive: true
          };
          break;
          
        case 'campaign':
          endpoint = `${API_BASE}/admin/campaigns`;
          payload = {
            code: `CAMP${Date.now()}`, // Generate unique code
            name: formData.name,
            projectId: formData.projectId || null,
            channels: formData.channels || [],
            notes: formData.notes || ''
          };
          break;
          
        case 'receipt':
          // For receipts, we need to generate receipt for existing donation
          endpoint = `${API_BASE}/admin/receipts/issue/${formData.donationId}`;
          payload = {
            template: formData.template || 'standard',
            includeQR: formData.includeQR || false
          };
          break;
          
        default:
          throw new Error(`Unknown type: ${type}`);
      }
      
      // Make API call
      const response = await axios.post(endpoint, payload, {
        headers: getAuthHeaders(),
        timeout: API_CONFIG.TIMEOUT
      });
      
      if (response.data.success) {
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`);
        onClose();
        // Refresh the page or update the UI as needed
        window.location.reload();
      } else {
        throw new Error(response.data.message || 'Failed to save');
      }
      
    } catch (error) {
      console.error('Error saving data:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          `Error adding ${type}. Please try again.`;
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    switch (type) {
      case 'donation':
        return (
          <>
            <div className="form-group">
              <label>Donor Name</label>
              <input
                type="text"
                name="donorName"
                value={formData.donorName || ''}
                onChange={handleInputChange}
                placeholder="Enter donor name"
                required
              />
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount || ''}
                onChange={handleInputChange}
                placeholder="Enter amount"
                required
              />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Select payment method</option>
                <option value="cash">Cash</option>
                <option value="online">Online</option>
                <option value="cheque">Cheque</option>
                <option value="upi">UPI</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Select category</option>
                <option value="general">General Donation</option>
                <option value="zakat">Zakat</option>
                <option value="csr">CSR Donation</option>
                <option value="event">Event Donation</option>
              </select>
            </div>
            <div className="form-group">
              <label>Project</label>
              <select
                name="project"
                value={formData.project || ''}
                onChange={handleInputChange}
              >
                <option value="">Select project (optional)</option>
                <option value="education">Education Fund</option>
                <option value="medical">Medical Assistance</option>
                <option value="food">Food Distribution</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date Received</label>
              <input
                type="date"
                name="dateReceived"
                value={formData.dateReceived || new Date().toISOString().split('T')[0]}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Reference Number</label>
              <input
                type="text"
                name="reference"
                value={formData.reference || ''}
                onChange={handleInputChange}
                placeholder="Transaction ID, cheque number, etc."
              />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleInputChange}
                placeholder="Additional notes (optional)"
                rows="3"
              />
            </div>
          </>
        );

      case 'expense':
        return (
          <>
            <div className="form-group">
              <label>Vendor/Bill Name</label>
              <input
                type="text"
                name="vendorName"
                value={formData.vendorName || ''}
                onChange={handleInputChange}
                placeholder="Enter vendor name or bill description"
                required
              />
            </div>
            <div className="form-group">
              <label>Bill Number</label>
              <input
                type="text"
                name="billNo"
                value={formData.billNo || ''}
                onChange={handleInputChange}
                placeholder="Enter bill number (optional)"
              />
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount || ''}
                onChange={handleInputChange}
                placeholder="Enter amount"
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Select category</option>
                <option value="office">Office Supplies</option>
                <option value="utilities">Utilities</option>
                <option value="rent">Rent</option>
                <option value="transport">Transport</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Select payment method</option>
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
                <option value="cheque">Cheque</option>
                <option value="upi">UPI</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date Paid</label>
              <input
                type="date"
                name="datePaid"
                value={formData.datePaid || new Date().toISOString().split('T')[0]}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Reference Number</label>
              <input
                type="text"
                name="reference"
                value={formData.reference || ''}
                onChange={handleInputChange}
                placeholder="Transaction ID, cheque number, etc."
              />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleInputChange}
                placeholder="Additional notes (optional)"
                rows="3"
              />
            </div>
          </>
        );

      case 'donor':
        return (
          <>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                placeholder="Enter address"
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Preferred Contact</label>
              <select
                name="preferredContact"
                value={formData.preferredContact || ''}
                onChange={handleInputChange}
              >
                <option value="">Select preferred contact</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
          </>
        );

      case 'project':
        return (
          <>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                placeholder="Enter project description"
                rows="3"
                required
              />
            </div>
            <div className="form-group">
              <label>Target Amount (₹)</label>
              <input
                type="number"
                name="targetAmount"
                value={formData.targetAmount || ''}
                onChange={handleInputChange}
                placeholder="Enter target amount"
              />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate || ''}
                onChange={handleInputChange}
              />
            </div>
          </>
        );

      case 'category':
        return (
          <>
            <div className="form-group">
              <label>Category Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                placeholder="Enter category name"
                required
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select
                name="kind"
                value={formData.kind || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Select type</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                placeholder="Enter category description"
                rows="3"
              />
            </div>
          </>
        );

      case 'campaign':
        return (
          <>
            <div className="form-group">
              <label>Campaign Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                placeholder="Enter campaign name"
                required
              />
            </div>
            <div className="form-group">
              <label>Project</label>
              <select
                name="projectId"
                value={formData.projectId || ''}
                onChange={handleInputChange}
              >
                <option value="">Select project (optional)</option>
                <option value="education">Education Fund</option>
                <option value="medical">Medical Assistance</option>
                <option value="food">Food Distribution</option>
              </select>
            </div>
            <div className="form-group">
              <label>Channels</label>
              <div className="checkbox-group">
                {['website', 'social', 'event', 'walk-in', 'other'].map(channel => (
                  <label key={channel} className="checkbox-label">
                    <input
                      type="checkbox"
                      name="channels"
                      value={channel}
                      onChange={(e) => {
                        const channels = formData.channels || [];
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            channels: [...channels, channel]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            channels: channels.filter(c => c !== channel)
                          }));
                        }
                      }}
                    />
                    {channel.charAt(0).toUpperCase() + channel.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleInputChange}
                placeholder="Campaign notes (optional)"
                rows="3"
              />
            </div>
          </>
        );

      case 'receipt':
        return (
          <>
            <div className="form-group">
              <label>Donation ID</label>
              <input
                type="text"
                name="donationId"
                value={formData.donationId || ''}
                onChange={handleInputChange}
                placeholder="Enter donation ID to generate receipt"
                required
              />
            </div>
            <div className="form-group">
              <label>Receipt Template</label>
              <select
                name="template"
                value={formData.template || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Select receipt template</option>
                <option value="standard">Standard Receipt</option>
                <option value="detailed">Detailed Receipt</option>
                <option value="tax-exempt">Tax Exempt Receipt</option>
              </select>
            </div>
            <div className="form-group">
              <label>Include QR Code</label>
              <input
                type="checkbox"
                name="includeQR"
                checked={formData.includeQR || false}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  includeQR: e.target.checked
                }))}
              />
            </div>
          </>
        );

      default:
        return <p>Form not implemented for this type.</p>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      {renderFormFields()}
      <div className="form-actions">
        <button type="button" className="crm-btn secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="crm-btn primary" disabled={loading}>
          {loading ? 'Saving...' : `Save ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        </button>
      </div>
    </form>
  );
};

export default AdminDashboardCRM;
