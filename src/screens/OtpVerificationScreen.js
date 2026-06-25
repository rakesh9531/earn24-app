import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput,
  ActivityIndicator, Keyboard
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useAlert } from '../components/CustomAlert';

const OtpVerificationScreen = ({ navigation, route }) => {
  const { mobileNumber, flow } = route.params;
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const { login } = useContext(AuthContext);
  const { showAlert, AlertModal } = useAlert();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      showAlert('error', 'Invalid OTP', 'Please enter a valid 6-digit OTP.');
      return;
    }
    
    setIsLoading(true);
    Keyboard.dismiss();

    try {
      if (flow === 'REGISTER') {
        const response = await authService.registerVerify({ mobile_number: mobileNumber, otp });
        
        if (response.status === true) {
          await login(response.data.user, response.data.token);
          showAlert('success', 'Welcome! 🎉', 'Your account has been created successfully.', {
            confirmText: 'Start Earning',
            onConfirm: () => navigation.reset({ index: 0, routes: [{ name: 'AppTabs' }] }),
          });
        }
      } 
    } catch (error) {
      showAlert('error', 'Verification Failed', error.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setTimer(30);
    setOtp('');

    try {
      await authService.resendOtp({ mobile_number: mobileNumber });
      showAlert('success', 'OTP Sent! 📱', 'A new OTP has been sent to your mobile number.');
    } catch (error) {
      showAlert('error', 'Resend Failed', error.message || 'Failed to resend OTP. Please try again.');
      setCanResend(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          We sent a verification code to {mobileNumber}.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.otpInput}
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            placeholderTextColor="#C7C7C7"
            autoFocus
          />
        </View>

        <TouchableOpacity 
          style={[styles.verifyButton, isLoading && styles.disabledButton]} 
          onPress={handleVerify} 
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.verifyText}>Verify & Proceed</Text>}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendLabel}>Didn't receive code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={!canResend}>
            <Text style={[styles.resendLink, !canResend && styles.disabledLink]}>
              {canResend ? "Resend OTP" : `Resend in ${timer}s`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <AlertModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 30, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#181725', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#7C7C7C', marginBottom: 40, lineHeight: 24 },
  inputContainer: { marginBottom: 30 },
  otpInput: {
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#0CA201',
    paddingVertical: 10,
    textAlign: 'center',
    color: '#181725',
    letterSpacing: 8
  },
  verifyButton: {
    backgroundColor: '#0CA201',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#0CA201',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  disabledButton: { opacity: 0.7 },
  verifyText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  resendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  resendLabel: { fontSize: 14, color: '#7C7C7C' },
  resendLink: { fontSize: 14, color: '#0CA201', fontWeight: 'bold' },
  disabledLink: { color: '#BDBDBD' }
});

export default OtpVerificationScreen;