// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View, Text, StyleSheet, SafeAreaView, ScrollView, Image, FlatList,
//   TouchableOpacity, useWindowDimensions, ActivityIndicator
// } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import Swiper from 'react-native-swiper';
// import { useCart } from '../context/CartContext';
// import { mlmService } from '../services/mlmService';
// import { useAuth } from '../context/AuthContext'; // To get the user's pincode
// import ProductCard from '../components/ProductCard'; // We will reuse this!

// // --- MAIN PRODUCT DETAILS SCREEN (PROFESSIONAL REDESIGN) ---
// const ProductDetailsScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { width } = useWindowDimensions();
//   const { addToCart } = useCart();
//   const { user } = useAuth();
//   const { product } = route.params;

//   // --- State ---
//   const [quantity, setQuantity] = useState(parseInt(product.minimum_order_quantity, 10) || 1);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [isRelatedLoading, setIsRelatedLoading] = useState(true);

//   // --- Data & API ---
//   const sellingPrice = parseFloat(product.selling_price || 0);
//   const serverUrl = 'http://192.168.0.171:3000';
//   const imageUrls = [product.main_image_url, ...(product.gallery_image_urls || [])]
//     .filter(Boolean)
//     .map(url => `${serverUrl}${url}`);

//   useEffect(() => {
//     navigation.setOptions({
//         headerRight: () => (
//             <View style={styles.headerIcons}>
//                 <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
//                     <Icon name={isFavorite ? "heart" : "heart-outline"} size={26} color={isFavorite ? '#D32F2F' : '#333'} />
//                 </TouchableOpacity>
//                 <TouchableOpacity style={{marginLeft: 15}} onPress={() => { /* Share logic */ }}>
//                     <Icon name="share-social-outline" size={26} color="#333" />
//                 </TouchableOpacity>
//             </View>
//         )
//     });

//     const fetchRelated = async () => {
//         setIsRelatedLoading(true);
//         try {
//             const response = await mlmService.getRelatedProducts(product.product_id, user.pincode);
//             if (response.status) {
//                 setRelatedProducts(response.data || []);
//             }
//         } catch (e) {
//             console.error("Failed to load related products", e);
//         } finally {
//             setIsRelatedLoading(false);
//         }
//     };
//     fetchRelated();
//   }, [navigation, isFavorite, product.product_id, user.pincode]);

//   // --- Handlers ---
//   const handleAddToCart = () => {
//     addToCart(product, quantity);
//     navigation.goBack();
//   };
//   const handleBuyNow = () => {
//     addToCart(product, quantity);
//     navigation.navigate('AppTabs', { screen: 'Cart' });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         <View style={styles.galleryContainer}>
//             <Swiper loop={false} showsButtons={false} dotColor="#ddd" activeDotColor="#0CA201">
//                 {imageUrls.map((url, index) => (
//                     <Image source={{ uri: url }} style={styles.productImage} resizeMode="contain" key={index} />
//                 ))}
//             </Swiper>
//         </View>

//         <View style={styles.card}>
//             <Text style={styles.brandText}>{product.brand_name}</Text>
//             <Text style={styles.nameText}>{product.name}</Text>
//             <Text style={styles.weightText}>{product.attributes?.find(a => a.attribute_name.toLowerCase() === 'net_weight')?.value}</Text>
//             <View style={styles.priceRow}>
//                 <Text style={styles.sellingPrice}>₹{sellingPrice.toFixed(2)}</Text>
//                 {product.mrp > sellingPrice && <Text style={styles.mrp}>₹{parseFloat(product.mrp).toFixed(2)}</Text>}
//                 {product.mrp > sellingPrice && <Text style={styles.discountText}>{Math.round(((product.mrp - sellingPrice) / product.mrp) * 100)}% OFF</Text>}
//             </View>
//             <Text style={styles.bvText}>Earn {parseFloat(product.bv_earned || 0).toFixed(2)} BV on this purchase</Text>
//         </View>

//         <View style={styles.card}>
//             <Text style={styles.sectionTitle}>Quantity</Text>
//             <View style={styles.quantitySelector}>
//                 <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(q => Math.max(1, q - 1))}>
//                     <Icon name="remove" size={24} color="#555" />
//                 </TouchableOpacity>
//                 <Text style={styles.quantityValue}>{quantity}</Text>
//                 <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(q => q + 1)}>
//                     <Icon name="add" size={24} color="#555" />
//                 </TouchableOpacity>
//             </View>
//         </View>

//         <View style={styles.card}>
//             <Text style={styles.sectionTitle}>Description</Text>
//             <Text style={styles.descriptionText}>{product.description || "No details available."}</Text>
//         </View>
        
//         {isRelatedLoading ? (
//             <ActivityIndicator size="large" color="#0CA201" style={{marginTop: 30}}/>
//         ) : (
//             relatedProducts.length > 0 && (
//                 <View style={styles.relatedSection}>
//                     <Text style={styles.relatedTitle}>You Might Also Like</Text>
//                     <FlatList
//                         data={relatedProducts}
//                         keyExtractor={(item) => item.offer_id.toString()}
//                         renderItem={({ item }) => (
//                             <View style={styles.relatedCardWrapper}>
//                                 <ProductCard product={item} onPress={() => navigation.push('ProductDetails', { product: item })} />
//                             </View>
//                         )}
//                         horizontal
//                         showsHorizontalScrollIndicator={false}
//                         contentContainerStyle={styles.relatedListContent}
//                     />
//                 </View>
//             )
//         )}
//       </ScrollView>

//       <View style={styles.bottomBar}>
//         <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
//             <Text style={styles.cartButtonText}>Add to Cart</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
//             <Text style={styles.buyButtonText}>Buy Now</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#F4F5F9' },
//     scrollContent: { paddingBottom: 100 },
//     headerIcons: { flexDirection: 'row', marginRight: 15 },
    
//     // --- Gallery ---
//     galleryContainer: { height: 350, backgroundColor: '#fff' },
//     productImage: { flex: 1, width: '100%' },

//     // --- Cards ---
//     card: { backgroundColor: '#fff', padding: 20, marginTop: 10 },
//     sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
    
