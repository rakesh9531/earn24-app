

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ProductCard from './ProductCard'; // Note: This uses the card above

const ProductCarousel = ({ section, onProductPress, onSeeAllPress }) => {
  if (!section || !section.products || section.products.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <TouchableOpacity onPress={() => onSeeAllPress(section)}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.gridContainer}>
        {section.products.map((item, index) => (
          <View key={item.offer_id ? item.offer_id.toString() : (item.id ? item.id.toString() : index.toString())} style={styles.gridItem}>
            <ProductCard product={item} onPress={() => onProductPress(item)} />
          </View>
        ))}
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
export default ProductCarousel;