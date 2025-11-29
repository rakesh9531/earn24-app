// import React, { useState, useCallback } from 'react';
// import {
//   View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList,
//   Image, TouchableOpacity, ActivityIndicator
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import SelectDropdown from 'react-native-select-dropdown';
// import Swiper from 'react-native-swiper';
// import { mlmService } from '../services/mlmService';
// import ProductCarousel from '../components/ProductCarousel';
// import FloatingCartBar from '../components/FloatingCartBar';
// import CartIcon from '../components/CartIcon'; 

// // Static components from your original code
// const OfferBanner = () => (
//   <View style={styles.bannerContainer}>
//     <View style={styles.bannerTextContent}>
//       <Text style={styles.bannerTitle}>Up to 30% offer</Text>
//       <Text style={styles.bannerSubtitle}>Enjoy our big offer</Text>
//       <TouchableOpacity style={styles.bannerButton}>
//         <Text style={styles.bannerButtonText}>Shop Now</Text>
//       </TouchableOpacity>
//     </View>
//     <Image source={require('../assets/images/banner.png')} style={styles.bannerImage} />
//   </View>
// );

// const CategoryItem = ({ item }) => (
//   <TouchableOpacity style={styles.categoryItem}>
//     <Image 
//       source={item.image_url ? { uri: `http://192.168.0.171:3000${item.image_url}` } : require('../assets/images/banner.png')} 
//       style={styles.categoryImage} 
//     />
//     <Text style={styles.categoryName}>{item.name}</Text>
//   </TouchableOpacity>
// );

// // --- MAIN HOME SCREEN ---
// const HomeScreen = ({ navigation }) => {
//   const [selectedCategory, setSelectedCategory] = useState('All Categories');
//   const [homeData, setHomeData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const userPincode = '828207';

//   const loadData = useCallback(async () => {
//     // Don't set loading to true here, do it before the call
//     try {
//       const response = await mlmService.getHomeScreenData(userPincode);
//       if (response && response.status) {
//         setHomeData(response.data);
//       } else {
//         setError(response.message || "Failed to load data.");
//       }
//     } catch (e) {
//       console.error("Failed to load home screen data", e);
//       setError(e.message || "An error occurred.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [userPincode]);

//   useFocusEffect(
//     useCallback(() => {
//       setIsLoading(true); // Set loading to true right before fetching
//       loadData();
//     }, [loadData])
//   );

//   // --- THIS IS THE FIX ---
//   // We define categoryNames here, but we will use it inside the return statement
//   // so it has access to the latest `homeData`.
//   const categoryNames = ['All Categories', ...(homeData?.categories?.map(c => c.name) || [])];

//   if (isLoading) {
//     return <View style={styles.centeredLoader}><ActivityIndicator size="large" color="#0CA201" /></View>;
//   }

//   if (error) {
//     return <View style={styles.centeredLoader}><Text style={styles.errorText}>{error}</Text></View>;
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <SelectDropdown
//           data={categoryNames} // This now uses the correctly calculated array
//           onSelect={(selectedItem) => setSelectedCategory(selectedItem)}
//           defaultValueByIndex={0}
//           renderButton={(selectedItem, isOpened) => (
//             <View style={styles.headerLeft}>
//               <Icon name="grid" size={24} color="#333" />
//               <Text style={styles.headerTitle}>{selectedItem || 'All Categories'}</Text>
//               <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} size={24} color="#333" />
//             </View>
//           )}
//           renderItem={(item, index, isSelected) => (
//             <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
//               <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
//             </View>
//           )}
//           showsVerticalScrollIndicator={false}
//           dropdownStyle={styles.dropdownMenuStyle}
//         />
//         {/* <TouchableOpacity><Icon name="basket-outline" size={28} color="#333" /></TouchableOpacity> */}
//         <CartIcon />
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View style={styles.content}>
//           <OfferBanner />
          
//           {homeData?.categories && homeData.categories.length > 0 &&
//             <FlatList
//               data={homeData.categories}
//               renderItem={({ item }) => <CategoryItem item={item} />}
//               keyExtractor={(item) => item.id.toString()}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               style={styles.categoryList}
//             />
//           }
          
//           {homeData?.productSections?.map(section => (
//             <ProductCarousel
//                 key={section.id}
//                 section={section}
//                 onProductPress={(product) => navigation.navigate('ProductDetails', { product: product })}
//                 onSeeAllPress={(s) => {/* Navigate to category page */}}
//             />
//           ))}
//         </View>
//       </ScrollView>
//        <FloatingCartBar />
//     </SafeAreaView>
//   );
// };


