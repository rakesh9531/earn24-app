// // import React from 'react';
// // import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
// // import Swiper from 'react-native-swiper';

// // const CategoryItem = ({ item, navigation }) => (
// //   <TouchableOpacity 
// //     style={styles.categoryItem} 
// //     onPress={() => navigation.navigate('CategoryProducts', { categoryId: item.id, categoryName: item.name })}
// //   >
// //     <View style={styles.categoryImageContainer}>
// //       <Image 
// //         source={item.image_url 
// //             ? { uri: `http://192.168.0.171:3000${item.image_url}` } 
// //             : require('../assets/images/banner.png')
// //         } 
// //         style={styles.categoryImage} 
// //       />
// //     </View>
// //     <Text style={styles.categoryName} numberOfLines={2}>{item.name}</Text>
// //   </TouchableOpacity>
// // );

// // const HomeScreenHeader = ({ banners, categories, navigation }) => {
// //   return (
// //     <View>
// //       {/* --- Banners Carousel --- */}
// //       <View style={styles.swiperContainer}>
// //         <Swiper
// //           autoplay
// //           autoplayTimeout={4}
// //           showsPagination
// //           dot={<View style={styles.paginationDot} />}
// //           activeDot={<View style={styles.activePaginationDot} />}
// //         >
// //           {banners.map((banner) => (
// //             <TouchableOpacity key={banner.id} style={styles.slide}>
// //               <View style={styles.bannerContainer}>
                
// //                 {/* Text content */}
// //                 <View style={styles.textContainer}>
// //                   {banner.title && (
// //                     <Text style={styles.bannerTitle} numberOfLines={2}>{banner.title}</Text>
// //                   )}
                  
// //                   <Text style={styles.bannerSubtitle}>Enjoy our big offer</Text>

// //                   <TouchableOpacity style={styles.shopNowButton}>
// //                     <Text style={styles.shopNowButtonText}>Shop Now</Text>
// //                   </TouchableOpacity>
// //                 </View>

// //                 {/* Banner image */}
// //                 {banner.image_url && (
// //                   <View style={styles.imageContainer}>
// //                     <Image
// //                       source={{ uri: `http://192.168.0.171:3000${banner.image_url}` }} 
// //                       style={styles.bannerImage}
// //                     />
// //                   </View>
// //                 )}
// //               </View>
// //             </TouchableOpacity>
// //           ))}
// //         </Swiper>
// //       </View>
      
// //       {/* --- Categories Section --- */}
// //       <View style={styles.categoriesSection}>
// //         <Text style={styles.sectionTitle}>Shop by Category</Text>
// //         <FlatList
// //           data={categories}
// //           renderItem={({ item }) => <CategoryItem item={item} navigation={navigation} />}
// //           keyExtractor={(item) => item.id.toString()}
// //           horizontal
// //           showsHorizontalScrollIndicator={false}
// //           contentContainerStyle={styles.categoryList}
// //         />
// //       </View>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   swiperContainer: {
// //     height: 180,
// //     marginTop: 10,
// //   },
// //   slide: {
// //     flex: 1,
// //     paddingHorizontal: 16,
// //   },
// //   paginationDot: {
// //     backgroundColor: 'rgba(0, 0, 0, 0.2)',
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     margin: 3,
// //   },
// //   activePaginationDot: {
// //     backgroundColor: '#047857',
// //     width: 10,
// //     height: 10,
// //     borderRadius: 5,
// //     margin: 3,
// //   },

// //   bannerContainer: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     backgroundColor: '#ECFDF5',
// //     borderRadius: 20,
// //     overflow: 'hidden',
// //     elevation: 6,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 3 },
// //     shadowOpacity: 0.2,
// //     shadowRadius: 6,
// //   },
// //   textContainer: {
// //     flex: 1,
// //     padding: 20,
// //     justifyContent: 'center',
// //   },
// //   imageContainer: {
// //     width: '48%',
// //     height: '100%',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 12,
// //   },
// //   bannerImage: {
// //     width: '100%',
// //     height: undefined,
// //     aspectRatio: 1.5, // wider image
// //     resizeMode: 'cover',
// //     borderRadius: 12,
// //   },
// //   bannerTitle: {
// //     fontSize: 22,
// //     fontWeight: '800',
// //     color: '#064E3B',
// //     lineHeight: 28,
// //     marginBottom: 6,
// //   },
// //   bannerSubtitle: {
// //     fontSize: 14,
// //     fontWeight: '500',
// //     color: '#047857',
// //     marginBottom: 18,
// //   },
// //   shopNowButton: {
// //     backgroundColor: '#059669',
// //     paddingVertical: 10,
// //     paddingHorizontal: 22,
// //     borderRadius: 10,
// //     alignSelf: 'flex-start',
// //     elevation: 3,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.25,
// //     shadowRadius: 4,
// //   },
// //   shopNowButtonText: {
// //     color: '#FFFFFF',
// //     fontWeight: 'bold',
// //     fontSize: 14,
// //   },

