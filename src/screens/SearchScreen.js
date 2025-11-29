// import React, { useState } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';

// // --- DESIGN SYSTEM ---
// const COLORS = {
//   primary: '#059669',
//   text: '#1F2937',
//   textLight: '#6B7280',
//   surface: '#FFFFFF',
//   border: '#E5E7EB',
//   background: '#F9FAFB',
// };

// const SearchScreen = () => {
//   const navigation = useNavigation();
//   const [searchQuery, setSearchQuery] = useState('');

//   // This function is called when the user submits their search
//   const handleSearchSubmit = () => {
//     // Trim whitespace and ensure the query is not empty
//     const trimmedQuery = searchQuery.trim();
//     if (trimmedQuery.length > 0) {
//       // Navigate to the SearchResults screen, passing the query
//       navigation.navigate('SearchResults', { query: trimmedQuery });
//     }
//   };

//   // --- Example data for suggestions ---
//   const recentSearches = ['Tata Salt', 'Basmati Rice', 'Sunflower Oil'];
//   const trendingCategories = ['Spices', 'Snacks', 'Beverages', 'Cleaning'];

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* --- The Search Bar --- */}
//       <View style={styles.searchContainer}>
//         <Icon name="search-outline" size={22} color={COLORS.textLight} style={styles.searchIcon} />
//         <TextInput
//           style={styles.textInput}
//           placeholder="Search for products..."
//           placeholderTextColor={COLORS.textLight}
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           onSubmitEditing={handleSearchSubmit} // This triggers search on keyboard "Go" or "Enter"
//           returnKeyType="search"
//           autoFocus={true} // Automatically opens the keyboard
//         />
//         {searchQuery.length > 0 && (
//           <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearIcon}>
//             <Icon name="close-circle" size={22} color={COLORS.textLight} />
//           </TouchableOpacity>
//         )}
//       </View>
      
//       {/* --- Suggestions Area (Recent & Trending) --- */}
//       <View style={styles.suggestionsContainer}>
//         <Text style={styles.sectionTitle}>Recent Searches</Text>
//         <View style={styles.tagsContainer}>
//           {recentSearches.map((term, index) => (
//             <TouchableOpacity key={index} style={styles.tag} onPress={() => navigation.navigate('SearchResults', { query: term })}>
//               <Text style={styles.tagText}>{term}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <Text style={styles.sectionTitle}>Trending</Text>
//         <View style={styles.tagsContainer}>
//           {trendingCategories.map((term, index) => (
//             <TouchableOpacity key={index} style={styles.tag} onPress={() => navigation.navigate('SearchResults', { query: term })}>
//               <Text style={styles.tagText}>{term}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.surface,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.background,
//     borderRadius: 12,
//     margin: 16,
//     paddingHorizontal: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   textInput: {
//     flex: 1,
//     height: 50,
//     fontSize: 16,
//     color: COLORS.text,
//   },
//   clearIcon: {
//     padding: 4,
//   },
//   suggestionsContainer: {
//     paddingHorizontal: 16,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.text,
//     marginTop: 16,
//     marginBottom: 12,
//   },
//   tagsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//   },
//   tag: {
//     backgroundColor: COLORS.background,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   tagText: {
//     color: COLORS.textLight,
//     fontWeight: '500',
//   },
// });

// export default SearchScreen;















// import React, { useState, useCallback } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { productService } from '../services/productService';

// // --- DESIGN SYSTEM ---
// const COLORS = {
//   primary: '#059669',
//   text: '#1F2937',
//   textLight: '#6B7280',
//   surface: '#FFFFFF',
//   border: '#E5E7EB',
//   background: '#F9FAFB',
//   danger: '#D32F2F',
// };

// const RECENT_SEARCHES_KEY = '@recent_searches';

// const SearchScreen = () => {
//   const navigation = useNavigation();
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // State for dynamic data
//   const [recentSearches, setRecentSearches] = useState([]);
//   const [trendingSearches, setTrendingSearches] = useState([]);

//   // Load data when the screen comes into focus
//   useFocusEffect(
//     useCallback(() => {
//       const loadData = async () => {
//         // Load recent searches from local storage
//         try {
//           const storedSearches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
//           if (storedSearches) {
//             setRecentSearches(JSON.parse(storedSearches));
//           }
//         } catch (e) {
//           console.error("Failed to load recent searches", e);
//         }

