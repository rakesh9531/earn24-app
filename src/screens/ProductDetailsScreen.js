// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   useWindowDimensions,
//   ActivityIndicator,
// } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useCart } from '../context/CartContext';
// import { mlmService } from '../services/mlmService';
// import { usePincode } from '../context/PincodeContext';
// import ProductCard from '../components/ProductCard';
// import FloatingCartBar from '../components/FloatingCartBar'; // --- Your custom bar ---

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
//   star: '#F59E0B',
// };
// const SIZES = { padding: 20, radius: 12, base: 8 };
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
//     <TouchableOpacity
//       style={styles.stepperButton}
//       onPress={() => setQuantity(q => q + 1)}
//     >
//       <Icon name="add" size={20} color={COLORS.primary} />
//     </TouchableOpacity>
//   </View>
// );
// const AccordionSection = ({ title, children }) => {
//   const [isOpen, setIsOpen] = useState(true);
//   return (
//     <View style={styles.accordionContainer}>
//       <TouchableOpacity
//         style={styles.accordionHeader}
//         onPress={() => setIsOpen(!isOpen)}
//       >
//         <Text style={styles.accordionTitle}>{title}</Text>
//         <Icon
//           name={isOpen ? 'chevron-down' : 'chevron-forward'}
//           size={20}
//           color={COLORS.text}
//         />
//       </TouchableOpacity>
//       {isOpen && <Text style={styles.accordionContent}>{children}</Text>}
//     </View>
//   );
// };

// // --- MAIN PRODUCT DETAILS SCREEN (FULLY CORRECTED) ---
// const ProductDetailsScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { addToCart } = useCart();
//   const { pincode } = usePincode();
//   const { product } = route.params;

//   const currentProductId = product.product_id || product.id;

//   // --- STATE ---
//   const minOrderQty = parseInt(product.minimum_order_quantity, 10) || 1;
//   const [quantity, setQuantity] = useState(minOrderQty);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [isRelatedLoading, setIsRelatedLoading] = useState(true);
//   const [isCartBarVisible, setIsCartBarVisible] = useState(false);

//   // --- DERIVED VALUES ---
//   const sellingPrice = parseFloat(product.selling_price || 0);
//   const mrp = parseFloat(product.mrp || 0);
//   const discount =
//     mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
//   const serverUrl = 'https://newapi.earn24.in';
//   const imageUrls = [
//     product.main_image_url,
//     ...(product.gallery_image_urls || []),
//   ]
//     .filter(Boolean)
//     .map(url => `${serverUrl}${url}`);

//   useEffect(() => {
//     navigation.setOptions({
//       headerTitle: product.name,
//       headerRight: () => (
//         <View style={styles.navHeaderIcons}>
//           <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
//             <Icon
//               name={isFavorite ? 'heart' : 'heart-outline'}
//               size={24}
//               color={isFavorite ? COLORS.danger : COLORS.text}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={{ marginLeft: 15 }}
//             onPress={() => {
//               /* Share logic */
//             }}
//           >
//             <Icon name="share-social-outline" size={24} color={COLORS.text} />
//           </TouchableOpacity>
//         </View>
//       ),
//     });

//     // ==========================================================
//     // === FIX #1: THE CORRECT DATA FETCHING LOGIC IS HERE    ===
//     // ==========================================================
//     //   const fetchRelated = async () => {
//     //     setIsRelatedLoading(true);
//     //     try {
//     //       const response = await mlmService.getRelatedProducts(product.product_id, pincode);
//     //       if (response.status) {
//     //         setRelatedProducts(response.data || []);
//     //       }
//     //     } catch (e) {
//     //       console.error("Failed to load related products", e);
//     //       setRelatedProducts([]); // Ensure it's an empty array on error
//     //     } finally {
//     //       setIsRelatedLoading(false);
//     //     }
//     //   };

//     //   if (pincode) {
//     //       fetchRelated();
//     //   } else {
//     //       setIsRelatedLoading(false); // Don't show loader if there's no pincode
//     //   }

//     // }, [product.product_id, pincode, product.name, navigation, isFavorite]);

