import api from '../components/api'; // Make sure this path is correct

/**
 * Performs a product search.
 * @param {object} params - Search parameters (query, filters, sortBy).
 */
const search = async (params) => {
    try {
        const cleanParams = {};
        if (params) {
            Object.keys(params).forEach((key) => {
                const val = params[key];
                if (val !== undefined && val !== null && val !== 'undefined' && val !== 'null' && val !== '') {
                    cleanParams[key] = val;
                }
            });
        }
        console.log('[productService.search] Sending params to API:', cleanParams);
        const response = await api.get('/products/search', { params: cleanParams });
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



const getProductById = async (productId, isSellerProduct = false) => {
    try {
        // This now calls the new, public endpoint
        const response = await api.get(`/products/${productId}`, {
            params: isSellerProduct ? { is_seller_product: 1 } : {}
        });
        return response.data;
    } catch (error) {
        console.error(`API Error fetching product ${productId}:`, error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch product');
    }
};

const getProductsByCategory = async (categoryId, pincode, page = 1) => {
  try {
    const response = await api.get(`/products/by-category/${categoryId}`, {
      params: { pincode, page }
    });
    return response.data;
  } catch (error) {
    console.error('API Error in getProductsByCategory:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch products');
  }
};

const getProductsBySubcategory = async (subcategoryId, pincode, page = 1) => {
  try {
    // This will make a GET request to e.g., /api/products/by-subcategory/2?pincode=828207&page=1
    const response = await api.get(`/products/by-subcategory/${subcategoryId}`, {
      params: { pincode, page }
    });
    return response.data;
  } catch (error) {
    console.error('API Error in getProductsBySubcategory:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch subcategory products');
  }
};



const checkPincode = async (pincode) => {
    try {
        const response = await api.get(`/products/check-pincode/${pincode}`);
        return response.data;
    } catch (error) {
        return { status: false, message: error.response?.data?.message || 'Invalid pincode format.' };
    }
};

export const productService = {
    search,
    getTrendingSearches,
    getSearchSuggestions,
    getProductById,
    getProductsByCategory,
    getProductsBySubcategory,
    checkPincode
};