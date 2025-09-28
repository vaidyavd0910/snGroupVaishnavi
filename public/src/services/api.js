import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const donationAPI = {
  createDonation: async (data) => {
    return await api.post('/donations', data);
  },
  
  getDonations: async () => {
    return await api.get('/donations');
  },
  
  getCampaigns: async () => {
    return await api.get('/campaigns');
  },
  
  getDonationStats: async () => {
    return await api.get('/stats');
  }
}; 