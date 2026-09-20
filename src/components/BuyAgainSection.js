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
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const BuyAgainCard = memo(({ item, onPress, onReorder, isAdding }) => {
  if (!item) return null;

  const rawImg = item.imageUrl || item.display_image_url || item.main_image_url;
  const imageUrl = rawImg
    ? (rawImg.startsWith('http') || rawImg.startsWith('data:')
        ? rawImg
        : `https://newapi.earn24.in${rawImg}`)
    : 'https://via.placeholder.com/120';

  const price = parseFloat(item.price || item.selling_price || 0);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        <View style={styles.reorderTag}>
          <Icon name="repeat" size={10} color="#059669" style={{ marginRight: 2 }} />
          <Text style={styles.reorderTagText}>Re-order</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.productName || item.name || 'Product'}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>
            {price > 0 ? `₹${price.toFixed(0)}` : 'Best Price'}
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={onReorder}
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

const BuyAgainSection = ({ navigation, refreshKey }) => {
  const [items, setItems] = useState([]);
  const [addingKey, setAddingKey] = useState(null);
  const { token } = useAuth();
  const { addToCart } = useCart();

  const loadPastItems = useCallback(async () => {
    if (!token) {
      setItems([]);
      return;
    }

    try {
      const response = await orderService.getOrderHistory(1, 10);
      if (response && response.status && Array.isArray(response.data)) {
        const extracted = [];
        const seenKeys = new Set();

        for (const ord of response.data) {
          // If order has detailed items array
          if (Array.isArray(ord.items) && ord.items.length > 0) {
            for (const it of ord.items) {
              const pid = it.productId || it.product_id || it.id;
              const key = pid ? String(pid) : it.productName;
              if (key && !seenKeys.has(key)) {
                seenKeys.add(key);
                extracted.push({
                  productId: pid,
                  id: pid,
                  name: it.productName || it.name,
                  productName: it.productName || it.name,
                  price: it.price || it.sellingPrice || 0,
                  imageUrl: it.imageUrl || it.image_url,
                  brandName: it.brandName,
                  minimum_order_quantity: it.minimum_order_quantity || 1,
                });
              }
            }
          } else if (ord.first_item_name) {
            // Fallback from order card summary
            const key = ord.first_item_name;
            if (!seenKeys.has(key)) {
              seenKeys.add(key);
              extracted.push({
                id: ord.product_id || ord.id,
                productId: ord.product_id || ord.id,
                name: ord.first_item_name,
                productName: ord.first_item_name,
                price: ord.total_amount || 0,
                imageUrl: ord.display_image_url,
                minimum_order_quantity: 1,
              });
            }
          }
        }

        setItems(extracted.slice(0, 10));
      }
    } catch (error) {
      console.warn('BuyAgainSection: Failed to load past orders', error);
      setItems([]);
    }
  }, [token]);

  useEffect(() => {
    loadPastItems();
  }, [loadPastItems, refreshKey]);

  useFocusEffect(
    useCallback(() => {
      loadPastItems();
    }, [loadPastItems])
  );

  const handleProductPress = async (item) => {
    const pid = item.productId || item.id;
    if (pid && productService && productService.getProductById) {
      try {
        const res = await productService.getProductById(pid);
        if (res && res.status && res.data) {
          navigation.navigate('ProductDetails', { product: res.data });
          return;
        }
      } catch (e) {
        console.warn('Error fetching product for buy again', e);
      }
    }
    // Fallback directly with available data
    navigation.navigate('ProductDetails', { product: item });
  };

  const handleReorder = async (item) => {
    const key = item.productId || item.id;
    if (addingKey) return;
    setAddingKey(key);

    try {
      const productPayload = {
        id: item.productId || item.id,
        name: item.productName || item.name,
        selling_price: item.price || 0,
        main_image_url: item.imageUrl,
        minimum_order_quantity: item.minimum_order_quantity || 1,
      };
      await addToCart(productPayload, 1);
    } catch (e) {
      console.warn('Failed to add re-order item to cart:', e);
    } finally {
      setAddingKey(null);
    }
  };

  if (!items || items.length === 0) {
    return null; // Hidden if user has no orders or not logged in
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Icon name="repeat-outline" size={20} color="#059669" style={{ marginRight: 6 }} />
          <Text style={styles.sectionTitle}>Buy Again</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('OrderHistory')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.seeAllText}>All Orders &gt;</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item, index) =>
          item.productId ? item.productId.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <BuyAgainCard
            item={item}
            onPress={() => handleProductPress(item)}
            onReorder={() => handleReorder(item)}
            isAdding={addingKey === (item.productId || item.id)}
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
  seeAllText: {
    fontSize: 13,
    color: '#059669',
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
  reorderTag: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 0.8,
    borderColor: '#A7F3D0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  reorderTagText: {
    color: '#059669',
    fontSize: 9,
    fontWeight: '700',
  },
  infoContainer: {
    padding: 8,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    height: 32,
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
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

export default memo(BuyAgainSection);
