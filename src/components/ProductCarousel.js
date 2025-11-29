

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
      <FlatList
        data={section.products}
        keyExtractor={(item) => item.offer_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ProductCard product={item} onPress={() => onProductPress(item)} />
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({ sectionContainer: { marginTop: 20, }, sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 20, }, sectionTitle: { fontSize: 18, fontWeight: 'bold' }, seeAll: { color: '#0CA201', fontWeight: 'bold' }, listContent: { paddingHorizontal: 15, }, cardWrapper: { width: 160, marginRight: 10, }, });
export default ProductCarousel;