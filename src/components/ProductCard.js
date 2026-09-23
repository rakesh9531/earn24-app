import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const mockAddToCart = (product, quantity) => {
  Alert.alert(
    'Item Added',
    `Added ${quantity} x ${product.name} to your cart.`,
  );
};

const ProductCard = ({ product, onPress }) => {
  const navigation = useNavigation();
  const { addToCart } = useCart();
  const { token } = useAuth();
  const [isAdding, setIsAdding] = React.useState(false);

  if (!product) return null;
  const imageUrl = product.main_image_url
    ? `https://newapi.earn24.in${product.main_image_url}` // IMPORTANT: Use your PC's IP
    : 'https://via.placeholder.com/150';

  // Safely parse all numbers from the API
  const sellingPrice = parseFloat(product.selling_price || 0);
  const mrp = parseFloat(product.mrp || 0);
  const bv = parseFloat(product.bv_earned || 0);
  const moq = parseInt(product.minimum_order_quantity, 10) || 1;

  // --- DERIVED VALUES FOR DISPLAY LOGIC ---
  const hasDiscount = mrp > sellingPrice;
  const discount = hasDiscount
    ? Math.round(((mrp - sellingPrice) / mrp) * 100)
    : 0;
  const showMoqBadge = moq > 1;

  // const handleAddToCart = () => {
  //     mockAddToCart(product, moq);
  // };

  const handleAddToCart = async () => {
    if (isAdding) return;
    if (!token) {
      navigation.navigate('Login');
      return;
    }
    setIsAdding(true);
    try {
      await addToCart(product, moq);
    } catch (e) {
      console.error('Failed to add to cart:', e);
    } finally {
      setIsAdding(false);
    }
  };

  // 1. Create the attribute string safely (Crash Proof)
  let parsedAttrs = [];
  if (Array.isArray(product.attributes)) {
    parsedAttrs = product.attributes;
  } else if (typeof product.attributes === 'string' && product.attributes.trim().length > 0) {
    try { parsedAttrs = JSON.parse(product.attributes); } catch (e) { parsedAttrs = []; }
  }
  const attrList = Array.isArray(parsedAttrs) ? parsedAttrs : [];
  const attributeDisplay = attrList.length > 0
    ? attrList.map(a => (typeof a === 'object' && a !== null ? (a.value || a.attribute_value || '') : String(a))).filter(Boolean).join(', ')
    : '';

  const rawRating = parseFloat(product.avg_rating || product.rating || 0);
  const totalReviews = parseInt(product.total_reviews || product.review_count || 0, 10);
  const hasRating = totalReviews > 0 || rawRating > 0;

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.productImage}
          resizeMode="contain"
        />

        {/* --- DISCOUNT BADGE (LEFT SIDE) --- */}
        {hasDiscount && (
          <View style={[styles.badge, styles.discountBadge]}>
            <Text style={styles.badgeText}>{discount}% OFF</Text>
          </View>
        )}

        {/* --- MOQ BADGE (RIGHT SIDE) --- */}
        {showMoqBadge && (
          <View style={[styles.badge, styles.moqBadge]}>
            <Text style={styles.badgeText}>Min Qty: {moq}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.brandName} numberOfLines={1}>
          {product.brand_name || 'Generic'} {product.seller_name ? `• ${product.seller_name}` : ''}
        </Text>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Rating Row - Only render if product has actual ratings/reviews */}
        {hasRating ? (
          <View style={styles.ratingRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingBadgeText}>{rawRating.toFixed(1)} ★</Text>
            </View>
            <Text style={styles.reviewCountText}>({totalReviews})</Text>
          </View>
        ) : null}

        {/* ✅ ATTRIBUTES */}
        {attributeDisplay ? (
          <Text style={styles.attributeText}>{attributeDisplay}</Text>
        ) : null}

        {bv > 0 && <Text style={styles.bvText}>Earn {bv.toFixed(2)} BV</Text>}

        <View style={styles.footer}>
          <View style={styles.priceInfo}>
            <Text style={styles.sellingPrice}>₹{sellingPrice.toFixed(2)}</Text>
            {hasDiscount && <Text style={styles.mrp}>₹{mrp.toFixed(2)}</Text>}
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddToCart} disabled={isAdding}>
            {isAdding ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Icon name="add" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 110,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  productImage: {
    width: '85%',
    height: '85%',
    alignSelf: 'center',
  },
  cardContent: {
    padding: 8,
    flex: 1,
    justifyContent: 'space-between',
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
  attributeText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '400',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  ratingBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  reviewCountText: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '500',
  },
  bvText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  priceInfo: {
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
  // --- GENERIC BADGE STYLE ---
  badge: {
    position: 'absolute',
    top: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  discountBadge: {
    left: 6,
    backgroundColor: '#DC2626',
  },
  moqBadge: {
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  favoriteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});

export default memo(ProductCard, (prevProps, nextProps) => {
  const prevP = prevProps.product;
  const nextP = nextProps.product;
  if (!prevP || !nextP) return false;
  return prevP.offer_id === nextP.offer_id &&
         prevP.id === nextP.id &&
         prevP.selling_price === nextP.selling_price &&
         prevP.mrp === nextP.mrp &&
         prevP.bv_earned === nextP.bv_earned &&
         prevP.minimum_order_quantity === nextP.minimum_order_quantity &&
         prevP.main_image_url === nextP.main_image_url &&
         prevP.name === nextP.name;
});