// const styles = StyleSheet.create({
//   // ------------------ General Layout ------------------
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   centeredLoader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   content: {
//     paddingBottom: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     color: 'red',
//   },

//   // ------------------ Header ------------------
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 50,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 10,
//     marginRight: 5,
//   },

//   // ------------------ Dropdown ------------------
//   dropdownMenuStyle: {
//     backgroundColor: '#E9ECEF',
//     borderRadius: 8,
//   },
//   dropdownItemStyle: {
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//   },
//   dropdownItemTxtStyle: {
//     flex: 1,
//     fontSize: 18,
//     fontWeight: '500',
//     color: '#151E26',
//   },

//   // ------------------ Banner ------------------
//   bannerContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#E0F2F1',
//     borderRadius: 15,
//     overflow: 'hidden',
//     marginTop: 10,
//     marginHorizontal: 20,
//     height: 150,
//     alignItems: 'center',
//   },
//   bannerTextContent: {
//     flex: 1,
//     paddingLeft: 20,
//   },
//   bannerImage: {
//     width: 150,
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   bannerTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#264653',
//   },
//   bannerSubtitle: {
//     fontSize: 14,
//     color: '#2A9D8F',
//     marginTop: 5,
//   },
//   bannerButton: {
//     backgroundColor: '#0CA201',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginTop: 15,
//     alignSelf: 'flex-start',
//   },
//   bannerButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },

//   // ------------------ Categories ------------------
//   categoryList: {
//     marginVertical: 20,
//     paddingHorizontal: 20,
//   },
//   categoryItem: {
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   categoryImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#F3F3F3',
//     padding: 10,
//     resizeMode: 'contain',
//   },
//   categoryName: {
//     marginTop: 5,
//     fontSize: 12,
//   },
// });



// export default HomeScreen;














// import React, { useState, useCallback, useEffect } from 'react';
// import {
//   View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList,
//   Image, TouchableOpacity, ActivityIndicator, RefreshControl
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import SelectDropdown from 'react-native-select-dropdown';
// import { mlmService } from '../services/mlmService';
// import ProductCarousel from '../components/ProductCarousel';
// import FloatingCartBar from '../components/FloatingCartBar';
// import CartIcon from '../components/CartIcon';
// import PincodeModal from '../components/PincodeModal'; // Import PincodeModal
// import { usePincode } from '../context/PincodeContext'; // Import usePincode hook

// // --- Static Components ---
// const OfferBanner = () => (
//   <View style={styles.bannerContainer}>
//     <View style={styles.bannerTextContent}>
//       <Text style={styles.bannerTitle}>Up to 30% offer</Text>
//       <Text style={styles.bannerSubtitle}>Enjoy our big offer</Text>
//       <TouchableOpacity style={styles.bannerButton}>
//         <Text style={styles.bannerButtonText}>Shop Now</Text>
//       </TouchableOpacity>
//     </View>
//     <Image source={require('../assets/images/banner.png')} style={styles.bannerImage} />
//   </View>
// );

// const CategoryItem = ({ item, navigation }) => (
//   <TouchableOpacity 
//     style={styles.categoryItem} 
//     onPress={() => navigation.navigate('CategoryProducts', { categoryId: item.id, categoryName: item.name })}
//   >
//     <Image 
//       source={item.image_url ? { uri: `http://192.168.0.171:3000${item.image_url}` } : require('../assets/images/banner.png')} 
//       style={styles.categoryImage} 
//     />
//     <Text style={styles.categoryName} numberOfLines={1}>{item.name}</Text>
//   </TouchableOpacity>
// );

// // --- MAIN HOME SCREEN ---
// const HomeScreen = ({ navigation }) => {
//   const { pincode, isLoadingPincode } = usePincode();

//   const [homeData, setHomeData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false); // For data fetching
//   const [error, setError] = useState('');

//   // A memoized function to fetch data based on the current pincode
//   const loadData = useCallback(async (currentPincode) => {
//     if (!currentPincode) return;

//     setIsLoading(true);
//     setError('');
//     try {
//       const response = await mlmService.getHomeScreenData(currentPincode);
//       if (response && response.status) {
//         setHomeData(response.data);
//       } else {
//         setError(response.message || "Failed to load data.");
//       }
//     } catch (e) {
//       console.error("Failed to load home screen data", e);
//       setError(e.message || "An error occurred.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // Effect to trigger data fetching when the pincode is available or changes
//   useEffect(() => {
//     if (!isLoadingPincode && pincode) {
//       loadData(pincode);
//     }
//   }, [pincode, isLoadingPincode, loadData]);

//   const categoryNames = ['All Categories', ...(homeData?.categories?.map(c => c.name) || [])];

//   // --- Render logic based on the current state ---

//   // State 1: Checking for a saved pincode
//   if (isLoadingPincode) {
//     return <View style={styles.centeredLoader}><ActivityIndicator size="large" color="#0CA201" /></View>;
//   }

//   // State 2: No pincode found, force user to enter one
//   if (!pincode) {
//     return <PincodeModal visible={true} />;
//   }

//   // State 3: Pincode exists, but we are loading data for the first time
//   if (isLoading && !homeData) {
//     return <View style={styles.centeredLoader}><ActivityIndicator size="large" color="#0CA201" /></View>;
//   }

//   // State 4: An error occurred during data fetching
//   if (error) {
//     return (
//       <View style={styles.centeredLoader}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity onPress={() => loadData(pincode)}>
//           <Text style={styles.retryText}>Tap to retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // State 5: Success! Render the main screen content
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <SelectDropdown
//           data={categoryNames}
//           onSelect={(selectedItem) => {
//             if (selectedItem !== 'All Categories') {
//               const category = homeData?.categories?.find(c => c.name === selectedItem);
//               if (category) {
//                 navigation.navigate('CategoryProducts', { categoryId: category.id, categoryName: category.name });
//               }
//             }
//           }}
//           defaultValueByIndex={0}
//           renderButton={(selectedItem, isOpened) => (
//             <View style={styles.headerLeft}>
//               <Icon name="grid" size={24} color="#333" />
//               <Text style={styles.headerTitle}>{selectedItem || 'All Categories'}</Text>
//               <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} size={24} color="#333" />
//             </View>
//           )}
//           renderItem={(item, index, isSelected) => (
//             <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
//               <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
//             </View>
//           )}
//           showsVerticalScrollIndicator={false}
//           dropdownStyle={styles.dropdownMenuStyle}
//         />
//         <CartIcon />
//       </View>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//         refreshControl={
//           <RefreshControl refreshing={isLoading} onRefresh={() => loadData(pincode)} colors={["#0CA201"]} tintColor={"#0CA201"} />
//         }
//       >
//         <OfferBanner />
        
//         {homeData?.categories && homeData.categories.length > 0 &&
//           <FlatList
//             data={homeData.categories}
//             renderItem={({ item }) => <CategoryItem item={item} navigation={navigation} />}
//             keyExtractor={(item) => item.id.toString()}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.categoryList}
//           />
//         }
        
//         {homeData?.productSections?.map(section => (
//           <ProductCarousel
//             key={section.id}
//             section={section}
//             onProductPress={(product) => navigation.navigate('ProductDetails', { product: product })}
//             onSeeAllPress={(s) => navigation.navigate('CategoryProducts', { categoryId: s.id, categoryName: s.title.replace('Best in ', '') })}
//           />
//         ))}
//       </ScrollView>
//        <FloatingCartBar />
//     </SafeAreaView>
//   );
// };


// const styles = StyleSheet.create({
//   // ------------------ General Layout ------------------
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   centeredLoader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   content: {
//     paddingBottom: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     color: 'red',
//   },

//   // ------------------ Header ------------------
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 50,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 10,
//     marginRight: 5,
//   },

//   // ------------------ Dropdown ------------------
//   dropdownMenuStyle: {
//     backgroundColor: '#E9ECEF',
//     borderRadius: 8,
//   },
//   dropdownItemStyle: {
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//   },
//   dropdownItemTxtStyle: {
//     flex: 1,
//     fontSize: 18,
//     fontWeight: '500',
//     color: '#151E26',
//   },

//   // ------------------ Banner ------------------
//   bannerContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#E0F2F1',
//     borderRadius: 15,
//     overflow: 'hidden',
//     marginTop: 10,
//     marginHorizontal: 20,
//     height: 150,
//     alignItems: 'center',
//   },
//   bannerTextContent: {
//     flex: 1,
//     paddingLeft: 20,
//   },
//   bannerImage: {
//     width: 150,
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   bannerTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#264653',
//   },
//   bannerSubtitle: {
//     fontSize: 14,
//     color: '#2A9D8F',
//     marginTop: 5,
//   },
//   bannerButton: {
//     backgroundColor: '#0CA201',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginTop: 15,
//     alignSelf: 'flex-start',
//   },
//   bannerButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },

//   // ------------------ Categories ------------------
//   categoryList: {
//     marginVertical: 20,
//     paddingHorizontal: 20,
//   },
//   categoryItem: {
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   categoryImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#F3F3F3',
//     padding: 10,
//     resizeMode: 'contain',
//   },
//   categoryName: {
//     marginTop: 5,
//     fontSize: 12,
//   },
// });

// export default HomeScreen;







// Working code 

// import React, { useState, useCallback, useEffect } from 'react';
// import {
//   StyleSheet, SafeAreaView, FlatList,
//   View, Text, ActivityIndicator, RefreshControl, TouchableOpacity
// } from 'react-native';
// import { mlmService } from '../services/mlmService';
// import ProductCarousel from '../components/ProductCarousel';
// import FloatingCartBar from '../components/FloatingCartBar';
// import CartIcon from '../components/CartIcon';
// import PincodeModal from '../components/PincodeModal';
// import { usePincode } from '../context/PincodeContext';
// import LocationHeader from '../components/LocationHeader';
// import HomeScreenHeader from '../components/HomeScreenHeader'; // Import the beautiful header

// const HomeScreen = ({ navigation }) => {
//   const { pincode, isLoadingPincode } = usePincode();
//   const [isPincodeModalVisible, setIsPincodeModalVisible] = useState(false);
  
//   const [homeData, setHomeData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const loadData = useCallback(async (currentPincode) => {
//     if (!currentPincode) return;
//     setIsLoading(true);
//     setError('');
//     try {
//       const response = await mlmService.getHomeScreenData(currentPincode);
//       if (response && response.status) {
//         setHomeData(response.data);
//       } else {
//         console.log("Failed to load data ssfd")
//         setError(response.message || "Failed to load data.");
//       }
//     } catch (e) {
//       setError(e.message || "An error occurred.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (!isLoadingPincode && pincode) {
//       loadData(pincode);
//     }
//   }, [pincode, isLoadingPincode, loadData]);

//   // Set the dynamic header with location and cart icon
//   useEffect(() => {
//     navigation.setOptions({
//         headerTitle: () => <LocationHeader onPress={() => setIsPincodeModalVisible(true)} />,
//         headerRight: () => <View style={{ marginRight: 15 }}><CartIcon /></View>,
//         headerShadowVisible: false,
//         headerTitleAlign: 'left',
//         headerLeft: () => null,
//         headerStyle: { backgroundColor: 'white' }
//     });
//   }, [navigation]);

//   if (isLoadingPincode) {
//     return <View style={styles.centeredLoader}><ActivityIndicator size="large" color="#0CA201" /></View>;
//   }

//   // Helper function to render each product carousel
//   const renderProductCarousel = ({ item }) => (
//     <ProductCarousel
//       key={item.id}
//       section={item}
//       onProductPress={(product) => navigation.navigate('ProductDetails', { product })}
//       onSeeAllPress={(s) => navigation.navigate('CategoryProducts', { categoryId: s.id, categoryName: s.title.replace('Best in ', '') })}
//     />
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <PincodeModal
//         visible={!pincode || isPincodeModalVisible}
//         onDismiss={() => setIsPincodeModalVisible(false)}
//       />

//       {isLoading && !homeData ? (
//         <View style={styles.centeredLoader}><ActivityIndicator size="large" color="#0CA201" /></View>
//       ) : error ? (
//         <View style={styles.centeredLoader}>
//           <Text style={styles.errorText}>{error}</Text>
//           <TouchableOpacity onPress={() => loadData(pincode)}>
//             <Text style={styles.retryText}>Tap to retry</Text>
//           </TouchableOpacity>
//         </View>
//       ) : homeData && (
//         <>
//           {/* --- THE CORRECT LAYOUT USING FLATLIST --- */}
//           <FlatList
//             data={homeData.productSections}
//             renderItem={renderProductCarousel}
//             keyExtractor={(item) => item.id.toString()}
//             ListHeaderComponent={
//               // The new, beautiful header component is rendered here
//               <HomeScreenHeader 
//                 banners={homeData.banners} 
//                 categories={homeData.categories} 
//                 navigation={navigation}
//               />
//             }
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.listContent}
//             refreshControl={
//               <RefreshControl refreshing={isLoading} onRefresh={() => loadData(pincode)} colors={["#0CA201"]} />
//             }
//           />
//           <FloatingCartBar />
//         </>
//       )}
//     </SafeAreaView>
//   );
// };

// // --- STYLES FOR THE SCREEN ---
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FFFFFF' },
//   centeredLoader: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
//   listContent: { paddingBottom: 80 },
//   errorText: { fontSize: 16, color: '#D32F2F', textAlign: 'center', marginBottom: 15 },
//   retryText: { fontSize: 16, color: '#007bff', fontWeight: 'bold' },
// });

// export default HomeScreen;









import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  StyleSheet, SafeAreaView, FlatList,
  View, Text, ActivityIndicator, RefreshControl, TouchableOpacity
} from 'react-native';
import { mlmService } from '../services/mlmService';
import ProductCarousel from '../components/ProductCarousel';
import FloatingCartBar from '../components/FloatingCartBar';
import CartIcon from '../components/CartIcon';
import PincodeModal from '../components/PincodeModal';
import { usePincode } from '../context/PincodeContext';
import LocationHeader from '../components/LocationHeader';
import HomeScreenHeader from '../components/HomeScreenHeader';

