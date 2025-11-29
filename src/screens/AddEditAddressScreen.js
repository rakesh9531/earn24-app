import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, SafeAreaView, ScrollView, 
    TextInput, TouchableOpacity, ActivityIndicator, Switch, 
    Alert 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { addressService } from '../services/addressService';

// --- Validation Schema using Yup ---
// This schema only validates the fields the user is actually entering.
const AddressSchema = Yup.object().shape({
  addressLine1: Yup.string().required('Address Line 1 is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  pincode: Yup.string()
    .required('Pincode is required')
    .matches(/^[1-9][0-9]{5}$/, 'Enter a valid 6-digit pincode'),
  addressType: Yup.string().required('Address type is required'),
});


const AddEditAddressScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const existingAddress = route.params?.addressToEdit  || null;
  const isEditMode = !!existingAddress;

  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    try {
        let response;
        // The payload now correctly matches what the backend controller expects.
        // It does NOT include fullName or mobileNumber.
        const payload = { ...values };

        if (isEditMode) {
            response = await addressService.updateAddress(existingAddress.id, payload);
        } else {
            response = await addressService.addAddress(payload);
        }

        if (response.status) {
            Alert.alert('Success', response.message || 'Address saved successfully!');
            navigation.goBack();
        } else {
            Alert.alert('Error', response.message || 'An unknown error occurred.');
        }
    } catch (error) {
        Alert.alert('Error', error.message || 'An error occurred while saving the address.');
    } finally {
        setIsLoading(false);
    }
  };
  
  // Set the screen title dynamically based on the mode
  useEffect(() => {
    navigation.setOptions({
        title: isEditMode ? 'Edit Delivery Address' : 'Add New Delivery Address'
    });
  }, [navigation, isEditMode]);


  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{
          addressLine1: existingAddress?.addressLine1 || '',
          addressLine2: existingAddress?.addressLine2 || '',
          landmark: existingAddress?.landmark || '',
          city: existingAddress?.city || '',
          state: existingAddress?.state || '',
          pincode: existingAddress?.pincode || '',
          addressType: existingAddress?.addressType || 'Home',
          isDefault: existingAddress?.isDefault || false,
        }}
        validationSchema={AddressSchema}
        onSubmit={handleFormSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
            
            {/* --- THIS SECTION HAS BEEN REMOVED --- */}
            {/* The Contact Details section is gone because this info comes from the user's main profile. */}

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Address Details</Text>
                <TextInput
                    style={styles.input}
                    placeholder="House No, Building, Street, Area"
                    onChangeText={handleChange('addressLine1')}
                    onBlur={handleBlur('addressLine1')}
                    value={values.addressLine1}
                />
                {errors.addressLine1 && touched.addressLine1 && <Text style={styles.errorText}>{errors.addressLine1}</Text>}

                <TextInput style={styles.input} placeholder="Address Line 2 (Optional)" onChangeText={handleChange('addressLine2')} onBlur={handleBlur('addressLine2')} value={values.addressLine2} />
                <TextInput style={styles.input} placeholder="Landmark (Optional)" onChangeText={handleChange('landmark')} onBlur={handleBlur('landmark')} value={values.landmark} />
            </View>
            
            <View style={styles.row}>
                <View style={styles.rowItem}>
                    <TextInput style={styles.input} placeholder="City" onChangeText={handleChange('city')} onBlur={handleBlur('city')} value={values.city} />
                    {errors.city && touched.city && <Text style={styles.errorText}>{errors.city}</Text>}
                </View>
                <View style={styles.rowItem}>
                     <TextInput style={styles.input} placeholder="State" onChangeText={handleChange('state')} onBlur={handleBlur('state')} value={values.state} />
                    {errors.state && touched.state && <Text style={styles.errorText}>{errors.state}</Text>}
                </View>
            </View>

            <View style={styles.inputGroup}>
                <TextInput style={styles.input} placeholder="Pincode" keyboardType="number-pad" maxLength={6} onChangeText={handleChange('pincode')} onBlur={handleBlur('pincode')} value={values.pincode} />
                {errors.pincode && touched.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}
            </View>

             <View style={styles.inputGroup}>
                <Text style={styles.label}>Address Type</Text>
                <View style={styles.addressTypeContainer}>
                    {['Home', 'Work', 'Other'].map(type => (
                        <TouchableOpacity 
                            key={type}
                            style={[styles.addressTypeButton, values.addressType === type && styles.addressTypeSelected]}
                            onPress={() => setFieldValue('addressType', type)}
                        >
                            <Text style={[styles.addressTypeText, values.addressType === type && styles.addressTypeSelectedText]}>{type}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.defaultToggleContainer}>
                <Text style={styles.label}>Set as Default Address</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={values.isDefault ? "#007bff" : "#f4f3f4"}
                    onValueChange={value => setFieldValue('isDefault', value)}
                    value={values.isDefault}
                />
            </View>

            <TouchableOpacity 
                style={[styles.saveButton, isLoading && styles.disabledButton]} 
                onPress={handleSubmit}
                disabled={isLoading}
            >
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save Address</Text>}
            </TouchableOpacity>
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

// --- Styles (No changes needed here) ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    formContainer: { padding: 20, paddingBottom: 40 },
    inputGroup: { marginBottom: 15 },
    label: { fontSize: 16, fontWeight: '500', marginBottom: 8, color: '#495057' },
    input: { backgroundColor: '#f8f9fa', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#dee2e6', marginBottom: 5 },
    errorText: { color: 'red', fontSize: 12, marginTop: 4 },
    row: { flexDirection: 'row', marginHorizontal: -5, marginBottom: 15 },
    rowItem: { flex: 1, marginHorizontal: 5 },
    addressTypeContainer: { flexDirection: 'row', gap: 10 },
    addressTypeButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, borderWidth: 1, borderColor: '#ced4da' },
    addressTypeSelected: { backgroundColor: '#007bff', borderColor: '#007bff' },
    addressTypeText: { color: '#343a40' },
    addressTypeSelectedText: { color: '#fff' },
    defaultToggleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20, paddingVertical: 10 },
    saveButton: { backgroundColor: '#0CA201', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    disabledButton: { backgroundColor: '#a5d6a7' },
    saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default AddEditAddressScreen;