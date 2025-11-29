import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { mlmService } from '../services/mlmService'; // Make sure this path is correct

const MlmDashboardScreen = ({ navigation }) => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchSummary = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await mlmService.getSummary(); 
      if (response && response.status) {
        // --- DATA PARSING FIX ---
        // Ensure all numeric values from the API are converted to actual numbers
        const parsedData = {
            walletBalance: parseFloat(response.data.walletBalance || 0),
            totalBv: parseFloat(response.data.totalBv || 0),
            directReferrals: parseInt(response.data.directReferrals || 0, 10),
        };
        setSummary(parsedData);
      } else {
        setError(response.message || 'Could not load summary data.');
      }
    } catch (e) {
      setError(e.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSummary();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSummary();
  }, []);

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#0CA201" /></View>;
  }

  if (error) {
    return (
        <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
        </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0CA201"]}/>}
    >
      <View style={styles.summaryGrid}>
        <View style={[styles.summaryCard, { flex: 1.2 }]}>
          <Text style={styles.cardLabel}>Wallet Balance</Text>
          {/* This code will now work because `summary.walletBalance` is a number */}
          <Text style={styles.cardValue}>₹{summary?.walletBalance?.toFixed(2) || '0.00'}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>Total BV</Text>
          {/* This code will now work because `summary.totalBv` is a number */}
          <Text style={styles.cardValue}>{summary?.totalBv?.toFixed(2) || '0.00'}</Text>
        </View>
      </View>

      <View style={styles.referralCard}>
        <View>
          <Text style={styles.cardLabel}>Direct Referrals</Text>
          <Text style={styles.referralValue}>{summary?.directReferrals || 0}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('MyNetwork')}>
          <Icon name="arrow-forward-circle" size={40} color="#0CA201" />
        </TouchableOpacity>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('TransactionHistory', { type: 'Profit', title: 'Profit History' })}>
          <Icon name="cash-outline" size={22} color="#388E3C" />
          <Text style={styles.actionButtonText}>View Profit History</Text>
          <Icon name="chevron-forward-outline" size={22} color="#BDBDBD" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('TransactionHistory', { type: 'BV', title: 'BV History' })}>
          <Icon name="podium-outline" size={22} color="#007bff" />
          <Text style={styles.actionButtonText}>View BV History</Text>
          <Icon name="chevron-forward-outline" size={22} color="#BDBDBD" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('MyNetwork')}>
          <Icon name="people-outline" size={22} color="#f57c00" />
          <Text style={styles.actionButtonText}>View My Network</Text>
          <Icon name="chevron-forward-outline" size={22} color="#BDBDBD" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Your styles are fine and do not need to be changed.
const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 20, },
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  contentContainer: { padding: 20 },
  errorText: { color: '#D32F2F', fontSize: 16, textAlign: 'center', marginBottom: 20, },
  retryButton: { backgroundColor: '#0CA201', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 20 },
  retryButtonText: { color: 'white', fontWeight: 'bold' },
  summaryGrid: { flexDirection: 'row', gap: 15, marginBottom: 15, },
  summaryCard: { backgroundColor: '#fff', borderRadius: 15, padding: 20, flex: 1, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, },
  referralCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, padding: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, },
  cardLabel: { fontSize: 14, color: '#6c757d', marginBottom: 5, },
  cardValue: { fontSize: 24, fontWeight: 'bold', color: '#0CA201', },
  referralValue: { fontSize: 32, fontWeight: 'bold', color: '#181725', },
  actionsContainer: { marginTop: 30, },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, },
  actionButtonText: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: '500', color: '#343a40', },
});

export default MlmDashboardScreen;