import api from '../components/api';

/**
 * Service to handle user favorite product API requests.
 */

const getFavorites = async () => {
    try {
        const response = await api.get('/user/favorites');
        return response.data;
    } catch (error) {
        console.error('API Error in getFavorites:', error.response?.data || error.message);
        return { status: false, data: [], message: error.response?.data?.message || 'Failed to fetch favorites.' };
    }
};

const toggleFavorite = async (productId) => {
    try {
        const response = await api.post('/user/favorites/toggle', { productId });
        return response.data;
    } catch (error) {
        console.error(`API Error in toggleFavorite for ${productId}:`, error.response?.data || error.message);
        return { status: false, message: error.response?.data?.message || 'Failed to toggle favorite.' };
    }
};

export const favoriteService = {
    getFavorites,
    toggleFavorite
};
