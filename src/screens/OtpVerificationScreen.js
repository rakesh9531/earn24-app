import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput,
  ActivityIndicator, Keyboard, Image, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useAlert } from '../components/CustomAlert';

const OtpVerificationScreen = ({ navigation, route }) => {
  const { mobileNumber, flow } = route.params || {};
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
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Top Back Button */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={22} color="#0F172A" />
            </TouchableOpacity>
          </View>

          {/* Header Brand Section */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/images/earn24_logo.png')} 
                style={styles.logoImage} 
                resizeMode="contain" 
              />
              <Text allowFontScaling={false} style={styles.logoText}>Earn24</Text>
            </View>
            <Text allowFontScaling={false} style={styles.tagline}>Grow • Earn • Succeed</Text>

            <Text allowFontScaling={false} style={styles.welcomeTitle}>OTP Verification</Text>
            <Text allowFontScaling={false} style={styles.welcomeSubtitle}>
              We sent a 6-digit verification code to {'\n'}
              <Text style={{ fontWeight: '700', color: '#00A63E' }}>+91 {mobileNumber}</Text>
            </Text>

            {/* Shield Avatar Circle */}
            <View style={styles.avatarCircle}>
              <Icon name="shield-checkmark" size={24} color="#FFFFFF" />
            </View>
          </View>

          {/* White Card Section */}
          <View style={styles.formCard}>
            <View style={styles.inputContainer}>
              <Text allowFontScaling={false} style={styles.inputLabel}>Enter 6-Digit OTP *</Text>
              <View style={styles.inputBox}>
                <Icon name="lock-open-outline" size={18} color="#00A63E" style={styles.leftIcon} />
                <TextInput
                  style={styles.otpInput}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholder="• • • • • •"
                  placeholderTextColor="#94A3B8"
                  allowFontScaling={false}
                  autoFocus
                />
              </View>
            </View>

            {/* Verify Button */}
            <TouchableOpacity 
              style={[styles.verifyButton, isLoading && styles.disabledButton]} 
              onPress={handleVerify} 
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={styles.btnContentRow}>
                  <Icon name="checkmark-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text allowFontScaling={false} style={styles.verifyText}>Verify & Proceed</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Resend OTP */}
            <View style={styles.resendContainer}>
              <Text allowFontScaling={false} style={styles.resendLabel}>Didn't receive code? </Text>
              <TouchableOpacity onPress={handleResend} disabled={!canResend}>
                <Text allowFontScaling={false} style={[styles.resendLink, !canResend && styles.disabledLink]}>
                  {canResend ? "Resend OTP" : `Resend in ${timer}s`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AlertModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#EBF7EF' 
  },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center',
    paddingVertical: 20,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerBackBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#EBF7EF',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 36,
    height: 36,
    marginRight: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#00A63E',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 14,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 18,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00A63E',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    marginBottom: -24,
    zIndex: 10,
    shadowColor: '#00A63E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  formCard: { 
    paddingHorizontal: 22, 
    paddingTop: 36, 
    paddingBottom: 30,
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 28, 
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 6
  },
  inputContainer: { 
    marginBottom: 20 
  },
  inputLabel: { 
    fontSize: 13, 
    fontWeight: '600',
    color: '#334155', 
    marginBottom: 6 
  },
  inputBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F8FAFC',
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
  },
  leftIcon: {
    marginRight: 8,
  },
  otpInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 8,
    color: '#0F172A',
    paddingVertical: 0,
  },
  verifyButton: {
    backgroundColor: '#00A63E',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00A63E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  disabledButton: { opacity: 0.6 },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  resendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  resendLabel: { fontSize: 13, color: '#64748B' },
  resendLink: { fontSize: 13, color: '#00A63E', fontWeight: '800' },
  disabledLink: { color: '#94A3B8', fontWeight: '500' }
});

export default OtpVerificationScreen;