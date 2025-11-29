import api from '../components/api'; // Import the central, configured Axios instance

const getCart = async (pincode) => {
    const response = await api.get(`/cart?pincode=${pincode}`);
    return response.data;
};

const addItem = async ({ sellerProductId, quantity }) => {
    const response = await api.post('/cart/add', { sellerProductId, quantity });
    return response.data;
};

const updateItem = async (cartItemId, quantity) => {
    const response = await api.put(`/cart/update/${cartItemId}`, { quantity });
    return response.data;
};

const removeItem = async (cartItemId) => {
    const response = await api.delete(`/cart/remove/${cartItemId}`);
    return response.data;
};

const clearCart = async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
};


const validateForCheckout = async (pincode, items) => {
    try {
        const payload = { pincode, items };
        const response = await api.post('/cart/validate-for-checkout', payload);
        return response.data;
    } catch (error) {
        console.error('API Error in validateForCheckout:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to validate cart for checkout');
    }
};



export const cartService = {
    getCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    validateForCheckout,
};