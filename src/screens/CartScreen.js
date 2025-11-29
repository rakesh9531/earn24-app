// import React from 'react';
// import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { useCart } from '../context/CartContext';
// import Icon from 'react-native-vector-icons/Ionicons';

// // A single item in the cart list (No changes needed here)
// const CartItem = ({ item }) => {
//     const { updateQuantity, removeFromCart } = useCart();
//     const imageUrl = item.main_image_url ? `http://192.168.0.171:3000${item.main_image_url}` : 'https://via.placeholder.com/150';
//     const bvPerUnit = parseFloat(item.bv_earned || 0);
//     const totalBvForItem = bvPerUnit * item.quantity;

//     const handleDecrease = () => {
//         const minQuantity = item.minimum_order_quantity || 1;
//         if (item.quantity <= minQuantity) {
//             removeFromCart(item.cart_item_id);
//         } else {
//             updateQuantity(item.cart_item_id, item.quantity - 1);
//         }
//     };
    
//     const handleIncrease = () => {
//         updateQuantity(item.cart_item_id, item.quantity + 1);
//     };

//     return (
//         <View style={styles.itemContainer}>
//             <Image source={{ uri: imageUrl }} style={styles.itemImage} />
//             <View style={styles.itemDetails}>
//                 <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
//                 <Text style={styles.itemBrand}>{item.brand_name}</Text>
//                 <Text style={styles.itemPrice}>₹{parseFloat(item.selling_price).toFixed(2)}</Text>
//                 {totalBvForItem > 0 && (
//                     <Text style={styles.bvText}>Earn {totalBvForItem.toFixed(2)} BV</Text>
//                 )}
//             </View>
//             <View style={styles.quantityContainer}>
//                 <TouchableOpacity onPress={handleDecrease} style={styles.quantityButton}>
//                     <Icon name="remove-circle-outline" size={26} color="#D32F2F" />
//                 </TouchableOpacity>
//                 <Text style={styles.quantityText}>{item.quantity}</Text>
//                 <TouchableOpacity onPress={handleIncrease} style={styles.quantityButton}>
//                     <Icon name="add-circle" size={26} color="#0CA201" />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };


// // ==========================================================
// // === THIS IS THE CORRECTED MAIN CartScreen COMPONENT    ===
// // ==========================================================
// const CartScreen = ({ navigation }) => {
//     const { cartItems, subtotal, totalBvInCart, isLoading, clearCart } = useCart();
//     const deliveryFee = cartItems.length > 0 ? 40.00 : 0;
//     const totalAmount = subtotal + deliveryFee;

//     // The problematic 'if' block has been removed from here.

//     // This function will decide what to show when the cart is empty.
//     const renderEmptyComponent = () => {
//         if (isLoading) {
//             // If the list is empty AND we are loading, show a spinner.
//             return (
//                 <View style={styles.centered}>
//                     <ActivityIndicator size="large" color="#0CA201" />
//                 </View>
//             );
//         }
//         // If the list is empty and not loading, show the empty message.
//         return (
//             <View style={styles.centered}>
//                 <Icon name="basket-outline" size={80} color="#e0e0e0" />
//                 <Text style={styles.emptyText}>Your basket is empty.</Text>
//                 <Text style={styles.emptySubText}>Add some products to get started!</Text>
//             </View>
//         );
//     };
    
//     return (
//         <SafeAreaView style={styles.container}>
//             <FlatList
//                 data={cartItems}
//                 renderItem={({ item }) => <CartItem item={item} />}
//                 keyExtractor={item => item.cart_item_id.toString()}
//                 ListHeaderComponent={() => (
//                     <View style={styles.headerContainer}>
//                          <Text style={styles.headerTitle}>My Basket</Text>
//                          {cartItems.length > 0 && (
//                              <TouchableOpacity onPress={clearCart}>
//                                  <Text style={styles.clearButtonText}>Clear All</Text>
//                              </TouchableOpacity>
//                          )}
//                     </View>
//                 )}
//                 // Use the new, smarter empty component.
//                 ListEmptyComponent={renderEmptyComponent}
//                 contentContainerStyle={{ flexGrow: 1 }}
//                 style={styles.listStyle}
//             />
//             {cartItems.length > 0 && (
//                 <View style={styles.summaryContainer}>
//                     <View style={styles.summaryRow}>
//                         <Text style={styles.summaryLabel}>Subtotal</Text>
//                         <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
//                     </View>
//                     <View style={styles.summaryRow}>
//                         <Text style={styles.summaryLabel}>Delivery Fee</Text>
//                         <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
//                     </View>
//                     <View style={styles.summaryRow}>
//                         <Text style={styles.summaryLabel}>Total Business Volume (BV)</Text>
//                         <Text style={styles.bvValue}>{totalBvInCart.toFixed(2)}</Text>
//                     </View>
//                     <View style={styles.totalRow}>
//                         <Text style={styles.totalLabel}>Total Amount</Text>
//                         <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
//                     </View>
                    
