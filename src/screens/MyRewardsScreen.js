import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Linking
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { rewardService } from '../services/rewardService';

const MyRewardsScreen = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Claim Form Modal state
  const [activeReward, setActiveReward] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [userDetails, setUserDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tab control: 'rewards' or 'inbox'
  const [activeTab, setActiveTab] = useState('rewards');

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError('');
      const res = await rewardService.getEligibility();
      if (res && res.status) {
        setData(res.data);
      } else {
        setError('Failed to fetch rewards details.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred loading rewards.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboard();
  }, []);

  const handleOpenClaim = (reward) => {
    setActiveReward(reward);
    setUserDetails('');
    setShowClaimModal(true);
  };

  const handleCloseClaim = () => {
    setShowClaimModal(false);
    setActiveReward(null);
    setUserDetails('');
  };

  const submitClaim = async () => {
    if (!activeReward) return;
    if (!userDetails.trim()) {
      Alert.alert('Required', 'Please fill in the claim details (e.g. Bank Account details, UPI, passenger info, or nominee info).');
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedDetails = {
        user_input: userDetails,
        submitted_at: new Date().toISOString(),
        // Keep payout amount if it is a precalculated pool claim
        payout_amount: activeReward.userDetails?.payout_amount || undefined
      };
      
      const res = await rewardService.claimReward(activeReward.type, parsedDetails);
      if (res && res.status) {
        Alert.alert('Success', 'Your claim has been submitted to the Admin for verification.');
        handleCloseClaim();
        fetchDashboard();
      } else {
        Alert.alert('Failed', res.message || 'Could not submit claim.');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to submit claim.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (path) => {
    if (!path) return;
    // Map backend local path to url (assuming port 3000)
    // In a real staging environment, we construct it using the base API url config
    const fileUrl = `http://10.0.2.2:3000/${path}`;
    Linking.openURL(fileUrl).catch(() => {
      Alert.alert('Error', 'Unable to open file link.');
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return '#059669';
      case 'PENDING': return '#D97706';
      case 'REJECTED': return '#DC2626';
      case 'CLAIMABLE': return '#0CA201';
      default: return '#6B7280';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0CA201" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Icon name="alert-circle-outline" size={60} color="#DC2626" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.retryBtn}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'rewards' && styles.activeTab]}
          onPress={() => setActiveTab('rewards')}
        >
          <Icon name="gift-outline" size={18} color={activeTab === 'rewards' ? '#0CA201' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'rewards' && styles.activeTabText]}>My Rewards</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'inbox' && styles.activeTab]}
          onPress={() => setActiveTab('inbox')}
        >
          <Icon name="mail-outline" size={18} color={activeTab === 'inbox' ? '#0CA201' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'inbox' && styles.activeTabText]}>Inbox / History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0CA201"]} />}
      >
        {activeTab === 'rewards' ? (
          <View>
            {/* User Monthly BV Overview */}
            <View style={styles.overviewCard}>
              <Text style={styles.overviewTitle}>Current Month Activity</Text>
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Personal BV</Text>
                  <Text style={styles.statValue}>{data?.personalBv?.toFixed(0) || '0'} / 1,000</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Total Group BV (TGBV)</Text>
                  <Text style={styles.statValue}>{data?.tgbv?.toLocaleString() || '0'}</Text>
                </View>
              </View>
              {data?.personalBv < 1000 && (
                <Text style={styles.warningText}>
                  * Maintain at least 1,000 Personal BV to qualify for fund payouts this month.
                </Text>
              )}
            </View>

            {/* List of Rewards */}
            <Text style={styles.sectionHeader}>Funds & Benefits</Text>
            {data?.rewards?.map((reward) => (
              <View key={reward.type} style={styles.rewardCard}>
                <View style={styles.rewardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rewardName}>{reward.name}</Text>
                    {reward.maxMonths && (
                      <Text style={styles.monthsText}>
                        Duration: {reward.monthsPaid} / {reward.maxMonths} months claimed
                      </Text>
                    )}
                  </View>
                  <View style={[styles.statusTag, { backgroundColor: getStatusColor(reward.status) + '15' }]}>
                    <Text style={[styles.statusTagText, { color: getStatusColor(reward.status) }]}>
                      {reward.status}
                    </Text>
                  </View>
                </View>

                {/* Progress parameters */}
                {reward.targetTgbv > 0 && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressRow}>
                      <Text style={styles.progressLabel}>Group BV Progress</Text>
                      <Text style={styles.progressVal}>
                        {Math.min(data.tgbv, reward.targetTgbv).toLocaleString()} / {reward.targetTgbv.toLocaleString()} BV
                      </Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${Math.min(100, (data.tgbv / reward.targetTgbv) * 100)}%` }
                        ]}
                      />
                    </View>
                  </View>
                )}

                {/* Eligibility messages */}
                {!reward.isEligible && (
                  <View style={styles.reasonBox}>
                    <Icon name="information-circle-outline" size={14} color="#6B7280" />
                    <Text style={styles.reasonText}>{reward.eligibilityReason}</Text>
                  </View>
                )}

                {/* Claim Action Button */}
                {reward.status === 'CLAIMABLE' && (
                  <TouchableOpacity
                    style={styles.claimBtn}
                    onPress={() => handleOpenClaim(reward)}
                  >
                    <Icon name="checkmark-circle-outline" size={18} color="white" />
                    <Text style={styles.claimBtnText}>Claim Reward</Text>
                  </TouchableOpacity>
                )}

                {reward.status === 'PENDING' && (
                  <TouchableOpacity
                    style={[styles.claimBtn, { backgroundColor: '#F59E0B' }]}
                    onPress={() => handleOpenClaim(reward)}
                  >
                    <Icon name="create-outline" size={18} color="white" />
                    <Text style={styles.claimBtnText}>Update Request Details</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View>
            <Text style={styles.sectionHeader}>Inbound Messages & Status</Text>
            {data?.rewards?.filter(r => r.claimId !== null).length === 0 ? (
              <View style={styles.emptyInbox}>
                <Icon name="mail-open-outline" size={50} color="#9CA3AF" />
                <Text style={styles.emptyInboxText}>Your message board is empty. Claims you submit will appear here.</Text>
              </View>
            ) : (
              data?.rewards?.filter(r => r.claimId !== null).map((reward) => (
                <View key={reward.type} style={[
                  styles.inboxCard,
                  reward.status === 'APPROVED' && styles.inboxApproved,
                  reward.status === 'REJECTED' && styles.inboxRejected
                ]}>
                  <View style={styles.inboxHeader}>
                    <Icon
                      name={reward.status === 'APPROVED' ? 'checkmark-circle' : (reward.status === 'REJECTED' ? 'close-circle' : 'time')}
                      size={24}
                      color={getStatusColor(reward.status)}
                    />
                    <Text style={styles.inboxTitle}>{reward.name}</Text>
                  </View>

                  <View style={styles.inboxBody}>
                    <Text style={styles.inboxStatusLabel}>
                      Status: <Text style={{ fontWeight: 'bold', color: getStatusColor(reward.status) }}>{reward.status}</Text>
                    </Text>

                    {reward.adminNotes && (
                      <View style={styles.notesBox}>
                        <Text style={styles.notesTitle}>Admin Remarks:</Text>
                        <Text style={styles.notesText}>{reward.adminNotes}</Text>
                      </View>
                    )}

                    {reward.status === 'APPROVED' && reward.attachmentPath && (
                      <TouchableOpacity
                        style={styles.downloadBtn}
                        onPress={() => handleDownload(reward.attachmentPath)}
                      >
                        <Icon name="cloud-download-outline" size={18} color="white" />
                        <Text style={styles.downloadBtnText}>Download Policy / Ticket PDF</Text>
                      </TouchableOpacity>
                    )}

                    {reward.status === 'REJECTED' && (
                      <TouchableOpacity
                        style={[styles.claimBtn, { marginTop: 10, backgroundColor: '#DC2626' }]}
                        onPress={() => handleOpenClaim(reward)}
                      >
                        <Icon name="refresh-outline" size={18} color="white" />
                        <Text style={styles.claimBtnText}>Resubmit Claim</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* CLAIM FORM DIALOG OVERLAY */}
      {showClaimModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showClaimModal}
          onRequestClose={handleCloseClaim}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Submit Claim Request</Text>
                <TouchableOpacity onPress={handleCloseClaim}>
                  <Icon name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <Text style={styles.modalRewardName}>{activeReward?.name}</Text>
                {activeReward?.userDetails?.payout_amount && (
                  <Text style={styles.modalPayout}>Payout Amount: ₹{activeReward.userDetails.payout_amount.toFixed(2)}</Text>
                )}

                <Text style={styles.inputLabel}>
                  {['DOMESTIC_TOUR', 'INTERNATIONAL_TOUR'].includes(activeReward?.type)
                    ? 'Enter Passenger details (Name, Age, Passport No., Mobile)'
                    : ['INSURANCE_HEALTH', 'INSURANCE_TERM'].includes(activeReward?.type)
                    ? 'Enter Nominee details (Name, Relation, Age, Nominee PAN)'
                    : 'Enter Bank Payout info (Bank Name, A/C No., IFSC Code, UPI ID)'}
                </Text>

                <TextInput
                  style={styles.textArea}
                  multiline={true}
                  numberOfLines={4}
                  value={userDetails}
                  onChangeText={setUserDetails}
                  placeholder="Type your claim information here..."
                />
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={handleCloseClaim}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalSubmitBtn, isSubmitting && { opacity: 0.7 }]}
                  onPress={submitClaim}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.modalSubmitText}>Submit Claim</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: '#DC2626', fontSize: 16, marginVertical: 15, textAlign: 'center' },
  retryBtn: { backgroundColor: '#0CA201', paddingHorizontal: 25, paddingVertical: 10, borderRadius: 20 },
  retryBtnText: { color: 'white', fontWeight: 'bold' },

  // Tabs
  tabContainer: { flexDirection: 'row', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tab: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, gap: 6 },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#0CA201' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  activeTabText: { color: '#0CA201' },

  scrollContent: { padding: 16 },

  // Overview Card
  overviewCard: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 20, elevation: 1, shadowOpacity: 0.05, shadowRadius: 3 },
  overviewTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statBox: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#0CA201' },
  statDivider: { width: 1, height: 30, backgroundColor: '#E5E7EB' },
  warningText: { fontSize: 12, color: '#D97706', marginTop: 10, fontStyle: 'italic', textAlign: 'center' },

  sectionHeader: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 12 },

  // Reward Card
  rewardCard: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 14, elevation: 1, shadowOpacity: 0.05, shadowRadius: 3 },
  rewardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  rewardName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  monthsText: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  statusTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusTagText: { fontSize: 11, fontWeight: 'bold' },

  // Progress Bar
  progressContainer: { marginTop: 12 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontSize: 11, color: '#6B7280' },
  progressVal: { fontSize: 11, color: '#374151', fontWeight: 'bold' },
  progressBarBg: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#0CA201' },

  // Reason box
  reasonBox: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, backgroundColor: '#F9FAFB', padding: 8, borderRadius: 8 },
  reasonText: { fontSize: 11, color: '#6B7280', flex: 1 },

  // Buttons
  claimBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0CA201', paddingVertical: 10, borderRadius: 8, marginTop: 12, gap: 6 },
  claimBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },

  // Inbox list styles
  emptyInbox: { alignItems: 'center', paddingVertical: 80 },
  emptyInboxText: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 12, paddingHorizontal: 40 },
  inboxCard: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 14, borderLeftWidth: 5, borderLeftColor: '#9CA3AF' },
  inboxApproved: { borderLeftColor: '#059669' },
  inboxRejected: { borderLeftColor: '#DC2626' },
  inboxHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  inboxTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  inboxBody: { paddingLeft: 32 },
  inboxStatusLabel: { fontSize: 13, color: '#4B5563' },
  notesBox: { backgroundColor: '#F9FAFB', padding: 10, borderRadius: 8, marginTop: 8 },
  notesTitle: { fontSize: 12, fontWeight: '700', color: '#374151' },
  notesText: { fontSize: 12, color: '#4B5563', marginTop: 2 },
  downloadBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#3B82F6', paddingVertical: 8, borderRadius: 6, marginTop: 10, gap: 6 },
  downloadBtnText: { color: 'white', fontWeight: 'bold', fontSize: 13 },

  // Modal dialog
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, minHeight: 380 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 10 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  modalBody: { paddingVertical: 16 },
  modalRewardName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  modalPayout: { fontSize: 14, color: '#0CA201', fontWeight: 'bold', marginTop: 4 },
  inputLabel: { fontSize: 13, color: '#4B5563', fontWeight: '600', marginTop: 12, marginBottom: 6 },
  textArea: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 10, fontSize: 14, minHeight: 100, textAlignVertical: 'top', backgroundColor: '#F9FAFB' },
  modalFooter: { flexDirection: 'row', gap: 12, marginTop: 16 },
  modalCancelBtn: { flex: 1, borderWidth: 1, borderColor: '#D1D5DB', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  modalCancelText: { color: '#4B5563', fontWeight: 'bold' },
  modalSubmitBtn: { flex: 1, backgroundColor: '#0CA201', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  modalSubmitText: { color: 'white', fontWeight: 'bold' }
});

export default MyRewardsScreen;