//     // --- Info Card ---
//     brandText: { fontSize: 16, color: '#666', marginBottom: 5 },
//     nameText: { fontSize: 22, fontWeight: '700', color: '#222', marginBottom: 5 },
//     weightText: { fontSize: 16, color: '#666', marginBottom: 15 },
//     priceRow: { flexDirection: 'row', alignItems: 'center' },
//     sellingPrice: { fontSize: 24, fontWeight: 'bold', color: '#111' },
//     mrp: { fontSize: 16, color: '#aaa', textDecorationLine: 'line-through', marginLeft: 10 },
//     discountText: { fontSize: 14, fontWeight: 'bold', color: '#D32F2F', backgroundColor: '#ffeeee', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 10 },
//     bvText: { fontSize: 14, color: '#007bff', marginTop: 8 },

//     // --- Quantity Card ---
//     quantitySelector: {
//         flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
//         borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginTop: 10
//     },
//     quantityButton: { padding: 12 },
//     quantityValue: { fontSize: 18, fontWeight: '600', color: '#222', marginHorizontal: 15 },

//     // --- Description Card ---
//     descriptionText: { fontSize: 15, color: '#555', lineHeight: 24, marginTop: 10 },

//     // --- Related Products ---
//     relatedSection: { marginTop: 10 },
//     relatedTitle: { fontSize: 18, fontWeight: 'bold', color: '#111', paddingHorizontal: 20, marginBottom: 15 },
//     relatedListContent: { paddingHorizontal: 15 },
//     relatedCardWrapper: { width: 160, marginRight: 0 },
    
//     // --- Bottom Bar ---
//     bottomBar: {
//         position: 'absolute', bottom: 0, left: 0, right: 0,
//         flexDirection: 'row', height: 85,
//         borderTopWidth: 1, borderTopColor: '#eee',
//         backgroundColor: '#fff'
//     },
//     cartButton: {
//         flex: 1, alignItems: 'center', justifyContent: 'center',
//         backgroundColor: '#FFF1E6'
//     },
//     cartButtonText: {
//         color: '#FF6F00', fontWeight: 'bold', fontSize: 16
//     },
//     buyButton: {
//         flex: 1, alignItems: 'center', justifyContent: 'center',
//         backgroundColor: '#0CA201'
//     },
//     buyButtonText: {
//         color: '#fff', fontWeight: 'bold', fontSize: 16
//     }
// });

// export default ProductDetailsScreen;





// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, StyleSheet, SafeAreaView, ScrollView, Image, FlatList,
//   TouchableOpacity, useWindowDimensions, ActivityIndicator
// } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import Swiper from 'react-native-swiper';
// import { useCart } from '../context/CartContext';
// import { mlmService } from '../services/mlmService';
// import ProductCard from '../components/ProductCard'; 
// import { usePincode } from '../context/PincodeContext'; // <-- 1. IMPORT the correct hook

// // --- MAIN PRODUCT DETAILS SCREEN (PROFESSIONAL REDESIGN) ---
// const ProductDetailsScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { width } = useWindowDimensions();
//   const { addToCart } = useCart();
//   const { pincode } = usePincode(); // <-- 2. USE the global PincodeContext
//   const { product } = route.params;

//   // --- State ---
//   const [quantity, setQuantity] = useState(parseInt(product.minimum_order_quantity, 10) || 1);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [isRelatedLoading, setIsRelatedLoading] = useState(true);

//   // --- Data & API ---
//   const sellingPrice = parseFloat(product.selling_price || 0);
//   const serverUrl = 'http://192.168.0.171:3000';
//   const imageUrls = [product.main_image_url, ...(product.gallery_image_urls || [])]
//     .filter(Boolean)
//     .map(url => `${serverUrl}${url}`);

//   useEffect(() => {
//     navigation.setOptions({
//         headerRight: () => (
//             <View style={styles.headerIcons}>
//                 <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
//                     <Icon name={isFavorite ? "heart" : "heart-outline"} size={26} color={isFavorite ? '#D32F2F' : '#333'} />
//                 </TouchableOpacity>
//                 <TouchableOpacity style={{marginLeft: 15}} onPress={() => { /* Share logic */ }}>
//                     <Icon name="share-social-outline" size={26} color="#333" />
//                 </TouchableOpacity>
//             </View>
//         )
//     });

//     const fetchRelated = async () => {
//         setIsRelatedLoading(true);
//         try {
//             // <-- 3. USE the global pincode in the API call
//             const response = await mlmService.getRelatedProducts(product.product_id, pincode);
//             if (response.status) {
//                 setRelatedProducts(response.data || []);
//             }
//         } catch (e) {
//             console.error("Failed to load related products", e);
//         } finally {
//             setIsRelatedLoading(false);
//         }
//     };

//     // <-- 4. ADD a guard to only fetch if we have a pincode
//     if (pincode) {
//         fetchRelated();
//     } else {
//         console.log("No pincode available to fetch related products.");
//         setIsRelatedLoading(false); // Stop loading if there's no pincode
//     }
  
//   // <-- 5. UPDATE the dependency array
//   }, [navigation, isFavorite, product.product_id, pincode]);

//   // --- Handlers ---
//   const handleAddToCart = () => {
//     addToCart(product, quantity);
//     navigation.goBack();
//   };
//   const handleBuyNow = () => {
//     addToCart(product, quantity);
//     navigation.navigate('AppTabs', { screen: 'Cart' });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         <View style={styles.galleryContainer}>
//             <Swiper loop={false} showsButtons={false} dotColor="#ddd" activeDotColor="#0CA201">
//                 {imageUrls.map((url, index) => (
//                     <Image source={{ uri: url }} style={styles.productImage} resizeMode="contain" key={index} />
//                 ))}
//             </Swiper>
//         </View>

//         <View style={styles.card}>
//             <Text style={styles.brandText}>{product.brand_name}</Text>
//             <Text style={styles.nameText}>{product.name}</Text>
//             <Text style={styles.weightText}>{product.attributes?.find(a => a.attribute_name.toLowerCase() === 'net_weight')?.value}</Text>
//             <View style={styles.priceRow}>
//                 <Text style={styles.sellingPrice}>₹{sellingPrice.toFixed(2)}</Text>
//                 {product.mrp > sellingPrice && <Text style={styles.mrp}>₹{parseFloat(product.mrp).toFixed(2)}</Text>}
//                 {product.mrp > sellingPrice && <Text style={styles.discountText}>{Math.round(((product.mrp - sellingPrice) / product.mrp) * 100)}% OFF</Text>}
//             </View>
//             <Text style={styles.bvText}>Earn {parseFloat(product.bv_earned || 0).toFixed(2)} BV on this purchase</Text>
//         </View>