//         // Fetch trending searches from the API
//         try {
//           const response = await productService.getTrendingSearches();
//           if (response.status) {
//             setTrendingSearches(response.data);
//           } else {
//             console.warn("Could not load trending searches:", response.message);
//           }
//         } catch (e) {
//           console.error("Failed to fetch trending searches", e);
//         }
//       };
      
//       loadData();
//     }, [])
//   );

//   // Function to save a new search term to local storage
//   const saveSearchTerm = async (term) => {
//     try {
//       const updatedSearches = recentSearches.filter(t => t.toLowerCase() !== term.toLowerCase());
//       const newSearches = [term, ...updatedSearches];
//       const limitedSearches = newSearches.slice(0, 8);
//       setRecentSearches(limitedSearches);
//       await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(limitedSearches));
//     } catch (e) {
//       console.error("Failed to save search term", e);
//     }
//   };

//   // Called when user submits search from keyboard or by pressing a tag
//   const handleSearchSubmit = (query) => {
//     const trimmedQuery = query.trim();
//     if (trimmedQuery.length > 0) {
//       saveSearchTerm(trimmedQuery);
//       navigation.navigate('SearchResults', { query: trimmedQuery });
//     }
//   };
  
//   // Helper to clear all recent searches
//   const clearRecentSearches = async () => {
//       try {
//           await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
//           setRecentSearches([]);
//           Alert.alert("Success", "Recent searches have been cleared.");
//       } catch (e) {
//           Alert.alert("Error", "Could not clear recent searches.");
//       }
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* --- The Search Bar --- */}
//       <View style={styles.searchContainer}>
//         <Icon name="search-outline" size={22} color={COLORS.textLight} style={styles.searchIcon} />
//         <TextInput
//           style={styles.textInput}
//           placeholder="Search for products..."
//           placeholderTextColor={COLORS.textLight}
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           onSubmitEditing={() => handleSearchSubmit(searchQuery)}
//           returnKeyType="search"
//           autoFocus={true}
//         />
//         {searchQuery.length > 0 && (
//           <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearIcon}>
//             <Icon name="close-circle" size={22} color={COLORS.textLight} />
//           </TouchableOpacity>
//         )}
//       </View>
      
//       {/* --- Suggestions Area (Recent & Trending) --- */}
//       <View style={styles.suggestionsContainer}>
//         {recentSearches.length > 0 && (
//             <View style={styles.section}>
//                 <View style={styles.sectionHeader}>
//                     <Text style={styles.sectionTitle}>Recent Searches</Text>
//                     <TouchableOpacity onPress={clearRecentSearches}>
//                         <Text style={styles.clearText}>Clear</Text>
//                     </TouchableOpacity>
//                 </View>
//                 <View style={styles.tagsContainer}>
//                 {recentSearches.map((term, index) => (
//                     <TouchableOpacity key={index} style={styles.tag} onPress={() => handleSearchSubmit(term)}>
//                         <Text style={styles.tagText}>{term}</Text>
//                     </TouchableOpacity>
//                 ))}
//                 </View>
//             </View>
//         )}

//         {trendingSearches.length > 0 && (
//              <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>Trending</Text>
//                 <View style={styles.tagsContainer}>
//                 {trendingSearches.map((term, index) => (
//                     <TouchableOpacity key={index} style={styles.tag} onPress={() => handleSearchSubmit(term)}>
//                         <Text style={styles.tagText}>{term}</Text>
//                     </TouchableOpacity>
//                 ))}
//                 </View>
//             </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//     container: { 
//         flex: 1, 
//         backgroundColor: COLORS.surface, 
//     },
//     searchContainer: { 
//         flexDirection: 'row', 
//         alignItems: 'center', 
//         backgroundColor: COLORS.background, 
//         borderRadius: 12, 
//         marginHorizontal: 16, 
//         marginTop: 16, 
//         paddingHorizontal: 12, 
//         borderWidth: 1, 
//         borderColor: COLORS.border, 
//     },
//     searchIcon: { 
//         marginRight: 8, 
//     },
//     textInput: { 
//         flex: 1, 
//         height: 50, 
//         fontSize: 16, 
//         color: COLORS.text, 
//     },
//     clearIcon: { 
//         padding: 4, 
//     },
//     suggestionsContainer: { 
//         paddingHorizontal: 16, 
//     },
//     section: { 
//         marginTop: 24, 
//     },
//     sectionHeader: { 
//         flexDirection: 'row', 
//         justifyContent: 'space-between', 
//         alignItems: 'center', 
//         marginBottom: 12, 
//     },
//     sectionTitle: { 
//         fontSize: 16, 
//         fontWeight: '600', 
//         color: COLORS.text, 
//     },
//     clearText: { 
//         color: COLORS.danger, 
//         fontSize: 13, 
//         fontWeight: '500' 
//     },
//     tagsContainer: { 
//         flexDirection: 'row', 
//         flexWrap: 'wrap', 
//         gap: 12, 
//     },
//     tag: { 
//         backgroundColor: COLORS.background, 
//         paddingVertical: 8, 
//         paddingHorizontal: 16, 
//         borderRadius: 20, 
//         borderWidth: 1, 
//         borderColor: COLORS.border, 
//     },
//     tagText: { 
//         color: COLORS.textLight, 
//         fontWeight: '500', 
//     },
// });

