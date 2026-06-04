
// //  test2 cart empty


// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';

// // Contexts
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';

// // Services
// import { orderService } from '../services/orderService';
// import { settingsService } from '../services/settingsService';
// import { paymentService } from '../services/paymentService';

// const OrderSummaryScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { selectedAddress } = route.params;

//   const { cartItems, subtotal, totalBvInCart, clearCart } = useCart();
//   const { user } = useAuth();
  
//   const [isLoading, setIsLoading] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState('COD');
//   const [deliverySettings, setDeliverySettings] = useState(null);
//   const [isSettingsLoading, setIsSettingsLoading] = useState(true);

//   // State to track if an order was already created in this session (e.g. attempted Online pay)
//   const [existingOrderData, setExistingOrderData] = useState(null);

//   // --- 1. Fetch Delivery Settings ---
//   useEffect(() => {
//     const fetchSettings = async () => {
//       setIsSettingsLoading(true);
//       try {
//         const response = await settingsService.getAllSettings();
//         if (response.status) {
//           const settingsMap = response.data.reduce((acc, setting) => {
//             acc[setting.setting_key] = parseFloat(setting.setting_value);
//             return acc;
//           }, {});
//           setDeliverySettings({
//             threshold: settingsMap.delivery_fee_bv_threshold,
//             standard: settingsMap.delivery_fee_standard,
//             special: settingsMap.delivery_fee_special || 0,
//           });
//         }
//       } catch (e) {
//         console.error('Settings Fetch Error:', e.message);
//       } finally {
//         setIsSettingsLoading(false);
//       }
//     };
//     fetchSettings();
//   }, []);

//   // --- 2. Calculate Totals ---
//   const { deliveryFee, totalAmount } = useMemo(() => {
//     if (!deliverySettings) return { deliveryFee: 0, totalAmount: subtotal };
//     const fee = totalBvInCart >= deliverySettings.threshold
//         ? deliverySettings.special
//         : deliverySettings.standard;
//     return { deliveryFee: fee, totalAmount: subtotal + fee };
//   }, [subtotal, totalBvInCart, deliverySettings]);

//   // --- 3. HELPER: Generate PayU HTML Form ---
//   const generatePayUForm = (action, params) => {
//     const inputs = Object.keys(params).map(key => 
//       `<input type="hidden" name="${key}" value="${params[key]}" />`
//     ).join('');

//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta name="viewport" content="width=device-width, initial-scale=1">
//         <title>Redirecting to PayU...</title>
//       </head>
//       <body onload="document.forms[0].submit()" style="display:flex; justify-content:center; align-items:center; height:100vh; flex-direction:column; background-color:#fff;">
//         <form action="${action}" method="post">
//           ${inputs}
//         </form>
//         <div style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size:16px; color:#333; margin-bottom: 20px;">
//           Securely redirecting to Payment Gateway...
//         </div>
//         <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #0CA201; border-radius: 50%; animation: spin 1s linear infinite;"></div>
//         <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
//       </body>
//       </html>
//     `;
//   };

//   // --- 4. MAIN ORDER LOGIC ---
//   const handlePlaceOrder = async () => {
//     setIsLoading(true);
//     try {
//       let orderId;
//       let orderData;

//       // CHECK: Do we already have an order ID from a previous attempt?
//       if (existingOrderData) {
//         orderId = existingOrderData.orderId;
//         orderData = { ...existingOrderData }; // Clone to avoid mutation issues

//         // ✅ CRITICAL FIX: If switching to COD, update Backend & Local Object
//         if (paymentMethod !== 'ONLINE') {
//            try {
//              // 1. Call Backend to update DB status to 'CONFIRMED'
//              await orderService.updatePaymentMethod(orderId, paymentMethod);
             
//              // 2. Update Local Object so the Next Screen shows "Confirmed" immediately
//              orderData.payment_mode = paymentMethod;
//              orderData.order_status = 'CONFIRMED'; 
             
//            } catch (err) {
//              console.warn("Could not update payment method on server", err);
//            }
//         }
//       } else {
//         // Create NEW order (First attempt)
//         const payload = {
//           shippingAddressId: selectedAddress.id,
//           paymentMethod: paymentMethod,
//           amount: totalAmount,
//           userId: user.id,
//           name: user.fullName,
//           email: user.email,
//           mobile: user.mobileNumber
//         };