//     const fetchRelated = async () => {
//       // Safety check: don't call API if ID is still missing
//       if (!currentProductId) {
//         console.warn('Cannot fetch related products: ID is missing');
//         setIsRelatedLoading(false);
//         return;
//       }

//       setIsRelatedLoading(true);
//       try {
//         // Use the safe ID variable here
//         const response = await mlmService.getRelatedProducts(
//           currentProductId,
//           pincode,
//         );
//         if (response.status) {
//           setRelatedProducts(response.data || []);
//         }
//       } catch (e) {
//         console.error('Failed to load related products', e);
//         setRelatedProducts([]);
//       } finally {
//         setIsRelatedLoading(false);
//       }
//     };

//     if (pincode && currentProductId) {
//       fetchRelated();
//     } else {
//       setIsRelatedLoading(false);
//     }

//     // Update dependencies to use currentProductId
//   }, [currentProductId, pincode, product.name, navigation, isFavorite]);

//   // --- ACTION HANDLERS ---
//   const handleAddToCart = () => {
//     addToCart(product, quantity);
//     setIsCartBarVisible(true); // Show the floating bar
//     // Hide the bar after 4 seconds
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
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Gallery */}
//         <View style={styles.galleryContainer}>
//           <Image
//             source={{ uri: imageUrls[0] }}
//             style={styles.productImage}
//             resizeMode="contain"
//           />
//         </View>

//         {/* Main Info Section */}
//         <View style={styles.mainInfoContainer}>
//           <Text style={styles.brandName}>{product.brand_name || 'Brand'}</Text>
//           <View style={styles.titleRow}>
//             <Text style={styles.productName}>
//               {product.name || 'Product Name'}
//             </Text>
//             <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
//               <Icon
//                 name={isFavorite ? 'heart' : 'heart-outline'}
//                 size={26}
//                 color={isFavorite ? COLORS.danger : COLORS.textLight}
//               />
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.productMeta}>
//             {product.attributes?.find(
//               a => a.attribute_name.toLowerCase() === 'net_weight',
//             )?.value || '1kg'}
//             , Price
//           </Text>
//           <View style={styles.pricingRow}>
//             <QuantityStepper
//               quantity={quantity}
//               setQuantity={setQuantity}
//               minOrderQty={minOrderQty}
//             />
//             <View style={styles.priceContainer}>
//               <Text style={styles.productPrice}>
//                 ₹{sellingPrice.toFixed(2)}
//               </Text>
//               {mrp > sellingPrice && (
//                 <View style={styles.mrpContainer}>
//                   <Text style={styles.mrpText}>₹{mrp.toFixed(2)}</Text>
//                   <Text style={styles.discountText}>{discount}% OFF</Text>
//                 </View>
//               )}
//             </View>
//           </View>
//           <Text style={styles.bvText}>
//             You will earn {parseFloat(product.bv_earned || 0).toFixed(2)} BV on
//             this purchase
//           </Text>
//         </View>

//         {/* Details Section */}
//         <View style={styles.detailsContainer}>
//           <AccordionSection title="Product Detail">
//             {product.description || 'No details available.'}
//           </AccordionSection>
//         </View>

//         {/* Related Products Section */}
//         {isRelatedLoading ? (
//           <ActivityIndicator
//             size="large"
//             color={COLORS.primary}
//             style={{ marginTop: 30 }}
//           />
//         ) : (
//           relatedProducts.length > 0 && (
//             <View style={styles.relatedSection}>
//               <Text style={styles.relatedTitle}>You Might Also Like</Text>
//               {/* =======================================================
//                   === FIX #2: THE CORRECT HORIZONTAL FLATLIST IS HERE ===
//                   ======================================================= */}
//               {/* <FlatList
//                 data={relatedProducts}
//                 renderItem={({ item }) => <ProductCard product={item} onPress={() => navigation.push('ProductDetails', { product: item })} />}
//                 keyExtractor={(item) => item.product_id.toString()} // Use a unique ID from your data
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.relatedListContent}
//               /> */}

//               <FlatList
//                 data={relatedProducts}
//                 renderItem={({ item }) => (
//                   <ProductCard
//                     product={item}
//                     onPress={() =>
//                       navigation.push('ProductDetails', { product: item })
//                     }
//                   />
//                 )}
//                 // Check for both ID names here too
//                 keyExtractor={item => (item.product_id || item.id).toString()}
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.relatedListContent}
//               />
//             </View>
//           )
//         )}
//       </ScrollView>

