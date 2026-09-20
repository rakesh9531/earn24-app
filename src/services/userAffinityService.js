import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENTLY_VIEWED_KEY = '@earn24_recently_viewed';
const CATEGORY_AFFINITY_KEY = '@earn24_category_affinity';
const MAX_RECENT_ITEMS = 15;

/**
 * Records a viewed product into local storage and increments the category affinity counter.
 */
export const recordProductView = async (product) => {
  if (!product) return;
  const productId = product.id || product.product_id || product.offer_id;
  if (!productId) return;

  try {
    // 1. Update Recently Viewed Products
    const existingRaw = await AsyncStorage.getItem(RECENTLY_VIEWED_KEY);
    let existingList = existingRaw ? JSON.parse(existingRaw) : [];

    // Filter out if item already exists to move it to the front
    existingList = existingList.filter((item) => String(item.id || item.product_id) !== String(productId));

    // Store only necessary properties to keep storage lightweight
    const simplifiedProduct = {
      id: productId,
      product_id: productId,
      name: product.name || product.product_name || 'Product',
      selling_price: product.selling_price || product.price || 0,
      mrp: product.mrp || 0,
      main_image_url: product.main_image_url || product.image_url || product.imageUrl,
      bv_earned: product.bv_earned || 0,
      brand_name: product.brand_name || product.brandName,
      minimum_order_quantity: product.minimum_order_quantity || 1,
      attributes: product.attributes,
      parent_category_id: product.parent_category_id || product.category_id,
      category_id: product.category_id,
    };

    // Prepend to top
    existingList.unshift(simplifiedProduct);

    // Limit to max items
    if (existingList.length > MAX_RECENT_ITEMS) {
      existingList = existingList.slice(0, MAX_RECENT_ITEMS);
    }

    await AsyncStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(existingList));

    // 2. Track Category Affinity (Count views per category)
    const categoryId = product.parent_category_id || product.category_id;
    if (categoryId) {
      const affinityRaw = await AsyncStorage.getItem(CATEGORY_AFFINITY_KEY);
      const affinityMap = affinityRaw ? JSON.parse(affinityRaw) : {};
      affinityMap[categoryId] = (affinityMap[categoryId] || 0) + 1;
      await AsyncStorage.setItem(CATEGORY_AFFINITY_KEY, JSON.stringify(affinityMap));
    }
  } catch (error) {
    console.warn('userAffinityService: Failed to record product view', error);
  }
};

/**
 * Returns the list of recently viewed products.
 */
export const getRecentlyViewed = async () => {
  try {
    const raw = await AsyncStorage.getItem(RECENTLY_VIEWED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn('userAffinityService: Failed to get recently viewed', error);
    return [];
  }
};

/**
 * Clears the recently viewed list.
 */
export const clearRecentlyViewed = async () => {
  try {
    await AsyncStorage.removeItem(RECENTLY_VIEWED_KEY);
    return true;
  } catch (error) {
    console.warn('userAffinityService: Failed to clear recently viewed', error);
    return false;
  }
};

/**
 * Returns the category ID that the user views most frequently.
 */
export const getFavoriteCategoryId = async () => {
  try {
    const affinityRaw = await AsyncStorage.getItem(CATEGORY_AFFINITY_KEY);
    if (!affinityRaw) return null;

    const affinityMap = JSON.parse(affinityRaw);
    let topCategoryId = null;
    let maxViews = 0;

    for (const [catId, count] of Object.entries(affinityMap)) {
      if (count > maxViews) {
        maxViews = count;
        topCategoryId = isNaN(catId) ? catId : Number(catId);
      }
    }

    return topCategoryId;
  } catch (error) {
    console.warn('userAffinityService: Failed to get favorite category', error);
    return null;
  }
};

export default {
  recordProductView,
  getRecentlyViewed,
  clearRecentlyViewed,
  getFavoriteCategoryId,
};
