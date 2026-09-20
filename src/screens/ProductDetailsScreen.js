import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Dimensions,
  Modal,
  Share,
  PanResponder,
} from 'react-native';
import RenderHtml from 'react-native-render-html'; 
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useCart } from '../context/CartContext';
import { mlmService } from '../services/mlmService';
import { usePincode } from '../context/PincodeContext'; 
import ProductCard from '../components/ProductCard';
import FloatingCartBar from '../components/FloatingCartBar';
import PincodeModal from '../components/PincodeModal';
import { useFavorites } from '../context/FavoriteContext';
import { useAuth } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProductReviews } from '../services/reviewService';
import { getProductById } from '../services/productService';
import { recordProductView } from '../services/userAffinityService';
import moment from 'moment';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- DESIGN SYSTEM ---
const COLORS = {
  primary: '#059669',
  primaryDark: '#064E3B',
  white: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  textMuted: '#9CA3AF',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  danger: '#EF4444',
  star: '#F59E0B',
};
const SIZES = { padding: 20, radius: 12, base: 8 };
const FONTS = {
  h1: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  h2: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  body: { fontSize: 14, color: COLORS.textLight, lineHeight: 22 },
};

const tagsStyles = {
  body: {
    color: '#334155',
  },
  p: {
    ...FONTS.body,
    marginTop: 0,
    marginBottom: 6,
    color: '#334155',
  },
  span: {
    color: '#334155',
  },
  div: {
    color: '#334155',
  },
  ul: {
    marginVertical: 4,
  },
  li: {
    ...FONTS.body,
    marginBottom: 4,
    color: '#334155',
  },
  strong: {
    color: '#1F2937',
    fontWeight: '700',
  },
  b: {
    color: '#1F2937',
    fontWeight: '700',
  },
  a: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  }
};

// --- SUB-COMPONENTS ---
const QuantityStepper = ({ quantity, setQuantity, minOrderQty }) => (
  <View style={styles.quantityStepper}>
    <TouchableOpacity
      style={styles.stepperButton}
      onPress={() => setQuantity(q => Math.max(minOrderQty, q - 1))}
    >
      <Icon name="remove" size={20} color={COLORS.primary} />
    </TouchableOpacity>
    <Text style={styles.quantityText}>{quantity}</Text>
    <TouchableOpacity
      style={styles.stepperButton}
      onPress={() => setQuantity(q => q + 1)}
    >
      <Icon name="add" size={20} color={COLORS.primary} />
    </TouchableOpacity>
  </View>
);

const AccordionSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setIsOpen(!isOpen)}
      >
        {typeof title === 'string' ? (
          <Text style={styles.accordionTitle}>{title}</Text>
        ) : (
          title
        )}
        <Icon
          name={isOpen ? 'chevron-down' : 'chevron-forward'}
          size={20}
          color={COLORS.text}
        />
      </TouchableOpacity>
      {isOpen && <View style={styles.accordionContentInner}>{children}</View>}
    </View>
  );
};