//       {/* RENDER THE FLOATING BAR CONDITIONALLY */}
//       <FloatingCartBar visible={isCartBarVisible} />

//       {/* Sticky Bottom Bar */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity
//           style={[styles.bottomButton, styles.buyNowButton]}
//           onPress={handleBuyNow}
//         >
//           <Text style={[styles.bottomButtonText, styles.buyNowText]}>
//             Buy Now
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.bottomButton, styles.addToCartButton]}
//           onPress={handleAddToCart}
//         >
//           <Text style={[styles.bottomButtonText, styles.addToCartText]}>
//             Add To Basket
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// // --- STYLES ---
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
//     paddingHorizontal: SIZES.padding, // Provides padding for the items in the list
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














// // // ----------------------------------Testing-------------------------------------------------


// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useCart } from '../context/CartContext';
// import { mlmService } from '../services/mlmService';
// import { usePincode } from '../context/PincodeContext';
// import ProductCard from '../components/ProductCard';
// import FloatingCartBar from '../components/FloatingCartBar';

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
//   star: '#F59E0B',
// };
// const SIZES = { padding: 20, radius: 12, base: 8 };
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
//     <TouchableOpacity
//       style={styles.stepperButton}
//       onPress={() => setQuantity(q => q + 1)}
//     >
//       <Icon name="add" size={20} color={COLORS.primary} />
//     </TouchableOpacity>
//   </View>
// );

// const AccordionSection = ({ title, children }) => {
//   const [isOpen, setIsOpen] = useState(true);
//   return (
//     <View style={styles.accordionContainer}>
//       <TouchableOpacity
//         style={styles.accordionHeader}
//         onPress={() => setIsOpen(!isOpen)}
//       >
//         <Text style={styles.accordionTitle}>{title}</Text>
//         <Icon
//           name={isOpen ? 'chevron-down' : 'chevron-forward'}
//           size={20}
//           color={COLORS.text}
//         />
//       </TouchableOpacity>
//       {isOpen && <Text style={styles.accordionContent}>{children}</Text>}
//     </View>
//   );
// };

// // --- MAIN PRODUCT DETAILS SCREEN ---
// const ProductDetailsScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { addToCart } = useCart();
//   const { pincode } = usePincode();
//   const { product } = route.params;

//   // Handle both 'id' and 'product_id' keys for safety
//   const currentProductId = product.product_id || product.id;

//   // --- STATE ---
//   const minOrderQty = parseInt(product.minimum_order_quantity, 10) || 1;
//   const [quantity, setQuantity] = useState(minOrderQty);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [isRelatedLoading, setIsRelatedLoading] = useState(true);
//   const [isCartBarVisible, setIsCartBarVisible] = useState(false);

//   // --- REAL WORLD DYNAMIC ATTRIBUTES ---
//   // Joins all attribute values into a string like "1kg, Red, Cotton"
//   const attributeDisplay = product.attributes && product.attributes.length > 0
//     ? product.attributes.map(a => a.value).join(', ')
//     : 'Standard Variant';

//   // --- DERIVED VALUES ---
//   const sellingPrice = parseFloat(product.selling_price || 0);
//   const mrp = parseFloat(product.mrp || 0);
//   const discount = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
//   const serverUrl = 'https://newapi.earn24.in';
//   const imageUrls = [
//     product.main_image_url,
//     ...(product.gallery_image_urls || []),
//   ]
//     .filter(Boolean)
//     .map(url => `${serverUrl}${url}`);

//   useEffect(() => {
//     navigation.setOptions({
//       headerTitle: product.name,
//       headerRight: () => (
//         <View style={styles.navHeaderIcons}>
//           <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
//             <Icon
//               name={isFavorite ? 'heart' : 'heart-outline'}
//               size={24}
//               color={isFavorite ? COLORS.danger : COLORS.text}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={{ marginLeft: 15 }}
//             onPress={() => { /* Share logic */ }}
//           >
//             <Icon name="share-social-outline" size={24} color={COLORS.text} />
//           </TouchableOpacity>
//         </View>
//       ),
//     });

