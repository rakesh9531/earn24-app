import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoriteContext';
import ProductCard from '../components/ProductCard';
import FloatingCartBar from '../components/FloatingCartBar';

const FavouriteScreen = () => {
  const navigation = useNavigation();
  const { token } = useAuth();
  const { favoriteProducts, isLoading } = useFavorites();

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleShopPress = () => {
    navigation.navigate('Home');
  };

  // 1. Unauthenticated State Screen
  if (!token) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Favorites</Text>
        </View>
        <View style={styles.centerContainer}>
          <View style={styles.iconCircle}>
            <Icon name="heart-dislike-outline" size={60} color="#7C7C7C" />
          </View>
          <Text style={styles.title}>Favorites list is locked</Text>
          <Text style={styles.subtitle}>
            Please log in to save and view your favorite items. Save products you love for quick checkouts!
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleLoginPress}>
            <Text style={styles.buttonText}>Log In / Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 2. Loading State Screen
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Favorites</Text>
        </View>
        <View style={[styles.centerContainer, { justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color="#0CA201" />
          <Text style={[styles.subtitle, { marginTop: 15 }]}>Fetching your favorite products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 3. Empty State Screen
  if (favoriteProducts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Favorites</Text>
        </View>
        <View style={styles.centerContainer}>
          <View style={styles.iconCircle}>
            <Icon name="heart-outline" size={60} color="#0CA201" />
          </View>
          <Text style={styles.title}>No Favorites Yet</Text>
          <Text style={styles.subtitle}>
            Explore our categories and tap the heart icon on any product details screen to save them here!
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleShopPress}>
            <Text style={styles.buttonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 4. Favorites Grid List
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{favoriteProducts.length} items</Text>
        </View>
      </View>
      <FlatList
        data={favoriteProducts}
        numColumns={2}
        keyExtractor={(item) => (item.id || item.product_id).toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
          />
        )}
      />
      <FloatingCartBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#181725',
  },
  badgeContainer: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C7C7C',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#181725',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#7C7C7C',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#0CA201',
    paddingVertical: 15,
    borderRadius: 18,
    width: '100%',
    maxWidth: 260,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 10,
    paddingBottom: 20,
  }
});

export default FavouriteScreen;