// //   // Category styles
// //   categoriesSection: { marginTop: 24 },
// //   sectionTitle: { fontSize: 20, fontWeight: '700', color: '#111', marginBottom: 16, paddingHorizontal: 16 },
// //   categoryList: { paddingHorizontal: 16 },
// //   categoryItem: { alignItems: 'center', marginRight: 12, width: 80 },
// //   categoryImageContainer: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ECECEC' },
// //   categoryImage: { width: '70%', height: '70%', resizeMode: 'contain' },
// //   categoryName: { marginTop: 8, fontSize: 13, textAlign: 'center', color: '#333', fontWeight: '500' },
// // });

// // export default HomeScreenHeader;








// // import React from 'react';
// // import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
// // import Swiper from 'react-native-swiper';

// // // --- DESIGN SYSTEM CONSTANTS ---
// // const COLORS = {
// //   primary: '#059669',
// //   primaryDark: '#064E3B',
// //   white: '#FFFFFF',
// //   text: '#1F2937',
// //   textLight: '#6B7280',
// //   background: '#F9FAFB',
// //   surface: '#FFFFFF',
// //   border: '#E5E7EB',
// // };

// // const SIZES = {
// //   padding: 16,
// //   radius: 20,
// //   base: 8,
// // };

// // // --- Category Item Component ---
// // const CategoryItem = ({ item, navigation }) => (
// //   <TouchableOpacity 
// //     style={styles.categoryItem} 
// //     onPress={() => navigation.navigate('CategoryProducts', { categoryId: item.id, categoryName: item.name })}
// //   >
// //     <View style={styles.categoryImageContainer}>
// //       <Image 
// //         source={item.image_url 
// //             ? { uri: `http://192.168.0.171:3000${item.image_url}` } 
// //             : require('../assets/images/banner.png')
// //         } 
// //         style={styles.categoryImage} 
// //       />
// //     </View>
// //     <Text style={styles.categoryName} numberOfLines={2}>{item.name}</Text>
// //   </TouchableOpacity>
// // );

// // // --- The Main Header Component (Final Version with Key Fix) ---
// // const HomeScreenHeader = ({ banners, categories, navigation }) => {
// //   return (
// //     <View>
// //       {/* --- Banners Carousel --- */}
// //       <View style={styles.swiperContainer}>
// //         <Swiper
// //           autoplay
// //           autoplayTimeout={4}
// //           showsPagination
// //           dot={<View style={styles.paginationDot} />}
// //           activeDot={<View style={styles.activePaginationDot} />}
// //         >
// //           {banners.map((banner) => (
// //             // ========================================================
// //             // === THE KEY PROP FIX IS HERE                         ===
// //             // The top-level element returned by .map() is now a View
// //             // with the unique key. This is the most stable pattern.
// //             // ========================================================
// //             <View key={banner.id} style={styles.slide}>
// //               <TouchableOpacity style={styles.bannerContainer} activeOpacity={0.9}>
                
// //                 {/* Text content */}
// //                 <View style={styles.textContainer}>
// //                   {banner.title && (
// //                     <Text style={styles.bannerTitle} numberOfLines={2}>{banner.title}</Text>
// //                   )}
                  
// //                   <Text style={styles.bannerSubtitle}>Enjoy our big offer</Text>

// //                   <TouchableOpacity style={styles.shopNowButton}>
// //                     <Text style={styles.shopNowButtonText}>Shop Now</Text>
// //                   </TouchableOpacity>
// //                 </View>

// //                 {/* Banner image */}
// //                 {banner.image_url && (
// //                   <View style={styles.imageContainer}>
// //                     <Image
// //                       source={{ uri: `http://192.168.0.171:3000${banner.image_url}` }} 
// //                       style={styles.bannerImage}
// //                     />
// //                   </View>
// //                 )}
// //               </TouchableOpacity>
// //             </View>
// //           ))}
// //         </Swiper>
// //       </View>
      
// //       {/* --- Categories Section --- */}
// //       <View style={styles.categoriesSection}>
// //         <Text style={styles.sectionTitle}>Shop by Category</Text>
// //         <FlatList
// //           data={categories}
// //           renderItem={({ item }) => <CategoryItem item={item} navigation={navigation} />}
// //           keyExtractor={(item) => item.id.toString()}
// //           horizontal
// //           showsHorizontalScrollIndicator={false}
// //           contentContainerStyle={styles.categoryList}
// //         />
// //       </View>
// //     </View>
// //   );
// // };