//     const fetchRelated = async () => {
//       if (!currentProductId) return;
//       setIsRelatedLoading(true);
//       try {
//         const response = await mlmService.getRelatedProducts(currentProductId, pincode);
//         if (response.status) {
//           setRelatedProducts(response.data || []);
//         }
//       } catch (e) {
//         console.error('Failed to load related products', e);
//         setRelatedProducts([]);
//       } finally {
//         setIsRelatedLoading(false);
//       }
//     };

//     if (pincode && currentProductId) {
//       fetchRelated();
//     } else {
//       setIsRelatedLoading(false);
//     }

//   }, [currentProductId, pincode, product.name, navigation, isFavorite]);

//   // --- ACTION HANDLERS ---
//   const handleAddToCart = () => {
//     addToCart(product, quantity);
//     setIsCartBarVisible(true);
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
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Gallery */}
//         <View style={styles.galleryContainer}>
//           <Image
//             source={{ uri: imageUrls[0] }}
//             style={styles.productImage}
//             resizeMode="contain"
//           />
//         </View>

//         {/* Main Info Section */}
//         <View style={styles.mainInfoContainer}>
//           <Text style={styles.brandName}>{product.brand_name || 'Brand'}</Text>
//           <View style={styles.titleRow}>
//             <Text style={styles.productName}>
//               {product.name || 'Product Name'}
//             </Text>
//             <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
//               <Icon
//                 name={isFavorite ? 'heart' : 'heart-outline'}
//                 size={26}
//                 color={isFavorite ? COLORS.danger : COLORS.textLight}
//               />
//             </TouchableOpacity>
//           </View>

//           {/* DYNAMIC ATTRIBUTE STRING (Fix for "1kg, Price") */}
//           <Text style={styles.productMeta}>{attributeDisplay}</Text>
          
//           <View style={styles.pricingRow}>
//             <QuantityStepper
//               quantity={quantity}
//               setQuantity={setQuantity}
//               minOrderQty={minOrderQty}
//             />
//             <View style={styles.priceContainer}>
//               <Text style={styles.productPrice}>
//                 ₹{sellingPrice.toFixed(2)}
//               </Text>
//               {mrp > sellingPrice && (
//                 <View style={styles.mrpContainer}>
//                   <Text style={styles.mrpText}>₹{mrp.toFixed(2)}</Text>
//                   <Text style={styles.discountText}>{discount}% OFF</Text>
//                 </View>
//               )}
//             </View>
//           </View>
//           <Text style={styles.bvText}>
//             You will earn {parseFloat(product.bv_earned || 0).toFixed(2)} BV on
//             this purchase
//           </Text>
//         </View>

//         {/* Details Section */}
//         <View style={styles.detailsContainer}>
//           <AccordionSection title="Product Detail">
//             {product.description || 'No details available.'}
//           </AccordionSection>
//         </View>

//         {/* Related Products Section */}
//         {isRelatedLoading ? (
//           <ActivityIndicator
//             size="large"
//             color={COLORS.primary}
//             style={{ marginTop: 30 }}
//           />
//         ) : (
//           relatedProducts.length > 0 && (
//             <View style={styles.relatedSection}>
//               <Text style={styles.relatedTitle}>You Might Also Like</Text>
//               <FlatList
//                 data={relatedProducts}
//                 renderItem={({ item }) => (
//                   <ProductCard
//                     product={item}
//                     onPress={() =>
//                       navigation.push('ProductDetails', { product: item })
//                     }
//                   />
//                 )}
//                 keyExtractor={item => (item.product_id || item.id).toString()}
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.relatedListContent}
//               />
//             </View>
//           )
//         )}
//       </ScrollView>

//       <FloatingCartBar visible={isCartBarVisible} />

//       {/* Sticky Bottom Bar */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity
//           style={[styles.bottomButton, styles.buyNowButton]}
//           onPress={handleBuyNow}
//         >
//           <Text style={[styles.bottomButtonText, styles.buyNowText]}>
//             Buy Now
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.bottomButton, styles.addToCartButton]}
//           onPress={handleAddToCart}
//         >
//           <Text style={[styles.bottomButtonText, styles.addToCartText]}>
//             Add To Basket
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// // --- STYLES ---
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
//     paddingHorizontal: SIZES.padding,
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