//                     <TouchableOpacity 
//                         style={styles.checkoutButton} 
//                         onPress={() => navigation.navigate('AddressList')}
//                     >
//                         <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
//                     </TouchableOpacity>
//                 </View>
//             )}
//         </SafeAreaView>
//     );
// };

// // ==========================================================
// // === STYLES ARE DEFINED ONCE AT THE END OF THE FILE     ===
// // ==========================================================
// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#fff' },
//     centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
//     emptyText: { fontSize: 18, fontWeight: '600', color: '#6c757d', marginTop: 20 },
//     emptySubText: { fontSize: 14, color: '#adb5bd', marginTop: 8 },
//     listStyle: { backgroundColor: '#f8f9fa' },
//     headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingTop: 20, paddingBottom: 10, backgroundColor: '#f8f9fa' },
//     headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#181725' },
//     clearButtonText: { color: '#D32F2F', fontSize: 14, fontWeight: '600' },
    
//     itemContainer: { flexDirection: 'row', backgroundColor: '#fff', marginBottom: 1, padding: 15, alignItems: 'center' },
//     itemImage: { width: 70, height: 70, borderRadius: 8, marginRight: 15, resizeMode: 'contain' },
//     itemDetails: { flex: 1 },
//     itemName: { fontSize: 16, fontWeight: '600', color: '#343a40' },
//     itemBrand: { fontSize: 14, color: '#6c757d', marginVertical: 2 },
//     itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#2a9d8f' },
//     bvText: { fontSize: 13, fontWeight: '500', color: '#007bff', marginTop: 4 },

//     quantityContainer: { flexDirection: 'row', alignItems: 'center', },
//     quantityButton: { padding: 5 },
//     quantityText: { fontSize: 18, fontWeight: '600', marginHorizontal: 10, minWidth: 25, textAlign: 'center' },
    
//     summaryContainer: { padding: 20, borderTopWidth: 1, borderTopColor: '#e9ecef', backgroundColor: '#fff', elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
//     summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
//     summaryLabel: { fontSize: 16, color: '#6c757d' },
//     summaryValue: { fontSize: 16, fontWeight: '500' },
//     bvValue: { fontSize: 16, fontWeight: 'bold', color: '#007bff' },
//     totalRow: { paddingTop: 12, borderTopWidth: 1, borderTopColor: '#e9ecef', marginTop: 5 },
//     totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#181725' },
//     totalValue: { fontSize: 18, fontWeight: 'bold', color: '#2a9d8f' },
    
//     checkoutButton: { backgroundColor: '#0CA201', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 15 },
//     checkoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
// });

// export default CartScreen;









// import React from 'react';
// import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { useCart } from '../context/CartContext';
// import Icon from 'react-native-vector-icons/Ionicons';

// // A single item in the cart list (NOW with availability logic)
// const CartItem = ({ item }) => {
//     const { updateQuantity, removeFromCart } = useCart();
    
//     // Determine if the item is available based on the new flag from the backend
//     const isAvailable = item.is_available;
    
//     const imageUrl = item.main_image_url ? `http://192.168.0.171:3000${item.main_image_url}` : 'https://via.placeholder.com/150';
//     const bvPerUnit = parseFloat(item.bv_earned || 0);
//     const totalBvForItem = bvPerUnit * item.quantity;

//     const handleDecrease = () => {
//         if (!isAvailable) return; // Do nothing if not available
//         const minQuantity = item.minimum_order_quantity || 1;
//         if (item.quantity <= minQuantity) {
//             removeFromCart(item.cart_item_id);
//         } else {
//             updateQuantity(item.cart_item_id, item.quantity - 1);
//         }
//     };
    
//     const handleIncrease = () => {
//         if (!isAvailable) return; // Do nothing if not available
//         updateQuantity(item.cart_item_id, item.quantity + 1);
//     };

