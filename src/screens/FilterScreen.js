// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, LayoutAnimation, UIManager, Platform, Button } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { categoryService } from '../services/categoryService'; // You need this service
// import Icon from 'react-native-vector-icons/Ionicons';

// // Required for LayoutAnimation on Android
// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// // Reusable Accordion Item Component (same as from AllCategoriesScreen)
// const AccordionItem = ({ item, onSelect, selectedValue }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const hasChildren = item.children && item.children.length > 0;
//   const isSelected = selectedValue === item.id;

//   const handlePress = () => {
//     if (hasChildren) {
//       LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//       setIsExpanded(!isExpanded);
//     } else {
//       onSelect(item);
//     }
//   };

//   return (
//     <View style={styles.accordionItemContainer}>
//       <TouchableOpacity style={styles.itemHeader} onPress={handlePress}>
//         <Text style={[styles.itemTitle, isSelected && styles.itemTitleSelected]}>{item.name}</Text>
//         <Icon name={isExpanded ? 'chevron-down' : 'chevron-forward'} size={20} color="#6B7280" />
//       </TouchableOpacity>
//       {isExpanded && hasChildren && (
//         <View style={styles.subItemContainer}>
//           {item.children.map(child => (
//             <TouchableOpacity key={child.id} style={styles.subItem} onPress={() => onSelect(child)}>
//               <Text style={[styles.subItemText, selectedValue === child.id && styles.itemTitleSelected]}>{child.name}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };


// const FilterScreen = () => {
//     const route = useRoute();
//     const navigation = useNavigation();

//     // State to hold the temporary filter selections
//     const [tempSelectedCategory, setTempSelectedCategory] = useState(route.params.currentFilters?.categoryId || null);
//     const [categoryTree, setCategoryTree] = useState([]);
    
//     // Fetch the category tree for the accordion menu
//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const response = await categoryService.getCategoryTree();
//                 if (response.status) {
//                     setCategoryTree(response.data);
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch categories for filter:", error);
//             }
//         };
//         fetchCategories();
//     }, []);

//     const applyFilters = () => {
//         const newFilters = {
//             categoryId: tempSelectedCategory,
//             // You can add other filters like brandId here
//         };
//         navigation.navigate({
//             name: 'SearchResults',
//             params: { newFilters },
//             merge: true,
//         });
//     };
    
//     const clearFilters = () => {
//         setTempSelectedCategory(null);
//         // Navigate back with empty filters
//          navigation.navigate({
//             name: 'SearchResults',
//             params: { newFilters: {} },
//             merge: true,
//         });
//     }

//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.header}>
//                 <Text style={styles.title}>Filters</Text>
//                 <TouchableOpacity onPress={clearFilters}>
//                     <Text style={styles.clearText}>Clear All</Text>
//                 </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.filterScrollView}>
//                 <View style={styles.filterSection}>
//                     <Text style={styles.sectionTitle}>Category</Text>
//                     {categoryTree.map(item => (
//                         <AccordionItem 
//                             key={item.id}
//                             item={item}
//                             onSelect={(category) => setTempSelectedCategory(category.id)}
//                             selectedValue={tempSelectedCategory}
//                         />
//                     ))}
//                 </View>
//                 {/* You can add more sections here for Brand, Price, etc. */}
//             </ScrollView>

//             <View style={styles.footer}>
//                 <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
//                     <Text style={styles.applyButtonText}>Apply Filters</Text>
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#FFFFFF' },
//     header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
//     title: { fontSize: 20, fontWeight: 'bold' },
//     clearText: { color: '#D32F2F', fontSize: 14, fontWeight: '500' },
//     filterScrollView: { flex: 1 },
//     filterSection: { padding: 16 },
//     sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
//     footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
//     applyButton: { backgroundColor: '#059669', padding: 16, borderRadius: 12, alignItems: 'center' },
//     applyButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    
//     // Accordion Styles
//     accordionItemContainer: { borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
//     itemHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
//     itemTitle: { flex: 1, fontSize: 16, color: '#1F2937' },
//     itemTitleSelected: { color: '#059669', fontWeight: 'bold' },
//     subItemContainer: { paddingLeft: 16 },
//     subItem: { paddingVertical: 14, paddingLeft: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
//     subItemText: { fontSize: 15, color: '#6B7280' },
// });

// export default FilterScreen;














import React, { useState, useEffect } from 'react'; // <-- THE FIX IS HERE
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, LayoutAnimation, UIManager, Platform, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AccordionItem = ({ item, onSelect, selectedValue }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isSelected = selectedValue === item.id;

  const handlePress = () => {
    if (hasChildren) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsExpanded(!isExpanded);
    } else {
      onSelect(item);
    }
  };

  return (
    <View style={styles.accordionItemContainer}>
      <TouchableOpacity style={styles.itemHeader} onPress={handlePress}>
        <Text style={[styles.itemTitle, isSelected && styles.itemTitleSelected]}>{item.name}</Text>
        <Icon name={isExpanded ? 'chevron-down' : 'chevron-forward'} size={20} color="#6B7280" />
      </TouchableOpacity>
      {isExpanded && hasChildren && (
        <View style={styles.subItemContainer}>
          {item.children.map(child => (
            <TouchableOpacity key={child.id} style={styles.subItem} onPress={() => onSelect(child)}>
              <Text style={[styles.subItemText, selectedValue === child.id && styles.itemTitleSelected]}>{child.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const FilterScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [tempSelectedCategory, setTempSelectedCategory] = useState(route.params.currentFilters?.categoryId || null);
    const [categoryTree, setCategoryTree] = useState([]);
    
    useEffect(() => {
        const fetchCategories = async () => {
            const { categoryService } = require('../services/categoryService');
            try {
                const response = await categoryService.getCategoryTree();
                if (response.status) {
                    setCategoryTree(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch categories for filter:", error);
            }
        };
        fetchCategories();
    }, []);

    const applyFilters = () => {
        const newFilters = { categoryId: tempSelectedCategory };
        navigation.navigate({
            name: 'SearchResults',
            params: { newFilters },
            merge: true,
        });
    };
    
    const clearFilters = () => {
        setTempSelectedCategory(null);
         navigation.navigate({
            name: 'SearchResults',
            params: { newFilters: {} },
            merge: true,
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Filters</Text>
                <TouchableOpacity onPress={clearFilters}>
                    <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.filterScrollView}>
                <View style={styles.filterSection}>
                    <Text style={styles.sectionTitle}>Category</Text>
                    {categoryTree.map(item => (
                        <AccordionItem 
                            key={item.id}
                            item={item}
                            onSelect={(category) => setTempSelectedCategory(category.id)}
                            selectedValue={tempSelectedCategory}
                        />
                    ))}
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                    <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    title: { fontSize: 20, fontWeight: 'bold' },
    clearText: { color: '#D32F2F', fontSize: 14, fontWeight: '500' },
    filterScrollView: { flex: 1 },
    filterSection: { padding: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
    footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
    applyButton: { backgroundColor: '#059669', padding: 16, borderRadius: 12, alignItems: 'center' },
    applyButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    accordionItemContainer: { borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    itemHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
    itemTitle: { flex: 1, fontSize: 16, color: '#1F2937' },
    itemTitleSelected: { color: '#059669', fontWeight: 'bold' },
    subItemContainer: { paddingLeft: 16 },
    subItem: { paddingVertical: 14, paddingLeft: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    subItemText: { fontSize: 15, color: '#6B7280' },
});

export default FilterScreen;