// // import React, { useState, useEffect } from 'react';
// // import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
// // import { useRoute, useNavigation } from '@react-navigation/native';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import { productService } from '../services/productService'; // You need this service
// // import ProductCard from '../components/ProductCard';       // You need this component
// // import SortModal from '../components/SortModal';           // You need this component

// // const SearchResultsScreen = () => {
// //     const route = useRoute();
// //     const navigation = useNavigation();
// //     const { query } = route.params;

// //     const [products, setProducts] = useState([]);
// //     const [isLoading, setIsLoading] = useState(true);
// //     const [appliedFilters, setAppliedFilters] = useState({});
// //     const [isSortModalVisible, setIsSortModalVisible] = useState(false);
// //     const [appliedSortOption, setAppliedSortOption] = useState('popularity');

// //     // This effect listens for when the user applies new filters from the FilterScreen
// //     useEffect(() => {
// //         if (route.params?.newFilters) {
// //             console.log("Applying new filters:", route.params.newFilters);
// //             setAppliedFilters(route.params.newFilters);
// //         }
// //     }, [route.params?.newFilters]);

// //     // This is the main data-fetching effect. It re-runs whenever the search term,
// //     // the filters, or the sort option changes.
// //     useEffect(() => {
// //         const performSearch = async () => {
// //             setIsLoading(true);
// //             try {
// //                 // Your backend API must be able to handle these parameters
// //                 const response = await productService.search({
// //                     query,
// //                     ...appliedFilters,
// //                     sortBy: appliedSortOption
// //                 });
// //                 if (response.status) {
// //                     setProducts(response.data);
// //                 }
// //             } catch (error) {
// //                 console.error("Search failed:", error);
// //             } finally {
// //                 setIsLoading(false);
// //             }
// //         };
// //         performSearch();
// //     }, [query, appliedFilters, appliedSortOption]);

// //     const handleApplySort = (selectedOption) => {
// //         setAppliedSortOption(selectedOption);
// //         setIsSortModalVisible(false);
// //     };

// //     if (isLoading) {
// //         return <View style={styles.centered}><ActivityIndicator size="large" color="#0CA201" /></View>;
// //     }

// //     return (
// //         <SafeAreaView style={styles.container}>
// //             <View style={styles.filterBar}>
// //                 <TouchableOpacity
// //                     style={styles.actionButton}
// //                     onPress={() => navigation.navigate('Filter', { currentFilters: appliedFilters })}
// //                 >
// //                     <Icon name="filter-outline" size={20} color="#333" />
// //                     <Text style={styles.actionButtonText}>Filter</Text>
// //                 </TouchableOpacity>

// //                 <TouchableOpacity
// //                     style={styles.actionButton}
// //                     onPress={() => setIsSortModalVisible(true)}
// //                 >
// //                     <Icon name="swap-vertical-outline" size={20} color="#333" />
// //                     <Text style={styles.actionButtonText}>Sort</Text>
// //                 </TouchableOpacity>
// //             </View>

// //             <FlatList
// //                 data={products}
// //                 renderItem={({ item }) => <ProductCard product={item} containerStyle={{ width: '50%' }} />}
// //                 keyExtractor={(item) => item.product_id.toString()}
// //                 numColumns={2}
// //                 contentContainerStyle={styles.productList}
// //                 ListEmptyComponent={
// //                     <View style={styles.centered}><Text>No products found for "{query}".</Text></View>
// //                 }
// //             />

// //             <SortModal
// //                 visible={isSortModalVisible}
// //                 onClose={() => setIsSortModalVisible(false)}
// //                 onApply={handleApplySort}
// //                 currentSortOption={appliedSortOption}
// //             />
// //         </SafeAreaView>
// //     );
// // };

// // const styles = StyleSheet.create({
// //     container: { flex: 1, backgroundColor: '#FFFFFF' },
// //     centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
// //     filterBar: {
// //         flexDirection: 'row',
// //         paddingVertical: 12,
// //         paddingHorizontal: 16,
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#E5E7EB',
// //         backgroundColor: '#FFFFFF',
// //         gap: 12,
// //     },
// //     actionButton: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         paddingVertical: 8,
// //         paddingHorizontal: 16,
// //         backgroundColor: '#F3F4F6',
// //         borderRadius: 20,
// //     },
// //     actionButtonText: {
// //         marginLeft: 8,
// //         fontSize: 14,
// //         fontWeight: '500',
// //         color: '#1F2937'
// //     },
// //     productList: {
// //         paddingTop: 8,
// //     },
// // });