//         <View style={styles.card}>
//             <Text style={styles.sectionTitle}>Quantity</Text>
//             <View style={styles.quantitySelector}>
//                 <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(q => Math.max(1, q - 1))}>
//                     <Icon name="remove" size={24} color="#555" />
//                 </TouchableOpacity>
//                 <Text style={styles.quantityValue}>{quantity}</Text>
//                 <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(q => q + 1)}>
//                     <Icon name="add" size={24} color="#555" />
//                 </TouchableOpacity>
//             </View>
//         </View>

//         <View style={styles.card}>
//             <Text style={styles.sectionTitle}>Description</Text>
//             <Text style={styles.descriptionText}>{product.description || "No details available."}</Text>
//         </View>
        
//         {isRelatedLoading ? (
//             <ActivityIndicator size="large" color="#0CA201" style={{marginTop: 30}}/>
//         ) : (
//             relatedProducts.length > 0 && (
//                 <View style={styles.relatedSection}>
//                     <Text style={styles.relatedTitle}>You Might Also Like</Text>
//                     <FlatList
//                         data={relatedProducts}
//                         keyExtractor={(item) => item.offer_id.toString()}
//                         renderItem={({ item }) => (
//                             <View style={styles.relatedCardWrapper}>
//                                 <ProductCard product={item} onPress={() => navigation.push('ProductDetails', { product: item })} />
//                             </View>
//                         )}
//                         horizontal
//                         showsHorizontalScrollIndicator={false}
//                         contentContainerStyle={styles.relatedListContent}
//                     />
//                 </View>
//             )
//         )}
//       </ScrollView>

//       <View style={styles.bottomBar}>
//         <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
//             <Text style={styles.cartButtonText}>Add to Cart</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
//             <Text style={styles.buyButtonText}>Buy Now</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// // --- STYLES (No changes needed here) ---
// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#F4F5F9' },
//     scrollContent: { paddingBottom: 100 },
//     headerIcons: { flexDirection: 'row', marginRight: 15 },
//     galleryContainer: { height: 350, backgroundColor: '#fff' },
//     productImage: { flex: 1, width: '100%' },
//     card: { backgroundColor: '#fff', padding: 20, marginTop: 10 },
//     sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
//     brandText: { fontSize: 16, color: '#666', marginBottom: 5 },
//     nameText: { fontSize: 22, fontWeight: '700', color: '#222', marginBottom: 5 },
//     weightText: { fontSize: 16, color: '#666', marginBottom: 15 },
//     priceRow: { flexDirection: 'row', alignItems: 'center' },
//     sellingPrice: { fontSize: 24, fontWeight: 'bold', color: '#111' },
//     mrp: { fontSize: 16, color: '#aaa', textDecorationLine: 'line-through', marginLeft: 10 },
//     discountText: { fontSize: 14, fontWeight: 'bold', color: '#D32F2F', backgroundColor: '#ffeeee', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 10 },
//     bvText: { fontSize: 14, color: '#007bff', marginTop: 8 },
//     quantitySelector: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginTop: 10 },
//     quantityButton: { padding: 12 },
//     quantityValue: { fontSize: 18, fontWeight: '600', color: '#222', marginHorizontal: 15 },
//     descriptionText: { fontSize: 15, color: '#555', lineHeight: 24, marginTop: 10 },
//     relatedSection: { marginTop: 10 },
//     relatedTitle: { fontSize: 18, fontWeight: 'bold', color: '#111', paddingHorizontal: 20, marginBottom: 15 },
//     relatedListContent: { paddingHorizontal: 15 },
//     relatedCardWrapper: { width: 160, marginRight: 0 },
//     bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', height: 85, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff' },
//     cartButton: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1E6' },
//     cartButtonText: { color: '#FF6F00', fontWeight: 'bold', fontSize: 16 },
//     buyButton: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0CA201' },
//     buyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
// });

// export default ProductDetailsScreen;










// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, StyleSheet, SafeAreaView, ScrollView, Image, FlatList,
//   TouchableOpacity, useWindowDimensions, ActivityIndicator, Alert // --- IMPORT Alert ---
// } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import Swiper from 'react-native-swiper';
// import { useCart } from '../context/CartContext';
// import { mlmService } from '../services/mlmService';
// import { usePincode } from '../context/PincodeContext';
// import ProductCard from '../components/ProductCard'; 

// // --- DESIGN SYSTEM ---
// const COLORS = {
//   primary: '#059669',
//   primaryDark: '#064E3B',
//   white: '#FFFFFF',
//   text: '#1F2937',
//   textLight: '#6B7280',
//   textMuted: '#9CA3AF',
//   background: '#F9FAFB',
//   surface: '#FFFFFF',
//   border: '#E5E7EB',
//   danger: '#EF4444',
// };

// const SIZES = {
//   padding: 20,
//   radius: 12,
//   base: 8,
// };

// const FONTS = {
//   h1: { fontSize: 22, fontWeight: '700', color: COLORS.text },
//   h2: { fontSize: 18, fontWeight: '600', color: COLORS.text },
//   body: { fontSize: 14, color: COLORS.textLight, lineHeight: 22 },
// };

// // --- SUB-COMPONENTS ---
// const QuantityStepper = ({ quantity, setQuantity, minOrderQty }) => (
//   <View style={styles.quantityStepper}>
//     <TouchableOpacity 
//       style={styles.stepperButton} 
//       onPress={() => setQuantity(q => Math.max(minOrderQty, q - 1))}
//     >
//       <Icon name="remove" size={20} color={COLORS.primary} />
//     </TouchableOpacity>
//     <Text style={styles.quantityText}>{quantity}</Text>
//     <TouchableOpacity style={styles.stepperButton} onPress={() => setQuantity(q => q + 1)}>
//       <Icon name="add" size={20} color={COLORS.primary} />
//     </TouchableOpacity>
//   </View>
// );