//         const orderRes = await orderService.createOrder(payload);

//         if (!orderRes.status) {
//           throw new Error(orderRes.message || 'Could not create order.');
//         }

//         // Save this for reuse if user hits "Back"
//         orderData = orderRes.data;
//         orderId = orderRes.data.orderId;
//         setExistingOrderData(orderRes.data);
//       }

//       // --- Scenario: Online Payment ---
//       if (paymentMethod === 'ONLINE') {
        
//         if (!orderId) throw new Error("Order ID missing.");

//         const paymentPayload = {
//           userId: user.id,
//           name: user.fullName,
//           email: user.email,
//           mobile: user.mobileNumber,
//           amount: totalAmount,
//           orderId: orderId 
//         };

//         const paymentRes = await paymentService.initiatePayment(paymentPayload);
//         const gatewayName = paymentRes.gateway ? paymentRes.gateway.toLowerCase() : '';

//         if (gatewayName === 'payu') {
//           const payUHtml = generatePayUForm(paymentRes.payu_url, paymentRes.params);
//           setIsLoading(false); 
//           navigation.navigate('PaymentWebView', {
//             htmlContent: payUHtml,
//             orderData: orderData,
//             successTarget: 'OrderSuccess'
//           });
//         } 
//         else {
//           throw new Error(`Gateway '${gatewayName}' is not configured.`);
//         }

//       } 
//       // --- Scenario: Cash on Delivery ---
//       else if (paymentMethod === 'COD') {
//         await clearCart();
        
//         // Navigate to Success with the Updated Order Data
//         navigation.reset({
//           index: 1,
//           routes: [
//             { name: 'AppTabs' },
//             { name: 'OrderSuccess', params: { order: orderData } },
//           ],
//         });
//       } 
//       else {
//         throw new Error("Payment method not supported.");
//       }

//     } catch (error) {
//       console.error("Order Logic Error:", error);
//       Alert.alert('Order Error', error.message || 'An unexpected error occurred.');
//     } finally {
//       if (paymentMethod === 'COD') setIsLoading(false);
//     }
//   };

//   const paymentOptions = [
//     { key: 'ONLINE', label: 'Online Payment (PayU)', icon: 'card-outline' },
//     { key: 'COD', label: 'Cash on Delivery', icon: 'cash-outline' },
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
        
//         {/* Shipping Address */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Shipping to</Text>
//           <View style={styles.addressCard}>
//             <Text style={styles.addressName}>{selectedAddress.fullName}</Text>
//             <Text style={styles.addressText}>
//                 {`${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`}
//             </Text>
//             <Text style={styles.addressPhone}>Mobile: {selectedAddress.mobileNumber}</Text>
//           </View>
//         </View>

//         {/* Items Summary */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Items ({cartItems.length})</Text>
//           {cartItems.map(item => (
//             <View key={item.cart_item_id} style={styles.itemRow}>
//               <Text style={styles.itemName}>{item.name} <Text style={styles.itemQuantity}>(x{item.quantity})</Text></Text>
//               <Text style={styles.itemPrice}>₹{(parseFloat(item.selling_price) * item.quantity).toFixed(2)}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Payment Methods */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Payment Method</Text>
//           {paymentOptions.map(option => (
//             <TouchableOpacity
//               key={option.key}
//               style={[styles.paymentOption, paymentMethod === option.key && styles.paymentOptionSelected]}
//               onPress={() => setPaymentMethod(option.key)}
//             >
//               <Icon name={option.icon} size={22} color={paymentMethod === option.key ? '#0CA201' : '#666'} />
//               <Text style={styles.paymentText}>{option.label}</Text>
//               <Icon name={paymentMethod === option.key ? 'radio-button-on' : 'radio-button-off'} size={20} color="#0CA201" />
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>

//       {/* Footer */}
//       <View style={styles.summaryContainer}>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Subtotal</Text>
//           <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
//         </View>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Delivery Fee</Text>
//           <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
//         </View>
//         <View style={[styles.summaryRow, { marginTop: 5, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' }]}>
//           <Text style={styles.totalLabel}>Grand Total</Text>
//           <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
//         </View>