//     return (
//         <View style={[styles.itemContainer, !isAvailable && styles.unavailableItemContainer]}>
//             <Image source={{ uri: imageUrl }} style={styles.itemImage} />
//             <View style={styles.itemDetails}>
//                 <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
//                 <Text style={styles.itemBrand}>{item.brand_name}</Text>
//                 <Text style={styles.itemPrice}>₹{parseFloat(item.selling_price).toFixed(2)}</Text>
//                 {isAvailable && totalBvForItem > 0 && (
//                     <Text style={styles.bvText}>Earn {totalBvForItem.toFixed(2)} BV</Text>
//                 )}
//             </View>
//             <View style={styles.quantityContainer}>
//                 <TouchableOpacity onPress={handleDecrease} style={styles.quantityButton}>
//                     <Icon name="remove-circle-outline" size={26} color={isAvailable ? "#D32F2F" : '#cccccc'} />
//                 </TouchableOpacity>
//                 <Text style={styles.quantityText}>{item.quantity}</Text>
//                 <TouchableOpacity onPress={handleIncrease} style={styles.quantityButton}>
//                     <Icon name="add-circle" size={26} color={isAvailable ? "#0CA201" : '#cccccc'} />
//                 </TouchableOpacity>
//             </View>

//             {/* This overlay shows a clear warning when an item is not available */}
//             {!isAvailable && (
//                 <View style={styles.unavailableOverlay}>
//                     <Text style={styles.unavailableText}>Not deliverable to current pincode</Text>
//                 </View>
//             )}
//         </View>
//     );
// };


// // The MAIN CartScreen COMPONENT
// const CartScreen = ({ navigation }) => {
//     const { cartItems, subtotal, totalBvInCart, isLoading, clearCart } = useCart();

//     const deliveryFee = subtotal > 0 ? 40.00 : 0;
//     const totalAmount = subtotal + deliveryFee;

//     // Determine if checkout should be disabled.
//     const isCheckoutDisabled = cartItems.some(item => !item.is_available) || subtotal === 0;

//     const renderEmptyComponent = () => {
//         if (isLoading) {
//             return <View style={styles.centered}><ActivityIndicator size="large" color="#0CA201" /></View>;
//         }
//         return (
//             <View style={styles.centered}>
//                 <Icon name="basket-outline" size={80} color="#e0e0e0" />
//                 <Text style={styles.emptyText}>Your basket is empty.</Text>
//                 <Text style={styles.emptySubText}>Add some products to get started!</Text>
//             </View>
//         );
//     };
    
//     return (
//         <SafeAreaView style={styles.container}>
//             <FlatList
//                 data={cartItems}
//                 renderItem={({ item }) => <CartItem item={item} />}
//                 keyExtractor={item => item.cart_item_id.toString()}
//                 ListHeaderComponent={() => (
//                     <View style={styles.headerContainer}>
//                          <Text style={styles.headerTitle}>My Basket</Text>
//                          {cartItems.length > 0 && (
//                              <TouchableOpacity onPress={clearCart}>
//                                  <Text style={styles.clearButtonText}>Clear All</Text>
//                              </TouchableOpacity>
//                          )}
//                     </View>
//                 )}
//                 ListEmptyComponent={renderEmptyComponent}
//                 contentContainerStyle={{ flexGrow: 1 }}
//                 style={styles.listStyle}
//             />
//             {cartItems.length > 0 && (
//                 <View style={styles.summaryContainer}>
//                     <View style={styles.summaryRow}>
//                         <Text style={styles.summaryLabel}>Subtotal (Available Items)</Text>
//                         <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
//                     </View>
//                     <View style={styles.summaryRow}>
//                         <Text style={styles.summaryLabel}>Delivery Fee</Text>
//                         <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
//                     </View>
//                     <View style={styles.summaryRow}>
//                         <Text style={styles.summaryLabel}>Total Business Volume (BV)</Text>
//                         <Text style={styles.bvValue}>{totalBvInCart.toFixed(2)}</Text>
//                     </View>
//                     <View style={styles.totalRow}>
//                         <Text style={styles.totalLabel}>Total Amount</Text>
//                         <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
//                     </View>
                    
//                     <TouchableOpacity 
//                         style={[styles.checkoutButton, isCheckoutDisabled && styles.checkoutButtonDisabled]}
//                         disabled={isCheckoutDisabled}
//                         onPress={() => navigation.navigate('AddressList')}
//                     >
//                         <Text style={styles.checkoutButtonText}>
//                             {isCheckoutDisabled && subtotal > 0 ? 'Fix Items Above' : 'Proceed to Checkout'}
//                         </Text>
//                     </TouchableOpacity>
//                 </View>
//             )}
//         </SafeAreaView>
//     );
// };