// // // --- STYLES (Unchanged from previous polished version) ---
// // const styles = StyleSheet.create({
// //   swiperContainer: {
// //     height: 180,
// //     marginTop: 10,
// //   },
// //   slide: {
// //     flex: 1,
// //     paddingHorizontal: SIZES.padding,
// //   },
// //   paginationDot: {
// //     backgroundColor: 'rgba(0, 0, 0, 0.2)',
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     margin: 3,
// //   },
// //   activePaginationDot: {
// //     backgroundColor: COLORS.primaryDark,
// //     width: 10,
// //     height: 10,
// //     borderRadius: 5,
// //     margin: 3,
// //   },
// //   bannerContainer: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     backgroundColor: '#ECFDF5',
// //     borderRadius: SIZES.radius,
// //     overflow: 'hidden',
// //     elevation: 6,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 3 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 6,
// //   },
// //   textContainer: {
// //     flex: 1,
// //     padding: 20,
// //     justifyContent: 'center',
// //   },
// //   imageContainer: {
// //     width: '48%',
// //     height: '100%',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 12,
// //   },
// //   bannerImage: {
// //     width: '100%',
// //     height: undefined,
// //     aspectRatio: 1.5,
// //     resizeMode: 'cover',
// //     borderRadius: 12,
// //   },
// //   bannerTitle: {
// //     fontSize: 22,
// //     fontWeight: '800',
// //     color: COLORS.primaryDark,
// //     lineHeight: 28,
// //     marginBottom: 6,
// //   },
// //   bannerSubtitle: {
// //     fontSize: 14,
// //     fontWeight: '500',
// //     color: COLORS.primary,
// //     marginBottom: 18,
// //   },
// //   shopNowButton: {
// //     backgroundColor: COLORS.primary,
// //     paddingVertical: 10,
// //     paddingHorizontal: 22,
// //     borderRadius: 10,
// //     alignSelf: 'flex-start',
// //     elevation: 3,
// //   },
// //   shopNowButtonText: {
// //     color: COLORS.white,
// //     fontWeight: 'bold',
// //     fontSize: 14,
// //   },
// //   categoriesSection: { 
// //     marginTop: SIZES.padding * 1.5,
// //   },
// //   sectionTitle: { 
// //     fontSize: 20, 
// //     fontWeight: '700', 
// //     color: '#111', 
// //     marginBottom: SIZES.padding, 
// //     paddingHorizontal: SIZES.padding 
// //   },
// //   categoryList: { 
// //     paddingHorizontal: SIZES.padding 
// //   },
// //   categoryItem: { 
// //     alignItems: 'center', 
// //     marginRight: SIZES.padding, 
// //     width: 80 
// //   },
// //   categoryImageContainer: { 
// //     width: 70, 
// //     height: 70, 
// //     borderRadius: 35, 
// //     backgroundColor: COLORS.surface, 
// //     justifyContent: 'center', 
// //     alignItems: 'center', 
// //     borderWidth: 1, 
// //     borderColor: COLORS.border 
// //   },
// //   categoryImage: { 
// //     width: '70%', 
// //     height: '70%', 
// //     resizeMode: 'contain' 
// //   },
// //   categoryName: { 
// //     marginTop: SIZES.base, 
// //     fontSize: 13, 
// //     textAlign: 'center', 
// //     color: '#333', 
// //     fontWeight: '500' 
// //   },
// // });

// // export default HomeScreenHeader;















// import React from 'react';
// import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
// import Swiper from 'react-native-swiper';

// // --- DESIGN SYSTEM CONSTANTS ---
// const COLORS = {
//   primary: '#059669',
//   primaryDark: '#064E3B',
//   white: '#FFFFFF',
//   text: '#1F2937',
//   textLight: '#6B7280',
//   background: '#F9FAFB',
//   surface: '#FFFFFF',
//   border: '#E5E7EB',
// };

// const SIZES = {
//   padding: 16,
//   radius: 20,
//   base: 8,
// };

// // --- Category Item Component ---
// const CategoryItem = ({ item, navigation }) => (
//   <TouchableOpacity 
//     style={styles.categoryItem} 
//     onPress={() => navigation.navigate('CategoryProducts', { categoryId: item.id, categoryName: item.name })}
//   >
//     <View style={styles.categoryImageContainer}>
//       <Image 
//         source={item.image_url 
//             ? { uri: `http://192.168.0.171:3000${item.image_url}` } 
//             : require('../assets/images/banner.png')
//         } 
//         style={styles.categoryImage} 
//       />
//     </View>
//     <Text style={styles.categoryName} numberOfLines={2}>{item.name}</Text>
//   </TouchableOpacity>
// );

