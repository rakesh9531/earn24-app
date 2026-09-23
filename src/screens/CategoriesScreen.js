import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { mlmService } from '../services/mlmService';
import { usePincode } from '../context/PincodeContext';
import CartIcon from '../components/CartIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LEFT_RAIL_WIDTH = 96;
const RIGHT_PANEL_WIDTH = SCREEN_WIDTH - LEFT_RAIL_WIDTH;

const COLORS = {
  primary: '#059669',
  primaryDark: '#047857',
  primaryLight: '#ECFDF5',
  primaryBorder: '#A7F3D0',
  textDark: '#0F172A',
  textMedium: '#334155',
  textMuted: '#64748B',
  bgRail: '#F1F5F9',
  bgSurface: '#FFFFFF',
  border: '#E2E8F0',
  cardBg: '#FFFFFF',
  badgeBg: '#FEF3C7',
  badgeText: '#92400E',
};

const CategoriesScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { pincode } = usePincode();

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Handle hardware back button -> smoothly return to Home tab
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Home');
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await mlmService.getHomeScreenData(pincode || '');
      if (response && response.status && response.data && Array.isArray(response.data.categories)) {
        setCategories(response.data.categories);
        if (response.data.categories.length > 0) {
          setSelectedCategoryId(prev => prev || response.data.categories[0].id);
        }
      } else {
        setError('No categories available.');
      }
    } catch (e) {
      console.error('Failed to load categories:', e);
      setError('Could not load categories. Tap to retry.');
    } finally {
      setIsLoading(false);
    }
  }, [pincode]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const activeCategory = useMemo(() => {
    return categories.find(cat => cat.id === selectedCategoryId) || categories[0] || null;
  }, [categories, selectedCategoryId]);

  const subCategoriesList = useMemo(() => {
    return activeCategory?.subCategories || [];
  }, [activeCategory]);

  const handleSubCategoryPress = (sub) => {
    navigation.navigate('CategoryProducts', {
      categoryId: sub.id,
      categoryName: sub.name,
      isSubcategory: true,
      parentCategoryId: activeCategory?.id,
      parentCategoryName: activeCategory?.name,
    });
  };

  const handleSeeAllActive = () => {
    if (!activeCategory) return;
    navigation.navigate('CategoryProducts', {
      categoryId: activeCategory.id,
      categoryName: activeCategory.name,
      isSubcategory: false,
    });
  };

  const renderLeftRailItem = ({ item }) => {
    const isActive = selectedCategoryId === item.id;
    const rawImg = item.image_url || item.icon_url;
    const imageUrl = rawImg
      ? (rawImg.startsWith('http') ? rawImg : `https://newapi.earn24.in${rawImg}`)
      : null;

    return (
      <TouchableOpacity
        style={[styles.leftRailItem, isActive && styles.leftRailItemActive]}
        onPress={() => setSelectedCategoryId(item.id)}
        activeOpacity={0.82}
      >
        {isActive && <View style={styles.activePillIndicator} />}
        <View style={[styles.railIconContainer, isActive && styles.railIconContainerActive]}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.railIconImage} resizeMode="contain" />
          ) : (
            <Icon name="grid-outline" size={24} color={isActive ? COLORS.primary : COLORS.textMuted} />
          )}
        </View>
        <Text
          style={[styles.railItemText, isActive && styles.railItemTextActive]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSubCategoryCard = ({ item }) => {
    const rawImg = item.image_url;
    const imageUrl = rawImg
      ? (rawImg.startsWith('http') ? rawImg : `https://newapi.earn24.in${rawImg}`)
      : null;

    return (
      <TouchableOpacity
        style={styles.subCatCard}
        onPress={() => handleSubCategoryPress(item)}
        activeOpacity={0.85}
      >
        <View style={styles.subCatImageWrapper}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.subCatImage} resizeMode="contain" />
          ) : (
            <Icon name="cube-outline" size={28} color={COLORS.primary} />
          )}
        </View>
        <Text style={styles.subCatTitle} numberOfLines={2}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* --- TOP HEADER WITH SEARCH BAR & CART --- */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.searchBarButton}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.9}
        >
          <Icon name="search-outline" size={19} color="#64748B" style={{ marginRight: 8 }} />
          <Text style={styles.searchPlaceholderText} numberOfLines={1}>
            Search products, categories...
          </Text>
        </TouchableOpacity>
        <View style={styles.headerCartWrapper}>
          <CartIcon />
        </View>
      </View>

      {/* --- MAIN BODY WITH 2-PANEL LAYOUT --- */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading Categories...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Icon name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchCategories}>
            <Text style={styles.retryButtonText}>Tap to Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.panelsContainer}>
          {/* LEFT VERTICAL CATEGORY RAIL */}
          <View style={styles.leftRail}>
            <FlatList
              data={categories}
              renderItem={renderLeftRailItem}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          </View>

          {/* RIGHT SUBCATEGORIES GRID PANEL */}
          <View style={styles.rightPanel}>
            {activeCategory && (
              <View style={styles.rightHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activeCategoryTitle} numberOfLines={1}>
                    {activeCategory.name}
                  </Text>
                  <Text style={styles.subCatCountText}>
                    {subCategoriesList.length} Sub-Categories
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.seeAllButton}
                  onPress={handleSeeAllActive}
                  activeOpacity={0.8}
                >
                  <Text style={styles.seeAllButtonText}>All Products</Text>
                  <Icon name="chevron-forward" size={14} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            )}

            {subCategoriesList.length === 0 ? (
              <View style={styles.emptySubContainer}>
                <Icon name="cube-outline" size={40} color="#CBD5E1" />
                <Text style={styles.emptySubText}>No sub-categories listed.</Text>
                <TouchableOpacity
                  style={styles.viewProductsBtn}
                  onPress={handleSeeAllActive}
                >
                  <Text style={styles.viewProductsBtnText}>Browse {activeCategory?.name}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={subCategoriesList}
                renderItem={renderSubCategoryCard}
                keyExtractor={item => item.id.toString()}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.subCatGridContent}
              />
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    height: 42,
    borderRadius: 21,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchPlaceholderText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  headerCartWrapper: {
    marginLeft: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 10,
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    fontWeight: '500',
  },
  retryButton: {
    marginTop: 14,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  panelsContainer: {
    flex: 1,
    flexDirection: 'row',
  },

  // --- LEFT RAIL STYLES ---
  leftRail: {
    width: LEFT_RAIL_WIDTH,
    backgroundColor: COLORS.bgRail,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  leftRailItem: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  leftRailItemActive: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: 'transparent',
  },
  activePillIndicator: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 4,
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  railIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  railIconContainerActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
  },
  railIconImage: {
    width: 32,
    height: 32,
  },
  railItemText: {
    fontSize: 11,
    color: COLORS.textMedium,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 14,
  },
  railItemTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },

  // --- RIGHT PANEL STYLES ---
  rightPanel: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activeCategoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  subCatCountText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  seeAllButtonText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
    marginRight: 2,
  },
  subCatGridContent: {
    paddingHorizontal: 6,
    paddingTop: 10,
    paddingBottom: 110,
  },
  subCatCard: {
    width: (RIGHT_PANEL_WIDTH - 24) / 3,
    alignItems: 'center',
    marginHorizontal: 3,
    marginBottom: 16,
  },
  subCatImageWrapper: {
    width: (RIGHT_PANEL_WIDTH - 36) / 3,
    height: (RIGHT_PANEL_WIDTH - 36) / 3,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  subCatImage: {
    width: '90%',
    height: '90%',
  },
  subCatTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMedium,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 14,
    paddingHorizontal: 2,
  },
  emptySubContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptySubText: {
    marginTop: 10,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  viewProductsBtn: {
    marginTop: 14,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewProductsBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default CategoriesScreen;
