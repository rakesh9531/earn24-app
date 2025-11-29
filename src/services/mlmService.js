import api from '../components/api'; // Import the central, configured Axios instance

// This service is now just a collection of functions that use the 'api' client.
// It has no knowledge of tokens or base URLs, which prevents loops.

const getSummary = async () => {
  try {
    // Note: The URL is now '/mlm/summary' because the base is /api
    const response = await api.get('/user/summary');
    return response.data;
  } catch (error) {
    console.error('API Error in getSummary:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch summary');
  }
};

const getProfitHistory = async (page = 1, limit = 20) => {
  try {
    const response = await api.get('/user/profit-history', { params: { page, limit } });
    return response.data;
  } catch (error) {
    console.error('API Error in getProfitHistory:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch profit history');
  }
};

const getBvHistory = async (page = 1, limit = 20) => {
  try {
    const response = await api.get('/user/bv-history', { params: { page, limit } });
    return response.data;
  } catch (error) {
    console.error('API Error in getBvHistory:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch BV history');
  }
};

const getDownline = async () => {
  try {
    const response = await api.get('/user/downline');
    return response.data;
  } catch (error) {
    console.error('API Error in getDownline:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch downline');
  }
};


// --- ADD THIS NEW FUNCTION ---
const findProductsByPincode = async (pincode, search = '') => {
  try {
    // This will call GET /api/inventory/search?pincode=...&search=...
    const response = await api.get('/inventory/search', { params: { pincode, search } });
    return response.data;
  } catch (error) {
    console.error('API Error in findProductsByPincode:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to search products');
  }
};


// --- ADD THIS NEW FUNCTION ---
const getHomeScreenData = async (pincode) => {
  try {
    // This will call GET /api/home/data?pincode=...
    const response = await api.get('/inventory/data', { params: { pincode } });
    return response.data;
  } catch (error) {
    console.error('API Error in getHomeScreenData:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch home screen data');
  }
};


const getRelatedProducts = async (productId, pincode) => {
  try {
    // The URL is relative, just like the other functions
    // The pincode is passed as a 'params' object
    const response = await api.get(`/inventory/related-products/${productId}`, { params: { pincode } });
    return response.data;
  } catch (error) {
    // Standardized error handling
    console.error('API Error in getRelatedProducts:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch related products');
  }
};

// Fetches the initial level 1 downline for the logged-in user
const getMyInitialNetworkTree = async () => {
  try {
    const response = await api.get('user/mlm/my-network-tree');
    console.log("response-->", response)
    return response.data;
  } catch (error) {
    // Handle error appropriately
    console.log("error-->", error)

    throw error.response?.data || { message: 'Network request failed' };
  }
};

// Fetches the direct children of a specific user ID
const getDownlineForUser = async (userId) => {
  try {
    const response = await api.get(`user/mlm/tree-node/${userId}`);
    console.log("response-2->", response)

    return response.data;
  } catch (error) {
    // Handle error appropriately
    console.log("error 2-->", error)

    throw error.response?.data || { message: 'Network request failed' };
  }
};



// Export all functions in a single object
export const mlmService = {
  getSummary,
  getProfitHistory,
  getBvHistory,
  getDownline,
  getHomeScreenData,
  getRelatedProducts,
  getMyInitialNetworkTree, // Add new function
  getDownlineForUser,  
};