// ----------Above code is woring belwo trying ot added video and image gallery 


// // ----------------------------------Testing-------------------------------------------------


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import RenderHtml from 'react-native-render-html'; 
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video'; // --- Added for Video support ---
import { useCart } from '../context/CartContext';
import { mlmService } from '../services/mlmService';
import { usePincode } from '../context/PincodeContext';
import ProductCard from '../components/ProductCard';
import FloatingCartBar from '../components/FloatingCartBar';
import { useFavorites } from '../context/FavoriteContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- DESIGN SYSTEM ---
const COLORS = {
  primary: '#059669',
  primaryDark: '#064E3B',
  white: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  textMuted: '#9CA3AF',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  danger: '#EF4444',
  star: '#F59E0B',
};
const SIZES = { padding: 20, radius: 12, base: 8 };
const FONTS = {
  h1: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  h2: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  body: { fontSize: 14, color: COLORS.textLight, lineHeight: 22 },
};

const tagsStyles = {
  p: {
    ...FONTS.body,
    marginTop: 0,
    marginBottom: 6, // Reduced margin to decrease spacing
    color: COLORS.textLight,
  },
  ul: {
    marginVertical: 4,
  },
  li: {
    ...FONTS.body,
    marginBottom: 4,
    color: COLORS.textLight,
  },
  strong: {
    color: COLORS.text,
    fontWeight: '700',
  },
  span: {
    color: COLORS.textLight,
  },
  div: {
    color: COLORS.textLight,
  }
};

// --- SUB-COMPONENTS ---
const QuantityStepper = ({ quantity, setQuantity, minOrderQty }) => (
  <View style={styles.quantityStepper}>
    <TouchableOpacity
      style={styles.stepperButton}
      onPress={() => setQuantity(q => Math.max(minOrderQty, q - 1))}
    >
      <Icon name="remove" size={20} color={COLORS.primary} />
    </TouchableOpacity>
    <Text style={styles.quantityText}>{quantity}</Text>
    <TouchableOpacity
      style={styles.stepperButton}
      onPress={() => setQuantity(q => q + 1)}
    >
      <Icon name="add" size={20} color={COLORS.primary} />
    </TouchableOpacity>
  </View>
);

const AccordionSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        <Icon
          name={isOpen ? 'chevron-down' : 'chevron-forward'}
          size={20}
          color={COLORS.text}
        />
      </TouchableOpacity>
      {/* {isOpen && <Text style={styles.accordionContent}>{children}</Text>} */}
      {isOpen && <View style={styles.accordionContentInner}>{children}</View>}
    </View>
  );
};