// // export default SearchResultsScreen;

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// // We REMOVE the import from the top: import { productService } from '../services/productService';
// import ProductCard from '../components/ProductCard';
// import SortModal from '../components/SortModal';

// const SearchResultsScreen = () => {
//     const route = useRoute();
//     const navigation = useNavigation();
//     const { query } = route.params;

//     const [products, setProducts] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [appliedFilters, setAppliedFilters] = useState({});
//     const [isSortModalVisible, setIsSortModalVisible] = useState(false);
//     const [appliedSortOption, setAppliedSortOption] = useState('popularity');

//     useEffect(() => {
//         if (route.params?.newFilters) {
//             setAppliedFilters(route.params.newFilters);
//         }
//     }, [route.params?.newFilters]);

//     useEffect(() => {
//         const performSearch = async () => {
//             // ==========================================================
//             // === THE FIX IS HERE: Import the service inside the effect ===
//             // ==========================================================
//             const { productService } = require('../services/productService');

//             setIsLoading(true);
//             try {
//                 const response = await productService.search({
//                     query,
//                     ...appliedFilters,
//                     sortBy: appliedSortOption
//                 });
//                 if (response.status && response.data && Array.isArray(response.data.products)) {
//                     setProducts(response.data.products);
//                 } else {
//                     // Handle cases where the API call might succeed but return no products
//                     setProducts([]);
//                 }
//             } catch (error) {
//                 console.error("Search failed:", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         performSearch();
//     }, [query, appliedFilters, appliedSortOption]);

//     const handleApplySort = (selectedOption) => {
//         setAppliedSortOption(selectedOption);
//         setIsSortModalVisible(false);
//     };

//     if (isLoading) {
//         return <View style={styles.centered}><ActivityIndicator size="large" color="#0CA201" /></View>;
//     }

//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.filterBar}>
//                 <TouchableOpacity
//                     style={styles.actionButton}
//                     onPress={() => navigation.navigate('Filter', { currentFilters: appliedFilters })}
//                 >
//                     <Icon name="filter-outline" size={20} color="#333" />
//                     <Text style={styles.actionButtonText}>Filter</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     style={styles.actionButton}
//                     onPress={() => setIsSortModalVisible(true)}
//                 >
//                     <Icon name="swap-vertical-outline" size={20} color="#333" />
//                     <Text style={styles.actionButtonText}>Sort</Text>
//                 </TouchableOpacity>
//             </View>

//             <FlatList
//                 data={products}
//                 renderItem={({ item }) => <ProductCard product={item} containerStyle={{ width: '50%' }} />}
//                 keyExtractor={(item) => item.product_id.toString()}
//                 numColumns={2}
//                 contentContainerStyle={styles.productList}
//                 ListEmptyComponent={
//                     <View style={styles.centered}><Text>No products found for "{query}".</Text></View>
//                 }
//             />

//             <SortModal
//                 visible={isSortModalVisible}
//                 onClose={() => setIsSortModalVisible(false)}
//                 onApply={handleApplySort}
//                 currentSortOption={appliedSortOption}
//             />
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#FFFFFF' },
//     centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
//     filterBar: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#FFFFFF', gap: 12 },
//     actionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#F3F4F6', borderRadius: 20 },
//     actionButtonText: { marginLeft: 8, fontSize: 14, fontWeight: '500', color: '#1F2937' },
//     productList: { paddingTop: 8 },
// });

// export default SearchResultsScreen;

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import SortModal from '../components/SortModal';
import FloatingCartBar from '../components/FloatingCartBar';
import { usePincode } from '../context/PincodeContext';

const SearchResultsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { pincode } = usePincode();
  const initialQuery = route.params?.query || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchError, setSearchError] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [appliedSortOption, setAppliedSortOption] = useState('popularity');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const performSearch = useCallback(
    async (pageNum = 1, isNewSearch = true, overrideQuery = null) => {
      const activeQuery = overrideQuery !== null ? overrideQuery : searchQuery;
      console.log('[DEBUG performSearch] Running search for:', activeQuery, 'pincode:', pincode, 'page:', pageNum);
      if (isNewSearch) {
        setIsLoading(true);
        setProducts([]);
        setSearchError(null);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const searchPayload = {
          query: activeQuery,
          pincode: pincode && pincode !== 'undefined' && pincode !== 'null' ? pincode : 'ALL',
          sortBy: appliedSortOption,
          page: pageNum,
        };
        if (appliedFilters && typeof appliedFilters === 'object') {
          Object.keys(appliedFilters).forEach((k) => {
            if (appliedFilters[k] !== undefined && appliedFilters[k] !== null && appliedFilters[k] !== 'undefined') {
              searchPayload[k] = appliedFilters[k];
            }
          });
        }

        const response = await productService.search(searchPayload);

        if (response && response.status && response.data) {
          const fetchedProducts = response.data.products || [];
          if (isNewSearch) {
            setProducts(fetchedProducts);
          } else {
            setProducts(prevProducts => [
              ...prevProducts,
              ...fetchedProducts,
            ]);
          }
          if (response.data.pagination) {
            setTotalPages(response.data.pagination.totalPages || 1);
          }
          if (fetchedProducts.length === 0 && isNewSearch) {
            setSearchError(`No matching products found for "${activeQuery}".`);
          }
        } else {
          setSearchError(response?.message || 'Search request failed.');
        }
      } catch (error) {
        console.error('Search failed:', error);
        setSearchError(error.message || 'Network error occurred while searching.');
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [searchQuery, appliedFilters, appliedSortOption, pincode],
  );

  useEffect(() => {
    if (route.params?.query) {
      setSearchQuery(route.params.query);
      setPage(1);
      performSearch(1, true, route.params.query);
    }
  }, [route.params?.query]);

  useEffect(() => {
    if (route.params?.newFilters) {
      setAppliedFilters(route.params.newFilters);
      performSearch(1, true);
    }
  }, [route.params?.newFilters]);

  const handleApplySort = selectedOption => {
    setAppliedSortOption(selectedOption);
    setIsSortModalVisible(false);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      performSearch(nextPage, false);
    }
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Live Interactive Search Header Bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
          <Icon name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 8, paddingHorizontal: 10, height: 40 }}>
          <Icon name="search-outline" size={18} color="#64748B" />
          <TextInput
            style={{ flex: 1, marginLeft: 8, fontSize: 14, color: '#1E293B' }}
            placeholder="Search products..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => performSearch(1, true)}
            returnKeyType="search"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => { setSearchQuery(''); navigation.goBack(); }}>
              <Icon name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity onPress={() => performSearch(1, true)} style={{ marginLeft: 10, backgroundColor: '#0CA201', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
          <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 13 }}>Search</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0CA201" />
        </View>
      ) : (
        <>
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate('Filter', { currentFilters: appliedFilters })
          }
        >
          <Icon name="filter-outline" size={20} color="#333" />
          <Text style={styles.actionButtonText}>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setIsSortModalVisible(true)}
        >
          <Icon name="swap-vertical-outline" size={20} color="#333" />
          <Text style={styles.actionButtonText}>Sort</Text>
        </TouchableOpacity>
      </View>

      {/* ==========================================================
                === THE FIX IS HERE: Added numColumns and key props    ===
                ========================================================== */}
      <FlatList
        data={products}
        // renderItem={({ item }) => <ProductCard product={item} />}

        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() =>
              navigation.navigate('ProductDetails', { product: item })
            }
          />
        )}
        keyExtractor={(item, index) => (item && (item.offer_id || item.id || item.product_id) ? (item.offer_id || item.id || item.product_id).toString() : index.toString())}
        numColumns={2} // This creates the two-column grid layout
        key={2} // Add a key to force re-render if layout changes (good practice)
        contentContainerStyle={styles.productList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={{ color: '#64748B', fontSize: 14 }}>No products found for "{searchQuery}".</Text>
          </View>
        }
      />

      <SortModal
        visible={isSortModalVisible}
        onClose={() => setIsSortModalVisible(false)}
        onApply={handleApplySort}
        currentSortOption={appliedSortOption}
      />
      </>
      )}
      <FloatingCartBar />
    </SafeAreaView>
  );
};

// --- STYLES (Unchanged) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 6 : 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  filterBar: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  productList: {
    paddingHorizontal: 8,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B71C1C',
  },
  errorText: {
    fontSize: 12,
    color: '#C62828',
    marginTop: 2,
  },
  retryBtn: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});

export default SearchResultsScreen;
