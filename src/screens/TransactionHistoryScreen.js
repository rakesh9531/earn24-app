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
    // You would create a BVItem component for BV history.
    // For now, we'll show a simple placeholder view.
    return (
        <View style={styles.itemContainer}>
            <Text style={styles.bvText}>BV Earned: <Text style={styles.bvAmount}>{item.bv_earned}</Text></Text>
            <Text style={styles.bvDate}>{moment(item.transaction_date).format('MMM D, YYYY')}</Text>
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
  // Placeholder styles for a generic item (can be used by BV item)
  itemContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, },
  bvText: { fontSize: 16, fontWeight: '500' },
  bvAmount: { fontWeight: 'bold', color: '#007bff' },
  bvDate: { fontSize: 13, color: '#6c757d', marginTop: 4 },
});

export default TransactionHistoryScreen;