// // STYLES (with new styles for unavailable items)
// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#fff' },
//     centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
//     emptyText: { fontSize: 18, fontWeight: '600', color: '#6c757d', marginTop: 20 },
//     emptySubText: { fontSize: 14, color: '#adb5bd', marginTop: 8 },
//     listStyle: { backgroundColor: '#f8f9fa' },
//     headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingTop: 20, paddingBottom: 10, backgroundColor: '#f8f9fa' },
//     headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#181725' },
//     clearButtonText: { color: '#D32F2F', fontSize: 14, fontWeight: '600' },
    
//     itemContainer: { flexDirection: 'row', backgroundColor: '#fff', marginBottom: 1, padding: 15, alignItems: 'center' },
//     unavailableItemContainer: { backgroundColor: '#fff5f5' }, // Light red background for unavailable items
//     itemImage: { width: 70, height: 70, borderRadius: 8, marginRight: 15, resizeMode: 'contain' },
//     itemDetails: { flex: 1 },
//     itemName: { fontSize: 16, fontWeight: '600', color: '#343a40' },
//     itemBrand: { fontSize: 14, color: '#6c757d', marginVertical: 2 },
//     itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#2a9d8f' },
//     bvText: { fontSize: 13, fontWeight: '500', color: '#007bff', marginTop: 4 },

//     quantityContainer: { flexDirection: 'row', alignItems: 'center', },
//     quantityButton: { padding: 5 },
//     quantityText: { fontSize: 18, fontWeight: '600', marginHorizontal: 10, minWidth: 25, textAlign: 'center' },

//     unavailableOverlay: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(255, 245, 245, 0.6)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 10,
//     },
//     unavailableText: {
//         color: '#c81e1e',
//         fontWeight: 'bold',
//         fontSize: 13,
//         textAlign: 'center'
//     },
    
//     summaryContainer: { padding: 20, borderTopWidth: 1, borderTopColor: '#e9ecef', backgroundColor: '#fff', elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
//     summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
//     summaryLabel: { fontSize: 16, color: '#6c757d' },
//     summaryValue: { fontSize: 16, fontWeight: '500' },
//     bvValue: { fontSize: 16, fontWeight: 'bold', color: '#007bff' },
//     totalRow: { paddingTop: 12, borderTopWidth: 1, borderTopColor: '#e9ecef', marginTop: 5 },
//     totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#181725' },
//     totalValue: { fontSize: 18, fontWeight: 'bold', color: '#2a9d8f' },
    
//     checkoutButton: { backgroundColor: '#0CA201', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 15 },
//     checkoutButtonDisabled: { backgroundColor: '#a5d6a7' },
//     checkoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
// });

// export default CartScreen;












// import React from 'react';
// import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { useCart } from '../context/CartContext';
// import Icon from 'react-native-vector-icons/Ionicons';

// // --- DESIGN SYSTEM (for a consistent look and feel) ---
// const COLORS = {
//   primary: '#0CA201',
//   text: '#181725',
//   textLight: '#6c757d',
//   danger: '#D32F2F',
//   background: '#F8F9FA',
//   surface: '#FFFFFF',
//   border: '#E9ECEF',
//   disabled: '#CCCCCC',
//   unavailableBg: '#FFF5F5',
// };

// const SIZES = {
//   padding: 16,
//   radius: 12,
// };

// const FONTS = {
//   h1: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
//   h2: { fontSize: 16, fontWeight: '600', color: COLORS.text },
//   body: { fontSize: 14, color: COLORS.textLight },
//   price: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
// };

// // ==========================================================
// // === CartItem Component (Redesigned for Clarity)        ===
// // ==========================================================
// const CartItem = ({ item }) => {
//     const { 
//         updateQuantity, 
//         removeFromCart, 
//         toggleItemSelected,
//         selectedItemIds
//     } = useCart();
    
//     const isAvailable = item.is_available;
//     const isSelected = !!selectedItemIds[item.cart_item_id];

//     const imageUrl = item.main_image_url ? `http://192.168.0.171:3000${item.main_image_url}` : 'https://via.placeholder.com/150';

//     const handleDecrease = () => {
//         if (!isAvailable) return;
//         if (item.quantity <= 1) {
//             removeFromCart(item.cart_item_id);
//         } else {
//             updateQuantity(item.cart_item_id, item.quantity - 1);
//         }
//     };
    
//     const handleIncrease = () => {
//         if (!isAvailable) return;
//         updateQuantity(item.cart_item_id, item.quantity + 1);
//     };

//     return (
//         <View style={[styles.itemCard, !isAvailable && { opacity: 0.6 }]}>
//             <TouchableOpacity 
//                 onPress={() => toggleItemSelected(item.cart_item_id)}
//                 disabled={!isAvailable}
//                 style={styles.checkboxContainer}
//             >
//                 <Icon 
//                     name={isSelected ? 'checkbox' : 'square-outline'}
//                     size={26}
//                     color={isAvailable ? (isSelected ? COLORS.primary : COLORS.textLight) : COLORS.disabled}
//                 />
//             </TouchableOpacity>