//         <TouchableOpacity
//           style={[styles.placeOrderButton, (isLoading || isSettingsLoading) && styles.disabledButton]}
//           onPress={handlePlaceOrder}
//           disabled={isLoading || isSettingsLoading}
//         >
//           {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.placeOrderButtonText}>Place Order</Text>}
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f4f4f4' },
//   scrollContent: { paddingBottom: 20 },
//   section: { backgroundColor: '#fff', padding: 15, marginBottom: 10 },
//   sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#333' },
//   addressCard: { padding: 12, backgroundColor: '#fdfdfd', borderWidth: 1, borderColor: '#eee', borderRadius: 8 },
//   addressName: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
//   addressText: { fontSize: 14, color: '#666', lineHeight: 20 },
//   addressPhone: { fontSize: 14, color: '#666', marginTop: 5 },
//   itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
//   itemName: { fontSize: 14, color: '#444', flex: 1 },
//   itemQuantity: { color: '#888', fontSize: 12 },
//   itemPrice: { fontSize: 14, fontWeight: '600' },
//   paymentOption: { flexDirection: 'row', alignItems: 'center', padding: 15, borderWidth: 1, borderColor: '#eee', borderRadius: 10, marginBottom: 10 },
//   paymentOptionSelected: { borderColor: '#0CA201', backgroundColor: '#f0fff4' },
//   paymentText: { flex: 1, marginLeft: 15, fontSize: 15 },
//   summaryContainer: { padding: 20, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 5 },
//   summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
//   summaryLabel: { fontSize: 14, color: '#777' },
//   summaryValue: { fontSize: 14, fontWeight: '600' },
//   totalLabel: { fontSize: 18, fontWeight: 'bold' },
//   totalValue: { fontSize: 18, fontWeight: 'bold', color: '#0CA201' },
//   placeOrderButton: { backgroundColor: '#0CA201', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 15 },
//   disabledButton: { backgroundColor: '#999' },
//   placeOrderButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
// });

// export default OrderSummaryScreen;















// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';

// // Contexts
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';

// // Services
// import { orderService } from '../services/orderService';
// import { settingsService } from '../services/settingsService';
// import { paymentService } from '../services/paymentService';
// import { walletService } from '../services/walletService'; // ✅ NEW: Import Wallet Service

// const OrderSummaryScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { selectedAddress } = route.params;

//   const { cartItems, subtotal, totalBvInCart, clearCart } = useCart();
//   const { user } = useAuth();
  
//   const [isLoading, setIsLoading] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState('COD');
//   const [deliverySettings, setDeliverySettings] = useState(null);
//   const [isSettingsLoading, setIsSettingsLoading] = useState(true);

//   // ✅ NEW: Wallet State
//   const [walletBalance, setWalletBalance] = useState(0);
//   const [isWalletLoading, setIsWalletLoading] = useState(true);

//   const [existingOrderData, setExistingOrderData] = useState(null);

//   // --- 1. Fetch Settings & Wallet Balance ---
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsSettingsLoading(true);
//       try {
//         // Parallel requests for speed
//         const [settingsRes, walletRes] = await Promise.all([
//           settingsService.getAllSettings(),
//           walletService.getWalletBalance() // ✅ NEW: Fetch Balance
//         ]);

//         // Handle Settings
//         if (settingsRes.status) {
//           const settingsMap = settingsRes.data.reduce((acc, setting) => {
//             acc[setting.setting_key] = parseFloat(setting.setting_value);
//             return acc;
//           }, {});
//           setDeliverySettings({
//             threshold: settingsMap.delivery_fee_bv_threshold,
//             standard: settingsMap.delivery_fee_standard,
//             special: settingsMap.delivery_fee_special || 0,
//           });
//         }

//         // Handle Wallet
//         if (walletRes.status) {
//           setWalletBalance(parseFloat(walletRes.data.balance || 0));
//         }

//       } catch (e) {
//         console.error('Fetch Error:', e.message);
//       } finally {
//         setIsSettingsLoading(false);
//         setIsWalletLoading(false);
//       }
//     };
//     fetchData();
//   }, [user.id]);

//   // --- 2. Calculate Totals ---
//   const { deliveryFee, totalAmount } = useMemo(() => {
//     if (!deliverySettings) return { deliveryFee: 0, totalAmount: subtotal };
//     const fee = totalBvInCart >= deliverySettings.threshold
//         ? deliverySettings.special
//         : deliverySettings.standard;
//     return { deliveryFee: fee, totalAmount: subtotal + fee };
//   }, [subtotal, totalBvInCart, deliverySettings]);

