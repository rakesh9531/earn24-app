import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { authService } from '../services/authService';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAlert } from '../components/CustomAlert';

const ResetPasswordScreen = ({ navigation, route }) => {
  const { mobileNumber } = route.params;
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPassVisible, setIsPassVisible] = useState(false);
  const { showAlert, AlertModal } = useAlert();

  const handleReset = async () => {
    if (otp.length !== 6) { showAlert('error', 'Invalid OTP', 'OTP must be exactly 6 digits.'); return; }
    if (!newPassword || newPassword.length < 6) { showAlert('error', 'Weak Password', 'Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { showAlert('error', 'Passwords Mismatch', 'Your new passwords do not match.'); return; }

    setIsLoading(true);
    try {
      const response = await authService.resetPasswordVerify({
        mobile_number: mobileNumber,
        otp: otp,
        new_password: newPassword
      });

      if (response.status === true) {
        showAlert('success', 'Password Reset! 🔒', 'Your password has been reset successfully.', {
          confirmText: 'Go to Login',
          onConfirm: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }),
        });
      }
    } catch (error) {
      showAlert('error', 'Reset Failed', error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter OTP sent to {mobileNumber} and your new password.</Text>

        <TextInput 
            style={styles.otpInput} 
            placeholder="Enter 6-Digit OTP" 
            placeholderTextColor="#CCC"
            keyboardType="number-pad" 
            maxLength={6} 
            value={otp}
            onChangeText={setOtp}
        />

        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>New Password</Text>
            <View style={styles.inputRow}>
                <TextInput 
                    style={styles.input} 
                    value={newPassword} 
                    onChangeText={setNewPassword} 
                    secureTextEntry={!isPassVisible}
                    placeholder="Enter new password"
                    placeholderTextColor="#BDBDBD"
                />
                <TouchableOpacity onPress={() => setIsPassVisible(!isPassVisible)}>
                    <Icon name={isPassVisible ? 'eye-outline' : 'eye-off-outline'} size={24} color="#828282" />
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.inputRow}>
                <TextInput 
                    style={styles.input} 
                    value={confirmPassword} 
                    onChangeText={setConfirmPassword} 
                    secureTextEntry={!isPassVisible}
                    placeholder="Confirm new password"
                    placeholderTextColor="#BDBDBD"
                />
            </View>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleReset} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#FFF"/> : <Text style={styles.btnText}>Reset Password</Text>}
        </TouchableOpacity>
      </View>
      <AlertModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { padding: 25, paddingTop: 50 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#181725', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#7C7C7C', marginBottom: 30 },
  otpInput: { fontSize: 20, borderBottomWidth: 2, borderBottomColor: '#0CA201', textAlign: 'center', marginBottom: 30, padding: 10, letterSpacing: 5 },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 16, color: '#7C7C7C', marginBottom: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E2E2E2', paddingBottom: 8 },
  input: { flex: 1, fontSize: 16, color: '#181725', fontWeight: '500', paddingVertical: 0 },
  btn: { backgroundColor: '#0CA201', padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: '600' }
});

export default ResetPasswordScreen;