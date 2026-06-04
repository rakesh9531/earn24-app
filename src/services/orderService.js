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

// Fetches a list of the logged-in user's past orders
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

const updatePaymentMethod = async (orderId, paymentMethod) => {
    try {
        const response = await api.patch(`/orders/${orderId}/payment-method`, { paymentMethod });
        return response.data;
    } catch (error) {
        console.error('API Error in updatePaymentMethod:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to update payment method');
    }
};

const getInvoiceUrl = (orderId, token) => {
    // Construct the full URL for the invoice download
    // Using the same base URL as your API instance
    const baseUrl = 'https://newapi.earn24.in/api/orders';
    return `${baseUrl}/${orderId}/invoice?token=${token}`;
};

export const orderService = {
    createOrder,
    getOrderHistory,
    getOrderDetails,
    updatePaymentMethod,
    getInvoiceUrl,
};