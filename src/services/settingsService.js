import api from '../components/api'; // Import your central Axios instance

const getAllSettings = async () => {
    try {
        // This calls GET /api/settings/all
        const response = await api.get('/settings/all');

        console.log("responseresponseresponse==>",response)
        return response.data;
    } catch (error) {
        console.error('API Error in getAllSettings:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch settings');
    }
};



const getDeliveryRules = async () => {
    try {
        const response = await api.get('/settings/delivery-rules');
        console.log("API Response from getDeliveryRules:", response.data);
        return response.data;
    } catch (error) {
        console.error('API Error in getDeliveryRules:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch delivery rules');
    }
};




export const settingsService = {
    getAllSettings,
    getDeliveryRules,
};