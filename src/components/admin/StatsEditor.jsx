import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const StatsEditor = () => {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState([
    { icon: '', value: '', label: '' },
    { icon: '', value: '', label: '' },
    { icon: '', value: '', label: '' }
  ]);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const response = await api.get('/content/stats');
        if (response.data.success) {
          setStatsData(response.data.data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats data:', error);
        setLoading(false);
      }
    };

    fetchStatsData();
  }, []);

  const handleChange = (index, field, value) => {
    const updatedStats = [...statsData];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: value
    };
    setStatsData(updatedStats);
  };

  const handleAddStat = () => {
    setStatsData([...statsData, { icon: '', value: '', label: '' }]);
  };

  const handleRemoveStat = (index) => {
    const updatedStats = statsData.filter((_, i) => i !== index);
    setStatsData(updatedStats);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.put('/content/stats', { data: statsData });
      if (response.data.success) {
        toast.success('Statistics updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update statistics');
      console.error('Error updating stats data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="editor-container">
      <h2>Edit Statistics</h2>
      <form onSubmit={handleSubmit}>
        {statsData.map((stat, index) => (
          <div key={index} className="stat-item-editor">
            <h3>Statistic #{index + 1}</h3>
            
            <div className="form-group">
              <label htmlFor={`value-${index}`}>Value</label>
              <input
                type="text"
                id={`value-${index}`}
                value={stat.value}
                onChange={(e) => handleChange(index, 'value', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={`label-${index}`}>Label</label>
              <input
                type="text"
                id={`label-${index}`}
                value={stat.label}
                onChange={(e) => handleChange(index, 'label', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={`icon-${index}`}>Icon SVG Path</label>
              <textarea
                id={`icon-${index}`}
                value={stat.icon}
                onChange={(e) => handleChange(index, 'icon', e.target.value)}
                rows={3}
              />
            </div>
            
            <button 
              type="button" 
              className="btn btn-danger" 
              onClick={() => handleRemoveStat(index)}
            >
              Remove Statistic
            </button>
          </div>
        ))}
        
        <div className="button-group">
          <button type="button" className="btn btn-secondary" onClick={handleAddStat}>
            Add New Statistic
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Statistics'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StatsEditor; 