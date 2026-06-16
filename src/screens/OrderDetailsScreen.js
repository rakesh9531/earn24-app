import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Image, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

// --- A visual tracker for the order status ---
const StatusTracker = ({ status }) => {
    const statuses = ['CONFIRMED', 'SHIPPED', 'DELIVERED'];
    const currentIndex = statuses.indexOf(status);

    if (status === 'CANCELLED') {
        return <Text style={[styles.statusLabel, { color: '#D32F2F', fontSize: 16 }]}>Order Cancelled</Text>
    }
    if (currentIndex === -1) { // For PENDING_PAYMENT etc.
        return <Text style={[styles.statusLabel, { color: '#f57c00', fontSize: 16 }]}>Processing...</Text>
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
    const { token } = useAuth();

    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingProduct, setIsFetchingProduct] = useState(false); // <-- ADD THIS STATE
    const [isCancelling, setIsCancelling] = useState(false);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

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

    const handleCancelOrderSubmit = async () => {
        if (!cancelReason.trim()) {
            Alert.alert("Reason Required", "Please enter a reason for cancelling this order.");
            return;
        }

        setIsCancelling(true);
        try {
            const response = await orderService.cancelOrder(order.id, cancelReason.trim());
            if (response.status) {
                Alert.alert("Success", "Your order has been cancelled successfully.");
                setCancelReason('');
                setIsCancelModalVisible(false);
                fetchOrderDetails(); // Refresh details
            } else {
                Alert.alert("Error", response.message || "Failed to cancel order.");
            }
        } catch (error) {
            console.error("Order cancel failed:", error);
            const errMsg = error.message || "Failed to cancel order. Please try again.";
            Alert.alert("Error", errMsg);
        } finally {
            setIsCancelling(false);
        }
    };

    // --- THIS IS THE FIX ---
    // The async function `fetchOrderDetails` is wrapped inside a non-async function.
    useFocusEffect(
        useCallback(() => {
            fetchOrderDetails();
            // This wrapper function returns nothing (undefined), which is correct.
        }, [fetchOrderDetails])
    );


    const handleDownloadInvoice = () => {
        if (!order || !token) return;
        const url = orderService.getInvoiceUrl(order.id, token);
        Linking.openURL(url).catch(err => {
            console.error("Failed to open invoice URL", err);
            Alert.alert("Error", "Could not open the invoice. Please try again later.");
        });
    };

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
                             <Image source={{ uri: `http://https://newapi.earn24.in${item.imageUrl}` }} style={styles.itemImage} />
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
                            <Image source={{ uri: `https://newapi.earn24.in${item.imageUrl}` }} style={styles.itemImage} />
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
                        <Text style={styles.addressText}>{`${order.shippingAddress.addressLine1}${order.shippingAddress.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''}`}</Text>
                        <Text style={styles.addressText}>{`${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Summary</Text>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>₹{order.subtotal.toFixed(2)}</Text></View>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery Fee</Text><Text style={styles.summaryValue}>₹{order.deliveryFee.toFixed(2)}</Text></View>
                    <View style={styles.totalRow}><Text style={styles.totalLabel}>Grand Total</Text><Text style={styles.totalValue}>₹{order.totalAmount.toFixed(2)}</Text></View>
                </View>

                {/* --- DOWNLOAD INVOICE BUTTON (Back at Bottom with Margin) --- */}
                {order.orderStatus === 'DELIVERED' && (
                    <TouchableOpacity 
                        style={styles.invoiceButton} 
                        onPress={handleDownloadInvoice}
                    >
                        <Icon name="download-outline" size={20} color="#fff" />
                        <Text style={styles.invoiceButtonText}>Download Invoice (PDF)</Text>
                    </TouchableOpacity>
                )}

                {/* --- CANCEL ORDER BUTTON --- */}
                {['PENDING', 'PENDING_PAYMENT', 'CONFIRMED'].includes(order.orderStatus) && (
                    <TouchableOpacity 
                        style={[styles.cancelOrderButton, isCancelling && styles.disabledButton]} 
                        onPress={() => setIsCancelModalVisible(true)}
                        disabled={isCancelling}
                    >
                        {isCancelling ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Icon name="close-circle-outline" size={20} color="#fff" />
                                <Text style={styles.cancelOrderButtonText}>Cancel Order</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}

                {/* Extra space at the bottom for better scroll experience */}
                <View style={{ height: 60 }} /> 
            </ScrollView>

            {/* --- CANCELLATION MODAL --- */}
            <Modal
                visible={isCancelModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsCancelModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Cancel Order</Text>
                        <Text style={styles.modalSubtitle}>Please provide a reason for cancelling this order:</Text>
                        
                        <TextInput
                            style={styles.textInput}
                            placeholder="Reason for cancellation (e.g., Change of mind, Incorrect address)"
                            placeholderTextColor="#999"
                            value={cancelReason}
                            onChangeText={setCancelReason}
                            multiline={true}
                            numberOfLines={3}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.modalCancelBtn]} 
                                onPress={() => setIsCancelModalVisible(false)}
                                disabled={isCancelling}
                            >
                                <Text style={styles.modalCancelBtnText}>Dismiss</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.modalButton, styles.modalSubmitBtn]} 
                                onPress={handleCancelOrderSubmit}
                                disabled={isCancelling}
                            >
                                {isCancelling ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.modalSubmitBtnText}>Cancel Order</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    invoiceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0CA201',
        margin: 15,
        padding: 15,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    invoiceButtonText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    cancelOrderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D32F2F',
        margin: 15,
        padding: 15,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    disabledButton: {
        opacity: 0.7,
    },
    cancelOrderButtonText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    // Cancel Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#181725',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 15,
        textAlign: 'center',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        padding: 10,
        fontSize: 15,
        color: '#333',
        backgroundColor: '#f8f9fa',
        minHeight: 80,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCancelBtn: {
        backgroundColor: '#e9ecef',
    },
    modalCancelBtnText: {
        color: '#495057',
        fontSize: 15,
        fontWeight: '600',
    },
    modalSubmitBtn: {
        backgroundColor: '#D32F2F',
    },
    modalSubmitBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default OrderDetailsScreen;