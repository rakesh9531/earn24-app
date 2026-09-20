import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  Platform,
  StatusBar
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { productService } from '../services/productService';

const COLORS = {
  primary: '#059669',
  text: '#1F2937',
  textLight: '#6B7280',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  background: '#F9FAFB',
  danger: '#D32F2F',
};

const RECENT_SEARCHES_KEY = '@recent_searches';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const loadData = async () => {
        try {
          const storedSearches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
          if (storedSearches && isMounted) {
            const parsed = JSON.parse(storedSearches);
            if (Array.isArray(parsed)) {
              setRecentSearches(parsed);
            }
          }
        } catch (e) {
          console.error("Failed to load recent searches", e);
        }

        try {
          const response = await productService.getTrendingSearches();
          if (response && response.status && Array.isArray(response.data) && isMounted) {
            setTrendingSearches(response.data);
          }
        } catch (e) {
          console.error("Failed to fetch trending searches", e);
        }
      };
      loadData();
      return () => { isMounted = false; };
    }, [])
  );

  useEffect(() => {
    let isCancelled = false;
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setSearchError(null);
      return;
    }
    const searchTimer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const response = await productService.getSearchSuggestions(searchQuery.trim());
        if (isCancelled) return;

        if (response && response.status && Array.isArray(response.data)) {
          setSuggestions(response.data);
        } else if (response && response.message) {
          setSearchError(response.message);
          setSuggestions([]);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Failed to get search suggestions", error);
          setSearchError(error.message || 'Could not fetch live search suggestions.');
          setSuggestions([]);
        }
      } finally {
        if (!isCancelled) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(searchTimer);
    };
  }, [searchQuery]);

  const saveSearchTerm = async (term) => {
    if (!term) return;
    const cleanTerm = (typeof term === 'string' ? term : (term && term.name ? term.name : '')).toString().trim();
    if (!cleanTerm) return;

    try {
      const currentList = Array.isArray(recentSearches) ? recentSearches : [];
      const updatedSearches = currentList.filter(t => {
        const strVal = (typeof t === 'string' ? t : (t && t.name ? t.name : '')).toString();
        return strVal.toLowerCase() !== cleanTerm.toLowerCase();
      });
      const newSearches = [cleanTerm, ...updatedSearches].slice(0, 8);
      setRecentSearches(newSearches);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newSearches));
    } catch (e) {
      console.error("Failed to save search term", e);
    }
  };

  const handleSearchSubmit = (query) => {
    try {
      if (!query) return;
      const title = typeof query === 'string' ? query : (query && (query.name || query.title) ? (query.name || query.title) : '');
      const trimmedQuery = title.toString().trim();
      if (trimmedQuery.length > 0) {
        saveSearchTerm(trimmedQuery);
        navigation.navigate('SearchResults', { query: trimmedQuery });
      }
    } catch (e) {
      console.error("Error submitting search:", e);
      Alert.alert("Search Error", e.message || "Failed to launch search.");
    }
  };

  const clearRecentSearches = async () => {
    try {
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
      setRecentSearches([]);
    } catch (e) { console.error("Could not clear recent searches", e); }
  };

  const renderSuggestionItem = ({ item }) => {
    const title = typeof item === 'string' ? item : (item && (item.name || item.title) ? (item.name || item.title) : '');
    if (!title) return null;
    return (
      <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSearchSubmit(title)}>
        <Icon name="search-outline" size={20} color={COLORS.textLight} style={styles.suggestionIcon} />
        <Text style={styles.suggestionText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={22} color={COLORS.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Search for products..."
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => handleSearchSubmit(searchQuery)}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearIcon}>
            <Icon name="close-circle" size={22} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {suggestions.length > 0 ? (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => (item && item.id ? item.id.toString() : (item && item.name ? `${item.name}-${index}` : index.toString()))}
          renderItem={renderSuggestionItem}
        />
      ) : (
        <View style={styles.suggestionsContainer}>
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={clearRecentSearches}><Text style={styles.clearText}>Clear</Text></TouchableOpacity>
              </View>
              <View style={styles.tagsContainer}>
                {recentSearches.map((term, index) => {
                  const termStr = typeof term === 'string' ? term : (term && term.name ? term.name : String(term));
                  return (
                    <TouchableOpacity key={index} style={styles.tag} onPress={() => handleSearchSubmit(termStr)}>
                      <Text style={styles.tagText}>{termStr}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
          {trendingSearches.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trending</Text>
              <View style={styles.tagsContainer}>
                {trendingSearches.map((term, index) => {
                  const termStr = typeof term === 'string' ? term : (term && term.name ? term.name : String(term));
                  return (
                    <TouchableOpacity key={index} style={styles.tag} onPress={() => handleSearchSubmit(termStr)}>
                      <Text style={styles.tagText}>{termStr}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 6 : 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.text,
  },
  clearIcon: {
    padding: 4,
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  clearText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '500'
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tag: {
    backgroundColor: COLORS.background,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: {
    color: COLORS.textLight,
    fontWeight: '500',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    fontSize: 16,
    color: COLORS.text,
  },
});

export default SearchScreen;