//   // --- 3. HELPER: PayU Form (Existing) ---
//   const generatePayUForm = (action, params) => {
//     const inputs = Object.keys(params).map(key => 
//       `<input type="hidden" name="${key}" value="${params[key]}" />`
//     ).join('');
//     return `<!DOCTYPE html><html><body onload="document.forms[0].submit()"><form action="${action}" method="post">${inputs}</form></body></html>`;
//   };

//   // --- 4. MAIN ORDER LOGIC ---
//   const handlePlaceOrder = async () => {
//     // ✅ Check Wallet Balance before starting
//     if (paymentMethod === 'WALLET' && walletBalance < totalAmount) {
//       Alert.alert('Insufficient Balance', `Your wallet balance (₹${walletBalance}) is lower than the order total.`);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       let orderId;
//       let orderData;

//       // A. Create or Retrieve Order
//       if (existingOrderData) {
//         orderId = existingOrderData.orderId;
//         orderData = { ...existingOrderData };

//         // If switching methods, update backend preference
//         if (paymentMethod !== 'ONLINE') {
//            try {
//              await orderService.updatePaymentMethod(orderId, paymentMethod);
//              orderData.payment_mode = paymentMethod;
//            } catch (err) { console.warn(err); }
//         }
//       } else {
//         const payload = {
//           shippingAddressId: selectedAddress.id,
//           paymentMethod: paymentMethod,
//           amount: totalAmount,
//           userId: user.id,
//           name: user.fullName,
//           email: user.email,
//           mobile: user.mobileNumber
//         };

//         const orderRes = await orderService.createOrder(payload);
//         if (!orderRes.status) throw new Error(orderRes.message);

//         orderData = orderRes.data;
//         orderId = orderRes.data.orderId;
//         setExistingOrderData(orderRes.data);
//       }

//       // --- B. Handle Payment Methods ---

//       // 1. ONLINE (PayU)
//       if (paymentMethod === 'ONLINE') {
//         const paymentPayload = { userId: user.id, name: user.fullName, email: user.email, mobile: user.mobileNumber, amount: totalAmount, orderId: orderId };
//         const paymentRes = await paymentService.initiatePayment(paymentPayload);
        
//         if (paymentRes.gateway?.toLowerCase() === 'payu') {
//           const payUHtml = generatePayUForm(paymentRes.payu_url, paymentRes.params);
//           setIsLoading(false); 
//           navigation.navigate('PaymentWebView', { htmlContent: payUHtml, orderData: orderData, successTarget: 'OrderSuccess' });
//         } else {
//           throw new Error(`Gateway configuration error.`);
//         }
//       } 
      
//       // 2. WALLET (New)
//       else if (paymentMethod === 'WALLET') {
//         const walletPayload = {
//           orderId: orderId,
//           userId: user.id,
//           amount: totalAmount
//         };

//         // Call API to deduct money and mark order confirmed
//         const walletRes = await walletService.payOrderWithWallet(walletPayload);

//         if (walletRes.status) {
//           await clearCart();
//           // Update order status locally for the success screen
//           orderData.payment_status = 'PAID';
//           orderData.order_status = 'CONFIRMED';
          
//           navigation.reset({
//             index: 1,
//             routes: [{ name: 'AppTabs' }, { name: 'OrderSuccess', params: { order: orderData } }],
//           });
//         } else {
//           throw new Error(walletRes.message || "Wallet payment failed.");
//         }
//       }

//       // 3. CASH ON DELIVERY
//       else if (paymentMethod === 'COD') {
//         await clearCart();
//         navigation.reset({
//           index: 1,
//           routes: [{ name: 'AppTabs' }, { name: 'OrderSuccess', params: { order: orderData } }],
//         });
//       } 

//     } catch (error) {
//       console.error("Order Logic Error:", error);
//       Alert.alert('Order Error', error.message || 'An unexpected error occurred.');
//     } finally {
//       // Stop loading only if we aren't navigating away (like in Webview)
//       if (paymentMethod !== 'ONLINE') setIsLoading(false);
//     }
//   };