//             <Image source={{ uri: imageUrl }} style={styles.itemImage} />
            
//             <View style={styles.itemDetails}>
//                 <View style={styles.itemInfo}>
//                     <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
//                     <Text style={styles.itemBrand}>{item.brand_name}</Text>
//                     {isAvailable &&
//                         <Text style={styles.bvText}>
//                             Earn {(parseFloat(item.bv_earned || 0) * item.quantity).toFixed(2)} BV
//                         </Text>
//                     }
//                 </View>

//                 {isAvailable ? (
//                     <View style={styles.itemActions}>
//                         <Text style={styles.itemPrice}>₹{parseFloat(item.selling_price).toFixed(2)}</Text>
//                         <View style={styles.quantityStepper}>
//                             <TouchableOpacity onPress={handleDecrease} style={styles.quantityButton}>
//                                 <Icon name="remove-circle" size={30} color={COLORS.danger} />
//                             </TouchableOpacity>
//                             <Text style={styles.quantityText}>{item.quantity}</Text>
//                             <TouchableOpacity onPress={handleIncrease} style={styles.quantityButton}>
//                                 <Icon name="add-circle" size={30} color={COLORS.primary} />
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 ) : (
//                     <View style={styles.unavailableContainer}>
//                         <Icon name="alert-circle-outline" size={18} color={COLORS.danger} />
//                         <Text style={styles.unavailableText}>Not deliverable to current pincode</Text>
//                     </View>
//                 )}
//             </View>
//             <TouchableOpacity onPress={() => removeFromCart(item.cart_item_id)} style={styles.deleteButton}>
//                 <Icon name="trash-outline" size={22} color={COLORS.textLight} />
//             </TouchableOpacity>
//         </View>
//     );
// };

// // ==========================================================
// // === Main CartScreen Component (No Logic Changes)       ===
// // ==========================================================
// const CartScreen = ({ navigation }) => {
//     const { cartItems, subtotal, totalBvInCart, isLoading, clearCart, selectedItemsForCheckout } = useCart();
//     const deliveryFee = subtotal > 0 ? 40.00 : 0;
//     const totalAmount = subtotal + deliveryFee;
//     const isCheckoutDisabled = selectedItemsForCheckout.length === 0;

//     const renderEmptyComponent = () => {
//         if (isLoading) {
//             return <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
//         }
//         return (
//             <View style={styles.centered}>
//                 <Icon name="basket-outline" size={80} color={COLORS.border} />
//                 <Text style={styles.emptyText}>Your basket is empty.</Text>
//                 <Text style={styles.emptySubText}>Add some products to get started!</Text>
//             </View>
//         );
//     };
    
//     return (
//         <SafeAreaView style={styles.container}>
//             <FlatList
//                 data={cartItems}
//                 renderItem={({ item }) => <CartItem item={item} />}
//                 keyExtractor={item => item.cart_item_id.toString()}
//                 ListHeaderComponent={() => (
//                     <View style={styles.headerContainer}>
//                          <Text style={FONTS.h1}>My Basket</Text>
//                          {cartItems.length > 0 && (
//                              <TouchableOpacity onPress={clearCart}>
//                                  <Text style={styles.clearButtonText}>Clear All</Text>
//                              </TouchableOpacity>
//                          )}
//                     </View>
//                 )}
//                 ListEmptyComponent={renderEmptyComponent}
//                 contentContainerStyle={{ flexGrow: 1 }}
//                 style={styles.listStyle}
//             />
//             {cartItems.length > 0 && (
//                 <View style={styles.summaryContainer}>
//                     <View style={styles.summaryRow}>
//                         <Text style={styles.summaryLabel}>Subtotal (Selected Items)</Text>
//                         <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
//                     </View>
//                     <View style={styles.summaryRow}>
//                         <Text style={styles.summaryLabel}>Delivery Fee</Text>
//                         <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
//                     </View>
//                     <View style={styles.summaryRow}>
//                         <Text style={styles.summaryLabel}>Total Business Volume (BV)</Text>
//                         <Text style={styles.bvValue}>{totalBvInCart.toFixed(2)}</Text>
//                     </View>
//                     <View style={styles.totalRow}>
//                         <Text style={styles.totalLabel}>Total Amount</Text>
//                         <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
//                     </View>
//                     <TouchableOpacity 
//                         style={[styles.checkoutButton, isCheckoutDisabled && styles.checkoutButtonDisabled]}
//                         disabled={isCheckoutDisabled}
//                         onPress={() => navigation.navigate('AddressList', { itemsForCheckout: selectedItemsForCheckout })}
//                     >
//                         <Text style={styles.checkoutButtonText}>
//                             {isCheckoutDisabled ? 'Select Items to Proceed' : `Checkout (${selectedItemsForCheckout.length} items)`}
//                         </Text>
//                     </TouchableOpacity>
//                 </View>
//             )}
//         </SafeAreaView>
//     );
// };

// // ==========================================================
// // === Styles (Completely Revamped for Production UI)     ===
// // ==========================================================
// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: COLORS.surface },
//     listStyle: { backgroundColor: COLORS.background },
//     centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
//     emptyText: { ...FONTS.h2, color: COLORS.textLight, marginTop: 20 },
//     emptySubText: { ...FONTS.body, marginTop: 8, textAlign: 'center' },
    
//     headerContainer: { 
//         flexDirection: 'row', 
//         justifyContent: 'space-between', 
//         alignItems: 'center', 
//         paddingHorizontal: SIZES.padding, 
//         paddingTop: 20, 
//         paddingBottom: 10, 
//         backgroundColor: COLORS.background 
//     },
//     clearButtonText: { color: COLORS.danger, fontSize: 14, fontWeight: '600' },
    
//     itemCard: {
//         flexDirection: 'row',
//         backgroundColor: COLORS.surface,
//         marginHorizontal: SIZES.padding,
//         marginVertical: 8,
//         borderRadius: SIZES.radius,
//         padding: 12,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//     },
//     checkboxContainer: {
//         justifyContent: 'center',
//         paddingRight: 10,
//     },
//     itemImage: { 
//         width: 70, 
//         height: 70, 
//         borderRadius: SIZES.radius - 4, 
//         resizeMode: 'contain',
//         backgroundColor: COLORS.background,
//     },
//     itemDetails: { 
//         flex: 1, 
//         marginLeft: 12,
//         justifyContent: 'space-between',
//     },
//     itemInfo: {
//         // Container for top part of details
//     },
//     itemName: { ...FONTS.h2, marginBottom: 2 },
//     itemBrand: { ...FONTS.body, fontSize: 12 },
//     bvText: { fontSize: 13, fontWeight: '500', color: '#007bff', marginTop: 4 },
    
//     itemActions: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginTop: 8,
//     },
//     itemPrice: { ...FONTS.price },
//     quantityStepper: { 
//         flexDirection: 'row', 
//         alignItems: 'center',
//     },
//     quantityButton: { paddingHorizontal: 6 },
//     quantityText: { 
//         ...FONTS.h2, 
//         fontSize: 18, 
//         marginHorizontal: 8,
//     },
//     deleteButton: { 
//         padding: 8,
//         position: 'absolute',
//         top: 4,
//         right: 4,
//     },
    
//     unavailableContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginTop: 8,
//         paddingVertical: 10,
//         backgroundColor: COLORS.unavailableBg,
//         borderRadius: SIZES.radius - 4,
//         paddingHorizontal: 10,
//     },
//     unavailableText: {
//         color: COLORS.danger,
//         fontWeight: '600',
//         fontSize: 12,
//         marginLeft: 8,
//     },
    
//     summaryContainer: { 
//         padding: SIZES.padding, 
//         backgroundColor: COLORS.surface, 
//         borderTopLeftRadius: SIZES.radius + 10,
//         borderTopRightRadius: SIZES.radius + 10,
//         elevation: 10, 
//         shadowColor: '#000', 
//         shadowOpacity: 0.1, 
//         shadowRadius: 10,
//         shadowOffset: { width: 0, height: -5 },
//         borderTopWidth: 1,
//         borderColor: COLORS.border,
//     },
//     summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
//     summaryLabel: { ...FONTS.body, fontSize: 16 },
//     summaryValue: { ...FONTS.h2, fontSize: 16 },
//     bvValue: { fontSize: 16, fontWeight: 'bold', color: '#007bff' },
//     totalRow: { 
//         paddingTop: 12, 
//         borderTopWidth: 1, 
//         borderTopColor: COLORS.border, 
//         marginTop: 5,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     totalLabel: { ...FONTS.h1, fontSize: 18 },
//     totalValue: { ...FONTS.h1, fontSize: 22, color: COLORS.primary },
    
//     checkoutButton: { 
//         backgroundColor: COLORS.primary, 
//         padding: 18, 
//         borderRadius: SIZES.radius, 
//         alignItems: 'center', 
//         marginTop: 15 
//     },
//     checkoutButtonDisabled: { backgroundColor: '#a5d6a7' },
//     checkoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
// });

// export default CartScreen;











import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useCart } from '../context/CartContext';
import Icon from 'react-native-vector-icons/Ionicons';

