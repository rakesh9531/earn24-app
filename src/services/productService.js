import api from '../components/api'; // Make sure this path is correct

/**
 * Performs a product search.
 * @param {object} params - Search parameters (query, filters, sortBy).
 */
const search = async (params) => {
    try {
        const response = await api.get('/products/search', { params });
        return response.data;
    } catch (error) {
        console.error('API Error in search:', error.response?.data || error.message);
        return { status: false, data: [], message: error.response?.data?.message || 'Search failed.' };
    }
};

/**
 * Fetches the list of trending search terms.
 */
const getTrendingSearches = async () => {
    try {
        const response = await api.get('/products/trending-searches');
        return response.data;
    } catch (error) {
        console.error('API Error in getTrendingSearches:', error.response?.data || error.message);
        return { status: false, data: [], message: 'Could not fetch trending searches.' };
    }
};

const getSearchSuggestions = async (query) => {
    try {
        const response = await api.get(`/products/suggestions?query=${query}`);
        return response.data; // On success, return the data from the API
    } catch (error) {
        // --- THIS IS THE COMPLETED ERROR HANDLING ---
        // 1. Log the detailed technical error for developers.
        console.error('API Error in getSearchSuggestions:', error.response?.data || error.message);
        
        // 2. Return a predictable error object to prevent the app from crashing.
        return { 
            status: false, 
            data: [], // Return an empty array so the UI doesn't break
            message: error.response?.data?.message || 'Could not fetch suggestions.' 
        };
    }
};



const getProductById = async (productId) => {
    try {
        // This now calls the new, public endpoint
        const response = await api.get(`/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error(`API Error fetching product ${productId}:`, error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch product');
    }
};

const getProductsByCategory = async (categoryId, pincode, page = 1) => {
  try {
    // This will make a GET request to e.g., /api/products/by-category/2?pincode=828207&page=1
    const response = await api.get(`/products/by-category/${categoryId}`, {
      params: { pincode, page }
    });
    return response.data;
  } catch (error) {
    console.error('API Error in getProductsByCategory:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch products');
  }
};



export const productService = {
    search,
    getTrendingSearches,
    getSearchSuggestions,
    getProductById,
    getProductsByCategory
};