//   // ✅ NEW: Payment Options Array
//   const paymentOptions = [
//     { 
//       key: 'WALLET', 
//       label: `Pay via Wallet`, 
//       subLabel: `Available Balance: ₹${walletBalance.toFixed(2)}`,
//       icon: 'wallet-outline',
//       disabled: walletBalance < totalAmount // Disable if insufficient funds
//     },
//     { key: 'ONLINE', label: 'Online Payment (PayU)', icon: 'card-outline', disabled: false },
//     { key: 'COD', label: 'Cash on Delivery', icon: 'cash-outline', disabled: false },
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
        
//         {/* Shipping Address */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Shipping to</Text>
//           <View style={styles.addressCard}>
//             <Text style={styles.addressName}>{selectedAddress.fullName}</Text>
//             <Text style={styles.addressText}>
//                 {`${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`}
//             </Text>
//           </View>
//         </View>

//         {/* Items Summary */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Items ({cartItems.length})</Text>
//           {cartItems.map(item => (
//             <View key={item.cart_item_id} style={styles.itemRow}>
//               <Text style={styles.itemName}>{item.name} <Text style={styles.itemQuantity}>(x{item.quantity})</Text></Text>
//               <Text style={styles.itemPrice}>₹{(parseFloat(item.selling_price) * item.quantity).toFixed(2)}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Payment Methods */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Payment Method</Text>
//           {paymentOptions.map(option => (
//             <TouchableOpacity
//               key={option.key}
//               style={[
//                 styles.paymentOption, 
//                 paymentMethod === option.key && styles.paymentOptionSelected,
//                 option.disabled && styles.paymentOptionDisabled
//               ]}
//               onPress={() => {
//                 if(!option.disabled) setPaymentMethod(option.key);
//                 else Alert.alert("Insufficient Balance", "Please recharge your wallet or choose another method.");
//               }}
//               activeOpacity={option.disabled ? 1 : 0.7}
//             >
//               <Icon name={option.icon} size={22} color={paymentMethod === option.key ? '#0CA201' : (option.disabled ? '#ccc' : '#666')} />
//               <View style={styles.paymentTextContainer}>
//                 <Text style={[styles.paymentText, option.disabled && {color: '#999'}]}>{option.label}</Text>
//                 {/* Show balance subtitle for wallet */}
//                 {option.subLabel && (
//                   <Text style={[
//                     styles.paymentSubText, 
//                     walletBalance < totalAmount ? {color: '#d9534f'} : {color: '#0CA201'}
//                   ]}>
//                     {option.subLabel}
//                   </Text>
//                 )}
//               </View>
//               {/* Radio Button */}
//               {!option.disabled && (
//                 <Icon name={paymentMethod === option.key ? 'radio-button-on' : 'radio-button-off'} size={20} color="#0CA201" />
//               )}
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>

//       {/* Footer */}
//       <View style={styles.summaryContainer}>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Subtotal</Text>
//           <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
//         </View>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Delivery Fee</Text>
//           <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
//         </View>
//         <View style={[styles.summaryRow, { marginTop: 5, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' }]}>
//           <Text style={styles.totalLabel}>Grand Total</Text>
//           <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
//         </View>

//         <TouchableOpacity
//           style={[styles.placeOrderButton, (isLoading || isSettingsLoading) && styles.disabledButton]}
//           onPress={handlePlaceOrder}
//           disabled={isLoading || isSettingsLoading}
//         >
//           {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.placeOrderButtonText}>
//             {paymentMethod === 'WALLET' ? 'Pay & Confirm' : 'Place Order'}
//           </Text>}
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f4f4f4' },
//   scrollContent: { paddingBottom: 20 },
//   section: { backgroundColor: '#fff', padding: 15, marginBottom: 10 },
//   sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#333' },
//   addressCard: { padding: 12, backgroundColor: '#fdfdfd', borderWidth: 1, borderColor: '#eee', borderRadius: 8 },
//   addressName: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
//   addressText: { fontSize: 14, color: '#666', lineHeight: 20 },
//   itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
//   itemName: { fontSize: 14, color: '#444', flex: 1 },
//   itemQuantity: { color: '#888', fontSize: 12 },
//   itemPrice: { fontSize: 14, fontWeight: '600' },
  