// const AccordionSection = ({ title, children }) => {
//   const [isOpen, setIsOpen] = useState(true);
//   return (
//     <View style={styles.accordionContainer}>
//       <TouchableOpacity style={styles.accordionHeader} onPress={() => setIsOpen(!isOpen)}>
//         <Text style={styles.accordionTitle}>{title}</Text>
//         <Icon name={isOpen ? "chevron-down" : "chevron-forward"} size={20} color={COLORS.text} />
//       </TouchableOpacity>
//       {isOpen && <Text style={styles.accordionContent}>{children}</Text>}
//     </View>
//   );
// };

// // --- MAIN PRODUCT DETAILS SCREEN (FULLY FUNCTIONAL) ---
// const ProductDetailsScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { addToCart } = useCart();
//   const { pincode } = usePincode();
//   const { product } = route.params;

//   // --- YOUR CORE LOGIC (PRESERVED) ---
//   const minOrderQty = parseInt(product.minimum_order_quantity, 10) || 1;
//   const [quantity, setQuantity] = useState(minOrderQty);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [isRelatedLoading, setIsRelatedLoading] = useState(true);

//   const sellingPrice = parseFloat(product.selling_price || 0);
//   const mrp = parseFloat(product.mrp || 0);
//   const discount = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

//   const serverUrl = 'http://192.168.0.171:3000';
//   const imageUrls = [product.main_image_url, ...(product.gallery_image_urls || [])]
//     .filter(Boolean)
//     .map(url => `${serverUrl}${url}`);

//   useEffect(() => {
//     navigation.setOptions({
//         headerTitle: product.name,
//         headerRight: () => (
//              <View style={styles.navHeaderIcons}>
//                 <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
//                     <Icon name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? COLORS.danger : COLORS.text} />
//                 </TouchableOpacity>
//                 <TouchableOpacity style={{marginLeft: 15}} onPress={() => { /* Share logic */ }}>
//                     <Icon name="share-social-outline" size={24} color={COLORS.text} />
//                 </TouchableOpacity>
//             </View>
//         )
//     });

//     const fetchRelated = async () => {
//       setIsRelatedLoading(true);
//       try {
//         const response = await mlmService.getRelatedProducts(product.product_id, pincode);
//         if (response.status) setRelatedProducts(response.data || []);
//       } catch (e) { console.error("Failed to load related products", e); } 
//       finally { setIsRelatedLoading(false); }
//     };
//     if (pincode) fetchRelated();
//     else setIsRelatedLoading(false);
//   }, [product.product_id, pincode, product.name, navigation, isFavorite]);

//   // ===============================================
//   // === ACTION HANDLERS WITH USER FEEDBACK      ===
//   // ===============================================
//   const handleAddToCart = () => {
//     addToCart(product, quantity);
//     // Provide immediate feedback to the user
//     Alert.alert(
//       'Success',
//       `${quantity} x ${product.name} has been added to your basket.`
//     );
//   };
  
//   const handleBuyNow = () => {
//     addToCart(product, quantity);
//     navigation.navigate('AppTabs', { screen: 'Cart' });
//   };
//   // ===============================================
  

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         {/* Gallery */}
//         <View style={styles.galleryContainer}>
//             <Image source={{ uri: imageUrls[0] }} style={styles.productImage} resizeMode="contain" />
//         </View>

//         {/* Main Info Section */}
//         <View style={styles.mainInfoContainer}>
//           <Text style={styles.brandName}>{product.brand_name || 'Brand'}</Text>
//           <View style={styles.titleRow}>
//             <Text style={styles.productName}>{product.name || 'Product Name'}</Text>
//             <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
//               <Icon name={isFavorite ? "heart" : "heart-outline"} size={26} color={isFavorite ? COLORS.danger : COLORS.textLight} />
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.productMeta}>{product.attributes?.find(a => a.attribute_name.toLowerCase() === 'net_weight')?.value || '1kg'}, Price</Text>
          
//           <View style={styles.pricingRow}>
//             <QuantityStepper quantity={quantity} setQuantity={setQuantity} minOrderQty={minOrderQty} />
//             <View style={styles.priceContainer}>
//               <Text style={styles.productPrice}>₹{sellingPrice.toFixed(2)}</Text>
//               {mrp > sellingPrice && (
//                 <View style={styles.mrpContainer}>
//                   <Text style={styles.mrpText}>₹{mrp.toFixed(2)}</Text>
//                   <Text style={styles.discountText}>{discount}% OFF</Text>
//                 </View>
//               )}
//             </View>
//           </View>

//           <Text style={styles.bvText}>You will earn {parseFloat(product.bv_earned || 0).toFixed(2)} BV on this purchase</Text>
//         </View>

//         {/* Details Section */}
//         <View style={styles.detailsContainer}>
//           <AccordionSection title="Product Detail">
//             {product.description || "No details available."}
//           </AccordionSection>
//         </View>
        
//         {/* Related Products Section */}
//         {isRelatedLoading ? (
//             <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }}/>
//         ) : (
//             relatedProducts.length > 0 && (
//                 <View style={styles.relatedSection}>
//                     <Text style={styles.relatedTitle}>You Might Also Like</Text>
//                     <FlatList
//                         data={relatedProducts}
//                         keyExtractor={(item) => item.offer_id.toString()}
//                         renderItem={({ item }) => (
//                             <ProductCard product={item} onPress={() => navigation.push('ProductDetails', { product: item })} />
//                         )}
//                         horizontal
//                         showsHorizontalScrollIndicator={false}
//                         contentContainerStyle={styles.relatedListContent}
//                     />
//                 </View>
//             )
//         )}
//       </ScrollView>

