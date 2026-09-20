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
const getOrderHistory = async (page = 1, limit = 20) => {
    const response = await api.get('/orders', { params: { page, limit } });
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

const cancelOrder = async (orderId, reason, refundType = 'WALLET') => {
    try {
        const response = await api.post(`/orders/${orderId}/cancel`, { 
            cancellation_reason: reason, 
            refund_type: refundType 
        });
        return response.data;
    } catch (error) {
        console.error('API Error in cancelOrder:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to cancel order');
    }
};

const requestReturn = async (orderId, reason, type = 'RETURN', orderItemId = null, refundMethod = 'WALLET', customerUpiId = null, evidenceImages = null, quantity = 1) => {
    try {
        const payload = { 
            reason, 
            type, 
            orderItemId,
            refund_method: refundMethod,
            customer_upi_id: customerUpiId,
            evidence_images: evidenceImages,
            quantity: quantity || 1
        };
        const response = await api.post(`/orders/${orderId}/request-return`, payload);
        return response.data;
    } catch (error) {
        console.error('API Error in requestReturn:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to request return/replacement');
    }
};

const cancelOrderItem = async (orderId, itemId, reason) => {
    try {
        const response = await api.post(`/orders/${orderId}/items/${itemId}/cancel`, { reason });
        return response.data;
    } catch (error) {
        console.error('API Error in cancelOrderItem:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to cancel item');
    }
};

const initiatePayUPayment = async (paymentData) => {
    try {
        const response = await api.post('/orders/payu/initiate', paymentData);
        return response.data;
    } catch (error) {
        console.error('API Error in initiatePayUPayment:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to initiate PayU payment');
    }
};

const verifyPayUPayment = async (verifyData) => {
    try {
        const response = await api.post('/orders/payu/verify', verifyData);
        return response.data;
    } catch (error) {
        console.error('API Error in verifyPayUPayment:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to verify PayU payment');
    }
};

const getPreviouslyPurchasedItems = async (page = 1, limit = 20) => {
    try {
        const response = await api.get('/orders/previously-purchased-items', { params: { page, limit } });
        return response.data;
    } catch (error) {
        console.error('API Error in getPreviouslyPurchasedItems:', error.response?.data || error.message);
        return { status: false, data: [], message: error.response?.data?.message || 'Failed to fetch purchased items.' };
    }
};

export const orderService = {
    createOrder,
    getOrderHistory,
    getOrderDetails,
    updatePaymentMethod,
    getInvoiceUrl,
    cancelOrder,
    cancelOrderItem,
    requestReturn,
    initiatePayUPayment,
    verifyPayUPayment,
    getPreviouslyPurchasedItems,
};