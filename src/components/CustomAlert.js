/**
 * CustomAlert.js
 *
 * Beautiful animated Alert modal to replace the default React Native Alert.alert().
 *
 * USAGE — inside a component/screen:
 *
 *   import { useAlert } from '../components/CustomAlert';
 *
 *   const MyScreen = () => {
 *     const { alertConfig, showAlert, AlertModal } = useAlert();
 *
 *     // Simple error:
 *     showAlert('error', 'User Not Found', 'Please check your credentials.');
 *
 *     // Success:
 *     showAlert('success', 'Done!', 'Profile updated successfully.');
 *
 *     // Confirm with action:
 *     showAlert('confirm', 'Delete?', 'This cannot be undone.', {
 *       confirmText: 'Delete',
 *       onConfirm: () => deleteItem(),
 *     });
 *
 *     return (
 *       <View>
 *         ...your screen content...
 *         <AlertModal />   ← put this at the end of your return JSX
 *       </View>
 *     );
 *   };
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// ── Icon characters (no library needed) ─────────────────────────────────────
const ICONS = {
  success: '✓',
  error:   '✕',
  warning: '!',
  info:    'i',
  confirm: '?',
};

const COLORS = {
  success: {
    icon:    '#059669',
    iconBg:  '#D1FAE5',
    border:  '#6EE7B7',
    btn:     '#059669',
    btnText: '#fff',
    title:   '#065F46',
  },
  error: {
    icon:    '#DC2626',
    iconBg:  '#FEE2E2',
    border:  '#FCA5A5',
    btn:     '#DC2626',
    btnText: '#fff',
    title:   '#991B1B',
  },
  warning: {
    icon:    '#D97706',
    iconBg:  '#FEF3C7',
    border:  '#FDE68A',
    btn:     '#D97706',
    btnText: '#fff',
    title:   '#92400E',
  },
  info: {
    icon:    '#2563EB',
    iconBg:  '#DBEAFE',
    border:  '#93C5FD',
    btn:     '#2563EB',
    btnText: '#fff',
    title:   '#1E3A8A',
  },
  confirm: {
    icon:    '#7C3AED',
    iconBg:  '#EDE9FE',
    border:  '#C4B5FD',
    btn:     '#7C3AED',
    btnText: '#fff',
    title:   '#4C1D95',
  },
};

// ── The Modal Component ───────────────────────────────────────────────────────
const CustomAlertModal = ({
  visible,
  type = 'info',
  title = '',
  message = '',
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isConfirm = false,
  onDismiss,
}) => {
  const scaleAnim  = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const palette = COLORS[type] || COLORS.info;
  const iconChar = ICONS[type] || 'i';

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset for next open
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const handleConfirm = () => {
    onDismiss?.();
    onConfirm?.();
  };

  const handleCancel = () => {
    onDismiss?.();
    onCancel?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.card,
            { borderTopColor: palette.border, transform: [{ scale: scaleAnim }], opacity: opacityAnim },
          ]}
        >
          {/* Icon circle */}
          <View style={[styles.iconCircle, { backgroundColor: palette.iconBg, borderColor: palette.border }]}>
            <Text style={[styles.iconChar, { color: palette.icon }]}>{iconChar}</Text>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: palette.title }]} numberOfLines={2}>
            {title}
          </Text>

          {/* Message */}
          {!!message && (
            <Text style={styles.message}>{message}</Text>
          )}

          {/* Buttons */}
          <View style={[styles.btnRow, isConfirm && styles.btnRowDouble]}>
            {isConfirm && (
              <TouchableOpacity
                style={[styles.btn, styles.btnCancel]}
                onPress={handleCancel}
                activeOpacity={0.75}
              >
                <Text style={styles.btnCancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: palette.btn }, isConfirm && styles.btnFlex]}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={[styles.btnText, { color: palette.btnText }]}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ── useAlert hook ─────────────────────────────────────────────────────────────
/**
 * Use inside any screen component. Returns { showAlert, AlertModal }.
 *
 * showAlert(type, title, message, options?)
 *   type:    'success' | 'error' | 'warning' | 'info' | 'confirm'
 *   title:   string
 *   message: string (optional)
 *   options: {
 *     confirmText?: string,   // default 'OK'
 *     cancelText?:  string,   // default 'Cancel' (only for confirm type)
 *     onConfirm?:   () => void,
 *     onCancel?:    () => void,
 *   }
 */
export const useAlert = () => {
  const [alertConfig, setAlertConfig] = useState({
    visible:     false,
    type:        'info',
    title:       '',
    message:     '',
    confirmText: 'OK',
    cancelText:  'Cancel',
    onConfirm:   null,
    onCancel:    null,
    isConfirm:   false,
  });

  const showAlert = (type, title, message = '', options = {}) => {
    setAlertConfig({
      visible:     true,
      type,
      title,
      message,
      confirmText: options.confirmText || 'OK',
      cancelText:  options.cancelText  || 'Cancel',
      onConfirm:   options.onConfirm   || null,
      onCancel:    options.onCancel    || null,
      isConfirm:   type === 'confirm',
    });
  };

  const dismissAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  const AlertModal = () => (
    <CustomAlertModal
      {...alertConfig}
      onDismiss={dismissAlert}
    />
  );

  return { alertConfig, showAlert, AlertModal };
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 30, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingHorizontal: 26,
    paddingTop: 32,
    paddingBottom: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    borderTopWidth: 4,
    // Shadow
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  iconChar: {
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  message: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 8,
  },
  btnRow: {
    marginTop: 22,
    width: '100%',
  },
  btnRowDouble: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFlex: {
    flex: 1,
  },
  btnCancel: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  btnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  btnCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B7280',
  },
});

export default CustomAlertModal;
