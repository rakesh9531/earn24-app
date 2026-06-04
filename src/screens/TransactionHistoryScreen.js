import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { mlmService } from '../services/mlmService';
// --- THIS IS THE CORRECTED IMPORT PATH BASED ON YOUR FILE STRUCTURE ---
import ProfitItem from '../components/ProfitItem';

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
});

export default TransactionHistoryScreen;