// // --- The Main Header Component (Final Bulletproof Version) ---
// const HomeScreenHeader = ({ banners, categories, navigation }) => {
//   // --- Diagnostic Logging ---
//   if (banners && banners.length > 0) {
//     const bannerIds = banners.map(b => b.id);
//     const hasDuplicates = new Set(bannerIds).size !== bannerIds.length;
//     console.log('Banner IDs received:', bannerIds);
//     if (hasDuplicates) {
//         console.error('CRITICAL ERROR: Duplicate banner IDs detected in API data!', bannerIds);
//     }
//   }

//   // Graceful handling for loading state
//   if (!banners || banners.length === 0) {
//     return (
//       <View style={styles.swiperContainer}>
//         <View style={styles.slide}><View style={[styles.bannerContainer, styles.skeletonBanner]} /></View>
//       </View>
//     );
//   }

//   return (
//     <View>
//       {/* Banners Carousel */}
//       <View style={styles.swiperContainer}>
//         <Swiper
//           autoplay
//           autoplayTimeout={4}
//           showsPagination
//           dot={<View style={styles.paginationDot} />}
//           activeDot={<View style={styles.activePaginationDot} />}
//           key={banners.length} // Add a key to the swiper itself
//         >
//           {banners.map((banner, index) => (
//             // ========================================================
//             // === THE BULLETPROOF KEY FIX IS HERE                  ===
//             // ========================================================
//             <View key={`${banner.id}-${index}`} style={styles.slide}>
//               <TouchableOpacity style={styles.bannerContainer} activeOpacity={0.9}>
//                 <View style={styles.textContainer}>
//                   {banner.title && (
//                     <Text style={styles.bannerTitle} numberOfLines={2}>{banner.title}</Text>
//                   )}
//                   <Text style={styles.bannerSubtitle}>Enjoy our big offer</Text>
//                   <TouchableOpacity style={styles.shopNowButton}>
//                     <Text style={styles.shopNowButtonText}>Shop Now</Text>
//                   </TouchableOpacity>
//                 </View>
//                 {banner.image_url && (
//                   <View style={styles.imageContainer}>
//                     <Image
//                       source={{ uri: `http://192.168.0.171:3000${banner.image_url}` }} 
//                       style={styles.bannerImage}
//                     />
//                   </View>
//                 )}
//               </TouchableOpacity>
//             </View>
//           ))}
//         </Swiper>
//       </View>
      
//       {/* Categories Section */}
//       <View style={styles.categoriesSection}>
//         <Text style={styles.sectionTitle}>Shop by Category</Text>
//         <FlatList
//           data={categories}
//           renderItem={({ item }) => <CategoryItem item={item} navigation={navigation} />}
//           keyExtractor={(item) => item.id.toString()}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.categoryList}
//         />
//       </View>
//     </View>
//   );
// };

// // --- STYLES (Unchanged) ---
// const styles = StyleSheet.create({
//   swiperContainer: { height: 180, marginTop: 10 },
//   slide: { flex: 1, paddingHorizontal: 16 },
//   paginationDot: { backgroundColor: 'rgba(0, 0, 0, 0.2)', width: 8, height: 8, borderRadius: 4, margin: 3 },
//   activePaginationDot: { backgroundColor: '#047857', width: 10, height: 10, borderRadius: 5, margin: 3 },
//   bannerContainer: { flex: 1, flexDirection: 'row', backgroundColor: '#ECFDF5', borderRadius: 20, overflow: 'hidden', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6 },
//   skeletonBanner: { backgroundColor: '#E5E7EB' },
//   textContainer: { flex: 1, padding: 20, justifyContent: 'center' },
//   imageContainer: { width: '48%', height: '100%', justifyContent: 'center', alignItems: 'center', padding: 12 },
//   bannerImage: { width: '100%', height: undefined, aspectRatio: 1.5, resizeMode: 'cover', borderRadius: 12 },
//   bannerTitle: { fontSize: 22, fontWeight: '800', color: '#064E3B', lineHeight: 28, marginBottom: 6 },
//   bannerSubtitle: { fontSize: 14, fontWeight: '500', color: '#047857', marginBottom: 18 },
//   shopNowButton: { backgroundColor: '#059669', paddingVertical: 10, paddingHorizontal: 22, borderRadius: 10, alignSelf: 'flex-start', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.25, shadowRadius: 4 },
//   shopNowButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
//   categoriesSection: { marginTop: 24 },
//   sectionTitle: { fontSize: 20, fontWeight: '700', color: '#111', marginBottom: 16, paddingHorizontal: 16 },
//   categoryList: { paddingHorizontal: 16 },
//   categoryItem: { alignItems: 'center', marginRight: 12, width: 80 },
//   categoryImageContainer: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ECECEC' },
//   categoryImage: { width: '70%', height: '70%', resizeMode: 'contain' },
//   categoryName: { marginTop: 8, fontSize: 13, textAlign: 'center', color: '#333', fontWeight: '500' },
// });

