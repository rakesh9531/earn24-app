// import React, { createContext, useState, useEffect, useContext } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [token, setToken] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const loadUserFromStorage = async () => {
//             try {
//                 const storedToken = await AsyncStorage.getItem('@user_token');
//                 const storedUser = await AsyncStorage.getItem('@user_details');

//                 if (storedToken && storedUser) {
//                     setToken(storedToken);
//                     setUser(JSON.parse(storedUser));
//                     axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
//                 }
//             } catch (e) {
//                 console.error("Failed to load user from storage", e);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         loadUserFromStorage();
//     }, []);

//     const login = async (userData, userToken) => {
//         setIsLoading(true);
//         setUser(userData);
//         setToken(userToken);
//         axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
//         try {
//             await AsyncStorage.setItem('@user_token', userToken);
//             await AsyncStorage.setItem('@user_details', JSON.stringify(userData));
//         } catch (e) {
//             console.error("Failed to save user to storage", e);
//         }
//         setIsLoading(false);
//     };

//     const logout = async () => {
//         setIsLoading(true);
//         setUser(null);
//         setToken(null);
//         delete axios.defaults.headers.common['Authorization'];
//         try {
//             await AsyncStorage.removeItem('@user_token');
//             await AsyncStorage.removeItem('@user_details');
//         } catch (e) {
//             console.error("Failed to clear user from storage", e);
//         }
//         setIsLoading(false);
//     };

//     return (
//         <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     return useContext(AuthContext);
// };








// import React, { createContext, useState, useEffect, useContext } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // --- STANDARDIZED KEYS ---
// const TOKEN_KEY = 'user_token';
// const USER_KEY = 'user_data';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const loadUserFromStorage = async () => {
//             try {
//                 const storedUser = await AsyncStorage.getItem(USER_KEY);
//                 if (storedUser) {
//                     setUser(JSON.parse(storedUser));
//                 }
//             } catch (e) {
//                 console.error("AuthContext: Failed to load user data.", e);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         loadUserFromStorage();
//     }, []);

//     // --- THE FIX: Make this an async function and await storage operations ---
//     const login = async (userData, userToken) => {
//         try {
//             // Await both promises to ensure they complete before the function returns.
//             // Promise.all is efficient as it runs them in parallel.
//             await Promise.all([
//                 AsyncStorage.setItem(TOKEN_KEY, userToken),
//                 AsyncStorage.setItem(USER_KEY, JSON.stringify(userData))
//             ]);
//             // Only update the state AFTER storage is successful.
//             setUser(userData);
//         } catch (e) {
//             console.error("AuthContext: Failed to save auth data.", e);
//         }
//     };

//     // --- THE FIX: Make this async and await as well for consistency ---
//     const logout = async () => {
//         try {
//             await Promise.all([
//                 AsyncStorage.removeItem(TOKEN_KEY),
//                 AsyncStorage.removeItem(USER_KEY)
//             ]);
//             setUser(null);
//         } catch (e) {
//             console.error("AuthContext: Failed to clear auth data.", e);
//         }
//     };

//     return (
//         <AuthContext.Provider value={{ user, isLoading, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     return useContext(AuthContext);
// };








import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../components/api'; // Import from your api.js

const TOKEN_KEY = 'user_token';
const USER_KEY = 'user_data';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUserFromStorage = async () => {
            try {
                const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
                const storedUser = await AsyncStorage.getItem(USER_KEY);
                if (storedToken && storedUser) {
                    setAuthToken(storedToken); // Sync API client on app start
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                console.error("AuthContext: Failed to load user from storage.", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadUserFromStorage();
    }, []);

    const login = async (userData, userToken) => {
        try {
            await Promise.all([
                AsyncStorage.setItem(TOKEN_KEY, userToken),
                AsyncStorage.setItem(USER_KEY, JSON.stringify(userData))
            ]);
            setAuthToken(userToken); // Actively set the token in the API client
            setUser(userData);
        } catch (e) {
            console.error("AuthContext: Failed to save auth data.", e);
        }
    };

    const logout = async () => {
        try {
            await Promise.all([
                AsyncStorage.removeItem(TOKEN_KEY),
                AsyncStorage.removeItem(USER_KEY)
            ]);
            setAuthToken(null); // Actively clear the token from the API client
            setUser(null);
        } catch (e) {
            console.error("AuthContext: Failed to clear auth data.", e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