// export default SearchScreen;

























import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- DESIGN SYSTEM ---
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
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const { productService } = require('../services/productService');
        try {
          const storedSearches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
          if (storedSearches) { setRecentSearches(JSON.parse(storedSearches)); }
        } catch (e) { console.error("Failed to load recent searches", e); }
        try {
          const response = await productService.getTrendingSearches();
          if (response.status) {
            setTrendingSearches(response.data);
          }
        } catch (e) { console.error("Failed to fetch trending searches", e); }
      };
      loadData();
    }, [])
  );

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const searchTimer = setTimeout(async () => {
      const { productService } = require('../services/productService');
      setIsSearching(true);
      try {
        const response = await productService.getSearchSuggestions(searchQuery.trim());
        if (response.status) { setSuggestions(response.data); }
      } catch (error) { console.error("Failed to get search suggestions", error); } 
      finally { setIsSearching(false); }
    }, 300);
    return () => clearTimeout(searchTimer);
  }, [searchQuery]);

  const saveSearchTerm = async (term) => {
    try {
      const updatedSearches = recentSearches.filter(t => t.toLowerCase() !== term.toLowerCase());
      const newSearches = [term, ...updatedSearches];
      const limitedSearches = newSearches.slice(0, 8);
      setRecentSearches(limitedSearches);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(limitedSearches));
    } catch (e) { console.error("Failed to save search term", e); }
  };

  const handleSearchSubmit = (query) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length > 0) {
      saveSearchTerm(trimmedQuery);
      setSearchQuery('');
      setSuggestions([]);
      navigation.navigate('SearchResults', { query: trimmedQuery });
    }
  };
  
  const clearRecentSearches = async () => {
      try {
          await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
          setRecentSearches([]);
          Alert.alert("Success", "Recent searches have been cleared.");
      } catch (e) { Alert.alert("Error", "Could not clear recent searches."); }
  }

  // --- REDESIGNED SUGGESTION ITEM RENDERER ---
  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSearchSubmit(item.name)}>
        <Icon name="search-outline" size={20} color={COLORS.textLight} style={styles.suggestionIcon} />
        <Text style={styles.suggestionText}>{item.name}</Text>
    </TouchableOpacity>
  );

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
          autoFocus={true}
        />
        {isSearching ? <ActivityIndicator style={styles.clearIcon} /> : searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearIcon}>
            <Icon name="close-circle" size={22} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>
      
      {suggestions.length > 0 ? (
        <FlatList
            data={suggestions}
            keyExtractor={(item, index) => `${item.name}-${index}`}
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
                    {recentSearches.map((term, index) => (
                        <TouchableOpacity key={index} style={styles.tag} onPress={() => handleSearchSubmit(term)}><Text style={styles.tagText}>{term}</Text></TouchableOpacity>
                    ))}
                    </View>
                </View>
            )}
            {trendingSearches.length > 0 && (
                 <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Trending</Text>
                    <View style={styles.tagsContainer}>
                    {trendingSearches.map((term, index) => (
                        <TouchableOpacity key={index} style={styles.tag} onPress={() => handleSearchSubmit(term)}><Text style={styles.tagText}>{term}</Text></TouchableOpacity>
                    ))}
                    </View>
                </View>
            )}
        </View>
      )}
    </SafeAreaView>
  );
};

// --- STYLES (WITH NEW STYLES FOR SUGGESTIONS) ---
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: COLORS.surface, 
    },
    searchContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: COLORS.background, 
        borderRadius: 12, 
        marginHorizontal: 16, 
        marginTop: 16, 
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
        marginTop: 24, 
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
    // --- REDESIGNED SUGGESTION STYLES ---
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