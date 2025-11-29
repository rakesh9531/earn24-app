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
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { productService } from '../services';
import ProductCard from '../components/ProductCard'; // Your existing ProductCard component
import SortModal from '../components/SortModal';

const SearchResultsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { query } = route.params;

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [appliedFilters, setAppliedFilters] = useState({});
    const [isSortModalVisible, setIsSortModalVisible] = useState(false);
    const [appliedSortOption, setAppliedSortOption] = useState('popularity');

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const performSearch = useCallback(async (pageNum = 1, isNewSearch = true) => {
        if (isNewSearch) {
            setIsLoading(true);
            setProducts([]);
        } else {
            setIsLoadingMore(true);
        }

        try {
            const { productService } = require('../services/productService');
            const response = await productService.search({ 
                query, 
                ...appliedFilters,
                sortBy: appliedSortOption,
                page: pageNum,
            });

            if (response.status && response.data) {
                if (isNewSearch) {
                    setProducts(response.data.products);
                } else {
                    setProducts(prevProducts => [...prevProducts, ...response.data.products]);
                }
                setTotalPages(response.data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [query, appliedFilters, appliedSortOption]);

    useEffect(() => {
        if (route.params?.newFilters) {
            setAppliedFilters(route.params.newFilters);
        }
    }, [route.params?.newFilters]);
    
    useEffect(() => {
        setPage(1);
        performSearch(1, true);
    }, [query, appliedFilters, appliedSortOption]);

    const handleApplySort = (selectedOption) => {
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

    if (isLoading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#0CA201" /></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.filterBar}>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Filter', { currentFilters: appliedFilters })}>
                    <Icon name="filter-outline" size={20} color="#333" />
                    <Text style={styles.actionButtonText}>Filter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => setIsSortModalVisible(true)}>
                    <Icon name="swap-vertical-outline" size={20} color="#333" />
                    <Text style={styles.actionButtonText}>Sort</Text>
                </TouchableOpacity>
            </View>

            {/* ==========================================================
                === THE FIX IS HERE: Added numColumns and key props    ===
                ========================================================== */}
            <FlatList
                data={products}
                renderItem={({ item }) => <ProductCard product={item} />}
                keyExtractor={(item) => item.offer_id.toString()}
                numColumns={2} // This creates the two-column grid layout
                key={2} // Add a key to force re-render if layout changes (good practice)
                contentContainerStyle={styles.productList}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={
                    <View style={styles.centered}><Text>No products found for "{query}".</Text></View>
                }
            />

            <SortModal
                visible={isSortModalVisible}
                onClose={() => setIsSortModalVisible(false)}
                onApply={handleApplySort}
                currentSortOption={appliedSortOption}
            />
        </SafeAreaView>
    );
};

// --- STYLES (Unchanged) ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
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
        color: '#1F2937'
    },
    productList: {
        paddingHorizontal: 8,
    },
});

export default SearchResultsScreen;