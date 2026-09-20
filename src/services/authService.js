// import api from '../components/api'; // Correctly imports your central api.js

// /**
//  * Handles the user login API call.
//  */
// const login = async (credentials) => {
//     try {
//         const response = await api.post('/auth/user/login', credentials);
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || new Error('Login request failed');
//     }
// };

// /**
//  * Handles the user registration API call.
//  */
// const register = async (userData) => {
//     try {
//         const response = await api.post('/user/registerUser', userData);
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || new Error('Registration request failed');
//     }
// };

// export const authService = {
//     login,
//     register,
// };




import api from '../components/api'; // Ensure this points to your axios instance

// --- REGISTRATION FLOW ---

/** 
 * Step 1: Send Data -> Backend validates & saves to Temp -> Sends OTP 
 */
const registerInitiate = async (userData) => {
    try {
        const response = await api.post('/user/register/initiate', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Registration initiation failed');
    }
};

/** 
 * Step 2: Verify OTP -> Backend moves data to Users table -> Returns Token 
 */
const registerVerify = async (data) => {
    try {
        // payload: { mobile_number, otp }
        const response = await api.post('/user/register/verify', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('OTP Verification failed');
    }
};

// --- LOGIN FLOW ---

const login = async (credentials) => {
    try {
        const response = await api.post('/user/loginUser', credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Login request failed');
    }
};

// --- FORGOT PASSWORD FLOW ---

const forgotPasswordInitiate = async (data) => {
    try {
        // payload: { mobile_number }
        const response = await api.post('/user/forgot-password/initiate', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Failed to send OTP');
    }
};

const resetPasswordVerify = async (data) => {
    try {
        // payload: { mobile_number, otp, new_password }
        const response = await api.post('/user/forgot-password/verify', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Password reset failed');
    }
};

// --- SHARED ---

const resendOtp = async (data) => {
    try {
        // payload: { mobile_number }
        const response = await api.post('/user/resend-otp', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Resend OTP failed');
    }
};

const sendEmailOtp = async (data) => {
    try {
        const response = await api.post('/user/send-email-otp', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Failed to send Email OTP');
    }
};

const verifyEmailOtp = async (data) => {
    try {
        const response = await api.post('/user/verify-email-otp', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Email OTP Verification failed');
    }
};

export const authService = {
    login,
    registerInitiate,
    registerVerify,
    forgotPasswordInitiate,
    resetPasswordVerify,
    resendOtp,
    sendEmailOtp,
    verifyEmailOtp
};