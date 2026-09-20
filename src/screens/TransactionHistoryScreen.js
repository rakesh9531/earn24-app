import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { mlmService } from '../services/mlmService';
import { walletService } from '../services/walletService';
// --- THIS IS THE CORRECTED IMPORT PATH BASED ON YOUR FILE STRUCTURE ---
import ProfitItem from '../components/ProfitItem';
import Icon from 'react-native-vector-icons/Ionicons';

import moment from 'moment';


const TransactionHistoryScreen = () => {
  const route = useRoute();
  const { type, title } = route.params; // Get title from navigation params as well

  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isListEnd, setIsListEnd] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = useCallback(async () => {
    if (isLoading || isListEnd) return;

    setIsLoading(true);
    setError('');

    try {
      let response;
      if (type === 'Profit') {
        response = await mlmService.getProfitHistory(page);
      } else if (type === 'Wallet') {
        response = await walletService.getWalletHistory(page);
      } else { // Assuming any other type is 'BV'
        response = await mlmService.getBvHistory(page);
      }

      if (response && response.status && Array.isArray(response.data)) {
        if (response.data.length > 0) {
          setHistory(prevHistory => [...prevHistory, ...response.data]);
          setPage(prevPage => prevPage + 1);
        } else {
          setIsListEnd(true);
        }
      } else {
        setError(response.message || `Could not load ${type} history.`);
        setIsListEnd(true);
      }
    } catch (e) {
      setError(e.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, isListEnd, type]);

  // Initial data fetch
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]); // Dependency array to respect useCallback

  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator style={{ marginVertical: 20 }} size="large" color="#0CA201" />;
  };

  const renderEmptyComponent = () => {
    if (isLoading || error) return null;
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No {title || type} history found.</Text>
      </View>
    );
  }

  // --- RENDER ITEM FUNCTION ---
  // This function decides which component to render for each item in the list
  const renderItem = ({ item }) => {
    if (type === 'Profit') {
      return <ProfitItem item={item} />;
    }

    if (type === 'Wallet') {
      const rawType = (item.txn_type || item.transaction_type || '').toString().toLowerCase();
      const remarks = (item.remarks || '').toString();
      const source = (item.source || '').toString().toLowerCase();

      let isCredit = rawType === 'credit';
      if (remarks.toLowerCase().includes('payment for order') || source.includes('order_purchase')) {
        isCredit = false; // Payments are ALWAYS DEBIT (-)
      } else if (remarks.toLowerCase().includes('refund') || remarks.toLowerCase().includes('cashback') || source.includes('refund')) {
        isCredit = true; // Refunds and Cashbacks are ALWAYS CREDIT (+)
      }

      const isRefund = remarks.toLowerCase().includes('refund') || source.includes('refund');
      const isPurchase = remarks.toLowerCase().includes('payment for order') || source.includes('order_purchase');

      const iconName = isCredit ? 'arrow-up-circle' : 'arrow-down-circle';
      const iconColor = isCredit ? '#16A34A' : '#DC2626';
      const amountPrefix = isCredit ? '+' : '-';
      const amount = Math.abs(parseFloat(item.amount || 0));

      return (
        <View style={styles.walletItemContainer}>
          <Icon name={iconName} size={32} color={iconColor} style={styles.walletIcon} />
          <View style={styles.walletDetailsContainer}>
            <Text style={styles.walletRemarks} numberOfLines={2}>{remarks || 'Wallet Adjustment'}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, flexWrap: 'wrap' }}>
              <View style={[
                styles.sourceBadge, 
                isRefund ? styles.sourceBadgeRefund : (isPurchase ? styles.sourceBadgePurchase : styles.sourceBadgeDefault)
              ]}>
                <Text style={[
                  styles.sourceBadgeText,
                  isRefund ? styles.sourceBadgeTextRefund : (isPurchase ? styles.sourceBadgeTextPurchase : styles.sourceBadgeTextDefault)
                ]}>
                  {isRefund ? 'RETURN REFUND' : (item.source ? item.source.replace(/_/g, ' ').toUpperCase() : 'WALLET')}
                </Text>
              </View>
            </View>
            <Text style={styles.walletDate}>{moment(item.created_at).format('MMM D, YYYY, h:mm a')}</Text>
          </View>
          <Text style={[styles.walletAmount, { color: iconColor }]}>
            {amountPrefix} ₹{amount.toFixed(2)}
          </Text>
        </View>
      );
    }

    const isSelf = item.bv_type === 'SELF' || !item.bv_type;

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <View style={[styles.badge, isSelf ? styles.selfBadge : styles.downlineBadge]}>
            <Text style={[styles.badgeText, isSelf ? styles.selfBadgeText : styles.downlineBadgeText]}>
              {isSelf ? 'Personal' : 'Downline'}
            </Text>
          </View>
          <Text style={styles.bvAmount}>+{parseFloat(item.bv_earned || 0).toFixed(2)} BV</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.description}>
            {isSelf 
              ? `Earned from purchase of ${item.product_name || 'Product'}` 
              : `Earned from ${item.source_user_name || 'Downline Member'}'s purchase of ${item.product_name || 'Product'}`
            }
          </Text>
          {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
        </View>

        <Text style={styles.bvDate}>
          {moment(item.transaction_date).format('MMM D, YYYY, hh:mm A')}
        </Text>
      </View>
    );
  };

  if (error && history.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => { setPage(1); setHistory([]); setIsListEnd(false); fetchHistory(); }} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={fetchHistory}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: '#D32F2F', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  emptyText: { color: '#6c757d', fontSize: 16 },
  retryButton: { backgroundColor: '#0CA201', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 20 },
  retryButtonText: { color: 'white', fontWeight: 'bold' },
  itemContainer: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  selfBadge: {
    backgroundColor: '#E8F5E9',
  },
  downlineBadge: {
    backgroundColor: '#E3F2FD',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  selfBadgeText: {
    color: '#2E7D32',
  },
  downlineBadgeText: {
    color: '#1565C0',
  },
  bvAmount: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#0CA201', 
  },
  body: {
    marginBottom: 10,
  },
  description: { 
    fontSize: 14, 
    color: '#2D3748', 
    fontWeight: '500',
    lineHeight: 20,
  },
  notes: { 
    fontSize: 12, 
    color: '#718096', 
    marginTop: 4, 
    fontStyle: 'italic',
  },
  bvDate: { 
    fontSize: 11, 
    color: '#A0AEC0', 
    textAlign: 'right',
  },
  walletItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  walletIcon: {
    marginRight: 15,
  },
  walletDetailsContainer: {
    flex: 1,
  },
  walletRemarks: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
    lineHeight: 20,
  },
  walletSource: {
    fontSize: 11,
    color: '#718096',
    marginTop: 2,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  walletDate: {
    fontSize: 11,
    color: '#A0AEC0',
    marginTop: 2,
  },
  walletAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sourceBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 2,
  },
  sourceBadgeRefund: {
    backgroundColor: '#DCFCE7',
  },
  sourceBadgeTextRefund: {
    color: '#15803D',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  sourceBadgePurchase: {
    backgroundColor: '#FEE2E2',
  },
  sourceBadgeTextPurchase: {
    color: '#B91C1C',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  sourceBadgeDefault: {
    backgroundColor: '#F1F5F9',
  },
  sourceBadgeTextDefault: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

export default TransactionHistoryScreen;