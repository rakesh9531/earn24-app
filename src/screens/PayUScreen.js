import React, { useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import { orderService } from '../services/orderService';
import { useCart } from '../context/CartContext';
import { useAlert } from '../components/CustomAlert';

const PayUScreen = ({ route, navigation }) => {
  const { payuData } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const { clearCart } = useCart();
  const { showAlert } = useAlert();
  const webViewRef = useRef(null);

  if (!payuData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorCenter}>
          <Text style={styles.errorText}>Invalid PayU Payment Session.</Text>
          <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
            <Text style={styles.btnBackText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const {
    payuUrl,
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    phone,
    hash,
    orderId,
    orderNumber,
    udf1,
    surl,
    furl,
  } = payuData;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PayU Payment Gateway</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .loader-card {
            text-align: center;
            background: #ffffff;
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #0CA201;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          h3 { color: #1e293b; margin-bottom: 8px; }
          p { color: #64748b; font-size: 14px; margin: 0; }
        </style>
    </head>
    <body onload="document.forms['payuForm'].submit()">
        <div class="loader-card">
            <div class="spinner"></div>
            <h3>Connecting to PayU Secure Gateway...</h3>
            <p>Please do not close or press back button.</p>
        </div>
        <form name="payuForm" action="${payuUrl}" method="post">
            <input type="hidden" name="key" value="${key}" />
            <input type="hidden" name="txnid" value="${txnid}" />
            <input type="hidden" name="amount" value="${amount}" />
            <input type="hidden" name="productinfo" value="${productinfo}" />
            <input type="hidden" name="firstname" value="${firstname}" />
            <input type="hidden" name="email" value="${email}" />
            <input type="hidden" name="phone" value="${phone}" />
            <input type="hidden" name="surl" value="${surl}" />
            <input type="hidden" name="furl" value="${furl}" />
            <input type="hidden" name="hash" value="${hash}" />
            <input type="hidden" name="udf1" value="${udf1 || orderId}" />
            <input type="hidden" name="udf2" value="" />
            <input type="hidden" name="udf3" value="" />
            <input type="hidden" name="udf4" value="" />
            <input type="hidden" name="udf5" value="" />
        </form>
    </body>
    </html>
  `;

  const handleNavigationStateChange = async (navState) => {
    const { url } = navState;
    if (!url || verifying) return;

    console.log('PayU WebView Navigation:', url);

    if (url.includes('/api/orders/payu/verify') || url.includes('payu/verify') || url.includes('status=success') || url.includes('status=failure')) {
      setVerifying(true);

      const isSuccess = url.includes('status=success') || (!url.includes('status=failure') && !url.includes('failed'));

      try {
        const verifyRes = await orderService.verifyPayUPayment({
          key,
          txnid,
          amount,
          productinfo,
          firstname,
          email,
          status: isSuccess ? 'success' : 'failure',
          hash,
          orderId,
          udf1: udf1 || orderId,
        });

        if (verifyRes && verifyRes.status) {
          const finalOrderId = verifyRes.data?.orderId || orderId;
          const finalOrderNumber = verifyRes.data?.orderNumber || orderNumber || orderId;
          clearCart();
          showAlert({
            type: 'success',
            title: 'Payment Successful! 🎉',
            message: `Your order #${finalOrderNumber} has been placed successfully via PayU online payment.`,
            confirmText: 'View Orders',
            onConfirm: () => {
              navigation.reset({
                index: 0,
                routes: [
                  { name: 'Main' },
                  { name: 'OrderDetails', params: { orderId: finalOrderId } }
                ]
              });
            }
          });
        } else {
          showAlert({
            type: 'error',
            title: 'Payment Failed',
            message: verifyRes?.message || 'PayU online payment could not be completed.',
            confirmText: 'Try Again',
            onConfirm: () => navigation.goBack(),
          });
        }
      } catch (err) {
        console.error('Error verifying PayU payment in app:', err);
        showAlert({
          type: 'error',
          title: 'Payment Verification Error',
          message: err?.message || 'Failed to complete payment verification.',
          confirmText: 'OK',
          onConfirm: () => navigation.goBack(),
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PayU Secure Checkout</Text>
        <View style={{ width: 32 }} />
      </View>

      {(loading || verifying) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0CA201" />
          <Text style={styles.loadingText}>
            {verifying ? 'Verifying payment with bank...' : 'Loading PayU payment options...'}
          </Text>
        </View>
      )}

      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent, baseUrl: 'https://secure.payu.in' }}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  errorCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
    fontWeight: '600',
  },
  btnBack: {
    backgroundColor: '#0CA201',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnBackText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default PayUScreen;
