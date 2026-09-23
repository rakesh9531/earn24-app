

import React, { memo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ProductCard from './ProductCard'; // Note: This uses the card above

const ProductCarousel = ({ section, onProductPress, onSeeAllPress }) => {
  if (!section || !section.products || section.products.length === 0) {
    return null;
  }

  // Display only Top 4 products on the Home Screen for speed and clean layout
  const displayProducts = section.products.slice(0, 4);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <TouchableOpacity
          style={styles.seeAllBtn}
          onPress={() => onSeeAllPress(section)}
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.seeAll}>See all &gt;</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.gridContainer}>
        {displayProducts.map((item, index) => {
          if (!item) return null;
          return (
            <View key={item.offer_id ? item.offer_id.toString() : (item.id ? item.id.toString() : index.toString())} style={styles.gridItem}>
              <ProductCard product={item} onPress={() => onProductPress(item)} />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: { marginTop: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  seeAll: { color: '#0CA201', fontWeight: 'bold' },
  gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    paddingHorizontal: 15, 
    justifyContent: 'space-between' 
  },
  gridItem: { 
    width: '48%', 
    marginBottom: 15 
  },
});
export default memo(ProductCarousel, (prevProps, nextProps) => {
  return prevProps.section.id === nextProps.section.id &&
         prevProps.section.title === nextProps.section.title &&
         prevProps.section.products === nextProps.section.products;
});