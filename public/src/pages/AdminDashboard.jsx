import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroEditor from '../components/admin/HeroEditor';
import StatsEditor from '../components/admin/StatsEditor';
import TestimonialsEditor from '../components/admin/TestimonialsEditor';
import VolunteersTable from '../components/admin/VolunteersTable';
import ProgramsEditor from '../components/admin/ProgramsEditor';
import EventsEditor from '../components/admin/EventsEditor';
import GalleryEditor from '../components/admin/GalleryEditor';
import BlogEditor from '../components/admin/BlogEditor';
import DonationEditor from '../components/admin/DonationEditor';
import CarouselEditor from '../components/admin/CarouselEditor';
import EmergencyContactManagement from '../components/admin/EmergencyContactManagement';
import AryaMitraEnquiryManagement from '../components/admin/AryaMitraEnquiryManagement';
import ImpactStoriesEditor from '../components/admin/ImpactStoriesEditor';
import ImportantUpdates from '../components/ImportantUpdates';
import api from '../utils/api';
import '../styles/AdminDashboard.css';
import { FaTachometerAlt, FaChartBar, FaUsers, FaRegImages, FaRegCalendarAlt, FaRegNewspaper, FaRegComments, FaDonate, FaMoneyCheckAlt, FaUserFriends, FaImages, FaExclamationTriangle, FaRegBell, FaSearch, FaHeartbeat } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import './Admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');

  // Sidebar menu items with icons
  const sidebarItems = [
    { key: 'stats', label: 'Statistics', icon: <FaChartBar /> },
    { key: 'impact-stories', label: 'Impact Stories', icon: <FaHeartbeat /> },
    { key: 'testimonials', label: 'Testimonials', icon: <FaRegComments /> },
    { key: 'VolunteersTable', label: 'VolunteersTable', icon: <FaUsers /> },
    { key: 'programs', label: 'Programs', icon: <FaTachometerAlt /> },
    { key: 'events', label: 'Events', icon: <FaRegCalendarAlt /> },
    { key: 'gallery', label: 'Gallery', icon: <FaRegImages /> },
    { key: 'emergency', label: 'SN Arya Mitra Management', icon: <FaExclamationTriangle /> },
    { key: 'enquiries', label: 'Arya Mitra Enquiries', icon: <FaSearch /> },
    { key: 'carousel', label: 'Carousel', icon: <FaImages /> },
    { key: 'blog', label: 'Blog Posts', icon: <FaRegNewspaper /> },
    { key: 'donations', label: 'Donation Cards', icon: <FaDonate /> },
    { key: 'payments', label: 'Payments', icon: <FaMoneyCheckAlt /> },
    { key: 'users', label: 'Users', icon: <FaUserFriends /> },
    { key: 'updates', label: 'Important Updates', icon: <FaRegBell /> }
  ];

  useEffect(() => {
    if (activeTab === 'payments') {
      setPaymentsLoading(true);
      setPaymentsError('');
      api.get('/payments/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => setPayments(res.data.payments || []))
        .catch(() => setPaymentsError('Failed to load payment details'))
        .finally(() => setPaymentsLoading(false));
    }
    if (activeTab === 'users') {
      setUsersLoading(true);
      setUsersError('');
      api.get('/users/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => setUsers(res.data || []))
        .catch(() => setUsersError('Failed to load users'))
        .finally(() => setUsersLoading(false));
    }
  }, [activeTab]);

  // Filtered payments for date range
  const filteredPayments = payments.filter(p => {
    if (!dateRange.from && !dateRange.to) return true;
    const date = new Date(p.createdAt);
    if (dateRange.from && date < new Date(dateRange.from)) return false;
    if (dateRange.to && date > new Date(dateRange.to)) return false;
    return true;
  });

  // Chart data: Amount per campaign
  const campaignTotals = {};
  filteredPayments.forEach(p => {
    const campaign = p.donation?.title || 'Unknown';
    if (!campaignTotals[campaign]) campaignTotals[campaign] = 0;
    campaignTotals[campaign] += p.amount;
  });
  const campaignChartData = Object.entries(campaignTotals).map(([name, amount]) => ({ name, amount }));

  // Chart data: Amount per day
  const dayTotals = {};
  filteredPayments.forEach(p => {
    const day = new Date(p.createdAt).toLocaleDateString();
    if (!dayTotals[day]) dayTotals[day] = 0;
    dayTotals[day] += p.amount;
  });
  const dayChartData = Object.entries(dayTotals).map(([date, amount]) => ({ date, amount })).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <h2>Admin Dashboard</h2>
        <ul className="admin-nav">
          {sidebarItems.map(item => (
            <li
              key={item.key}
              className={activeTab === item.key ? 'active' : ''}
              onClick={() => setActiveTab(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="admin-content">
        {activeTab === 'hero' && <HeroEditor />}
        {activeTab === 'stats' && <StatsEditor />}
        {activeTab === 'impact-stories' && <ImpactStoriesEditor />}
        {activeTab === 'testimonials' && <TestimonialsEditor />}
        {activeTab === 'VolunteersTable' && <VolunteersTable />}
        {activeTab === 'programs' && <ProgramsEditor />}
        {activeTab === 'events' && <EventsEditor />}
        {activeTab === 'gallery' && <GalleryEditor />}
        {activeTab === 'emergency' && <EmergencyContactManagement />}
        {activeTab === 'enquiries' && <AryaMitraEnquiryManagement />}
        {activeTab === 'carousel' && <CarouselEditor />}
        {activeTab === 'blog' && <BlogEditor />}
        {activeTab === 'donations' && <DonationEditor />}
        {activeTab === 'payments' && (
          <div className="admin-payments-section">
            <h3 className="admin-section-title">All Donation Payments</h3>
            {/* Date filter */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <label style={{ fontWeight: 500 }}>From:
                <input type="date" value={dateRange.from} onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))} style={{ marginLeft: 8, padding: '0.3rem 0.6rem', borderRadius: 6, border: '1px solid #e5e7eb' }} />
              </label>
              <label style={{ fontWeight: 500 }}>To:
                <input type="date" value={dateRange.to} onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))} style={{ marginLeft: 8, padding: '0.3rem 0.6rem', borderRadius: 6, border: '1px solid #e5e7eb' }} />
              </label>
              <button onClick={() => setDateRange({ from: '', to: '' })} style={{ marginLeft: 12, background: '#f3f4f8', border: 'none', borderRadius: 6, padding: '0.3rem 1rem', cursor: 'pointer', color: '#3b82f6', fontWeight: 600 }}>Clear</button>
            </div>
            {/* Charts */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2.5rem' }}>
              <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #e5e7eb44', padding: '1.5rem' }}>
                <h4 style={{ marginBottom: 16, fontWeight: 600, color: '#222' }}>Amount Collected per Campaign</h4>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={campaignChartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                    <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={60} />
                    <YAxis />
                    <Tooltip formatter={v => `₹${v}`} />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[8,8,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #e5e7eb44', padding: '1.5rem' }}>
                <h4 style={{ marginBottom: 16, fontWeight: 600, color: '#222' }}>Amount Collected per Day</h4>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={dayChartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" angle={-20} textAnchor="end" interval={0} height={60} />
                    <YAxis />
                    <Tooltip formatter={v => `₹${v}`} />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            {paymentsLoading ? (
              <div className="admin-loader">Loading payments...</div>
            ) : paymentsError ? (
              <div className="admin-error">{paymentsError}</div>
            ) : payments.length === 0 ? (
              <div className="admin-no-data">No payments found.</div>
            ) : (
              <div className="admin-payments-table-wrapper">
                <table className="admin-payments-table">
                  <thead>
                    <tr>
                      <th>Donor Name</th>
                      <th>Email</th>
                      <th>Campaign</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p._id}>
                        <td>{p.user?.name || '-'}</td>
                        <td>{p.user?.email || '-'}</td>
                        <td>{p.donation?.title || '-'}</td>
                        <td>₹{p.amount}</td>
                        <td className={`status ${p.status}`}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</td>
                        <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {activeTab === 'users' && (
          <div className="admin-users-section">
            <h3 className="admin-section-title">All Users</h3>
            {usersLoading ? (
              <div className="admin-loader">Loading users...</div>
            ) : usersError ? (
              <div className="admin-error">{usersError}</div>
            ) : users.length === 0 ? (
              <div className="admin-no-data">No users found.</div>
            ) : (
              <div className="admin-users-table-wrapper">
                <table className="admin-users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name || '-'}</td>
                        <td>{u.email || '-'}</td>
                        <td>{u.role || '-'}</td>
                        <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {activeTab === 'updates' && <ImportantUpdates />}
      </div>
    </div>
  );
};

export default AdminDashboard; 