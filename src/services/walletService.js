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



export const walletService = {
  getWalletBalance,
};