// --- PINCH TO ZOOM IMAGE VIEWER (ANDROID & IOS COMPATIBLE) ---
const PinchZoomImage = ({ uri, onDismiss }) => {
  const [scale, setScale] = useState(1);
  const scaleRef = React.useRef(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const transRef = React.useRef({ x: 0, y: 0 });

  const initialDistanceRef = React.useRef(null);
  const initialScaleRef = React.useRef(1);
  const lastTouchRef = React.useRef({ x: 0, y: 0 });
  const lastTapRef = React.useRef(0);

  const getDistance = (touches) => {
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { touches } = evt.nativeEvent;
        if (touches.length === 2) {
          initialDistanceRef.current = getDistance(touches);
          initialScaleRef.current = scaleRef.current;
        } else if (touches.length === 1) {
          lastTouchRef.current = { x: touches[0].pageX, y: touches[0].pageY };
          
          const now = Date.now();
          if (now - lastTapRef.current < 320) {
            // Double-tap zoom toggle
            if (scaleRef.current > 1.2) {
              scaleRef.current = 1;
              transRef.current = { x: 0, y: 0 };
            } else {
              scaleRef.current = 2.5;
            }
            setScale(scaleRef.current);
            setTranslateX(transRef.current.x);
            setTranslateY(transRef.current.y);
            lastTapRef.current = 0;
            return;
          }
          lastTapRef.current = now;
        }
      },
      onPanResponderMove: (evt) => {
        const { touches } = evt.nativeEvent;
        if (touches.length === 2) {
          const distance = getDistance(touches);
          if (initialDistanceRef.current) {
            const factor = distance / initialDistanceRef.current;
            let newScale = initialScaleRef.current * factor;
            newScale = Math.max(1, Math.min(newScale, 5.0));
            scaleRef.current = newScale;
            setScale(newScale);
            if (newScale <= 1.05) {
              transRef.current = { x: 0, y: 0 };
              setTranslateX(0);
              setTranslateY(0);
            }
          }
        } else if (touches.length === 1 && scaleRef.current > 1.05) {
          const dx = touches[0].pageX - lastTouchRef.current.x;
          const dy = touches[0].pageY - lastTouchRef.current.y;
          lastTouchRef.current = { x: touches[0].pageX, y: touches[0].pageY };

          const maxTranslate = (SCREEN_WIDTH * (scaleRef.current - 1)) / 1.5;
          const newX = Math.max(-maxTranslate, Math.min(maxTranslate, transRef.current.x + dx));
          const newY = Math.max(-maxTranslate, Math.min(maxTranslate, transRef.current.y + dy));
          transRef.current = { x: newX, y: newY };
          setTranslateX(newX);
          setTranslateY(newY);
        }
      },
      onPanResponderRelease: () => {
        initialDistanceRef.current = null;
        if (scaleRef.current < 1.1) {
          scaleRef.current = 1;
          transRef.current = { x: 0, y: 0 };
          setScale(1);
          setTranslateX(0);
          setTranslateY(0);
        }
      }
    })
  ).current;

  return (
    <View style={styles.zoomModalBackdrop}>
      <View style={{ position: 'absolute', top: 40, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 999 }}>
        <View style={{ backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
            {scale > 1.1 ? `${scale.toFixed(1)}x Zoom • Double-Tap to Reset` : 'Pinch or Double-Tap to Zoom'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.zoomCloseBtn} 
          onPress={onDismiss}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Icon name="close-circle" size={36} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View 
        {...panResponder.panHandlers}
        style={{ width: SCREEN_WIDTH, height: '100%', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
      >
        <Image 
          source={{ uri }} 
          style={{ 
            width: SCREEN_WIDTH, 
            height: SCREEN_WIDTH * 1.2,
            transform: [
              { scale: scale },
              { translateX: translateX },
              { translateY: translateY }
            ]
          }} 
          resizeMode="contain" 
        />
      </View>
    </View>
  );
};

// --- MAIN PRODUCT DETAILS SCREEN ---
const ProductDetailsScreen = () => {
  const { width } = useWindowDimensions(); 
  const route = useRoute();
  const navigation = useNavigation();
  const cartContext = useCart();
  const addToCart = cartContext ? cartContext.addToCart : null;
  const authContext = useAuth();
  const token = authContext ? authContext.token : null;
  const pincodeContext = usePincode();
  const pincode = pincodeContext ? pincodeContext.pincode : null;
  const rawProduct = route.params && route.params.product ? route.params.product : null;
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const insets = useSafeAreaInsets();
  const favContext = useFavorites();

  const product = fetchedProduct ? { ...rawProduct, ...fetchedProduct } : (rawProduct || {});
  const currentProductId = product.product_id || product.id;

  // --- STATE (Declared Unconditionally at Top Level) ---
  const minOrderQty = parseInt(product.minimum_order_quantity || 1, 10) || 1;
  const [quantity, setQuantity] = useState(minOrderQty);
  const checkFavorite = favContext ? favContext.isFavorite : null;
  const toggleFavorite = favContext ? favContext.toggleFavorite : null;
  const isFav = (currentProductId && typeof checkFavorite === 'function') ? checkFavorite(currentProductId) : false;
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isRelatedLoading, setIsRelatedLoading] = useState(true);
  const [isCartBarVisible, setIsCartBarVisible] = useState(false);
  const [isPincodeModalVisible, setIsPincodeModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  // --- REVIEWS & RATINGS STATE ---
  const [reviewsData, setReviewsData] = useState({
    avg_rating: product.avg_rating ? parseFloat(product.avg_rating) : 0,
    total_reviews: product.total_reviews ? parseInt(product.total_reviews) : 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    customer_media: [],
    user_review: null,
    reviews: [],
  });
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [selectedReviewMediaList, setSelectedReviewMediaList] = useState([]);
  const [selectedReviewMediaIndex, setSelectedReviewMediaIndex] = useState(0);
  const [isReviewMediaModalVisible, setIsReviewMediaModalVisible] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const handleOpenReviewMedia = (mediaItem, fullMediaList = []) => {
    const listToUse = (fullMediaList && fullMediaList.length > 0)
      ? fullMediaList
      : (reviewsData.customer_media && reviewsData.customer_media.length > 0 ? reviewsData.customer_media : [mediaItem]);
    
    const targetIdx = listToUse.findIndex(m => m.url === mediaItem.url || m.id === mediaItem.id);
    setSelectedReviewMediaList(listToUse);
    setSelectedReviewMediaIndex(targetIdx >= 0 ? targetIdx : 0);
    setIsReviewMediaModalVisible(true);
  };

  if (!rawProduct) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#0CA201" />
      </SafeAreaView>
    );
  }

  // --- VARIANTS STATE ---
  let parsedVariants = [];
  if (Array.isArray(product.variants)) {
    parsedVariants = product.variants;
  } else if (typeof product.variants === 'string' && product.variants.trim().length > 0) {
    try { parsedVariants = JSON.parse(product.variants); } catch (e) { parsedVariants = []; }
  }
  const variantsList = Array.isArray(parsedVariants) ? parsedVariants : [];

  // --- DERIVED VALUES ---
  const sellingPrice = selectedVariant && selectedVariant.price ? parseFloat(selectedVariant.price) : parseFloat(product.selling_price || 0);
  const mrp = selectedVariant && selectedVariant.mrp ? parseFloat(selectedVariant.mrp) : parseFloat(product.mrp || 0);
  const discount = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const activeStock = selectedVariant && selectedVariant.stock_quantity !== undefined ? selectedVariant.stock_quantity : (product.quantity || product.stock_quantity || 0);
  const serverUrl = 'https://newapi.earn24.in';

  // --- ATTRIBUTES PARSING (Failproof Crash Protection) ---
  let parsedAttributes = [];
  if (Array.isArray(product.attributes)) {
    parsedAttributes = product.attributes;
  } else if (typeof product.attributes === 'string' && product.attributes.trim().length > 0) {
    try { parsedAttributes = JSON.parse(product.attributes); } catch (e) { parsedAttributes = []; }
  }
  const attributesList = Array.isArray(parsedAttributes) ? parsedAttributes : [];
  const attributeDisplay = attributesList.length > 0
    ? attributesList.map(a => (typeof a === 'object' && a !== null ? (a.value || a.attribute_value || '') : String(a))).filter(Boolean).join(', ')
    : 'Standard Catalog Offer';

  // --- MEDIA ARRAY LOGIC (Multi-Image Variant Slider Engine) ---
  const variantPhotos = (selectedVariant && Array.isArray(selectedVariant.variant_image_urls) && selectedVariant.variant_image_urls.length > 0)
    ? selectedVariant.variant_image_urls
    : [(selectedVariant && selectedVariant.variant_image_url) ? selectedVariant.variant_image_url : (product.main_image_url || '')];

  let parsedGallery = [];
  if (Array.isArray(product.gallery_image_urls)) {
    parsedGallery = product.gallery_image_urls;
  } else if (typeof product.gallery_image_urls === 'string' && product.gallery_image_urls.trim().length > 0) {
    try { parsedGallery = JSON.parse(product.gallery_image_urls); } catch (e) { parsedGallery = []; }
  }
  const productGallery = Array.isArray(parsedGallery) ? parsedGallery : [];

  const rawMediaList = [
    ...variantPhotos.map(url => ({ url: url, type: 'image' })),
    ...productGallery.map(url => ({
      url: url,
      type: (typeof url === 'string' && (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.mov'))) ? 'video' : 'image'
    }))
  ];

  const allMedia = rawMediaList
    .filter(item => item && item.url && typeof item.url === 'string')
    .map(item => ({ ...item, url: (item.url.startsWith('http') || item.url.startsWith('data:')) ? item.url : `${serverUrl}${item.url}` }));

  // --- SAFE HTML DESCRIPTION PARSING (Crash Proof) ---
  const rawDescription = product && product.description ? product.description : '';
  const safeHtmlDescription = (typeof rawDescription === 'string' && rawDescription.trim().length > 0)
    ? rawDescription
        .replace(/Â/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&rsquo;/g, "'")
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/style="[^"]*"/gi, (match) => {
            return match
                .replace(/background-color:[^;"]*;?/gi, '')
                .replace(/line-height:[^;"]*;?/gi, '')
                .replace(/font-family:[^;"]*;?/gi, '')
                .replace(/height:[^;"]*;?/gi, '');
        })
        .replace(/<p><br><\/p>|<p>&nbsp;<\/p>|<p>\s*<\/p>/gi, '')
    : '<p>No details available.</p>';

  const handleShareProduct = async () => {
    try {
      const shareUrl = `https://earn24.in/product/${currentProductId}`;
      const message = `Check out ${product.name || 'this product'} on Earn24!\nPrice: ₹${sellingPrice.toFixed(2)}\n\nShop Now: ${shareUrl}`;
      await Share.share({
        title: product.name || 'Earn24 Product',
        message: message,
        url: shareUrl,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: product.name || 'Product Details',
      headerRight: () => (
        <View style={styles.navHeaderIcons}>
          <TouchableOpacity onPress={() => toggleFavorite(product, navigation)}>
            <Icon
              name={isFav ? 'heart' : 'heart-outline'}
              size={24}
              color={isFav ? COLORS.danger : COLORS.text}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShareProduct} style={{ marginLeft: 15 }}>
            <Icon name="share-social-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      ),
    });

    const fetchRelated = async () => {
      if (!currentProductId) return;
      setIsRelatedLoading(true);
      try {
        const response = await mlmService.getRelatedProducts(currentProductId, pincode || '');
        if (response.status) {
          setRelatedProducts(response.data || []);
        }
      } catch (e) {
        console.error('Failed to load related products', e);
        setRelatedProducts([]);
      } finally {
        setIsRelatedLoading(false);
      }
    };

    const fetchReviews = async () => {
      if (!currentProductId) return;
      setIsReviewsLoading(true);
      try {
        const res = await getProductReviews(currentProductId);
        if (res && res.status && res.data) {
          setReviewsData(res.data);
        }
      } catch (e) {
        console.error('Failed to load reviews', e);
      } finally {
        setIsReviewsLoading(false);
      }
    };

    const fetchFullProduct = async () => {
      if (!currentProductId) return;
      try {
        const res = await getProductById(currentProductId);
        console.log('[ProductDetailsScreen DEBUG fetchFullProduct]:', currentProductId, res?.data);
        if (res && res.status && res.data) {
          setFetchedProduct(res.data);
        }
      } catch (e) {
        console.error('Failed to fetch full product details:', e);
      }
    };

    if (currentProductId) {
      recordProductView({ ...product, id: currentProductId, product_id: currentProductId });
      fetchFullProduct();
      fetchRelated();
      fetchReviews();
    } else {
      setIsRelatedLoading(false);
    }

  }, [currentProductId, pincode, product.name, navigation, isFav]);

  const handleAddToCart = async () => {
    if (isAddingToCart || isBuyingNow) return;
    if (!token) {
      navigation.navigate('Login');
      return;
    }
    setIsAddingToCart(true);
    try {
      const success = await addToCart(product, quantity, selectedVariant);
      if (success) {
        setIsCartBarVisible(true);
        setTimeout(() => {
          setIsCartBarVisible(false);
        }, 4000);
      }
    } catch (e) {
      console.error('Failed to add to cart:', e);
      Alert.alert('Error', 'Could not add item to basket. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (isAddingToCart || isBuyingNow) return;
    if (!token) {
      navigation.navigate('Login');
      return;
    }
    setIsBuyingNow(true);
    try {
      const success = await addToCart(product, quantity, selectedVariant);
      if (success) {
        navigation.navigate('Cart');
      }
    } catch (e) {
      console.error('Failed to buy now:', e);
      Alert.alert('Error', 'Could not proceed to basket. Please try again.');
    } finally {
      setIsBuyingNow(false);
    }
  };

  // Helper for slider scrolling
  const onScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    setActiveIndex(Math.round(x / SCREEN_WIDTH));
  };

  const renderMediaItem = ({ item, index }) => {
    if (item.type === 'video') {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <style>
            body, html { margin:0; padding:0; width:100%; height:100%; background-color:#000; display:flex; justify-content:center; align-items:center; overflow:hidden; }
            video { width:100%; height:100%; object-fit:contain; }
          </style>
        </head>
        <body>
          <video src="${item.url}" controls playsinline ${(typeof activeIndex === 'number' && activeIndex === index) ? 'autoplay' : ''} loop preload="metadata"></video>
        </body>
        </html>
      `;
      return (
        <View style={styles.mediaSlide}>
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            style={{ width: SCREEN_WIDTH, height: 320, backgroundColor: '#000000' }}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </View>
      );
    }
    return (
      <TouchableOpacity 
        style={styles.mediaSlide} 
        activeOpacity={0.9}
        onPress={() => {
          setZoomImageUrl(item.url);
          setIsZoomVisible(true);
        }}
      >
        <Image source={{ uri: item.url }} style={styles.productImage} resizeMode="contain" />
        <View style={styles.zoomHintBadge}>
          <Icon name="search-outline" size={12} color="#FFFFFF" />
          <Text style={styles.zoomHintText}>Tap to Zoom</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        
        {/* --- DYNAMIC MEDIA GALLERY --- */}
        <View style={styles.sliderContainer}>
          <FlatList
            data={allMedia}
            renderItem={renderMediaItem}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScroll}
          />
          {/* Pagination Indicator Dots */}
          <View style={styles.dotContainer}>
            {allMedia.length > 1 && allMedia.map((_, i) => (
              <View key={i} style={[styles.dot, activeIndex === i ? styles.activeDot : styles.inactiveDot]} />
            ))}
          </View>
        </View>

        {/* Main Info Section */}
        <View style={styles.mainInfoContainer}>
          <Text style={styles.brandName}>{product.brand_name || 'Brand'}</Text>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{product.name || 'Product Name'}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity onPress={() => toggleFavorite(product, navigation)}>
                <Icon
                  name={isFav ? 'heart' : 'heart-outline'}
                  size={26}
                  color={isFav ? COLORS.danger : COLORS.textLight}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShareProduct}>
                <Icon
                  name="share-social-outline"
                  size={26}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* --- PRODUCT VARIANTS SELECTION PILLS --- */}
          {variantsList.length > 0 ? (
            <View style={styles.variantContainer}>
              <Text style={styles.variantTitle}>Select Option / Variant:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
                {/* Main Product Chip */}
                {(() => {
                  const mainVariantTitle = (() => {
                    if (product.variant_title && product.variant_title.trim().length > 0) return product.variant_title;
                    if (product.variant_name && product.variant_name.trim().length > 0) return product.variant_name;
                    const colSize = [product.color, product.size].filter(Boolean).join(' / ');
                    if (colSize && colSize.trim().length > 0) return colSize;
                    if (Array.isArray(product.attributes) && product.attributes.length > 0) {
                      const attrVals = product.attributes.map(a => (typeof a === 'object' && a !== null ? (a.value || a.attribute_value || '') : String(a))).filter(Boolean).join(' / ');
                      if (attrVals && attrVals.trim().length > 0) return attrVals;
                    }
                    return 'Main Offer';
                  })();
                  return (
                    <TouchableOpacity
                      style={[
                        styles.variantChipCard,
                        !selectedVariant && styles.variantChipCardSelected
                      ]}
                      onPress={() => setSelectedVariant(null)}
                    >
                      {product.main_image_url ? (
                        <Image source={{ uri: product.main_image_url.startsWith('http') ? product.main_image_url : `${serverUrl}${product.main_image_url}` }} style={styles.variantThumbImage} resizeMode="cover" />
                      ) : null}
                      <View>
                        <Text style={[styles.variantChipTitle, !selectedVariant && styles.variantChipTitleSelected]}>
                          {mainVariantTitle}
                        </Text>
                        <Text style={styles.variantChipPrice}>₹{parseFloat(product.selling_price || 0).toFixed(0)}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })()}

                {/* Variant Chips */}
                {variantsList.map((v, idx) => {
                  const isSelected = selectedVariant && (selectedVariant.id === v.id || selectedVariant.sku === v.sku);
                  const rawImg = v.variant_image_url || product.main_image_url;
                  const vImgUrl = rawImg ? (rawImg.startsWith('http') ? rawImg : `${serverUrl}${rawImg}`) : null;
                  const vTitleDisplay = v.title || v.variant_name || [v.color, v.size].filter(Boolean).join(' / ') || `Option ${idx + 1}`;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.variantChipCard,
                        isSelected && styles.variantChipCardSelected
                      ]}
                      onPress={() => setSelectedVariant(v)}
                    >
                      {vImgUrl ? (
                        <Image source={{ uri: vImgUrl }} style={styles.variantThumbImage} resizeMode="cover" />
                      ) : null}
                      <View>
                        <Text style={[styles.variantChipTitle, isSelected && styles.variantChipTitleSelected]}>
                          {vTitleDisplay}
                        </Text>
                        <Text style={styles.variantChipPrice}>₹{parseFloat(v.price || product.selling_price).toFixed(0)}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          ) : attributesList.length > 0 ? (
            <View style={styles.variantContainer}>
              <Text style={styles.variantTitle}>Selected Variant Options:</Text>
              <View style={styles.variantChipsRow}>
                {attributesList.map((attr, idx) => (
                  <View key={idx} style={styles.variantChipActive}>
                    <Text style={styles.variantChipLabel}>{(typeof attr === 'object' && attr !== null ? (attr.attribute_name || 'Variant') : 'Variant')}:</Text>
                    <Text style={styles.variantChipValue}>{(typeof attr === 'object' && attr !== null ? (attr.value || attr.attribute_value || '') : String(attr))}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.productMeta}>{attributeDisplay}</Text>
          )}
          
          <View style={styles.pricingRow}>
            <QuantityStepper
              quantity={quantity}
              setQuantity={setQuantity}
              minOrderQty={minOrderQty}
            />
            <View style={styles.priceContainer}>
              <Text style={styles.productPrice}>₹{sellingPrice.toFixed(2)}</Text>
              {mrp > sellingPrice && (
                <View style={styles.mrpContainer}>
                  <Text style={styles.mrpText}>₹{mrp.toFixed(2)}</Text>
                  <Text style={styles.discountText}>{discount}% OFF</Text>
                </View>
              )}
            </View>
          </View>
          <Text style={styles.bvText}>
            You will earn {Math.max(0, parseFloat(product.bv_earned || 0)).toFixed(2)} BV on this purchase
          </Text>

          {/* --- SELLER & RETURN POLICY TRUST CARD --- */}
          {(() => {
            const rawReturn = (product.has_return_policy !== null && product.has_return_policy !== undefined) ? product.has_return_policy : product.subcat_has_return_policy;
            const returnDays = parseInt(product.return_window_days || product.subcat_return_window_days || 7, 10);
            const rawReplacement = (product.is_replacement_available !== null && product.is_replacement_available !== undefined) ? product.is_replacement_available : product.subcat_is_replacement_available;
            const replacementDays = parseInt(product.replacement_window_days || product.subcat_replacement_window_days || 7, 10);

            const hasReturn = (rawReturn === 1 || rawReturn === true || rawReturn === '1' || rawReturn === 'true');
            const hasReplacement = (rawReplacement === 1 || rawReplacement === true || rawReplacement === '1' || rawReplacement === 'true');

            return (
              <View style={styles.trustCard}>
                <View style={styles.trustRow}>
                  <Icon name="storefront-outline" size={18} color="#0CA201" style={{ marginRight: 8 }} />
                  <Text style={styles.sellerText}>
                    Sold by: <Text style={styles.sellerName}>{product.seller_name || product.merchant_business_name || 'Earn24 Official'}</Text>
                  </Text>
                </View>

                {/* Return Policy Row */}
                <View style={styles.trustRow}>
                  <Icon 
                    name={hasReturn ? "shield-checkmark-outline" : "close-circle"} 
                    size={18} 
                    color={hasReturn ? "#0CA201" : "#EF4444"} 
                    style={{ marginRight: 8 }} 
                  />
                  <Text style={[styles.policyText, { color: hasReturn ? "#0CA201" : "#EF4444", fontWeight: hasReturn ? '600' : '700' }]}>
                    {hasReturn ? `${returnDays}-Day Return Policy Available 🛡️` : `Return Not Available`}
                  </Text>
                </View>

                {/* Replacement Policy Row */}
                <View style={styles.trustRow}>
                  <Icon 
                    name={hasReplacement ? "sync-outline" : "close-circle"} 
                    size={18} 
                    color={hasReplacement ? "#0284C7" : "#EF4444"} 
                    style={{ marginRight: 8 }} 
                  />
                  <Text style={[styles.policyText, { color: hasReplacement ? "#0284C7" : "#EF4444", fontWeight: hasReplacement ? '600' : '700' }]}>
                    {hasReplacement ? `${replacementDays}-Day Replacement Policy Available 🛡️` : `Replacement Not Available`}
                  </Text>
                </View>
              </View>
            );
          })()}

          {/* --- PINCODE DELIVERY CHECK CARD --- */}
          <View style={styles.pincodeCheckCard}>
            <View style={styles.pincodeHeaderRow}>
              <View style={styles.pincodeLeftInfo}>
                <Icon name="location-outline" size={20} color={COLORS.primary} style={{ marginRight: 6 }} />
                <Text style={styles.pincodeTitleText}>
                  Deliver to: <Text style={{ fontWeight: '700', color: COLORS.text }}>{(!pincode || pincode === 'ALL') ? 'All India' : pincode}</Text>
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.changePincodeBtn} 
                onPress={() => setIsPincodeModalVisible(true)}
              >
                <Text style={styles.changePincodeBtnText}>{(pincode && pincode !== 'ALL') ? 'Change' : 'Set Pincode'}</Text>
              </TouchableOpacity>
            </View>

            {pincode ? (
              <View style={styles.pincodeStatusRow}>
                {product.is_serviceable !== false ? (
                  <>
                    <Icon name="checkmark-circle-sharp" size={16} color="#059669" style={{ marginRight: 6 }} />
                    <Text style={styles.serviceableText}>Standard Express Delivery Available</Text>
                  </>
                ) : (
                  <>
                    <Icon name="close-circle-sharp" size={16} color="#EF4444" style={{ marginRight: 6 }} />
                    <Text style={styles.unserviceableText}>Currently unavailable for delivery to {pincode}</Text>
                  </>
                )}
              </View>
            ) : (
              <Text style={styles.pincodePromptText}>Enter pincode to check product delivery & timelines</Text>
            )}
          </View>
        </View>

        {/* Details & Warranty Accordions Section */}
        <View style={styles.detailsContainer}>
          <AccordionSection title="Product Details" defaultOpen={true}>
            {safeHtmlDescription ? (
              <RenderHtml
                contentWidth={width ? Math.max(280, width - 32) : 320}
                source={{ html: safeHtmlDescription }}
                tagsStyles={tagsStyles}
              />
            ) : (
              <Text style={styles.accordionContent}>{product.description || 'No details available.'}</Text>
            )}
          </AccordionSection>

          {/* Warranty Details Accordion Drawer (100% Dynamic) */}
          {(() => {
            const rawWarrantyType = (product.warranty_type || '').toString().trim().toLowerCase();
            const rawWarrantyPeriod = (product.warranty_period || product.warranty || '').toString().trim();
            const rawWarrantyMonths = (product.warranty_months !== undefined && product.warranty_months !== null) ? parseInt(product.warranty_months, 10) : null;
            const rawCovered = (product.warranty_covered_by || product.warranty_covered || '').toString().trim();

            const isExplicitNoWarranty = rawWarrantyType === 'no_warranty' || 
                                         rawWarrantyType === 'none' || 
                                         (rawWarrantyMonths === 0 && !rawWarrantyPeriod && !rawCovered) || 
                                         rawWarrantyPeriod.toLowerCase() === 'no warranty' || 
                                         rawWarrantyPeriod.toLowerCase() === 'n/a' || 
                                         rawWarrantyPeriod.toLowerCase() === '0 months' || 
                                         rawWarrantyPeriod.toLowerCase() === '0 days';

            const hasWarranty = !isExplicitNoWarranty && (
              (rawWarrantyType !== '' && rawWarrantyType !== 'no_warranty') || 
              (rawWarrantyMonths !== null && rawWarrantyMonths > 0) || 
              (rawWarrantyPeriod !== '' && !isExplicitNoWarranty) ||
              (rawCovered !== '')
            );

            if (!hasWarranty) return null;

            const displayWarrantyText = rawWarrantyPeriod || (rawWarrantyMonths ? `${rawWarrantyMonths} Months Warranty` : 'Brand / Merchant Warranty');

            // Dynamic Service Type calculation
            const serviceTypeDisplay = (() => {
              if (product.warranty_service_type && product.warranty_service_type.trim().length > 0) {
                return product.warranty_service_type;
              }
              if (rawWarrantyType === 'manufacturer') return 'Manufacturer Repair';
              if (rawWarrantyType === 'seller') return 'Seller Repair / Replacement';
              if (rawWarrantyType === 'brand') return 'Brand Authorized Center';
              if (product.warranty_type && product.warranty_type !== 'no_warranty') {
                return product.warranty_type.replace(/_/g, ' ').toUpperCase();
              }
              return 'Brand Repair';
            })();

            // Dynamic Covered calculation
            const coveredDisplay = rawCovered || 'Manufacturing Defects';

            return (
              <AccordionSection title="Warranty Details" defaultOpen={true}>
                <View style={{ paddingVertical: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
                    <Icon name="shield-checkmark" size={22} color="#059669" style={{ marginRight: 10, marginTop: 2 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>
                        {displayWarrantyText}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2, lineHeight: 17 }}>
                        {product.warranty_summary || product.warranty_details || 'Covers manufacturing defects and operational failures under normal usage conditions.'}
                      </Text>
                    </View>
                  </View>

                  <View style={{ height: 1, backgroundColor: '#E2E8F0', marginVertical: 8 }} />

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 4 }}>
                    <View style={{ flex: 1, backgroundColor: '#F8FAFC', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#E2E8F0' }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Service Type</Text>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: '#0F172A', marginTop: 2 }}>{serviceTypeDisplay}</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: '#F0FDF4', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#DCFCE7' }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: '#166534', textTransform: 'uppercase' }}>Covered</Text>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: '#059669', marginTop: 2 }}>{coveredDisplay}</Text>
                    </View>
                  </View>
                </View>
              </AccordionSection>
            );
          })()}

          {/* Ratings & Reviews Collapsible Drawer (Open by Default) */}
          <AccordionSection 
            title={
              <Text style={styles.accordionTitle}>
                Ratings & Reviews <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600' }}>({reviewsData.avg_rating || '0'} <Text style={{ color: '#F59E0B', fontWeight: '800' }}>★</Text> • {reviewsData.total_reviews || 0} Ratings)</Text>
              </Text>
            } 
            defaultOpen={true}
          >
            <View style={{ paddingTop: 6 }}>
              {/* Rating Summary Score & Progress Bars */}
              <View style={styles.ratingSummaryRow}>
                {/* Score Badge */}
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreText}>{reviewsData.avg_rating || '4.5'}</Text>
                  <View style={styles.starRow}>
                    {[1,2,3,4,5].map(s => (
                      <Icon key={s} name={s <= Math.round(reviewsData.avg_rating || 5) ? "star" : "star-outline"} size={14} color="#F59E0B" />
                    ))}
                  </View>
                  <Text style={styles.totalReviewsCount}>{reviewsData.total_reviews || 0} Ratings & Reviews</Text>
                </View>

                {/* Distribution Bars */}
                <View style={styles.progressBarsBox}>
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = reviewsData.percentages ? (reviewsData.percentages[star] || 0) : 0;
                    return (
                      <View key={star} style={styles.barRow}>
                        <Text style={styles.barStarText}>{star}★</Text>
                        <View style={styles.barTrack}>
                          <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: star >= 4 ? '#059669' : star === 3 ? '#F59E0B' : '#EF4444' }]} />
                        </View>
                        <Text style={styles.barPctText}>{pct}%</Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Customer Photos & Videos Gallery Carousel */}
              {Array.isArray(reviewsData.customer_media) && reviewsData.customer_media.length > 0 && (
                <View style={styles.mediaCarouselContainer}>
                  <Text style={styles.mediaCarouselTitle}>Photos & Videos uploaded by Customers ({reviewsData.customer_media.length})</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 6 }}>
                    {reviewsData.customer_media.map((med, idx) => {
                      const mediaUrl = med.url ? (med.url.startsWith('http') ? med.url : `${serverUrl}${med.url}`) : null;
                      if (!mediaUrl) return null;
                      return (
                        <TouchableOpacity
                          key={idx}
                          style={styles.mediaThumbCard}
                          onPress={() => handleOpenReviewMedia(med, reviewsData.customer_media)}
                        >
                          {med.type === 'video' ? (
                            <View style={styles.videoThumbOverlay}>
                              <Icon name="play-circle" size={28} color="#F59E0B" />
                              <Text style={styles.videoLabel}>VIDEO</Text>
                            </View>
                          ) : (
                            <Image source={{ uri: mediaUrl }} style={styles.mediaThumbImg} resizeMode="cover" />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              {/* Customer Reviews List */}
              {Array.isArray(reviewsData.reviews) && reviewsData.reviews.length > 0 ? (
                <View style={{ marginTop: 15 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 10 }}>Customer Feedback</Text>
                  {reviewsData.reviews.map((rev) => (
                    <View key={rev.id} style={styles.reviewCardItem}>
                      <View style={styles.reviewHeaderRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <View style={styles.starBadgePill}>
                            <Text style={styles.starBadgeText}>{rev.rating} ★</Text>
                          </View>
                          <Text style={styles.reviewHeadline}>{rev.review_title || 'Good Product'}</Text>
                        </View>
                        {rev.is_verified_purchase && (
                          <View style={styles.verifiedBadgePill}>
                            <Icon name="checkmark-circle" size={12} color="#059669" />
                            <Text style={styles.verifiedBadgeText}>Verified Purchase</Text>
                          </View>
                        )}
                      </View>

                      {rev.review_text ? (
                        <Text style={styles.reviewCommentText}>"{rev.review_text}"</Text>
                      ) : null}

                      {/* Attached Media */}
                      {Array.isArray(rev.media_urls) && rev.media_urls.length > 0 && (
                        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                          {rev.media_urls.map((m, i) => {
                            const mUrl = m.url ? (m.url.startsWith('http') ? m.url : `${serverUrl}${m.url}`) : null;
                            return mUrl ? (
                              <TouchableOpacity
                                key={i}
                                onPress={() => handleOpenReviewMedia(m, rev.media_urls)}
                              >
                                <Image source={{ uri: mUrl }} style={{ width: 50, height: 50, borderRadius: 6, borderWidth: 1, borderColor: '#CBD5E1' }} />
                              </TouchableOpacity>
                            ) : null;
                          })}
                        </View>
                      )}

                      <View style={styles.reviewFooterRow}>
                        <Text style={styles.reviewAuthorText}>{rev.user_name || 'Earn24 Customer'}</Text>
                        <Text style={styles.reviewDateText}>{moment(rev.created_at).format('D MMM YYYY')}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                  <Icon name="chatbox-ellipses-outline" size={32} color="#94A3B8" />
                  <Text style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>No written reviews yet for this product.</Text>
                </View>
              )}
            </View>
          </AccordionSection>
        </View>

        {/* Related Products Section */}
        {isRelatedLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }} />
        ) : (
          relatedProducts.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.relatedTitle}>You Might Also Like</Text>
              <FlatList
                data={relatedProducts}
                renderItem={({ item }) => (
                  <View style={{ width: 170 }}>
                    <ProductCard
                      product={item}
                      onPress={() => navigation.push('ProductDetails', { product: item })}
                    />
                  </View>
                )}
                keyExtractor={(item, index) => (item && (item.product_id || item.id || item.offer_id) ? (item.product_id || item.id || item.offer_id).toString() : index.toString())}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedListContent}
              />
            </View>
          )
        )}
      </ScrollView>

      <FloatingCartBar visible={isCartBarVisible} />

      {/* Pincode Selector Modal */}
      <PincodeModal 
        visible={isPincodeModalVisible} 
        onDismiss={() => setIsPincodeModalVisible(false)} 
      />

      {/* Full-Screen Image Zoom Modal (Supports Two-Finger Pinch-to-Zoom & Double Tap) */}
      <Modal 
        visible={isZoomVisible} 
        transparent={true} 
        animationType="fade"
        onRequestClose={() => setIsZoomVisible(false)}
      >
        <PinchZoomImage 
          uri={zoomImageUrl} 
          onDismiss={() => setIsZoomVisible(false)} 
        />
      </Modal>

      {/* --- FULL-SCREEN CUSTOMER REVIEW MEDIA LIGHTBOX MODAL --- */}
      <Modal
        visible={isReviewMediaModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsReviewMediaModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
          {/* Lightbox Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, zIndex: 999 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>
              Media {selectedReviewMediaIndex + 1} of {selectedReviewMediaList.length || 1}
            </Text>
            <TouchableOpacity
              onPress={() => setIsReviewMediaModalVisible(false)}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Icon name="close-circle" size={34} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Slide by Slide Horizontal Carousel */}
          {selectedReviewMediaList && selectedReviewMediaList.length > 0 ? (
            <FlatList
              data={selectedReviewMediaList}
              keyExtractor={(_, idx) => idx.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={selectedReviewMediaIndex >= 0 && selectedReviewMediaIndex < selectedReviewMediaList.length ? selectedReviewMediaIndex : 0}
              getItemLayout={(_, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
              onMomentumScrollEnd={(e) => {
                const newIdx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                setSelectedReviewMediaIndex(newIdx);
              }}
              renderItem={({ item, index }) => {
                const mediaUrl = item.url ? (item.url.startsWith('http') ? item.url : `${serverUrl}${item.url}`) : '';
                const isVideo = item.type === 'video' || (typeof mediaUrl === 'string' && (
                  mediaUrl.toLowerCase().endsWith('.mp4') || 
                  mediaUrl.toLowerCase().endsWith('.mov') || 
                  mediaUrl.toLowerCase().endsWith('.mkv') || 
                  mediaUrl.toLowerCase().endsWith('.webm') || 
                  mediaUrl.toLowerCase().endsWith('.avi') ||
                  mediaUrl.toLowerCase().includes('/video')
                ));
                
                if (isVideo) {
                  const htmlVideoContent = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                      <style>
                        body, html { margin:0; padding:0; width:100%; height:100%; background-color:#000; display:flex; justify-content:center; align-items:center; overflow:hidden; }
                        video { width:100%; height:100%; object-fit:contain; }
                      </style>
                    </head>
                    <body>
                      <video src="${mediaUrl}" controls playsinline ${selectedReviewMediaIndex === index ? 'autoplay' : ''} loop preload="auto"></video>
                    </body>
                    </html>
                  `;
                  return (
                    <View style={{ width: SCREEN_WIDTH, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                      <WebView
                        originWhitelist={['*']}
                        source={{ html: htmlVideoContent }}
                        style={{ width: SCREEN_WIDTH, height: 350, backgroundColor: '#000000' }}
                        allowsInlineMediaPlayback={true}
                        mediaPlaybackRequiresUserAction={false}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        androidLayerType="hardware"
                      />
                    </View>
                  );
                }

                return (
                  <ScrollView
                    maximumZoomScale={4.0}
                    minimumZoomScale={1.0}
                    contentContainerStyle={{ width: SCREEN_WIDTH, height: '100%', justifyContent: 'center', alignItems: 'center' }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    bouncesZoom={true}
                  >
                    <Image
                      source={{ uri: mediaUrl }}
                      style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 1.2 }}
                      resizeMode="contain"
                    />
                  </ScrollView>
                );
              }}
            />
          ) : null}
        </SafeAreaView>
      </Modal>

      {/* --- SLEEK BOTTOM SHEET LOGIN REQUIRED MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLoginModalVisible}
        onRequestClose={() => setIsLoginModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.loginModalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsLoginModalVisible(false)}
        >
          <View 
            style={styles.loginBottomSheetContainer}
            onStartShouldSetResponder={() => true}
          >
            {/* Handle Indicator Bar */}
            <View style={styles.sheetHandleBar} />

            <View style={styles.loginIconBadge}>
              <Icon name="bag-handle" size={34} color="#0CA201" />
            </View>

            <Text style={styles.loginModalTitle}>Log In to Add to Basket</Text>
            <Text style={styles.loginModalSubtext}>
              Sign in to save items to your cart, get exclusive Cashback BV points, and place fast orders.
            </Text>

            <TouchableOpacity
              style={styles.loginPrimaryButton}
              onPress={() => {
                setIsLoginModalVisible(false);
                navigation.navigate('Login');
              }}
            >
              <Text style={styles.loginPrimaryButtonText}>LOG IN / CREATE ACCOUNT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginSecondaryButton}
              onPress={() => setIsLoginModalVisible(false)}
            >
              <Text style={styles.loginSecondaryButtonText}>Continue Browsing</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { height: 75 + insets.bottom, paddingBottom: SIZES.padding + insets.bottom }]}>
        <TouchableOpacity 
          style={[styles.bottomButton, styles.buyNowButton, (isAddingToCart || isBuyingNow) && { opacity: 0.7 }]} 
          onPress={handleBuyNow}
          disabled={isAddingToCart || isBuyingNow}
        >
          {isBuyingNow ? (
            <ActivityIndicator color="#0CA201" />
          ) : (
            <Text style={[styles.bottomButtonText, styles.buyNowText]}>Buy Now</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.bottomButton, styles.addToCartButton, (isAddingToCart || isBuyingNow) && { opacity: 0.7 }]} 
          onPress={handleAddToCart}
          disabled={isAddingToCart || isBuyingNow}
        >
          {isAddingToCart ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[styles.bottomButtonText, styles.addToCartText]}>Add To Basket</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  scrollContent: { paddingBottom: 120 },
  navHeaderIcons: { flexDirection: 'row' },
  
  // Slider Styles
  sliderContainer: { height: 350, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  mediaSlide: { width: SCREEN_WIDTH, height: 350, justifyContent: 'center', alignItems: 'center' },
  productImage: { width: '90%', height: '90%' },
  videoPlayer: { width: SCREEN_WIDTH, height: 320 },
  dotContainer: { flexDirection: 'row', position: 'absolute', bottom: 15, alignSelf: 'center' },
  dot: { height: 8, borderRadius: 4, marginHorizontal: 4 },
  activeDot: { width: 20, backgroundColor: COLORS.primary },
  inactiveDot: { width: 8, backgroundColor: '#CCC' },

  mainInfoContainer: { padding: SIZES.padding, borderBottomWidth: 6, borderBottomColor: COLORS.background },
  brandName: { ...FONTS.body, color: COLORS.textLight, fontWeight: '600', marginBottom: 4 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  productName: { ...FONTS.h1, flex: 1, marginRight: SIZES.padding },
  productMeta: { ...FONTS.body, fontSize: 16, color: COLORS.textLight, marginTop: 4, marginBottom: SIZES.padding },
  variantContainer: { marginTop: 8, marginBottom: 12 },
  variantTitle: { fontSize: 12, fontWeight: '600', color: COLORS.textLight, marginBottom: 6 },
  variantChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  variantChipActive: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', borderWidth: 1.5, borderColor: '#0CA201', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, gap: 4 },
  variantChipLabel: { fontSize: 12, color: '#166534', fontWeight: '500' },
  variantChipValue: { fontSize: 12, color: '#0CA201', fontWeight: '700' },
  pricingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SIZES.padding / 2 },
  priceContainer: { alignItems: 'flex-end' },
  productPrice: { ...FONTS.h1, color: COLORS.text },
  mrpContainer: { flexDirection: 'row', alignItems: 'center', gap: SIZES.base },
  mrpText: { ...FONTS.body, color: COLORS.textMuted, textDecorationLine: 'line-through' },
  discountText: { ...FONTS.body, color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
  bvText: { ...FONTS.body, color: COLORS.primary, fontWeight: '600', marginTop: SIZES.padding },
  trustCard: { marginTop: 15, padding: 12, backgroundColor: '#F8FAF8', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  trustRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 3 },
  sellerText: { fontSize: 13, color: '#475569' },
  sellerName: { fontWeight: '700', color: '#0CA201' },
  policyText: { fontSize: 13, fontWeight: '600', color: '#334155' },
  pincodeCheckCard: { marginTop: 12, padding: 12, backgroundColor: '#EFF6FF', borderRadius: 8, borderWidth: 1, borderColor: '#BFDBFE' },
  pincodeHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pincodeLeftInfo: { flexDirection: 'row', alignItems: 'center' },
  pincodeTitleText: { fontSize: 13, color: '#1E40AF', fontWeight: '500' },
  changePincodeBtn: { backgroundColor: '#2563EB', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  changePincodeBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  pincodeStatusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  serviceableText: { fontSize: 12, fontWeight: '600', color: '#059669' },
  unserviceableText: { fontSize: 12, fontWeight: '600', color: '#EF4444' },
  pincodePromptText: { fontSize: 12, color: '#3B82F6', marginTop: 6, fontStyle: 'italic' },
  quantityStepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: SIZES.radius },
  stepperButton: { padding: SIZES.padding / 1.5 },
  quantityText: { ...FONTS.h2, fontSize: 18, marginHorizontal: SIZES.padding },
  detailsContainer: { paddingHorizontal: SIZES.padding },
  accordionContainer: { paddingVertical: SIZES.padding / 2, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SIZES.padding / 2 },
  accordionTitle: { ...FONTS.h2, fontSize: 16 },
  accordionContent: { ...FONTS.body, paddingBottom: SIZES.padding / 2 },
  accordionContentInner: { paddingBottom: SIZES.padding / 2 },
  relatedSection: { backgroundColor: COLORS.background, paddingTop: SIZES.padding, paddingBottom: SIZES.padding * 2 },
  relatedTitle: { ...FONTS.h2, paddingHorizontal: SIZES.padding, marginBottom: SIZES.base },
  relatedListContent: { paddingHorizontal: SIZES.padding },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', height: 75, padding: SIZES.padding, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border, gap: SIZES.padding / 2 },
  bottomButton: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: SIZES.radius },
  addToCartButton: { backgroundColor: COLORS.primary },
  buyNowButton: { borderWidth: 1.5, borderColor: COLORS.primary },
  bottomButtonText: { ...FONTS.h2, fontSize: 16 },
  addToCartText: { color: COLORS.white },
  buyNowText: { color: COLORS.primary },
  zoomHintBadge: { position: 'absolute', bottom: 12, right: 16, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 4 },
  zoomHintText: { color: '#FFFFFF', fontSize: 10, fontWeight: '600' },
  zoomModalBackdrop: { flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' },
  zoomCloseBtn: { position: 'absolute', top: 40, right: 20, zIndex: 999 },
  zoomScrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  variantChipCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, gap: 8 },
  variantChipCardSelected: { backgroundColor: '#F0FDF4', borderColor: '#0CA201' },
  variantThumbImage: { width: 32, height: 32, borderRadius: 6, borderWidth: 1, borderColor: '#E2E8F0' },
  variantChipTitle: { fontSize: 12, color: '#334155', fontWeight: '600' },
  variantChipTitleSelected: { color: '#166534', fontWeight: '700' },
  variantChipPrice: { fontSize: 11, color: '#0CA201', fontWeight: '700' },
  loginModalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'flex-end' },
  loginBottomSheetContainer: { width: '100%', backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 36, alignItems: 'center' },
  sheetHandleBar: { width: 44, height: 5, borderRadius: 3, backgroundColor: '#E2E8F0', marginBottom: 20 },
  loginIconBadge: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#DCFCE7' },
  loginModalTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 8, textAlign: 'center' },
  loginModalSubtext: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 21, marginBottom: 24, paddingHorizontal: 8 },
  loginPrimaryButton: { width: '100%', backgroundColor: '#0CA201', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginBottom: 12, elevation: 3, shadowColor: '#0CA201', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  loginPrimaryButtonText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5 },
  loginSecondaryButton: { width: '100%', paddingVertical: 12, alignItems: 'center' },
  loginSecondaryButtonText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  
  // --- REVIEWS & RATINGS STYLES ---
  reviewSectionCard: { backgroundColor: '#FFFFFF', marginTop: 12, padding: SIZES.padding, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border },
  reviewSectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  ratingSummaryRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', gap: 15 },
  scoreBox: { alignItems: 'center', justifyContent: 'center', paddingRight: 15, borderRightWidth: 1, borderRightColor: '#CBD5E1' },
  scoreText: { fontSize: 32, fontWeight: '800', color: '#0F172A' },
  starRow: { flexDirection: 'row', gap: 2, marginVertical: 4 },
  totalReviewsCount: { fontSize: 11, color: '#64748B', fontWeight: '600', textAlign: 'center' },
  progressBarsBox: { flex: 1, gap: 4 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  barStarText: { fontSize: 11, fontWeight: '700', color: '#334155', width: 22 },
  barTrack: { flex: 1, height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  barPctText: { fontSize: 11, color: '#64748B', width: 28, textAlign: 'right' },
  mediaCarouselContainer: { marginTop: 15, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 12 },
  mediaCarouselTitle: { fontSize: 13, fontWeight: '700', color: '#1E293B', marginBottom: 6 },
  mediaThumbCard: { width: 70, height: 70, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: '#0F172A' },
  mediaThumbImg: { width: '100%', height: '100%' },
  videoThumbOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(15,23,42,0.85)' },
  videoLabel: { fontSize: 9, fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  reviewCardItem: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 10 },
  reviewHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  starBadgePill: { backgroundColor: '#059669', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  starBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  reviewHeadline: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  verifiedBadgePill: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#ECFDF5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: '#A7F3D0' },
  verifiedBadgeText: { fontSize: 10, fontWeight: '700', color: '#047857' },
  reviewCommentText: { fontSize: 13, color: '#334155', lineHeight: 19, fontStyle: 'italic' },
  reviewFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  reviewAuthorText: { fontSize: 11, fontWeight: '700', color: '#475569' },
  reviewDateText: { fontSize: 11, color: '#94A3B8' },
});

class ProductDetailsErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ProductDetailsScreen Error Boundary caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      const errStr = this.state.error ? (this.state.error.message || this.state.error.toString()) : 'Unknown Error';
      return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
          <Icon name="alert-circle-outline" size={56} color="#EF4444" />
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F2937', marginTop: 12 }}>Unable to Load Product</Text>
          <View style={{ marginTop: 12, padding: 12, backgroundColor: '#FEF2F2', borderRadius: 8, borderWidth: 1, borderColor: '#FCA5A5', width: '100%' }}>
            <Text style={{ fontSize: 11, color: '#991B1B', fontFamily: 'monospace' }} numberOfLines={6}>
              {errStr}
            </Text>
          </View>
          <TouchableOpacity
            style={{ backgroundColor: '#059669', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10, marginTop: 20 }}
            onPress={() => this.props.navigation && this.props.navigation.goBack()}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Go Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

const ProductDetailsScreenWrapper = (props) => (
  <ProductDetailsErrorBoundary navigation={props.navigation}>
    <ProductDetailsScreen {...props} />
  </ProductDetailsErrorBoundary>
);

export default ProductDetailsScreenWrapper;