const HomeScreen = ({ navigation }) => {
  const { pincode, isLoadingPincode } = usePincode();
  const [isPincodeModalVisible, setIsPincodeModalVisible] = useState(false);
  
  const [homeData, setHomeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- STATE TO REMEMBER THE SELECTED CATEGORY ---
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const loadData = useCallback(async (currentPincode) => {
    if (!currentPincode) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await mlmService.getHomeScreenData(currentPincode);
      if (response && response.status) {
        setHomeData(response.data);
        // --- SET THE FIRST CATEGORY AS THE DEFAULT SELECTION ---
        if (response.data.categories && response.data.categories.length > 0) {
           setSelectedCategoryId(response.data.categories[0].id);
        }
      } else {
        setError(response.message || "Failed to load data.");
      }
    } catch (e) {
      setError(e.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoadingPincode && pincode) {
      loadData(pincode);
    }
  }, [pincode, isLoadingPincode, loadData]);

  useEffect(() => {
    navigation.setOptions({
        headerTitle: () => <LocationHeader onPress={() => setIsPincodeModalVisible(true)} />,
        headerRight: () => <View style={{ marginRight: 15 }}><CartIcon /></View>,
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        headerLeft: () => null,
        headerStyle: { backgroundColor: 'white' }
    });
  }, [navigation]);

  // --- FILTER THE "Best in..." LIST BASED ON THE SELECTION ---
  const filteredProductSections = useMemo(() => {
    if (!homeData?.productSections || !selectedCategoryId) {
        return [];
    }
    // IMPORTANT: This assumes your backend API adds a `parent_category_id` to each section.
    return homeData.productSections.filter(
        section => section.parent_category_id === selectedCategoryId
    );
  }, [homeData, selectedCategoryId]);

  if (isLoadingPincode) {
    return <View style={styles.centeredLoader}><ActivityIndicator size="large" color="#0CA201" /></View>;
  }

  const renderProductCarousel = ({ item }) => (
    <ProductCarousel
      key={item.id}
      section={item}
      onProductPress={(product) => navigation.navigate('ProductDetails', { product })}
      onSeeAllPress={(s) => navigation.navigate('CategoryProducts', { categoryId: s.id, categoryName: s.title.replace('Best in ', '') })}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <PincodeModal
        visible={!pincode || isPincodeModalVisible}
        onDismiss={() => setIsPincodeModalVisible(false)}
      />

      {isLoading && !homeData ? (
        <View style={styles.centeredLoader}><ActivityIndicator size="large" color="#0CA201" /></View>
      ) : error ? (
        <View style={styles.centeredLoader}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => loadData(pincode)}>
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      ) : homeData && (
        <>
          <FlatList
            // --- USE THE NEW FILTERED LIST ---
            data={filteredProductSections}
            renderItem={renderProductCarousel}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={
              // --- CONNECT THE HEADER TO THE BRAIN ---
              <HomeScreenHeader 
                banners={homeData.banners} 
                categories={homeData.categories} 
                navigation={navigation}
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={setSelectedCategoryId}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={() => loadData(pincode)} colors={["#0CA201"]} />
            }
          />
          <FloatingCartBar />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  centeredLoader: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  listContent: { paddingBottom: 80 },
  errorText: { fontSize: 16, color: '#D32F2F', textAlign: 'center', marginBottom: 15 },
  retryText: { fontSize: 16, color: '#007bff', fontWeight: 'bold' },
});

export default HomeScreen;