// export default HomeScreenHeader;





























// import React from 'react';
// import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
// import Swiper from 'react-native-swiper';

// // --- DESIGN SYSTEM CONSTANTS ---
// const COLORS = {
//   primary: '#059669',
//   primaryDark: '#064E4B',
//   white: '#FFFFFF',
//   text: '#1F2937',
//   textLight: '#6B7280',
//   background: '#F9FAFB',
//   surface: '#FFFFFF',
//   border: '#E5E7EB',
// };

// const SIZES = {
//   padding: 16,
//   radius: 12,
//   base: 8,
// };

// // --- Category Item Component (Unchanged) ---
// const CategoryItem = ({ item, navigation }) => (
//   <TouchableOpacity 
//     style={styles.categoryItem} 
//     onPress={() => navigation.navigate('CategoryProducts', { categoryId: item.id, categoryName: item.name })}
//   >
//     <View style={styles.categoryImageContainer}>
//       <Image 
//         source={item.image_url 
//             ? { uri: `http://192.168.0.171:3000${item.image_url}` } 
//             : require('../assets/images/banner.png')
//         } 
//         style={styles.categoryImage} 
//       />
//     </View>
//     <Text style={styles.categoryName} numberOfLines={2}>{item.name}</Text>
//   </TouchableOpacity>
// );

// // --- The Main Header Component ---
// const HomeScreenHeader = ({ banners, categories, navigation }) => {

//   const handleBannerPress = (banner) => {
//     Alert.alert("Banner Tapped", `You tapped on banner: ${banner.title || 'Untitled'}`);
//   };

//   // Graceful handling for loading state
//   if (!banners || banners.length === 0) {
//     return (
//       <View style={[styles.slide, { paddingTop: 10, paddingBottom: 10 }]}>
//           <View style={[styles.bannerContainer, styles.skeletonBanner]} />
//       </View>
//     );
//   }

//   return (
//     <View>
//       {/* ========================================================
//           === BANNERS CAROUSEL (GAP FIXED)                     ===
//           ======================================================== */}
//       <Swiper
//         style={styles.swiper} // <-- APPLY STYLES DIRECTLY TO THE SWIPER
//         autoplay
//         autoplayTimeout={2}
//         showsPagination
//         dot={<View style={styles.paginationDot} />}
//         activeDot={<View style={styles.activePaginationDot} />}
//         key={banners.length}
//       >
//         {banners.map((banner, index) => (
//           <View key={`${banner.id}-${index}`} style={styles.slide}>
//             <TouchableOpacity 
//               style={styles.bannerContainer} 
//               activeOpacity={0.9}
//               onPress={() => handleBannerPress(banner)}
//             >
//               <Image
//                 source={{ uri: `http://192.168.0.171:3000${banner.image_url}` }} 
//                 style={styles.bannerImage}
//               />
//             </TouchableOpacity>
//           </View>
//         ))}
//       </Swiper>
      
//       {/* Categories Section (Unchanged) */}
//       <View style={styles.categoriesSection}>
//         <Text style={styles.sectionTitle}>Shop by Category</Text>
//         <FlatList
//           data={categories}
//           renderItem={({ item }) => <CategoryItem item={item} navigation={navigation} />}
//           keyExtractor={(item) => item.id.toString()}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.categoryList}
//         />
//       </View>
//     </View>
//   );
// };

// // ========================================================
// // === STYLES (UPDATED FOR GAP FIX)                     ===
// // ========================================================
// const styles = StyleSheet.create({
//   // --- THE FIX IS HERE ---
//   swiper: { 
//     // The Swiper component itself now defines the height.
//     // It will be based on the aspect ratio of the content inside.
//     height: 160, // A fixed height often works best with Swiper. Adjust as needed.
//   },
//   slide: { 
//     flex: 1,
//     paddingHorizontal: SIZES.padding,
//     justifyContent: 'center', // Center the banner vertically within the slide
//   },
//   bannerContainer: { 
//     width: '100%',
//     height: '95%', // Use a percentage of the Swiper's height to create padding
//     backgroundColor: COLORS.border,
//     borderRadius: SIZES.radius, 
//     overflow: 'hidden', 
//     // Shadow/elevation can be applied here or on the slide
//     elevation: 4, 
//     shadowColor: '#000', 
//     shadowOffset: { width: 0, height: 2 }, 
//     shadowOpacity: 0.1, 
//     shadowRadius: 5 
//   },
//   bannerImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   // --- END OF FIX ---
  
