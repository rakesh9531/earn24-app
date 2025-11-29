import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Image, TouchableOpacity,Alert } from 'react-native';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import { orderService } from '../services/orderService';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

// --- A visual tracker for the order status ---
const StatusTracker = ({ status }) => {
    const statuses = ['CONFIRMED', 'SHIPPED', 'DELIVERED'];
    const currentIndex = statuses.indexOf(status);

    if (status === 'CANCELLED') {
        return <Text style={[styles.statusLabel, {color: '#D32F2F', fontSize: 16}]}>Order Cancelled</Text>
    }
    if (currentIndex === -1) { // For PENDING_PAYMENT etc.
        return <Text style={[styles.statusLabel, {color: '#f57c00', fontSize: 16}]}>Processing...</Text>
    }

    return (
        <View style={styles.trackerContainer}>
            {statuses.map((s, index) => (
                <React.Fragment key={s}>
                    <View style={styles.statusPoint}>
                        <View style={[styles.dot, index <= currentIndex && styles.activeDot]} />
                        <Text style={[styles.statusLabel, index <= currentIndex && styles.activeLabel]}>{s}</Text>
                    </View>
                    {index < statuses.length - 1 && <View style={[styles.line, index < currentIndex && styles.activeLine]} />}
                </React.Fragment>
            ))}
        </View>
    );
};

// --- The Main Order Details Screen Component ---
const OrderDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { orderId } = route.params;

    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
     const [isFetchingProduct, setIsFetchingProduct] = useState(false); // <-- ADD THIS STATE

    const fetchOrderDetails = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await orderService.getOrderDetails(orderId);
            if (response.status) {
                setOrder(response.data);
                navigation.setOptions({ title: `Order #${response.data.orderNumber}` });
            }
        } catch (error) {
            console.error("Failed to fetch order details", error);
        } finally {
            setIsLoading(false);
        }
    }, [orderId, navigation]);

    // --- THIS IS THE FIX ---
    // The async function `fetchOrderDetails` is wrapped inside a non-async function.
    useFocusEffect(
        useCallback(() => {
            fetchOrderDetails();
            // This wrapper function returns nothing (undefined), which is correct.
        }, [fetchOrderDetails])
    );


    const handleItemPress = async (productId) => {
        if (isFetchingProduct) return;
        setIsFetchingProduct(true);
        try {
            // ==========================================================
            // === THE FIX: Import the service inside the function      ===
            // ==========================================================
            const { productService } = require('../services/productService');

            const response = await productService.getProductById(productId);
            if (response.status) {
                navigation.navigate('ProductDetails', { product: response.data });
            } else {
                Alert.alert('Error', response.message || 'Product details could not be found.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while fetching product details.');
            console.error("Failed to fetch product for details page:", error);
        } finally {
            setIsFetchingProduct(false);
        }
    };

    if (isLoading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#0CA201" /></View>;
    }
    
    if (!order) {
        return <View style={styles.centered}><Text>Order not found.</Text></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.section}>
                    <View style={styles.headerRow}>
                        <Text style={styles.orderIdText}>Order ID: {order.orderNumber}</Text>
                        <Text style={styles.orderDate}>{moment(order.createdAt).format('D MMM YYYY')}</Text>
                    </View>
                    <StatusTracker status={order.orderStatus} />
                </View>

                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Items Ordered ({order.items.length})</Text>
                    {order.items.map(item => (
                        <View key={item.id} style={styles.itemRow}>
                             <Image source={{ uri: `http://192.168.0.171:3000${item.imageUrl}` }} style={styles.itemImage} />
                             <View style={styles.itemDetails}>
                                <Text style={styles.itemName}>{item.productName}</Text>
                                <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                             </View>
                             <Text style={styles.itemPrice}>₹{item.totalPrice.toFixed(2)}</Text>
                        </View>
                    ))}
                </View> */}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Items Ordered ({order.items.length})</Text>
                    {order.items.map(item => (
                        <TouchableOpacity 
                            key={item.id} 
                            style={styles.itemRow}
                            onPress={() => handleItemPress(item.productId)}
                            activeOpacity={0.7}
                            disabled={isFetchingProduct}
                        >
                             <Image source={{ uri: `http://192.168.0.171:3000${item.imageUrl}` }} style={styles.itemImage} />
                             <View style={styles.itemDetails}>
                                <Text style={styles.itemName}>{item.productName}</Text>
                                <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                             </View>
                             <Text style={styles.itemPrice}>₹{item.totalPrice.toFixed(2)}</Text>
                        </TouchableOpacity>
                    ))}
                </View>



                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Shipping Address</Text>
                     <View style={styles.addressCard}>
                        <Text style={styles.addressName}>{order.shippingAddress.fullName}</Text>
                        <Text style={styles.addressText}>{`${order.shippingAddress.addressLine1}${order.shippingAddress.addressLine2 ? ', '+order.shippingAddress.addressLine2 : ''}`}</Text>
                        <Text style={styles.addressText}>{`${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Summary</Text>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>₹{order.subtotal.toFixed(2)}</Text></View>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery Fee</Text><Text style={styles.summaryValue}>₹{order.deliveryFee.toFixed(2)}</Text></View>
                    <View style={styles.totalRow}><Text style={styles.totalLabel}>Grand Total</Text><Text style={styles.totalValue}>₹{order.totalAmount.toFixed(2)}</Text></View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    section: { backgroundColor: '#fff', padding: 15, marginBottom: 10 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#343a40' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    orderIdText: { fontSize: 16, fontWeight: '600', color: '#181725' },
    orderDate: { fontSize: 14, color: '#6c757d' },
    trackerContainer: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 10, paddingBottom: 10 },
    statusPoint: { alignItems: 'center', flex: 1 },
    dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#e0e0e0', borderWidth: 2, borderColor: '#fff', elevation: 1 },
    activeDot: { backgroundColor: '#28a745' },
    statusLabel: { fontSize: 12, color: '#6c757d', marginTop: 8, textAlign: 'center', fontWeight: '500' },
    activeLabel: { color: '#28a745', fontWeight: 'bold' },
    line: { flex: 1, height: 3, backgroundColor: '#e0e0e0', marginTop: 5 },
    activeLine: { backgroundColor: '#28a745' },
    itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    itemImage: { width: 50, height: 50, borderRadius: 8, marginRight: 15, backgroundColor: '#f8f9fa' },
    itemDetails: { flex: 1 },
    itemName: { fontSize: 15, fontWeight: '500', color: '#181725' },
    itemQuantity: { fontSize: 13, color: '#6c757d', marginTop: 2 },
    itemPrice: { fontSize: 15, fontWeight: 'bold', color: '#343a40' },
    addressCard: { padding: 15, backgroundColor: '#f8f9fa', borderRadius: 8 },
    addressName: { fontSize: 16, fontWeight: '500' },
    addressText: { fontSize: 14, color: '#6c757d', marginTop: 4, lineHeight: 20 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    summaryLabel: { fontSize: 16, color: '#6c757d' },
    summaryValue: { fontSize: 16, fontWeight: '500', color: '#343a40' },
    totalRow: { paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e9ecef', marginTop: 5 },
    totalLabel: { fontSize: 18, fontWeight: 'bold' },
    totalValue: { fontSize: 18, fontWeight: 'bold', color: '#2a9d8f' },
});

export default OrderDetailsScreen;