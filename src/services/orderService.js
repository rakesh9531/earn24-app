import api from '../components/api'; // Import your central Axios instance

const createOrder = async (orderData) => {
    try {
        // This calls POST /api/orders/create
        const response = await api.post('/orders/create', orderData);
        return response.data;
    } catch (error) {
        console.error('API Error in createOrder:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to create order');
    }
};

// You can add functions to get order history here later
const getOrderHistory = async (page = 1) => {
    const response = await api.get('/orders', { params: { page } });
    return response.data;
};


const getOrderDetails = async (orderId) => {
    try {
        // This calls GET /api/orders/:orderId
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('API Error in getOrderDetails:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch order details');
    }
};




export const orderService = {
    createOrder,
    getOrderHistory,
    getOrderDetails,
};