import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useAlert } from '../components/CustomAlert';

// Custom Input Component matching Target Screenshot
const CustomTextInput = ({ label, iconName, isPassword, ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return (
    <View style={styles.inputContainer}>
      <Text allowFontScaling={false} style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputBox}>
        {iconName && <Icon name={iconName} size={18} color="#00A63E" style={styles.leftIcon} />}
        <TextInput 
          style={styles.input} 
          secureTextEntry={isPassword && !isPasswordVisible} 
          placeholderTextColor="#94A3B8" 
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

const LoginScreen = ({ navigation }) => {
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { showAlert, AlertModal } = useAlert();

  const handleLogin = async () => {
    if (!loginInput || !password) {
      showAlert('error', 'Missing Fields', 'Please enter your email/username and password.');
      return;
    }
    setIsLoading(true);
    try {
      const credentials = { identifier: loginInput, password };
      const response = await authService.login(credentials);

      if (response && response.status === true) {
        await login(response.data.user, response.data.token);
        navigation.reset({ index: 0, routes: [{ name: 'AppTabs' }] });
      } else {
        throw new Error(response.message || 'An unknown error occurred.');
      }
    } catch (error) {
      showAlert('error', 'Login Failed', error.message || 'An unexpected error occurred.');
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
            {/* Official Logo Image + Text */}
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/images/earn24_logo.png')} 
                style={styles.logoImage} 
                resizeMode="contain" 
              />
              <Text allowFontScaling={false} style={styles.logoText}>Earn24</Text>
            </View>
            <Text allowFontScaling={false} style={styles.tagline}>Grow • Earn • Succeed</Text>

            {/* Welcome Titles */}
            <Text allowFontScaling={false} style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text allowFontScaling={false} style={styles.welcomeSubtitle}>Login to Continue</Text>

            {/* User Avatar Circle - Floating on white card edge */}
            <View style={styles.avatarCircle}>
              <Icon name="person" size={24} color="#FFFFFF" />
            </View>
          </View>

          {/* White Card Section */}
          <View style={styles.formCard}>
            <CustomTextInput 
              label="Email, Username or Mobile" 
              iconName="mail-outline"
              value={loginInput} 
              onChangeText={setLoginInput} 
              placeholder="e.g., rohan@gmail.com" 
              autoCapitalize="none" 
            />
            <CustomTextInput 
              label="Password" 
              iconName="lock-closed-outline"
              value={password} 
              onChangeText={setPassword} 
              placeholder="••••••••" 
              isPassword 
            />
            
            {/* Forgot Password */}
            <TouchableOpacity 
              style={styles.forgotPasswordBtn} 
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text allowFontScaling={false} style={styles.forgotPasswordText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.disabledButton]} 
              onPress={handleLogin} 
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={styles.btnContentRow}>
                  <Icon name="arrow-forward-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text allowFontScaling={false} style={styles.loginButtonText}>Login</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Feature Chips */}
            <View style={styles.featureChipsRow}>
              <View style={styles.chipItem}>
                <Icon name="shield-checkmark-outline" size={14} color="#00A63E" />
                <Text allowFontScaling={false} style={styles.chipText}>Secure Login</Text>
              </View>
              <View style={styles.chipItem}>
                <Icon name="flash-outline" size={14} color="#00A63E" />
                <Text allowFontScaling={false} style={styles.chipText}>Fast & Reliable</Text>
              </View>
              <View style={styles.chipItem}>
                <Icon name="headset-outline" size={14} color="#00A63E" />
                <Text allowFontScaling={false} style={styles.chipText}>24/7 Support</Text>
              </View>
            </View>

            {/* Footer Sign Up Link */}
            <TouchableOpacity 
              style={styles.footerLinkContainer} 
              onPress={() => navigation.replace('SignUp')}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text allowFontScaling={false} style={styles.footerText}>
                  Don't have an account? <Text style={styles.signUpHighlight}>Sign Up</Text>
                </Text>
                <Icon name="chevron-forward" size={13} color="#00A63E" style={{ marginLeft: 4 }} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Alert Modal */}
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
    paddingVertical: 24,
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
    marginTop: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00A63E',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
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
    paddingBottom: 24,
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
  eyeBtn: {
    padding: 6,
  },
  forgotPasswordBtn: { 
    width: '100%', 
    alignItems: 'flex-end', 
    marginBottom: 18 
  },
  forgotPasswordText: { 
    fontSize: 12, 
    color: '#00A63E', 
    fontWeight: '700' 
  },
  loginButton: { 
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
  loginButtonText: { 
    color: '#FFFFFF', 
    fontSize: 15, 
    fontWeight: '700' 
  },
  featureChipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  chipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
  },
  footerLinkContainer: { 
    marginTop: 22, 
    alignItems: 'center', 
    width: '100%',
    paddingBottom: 10,
  },
  footerText: { 
    fontSize: 13, 
    color: '#475569', 
    textAlign: 'center',
  },
  signUpHighlight: { 
    color: '#00A63E', 
    fontWeight: '800' 
  },
});

export default LoginScreen;