//       {/* 
//         =======================================================
//         === THE FUNCTIONALITY FIX IS HERE                   ===
//         =======================================================
//         The onPress props are now correctly connected to your handlers.
//       */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity style={[styles.bottomButton, styles.buyNowButton]} onPress={handleBuyNow}>
//           <Text style={[styles.bottomButtonText, styles.buyNowText]}>Buy Now</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.bottomButton, styles.addToCartButton]} onPress={handleAddToCart}>
//           <Text style={[styles.bottomButtonText, styles.addToCartText]}>Add To Basket</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// // --- STYLES (Unchanged) ---
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.surface },
//   scrollContent: { paddingBottom: 120 },
//   navHeaderIcons: {
//     flexDirection: 'row',
//   },
//   galleryContainer: {
//     height: 300,
//     backgroundColor: COLORS.surface,
//     padding: SIZES.base,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border
//   },
//   productImage: {
//     width: '100%',
//     height: '100%',
//   },
//   mainInfoContainer: { 
//     padding: SIZES.padding, 
//     backgroundColor: COLORS.surface,
//     borderBottomWidth: 6,
//     borderBottomColor: COLORS.background,
//   },
//   brandName: { ...FONTS.body, color: COLORS.textLight, fontWeight: '600', marginBottom: 4 },
//   titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
//   productName: { ...FONTS.h1, flex: 1, marginRight: SIZES.padding },
//   productMeta: { ...FONTS.body, fontSize: 16, color: COLORS.textLight, marginTop: 4, marginBottom: SIZES.padding },
//   pricingRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center', 
//     marginTop: SIZES.padding / 2 
//   },
//   priceContainer: {
//     alignItems: 'flex-end',
//   },
//   productPrice: { 
//     ...FONTS.h1, 
//     color: COLORS.text 
//   },
//   mrpContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: SIZES.base,
//   },
//   mrpText: { 
//     ...FONTS.body, 
//     color: COLORS.textMuted, 
//     textDecorationLine: 'line-through' 
//   },
//   discountText: { 
//     ...FONTS.body, 
//     color: COLORS.primary, 
//     fontWeight: 'bold', 
//     fontSize: 12
//   },
//   bvText: { 
//     ...FONTS.body, 
//     color: COLORS.primary, 
//     fontWeight: '600', 
//     marginTop: SIZES.padding,
//   },
//   quantityStepper: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     backgroundColor: COLORS.background, 
//     borderRadius: SIZES.radius 
//   },
//   stepperButton: { 
//     padding: SIZES.padding / 1.5 
//   },
//   quantityText: { 
//     ...FONTS.h2, 
//     fontSize: 18, 
//     marginHorizontal: SIZES.padding 
//   },
//   detailsContainer: { 
//     paddingHorizontal: SIZES.padding, 
//     backgroundColor: COLORS.surface,
//   },
//   accordionContainer: { 
//     paddingVertical: SIZES.padding / 2, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.border,
//   },
//   accordionHeader: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center', 
//     paddingVertical: SIZES.padding / 2,
//   },
//   accordionTitle: { 
//     ...FONTS.h2, 
//     fontSize: 16 
//   },
//   accordionContent: { 
//     ...FONTS.body, 
//     paddingTop: SIZES.padding / 4,
//     paddingBottom: SIZES.padding / 2,
//   },
//   relatedSection: { 
//     backgroundColor: COLORS.surface, 
//     paddingTop: SIZES.padding, 
//     paddingBottom: SIZES.padding*2 
//   },
//   relatedTitle: { 
//     ...FONTS.h2, 
//     paddingHorizontal: SIZES.padding, 
//     marginBottom: SIZES.base 
//   },
//   relatedListContent: { 
//     paddingHorizontal: SIZES.padding 
//   },
//   bottomBar: { 
//     position: 'absolute', 
//     bottom: 0, left: 0, right: 0, 
//     flexDirection: 'row', 
//     height: 90, 
//     padding: SIZES.padding, 
//     backgroundColor: COLORS.surface, 
//     borderTopWidth: 1, 
//     borderTopColor: COLORS.border, 
//     gap: SIZES.padding / 2 
//   },
//   bottomButton: { 
//     flex: 1, 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     borderRadius: SIZES.radius 
//   },
//   addToCartButton: { 
//     backgroundColor: COLORS.primary 
//   },
//   buyNowButton: { 
//     borderWidth: 1.5, 
//     borderColor: COLORS.primary 
//   },
//   bottomButtonText: { 
//     ...FONTS.h2, 
//     fontSize: 16 
//   },
//   addToCartText: { 
//     color: COLORS.white 
//   },
//   buyNowText: { 
//     color: COLORS.primary 
//   }
// });

// export default ProductDetailsScreen;















// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, StyleSheet, SafeAreaView, ScrollView, Image, FlatList,
//   TouchableOpacity, useWindowDimensions, ActivityIndicator
// } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useCart } from '../context/CartContext';
// import { mlmService } from '../services/mlmService';
// import { usePincode } from '../context/PincodeContext';
// import ProductCard from '../components/ProductCard'; 
// import FloatingCartBar from '../components/FloatingCartBar'; // --- IMPORT THE BAR ---

// // --- DESIGN SYSTEM (unchanged) ---
// const COLORS = {
//   primary: '#059669', primaryDark: '#064E3B', white: '#FFFFFF', text: '#1F2937',
//   textLight: '#6B7280', textMuted: '#9CA3AF', background: '#F9FAFB', surface: '#FFFFFF',
//   border: '#E5E7EB', danger: '#EF4444', star: '#F59E0B',
// };
// const SIZES = { padding: 20, radius: 12, base: 8 };
// const FONTS = {
//   h1: { fontSize: 22, fontWeight: '700', color: COLORS.text },
//   h2: { fontSize: 18, fontWeight: '600', color: COLORS.text },
//   body: { fontSize: 14, color: COLORS.textLight, lineHeight: 22 },
// };

// // --- SUB-COMPONENTS (unchanged) ---
// const QuantityStepper = ({ quantity, setQuantity, minOrderQty }) => (
//   <View style={styles.quantityStepper}>
//     <TouchableOpacity style={styles.stepperButton} onPress={() => setQuantity(q => Math.max(minOrderQty, q - 1))}>
//       <Icon name="remove" size={20} color={COLORS.primary} />
//     </TouchableOpacity>
//     <Text style={styles.quantityText}>{quantity}</Text>
//     <TouchableOpacity style={styles.stepperButton} onPress={() => setQuantity(q => q + 1)}>
//       <Icon name="add" size={20} color={COLORS.primary} />
//     </TouchableOpacity>
//   </View>
// );
// const AccordionSection = ({ title, children }) => {
//   const [isOpen, setIsOpen] = useState(true);
//   return (
//     <View style={styles.accordionContainer}>
//       <TouchableOpacity style={styles.accordionHeader} onPress={() => setIsOpen(!isOpen)}>
//         <Text style={styles.accordionTitle}>{title}</Text>
//         <Icon name={isOpen ? "chevron-down" : "chevron-forward"} size={20} color={COLORS.text} />
//       </TouchableOpacity>
//       {isOpen && <Text style={styles.accordionContent}>{children}</Text>}
//     </View>
//   );
// };


