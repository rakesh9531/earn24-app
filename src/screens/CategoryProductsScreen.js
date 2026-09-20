import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { usePincode } from '../context/PincodeContext';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import ProductCard from '../components/ProductCard';
import FloatingCartBar from '../components/FloatingCartBar';
import CartIcon from '../components/CartIcon';

const CategoryProductsScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, isSubcategory, isTopBv, dealsList, isBuyAgain } = route.params || {};
  const { pincode } = usePincode();

  const [products, setProducts] = useState(isTopBv && Array.isArray(dealsList) ? dealsList : []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(!isTopBv || !dealsList || dealsList.length === 0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Set the screen title & Cart icon
  useEffect(() => {
    let screenTitle = categoryName;
    if (!screenTitle) {
      if (isTopBv) screenTitle = 'Top BV & Super Deals';
      else if (isBuyAgain) screenTitle = 'Buy Again';
      else screenTitle = 'Products';
    }
    navigation.setOptions({
      title: screenTitle,
      headerRight: () => (
        <View style={{ marginRight: 15 }}>
          <CartIcon />
        </View>
      ),
    });
  }, [navigation, categoryName, isTopBv, isBuyAgain]);

  const fetchProducts = useCallback(async (pageNum = 1) => {
    const activePincode = pincode || '';

    if (pageNum === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    setError('');
    try {
      let response;
      if (isTopBv) {
        response = await productService.getTopBvDeals(activePincode, pageNum, 20);
      } else if (isBuyAgain) {
        response = await orderService.getPreviouslyPurchasedItems(pageNum, 20);
      } else if (isSubcategory) {
        response = await productService.getProductsBySubcategory(categoryId, activePincode, pageNum);
      } else {
        response = await productService.getProductsByCategory(categoryId, activePincode, pageNum);
      }

      if (response && response.status) {
        const newItems = response.data || [];
        setProducts(prev => (pageNum === 1 ? newItems : [...prev, ...newItems]));
        if (response.pagination && response.pagination.totalPages) {
          setTotalPages(response.pagination.totalPages);
        } else if (newItems.length < 20) {
          setTotalPages(pageNum);
        } else {
          setTotalPages(pageNum + 1);
        }
      } else {
        if (pageNum === 1 && products.length === 0) {
          setError(response?.message || 'Could not load products.');
        }
      }
    } catch (e) {
      if (pageNum === 1 && products.length === 0) {
        setError(e.message || 'An error occurred.');
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [categoryId, isSubcategory, isTopBv, isBuyAgain, pincode]);

  useEffect(() => {
    setPage(1);
    if (isTopBv && Array.isArray(dealsList) && dealsList.length > 0) {
      setProducts(dealsList);
      setIsLoading(false);
      setTotalPages(dealsList.length >= 20 ? 5 : 1);
    } else {
      fetchProducts(1);
    }
  }, [categoryId, pincode, isTopBv, isBuyAgain]);

  const handleLoadMore = () => {
    if (!isLoadingMore && !isLoading && page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  // Real-time client-side search filtering
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      const pName = (p.name || p.product_name || '').toLowerCase();
      const brandMatch = (p.brand_name || '').toLowerCase().includes(q);
      return pName.includes(q) || brandMatch;
    });
  }, [products, searchQuery]);

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color="#0CA201" />
      </View>
    );
  };

  if (isLoading && page === 1) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0CA201" />
      </View>
    );
  }

  if (error && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => fetchProducts(1)}>
          <Text style={styles.retryText}>Tap to retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      {/* --- IN-LIST SEARCH BAR --- */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBarBox}>
          <Icon name="search-outline" size={18} color="#059669" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search in ${categoryName || (isTopBv ? 'Top Deals' : (isBuyAgain ? 'Buy Again' : 'products'))}...`}
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Icon name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <View style={styles.productCardContainer}>
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetails', { product: item })}
            />
          </View>
        )}
        keyExtractor={(item, index) => `${item.id || item.product_id || index}-${index}`}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !isLoading && (
            <View style={styles.centered}>
              <Icon name="search-outline" size={40} color="#CBD5E1" style={{ marginBottom: 8 }} />
              <Text style={styles.emptyText}>
                {searchQuery.trim()
                  ? `No products match "${searchQuery}"`
                  : 'No products found in this section.'}
              </Text>
            </View>
          )
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
      <FloatingCartBar />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchBarWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    padding: 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  listContainer: {
    padding: 6,
    paddingBottom: 80,
  },
  productCardContainer: {
    flex: 1 / 2,
    padding: 6,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CategoryProductsScreen;