//   paginationDot: { 
//     backgroundColor: 'rgba(0, 0, 0, 0.3)', 
//     width: 8, 
//     height: 8, 
//     borderRadius: 4, 
//     margin: 3,
//   },
//   activePaginationDot: { 
//     backgroundColor: COLORS.primary, 
//     width: 10, 
//     height: 10, 
//     borderRadius: 5, 
//     margin: 3,
//   },
//   skeletonBanner: { 
//     backgroundColor: '#E5E7EB',
//     height: 150,
//   },
  
//   // -- Categories Section Styles (Unchanged) --
//   categoriesSection: { 
//     marginTop: 24 
//   },
//   sectionTitle: { 
//     fontSize: 20, 
//     fontWeight: '700', 
//     color: '#111', 
//     marginBottom: 16, 
//     paddingHorizontal: SIZES.padding 
//   },
//   categoryList: { 
//     paddingHorizontal: SIZES.padding 
//   },
//   categoryItem: { 
//     alignItems: 'center', 
//     marginRight: 12, 
//     width: 80 
//   },
//   categoryImageContainer: { 
//     width: 70, 
//     height: 70, 
//     borderRadius: 35, 
//     backgroundColor: '#F5F5F5', 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     borderWidth: 1, 
//     borderColor: '#ECECEC' 
//   },
//   categoryImage: { 
//     width: '70%', 
//     height: '70%', 
//     resizeMode: 'contain' 
//   },
//   categoryName: { 
//     marginTop: 8, 
//     fontSize: 13, 
//     textAlign: 'center', 
//     color: '#333', 
//     fontWeight: '500' 
//   },
// });

// export default HomeScreenHeader;















































// Working

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
// import Swiper from 'react-native-swiper';

// // --- DESIGN SYSTEM CONSTANTS ---
// const COLORS = {
//   primary: '#059669',
//   primaryDark: '#064E4B',
//   white: '#FFFFFF',
//   text: '#1F2937',
//   textLight: '#6B7280',
//   background: '#F9FAFB',
//   surface: '#FFFFFF',
//   border: '#E5E7EB',
// };

// const SIZES = {
//   padding: 16,
//   radius: 12,
//   base: 8,
// };

// // --- Sub-Category Item Component ---
// const SubCategoryItem = ({ item, navigation }) => (
//   <TouchableOpacity 
//     style={styles.subCategoryItem} 
//     onPress={() => navigation.navigate('CategoryProducts', { categoryId: item.id, categoryName: item.name })}
//   >
//     <View style={styles.subCategoryImageContainer}>
//       <Image 
//         source={item.image_url 
//             ? { uri: `http://192.168.0.171:3000${item.image_url}` } 
//             : require('../assets/images/banner.png')
//         } 
//         style={styles.subCategoryImage} 
//       />
//     </View>
//     <Text style={styles.subCategoryName} numberOfLines={2}>{item.name}</Text>
//   </TouchableOpacity>
// );

// // --- The Main Header Component with Sub-Category Logic ---
// const HomeScreenHeader = ({ banners, categories, navigation }) => {
//   // --- State to track the currently selected parent category ---
//   const [activeParentCategory, setActiveParentCategory] = useState(null);

//   // Set the first parent category as active when the data loads
//   useEffect(() => {
//     if (categories && categories.length > 0 && !activeParentCategory) {
//       setActiveParentCategory(categories[0]);
//     }
//   }, [categories, activeParentCategory]);

//   const handleBannerPress = (banner) => {
//     Alert.alert("Banner Tapped", `You tapped on banner: ${banner.title || 'Untitled'}`);
//   };

//   // --- Component to render the main category tabs ---
//   const renderParentCategoryTab = ({ item }) => {
//     const isActive = activeParentCategory && activeParentCategory.id === item.id;
//     return (
//       <TouchableOpacity 
//         style={[styles.parentTab, isActive && styles.parentTabActive]}
//         onPress={() => setActiveParentCategory(item)}
//       >
//         <Text style={[styles.parentTabText, isActive && styles.parentTabTextActive]}>{item.name}</Text>
//       </TouchableOpacity>
//     );
//   };

//   // Graceful handling for loading state (for banners)
//   if (!banners || banners.length === 0) {
//     return (
//       <View style={[styles.slide, { paddingTop: 10, paddingBottom: 10 }]}>
//           <View style={[styles.bannerContainer, styles.skeletonBanner]} />
//       </View>
//     );
//   }