// // --- MAIN PRODUCT DETAILS SCREEN (FINAL VERSION) ---
// const ProductDetailsScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { addToCart } = useCart();
//   const { pincode } = usePincode();
//   const { product } = route.params;

//   // --- LOGIC (with the new state for the bar) ---
//   const minOrderQty = parseInt(product.minimum_order_quantity, 10) || 1;
//   const [quantity, setQuantity] = useState(minOrderQty);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [isRelatedLoading, setIsRelatedLoading] = useState(true);

//   // ===============================================
//   // === THE NEW STATE TO CONTROL THE BAR        ===
//   // ===============================================
//   const [isCartBarVisible, setIsCartBarVisible] = useState(false);

//   const sellingPrice = parseFloat(product.selling_price || 0);
//   const mrp = parseFloat(product.mrp || 0);
//   const discount = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
//   const serverUrl = 'http://192.168.0.171:3000';
//   const imageUrls = [product.main_image_url, ...(product.gallery_image_urls || [])]
//     .filter(Boolean)
//     .map(url => `${serverUrl}${url}`);

//   useEffect(() => {
//     navigation.setOptions({
//         headerTitle: product.name,
//         headerRight: () => (
//              <View style={styles.navHeaderIcons}>
//                 <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
//                     <Icon name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? COLORS.danger : COLORS.text} />
//                 </TouchableOpacity>
//                 <TouchableOpacity style={{marginLeft: 15}} onPress={() => { /* Share logic */ }}>
//                     <Icon name="share-social-outline" size={24} color={COLORS.text} />
//                 </TouchableOpacity>
//             </View>
//         )
//     });
//     const fetchRelated = async () => { /* ... unchanged ... */ };
//     if (pincode) fetchRelated(); else setIsRelatedLoading(false);
//   }, [product.product_id, pincode, product.name, navigation, isFavorite]);

//   // ===============================================
//   // === THE HANDLER THAT SHOWS THE BAR          ===
//   // ===============================================
//   const handleAddToCart = () => {
//     addToCart(product, quantity);
//     setIsCartBarVisible(true); // Show the bar
//     // Optional: Hide the bar after a few seconds
//     setTimeout(() => {
//       setIsCartBarVisible(false);
//     }, 4000);
//   };
  
//   const handleBuyNow = () => {
//     addToCart(product, quantity);
//     navigation.navigate('AppTabs', { screen: 'Cart' });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         {/* Gallery */}
//         <View style={styles.galleryContainer}>
//           <Image source={{ uri: imageUrls[0] }} style={styles.productImage} resizeMode="contain" />
//         </View>

//         {/* Main Info Section */}
//         <View style={styles.mainInfoContainer}>
//           <Text style={styles.brandName}>{product.brand_name || 'Brand'}</Text>
//           <View style={styles.titleRow}>
//             <Text style={styles.productName}>{product.name || 'Product Name'}</Text>
//             <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
//               <Icon name={isFavorite ? "heart" : "heart-outline"} size={26} color={isFavorite ? COLORS.danger : COLORS.textLight} />
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.productMeta}>{product.attributes?.find(a => a.attribute_name.toLowerCase() === 'net_weight')?.value || '1kg'}, Price</Text>
//           <View style={styles.pricingRow}>
//             <QuantityStepper quantity={quantity} setQuantity={setQuantity} minOrderQty={minOrderQty} />
//             <View style={styles.priceContainer}>
//               <Text style={styles.productPrice}>₹{sellingPrice.toFixed(2)}</Text>
//               {mrp > sellingPrice && (
//                 <View style={styles.mrpContainer}>
//                   <Text style={styles.mrpText}>₹{mrp.toFixed(2)}</Text>
//                   <Text style={styles.discountText}>{discount}% OFF</Text>
//                 </View>
//               )}
//             </View>
//           </View>
//           <Text style={styles.bvText}>You will earn {parseFloat(product.bv_earned || 0).toFixed(2)} BV on this purchase</Text>
//         </View>

//         {/* Details Section */}
//         <View style={styles.detailsContainer}>
//           <AccordionSection title="Product Detail">{product.description || "No details available."}</AccordionSection>
//         </View>
        
//         {/* Related Products Section (unchanged) */}
//         {isRelatedLoading ? ( <ActivityIndicator/> ) : (
//           relatedProducts.length > 0 && (
//             <View style={styles.relatedSection}>
//               <Text style={styles.relatedTitle}>You Might Also Like</Text>
//               <FlatList
//                 data={relatedProducts}
//                 renderItem={({ item }) => <ProductCard product={item} onPress={() => navigation.push('ProductDetails', { product: item })} />}
//                 // ...
//               />
//             </View>
//           )
//         )}
//       </ScrollView>

//       {/* 
//         =======================================================
//         === RENDER THE FLOATING BAR CONDITIONALLY           ===
//         =======================================================
//         It is now part of this screen's layout, controlled by its state.
//       */}
//       <FloatingCartBar visible={isCartBarVisible} />

//       {/* Sticky Bottom Bar (unchanged) */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity style={[styles.bottomButton, styles.buyNowButton]} onPress={handleBuyNow}>
//           <Text style={[styles.bottomButtonText, styles.buyNowText]}>Buy Now</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.bottomButton, styles.addToCartButton]} onPress={handleAddToCart}>
//           <Text style={[styles.bottomButtonText, styles.addToCartText]}>Add To Basket</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// // --- STYLES (Unchanged) ---
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.surface,
//   },

//   scrollContent: {
//     paddingBottom: 120,
//   },

//   navHeaderIcons: {
//     flexDirection: 'row',
//   },

//   galleryContainer: {
//     height: 300,
//     backgroundColor: COLORS.surface,
//     padding: SIZES.base,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },

//   productImage: {
//     width: '100%',
//     height: '100%',
//   },

//   mainInfoContainer: {
//     padding: SIZES.padding,
//     backgroundColor: COLORS.surface,
//     borderBottomWidth: 6,
//     borderBottomColor: COLORS.background,
//   },

