import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

// This component is a "dumb" component. Its only job is to display data.
// It doesn't import any services or complex logic, which prevents circular dependencies.
const ProfitItem = ({ item }) => {
  // Determine if the transaction is a credit (positive) or debit (negative)
  const isCredit = item.amount_credited > 0;
  
  // Choose icon and color based on the transaction type
  const iconName = isCredit ? 'arrow-up-circle' : 'arrow-down-circle';
  const iconColor = isCredit ? '#28a745' : '#D32F2F';
  const amountPrefix = isCredit ? '+' : '-';
  const amount = Math.abs(item.amount_credited);

  return (
    <View style={styles.itemContainer}>
      <Icon name={iconName} size={30} color={iconColor} style={styles.icon} />
      <View style={styles.detailsContainer}>
        <Text style={styles.itemType}>{item.distribution_type.replace(/_/g, ' ')}</Text>
        <Text style={styles.itemDate}>{moment(item.transaction_date).format('MMM D, YYYY, h:mm a')}</Text>
      </View>
      <Text style={[styles.amount, { color: iconColor }]}>
        {amountPrefix} ₹{amount.toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  icon: {
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
  },
  itemType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#343a40',
    textTransform: 'capitalize',
  },
  itemDate: {
    fontSize: 13,
    color: '#6c757d',
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfitItem;