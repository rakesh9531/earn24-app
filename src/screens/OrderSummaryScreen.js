// import React, { useState } from 'react';
// import { 
//     View, 
//     Text, 
//     StyleSheet, 
//     SafeAreaView, 
//     ScrollView, 
//     TouchableOpacity, 
//     ActivityIndicator, 
//     Alert 
// } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { orderService } from '../services/orderService';
// import RazorpayCheckout from 'react-native-razorpay';

// const OrderSummaryScreen = () => {
//     const navigation = useNavigation();
//     const route = useRoute();
//     const { selectedAddress } = route.params;
    
//     const { cartItems, subtotal, clearCart } = useCart();
//     const { user } = useAuth();
//     const [isLoading, setIsLoading] = useState(false);
//     const [paymentMethod, setPaymentMethod] = useState('COD');

//     const deliveryFee = cartItems.length > 0 ? 40.00 : 0;
//     const totalAmount = subtotal + deliveryFee;

//     const handlePlaceOrder = async () => {
//         setIsLoading(true);
//         try {
//             const payload = {
//                 shippingAddressId: selectedAddress.id,
//                 paymentMethod: paymentMethod,
//             };
//             const response = await orderService.createOrder(payload);

//             if (!response.status) {
//                 throw new Error(response.message || 'Could not create order.');
//             }

//             if (paymentMethod === 'ONLINE') {
//                 initiateRazorpay(response.data);
//             } else {
//                 await clearCart();
//                 navigation.reset({
//                     index: 1,
//                     routes: [{ name: 'AppTabs' }, { name: 'OrderSuccess', params: { order: response.data } }],
//                 });
//             }
//         } catch (error) {
//             Alert.alert('Error', error.message || 'An unexpected error occurred.');
//             setIsLoading(false);
//         }
//     };
    
//     const initiateRazorpay = (orderData) => {
//         const options = {
//             description: `Payment for Order #${orderData.orderNumber}`,
//             image: 'https://your-app-logo.com/logo.png', // Replace with your logo URL
//             currency: 'INR',
//             key: 'YOUR_RAZORPAY_KEY_ID', // IMPORTANT: Replace with your key from the Razorpay dashboard
//             amount: Math.round(totalAmount * 100),
//             name: 'Earn24',
//             order_id: orderData.paymentGatewayOrder.id,
//             prefill: {
//                 email: user.email,
//                 contact: user.mobileNumber,
//                 name: user.fullName
//             },
//             theme: { color: '#0CA201' }
//         };

//         RazorpayCheckout.open(options).then(async (data) => {
//             Alert.alert('Payment Successful', `Payment ID: ${data.razorpay_payment_id}`);
//             await clearCart();
//             navigation.reset({
//                 index: 1,
//                 routes: [{ name: 'AppTabs' }, { name: 'OrderSuccess', params: { order: orderData } }],
//             });
//         }).catch((error) => {
//             Alert.alert('Payment Failed', `Error: ${error.code} - ${error.description}`);
//             setIsLoading(false);
//         });
//     };

//     const paymentOptions = [
//         { key: 'WALLET', label: 'Pay from Wallet', icon: 'wallet-outline' },
//         { key: 'ONLINE', label: 'UPI, Credit/Debit Card', icon: 'card-outline' },
//         { key: 'COD', label: 'Cash on Delivery', icon: 'cash-outline' },
//     ];

//     return (
//         <SafeAreaView style={styles.container}>
//             <ScrollView contentContainerStyle={styles.scrollContent}>
//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Shipping to</Text>
//                     <View style={styles.addressCard}>
//                         <Text style={styles.addressName}>{selectedAddress.fullName}</Text>
//                         <Text style={styles.addressText}>{`${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`}</Text>
//                         <Text style={styles.addressPhone}>Mobile: {selectedAddress.mobileNumber}</Text>
//                     </View>
//                 </View>

//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Items Summary ({cartItems.length})</Text>
//                     {cartItems.map(item => (
//                         <View key={item.cart_item_id} style={styles.itemRow}>
//                             <Text style={styles.itemName}>{item.name} <Text style={styles.itemQuantity}>(x{item.quantity})</Text></Text>
//                             <Text style={styles.itemPrice}>₹{(parseFloat(item.selling_price) * item.quantity).toFixed(2)}</Text>
//                         </View>
//                     ))}
//                 </View>

//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Select Payment Method</Text>
//                     {paymentOptions.map(option => (
//                         <TouchableOpacity 
//                             key={option.key}
//                             style={[styles.paymentOption, paymentMethod === option.key && styles.paymentOptionSelected]}
//                             onPress={() => setPaymentMethod(option.key)}
//                         >
//                             <Icon name={option.icon} size={24} color={paymentMethod === option.key ? '#2a9d8f' : '#343a40'} />
//                             <Text style={styles.paymentText}>{option.label}</Text>
//                             <Icon name={paymentMethod === option.key ? 'radio-button-on' : 'radio-button-off'} size={24} color="#2a9d8f" />
//                         </TouchableOpacity>
//                     ))}
//                 </View>
//             </ScrollView>
            
//             <View style={styles.summaryContainer}>
//                 <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text></View>
//                 <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery Fee</Text><Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text></View>
//                 <View style={styles.totalRow}><Text style={styles.totalLabel}>Grand Total</Text><Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text></View>
//                 <TouchableOpacity style={[styles.placeOrderButton, isLoading && styles.disabledButton]} onPress={handlePlaceOrder} disabled={isLoading}>
//                     {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.placeOrderButtonText}>Place Order</Text>}
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#f8f9fa' },
//     scrollContent: { paddingBottom: 20 },
//     section: { backgroundColor: '#fff', padding: 15, marginBottom: 10 },
//     sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#343a40' },
//     addressCard: { padding: 10, borderWidth: 1, borderColor: '#e9ecef', borderRadius: 8 },
//     addressName: { fontSize: 16, fontWeight: '500' },
//     addressText: { fontSize: 14, color: '#6c757d', lineHeight: 20 },
//     addressPhone: { fontSize: 14, color: '#6c757d', marginTop: 5 },
//     itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
//     itemName: { fontSize: 15, color: '#343a40', flex: 1 },
//     itemQuantity: { color: '#6c757d' },
//     itemPrice: { fontSize: 15, fontWeight: '500' },
//     paymentOption: { flexDirection: 'row', alignItems: 'center', padding: 15, borderWidth: 1, borderColor: '#ced4da', borderRadius: 8, marginBottom: 10 },
//     paymentOptionSelected: { borderColor: '#2a9d8f', borderWidth: 2, backgroundColor: '#e6f9f0' },
//     paymentText: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: '500' },
//     summaryContainer: { padding: 20, borderTopWidth: 1, borderTopColor: '#e9ecef', backgroundColor: '#fff' },
//     summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
//     summaryLabel: { fontSize: 16, color: '#6c757d' },
//     summaryValue: { fontSize: 16, fontWeight: '500' },
//     totalRow: { paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e9ecef' },
//     totalLabel: { fontSize: 18, fontWeight: 'bold' },
//     totalValue: { fontSize: 18, fontWeight: 'bold', color: '#2a9d8f' },
//     placeOrderButton: { backgroundColor: '#0CA201', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15 },
//     disabledButton: { backgroundColor: '#a5d6a7' },
//     placeOrderButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
// });

// export default OrderSummaryScreen;






// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { orderService } from '../services/orderService';
// import { settingsService } from '../services/settingsService';
// import RazorpayCheckout from 'react-native-razorpay';

// const OrderSummaryScreen = () => {
//     const navigation = useNavigation();
//     const route = useRoute();
//     const { selectedAddress } = route.params;
    
//     const { cartItems, subtotal, totalBvInCart, clearCart } = useCart();
//     const { user } = useAuth();
//     const [isLoading, setIsLoading] = useState(false);
//     const [paymentMethod, setPaymentMethod] = useState('COD');
    