//   brandName: {
//     ...FONTS.body,
//     color: COLORS.textLight,
//     fontWeight: '600',
//     marginBottom: 4,
//   },

//   titleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },

//   productName: {
//     ...FONTS.h1,
//     flex: 1,
//     marginRight: SIZES.padding,
//   },

//   productMeta: {
//     ...FONTS.body,
//     fontSize: 16,
//     color: COLORS.textLight,
//     marginTop: 4,
//     marginBottom: SIZES.padding,
//   },

//   pricingRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: SIZES.padding / 2,
//   },

//   priceContainer: {
//     alignItems: 'flex-end',
//   },

//   productPrice: {
//     ...FONTS.h1,
//     color: COLORS.text,
//   },

//   mrpContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: SIZES.base,
//   },

//   mrpText: {
//     ...FONTS.body,
//     color: COLORS.textMuted,
//     textDecorationLine: 'line-through',
//   },

//   discountText: {
//     ...FONTS.body,
//     color: COLORS.primary,
//     fontWeight: 'bold',
//     fontSize: 12,
//   },

//   bvText: {
//     ...FONTS.body,
//     color: COLORS.primary,
//     fontWeight: '600',
//     marginTop: SIZES.padding,
//   },

//   quantityStepper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.background,
//     borderRadius: SIZES.radius,
//   },

//   stepperButton: {
//     padding: SIZES.padding / 1.5,
//   },

//   quantityText: {
//     ...FONTS.h2,
//     fontSize: 18,
//     marginHorizontal: SIZES.padding,
//   },

//   detailsContainer: {
//     paddingHorizontal: SIZES.padding,
//     backgroundColor: COLORS.surface,
//   },

//   accordionContainer: {
//     paddingVertical: SIZES.padding / 2,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },

//   accordionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: SIZES.padding / 2,
//   },

//   accordionTitle: {
//     ...FONTS.h2,
//     fontSize: 16,
//   },

//   accordionContent: {
//     ...FONTS.body,
//     paddingTop: SIZES.padding / 4,
//     paddingBottom: SIZES.padding / 2,
//   },

//   relatedSection: {
//     backgroundColor: COLORS.background,
//     paddingTop: SIZES.padding,
//     paddingBottom: SIZES.padding * 2,
//   },

//   relatedTitle: {
//     ...FONTS.h2,
//     paddingHorizontal: SIZES.padding,
//     marginBottom: SIZES.base,
//   },

//   relatedListContent: {
//     paddingLeft: SIZES.padding,
//   },

//   bottomBar: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     height: 75,
//     padding: SIZES.padding,
//     backgroundColor: COLORS.surface,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.border,
//     gap: SIZES.padding / 2,
//   },

//   bottomButton: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: SIZES.radius,
//   },

//   addToCartButton: {
//     backgroundColor: COLORS.primary,
//   },

//   buyNowButton: {
//     borderWidth: 1.5,
//     borderColor: COLORS.primary,
//   },

//   bottomButtonText: {
//     ...FONTS.h2,
//     fontSize: 16,
//   },

//   addToCartText: {
//     color: COLORS.white,
//   },

//   buyNowText: {
//     color: COLORS.primary,
//   },
// });

// export default ProductDetailsScreen;




















import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, Image, FlatList,
  TouchableOpacity, useWindowDimensions, ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from '../context/CartContext';
import { mlmService } from '../services/mlmService';
import { usePincode } from '../context/PincodeContext';
import ProductCard from '../components/ProductCard'; 
import FloatingCartBar from '../components/FloatingCartBar'; // --- Your custom bar ---

// --- DESIGN SYSTEM ---
const COLORS = {
  primary: '#059669', primaryDark: '#064E3B', white: '#FFFFFF', text: '#1F2937',
  textLight: '#6B7280', textMuted: '#9CA3AF', background: '#F9FAFB', surface: '#FFFFFF',
  border: '#E5E7EB', danger: '#EF4444', star: '#F59E0B',
};
const SIZES = { padding: 20, radius: 12, base: 8 };
const FONTS = {
  h1: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  h2: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  body: { fontSize: 14, color: COLORS.textLight, lineHeight: 22 },
};

// --- SUB-COMPONENTS ---
const QuantityStepper = ({ quantity, setQuantity, minOrderQty }) => (
  <View style={styles.quantityStepper}>
    <TouchableOpacity style={styles.stepperButton} onPress={() => setQuantity(q => Math.max(minOrderQty, q - 1))}>
      <Icon name="remove" size={20} color={COLORS.primary} />
    </TouchableOpacity>
    <Text style={styles.quantityText}>{quantity}</Text>
    <TouchableOpacity style={styles.stepperButton} onPress={() => setQuantity(q => q + 1)}>
      <Icon name="add" size={20} color={COLORS.primary} />
    </TouchableOpacity>
  </View>
);
const AccordionSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity style={styles.accordionHeader} onPress={() => setIsOpen(!isOpen)}>
        <Text style={styles.accordionTitle}>{title}</Text>
        <Icon name={isOpen ? "chevron-down" : "chevron-forward"} size={20} color={COLORS.text} />
      </TouchableOpacity>
      {isOpen && <Text style={styles.accordionContent}>{children}</Text>}
    </View>
  );
};