// --- DESIGN SYSTEM (for a consistent look and feel) ---
const COLORS = {
  primary: '#0CA201',
  text: '#181725',
  textLight: '#6c757d',
  danger: '#D32F2F',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  border: '#E9ECEF',
  disabled: '#CCCCCC',
  unavailableBg: '#FFF5F5',
};

const SIZES = {
  padding: 16,
  radius: 12,
};

const FONTS = {
  h1: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  h2: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  body: { fontSize: 14, color: COLORS.textLight },
  price: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
};

// ==========================================================
// === CartItem Component (Redesigned for Clarity)        ===
// ==========================================================
const CartItem = ({ item }) => {
    const { 
        updateQuantity, 
        removeFromCart, 
        toggleItemSelected,
        selectedItemIds
    } = useCart();
    
    const isAvailable = item.is_available;
    const isSelected = !!selectedItemIds[item.cart_item_id];

    const imageUrl = item.main_image_url ? `http://192.168.0.171:3000${item.main_image_url}` : 'https://via.placeholder.com/150';

    const handleDecrease = () => {
        if (!isAvailable) return;
        if (item.quantity <= 1) {
            removeFromCart(item.cart_item_id);
        } else {
            updateQuantity(item.cart_item_id, item.quantity - 1);
        }
    };
    
    const handleIncrease = () => {
        if (!isAvailable) return;
        updateQuantity(item.cart_item_id, item.quantity + 1);
    };

    return (
        <View style={[styles.itemCard, !isAvailable && { opacity: 0.6 }]}>
            <TouchableOpacity 
                onPress={() => toggleItemSelected(item.cart_item_id)}
                disabled={!isAvailable}
                style={styles.checkboxContainer}
            >
                <Icon 
                    name={isSelected ? 'checkbox' : 'square-outline'}
                    size={26}
                    color={isAvailable ? (isSelected ? COLORS.primary : COLORS.textLight) : COLORS.disabled}
                />
            </TouchableOpacity>

            <Image source={{ uri: imageUrl }} style={styles.itemImage} />
            
            <View style={styles.itemDetails}>
                <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.itemBrand}>{item.brand_name}</Text>
                    {isAvailable && 
                        <Text style={styles.bvText}>
                            Earn {(parseFloat(item.bv_earned || 0) * item.quantity).toFixed(2)} BV
                        </Text>
                    }
                </View>

                {isAvailable ? (
                    <View style={styles.itemActions}>
                        <Text style={styles.itemPrice}>₹{parseFloat(item.selling_price).toFixed(2)}</Text>
                        <View style={styles.quantityStepper}>
                            <TouchableOpacity onPress={handleDecrease} style={styles.quantityButton}>
                                <Icon name="remove-circle" size={30} color={COLORS.danger} />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{item.quantity}</Text>
                            <TouchableOpacity onPress={handleIncrease} style={styles.quantityButton}>
                                <Icon name="add-circle" size={30} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.unavailableContainer}>
                        <Icon name="alert-circle-outline" size={18} color={COLORS.danger} />
                        <Text style={styles.unavailableText}>Not deliverable to current pincode</Text>
                    </View>
                )}
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.cart_item_id)} style={styles.deleteButton}>
                <Icon name="trash-outline" size={22} color={COLORS.textLight} />
            </TouchableOpacity>
        </View>
    );
};

