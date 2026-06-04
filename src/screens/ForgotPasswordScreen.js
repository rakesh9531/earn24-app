import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { authService } from '../services/authService';

const ForgotPasswordScreen = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      Alert.alert("Error", "Enter a valid 10-digit mobile number.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await authService.forgotPasswordInitiate({ mobile_number: mobileNumber });
      if (response.status === true) {
        navigation.navigate('ResetPassword', { mobileNumber });
      }
    } catch (error) {
      Alert.alert("Error", error.message || "User not found.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Enter your mobile number to reset password.</Text>
        
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View style={styles.inputRow}>
                <TextInput 
                    style={styles.input} 
                    value={mobileNumber} 
                    onChangeText={setMobileNumber} 
                    keyboardType="phone-pad" 
                    maxLength={10} 
                    placeholder="Enter 10-digit mobile number"
                    placeholderTextColor="#BDBDBD"
                />
            </View>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleSendOtp} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#FFF"/> : <Text style={styles.btnText}>Send OTP</Text>}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { padding: 25, paddingTop: 50 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#181725', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#7C7C7C', marginBottom: 30 },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 16, color: '#7C7C7C', marginBottom: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E2E2E2', paddingBottom: 8 },
  input: { flex: 1, fontSize: 16, color: '#181725', fontWeight: '500', paddingVertical: 0 },
  btn: { backgroundColor: '#0CA201', padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  backBtn: { marginTop: 20, alignItems: 'center' },
  backText: { color: '#181725', fontSize: 14 }
});

export default ForgotPasswordScreen;