// --- MAIN PRODUCT DETAILS SCREEN (FULLY CORRECTED) ---
const ProductDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { addToCart } = useCart();
  const { pincode } = usePincode();
  const { product } = route.params;

  // --- STATE ---
  const minOrderQty = parseInt(product.minimum_order_quantity, 10) || 1;
  const [quantity, setQuantity] = useState(minOrderQty);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isRelatedLoading, setIsRelatedLoading] = useState(true);
  const [isCartBarVisible, setIsCartBarVisible] = useState(false);

  // --- DERIVED VALUES ---
  const sellingPrice = parseFloat(product.selling_price || 0);
  const mrp = parseFloat(product.mrp || 0);
  const discount = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const serverUrl = 'http://192.168.0.171:3000';
  const imageUrls = [product.main_image_url, ...(product.gallery_image_urls || [])]
    .filter(Boolean)
    .map(url => `${serverUrl}${url}`);

  useEffect(() => {
    navigation.setOptions({
        headerTitle: product.name,
        headerRight: () => (
             <View style={styles.navHeaderIcons}>
                <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
                    <Icon name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? COLORS.danger : COLORS.text} />
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: 15}} onPress={() => { /* Share logic */ }}>
                    <Icon name="share-social-outline" size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>
        )
    });

    // ==========================================================
    // === FIX #1: THE CORRECT DATA FETCHING LOGIC IS HERE    ===
    // ==========================================================
    const fetchRelated = async () => {
      setIsRelatedLoading(true);
      try {
        const response = await mlmService.getRelatedProducts(product.product_id, pincode);
        if (response.status) {
          setRelatedProducts(response.data || []);
        }
      } catch (e) {
        console.error("Failed to load related products", e);
        setRelatedProducts([]); // Ensure it's an empty array on error
      } finally {
        setIsRelatedLoading(false);
      }
    };
    
    if (pincode) {
        fetchRelated();
    } else {
        setIsRelatedLoading(false); // Don't show loader if there's no pincode
    }

  }, [product.product_id, pincode, product.name, navigation, isFavorite]);

  // --- ACTION HANDLERS ---
  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsCartBarVisible(true); // Show the floating bar
    // Hide the bar after 4 seconds
    setTimeout(() => {
      setIsCartBarVisible(false);
    }, 4000);
  };
  
  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigation.navigate('AppTabs', { screen: 'Cart' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Gallery */}
        <View style={styles.galleryContainer}>
          <Image source={{ uri: imageUrls[0] }} style={styles.productImage} resizeMode="contain" />
        </View>

        {/* Main Info Section */}
        <View style={styles.mainInfoContainer}>
          <Text style={styles.brandName}>{product.brand_name || 'Brand'}</Text>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{product.name || 'Product Name'}</Text>
            <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
              <Icon name={isFavorite ? "heart" : "heart-outline"} size={26} color={isFavorite ? COLORS.danger : COLORS.textLight} />
            </TouchableOpacity>
          </View>
          <Text style={styles.productMeta}>{product.attributes?.find(a => a.attribute_name.toLowerCase() === 'net_weight')?.value || '1kg'}, Price</Text>
          <View style={styles.pricingRow}>
            <QuantityStepper quantity={quantity} setQuantity={setQuantity} minOrderQty={minOrderQty} />
            <View style={styles.priceContainer}>
              <Text style={styles.productPrice}>₹{sellingPrice.toFixed(2)}</Text>
              {mrp > sellingPrice && (
                <View style={styles.mrpContainer}>
                  <Text style={styles.mrpText}>₹{mrp.toFixed(2)}</Text>
                  <Text style={styles.discountText}>{discount}% OFF</Text>
                </View>
              )}
            </View>
          </View>
          <Text style={styles.bvText}>You will earn {parseFloat(product.bv_earned || 0).toFixed(2)} BV on this purchase</Text>
        </View>

        {/* Details Section */}
        <View style={styles.detailsContainer}>
          <AccordionSection title="Product Detail">{product.description || "No details available."}</AccordionSection>
        </View>
        
        {/* Related Products Section */}
        {isRelatedLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }}/>
        ) : (
          relatedProducts.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.relatedTitle}>You Might Also Like</Text>
              {/* =======================================================
                  === FIX #2: THE CORRECT HORIZONTAL FLATLIST IS HERE ===
                  ======================================================= */}
              <FlatList
                data={relatedProducts}
                renderItem={({ item }) => <ProductCard product={item} onPress={() => navigation.push('ProductDetails', { product: item })} />}
                keyExtractor={(item) => item.product_id.toString()} // Use a unique ID from your data
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedListContent}
              />
            </View>
          )
        )}
      </ScrollView>

      {/* RENDER THE FLOATING BAR CONDITIONALLY */}
      <FloatingCartBar visible={isCartBarVisible} />

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={[styles.bottomButton, styles.buyNowButton]} onPress={handleBuyNow}>
          <Text style={[styles.bottomButtonText, styles.buyNowText]}>Buy Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomButton, styles.addToCartButton]} onPress={handleAddToCart}>
          <Text style={[styles.bottomButtonText, styles.addToCartText]}>Add To Basket</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  navHeaderIcons: {
    flexDirection: 'row',
  },
  galleryContainer: {
    height: 300,
    backgroundColor: COLORS.surface,
    padding: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  mainInfoContainer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 6,
    borderBottomColor: COLORS.background,
  },
  brandName: {
    ...FONTS.body,
    color: COLORS.textLight,
    fontWeight: '600',
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productName: {
    ...FONTS.h1,
    flex: 1,
    marginRight: SIZES.padding,
  },
  productMeta: {
    ...FONTS.body,
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 4,
    marginBottom: SIZES.padding,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.padding / 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  productPrice: {
    ...FONTS.h1,
    color: COLORS.text,
  },
  mrpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  mrpText: {
    ...FONTS.body,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  discountText: {
    ...FONTS.body,
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  bvText: {
    ...FONTS.body,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: SIZES.padding,
  },
  quantityStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
  },
  stepperButton: {
    padding: SIZES.padding / 1.5,
  },
  quantityText: {
    ...FONTS.h2,
    fontSize: 18,
    marginHorizontal: SIZES.padding,
  },
  detailsContainer: {
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.surface,
  },
  accordionContainer: {
    paddingVertical: SIZES.padding / 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding / 2,
  },
  accordionTitle: {
    ...FONTS.h2,
    fontSize: 16,
  },
  accordionContent: {
    ...FONTS.body,
    paddingTop: SIZES.padding / 4,
    paddingBottom: SIZES.padding / 2,
  },
  relatedSection: {
    backgroundColor: COLORS.background,
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  relatedTitle: {
    ...FONTS.h2,
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.base,
  },
  relatedListContent: {
    paddingHorizontal: SIZES.padding, // Provides padding for the items in the list
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    height: 75,
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SIZES.padding / 2,
  },
  bottomButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.radius,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
  },
  buyNowButton: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  bottomButtonText: {
    ...FONTS.h2,
    fontSize: 16,
  },
  addToCartText: {
    color: COLORS.white,
  },
  buyNowText: {
    color: COLORS.primary,
  },
});

export default ProductDetailsScreen;