import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { orderService } from '../services/orderService';
import OrderCard from '../components/OrderCard';

const OrderHistoryScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Add pagination state in the future if needed

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await orderService.getOrderHistory();
            if (response.status) {
                setOrders(response.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch order history", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // --- THIS IS THE FIX ---
    // The async function `fetchOrders` is now wrapped inside a non-async function.
    useFocusEffect(
        useCallback(() => {
            fetchOrders();
            // This wrapper function returns nothing (undefined), which is correct.
        }, [fetchOrders])
    );
    // --- END OF FIX ---

    if (isLoading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#0CA201" /></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <OrderCard 
                        order={item} 
                        onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
                    />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={() => (
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>You haven't placed any orders yet.</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { padding: 15 },
    emptyText: { fontSize: 16, color: '#6c757d' },
});

export default OrderHistoryScreen;