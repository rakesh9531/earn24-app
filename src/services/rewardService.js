import api from '../components/api';

const getEligibility = async () => {
  try {
    const response = await api.get('/rewards/eligible');
    return response.data;
  } catch (error) {
    console.error('Error in getEligibility:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch rewards eligibility');
  }
};

const claimReward = async (rewardType, userDetails) => {
  try {
    const response = await api.post('/rewards/claim', { rewardType, userDetails });
    return response.data;
  } catch (error) {
    console.error('Error in claimReward:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to submit claim request');
  }
};

const getClaimHistory = async () => {
  try {
    const response = await api.get('/rewards/history');
    return response.data;
  } catch (error) {
    console.error('Error in getClaimHistory:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch claim history');
  }
};

export const rewardService = {
  getEligibility,
  claimReward,
  getClaimHistory
};
