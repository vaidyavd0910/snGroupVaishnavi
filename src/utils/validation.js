export const validateDonationAmount = (amount) => {
  if (!amount || amount <= 0) {
    throw new Error('Invalid donation amount');
  }
  return true;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const generateReceiptPDF = async (donationData) => {
  // Implementation for generating PDF receipt
}; 