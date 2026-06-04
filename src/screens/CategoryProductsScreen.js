import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { usePincode } from '../context/PincodeContext';
import { productService } from '../services/productService'; // We will create this service next
import ProductCard from '../components/ProductCard'; // Assuming you have a ProductCard component

const CategoryProductsScreen = ({ route, navigation }) => {
  // Get the category details passed from the previous screen
  const { categoryId, categoryName, isSubcategory } = route.params;
  const { pincode } = usePincode(); // Get the current pincode to fetch relevant products

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Set the screen title to the category name
  useEffect(() => {
    navigation.setOptions({ title: categoryName });
  }, [navigation, categoryName]);

  // Function to fetch products for this category
  const fetchProducts = async (pageNum = 1) => {
    if (!pincode) return;
    
    if (pageNum === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    
    setError('');
    try {
      let response;
      if (isSubcategory) {
        response = await productService.getProductsBySubcategory(categoryId, pincode, pageNum);
      } else {
        response = await productService.getProductsByCategory(categoryId, pincode, pageNum);
      }

      if (response && response.status) {
        // If it's the first page, set the products. Otherwise, add to the list for infinite scroll.
        setProducts(prev => (pageNum === 1 ? response.data : [...prev, ...response.data]));
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
        }
      } else {
        setError(response.message || 'Could not load products.');
      }
    } catch (e) {
      setError(e.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Fetch products when the screen loads or pincode/category changes
  useEffect(() => {
    setPage(1);
    fetchProducts(1);
  }, [categoryId, pincode]);

  const handleLoadMore = () => {
    if (!isLoadingMore && page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color="#0CA201" />
      </View>
    );
  };

  if (isLoading && page === 1) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#0CA201" /></View>;
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
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <View style={styles.productCardContainer}>
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
          />
        </View>
      )}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      numColumns={2} // Creates a grid layout
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        !isLoading && (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No products found in this category.</Text>
          </View>
        )
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  listContainer: { padding: 8 },
  productCardContainer: {
    flex: 1 / 2, // Each item takes up half the width
    padding: 8,
  },
  errorText: { fontSize: 16, color: '#D32F2F', textAlign: 'center', marginBottom: 15 },
  retryText: { fontSize: 16, color: '#007bff', fontWeight: 'bold' },
  emptyText: { fontSize: 16, color: 'gray' },
});

export default CategoryProductsScreen;