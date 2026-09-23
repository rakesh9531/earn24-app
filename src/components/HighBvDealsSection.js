import React, { memo, useMemo, useState } from 'react';
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
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const HighBvCard = memo(({ item, onPress, onAddToCart, isAdding }) => {
  if (!item) return null;

  const rawImg = item.main_image_url || item.image_url;
  const imageUrl = rawImg
    ? (rawImg.startsWith('http') || rawImg.startsWith('data:')
        ? rawImg
        : `https://newapi.earn24.in${rawImg}`)
    : 'https://via.placeholder.com/130';

  const sellingPrice = parseFloat(item.selling_price || 0);
  const mrp = parseFloat(item.mrp || 0);
  const hasDiscount = mrp > sellingPrice;
  const discount = hasDiscount ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const bv = parseFloat(item.bv_earned || 0);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        {bv > 0 && (
          <View style={styles.bvPill}>
            <Text style={styles.bvPillText}>+{bv.toFixed(1)} BV</Text>
          </View>
        )}
        {hasDiscount && (
          <View style={styles.discountTag}>
            <Text style={styles.discountTagText}>{discount}% OFF</Text>
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

        <View style={styles.priceRow}>
          <View style={styles.priceCol}>
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

const HighBvDealsSection = ({ topBvDeals, productSections, navigation, selectedCategoryId, categories }) => {
  const [addingId, setAddingId] = useState(null);
  const { addToCart } = useCart();
  const { token } = useAuth();

  const activeCategory = useMemo(() => {
    if (!selectedCategoryId || !Array.isArray(categories)) return null;
    return categories.find(c => c.id === selectedCategoryId);
  }, [selectedCategoryId, categories]);

  const { deals, isCategorySpecific } = useMemo(() => {
    // 1. If a category is selected, collect matching products from topBvDeals & productSections
    if (selectedCategoryId) {
      const matchedProducts = [];
      const seenIds = new Set();

      // Check topBvDeals for items matching this category
      if (Array.isArray(topBvDeals)) {
        for (const item of topBvDeals) {
          const itemCatId = item.category_id || item.parent_category_id;
          if (itemCatId === selectedCategoryId) {
            const pid = item.id || item.product_id;
            if (pid && !seenIds.has(pid)) {
              seenIds.add(pid);
              matchedProducts.push(item);
            }
          }
        }
      }

      // Check productSections for this category
      if (Array.isArray(productSections)) {
        for (const section of productSections) {
          if (section.parent_category_id === selectedCategoryId || section.id === selectedCategoryId) {
            if (Array.isArray(section.products)) {
              for (const prod of section.products) {
                const pid = prod.id || prod.product_id;
                if (pid && !seenIds.has(pid)) {
                  seenIds.add(pid);
                  matchedProducts.push(prod);
                }
              }
            }
          }
        }
      }

      // Sort matched products: Highest BV first, then highest discount
      matchedProducts.sort((a, b) => {
        const bvA = parseFloat(a.bv_earned || 0);
        const bvB = parseFloat(b.bv_earned || 0);
        if (bvB !== bvA) return bvB - bvA;

        const mrpA = parseFloat(a.mrp || 0);
        const spA = parseFloat(a.selling_price || 0);
        const discA = mrpA > spA ? (mrpA - spA) / mrpA : 0;

        const mrpB = parseFloat(b.mrp || 0);
        const spB = parseFloat(b.selling_price || 0);
        const discB = mrpB > spB ? (mrpB - spB) / mrpB : 0;

        return discB - discA;
      });

      // If category has at least 2 deals, use them!
      if (matchedProducts.length >= 2) {
        return { deals: matchedProducts.slice(0, 25), isCategorySpecific: true };
      }
    }

    // 2. Global fallback: topBvDeals or sorted productSections across whole store
    if (Array.isArray(topBvDeals) && topBvDeals.length > 0) {
      return { deals: topBvDeals.slice(0, 25), isCategorySpecific: false };
    }

    if (!Array.isArray(productSections) || productSections.length === 0) {
      return { deals: [], isCategorySpecific: false };
    }

    const allProducts = [];
    const seenIds = new Set();

    for (const section of productSections) {
      if (Array.isArray(section.products)) {
        for (const prod of section.products) {
          const pid = prod.id || prod.product_id;
          if (pid && !seenIds.has(pid)) {
            seenIds.add(pid);
            allProducts.push(prod);
          }
        }
      }
    }

    const sorted = allProducts.sort((a, b) => {
      const bvA = parseFloat(a.bv_earned || 0);
      const bvB = parseFloat(b.bv_earned || 0);
      if (bvB !== bvA) return bvB - bvA;

      const mrpA = parseFloat(a.mrp || 0);
      const spA = parseFloat(a.selling_price || 0);
      const discA = mrpA > spA ? (mrpA - spA) / mrpA : 0;

      const mrpB = parseFloat(b.mrp || 0);
      const spB = parseFloat(b.selling_price || 0);
      const discB = mrpB > spB ? (mrpB - spB) / mrpB : 0;

      return discB - discA;
    });

    return { deals: sorted.slice(0, 25), isCategorySpecific: false };
  }, [selectedCategoryId, topBvDeals, productSections]);

  const handleAddToCart = async (product) => {
    if (addingId) return;
    if (!token) {
      if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate('Login');
      }
      return;
    }

    const pid = product.id || product.product_id;
    setAddingId(pid);
    try {
      const moq = parseInt(product.minimum_order_quantity, 10) || 1;
      await addToCart(product, moq);
    } catch (e) {
      console.warn('Failed to add to cart from High BV deals:', e);
    } finally {
      setAddingId(null);
    }
  };

  if (!deals || deals.length === 0) {
    return null;
  }

  const categoryName = activeCategory?.name;
  const sectionTitle = (isCategorySpecific && categoryName)
    ? `Top Deals in ${categoryName}`
    : 'Top BV & Super Deals';
  const sectionSubtitle = (isCategorySpecific && categoryName)
    ? `Best savings & high BV on ${categoryName}`
    : 'Maximum earnings & highest discounts';

  const handleSeeAll = () => {
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate('CategoryProducts', {
        isTopBv: true,
        categoryName: sectionTitle,
        dealsList: deals,
        categoryId: isCategorySpecific ? selectedCategoryId : undefined,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View style={styles.diamondBadge}>
            <Icon name="diamond" size={14} color="#FFFFFF" />
          </View>
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.sectionTitle}>{sectionTitle}</Text>
            <Text style={styles.sectionSubtitle}>{sectionSubtitle}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleSeeAll}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.seeAllText}>See all &gt;</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={deals}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <HighBvCard
            item={item}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
            onAddToCart={() => handleAddToCart(item)}
            isAdding={addingId === (item.id || item.product_id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    marginBottom: 6,
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
  diamondBadge: {
    backgroundColor: '#059669',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  seeAllText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  card: {
    width: 130,
    marginRight: 10,
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
    height: 100,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '85%',
    height: '85%',
  },
  bvPill: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#047857',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bvPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  discountTag: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: '#DC2626',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountTagText: {
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
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  priceCol: {
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

export default memo(HighBvDealsSection);
