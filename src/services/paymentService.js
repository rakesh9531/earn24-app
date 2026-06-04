import api from '../components/api'; // Ensure this points to your axios instance

export const paymentService = {
  
  // Call the Payment Controller to get Hash/URL
  // Endpoint: /api/payment/create-order
  initiatePayment: async (data) => {
    try {
      const response = await api.post('/payment/create-order', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: false, message: 'Payment Init Failed' };
    }
  },

  // Verify the payment signature/hash
  // Endpoint: /api/payment/verify-payment
  verifyPayment: async (data) => {
    try {
      const response = await api.post('/payment/verify-payment', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: false, message: 'Verification Failed' };
    }
  }
};