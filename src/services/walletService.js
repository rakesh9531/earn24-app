// 1. Import your custom 'api' instance instead of 'axios'
import api from '../components/api'; // Adjust the path to where your api.js is located

/**
 * Get Wallet Balance
 */
const getWalletBalance = async () => {
  try {
    // 2. Use 'api' instead of 'axios'. 
    // You don't need to manually get the token here anymore!
    const response = await api.get('/user/wallet/balance');

    return response.data;
  } catch (error) {
    console.error('Get Wallet Balance Error:', error);
    return { status: false, message: error.message, data: { balance: 0 } };
  }
};

/**
 * Submit Withdrawal Request
 */
const requestWithdrawal = async (amount) => {
  try {
    const response = await api.post('/withdrawals/request', { amount });
    return response.data;
  } catch (error) {
    console.error('Request Withdrawal Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to submit withdrawal request.');
  }
};

/**
 * Get Withdrawal Request History
 */
const getWithdrawalHistory = async () => {
  try {
    const response = await api.get('/withdrawals/my-history');
    return response.data;
  } catch (error) {
    console.error('Get Withdrawal History Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch withdrawal history.');
  }
};

/**
 * Get Wallet Transaction History (Unified Passbook)
 */
const getWalletHistory = async (page = 1, limit = 20) => {
  try {
    const response = await api.get('/user/wallet/history', { params: { page, limit } });
    return response.data;
  } catch (error) {
    console.error('Get Wallet History Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch wallet transaction history.');
  }
};

export const walletService = {
  getWalletBalance,
  requestWithdrawal,
  getWithdrawalHistory,
  getWalletHistory
};