//   // Payment Options
//   paymentOption: { flexDirection: 'row', alignItems: 'center', padding: 15, borderWidth: 1, borderColor: '#eee', borderRadius: 10, marginBottom: 10 },
//   paymentOptionSelected: { borderColor: '#0CA201', backgroundColor: '#f0fff4' },
//   paymentOptionDisabled: { backgroundColor: '#f9f9f9', borderColor: '#eee', opacity: 0.8 },
//   paymentTextContainer: { flex: 1, marginLeft: 15 },
//   paymentText: { fontSize: 15, color: '#333' },
//   paymentSubText: { fontSize: 12, marginTop: 2, fontWeight: '600' },

//   summaryContainer: { padding: 20, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 20 },
//   summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
//   summaryLabel: { fontSize: 14, color: '#777' },
//   summaryValue: { fontSize: 14, fontWeight: '600' },
//   totalLabel: { fontSize: 18, fontWeight: 'bold' },
//   totalValue: { fontSize: 18, fontWeight: 'bold', color: '#0CA201' },
//   placeOrderButton: { backgroundColor: '#0CA201', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 15 },
//   disabledButton: { backgroundColor: '#999' },
//   placeOrderButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
// });

// export default OrderSummaryScreen;













import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Contexts
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Services
import { orderService } from '../services/orderService';
import { settingsService } from '../services/settingsService';
import { paymentService } from '../services/paymentService';
import { walletService } from '../services/walletService';

const OrderSummaryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedAddress, finalCartItems } = route.params;

  const { removeOrderedItems } = useCart();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [deliverySettings, setDeliverySettings] = useState(null);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);

  const [walletBalance, setWalletBalance] = useState(0);
  const [isWalletLoading, setIsWalletLoading] = useState(true);

  // --- 1. Fetch Settings & Wallet Balance ---
  useEffect(() => {
    const fetchData = async () => {
      setIsSettingsLoading(true);
      try {
        const [settingsRes, walletRes] = await Promise.all([
          settingsService.getAllSettings(),
          walletService.getWalletBalance() 
        ]);

        if (settingsRes.status) {
          const settingsMap = settingsRes.data.reduce((acc, setting) => {
            acc[setting.setting_key] = parseFloat(setting.setting_value);
            return acc;
          }, {});
          setDeliverySettings({
            threshold: settingsMap.delivery_fee_bv_threshold,
            standard: settingsMap.delivery_fee_standard,
            special: settingsMap.delivery_fee_special || 0,
          });
        }

        if (walletRes.status) {
          setWalletBalance(parseFloat(walletRes.data.balance || 0));
        }
      } catch (e) {
        console.error('Fetch Error:', e.message);
      } finally {
        setIsSettingsLoading(false);
        setIsWalletLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. Calculate Totals based on finalCartItems ---
  const { subtotal, totalBvInCart, cartItemIds } = useMemo(() => {
    let st = 0;
    let bv = 0;
    let ids = [];
    finalCartItems.forEach(item => {
      st += parseFloat(item.selling_price) * item.quantity;
      bv += parseFloat(item.bv_earned || 0) * item.quantity;
      ids.push(item.cart_item_id);
    });
    return { subtotal: st, totalBvInCart: bv, cartItemIds: ids };
  }, [finalCartItems]);

  const { deliveryFee, totalAmount } = useMemo(() => {
    if (!deliverySettings) return { deliveryFee: 0, totalAmount: subtotal };
    const fee = totalBvInCart >= deliverySettings.threshold
        ? deliverySettings.special
        : deliverySettings.standard;
    return { deliveryFee: fee, totalAmount: subtotal + fee };
  }, [subtotal, totalBvInCart, deliverySettings]);

  const deliveryIncentive = useMemo(() => {
    if (!deliverySettings || deliverySettings.special !== 0 || subtotal === 0) {
      return null;
    }
    const bvNeeded = deliverySettings.threshold - totalBvInCart;
    if (bvNeeded <= 0) return null;
    
    return {
      bvNeeded,
      progress: Math.min((totalBvInCart / deliverySettings.threshold) * 100, 100),
    };
  }, [totalBvInCart, subtotal, deliverySettings]);

  // PayU Helper
  const generatePayUForm = (action, params) => {
    const inputs = Object.keys(params).map(key => 
      `<input type="hidden" name="${key}" value="${params[key]}" />`
    ).join('');
    return `<!DOCTYPE html><html><body onload="document.forms[0].submit()"><form action="${action}" method="post">${inputs}</form></body></html>`;
  };

  // --- 3. MAIN ORDER LOGIC ---
  const handlePlaceOrder = async () => {
    if (paymentMethod === 'WALLET' && walletBalance < totalAmount) {
      Alert.alert('Insufficient Balance', `Your wallet balance (₹${walletBalance}) is lower than the order total.`);
      return;
    }

    setIsLoading(true);
    try {
      // Step A: Create the Order
      // Your backend logic says: If method is WALLET, deduct balance NOW.
      const payload = {
        shippingAddressId: selectedAddress.id,
        paymentMethod: paymentMethod,
        cartItemIds: cartItemIds, // Pass the IDs of selected items
      };

      const orderRes = await orderService.createOrder(payload);
      
      if (!orderRes.status) {
        throw new Error(orderRes.message || "Failed to create order.");
      }

      const orderData = orderRes.data;

      // Step B: Route user based on Payment Method
      if (paymentMethod === 'ONLINE') {
        const paymentPayload = { 
            userId: user.id, name: user.fullName, email: user.email, 
            mobile: user.mobileNumber, amount: totalAmount, orderId: orderData.orderId 
        };
        const paymentRes = await paymentService.initiatePayment(paymentPayload);
        
        if (paymentRes.gateway?.toLowerCase() === 'payu') {
          const payUHtml = generatePayUForm(paymentRes.payu_url, paymentRes.params);
          setIsLoading(false); 
          navigation.navigate('PaymentWebView', { 
              htmlContent: payUHtml, 
              orderData: orderData, 
              successTarget: 'OrderSuccess',
              cartItemIds: cartItemIds // <-- ADD THIS
          });
        } else {
          throw new Error(`Gateway configuration error.`);
        }
      } 
      else {
        // This covers both WALLET and COD
        // Since backend already handled the logic, we just show success
        
        // 1. Remove ONLY ordered items from local state
        removeOrderedItems(cartItemIds);
        
        // 2. Refresh cart in background to stay in sync with server
        // (removeOrderedItems is already optimistic, fetchCart will confirm)

        // 3. Navigate to Success
        navigation.reset({
          index: 1,
          routes: [
            { name: 'AppTabs' }, 
            { 
              name: 'OrderSuccess', 
              params: { 
                order: {
                  ...orderData,
                  // Ensure we use values from backend response
                  delivery_fee: orderData.delivery_fee ?? deliveryFee,
                  total_amount: orderData.total_amount ?? totalAmount
                } 
              } 
            }
          ],
        });
      }

    } catch (error) {
      console.error("Order Logic Error:", error);
      Alert.alert('Order Error', error.message || 'An unexpected error occurred.');
    } finally {
      if (paymentMethod !== 'ONLINE') setIsLoading(false);
    }
  };

  const paymentOptions = [
    { 
      key: 'WALLET', 
      label: `Pay via Wallet`, 
      subLabel: `Available Balance: ₹${walletBalance.toFixed(2)}`,
      icon: 'wallet-outline',
      disabled: walletBalance < totalAmount 
    },
    { key: 'ONLINE', label: 'Online Payment (PayU)', icon: 'card-outline', disabled: false },
    { key: 'COD', label: 'Cash on Delivery', icon: 'cash-outline', disabled: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping to</Text>
          <View style={styles.addressCard}>
            <Text style={styles.addressName}>{selectedAddress.fullName}</Text>
            <Text style={styles.addressText}>
                {`${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items ({finalCartItems.length})</Text>
          {finalCartItems.map(item => (
            <View key={item.cart_item_id} style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name} <Text style={styles.itemQuantity}>(x{item.quantity})</Text></Text>
                {item.attributes && item.attributes.length > 0 && (
                  <Text style={styles.itemAttributes}>
                    {item.attributes.map(a => a.value).join(', ')}
                  </Text>
                )}
              </View>
              <Text style={styles.itemPrice}>₹{(parseFloat(item.selling_price) * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentOptions.map(option => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.paymentOption, 
                paymentMethod === option.key && styles.paymentOptionSelected,
                option.disabled && styles.paymentOptionDisabled
              ]}
              onPress={() => {
                if(!option.disabled) setPaymentMethod(option.key);
                else Alert.alert("Insufficient Balance", "Please recharge your wallet.");
              }}
              activeOpacity={option.disabled ? 1 : 0.7}
            >
              <Icon name={option.icon} size={22} color={paymentMethod === option.key ? '#0CA201' : (option.disabled ? '#ccc' : '#666')} />
              <View style={styles.paymentTextContainer}>
                <Text style={[styles.paymentText, option.disabled && {color: '#999'}]}>{option.label}</Text>
                {option.subLabel && (
                  <Text style={[
                    styles.paymentSubText, 
                    walletBalance < totalAmount ? {color: '#d9534f'} : {color: '#0CA201'}
                  ]}>
                    {option.subLabel}
                  </Text>
                )}
              </View>
              {!option.disabled && (
                <Icon name={paymentMethod === option.key ? 'radio-button-on' : 'radio-button-off'} size={20} color="#0CA201" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.summaryContainer}>
        {deliveryIncentive && (
          <View style={styles.incentiveContainer}>
            <View style={styles.incentiveTextRow}>
              <Icon name="gift-outline" size={16} color="#0CA201" />
              <Text style={styles.incentiveText}>
                Add <Text style={{ fontWeight: 'bold' }}>{deliveryIncentive.bvNeeded.toFixed(2)} BV</Text> more for <Text style={{ fontWeight: 'bold' }}>FREE Delivery</Text>
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${deliveryIncentive.progress}%` }]} />
            </View>
          </View>
        )}
        {subtotal > 0 && deliveryFee === 0 && (
            <View style={[styles.incentiveContainer, { borderColor: '#0CA201' }]}>
                <View style={styles.incentiveTextRow}>
                <Icon name="checkmark-circle" size={18} color="#0CA201" />
                <Text style={[styles.incentiveText, { color: '#0CA201', fontWeight: 'bold' }]}>
                    Congratulations! You've unlocked FREE Delivery.
                </Text>
                </View>
            </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, { marginTop: 5, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' }]}>
          <Text style={styles.totalLabel}>Grand Total</Text>
          <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.placeOrderButton, (isLoading || isSettingsLoading) && styles.disabledButton]}
          onPress={handlePlaceOrder}
          disabled={isLoading || isSettingsLoading}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.placeOrderButtonText}>
            {paymentMethod === 'WALLET' ? 'Pay & Confirm' : 'Place Order'}
          </Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  scrollContent: { paddingBottom: 20 },
  section: { backgroundColor: '#fff', padding: 15, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  addressCard: { padding: 12, backgroundColor: '#fdfdfd', borderWidth: 1, borderColor: '#eee', borderRadius: 8 },
  addressName: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  addressText: { fontSize: 14, color: '#666', lineHeight: 20 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  itemName: { fontSize: 14, color: '#444', flex: 1 },
  itemQuantity: { color: '#888', fontSize: 12 },
  itemPrice: { fontSize: 14, fontWeight: '600' },
  itemAttributes: { fontSize: 12, color: '#0CA201', marginTop: 2, fontWeight: '500' },
  paymentOption: { flexDirection: 'row', alignItems: 'center', padding: 15, borderWidth: 1, borderColor: '#eee', borderRadius: 10, marginBottom: 10 },
  paymentOptionSelected: { borderColor: '#0CA201', backgroundColor: '#f0fff4' },
  paymentOptionDisabled: { backgroundColor: '#f9f9f9', borderColor: '#eee', opacity: 0.8 },
  paymentTextContainer: { flex: 1, marginLeft: 15 },
  paymentText: { fontSize: 15, color: '#333' },
  paymentSubText: { fontSize: 12, marginTop: 2, fontWeight: '600' },
  summaryContainer: { padding: 20, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 20 },
  incentiveContainer: { backgroundColor: '#f0fff4', padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#dcfce7' },
  incentiveTextRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  incentiveText: { fontSize: 13, color: '#166534', marginLeft: 8 },
  progressBarBg: { height: 6, backgroundColor: '#d1fae5', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#0CA201', borderRadius: 3 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#777' },
  summaryValue: { fontSize: 14, fontWeight: '600' },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#0CA201' },
  placeOrderButton: { backgroundColor: '#0CA201', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 15 },
  disabledButton: { backgroundColor: '#999' },
  placeOrderButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default OrderSummaryScreen;