//   return (
//     <View>
//       {/* Banners Carousel (Unchanged) */}
//       <Swiper
//         style={styles.swiper}
//         autoplay
//         autoplayTimeout={4}
//         showsPagination
//         dot={<View style={styles.paginationDot} />}
//         activeDot={<View style={styles.activePaginationDot} />}
//         key={banners.length}
//       >
//         {banners.map((banner, index) => (
//           <View key={`${banner.id}-${index}`} style={styles.slide}>
//             <TouchableOpacity 
//               style={styles.bannerContainer} 
//               activeOpacity={0.9}
//               onPress={() => handleBannerPress(banner)}
//             >
//               <Image
//                 source={{ uri: `http://192.168.0.171:3000${banner.image_url}` }} 
//                 style={styles.bannerImage}
//               />
//             </TouchableOpacity>
//           </View>
//         ))}
//       </Swiper>
      
//       {/* --- Categories Section with Parent and Sub-Categories --- */}
//       <View style={styles.categoriesSection}>
//         <Text style={styles.sectionTitle}>Shop by Category</Text>
        
//         {/* Parent Category Tabs */}
//         <FlatList
//           data={categories}
//           renderItem={renderParentCategoryTab}
//           keyExtractor={(item) => item.id.toString()}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.parentTabList}
//         />
        
//         {/* Sub-Category Icons */}
//         {activeParentCategory && (
//           <FlatList
//             data={activeParentCategory.subCategories || []}
//             renderItem={({ item }) => <SubCategoryItem item={item} navigation={navigation} />}
//             keyExtractor={(item) => item.id.toString()}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.subCategoryList}
//           />
//         )}
//       </View>
//     </View>
//   );
// };

// // --- STYLES (UPDATED for the new Tabbed Interface) ---
// const styles = StyleSheet.create({
//   // -- Banner Section Styles --
//   swiper: { height: 160 },
//   slide: { flex: 1, paddingHorizontal: SIZES.padding, justifyContent: 'center' },
//   bannerContainer: { width: '100%', height: '95%', backgroundColor: COLORS.border, borderRadius: SIZES.radius, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
//   bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
//   paginationDot: { backgroundColor: 'rgba(0, 0, 0, 0.3)', width: 8, height: 8, borderRadius: 4, margin: 3 },
//   activePaginationDot: { backgroundColor: COLORS.primary, width: 10, height: 10, borderRadius: 5, margin: 3 },
//   skeletonBanner: { backgroundColor: '#E5E7EB', height: 150 },
  
//   // --- NEW & REDESIGNED CATEGORY STYLES ---
//   categoriesSection: { 
//     marginTop: SIZES.padding,
//   },
//   sectionTitle: { 
//     fontSize: 20, 
//     fontWeight: '700', 
//     color: COLORS.text, 
//     marginBottom: SIZES.padding, 
//     paddingHorizontal: SIZES.padding 
//   },
//   parentTabList: {
//     paddingHorizontal: SIZES.padding,
//     marginBottom: SIZES.padding + 4,
//   },
//   parentTab: {
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     marginRight: 12,
//     backgroundColor: COLORS.surface,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   parentTabActive: {
//     backgroundColor: COLORS.primary,
//     borderColor: COLORS.primary,
//   },
//   parentTabText: {
//     color: COLORS.textLight,
//     fontWeight: '600',
//   },
//   parentTabTextActive: {
//     color: COLORS.white,
//   },
//   subCategoryList: { 
//     paddingHorizontal: SIZES.padding 
//   },
//   subCategoryItem: { 
//     alignItems: 'center', 
//     marginRight: SIZES.padding, 
//     width: 85,
//   },
//   subCategoryImageContainer: { 
//     width: 70, 
//     height: 70, 
//     borderRadius: 35, 
//     backgroundColor: COLORS.surface,
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     marginBottom: SIZES.base,
//   },
//   subCategoryImage: { 
//     width: '100%', 
//     height: '100%',
//     borderRadius: 35,
//     resizeMode: 'cover',
//   },
//   subCategoryName: { 
//     fontSize: 12, 
//     textAlign: 'center', 
//     color: COLORS.textLight, 
//     fontWeight: '600',
//   },
// });

// export default HomeScreenHeader;










import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import Swiper from 'react-native-swiper';

// --- DESIGN SYSTEM CONSTANTS ---
const COLORS = {
  primary: '#059669',
  primaryDark: '#064E4B',
  white: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  border: '#E5E7EB',
};

const SIZES = {
  padding: 16,
  radius: 12,
  base: 8,
};

// --- Sub-Category Item Component ---
const SubCategoryItem = ({ item, navigation }) => (
  <TouchableOpacity 
    style={styles.subCategoryItem} 
    onPress={() => navigation.navigate('CategoryProducts', { categoryId: item.id, categoryName: item.name })}
  >
    <View style={styles.subCategoryImageContainer}>
      <Image 
        source={item.image_url 
            ? { uri: `http://192.168.0.171:3000${item.image_url}` } 
            : require('../assets/images/banner.png')
        } 
        style={styles.subCategoryImage} 
      />
    </View>
    <Text style={styles.subCategoryName} numberOfLines={2}>{item.name}</Text>
  </TouchableOpacity>
);

