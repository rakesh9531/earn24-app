import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, 
  TextInput, KeyboardAvoidingView, Platform, ScrollView, Image 
} from 'react-native';
import { authService } from '../services/authService';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAlert } from '../components/CustomAlert';

const ResetPasswordScreen = ({ navigation, route }) => {
  const { mobileNumber } = route.params || {};
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

      if (response && response.status === true) {
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

            <Text allowFontScaling={false} style={styles.welcomeTitle}>Reset Password</Text>
            <Text allowFontScaling={false} style={styles.welcomeSubtitle}>
              Enter OTP sent to <Text style={{ fontWeight: '700', color: '#00A63E' }}>+91 {mobileNumber}</Text> and your new password.
            </Text>

            {/* Lock Circle */}
            <View style={styles.avatarCircle}>
              <Icon name="lock-closed" size={24} color="#FFFFFF" />
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
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text allowFontScaling={false} style={styles.inputLabel}>New Password *</Text>
              <View style={styles.inputBox}>
                <Icon name="key-outline" size={18} color="#00A63E" style={styles.leftIcon} />
                <TextInput 
                  style={styles.input} 
                  value={newPassword} 
                  onChangeText={setNewPassword} 
                  secureTextEntry={!isPassVisible}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  allowFontScaling={false}
                />
                <TouchableOpacity onPress={() => setIsPassVisible(!isPassVisible)} style={styles.eyeBtn}>
                  <Icon name={isPassVisible ? 'eye-outline' : 'eye-off-outline'} size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text allowFontScaling={false} style={styles.inputLabel}>Confirm Password *</Text>
              <View style={styles.inputBox}>
                <Icon name="key-outline" size={18} color="#00A63E" style={styles.leftIcon} />
                <TextInput 
                  style={styles.input} 
                  value={confirmPassword} 
                  onChangeText={setConfirmPassword} 
                  secureTextEntry={!isPassVisible}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  allowFontScaling={false}
                />
              </View>
            </View>

            {/* Reset Button */}
            <TouchableOpacity 
              style={[styles.btn, isLoading && styles.disabledButton]} 
              onPress={handleReset} 
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={styles.btnContentRow}>
                  <Icon name="checkmark-done-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text allowFontScaling={false} style={styles.btnText}>Reset Password</Text>
                </View>
              )}
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
    marginBottom: 16 
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
  otpInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 6,
    color: '#0F172A',
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 6,
  },
  btn: { 
    backgroundColor: '#00A63E', 
    height: 50, 
    borderRadius: 12, 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
  btnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' }
});

export default ResetPasswordScreen;