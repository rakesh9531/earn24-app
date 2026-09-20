import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, 
  TextInput, KeyboardAvoidingView, Platform, ScrollView, Image 
} from 'react-native';
import { authService } from '../services/authService';
import { useAlert } from '../components/CustomAlert';
import Icon from 'react-native-vector-icons/Ionicons';

const ForgotPasswordScreen = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert, AlertModal } = useAlert();

  const handleSendOtp = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      showAlert('error', 'Invalid Mobile Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await authService.forgotPasswordInitiate({ mobile_number: mobileNumber });
      if (response && response.status === true) {
        showAlert('success', 'OTP Sent! 📱', `Reset code sent to ${mobileNumber}`, {
          confirmText: 'Continue',
          onConfirm: () => navigation.navigate('ResetPassword', { mobileNumber }),
        });
      } else {
        throw new Error(response.message || 'No account found with this mobile number.');
      }
    } catch (error) {
      showAlert('error', 'User Not Found', error.message || 'No account found with this mobile number.');
    } finally {
      setIsLoading(false);
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
          {/* Top Back Navigation Bar */}
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

            <Text allowFontScaling={false} style={styles.welcomeTitle}>Forgot Password</Text>
            <Text allowFontScaling={false} style={styles.welcomeSubtitle}>Enter your registered mobile number to reset password</Text>

            {/* Key/Lock Avatar Circle */}
            <View style={styles.avatarCircle}>
              <Icon name="key-outline" size={24} color="#FFFFFF" />
            </View>
          </View>

          {/* White Card Section */}
          <View style={styles.formCard}>
            <View style={styles.inputContainer}>
              <Text allowFontScaling={false} style={styles.inputLabel}>Mobile Number *</Text>
              <View style={styles.inputBox}>
                <Icon name="call-outline" size={18} color="#00A63E" style={styles.leftIcon} />
                <TextInput 
                  style={styles.input} 
                  value={mobileNumber} 
                  onChangeText={setMobileNumber} 
                  keyboardType="phone-pad" 
                  maxLength={10} 
                  placeholder="Enter 10-digit mobile number"
                  placeholderTextColor="#94A3B8"
                  allowFontScaling={false}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.btn, isLoading && styles.disabledButton]} 
              onPress={handleSendOtp} 
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={styles.btnContentRow}>
                  <Icon name="paper-plane-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text allowFontScaling={false} style={styles.btnText}>Send OTP</Text>
                </View>
              )}
            </TouchableOpacity>
            
            {/* Back to Login Link */}
            <TouchableOpacity 
              style={styles.backBtn} 
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Icon name="chevron-back" size={16} color="#00A63E" style={{ marginRight: 4 }} />
              <Text allowFontScaling={false} style={styles.backText}>Back to Login</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
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
    height: 48,
  },
  leftIcon: {
    marginRight: 8,
  },
  input: { 
    flex: 1, 
    fontSize: 14, 
    color: '#0F172A', 
    fontWeight: '500', 
    paddingVertical: 0
  },
  btn: { 
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
  disabledButton: { 
    opacity: 0.6 
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { 
    color: '#FFFFFF', 
    fontSize: 15, 
    fontWeight: '700' 
  },
  backBtn: { 
    marginTop: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 10 
  },
  backText: { 
    color: '#00A63E', 
    fontSize: 14, 
    fontWeight: '700' 
  }
});

export default ForgotPasswordScreen;