//     const [deliverySettings, setDeliverySettings] = useState({ threshold: 50, standard: 40, special: 0 });
//     const [isSettingsLoading, setIsSettingsLoading] = useState(true);

//     useEffect(() => {
//         const fetchSettings = async () => {
//             setIsSettingsLoading(true);
//             try {
//                 const response = await settingsService.getAllSettings();
//                 if (response.status) {
//                     const settingsMap = response.data.reduce((acc, setting) => {
//                         acc[setting.setting_key] = parseFloat(setting.setting_value);
//                         return acc;
//                     }, {});
//                     setDeliverySettings({
//                         threshold: settingsMap.delivery_fee_bv_threshold || 50,
//                         standard: settingsMap.delivery_fee_standard || 40,
//                         special: settingsMap.delivery_fee_special !== undefined ? settingsMap.delivery_fee_special : 0
//                     });
//                 }
//             } catch (e) {
//                 console.error("Could not fetch delivery settings");
//             } finally {
//                 setIsSettingsLoading(false);
//             }
//         };
//         fetchSettings();
//     }, []);

//     const deliveryFee = (totalBvInCart >= deliverySettings.threshold) ? deliverySettings.special : deliverySettings.standard;
//     const totalAmount = subtotal + deliveryFee;

//     const handlePlaceOrder = async () => {
//         setIsLoading(true);
//         try {
//             const payload = {
//                 shippingAddressId: selectedAddress.id,
//                 paymentMethod: paymentMethod,
//             };
//             const response = await orderService.createOrder(payload);

//             if (!response.status) {
//                 throw new Error(response.message || 'Could not create order.');
//             }

//             if (paymentMethod === 'ONLINE') {
//                 initiateRazorpay(response.data);
//             } else {
//                 await clearCart();
//                 navigation.reset({
//                     index: 1,
//                     routes: [{ name: 'AppTabs' }, { name: 'OrderSuccess', params: { order: response.data } }],
//                 });
//             }
//         } catch (error) {
//             Alert.alert('Error', error.message || 'An unexpected error occurred.');
//             setIsLoading(false);
//         }
//     };
    
//     const initiateRazorpay = (orderData) => {
//         const options = {
//             description: `Payment for Order #${orderData.orderNumber}`,
//             image: 'https://your-app-logo.com/logo.png',
//             currency: 'INR',
//             key: 'YOUR_RAZORPAY_KEY_ID',
//             amount: Math.round(totalAmount * 100),
//             name: 'Earn24',
//             order_id: orderData.paymentGatewayOrder.id,
//             prefill: {
//                 email: user.email,
//                 contact: user.mobileNumber,
//                 name: user.fullName
//             },
//             theme: { color: '#0CA201' }
//         };

//         RazorpayCheckout.open(options).then(async (data) => {
//             await clearCart();
//             navigation.reset({
//                 index: 1,
//                 routes: [{ name: 'AppTabs' }, { name: 'OrderSuccess', params: { order: orderData } }],
//             });
//         }).catch((error) => {
//             Alert.alert('Payment Failed', `Error: ${error.code} - ${error.description}`);
//             setIsLoading(false);
//         });
//     };

//     const paymentOptions = [
//         { key: 'WALLET', label: 'Pay from Wallet', icon: 'wallet-outline' },
//         { key: 'ONLINE', label: 'UPI, Credit/Debit Card', icon: 'card-outline' },
//         { key: 'COD', label: 'Cash on Delivery', icon: 'cash-outline' },
//     ];

//     // --- Helper component for the incentive message ---
//     const DeliveryIncentiveBar = () => {
//         if (isSettingsLoading || deliverySettings.special !== 0) {
//             return null; // Don't show if settings are loading or if delivery is not free
//         }

//         const bvNeeded = deliverySettings.threshold - totalBvInCart;
//         const progressPercentage = Math.min((totalBvInCart / deliverySettings.threshold) * 100, 100);

//         if (bvNeeded > 0) {
//             return (
//                 <View style={styles.incentiveContainer}>
//                     <Text style={styles.incentiveText}>
//                         You are only <Text style={{fontWeight: 'bold'}}>{bvNeeded.toFixed(2)} BV</Text> away from FREE delivery!
//                     </Text>
//                     <View style={styles.progressBarBackground}>
//                         <View style={[styles.progressBarForeground, { width: `${progressPercentage}%` }]} />
//                     </View>
//                 </View>
//             );
//         }
//         return null; // If they qualified, the message will show in the summary section
//     };


//     return (
//         <SafeAreaView style={styles.container}>
//             <ScrollView contentContainerStyle={styles.scrollContent}>
//                 {/* --- Incentive Bar is added here --- */}
//                 <DeliveryIncentiveBar />
                
//                 {/* --- Delivery Address Section --- */}
//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Shipping to</Text>
//                     <View style={styles.addressCard}>
//                         <Text style={styles.addressName}>{selectedAddress.fullName}</Text>
//                         <Text style={styles.addressText}>{`${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`}</Text>
//                         <Text style={styles.addressPhone}>Mobile: {selectedAddress.mobileNumber}</Text>
//                     </View>
//                 </View>

//                 {/* --- Items Summary Section --- */}
//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Items Summary ({cartItems.length})</Text>
//                     {cartItems.map(item => (
//                         <View key={item.cart_item_id} style={styles.itemRow}>
//                             <Text style={styles.itemName}>{item.name} <Text style={styles.itemQuantity}>(x{item.quantity})</Text></Text>
//                             <Text style={styles.itemPrice}>₹{(parseFloat(item.selling_price) * item.quantity).toFixed(2)}</Text>
//                         </View>
//                     ))}
//                 </View>

//                 {/* --- Payment Method Section --- */}
//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Select Payment Method</Text>
//                     {paymentOptions.map(option => (
//                         <TouchableOpacity 
//                             key={option.key}
//                             style={[styles.paymentOption, paymentMethod === option.key && styles.paymentOptionSelected]}
//                             onPress={() => setPaymentMethod(option.key)}
//                         >
//                             <Icon name={option.icon} size={24} color={paymentMethod === option.key ? '#2a9d8f' : '#343a40'} />
//                             <Text style={styles.paymentText}>{option.label}</Text>
//                             <Icon name={paymentMethod === option.key ? 'radio-button-on' : 'radio-button-off'} size={24} color="#2a9d8f" />
//                         </TouchableOpacity>
//                     ))}
//                 </View>
//             </ScrollView>
            
//             {/* --- Bottom Summary & Place Order Button --- */}
//             <View style={styles.summaryContainer}>
//                 {isSettingsLoading ? (
//                     <ActivityIndicator style={{marginBottom: 10}} color="#2a9d8f" />
//                 ) : (
//                     <>
//                         {deliverySettings.special === 0 && totalBvInCart >= deliverySettings.threshold && (
//                             <Text style={styles.successMessage}>
//                                 <Icon name="star" size={16} color="#e9c46a" /> Congratulations! You've earned FREE delivery.
//                             </Text>
//                         )}
//                         <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text></View>
//                         <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery Fee</Text><Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text></View>
//                         <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Total BV Earned</Text><Text style={styles.bvValue}>{totalBvInCart.toFixed(2)}</Text></View>
//                     </>
//                 )}
                
//                 <View style={styles.totalRow}>
//                     <Text style={styles.totalLabel}>Grand Total</Text>
//                     <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
//                 </View>

