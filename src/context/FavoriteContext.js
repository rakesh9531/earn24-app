import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { favoriteService } from '../services/favoriteService';
import { Alert } from 'react-native';

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
    const { token, user } = useAuth();
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load favorites from API
    const loadFavorites = async () => {
        if (!token) {
            setFavoriteIds([]);
            setFavoriteProducts([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await favoriteService.getFavorites();
            if (response.status && response.data) {
                setFavoriteProducts(response.data);
                const ids = response.data.map(p => p.id || p.product_id);
                setFavoriteIds(ids);
            }
        } catch (error) {
            console.error('Error loading favorites in context:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Load/Clear favorites when auth token changes
    useEffect(() => {
        loadFavorites();
    }, [token]);

    // Check if product is in favorites
    const isFavorite = (productId) => {
        if (!productId) return false;
        const id = parseInt(productId, 10);
        return Array.isArray(favoriteIds) ? favoriteIds.includes(id) : false;
    };

    // Toggle favorite with optimistic UI updates
    const toggleFavorite = async (product, navigation = null) => {
        if (!token) {
            if (navigation) {
                navigation.navigate('Login');
            }
            return { requiredAuth: true };
        }

        const productId = parseInt(product.id || product.product_id, 10);
        const wasFavorite = favoriteIds.includes(productId);

        // --- Optimistic State Update ---
        let updatedIds = [];
        let updatedProducts = [];

        if (wasFavorite) {
            updatedIds = favoriteIds.filter(id => id !== productId);
            updatedProducts = favoriteProducts.filter(p => parseInt(p.id || p.product_id, 10) !== productId);
        } else {
            updatedIds = [...favoriteIds, productId];
            // Format standard product details for the list render compatibility
            const favoriteProductObj = {
                ...product,
                id: productId,
                product_id: productId
            };
            updatedProducts = [favoriteProductObj, ...favoriteProducts];
        }

        setFavoriteIds(updatedIds);
        setFavoriteProducts(updatedProducts);

        // --- Backend API Sync ---
        try {
            const response = await favoriteService.toggleFavorite(productId);
            if (!response.status) {
                // Rollback if API fails
                console.warn('API toggling failed, rolling back favorite state');
                setFavoriteIds(favoriteIds);
                setFavoriteProducts(favoriteProducts);
                Alert.alert('Error', response.message || 'Failed to update favorites on server.');
            }
        } catch (error) {
            // Rollback on network error
            console.error('Network error during toggleFavorite:', error);
            setFavoriteIds(favoriteIds);
            setFavoriteProducts(favoriteProducts);
        }

        return { success: true };
    };

    return (
        <FavoriteContext.Provider value={{
            favoriteIds,
            favoriteProducts,
            isLoading,
            isFavorite,
            toggleFavorite,
            refreshFavorites: loadFavorites
        }}>
            {children}
        </FavoriteContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoriteContext);
