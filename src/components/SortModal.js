import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// --- DESIGN SYSTEM ---
const COLORS = {
  primary: '#059669',
  text: '#1F2937',
  textLight: '#6B7280',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  background: 'rgba(0, 0, 0, 0.5)',
};

// --- DATA: Define your sort options here ---
const SORT_OPTIONS = [
  { key: 'popularity', label: 'Popularity' },
  { key: 'price_asc', label: 'Price: Low to High' },
  { key: 'price_desc', label: 'Price: High to Low' },
  { key: 'rating', label: 'Rating' },
  { key: 'discount', label: 'Discount' },
];

const SortModal = ({ visible, onClose, onApply, currentSortOption }) => {
  // This state holds the user's choice *before* they hit "Apply"
  const [selectedOption, setSelectedOption] = useState(currentSortOption);

  // Sync the state if the parent's prop changes
  useEffect(() => {
    setSelectedOption(currentSortOption);
  }, [currentSortOption]);

  const handleApply = () => {
    onApply(selectedOption);
  };

  const renderSortItem = ({ item }) => {
    const isSelected = selectedOption === item.key;
    return (
      <TouchableOpacity style={styles.optionRow} onPress={() => setSelectedOption(item.key)}>
        <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
          {item.label}
        </Text>
        {isSelected && <Icon name="checkmark-sharp" size={22} color={COLORS.primary} />}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <SafeAreaView>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Sort By</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="close-sharp" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={SORT_OPTIONS}
              renderItem={renderSortItem}
              keyExtractor={(item) => item.key}
              style={styles.list}
            />
            <View style={styles.footer}>
              <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    padding: 4,
  },
  list: {
    maxHeight: 300, // Prevent modal from being too tall on small screens
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  optionLabel: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  optionLabelSelected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SortModal;