import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

const DownlineMember = ({ item }) => (
  <View style={styles.memberCard}>
    <Image 
        source={{ uri: `https://i.pravatar.cc/150?u=${item.email}` }} 
        style={styles.avatar} 
    />
    <View style={styles.memberInfo}>
      <Text style={styles.memberName}>{item.full_name}</Text>
      <Text style={styles.memberEmail}>{item.email}</Text>
    </View>
    <View style={styles.joinDateContainer}>
        <Icon name="calendar-outline" size={14} color="#6c757d" />
        <Text style={styles.joinDate}>{moment(item.join_date).format('MMM D, YYYY')}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  memberCard: {
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343a40',
  },
  memberEmail: {
    fontSize: 14,
    color: '#6c757d',
  },
  joinDateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      opacity: 0.7,
  },
  joinDate: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 5,
  },
});

export default DownlineMember;