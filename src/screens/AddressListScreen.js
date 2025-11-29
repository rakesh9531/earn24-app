// import React, { useState, useCallback } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
// import { addressService } from '../services/addressService';
// import { cartService } from '../services/cartService';
// import Icon from 'react-native-vector-icons/Ionicons';

// const AddressCard = ({ address, onSelect, isSelecting }) => {
//     // =================================================================
//     // === THE FIX IS HERE: Using the correct camelCase property names ===
//     // =================================================================
//     return (
//         <View style={styles.addressCard}>
//             <View style={styles.addressHeader}>
//                 <Icon name={address.addressType === 'Home' ? 'home' : 'briefcase'} size={20} color="#0CA201" />
//                 <Text style={styles.addressType}>{address.addressType}</Text>
//                 {address.isDefault ? <View style={styles.defaultTag}><Text style={styles.defaultTagText}>DEFAULT</Text></View> : null}
//             </View>
//             <Text style={styles.addressName}>{address.fullName}</Text>
//             <Text style={styles.addressText}>{`${address.addressLine1}, ${address.city}, ${address.state} - ${address.pincode}`}</Text>
//             <Text style={styles.addressText}>Mobile: {address.mobileNumber}</Text>

//             <View style={styles.addressActions}>
//                  <TouchableOpacity style={styles.actionButton}>
//                     <Icon name="create-outline" size={20} color="#007bff" />
//                     <Text style={styles.actionText}>Edit</Text>
//                  </TouchableOpacity>
//                  <TouchableOpacity style={styles.actionButton}>
//                     <Icon name="trash-outline" size={20} color="#D32F2F" />
//                     <Text style={[styles.actionText, {color: '#D32F2F'}]}>Delete</Text>
//                  </TouchableOpacity>
//             </View>

//             <TouchableOpacity 
//                 style={[styles.deliverButton, isSelecting && styles.disabledButton]} 
//                 onPress={() => onSelect(address)}
//                 disabled={isSelecting}
//             >
//                 {isSelecting ? <ActivityIndicator color="#fff" /> : <Text style={styles.deliverButtonText}>Deliver to this Address</Text>}
//             </TouchableOpacity>
//         </View>
//     );
// };

// const AddressListScreen = () => {
//     const navigation = useNavigation();
//     const route = useRoute();
//     const { itemsForCheckout } = route.params;

//     const [addresses, setAddresses] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSelecting, setIsSelecting] = useState(false);

//     useFocusEffect(
//         useCallback(() => {
//             const loadAddresses = async () => {
//                 setIsLoading(true);
//                 try {
//                     const response = await addressService.getAddresses();
//                     if (response.status) {
//                         setAddresses(response.data);
//                     }
//                 } catch (error) {
//                     Alert.alert("Error", "Could not load your addresses.");
//                 } finally {
//                     setIsLoading(false);
//                 }
//             };
//             loadAddresses();
//             return () => {}; // Cleanup function
//         }, [])
//     );

//     const handleSelectAddress = async (selectedAddress) => {
//         setIsSelecting(true);
//         try {
//             const response = await cartService.validateForCheckout(selectedAddress.pincode, itemsForCheckout);

//             if (response.status) {
//                 const validatedCartItems = response.data;
//                 const stillAvailableItems = validatedCartItems.filter(item => item.is_available);

//                 if (stillAvailableItems.length === 0) {
//                     Alert.alert("Items Unavailable", "None of your selected items can be delivered to this address. Please go back to your cart or choose another address.");
//                     return;
//                 }

//                 if (stillAvailableItems.length < itemsForCheckout.length) {
//                     Alert.alert( "Some Items Unavailable", "Some items in your cart are not deliverable to this address and will be removed if you proceed. Continue?",
//                         [
//                             { text: "Cancel", style: "cancel" },
//                             { text: "Proceed", onPress: () => navigation.navigate('OrderSummary', { selectedAddress, finalCartItems: stillAvailableItems }) }
//                         ]
//                     );
//                 } else {
//                     navigation.navigate('OrderSummary', { selectedAddress, finalCartItems: stillAvailableItems });
//                 }
//             } else {
//                 throw new Error(response.message || "Validation failed.");
//             }
//         } catch (error) {
//             Alert.alert('Error', error.message || 'An error occurred while validating your cart.');
//         } finally {
//             setIsSelecting(false);
//         }
//     };
    