// --- The Main Header Component, now controlled by HomeScreen ---
const HomeScreenHeader = ({ banners, categories, navigation, selectedCategoryId, onCategorySelect }) => {
  
  const handleBannerPress = (banner) => {
    Alert.alert("Banner Tapped", `You tapped on banner: ${banner.title || 'Untitled'}`);
  };

  const renderParentCategoryTab = ({ item }) => {
    const isActive = selectedCategoryId === item.id;
    return (
      <TouchableOpacity 
        style={[styles.parentTab, isActive && styles.parentTabActive]}
        onPress={() => onCategorySelect(item.id)}
      >
        <Text style={[styles.parentTabText, isActive && styles.parentTabTextActive]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  // Graceful handling for loading state (for banners)
  if (!banners || banners.length === 0) {
    return (
      <View style={[styles.slide, { paddingTop: 10, paddingBottom: 10 }]}>
          <View style={[styles.bannerContainer, styles.skeletonBanner]} />
      </View>
    );
  }
  
  // FIND the active category object based on the ID received from the parent
  const activeParentCategory = categories?.find(cat => cat.id === selectedCategoryId);

  return (
    <View>
      {/* Banners Carousel (Unchanged) */}
      <Swiper
        style={styles.swiper}
        autoplay
        autoplayTimeout={4}
        showsPagination
        dot={<View style={styles.paginationDot} />}
        activeDot={<View style={styles.activePaginationDot} />}
        key={banners.length}
      >
        {banners.map((banner, index) => (
          <View key={`${banner.id}-${index}`} style={styles.slide}>
            <TouchableOpacity 
              style={styles.bannerContainer} 
              activeOpacity={0.9}
              onPress={() => handleBannerPress(banner)}
            >
              <Image
                source={{ uri: `http://192.168.0.171:3000${banner.image_url}` }} 
                style={styles.bannerImage}
              />
            </TouchableOpacity>
          </View>
        ))}
      </Swiper>
      
      {/* --- Categories Section with Parent and Sub-Categories --- */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        
        {/* Parent Category Tabs */}
        <FlatList
          data={categories}
          renderItem={renderParentCategoryTab}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.parentTabList}
        />
        
        {/* Sub-Category Icons */}
        {activeParentCategory && (
          <FlatList
            data={activeParentCategory.subCategories || []}
            renderItem={({ item }) => <SubCategoryItem item={item} navigation={navigation} />}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subCategoryList}
          />
        )}
      </View>
    </View>
  );
};

// --- STYLES (UPDATED for the new Tabbed Interface) ---
const styles = StyleSheet.create({
  // -- Banner Section Styles --
  swiper: { height: 160 },
  slide: { flex: 1, paddingHorizontal: SIZES.padding, justifyContent: 'center' },
  bannerContainer: { width: '100%', height: '95%', backgroundColor: COLORS.border, borderRadius: SIZES.radius, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
  bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  paginationDot: { backgroundColor: 'rgba(0, 0, 0, 0.3)', width: 8, height: 8, borderRadius: 4, margin: 3 },
  activePaginationDot: { backgroundColor: COLORS.primary, width: 10, height: 10, borderRadius: 5, margin: 3 },
  skeletonBanner: { backgroundColor: '#E5E7EB', height: 150 },
  
  // --- NEW & REDESIGNED CATEGORY STYLES ---
  categoriesSection: { 
    marginTop: SIZES.padding,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: COLORS.text, 
    marginBottom: SIZES.padding, 
    paddingHorizontal: SIZES.padding 
  },
  parentTabList: {
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding + 4,
  },
  parentTab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  parentTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  parentTabText: {
    color: COLORS.textLight,
    fontWeight: '600',
  },
  parentTabTextActive: {
    color: COLORS.white,
  },
  subCategoryList: { 
    paddingHorizontal: SIZES.padding 
  },
  subCategoryItem: { 
    alignItems: 'center', 
    marginRight: SIZES.padding, 
    width: 85,
  },
  subCategoryImageContainer: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    backgroundColor: COLORS.surface,
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: SIZES.base,
  },
  subCategoryImage: { 
    width: '100%', 
    height: '100%',
    borderRadius: 35,
    resizeMode: 'cover',
  },
  subCategoryName: { 
    fontSize: 12, 
    textAlign: 'center', 
    color: COLORS.textLight, 
    fontWeight: '600',
  },
});

export default HomeScreenHeader;