// import api from '../components/api'; // Import your central Axios instance

// /**
//  * Handles the user login API call.
//  * @param {object} credentials - { login, password }
//  * @returns {Promise<object>} The API response data.
//  */
// const login = async (credentials) => {
//     try {
//         // This now correctly uses your central 'api' instance.
//         const response = await api.post('/auth/user/login', credentials);
//         return response.data;
//     } catch (error) {
//         // Let the calling screen handle UI alerts.
//         throw error.response?.data || new Error('Login API request failed');
//     }
// };

// /**
//  * Handles the user registration API call.
//  * @param {object} userData - The user's registration details.
//  * @returns {Promise<object>} The API response data.
//  */
// const register = async (userData) => {
//     try {
//         // This also uses the central 'api' instance.
//         const response = await api.post('/user/registerUser', userData);
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || new Error('Registration API request failed');
//     }
// };

// export const authService = {
//     login,
//     register,
// };







import api from '../components/api'; // Correctly imports your central api.js

/**
 * Handles the user login API call.
 */
const login = async (credentials) => {
    try {
        const response = await api.post('/auth/user/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Login request failed');
    }
};

/**
 * Handles the user registration API call.
 */
const register = async (userData) => {
    try {
        const response = await api.post('/user/registerUser', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Registration request failed');
    }
};

export const authService = {
    login,
    register,
};