import React, { memo, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getRecentlyViewed, clearRecentlyViewed } from '../services/userAffinityService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const RecentlyViewedCard = memo(({ item, onPress, onAddToCart, isAdding }) => {
  if (!item) return null;

  const rawImg = item.main_image_url || item.image_url;
  const imageUrl = rawImg
    ? (rawImg.startsWith('http') || rawImg.startsWith('data:')
        ? rawImg
        : `https://newapi.earn24.in${rawImg}`)
    : 'https://via.placeholder.com/120';

  const sellingPrice = parseFloat(item.selling_price || 0);
  const mrp = parseFloat(item.mrp || 0);
  const hasDiscount = mrp > sellingPrice;
  const discount = hasDiscount ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const bv = parseFloat(item.bv_earned || 0);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        {item.brand_name ? (
          <Text style={styles.brandName} numberOfLines={1}>
            {item.brand_name}
          </Text>
        ) : null}
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>

        {bv > 0 && (
          <Text style={styles.bvBadge}>Earn {bv.toFixed(2)} BV</Text>
        )}

        <View style={styles.priceRow}>
          <View style={styles.priceWrapper}>
            <Text style={styles.sellingPrice}>₹{sellingPrice.toFixed(0)}</Text>
            {hasDiscount && <Text style={styles.mrp}>₹{mrp.toFixed(0)}</Text>}
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddToCart}
            disabled={isAdding}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {isAdding ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Icon name="add" size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const RecentlyViewedSection = ({ navigation, refreshKey }) => {
  const [items, setItems] = useState([]);
  const [addingId, setAddingId] = useState(null);
  const { addToCart } = useCart();
  const { token } = useAuth();

  const loadItems = useCallback(async () => {
    const list = await getRecentlyViewed();
    setItems(list || []);
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems, refreshKey]);

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems])
  );

  const handleClear = async () => {
    await clearRecentlyViewed();
    setItems([]);
  };

  const handleAddToCart = async (product) => {
    if (addingId) return;
    if (!token) {
      if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate('Login');
      }
      return;
    }
    setAddingId(product.id);
    try {
      const moq = parseInt(product.minimum_order_quantity, 10) || 1;
      await addToCart(product, moq);
    } catch (e) {
      console.warn('Failed to add to cart from recently viewed:', e);
    } finally {
      setAddingId(null);
    }
  };

  if (!items || items.length === 0) {
    return null; // Gracefully hidden if no items viewed
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Icon name="time-outline" size={20} color="#059669" style={{ marginRight: 6 }} />
          <Text style={styles.sectionTitle}>Recently Viewed</Text>
        </View>
        <TouchableOpacity onPress={handleClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item, index) => (item && item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <RecentlyViewedCard
            item={item}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
            onAddToCart={() => handleAddToCart(item)}
            isAdding={addingId === item.id}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    marginBottom: 4,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 0.2,
  },
  clearText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  card: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  imageContainer: {
    width: '100%',
    height: 110,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '85%',
    height: '85%',
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#DC2626',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  infoContainer: {
    padding: 8,
  },
  brandName: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 2,
    height: 32,
    lineHeight: 16,
  },
  bvBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  sellingPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  mrp: {
    fontSize: 11,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  addButton: {
    backgroundColor: '#059669',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
});

export default memo(RecentlyViewedSection);