// --- MAIN PRODUCT DETAILS SCREEN ---
const ProductDetailsScreen = () => {
  const { width } = useWindowDimensions(); 
  const route = useRoute();
  const navigation = useNavigation();
  const { addToCart } = useCart();
  const { pincode } = usePincode();
  const { product } = route.params;
  const insets = useSafeAreaInsets();

  const currentProductId = product.product_id || product.id;

  // --- STATE ---
  const minOrderQty = parseInt(product.minimum_order_quantity, 10) || 1;
  const [quantity, setQuantity] = useState(minOrderQty);
  const { isFavorite: checkFavorite, toggleFavorite } = useFavorites();
  const isFav = checkFavorite(currentProductId);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isRelatedLoading, setIsRelatedLoading] = useState(true);
  const [isCartBarVisible, setIsCartBarVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // For Slider dots

  // --- DERIVED VALUES ---
  const sellingPrice = parseFloat(product.selling_price || 0);
  const mrp = parseFloat(product.mrp || 0);
  const discount = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const serverUrl = 'https://newapi.earn24.in';

  // --- MEDIA ARRAY LOGIC ---
  // Merges main image and gallery images, identifies if it is a video
  const allMedia = [
    { url: product.main_image_url, type: 'image' },
    ...(Array.isArray(product.gallery_image_urls) ? product.gallery_image_urls : [])
      .map(url => ({
        url: url,
        type: (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.mov')) ? 'video' : 'image'
      }))
  ].filter(item => item.url).map(item => ({ ...item, url: `${serverUrl}${item.url}` }));

  const attributeDisplay = product.attributes && product.attributes.length > 0
    ? product.attributes.map(a => a.value).join(', ')
    : 'Standard Variant';

  useEffect(() => {
    navigation.setOptions({
      headerTitle: product.name,
      headerRight: () => (
        <View style={styles.navHeaderIcons}>
          <TouchableOpacity onPress={() => toggleFavorite(product, navigation)}>
            <Icon
              name={isFav ? 'heart' : 'heart-outline'}
              size={24}
              color={isFav ? COLORS.danger : COLORS.text}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 15 }}>
            <Icon name="share-social-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      ),
    });

    const fetchRelated = async () => {
      if (!currentProductId) return;
      setIsRelatedLoading(true);
      try {
        const response = await mlmService.getRelatedProducts(currentProductId, pincode);
        if (response.status) {
          setRelatedProducts(response.data || []);
        }
      } catch (e) {
        console.error('Failed to load related products', e);
        setRelatedProducts([]);
      } finally {
        setIsRelatedLoading(false);
      }
    };

    if (pincode && currentProductId) {
      fetchRelated();
    } else {
      setIsRelatedLoading(false);
    }

  }, [currentProductId, pincode, product.name, navigation, isFav]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsCartBarVisible(true);
    setTimeout(() => {
      setIsCartBarVisible(false);
    }, 4000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigation.navigate('Cart');
  };

  // Helper for slider scrolling
  const onScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    setActiveIndex(Math.round(x / SCREEN_WIDTH));
  };

  const renderMediaItem = ({ item, index }) => {
    if (item.type === 'video') {
      return (
        <View style={styles.mediaSlide}>
          <Video
            source={{ uri: item.url }}
            style={styles.videoPlayer}
            controls={true}
            resizeMode="contain"
            paused={activeIndex !== index} // Auto-pause when user swipes away
            repeat={true}
          />
        </View>
      );
    }
    return (
      <View style={styles.mediaSlide}>
        <Image source={{ uri: item.url }} style={styles.productImage} resizeMode="contain" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        
        {/* --- DYNAMIC MEDIA GALLERY --- */}
        <View style={styles.sliderContainer}>
          <FlatList
            data={allMedia}
            renderItem={renderMediaItem}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScroll}
          />
          {/* Pagination Indicator Dots */}
          <View style={styles.dotContainer}>
            {allMedia.length > 1 && allMedia.map((_, i) => (
              <View key={i} style={[styles.dot, activeIndex === i ? styles.activeDot : styles.inactiveDot]} />
            ))}
          </View>
        </View>

        {/* Main Info Section */}
        <View style={styles.mainInfoContainer}>
          <Text style={styles.brandName}>{product.brand_name || 'Brand'}</Text>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{product.name || 'Product Name'}</Text>
            <TouchableOpacity onPress={() => toggleFavorite(product, navigation)}>
              <Icon
                name={isFav ? 'heart' : 'heart-outline'}
                size={26}
                color={isFav ? COLORS.danger : COLORS.textLight}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.productMeta}>{attributeDisplay}</Text>
          
          <View style={styles.pricingRow}>
            <QuantityStepper
              quantity={quantity}
              setQuantity={setQuantity}
              minOrderQty={minOrderQty}
            />
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
          <Text style={styles.bvText}>
            You will earn {parseFloat(product.bv_earned || 0).toFixed(2)} BV on this purchase
          </Text>
        </View>

        {/* Details Section */}
        {/* <View style={styles.detailsContainer}>
          <AccordionSection title="Product Detail">
            {product.description || 'No details available.'}
          </AccordionSection>
        </View> */}


        <View style={styles.detailsContainer}>
          <AccordionSection title="Product Detail">
            <RenderHtml
              contentWidth={width}
              source={{ 
                // removing empty <p><br></p> tags that Quill inserts which add too much space
                html: product.description 
                  ? product.description.replace(/<p><br><\/p>|<p>&nbsp;<\/p>/g, '') 
                  : '<p>No details available.</p>' 
              }}
              tagsStyles={tagsStyles}
              baseStyle={{ color: COLORS.textLight, ...FONTS.body }} // Ensures text without tags also renders correctly
              ignoredStyles={['font-family']} // Ignore inline web fonts from Quill that might break on mobile
            />
          </AccordionSection>
        </View>

        {/* Related Products Section */}
        {isRelatedLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }} />
        ) : (
          relatedProducts.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.relatedTitle}>You Might Also Like</Text>
              <FlatList
                data={relatedProducts}
                renderItem={({ item }) => (
                  <View style={{ width: 170 }}>
                    <ProductCard
                      product={item}
                      onPress={() => navigation.push('ProductDetails', { product: item })}
                    />
                  </View>
                )}
                keyExtractor={item => (item.product_id || item.id).toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedListContent}
              />
            </View>
          )
        )}
      </ScrollView>

      <FloatingCartBar visible={isCartBarVisible} />

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { height: 75 + insets.bottom, paddingBottom: SIZES.padding + insets.bottom }]}>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  scrollContent: { paddingBottom: 120 },
  navHeaderIcons: { flexDirection: 'row' },
  
  // Slider Styles
  sliderContainer: { height: 350, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  mediaSlide: { width: SCREEN_WIDTH, height: 350, justifyContent: 'center', alignItems: 'center' },
  productImage: { width: '90%', height: '90%' },
  videoPlayer: { width: SCREEN_WIDTH, height: 320 },
  dotContainer: { flexDirection: 'row', position: 'absolute', bottom: 15, alignSelf: 'center' },
  dot: { height: 8, borderRadius: 4, marginHorizontal: 4 },
  activeDot: { width: 20, backgroundColor: COLORS.primary },
  inactiveDot: { width: 8, backgroundColor: '#CCC' },

  mainInfoContainer: { padding: SIZES.padding, borderBottomWidth: 6, borderBottomColor: COLORS.background },
  brandName: { ...FONTS.body, color: COLORS.textLight, fontWeight: '600', marginBottom: 4 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  productName: { ...FONTS.h1, flex: 1, marginRight: SIZES.padding },
  productMeta: { ...FONTS.body, fontSize: 16, color: COLORS.textLight, marginTop: 4, marginBottom: SIZES.padding },
  pricingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SIZES.padding / 2 },
  priceContainer: { alignItems: 'flex-end' },
  productPrice: { ...FONTS.h1, color: COLORS.text },
  mrpContainer: { flexDirection: 'row', alignItems: 'center', gap: SIZES.base },
  mrpText: { ...FONTS.body, color: COLORS.textMuted, textDecorationLine: 'line-through' },
  discountText: { ...FONTS.body, color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
  bvText: { ...FONTS.body, color: COLORS.primary, fontWeight: '600', marginTop: SIZES.padding },
  quantityStepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: SIZES.radius },
  stepperButton: { padding: SIZES.padding / 1.5 },
  quantityText: { ...FONTS.h2, fontSize: 18, marginHorizontal: SIZES.padding },
  detailsContainer: { paddingHorizontal: SIZES.padding },
  accordionContainer: { paddingVertical: SIZES.padding / 2, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SIZES.padding / 2 },
  accordionTitle: { ...FONTS.h2, fontSize: 16 },
  accordionContent: { ...FONTS.body, paddingBottom: SIZES.padding / 2 },
  accordionContentInner: { paddingBottom: SIZES.padding / 2 },
  relatedSection: { backgroundColor: COLORS.background, paddingTop: SIZES.padding, paddingBottom: SIZES.padding * 2 },
  relatedTitle: { ...FONTS.h2, paddingHorizontal: SIZES.padding, marginBottom: SIZES.base },
  relatedListContent: { paddingHorizontal: SIZES.padding },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', height: 75, padding: SIZES.padding, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border, gap: SIZES.padding / 2 },
  bottomButton: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: SIZES.radius },
  addToCartButton: { backgroundColor: COLORS.primary },
  buyNowButton: { borderWidth: 1.5, borderColor: COLORS.primary },
  bottomButtonText: { ...FONTS.h2, fontSize: 16 },
  addToCartText: { color: COLORS.white },
  buyNowText: { color: COLORS.primary },
});

export default ProductDetailsScreen;