// ==========================================================
// === Main CartScreen Component (Uses Context Data)       ===
// ==========================================================
const CartScreen = ({ navigation }) => {
    const { 
        cartItems, 
        subtotal, 
        totalBvInCart, 
        isLoading, 
        clearCart, 
        selectedItemsForCheckout,
        deliveryFee,
        totalAmount
    } = useCart();
    
    const isCheckoutDisabled = selectedItemsForCheckout.length === 0;

    const renderEmptyComponent = () => {
        if (isLoading) {
            return <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
        }
        return (
            <View style={styles.centered}>
                <Icon name="basket-outline" size={80} color={COLORS.border} />
                <Text style={styles.emptyText}>Your basket is empty.</Text>
                <Text style={styles.emptySubText}>Add some products to get started!</Text>
            </View>
        );
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={cartItems}
                renderItem={({ item }) => <CartItem item={item} />}
                keyExtractor={item => item.cart_item_id.toString()}
                ListHeaderComponent={() => (
                    <View style={styles.headerContainer}>
                         <Text style={FONTS.h1}>My Basket</Text>
                         {cartItems.length > 0 && (
                             <TouchableOpacity onPress={clearCart}>
                                 <Text style={styles.clearButtonText}>Clear All</Text>
                             </TouchableOpacity>
                         )}
                    </View>
                )}
                ListEmptyComponent={renderEmptyComponent}
                contentContainerStyle={{ flexGrow: 1 }}
                style={styles.listStyle}
            />
            {cartItems.length > 0 && (
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal (Selected Items)</Text>
                        <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Delivery Fee</Text>
                        <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Business Volume (BV)</Text>
                        <Text style={styles.bvValue}>{totalBvInCart.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity 
                        style={[styles.checkoutButton, isCheckoutDisabled && styles.checkoutButtonDisabled]}
                        disabled={isCheckoutDisabled}
                        onPress={() => navigation.navigate('AddressList', { itemsForCheckout: selectedItemsForCheckout })}
                    >
                        <Text style={styles.checkoutButtonText}>
                            {isCheckoutDisabled ? 'Select Items to Proceed' : `Checkout (${selectedItemsForCheckout.length} items)`}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

// ==========================================================
// === Styles (Completely Revamped for Production UI)     ===
// ==========================================================
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.surface },
    listStyle: { backgroundColor: COLORS.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    emptyText: { ...FONTS.h2, color: COLORS.textLight, marginTop: 20 },
    emptySubText: { ...FONTS.body, marginTop: 8, textAlign: 'center' },
    
    headerContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: SIZES.padding, 
        paddingTop: 20, 
        paddingBottom: 10, 
        backgroundColor: COLORS.background 
    },
    clearButtonText: { color: COLORS.danger, fontSize: 14, fontWeight: '600' },
    
    itemCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        marginHorizontal: SIZES.padding,
        marginVertical: 8,
        borderRadius: SIZES.radius,
        padding: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    checkboxContainer: {
        justifyContent: 'center',
        paddingRight: 10,
    },
    itemImage: { 
        width: 70, 
        height: 70, 
        borderRadius: SIZES.radius - 4, 
        resizeMode: 'contain',
        backgroundColor: COLORS.background,
    },
    itemDetails: { 
        flex: 1, 
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    itemInfo: {
        // Container for top part of details
    },
    itemName: { ...FONTS.h2, marginBottom: 2 },
    itemBrand: { ...FONTS.body, fontSize: 12 },
    bvText: { fontSize: 13, fontWeight: '500', color: '#007bff', marginTop: 4 },
    
    itemActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    itemPrice: { ...FONTS.price },
    quantityStepper: { 
        flexDirection: 'row', 
        alignItems: 'center',
    },
    quantityButton: { paddingHorizontal: 6 },
    quantityText: { 
        ...FONTS.h2, 
        fontSize: 18, 
        marginHorizontal: 8,
    },
    deleteButton: { 
        padding: 8,
        position: 'absolute',
        top: 4,
        right: 4,
    },
    
    unavailableContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingVertical: 10,
        backgroundColor: COLORS.unavailableBg,
        borderRadius: SIZES.radius - 4,
        paddingHorizontal: 10,
    },
    unavailableText: {
        color: COLORS.danger,
        fontWeight: '600',
        fontSize: 12,
        marginLeft: 8,
    },
    
    summaryContainer: { 
        padding: SIZES.padding, 
        backgroundColor: COLORS.surface, 
        borderTopLeftRadius: SIZES.radius + 10,
        borderTopRightRadius: SIZES.radius + 10,
        elevation: 10, 
        shadowColor: '#000', 
        shadowOpacity: 0.1, 
        shadowRadius: 10,
        shadowOffset: { width: 0, height: -5 },
        borderTopWidth: 1,
        borderColor: COLORS.border,
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    summaryLabel: { ...FONTS.body, fontSize: 16 },
    summaryValue: { ...FONTS.h2, fontSize: 16 },
    bvValue: { fontSize: 16, fontWeight: 'bold', color: '#007bff' },
    totalRow: { 
        paddingTop: 12, 
        borderTopWidth: 1, 
        borderTopColor: COLORS.border, 
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: { ...FONTS.h1, fontSize: 18 },
    totalValue: { ...FONTS.h1, fontSize: 22, color: COLORS.primary },
    
    checkoutButton: { 
        backgroundColor: COLORS.primary, 
        padding: 18, 
        borderRadius: SIZES.radius, 
        alignItems: 'center', 
        marginTop: 15 
    },
    checkoutButtonDisabled: { backgroundColor: '#a5d6a7' },
    checkoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default CartScreen;