// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Your backend server's base URL
// const API_BASE_URL = 'http://192.168.0.171:3000/api'; // Use your actual IP

// const api = axios.create({
//   baseURL: API_BASE_URL,
// });

// // Use an interceptor to add the auth token to every single request
// api.interceptors.request.use(async (config) => {
//   const token = await AsyncStorage.getItem('@user_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// export default api;


// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Your backend server's base URL
// const API_BASE_URL = 'http://192.168.0.171:3000/api'; // Use your actual IP

// const api = axios.create({
//   baseURL: API_BASE_URL,
// });

// // Use an interceptor to add the auth token to every single request
// api.interceptors.request.use(async (config) => {
//   try {
//     // --- THE FIX ---
//     // Use the standard key 'user_token' to match your AuthContext.
//     const token = await AsyncStorage.getItem('user_token'); 

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   } catch (error) {
//     console.error("apiClient: Failed to retrieve token from storage.", error);
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// export default api;








import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Standardized key for the token
const TOKEN_KEY = 'user_token';

// Your backend server's base URL
const API_BASE_URL = 'http://192.168.0.171:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Actively sets the authorization header for the current session.
 * This is called by AuthContext on login/logout to prevent race conditions.
 */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Interceptor to automatically re-hydrate the token from storage
 * when the app restarts.
 */
api.interceptors.request.use(async (config) => {
  // Only check storage if the header isn't already set by setAuthToken
  if (!config.headers.Authorization) {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("api.js: Failed to retrieve token from storage.", error);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;