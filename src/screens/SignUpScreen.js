import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { authService } from '../services/authService';
import { useAlert } from '../components/CustomAlert';

// Custom Input Component matching Login Screen
const CustomTextInput = ({ label, iconName, isPassword, editable = true, ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const containerStyle = !editable ? [styles.inputContainer, styles.disabledInputContainer] : styles.inputContainer;
  const labelStyle = !editable ? [styles.inputLabel, styles.disabledLabel] : styles.inputLabel;
  return (
    <View style={containerStyle}>
      <Text allowFontScaling={false} style={labelStyle}>{label}</Text>
      <View style={[styles.inputBox, !editable && styles.disabledInputBox]}>
        {iconName && <Icon name={iconName} size={18} color="#00A63E" style={styles.leftIcon} />}
        <TextInput 
          style={styles.input} 
          secureTextEntry={isPassword && !isPasswordVisible} 
          placeholderTextColor="#94A3B8" 
          editable={editable}
          allowFontScaling={false}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeBtn}>
            <Icon name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'} size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const CustomCheckbox = ({ label, isChecked, onCheck, disabled = false }) => (
  <TouchableOpacity 
    style={[styles.checkboxContainer, disabled && styles.disabledCheckbox]} 
    onPress={onCheck} 
    disabled={disabled} 
    activeOpacity={0.7}
  >
    <View style={[styles.checkboxBox, isChecked && styles.checkboxChecked]}>
      {isChecked && <Icon name="checkmark" size={14} color="#FFFFFF" />}
    </View>
    <Text allowFontScaling={false} style={[styles.checkboxText, disabled && styles.disabledLabel]}>{label}</Text>
  </TouchableOpacity>
);

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isDefaultSponsor, setIsDefaultSponsor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- Email OTP & Terms Checkbox State ---
  const [emailOtp, setEmailOtp] = useState('');
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const { showAlert, AlertModal } = useAlert();

  useEffect(() => {
    if (isDefaultSponsor) {
      setReferralCode('');
    }
  }, [isDefaultSponsor]);

  const isValidEmailFormat = (emailStr) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr.trim());
  };

  const handleSendEmailOtp = async () => {
    if (!email || !isValidEmailFormat(email)) {
      showAlert('error', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setIsSendingEmailOtp(true);
    try {
      const response = await authService.sendEmailOtp({ email: email.trim() });
      if (response && response.status) {
        setIsEmailOtpSent(true);
        showAlert('success', 'OTP Sent 📧', response.message || `OTP sent to ${email}.`, { confirmText: 'OK' });
        if (response.mockOtp) {
          setEmailOtp(response.mockOtp);
        }
      } else {
        showAlert('error', 'Failed', response.message || 'Could not send OTP to email.');
      }
    } catch (e) {
      showAlert('error', 'Email OTP Error', e.message || 'Failed to send OTP.');
    } finally {
      setIsSendingEmailOtp(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp || emailOtp.trim().length === 0) {
      showAlert('error', 'Missing OTP', 'Please enter the 6-digit OTP code sent to your email.');
      return;
    }
    setIsVerifyingEmailOtp(true);
    try {
      const response = await authService.verifyEmailOtp({ email: email.trim(), otp: emailOtp.trim() });
      if (response && response.status) {
        setIsEmailVerified(true);
        showAlert('success', 'Email Verified! ✓', 'Your email address has been verified successfully.');
      } else {
        showAlert('error', 'Invalid OTP', response.message || 'OTP verification failed.');
      }
    } catch (e) {
      showAlert('error', 'Verification Error', e.message || 'OTP verification failed.');
    } finally {
      setIsVerifyingEmailOtp(false);
    }
  };

  const handleSignUp = async () => {
    // 1. Validation
    if (!fullName || !username || !email || !mobileNumber || !password || !confirmPassword) {
      showAlert('error', 'Missing Fields', 'Please fill in all required fields.');
      return;
    }
    if (!isValidEmailFormat(email)) {
      showAlert('error', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!isEmailVerified) {
      showAlert('error', 'Verify Email First', 'Please verify your Email address using the Send OTP button before creating an account.');
      return;
    }
    if (password !== confirmPassword) {
      showAlert('error', 'Passwords Mismatch', 'Your passwords do not match. Please re-enter.');
      return;
    }
    if (mobileNumber.length !== 10) {
      showAlert('error', 'Invalid Mobile', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!isTermsAccepted) {
      showAlert('error', 'Terms & Conditions Required', 'Please accept the Terms & Conditions of EARN24 to proceed.');
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        full_name: fullName,
        username,
        email,
        mobile_number: mobileNumber,
        password,
        referral_code: isDefaultSponsor ? null : referralCode,
        default_sponsor: isDefaultSponsor,
        device_token: "placeholder_device_token", 
      };
      
      // 2. Call Initiate API (Sends OTP)
      const response = await authService.registerInitiate(userData);

      if (response && response.status === true) {
        showAlert('success', 'OTP Sent! 📱', `Verification code sent to ${mobileNumber}`, {
          confirmText: 'Continue',
          onConfirm: () => navigation.navigate('OtpVerification', { mobileNumber, flow: 'REGISTER' }),
        });
      } else {
        throw new Error(response.message || 'An unknown error occurred.');
      }
    } catch (error) {
      showAlert('error', 'Sign Up Failed', error.message || 'An unexpected error occurred.');
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
            <Text allowFontScaling={false} style={styles.welcomeTitle}>Create Account</Text>
            <Text allowFontScaling={false} style={styles.welcomeSubtitle}>Join Earn24 & Start Earning</Text>
          </View>

          {/* White Card Form Section */}
          <View style={styles.formCard}>
            <CustomTextInput 
              label="Full Name *" 
              iconName="person-outline"
              value={fullName} 
              onChangeText={setFullName} 
              placeholder="e.g., Rohan Sharma"
            />

            <CustomTextInput 
              label="Username *" 
              iconName="at-outline"
              value={username} 
              onChangeText={setUsername} 
              placeholder="e.g., rohan24"
              autoCapitalize="none" 
            />

            {/* Email Field with Send OTP Inline Action */}
            <View style={{ marginBottom: 12 }}>
              <CustomTextInput 
                label="Email *" 
                iconName="mail-outline"
                value={email} 
                onChangeText={(val) => {
                  setEmail(val);
                  setIsEmailVerified(false);
                  setIsEmailOtpSent(false);
                }} 
                placeholder="e.g., rohan@gmail.com" 
                keyboardType="email-address" 
                autoCapitalize="none" 
                editable={!isEmailVerified}
              />
              {/* Send OTP / Verified Badge Row */}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 }}>
                {isEmailVerified ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                    <Icon name="checkmark-circle" size={14} color="#16A34A" />
                    <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: '700', color: '#16A34A', marginLeft: 4 }}>
                      Email Verified
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={{ backgroundColor: isValidEmailFormat(email) ? '#00A63E' : '#94A3B8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }}
                    onPress={handleSendEmailOtp}
                    disabled={!isValidEmailFormat(email) || isSendingEmailOtp}
                  >
                    {isSendingEmailOtp ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text allowFontScaling={false} style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>
                        {isEmailOtpSent ? 'Resend OTP' : 'Send OTP'}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>

              {/* Email OTP Verification Sub-Box */}
              {isEmailOtpSent && !isEmailVerified && (
                <View style={{ marginTop: 10, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1' }}>
                  <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 6 }}>
                    Enter OTP sent to your Email:
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      style={{ flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 6, paddingHorizontal: 10, height: 38, fontSize: 14, color: '#0F172A' }}
                      placeholder="6-digit OTP"
                      placeholderTextColor="#94A3B8"
                      keyboardType="number-pad"
                      maxLength={6}
                      value={emailOtp}
                      onChangeText={setEmailOtp}
                    />
                    <TouchableOpacity
                      style={{ marginLeft: 8, backgroundColor: '#00A63E', paddingHorizontal: 14, height: 38, borderRadius: 6, justifyContent: 'center', alignItems: 'center' }}
                      onPress={handleVerifyEmailOtp}
                      disabled={isVerifyingEmailOtp}
                    >
                      {isVerifyingEmailOtp ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text allowFontScaling={false} style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>
                          Verify OTP
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            <CustomTextInput
              label="Mobile Number *"
              iconName="call-outline"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
              placeholder="Your 10-digit mobile number"
              maxLength={10}
            />

            <CustomTextInput 
              label="Password *" 
              iconName="lock-closed-outline"
              value={password} 
              onChangeText={setPassword} 
              placeholder="••••••••" 
              isPassword 
            />

            <CustomTextInput 
              label="Confirm Password *" 
              iconName="lock-closed-outline"
              value={confirmPassword} 
              onChangeText={setConfirmPassword} 
              placeholder="••••••••" 
              isPassword 
            />

            <CustomTextInput 
              label="Referral Code (Optional)" 
              iconName="gift-outline"
              value={referralCode} 
              onChangeText={setReferralCode} 
              editable={!isDefaultSponsor} 
              placeholder="Enter sponsor referral code"
              autoCapitalize="none"
            />

            <CustomCheckbox 
              label="Join as a Default Sponsor" 
              isChecked={isDefaultSponsor} 
              onCheck={() => setIsDefaultSponsor(!isDefaultSponsor)} 
              disabled={referralCode.trim() !== ''}
            />
            
            {/* Dedicated Dynamic Terms & Conditions Acceptance Checkbox */}
            <View style={{ marginTop: 12, marginBottom: 16 }}>
              <TouchableOpacity 
                style={styles.checkboxContainer} 
                onPress={() => setIsTermsAccepted(!isTermsAccepted)} 
                activeOpacity={0.7}
              >
                <View style={[styles.checkboxBox, isTermsAccepted && styles.checkboxChecked]}>
                  {isTermsAccepted && <Icon name="checkmark" size={14} color="#FFFFFF" />}
                </View>
                <Text allowFontScaling={false} style={styles.checkboxText}>
                  I have read and understood the{' '}
                  <Text 
                    style={{ color: '#00A63E', fontWeight: '700', textDecorationLine: 'underline' }}
                    onPress={() => navigation.navigate('Information', { title: 'Terms & Conditions', pageKey: 'terms_conditions' })}
                  >
                    terms and conditions
                  </Text>
                  {' & '}
                  <Text 
                    style={{ color: '#00A63E', fontWeight: '700', textDecorationLine: 'underline' }}
                    onPress={() => navigation.navigate('Information', { title: 'Privacy Policy', pageKey: 'privacy_policy' })}
                  >
                    privacy policy
                  </Text>{' '}
                  of EARN24 and accept them.
                </Text>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.signUpButton, (isLoading || !isEmailVerified || !isTermsAccepted) && styles.disabledButton]} 
              onPress={handleSignUp} 
              disabled={isLoading || !isEmailVerified || !isTermsAccepted}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={styles.btnContentRow}>
                  <Icon name="arrow-forward-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text allowFontScaling={false} style={styles.signUpButtonText}>Get OTP</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Footer Sign In Link */}
            <TouchableOpacity 
              style={styles.footerTextContainer} 
              onPress={() => navigation.replace('Login')}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text allowFontScaling={false} style={styles.footerText}>
                  Already have an account? <Text style={styles.signUpHighlight}>Login</Text>
                </Text>
                <Icon name="chevron-forward" size={13} color="#00A63E" style={{ marginLeft: 4 }} />
              </View>
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
    paddingBottom: 60,
  },
  headerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 32,
    paddingBottom: 20,
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
    marginTop: 2,
    textAlign: 'center',
  },
  formCard: { 
    paddingHorizontal: 22, 
    paddingTop: 28, 
    paddingBottom: 40,
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 28, 
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 6
  },
  inputContainer: { 
    marginBottom: 16 
  },
  disabledInputContainer: { 
    opacity: 0.6 
  },
  inputLabel: { 
    fontSize: 13, 
    fontWeight: '600',
    color: '#334155', 
    marginBottom: 6 
  },
  disabledLabel: { 
    color: '#94A3B8' 
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
  disabledInputBox: {
    backgroundColor: '#F1F5F9',
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
  eyeBtn: {
    padding: 6,
  },
  checkboxContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 6, 
    marginBottom: 14 
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#00A63E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#00A63E',
  },
  checkboxText: { 
    fontSize: 13, 
    fontWeight: '600',
    color: '#334155' 
  },
  disabledCheckbox: { 
    opacity: 0.5 
  },
  termsContainer: { 
    marginVertical: 12 
  },
  termsText: { 
    fontSize: 12, 
    color: '#64748B', 
    textAlign: 'center', 
    lineHeight: 18 
  },
  linkHighlight: { 
    color: '#00A63E',
    fontWeight: '700' 
  },
  signUpButton: { 
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
  disabledButton: { 
    opacity: 0.6 
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpButtonText: { 
    color: '#FFFFFF', 
    fontSize: 15, 
    fontWeight: '700' 
  },
  footerTextContainer: { 
    marginTop: 22, 
    alignItems: 'center', 
    width: '100%',
    paddingBottom: 30,
  },
  footerText: { 
    fontSize: 13, 
    color: '#475569', 
    textAlign: 'center' 
  },
  signUpHighlight: { 
    color: '#00A63E', 
    fontWeight: '800' 
  },
});

export default SignUpScreen;