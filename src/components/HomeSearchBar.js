import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeSearchBar = ({ navigation }) => {
  const handlePress = () => {
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate('Search');
    }
  };

  return (
    <TouchableOpacity
      style={styles.searchContainer}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <View style={styles.innerBox}>
        <Icon name="search-outline" size={20} color="#059669" style={styles.searchIcon} />
        <Text style={styles.placeholderText} numberOfLines={1}>
          Search for atta, oil, tea, health...
        </Text>
        <View style={styles.rightIconsContainer}>
          <Icon name="mic-outline" size={18} color="#64748B" style={styles.micIcon} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  innerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  placeholderText: {
    flex: 1,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '400',
  },
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  micIcon: {
    marginLeft: 8,
  },
});

export default memo(HomeSearchBar);
