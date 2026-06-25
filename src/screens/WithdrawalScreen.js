import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { walletService } from '../services/walletService';
import { kycService } from '../services/kycService';
import { settingsService } from '../services/settingsService';
import { useAlert } from '../components/CustomAlert';

const WithdrawalScreen = ({ navigation }) => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [lockedBalance, setLockedBalance] = useState(0);
  const [minLimit, setMinLimit] = useState(100);
  const [kycStatus, setKycStatus] = useState('NOT_SUBMITTED');
  const [bankDetails, setBankDetails] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { showAlert, AlertModal } = useAlert();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // 1. Fetch Wallet Balance
      const walletRes = await walletService.getWalletBalance();
      if (walletRes && walletRes.status) {
        setWalletBalance(parseFloat(walletRes.data?.balance || 0));
        setLockedBalance(parseFloat(walletRes.data?.locked_balance || 0));
      }

      // 2. Fetch KYC status
      const kycRes = await kycService.getMyKycStatus();
      if (kycRes && kycRes.status) {
        setKycStatus(kycRes.data?.status || 'NOT_SUBMITTED');
        if (kycRes.data?.status === 'APPROVED') {
          setBankDetails(kycRes.data?.bank);
        }
      }

      // 3. Fetch Settings for min limit
      try {
        const settingsRes = await settingsService.getAllSettings();
        if (settingsRes && settingsRes.status) {
          const limitObj = settingsRes.data.find(s => s.setting_key === 'min_withdrawal_limit');
          if (limitObj) {
            setMinLimit(parseFloat(limitObj.setting_value) || 100);
          }
        }
      } catch (settingsError) {
        console.error('Failed to fetch settings, using default limit of 100:', settingsError);
      }

      // 4. Fetch Withdrawal History
      try {
        const historyRes = await walletService.getWithdrawalHistory();
        if (historyRes && historyRes.status) {
          setHistory(historyRes.data || []);
        }
      } catch (historyError) {
        console.error('Failed to fetch withdrawal history:', historyError);
      }

    } catch (error) {
      console.error('Fetch withdrawal data error:', error);
      showAlert('error', 'Data Load Failed', 'Failed to retrieve wallet or KYC details.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const handleSubmitWithdrawal = async () => {
    const amount = parseFloat(withdrawAmount);
    
    if (isNaN(amount) || amount <= 0) {
      showAlert('error', 'Invalid Amount', 'Please enter a valid withdrawal amount.');
      return;
    }

    if (amount < minLimit) {
      showAlert('warning', 'Below Minimum', `The minimum withdrawal amount is ₹${minLimit.toFixed(2)}.`);
      return;
    }

    if (amount > walletBalance) {
      showAlert('error', 'Insufficient Balance', 'You cannot withdraw more than your available wallet balance.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await walletService.requestWithdrawal(amount);
      if (res && res.status) {
        showAlert('success', 'Request Submitted! ✅', 'Your withdrawal request is submitted. Amount is locked pending admin approval.');
        setWithdrawAmount('');
        fetchData();
      } else {
        showAlert('error', 'Request Failed', res.message || 'Failed to submit withdrawal request.');
      }
    } catch (error) {
      showAlert('error', 'Submission Error', error.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return '#059669';
      case 'PENDING': return '#D97706';
      case 'REJECTED': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <View>
          <Text style={styles.historyAmount}>₹{parseFloat(item.amount).toFixed(2)}</Text>
          <Text style={styles.historyDate}>{new Date(item.requested_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</Text>
        </View>
        <View style={[styles.statusTag, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <Text style={[styles.statusTagText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>

      {item.status === 'APPROVED' && item.utr_number && (
        <View style={styles.refBox}>
          <Text style={styles.refTitle}>UTR Reference:</Text>
          <Text style={styles.refText}>{item.utr_number}</Text>
        </View>
      )}

      {item.status === 'REJECTED' && item.admin_remarks && (
        <View style={[styles.refBox, { backgroundColor: '#FEF2F2' }]}>
          <Text style={[styles.refTitle, { color: '#991B1B' }]}>Rejection Remarks:</Text>
          <Text style={[styles.refText, { color: '#991B1B' }]}>{item.admin_remarks}</Text>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0CA201" />
      </View>
    );
  }

  return (

    <> 
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0CA201"]} />}
    >
      {/* Wallet Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceCol}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceVal}>₹{walletBalance.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.balanceCol}>
          <Text style={styles.balanceLabel}>Locked Balance</Text>
          <Text style={[styles.balanceVal, { color: '#D97706' }]}>₹{lockedBalance.toFixed(2)}</Text>
        </View>
      </View>

      {/* KYC Validation Gate */}
      {kycStatus !== 'APPROVED' ? (
        <View style={styles.kycGateBox}>
          <Icon name="shield-half-outline" size={44} color="#D97706" style={{ alignSelf: 'center', marginBottom: 12 }} />
          <Text style={styles.kycGateTitle}>KYC Verification Required</Text>
          <Text style={styles.kycGateDesc}>
            To withdraw funds to your bank account, you must complete the KYC verification process. Currently, your KYC status is: <Text style={{ fontWeight: 'bold' }}>{kycStatus}</Text>.
          </Text>
          <TouchableOpacity
            style={styles.kycNavBtn}
            onPress={() => navigation.navigate('KYCVerification')}
          >
            <Text style={styles.kycNavBtnText}>Go to KYC Verification</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          {/* Bank Destination Card */}
          <Text style={styles.sectionHeader}>Transfer Destination</Text>
          {bankDetails && (
            <View style={styles.bankCard}>
              <View style={styles.bankHeader}>
                <Icon name="business" size={24} color="#0CA201" />
                <Text style={styles.bankNameText}>{bankDetails.bankName}</Text>
              </View>
              <View style={styles.bankBody}>
                <Text style={styles.bankDetailsText}>
                  <Text style={styles.detailsLabel}>Holder Name: </Text>
                  {bankDetails.accountHolderName}
                </Text>
                <Text style={styles.bankDetailsText}>
                  <Text style={styles.detailsLabel}>Account No: </Text>
                  {bankDetails.accountNumber}
                </Text>
                <Text style={styles.bankDetailsText}>
                  <Text style={styles.detailsLabel}>IFSC Code: </Text>
                  {bankDetails.ifscCode}
                </Text>
              </View>
            </View>
          )}

          {/* Withdrawal Request Form */}
          <View style={styles.formCard}>
            <Text style={styles.formHeader}>Request Wallet Withdrawal</Text>
            <Text style={styles.limitText}>* Minimum withdrawal threshold is ₹{minLimit.toFixed(2)}</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Enter withdrawal amount"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
              />
            </View>

            <TouchableOpacity
              style={[styles.withdrawBtn, isSubmitting && { opacity: 0.8 }]}
              onPress={handleSubmitWithdrawal}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Icon name="paper-plane-outline" size={18} color="white" />
                  <Text style={styles.withdrawBtnText}>Request Withdrawal</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Withdrawal Requests History */}
      <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Recent Withdrawal Requests</Text>
      {history.length === 0 ? (
        <View style={styles.emptyHistoryBox}>
          <Icon name="receipt-outline" size={44} color="#9CA3AF" />
          <Text style={styles.emptyHistoryText}>No withdrawal history available.</Text>
        </View>
      ) : (
        history.map((item) => (
          <View key={item.id.toString()} style={{ marginBottom: 12 }}>
            {renderHistoryItem({ item })}
          </View>
        ))
      )}
    </ScrollView>
    <AlertModal />
     </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' },

  // Balance Card
  balanceCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  balanceCol: { flex: 1, alignItems: 'center' },
  balanceLabel: { color: '#94A3B8', fontSize: 12, marginBottom: 6 },
  balanceVal: { color: '#10B981', fontSize: 20, fontWeight: '800' },
  divider: { width: 1, backgroundColor: '#334155', height: '100%', marginHorizontal: 8 },

  // KYC gate box
  kycGateBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    textAlign: 'center'
  },
  kycGateTitle: { fontSize: 18, fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: 8 },
  kycGateDesc: { fontSize: 14, color: '#4B5563', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  kycNavBtn: {
    backgroundColor: '#0CA201',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center'
  },
  kycNavBtnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },

  // Destinations & Forms
  sectionHeader: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 12 },
  bankCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  bankHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 10, marginBottom: 10 },
  bankNameText: { fontSize: 15, fontWeight: '700', color: '#111827' },
  bankBody: { gap: 6 },
  bankDetailsText: { fontSize: 13, color: '#4B5563' },
  detailsLabel: { fontWeight: '600', color: '#374151' },

  formCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3
  },
  formHeader: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
  limitText: { fontSize: 12, color: '#6B7280', fontStyle: 'italic', marginBottom: 16 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    height: 52,
    backgroundColor: '#F9FAFB'
  },
  currencySymbol: { fontSize: 20, fontWeight: 'bold', color: '#374151', marginRight: 8 },
  amountInput: { flex: 1, fontSize: 18, color: '#111827', fontWeight: '600' },
  withdrawBtn: {
    flexDirection: 'row',
    backgroundColor: '#0CA201',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  withdrawBtnText: { color: 'white', fontSize: 15, fontWeight: 'bold' },

  // History list
  emptyHistoryBox: { alignItems: 'center', paddingVertical: 40, backgroundColor: 'white', borderRadius: 12 },
  emptyHistoryText: { fontSize: 13, color: '#6B7280', marginTop: 10 },

  historyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  historyAmount: { fontSize: 16, fontWeight: '800', color: '#111827' },
  historyDate: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
  statusTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  statusTagText: { fontSize: 10, fontWeight: 'bold' },

  refBox: {
    marginTop: 10,
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  refTitle: { fontSize: 11, fontWeight: '700', color: '#374151', marginBottom: 2 },
  refText: { fontSize: 11, color: '#4B5563' }
});

export default WithdrawalScreen;