//     if (isLoading) {
//         return <View style={styles.centered}><ActivityIndicator size="large" color="#0CA201" /></View>;
//     }

//     return (
//         <SafeAreaView style={styles.container}>
//             <FlatList
//                 data={addresses}
//                 renderItem={({ item }) => <AddressCard address={item} onSelect={handleSelectAddress} isSelecting={isSelecting} />}
//                 keyExtractor={item => item.id.toString()}
//                 ListEmptyComponent={<View style={styles.centered}><Text>No addresses found. Please add one.</Text></View>}
//                 contentContainerStyle={styles.listContent}
//             />
//             <View style={styles.footer}>
//                 <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddEditAddress')}>
//                     <Icon name="add" size={24} color="#fff" />
//                     <Text style={styles.addButtonText}>Add New Address</Text>
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//     );
// };

// // --- STYLES ---
// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#f8f9fa' },
//     centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     listContent: { padding: 16, paddingBottom: 100 },
//     addressCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1.5, borderColor: '#e9ecef', },
//     addressHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//     addressType: { fontSize: 16, fontWeight: 'bold', color: '#181725', marginLeft: 8 },
//     defaultTag: { backgroundColor: '#fef3c7', borderRadius: 6, marginLeft: 'auto' },
//     defaultTagText: { color: '#92400e', fontWeight: 'bold', fontSize: 10, paddingHorizontal: 8, paddingVertical: 4,},
//     addressName: { fontSize: 15, fontWeight: '500', color: '#343a40', marginBottom: 4 },
//     addressText: { fontSize: 14, color: '#6c757d', lineHeight: 20, marginTop: 4 },
//     addressActions: { flexDirection: 'row', paddingTop: 12, marginTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
//     actionButton: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
//     actionText: { marginLeft: 6, color: '#007bff', fontWeight: '500' },
//     deliverButton: { backgroundColor: '#0CA201', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 16 },
//     disabledButton: { backgroundColor: '#a5d6a7' },
//     deliverButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//     footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e9ecef' },
//     addButton: { backgroundColor: '#007bff', padding: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
//     addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
// });

// export default AddressListScreen;












import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { addressService } from '../services/addressService';
import { cartService } from '../services/cartService';
import Icon from 'react-native-vector-icons/Ionicons';

const AddressCard = ({ address, onSelect, isSelecting, mode }) => {
    const navigation = useNavigation();

    const handleEdit = () => {
        navigation.navigate('AddEditAddress', { addressToEdit: address });
    };

    const handleDelete = () => {
        Alert.alert( "Delete Address", "Are you sure you want to delete this address?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => { /* Add your API call to delete here */ } }
            ]
        );
    };

    return (
        <View style={styles.addressCard}>
            <View style={styles.addressHeader}>
                <Icon name={address.addressType === 'Home' ? 'home' : 'briefcase'} size={20} color="#0CA201" />
                <Text style={styles.addressType}>{address.addressType}</Text>
                {address.isDefault ? <View style={styles.defaultTag}><Text style={styles.defaultTagText}>DEFAULT</Text></View> : null}
            </View>
            <Text style={styles.addressName}>{address.fullName}</Text>
            <Text style={styles.addressText}>{`${address.addressLine1}, ${address.city}, ${address.state} - ${address.pincode}`}</Text>
            <Text style={styles.addressText}>Mobile: {address.mobileNumber}</Text>

            <View style={styles.addressActions}>
                 <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
                    <Icon name="create-outline" size={20} color="#007bff" />
                    <Text style={styles.actionText}>Edit</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
                    <Icon name="trash-outline" size={20} color="#D32F2F" />
                    <Text style={[styles.actionText, {color: '#D32F2F'}]}>Delete</Text>
                 </TouchableOpacity>
            </View>

            {/* --- THIS IS THE KEY UI CHANGE --- */}
            {/* Only show the "Deliver" button if we are in 'checkout' mode */}
            {mode === 'checkout' && (
                <TouchableOpacity 
                    style={[styles.deliverButton, isSelecting && styles.disabledButton]} 
                    onPress={() => onSelect(address)}
                    disabled={isSelecting}
                >
                    {isSelecting ? <ActivityIndicator color="#fff" /> : <Text style={styles.deliverButtonText}>Deliver to this Address</Text>}
                </TouchableOpacity>
            )}
        </View>
    );
};

const AddressListScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    
    // --- THIS IS THE FIX ---
    // Check if params exist. If they do, we are in 'checkout' mode.
    // The optional chaining operator `?.` prevents a crash if `route.params` is undefined.
    const mode = route.params?.itemsForCheckout ? 'checkout' : 'management';
    const itemsForCheckout = route.params?.itemsForCheckout || [];

    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSelecting, setIsSelecting] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const loadAddresses = async () => {
                setIsLoading(true);
                try {
                    const response = await addressService.getAddresses();
                    if (response.status) {
                        setAddresses(response.data);
                    }
                } catch (error) {
                    Alert.alert("Error", "Could not load your addresses.");
                } finally {
                    setIsLoading(false);
                }
            };
            loadAddresses();
            return () => {};
        }, [])
    );

    const handleSelectAddress = async (selectedAddress) => {
        // This function is now only relevant in 'checkout' mode
        if (mode !== 'checkout') return;

        setIsSelecting(true);
        try {
            const response = await cartService.validateForCheckout(selectedAddress.pincode, itemsForCheckout);
            if (response.status) {
                const validatedCartItems = response.data;
                const stillAvailableItems = validatedCartItems.filter(item => item.is_available);
                if (stillAvailableItems.length === 0) {
                    Alert.alert("Items Unavailable", "None of your selected items can be delivered to this address.");
                    return;
                }
                if (stillAvailableItems.length < itemsForCheckout.length) {
                    Alert.alert("Some Items Unavailable", "Some items will be removed if you proceed. Continue?",
                        [
                            { text: "Cancel", style: "cancel" },
                            { text: "Proceed", onPress: () => navigation.navigate('OrderSummary', { selectedAddress, finalCartItems: stillAvailableItems }) }
                        ]
                    );
                } else {
                    navigation.navigate('OrderSummary', { selectedAddress, finalCartItems: stillAvailableItems });
                }
            } else {
                throw new Error(response.message || "Validation failed.");
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'An error occurred while validating your cart.');
        } finally {
            setIsSelecting(false);
        }
    };
    
    if (isLoading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#0CA201" /></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={addresses}
                renderItem={({ item }) => <AddressCard address={item} onSelect={handleSelectAddress} isSelecting={isSelecting} mode={mode} />}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={<View style={styles.centered}><Text>No addresses found. Please add one.</Text></View>}
                contentContainerStyle={styles.listContent}
            />
            <View style={styles.footer}>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddEditAddress')}>
                    <Icon name="add" size={24} color="#fff" />
                    <Text style={styles.addButtonText}>Add New Address</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { padding: 16, paddingBottom: 100 },
    addressCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1.5, borderColor: '#e9ecef', },
    addressHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    addressType: { fontSize: 16, fontWeight: 'bold', color: '#181725', marginLeft: 8 },
    defaultTag: { backgroundColor: '#fef3c7', borderRadius: 6, marginLeft: 'auto' },
    defaultTagText: { color: '#92400e', fontWeight: 'bold', fontSize: 10, paddingHorizontal: 8, paddingVertical: 4,},
    addressName: { fontSize: 15, fontWeight: '500', color: '#343a40', marginBottom: 4 },
    addressText: { fontSize: 14, color: '#6c757d', lineHeight: 20, marginTop: 4 },
    addressActions: { flexDirection: 'row', paddingTop: 12, marginTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
    actionButton: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
    actionText: { marginLeft: 6, color: '#007bff', fontWeight: '500' },
    deliverButton: { backgroundColor: '#0CA201', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 16 },
    disabledButton: { backgroundColor: '#a5d6a7' },
    deliverButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e9ecef' },
    addButton: { backgroundColor: '#007bff', padding: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
    addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});

export default AddressListScreen;