//                 <TouchableOpacity 
//                     style={[styles.placeOrderButton, isLoading && styles.disabledButton]} 
//                     onPress={handlePlaceOrder} 
//                     disabled={isLoading || isSettingsLoading}
//                 >
//                     {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.placeOrderButtonText}>Place Order</Text>}
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#f8f9fa' },
//     scrollContent: { paddingBottom: 20 },
//     section: { backgroundColor: '#fff', padding: 15, marginBottom: 10 },
//     sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#343a40' },
//     addressCard: { padding: 15, backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#e9ecef', borderRadius: 8 },
//     addressName: { fontSize: 16, fontWeight: '500' },
//     addressText: { fontSize: 14, color: '#6c757d', lineHeight: 20 },
//     addressPhone: { fontSize: 14, color: '#6c757d', marginTop: 5 },
//     itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
//     itemName: { fontSize: 15, color: '#343a40', flex: 1 },
//     itemQuantity: { color: '#6c757d' },
//     itemPrice: { fontSize: 15, fontWeight: '500' },
//     paymentOption: { flexDirection: 'row', alignItems: 'center', padding: 15, borderWidth: 1, borderColor: '#ced4da', borderRadius: 8, marginBottom: 10 },
//     paymentOptionSelected: { borderColor: '#2a9d8f', borderWidth: 2, backgroundColor: '#e6f9f0' },
//     paymentText: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: '500' },
//     summaryContainer: { padding: 20, borderTopWidth: 1, borderTopColor: '#e9ecef', backgroundColor: '#fff', elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
//     summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
//     summaryLabel: { fontSize: 16, color: '#6c757d' },
//     summaryValue: { fontSize: 16, fontWeight: '500' },
//     bvValue: { fontSize: 16, fontWeight: 'bold', color: '#007bff' },
//     totalRow: { paddingTop: 12, borderTopWidth: 1, borderTopColor: '#e9ecef', marginTop: 5, flexDirection: 'row', justifyContent: 'space-between' },
//     totalLabel: { fontSize: 18, fontWeight: 'bold' },
//     totalValue: { fontSize: 18, fontWeight: 'bold', color: '#2a9d8f' },
//     placeOrderButton: { backgroundColor: '#0CA201', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15 },
//     disabledButton: { backgroundColor: '#a5d6a7' },
//     placeOrderButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
//     successMessage: { color: '#28a745', fontWeight: 'bold', textAlign: 'center', marginBottom: 10, fontSize: 14 },
//     incentiveContainer: { backgroundColor: '#e6f9f0', padding: 15, margin: 10, borderRadius: 8, borderLeftWidth: 5, borderLeftColor: '#28a745' },
//     incentiveText: { fontSize: 14, color: '#1e6a39', marginBottom: 8, },
//     progressBarBackground: { height: 8, backgroundColor: '#c8e6c9', borderRadius: 4, overflow: 'hidden', },
//     progressBarForeground: { height: '100%', backgroundColor: '#28a745', borderRadius: 4, }
// });

// export default OrderSummaryScreen;










import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { orderService } from '../services/orderService';
import { settingsService } from '../services/settingsService';
import RazorpayCheckout from 'react-native-razorpay';

const OrderSummaryScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { selectedAddress } = route.params;
    
    const { cartItems, subtotal, totalBvInCart, clearCart } = useCart();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    
    const [deliverySettings, setDeliverySettings] = useState(null);
    const [isSettingsLoading, setIsSettingsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            setIsSettingsLoading(true);
            setError('');
            try {
                const response = await settingsService.getAllSettings();

                console.log("response-->",response)
                if (response.status) {
                    const settingsMap = response.data.reduce((acc, setting) => {
                        acc[setting.setting_key] = parseFloat(setting.setting_value);
                        return acc;
                    }, {});
                    setDeliverySettings({
                        threshold: settingsMap.delivery_fee_bv_threshold ,
                        standard: settingsMap.delivery_fee_standard,
                        special: settingsMap.delivery_fee_special !== undefined ? settingsMap.delivery_fee_special : 0
                    });
                } else {
                    throw new Error(response.message || "Failed to fetch settings");
                }
            } catch (e) {
                console.error("Could not fetch delivery settings. Full Error:", e.message);
                setError("Could not load delivery information.");
            } finally {
                setIsSettingsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const { deliveryFee, totalAmount } = useMemo(() => {
        if (!deliverySettings) return { deliveryFee: 0, totalAmount: subtotal };
        const fee = (totalBvInCart >= deliverySettings.threshold) ? deliverySettings.special : deliverySettings.standard;
        return { deliveryFee: fee, totalAmount: subtotal + fee };
    }, [subtotal, totalBvInCart, deliverySettings]);

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        try {
            const payload = {
                shippingAddressId: selectedAddress.id,
                paymentMethod: paymentMethod,
            };
            const response = await orderService.createOrder(payload);

            if (!response.status) {
                throw new Error(response.message || 'Could not create order.');
            }

            if (paymentMethod === 'ONLINE') {
                initiateRazorpay(response.data);
            } else {
                await clearCart();
                navigation.reset({
                    index: 1,
                    routes: [{ name: 'AppTabs' }, { name: 'OrderSuccess', params: { order: response.data } }],
                });
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'An unexpected error occurred.');
            setIsLoading(false);
        }
    };
    
    const initiateRazorpay = (orderData) => {
        const options = {
            description: `Payment for Order #${orderData.orderNumber}`,
            image: 'https://your-app-logo.com/logo.png',
            currency: 'INR',
            key: 'YOUR_RAZORPAY_KEY_ID',
            amount: Math.round(totalAmount * 100),
            name: 'Earn24',
            order_id: orderData.paymentGatewayOrder.id,
            prefill: {
                email: user.email,
                contact: user.mobileNumber,
                name: user.fullName
            },
            theme: { color: '#0CA201' }
        };

        RazorpayCheckout.open(options).then(async (data) => {
            await clearCart();
            navigation.reset({
                index: 1,
                routes: [{ name: 'AppTabs' }, { name: 'OrderSuccess', params: { order: orderData } }],
            });
        }).catch((error) => {
            Alert.alert('Payment Failed', `Error: ${error.code} - ${error.description}`);
            setIsLoading(false);
        });
    };

    const paymentOptions = [
        { key: 'WALLET', label: 'Pay from Wallet', icon: 'wallet-outline' },
        { key: 'ONLINE', label: 'UPI, Credit/Debit Card', icon: 'card-outline' },
        { key: 'COD', label: 'Cash on Delivery', icon: 'cash-outline' },
    ];

    const DeliveryIncentiveBar = () => {
        if (isSettingsLoading || !deliverySettings || deliverySettings.special !== 0) return null;
        const bvNeeded = deliverySettings.threshold - totalBvInCart;
        if (bvNeeded <= 0) return null;
        const progressPercentage = Math.min((totalBvInCart / deliverySettings.threshold) * 100, 100);
        return (
            <View style={styles.incentiveContainer}>
                <Text style={styles.incentiveText}>You are only <Text style={{fontWeight: 'bold'}}>{bvNeeded.toFixed(2)} BV</Text> away from FREE delivery!</Text>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarForeground, { width: `${progressPercentage}%` }]} />
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <DeliveryIncentiveBar />
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Shipping to</Text>
                    <View style={styles.addressCard}>
                        <Text style={styles.addressName}>{selectedAddress.fullName}</Text>
                        <Text style={styles.addressText}>{`${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`}</Text>
                        <Text style={styles.addressPhone}>Mobile: {selectedAddress.mobileNumber}</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Items Summary ({cartItems.length})</Text>
                    {cartItems.map(item => (
                        <View key={item.cart_item_id} style={styles.itemRow}>
                            <Text style={styles.itemName}>{item.name} <Text style={styles.itemQuantity}>(x{item.quantity})</Text></Text>
                            <Text style={styles.itemPrice}>₹{(parseFloat(item.selling_price) * item.quantity).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Payment Method</Text>
                    {paymentOptions.map(option => (
                        <TouchableOpacity key={option.key} style={[styles.paymentOption, paymentMethod === option.key && styles.paymentOptionSelected]} onPress={() => setPaymentMethod(option.key)}>
                            <Icon name={option.icon} size={24} color={paymentMethod === option.key ? '#2a9d8f' : '#343a40'} />
                            <Text style={styles.paymentText}>{option.label}</Text>
                            <Icon name={paymentMethod === option.key ? 'radio-button-on' : 'radio-button-off'} size={24} color="#2a9d8f" />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <View style={styles.summaryContainer}>
                {isSettingsLoading ? <ActivityIndicator style={{marginBottom: 10}} color="#2a9d8f" /> : error ? <Text style={{color: 'red', textAlign: 'center', marginBottom: 10}}>{error}</Text> : (
                    <>
                        {deliverySettings?.special === 0 && totalBvInCart >= deliverySettings?.threshold && (
                            <Text style={styles.successMessage}><Icon name="star" size={16} color="#e9c46a" /> Congratulations! You've earned FREE delivery.</Text>
                        )}
                        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text></View>
                        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery Fee</Text><Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text></View>
                        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Total BV Earned</Text><Text style={styles.bvValue}>{totalBvInCart.toFixed(2)}</Text></View>
                    </>
                )}
                <View style={styles.totalRow}><Text style={styles.totalLabel}>Grand Total</Text><Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text></View>
                <TouchableOpacity style={[styles.placeOrderButton, (isLoading || isSettingsLoading) && styles.disabledButton]} onPress={handlePlaceOrder} disabled={isLoading || isSettingsLoading} >
                    {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.placeOrderButtonText}>Place Order</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    scrollContent: { paddingBottom: 20 },
    section: { backgroundColor: '#fff', padding: 15, marginBottom: 10 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#343a40' },
    addressCard: { padding: 15, backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#e9ecef', borderRadius: 8 },
    addressName: { fontSize: 16, fontWeight: '500' },
    addressText: { fontSize: 14, color: '#6c757d', lineHeight: 20 },
    addressPhone: { fontSize: 14, color: '#6c757d', marginTop: 5 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    itemName: { fontSize: 15, color: '#343a40', flex: 1 },
    itemQuantity: { color: '#6c757d' },
    itemPrice: { fontSize: 15, fontWeight: '500' },
    paymentOption: { flexDirection: 'row', alignItems: 'center', padding: 15, borderWidth: 1, borderColor: '#ced4da', borderRadius: 8, marginBottom: 10 },
    paymentOptionSelected: { borderColor: '#2a9d8f', borderWidth: 2, backgroundColor: '#e6f9f0' },
    paymentText: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: '500' },
    summaryContainer: { padding: 20, borderTopWidth: 1, borderTopColor: '#e9ecef', backgroundColor: '#fff', elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    summaryLabel: { fontSize: 16, color: '#6c757d' },
    summaryValue: { fontSize: 16, fontWeight: '500' },
    bvValue: { fontSize: 16, fontWeight: 'bold', color: '#007bff' },
    totalRow: { paddingTop: 12, borderTopWidth: 1, borderTopColor: '#e9ecef', marginTop: 5, flexDirection: 'row', justifyContent: 'space-between' },
    totalLabel: { fontSize: 18, fontWeight: 'bold' },
    totalValue: { fontSize: 18, fontWeight: 'bold', color: '#2a9d8f' },
    placeOrderButton: { backgroundColor: '#0CA201', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15 },
    disabledButton: { backgroundColor: '#a5d6a7' },
    placeOrderButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    successMessage: { color: '#28a745', fontWeight: 'bold', textAlign: 'center', marginBottom: 10, fontSize: 14 },
    incentiveContainer: { backgroundColor: '#e6f9f0', padding: 15, margin: 10, borderRadius: 8, borderLeftWidth: 5, borderLeftColor: '#28a745' },
    incentiveText: { fontSize: 14, color: '#1e6a39', marginBottom: 8, },
    progressBarBackground: { height: 8, backgroundColor: '#c8e6c9', borderRadius: 4, overflow: 'hidden', },
    progressBarForeground: { height: '100%', backgroundColor: '#28a745', borderRadius: 4, }
});

export default OrderSummaryScreen;