import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from '../context/CartContext';

const mockAddToCart = (product, quantity) => {
  Alert.alert(
    'Item Added',
    `Added ${quantity} x ${product.name} to your cart.`,
  );
};

const ProductCard = ({ product, onPress }) => {
  const { addToCart } = useCart();
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

  const handleAddToCart = () => {
    // Call the global addToCart function
    addToCart(product, moq);
  };

  // 1. Create the attribute string (similar to your Details screen)
  const attributeDisplay =
    product.attributes && product.attributes.length > 0
      ? product.attributes.map(a => a.value).join(', ')
      : '';

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
          {product.brand_name || 'Generic'}
        </Text>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>

        {/* ✅ ADD THIS NEW SECTION FOR ATTRIBUTES */}
        {attributeDisplay ? (
          <Text style={styles.attributeText}>{attributeDisplay}</Text>
        ) : null}

        {bv > 0 && <Text style={styles.bvText}>Earn {bv.toFixed(2)} BV</Text>}

        <View style={styles.footer}>
          <View style={styles.priceInfo}>
            <Text style={styles.sellingPrice}>₹{sellingPrice.toFixed(2)}</Text>
            {hasDiscount && <Text style={styles.mrp}>₹{mrp.toFixed(2)}</Text>}
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
            <Icon name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    margin: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#fff',
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
  },
  productImage: {
    width: '100%',
    height: 135, // Increased from 120 to make it slightly bigger
    alignSelf: 'center',
  },
  cardContent: {
    padding: 8, // Reduced from 12
    flex: 1,
    justifyContent: 'space-between',
  },
  brandName: {
    fontSize: 11, // Reduced from 12
    color: '#6c757d',
    marginBottom: 0, // Reduced from 2
  },
  productName: {
    fontSize: 13, // Reduced from 14
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 2, // Added to provide minimal spacing instead of fixed minHeight
  },

  attributeText: {
    fontSize: 11, // Reduced from 12
    color: '#57595e',
    marginTop: 0,
    marginBottom: 2, // Reduced spacing
    fontWeight: '400',
  },

  bvText: {
    fontSize: 11, // Reduced from 12
    fontWeight: '500',
    color: '#007bff',
    marginTop: 2, // Reduced spacing
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4, // Reduced spacing
  },
  priceInfo: {
    flexDirection: 'column',
  },
  sellingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2a9d8f',
  },
  mrp: {
    fontSize: 12,
    color: '#6c757d',
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: '#0CA201',
    width: 32, // Reduced from 40
    height: 32, // Reduced from 40
    borderRadius: 16, // Reduced from 20
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  // --- GENERIC BADGE STYLE ---
  badge: {
    position: 'absolute',
    top: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // --- SPECIFIC BADGE STYLES ---
  discountBadge: {
    left: -8,
    top: -10,
    backgroundColor: '#0CA201', // Red/Orange for discount
  },
  moqBadge: {
    right: 3,
    top: -10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Neutral dark for info
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
