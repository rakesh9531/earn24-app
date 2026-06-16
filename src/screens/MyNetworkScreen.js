// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//     View, 
//     Text, 
//     StyleSheet, 
//     FlatList, 
//     ActivityIndicator, 
//     RefreshControl,
//     SafeAreaView // <-- Import SafeAreaView
// } from 'react-native';
// import { mlmService } from '../services/mlmService';
// import DownlineMember from '../screens/DownlineMember'; // Corrected import path

// const MyNetworkScreen = () => {
//   const [downline, setDownline] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');

//   const fetchDownline = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       setError('');
//       const response = await mlmService.getDownline();
//       if (response && response.status) {
//         setDownline(response.data || []);
//       } else {
//         setError(response.message || 'Could not load your network.');
//       }
//     } catch (e) {
//       setError(e.message || 'An error occurred. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchDownline();
//   }, [fetchDownline]);

//   if (isLoading) {
//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.centered}><ActivityIndicator size="large" color="#0CA201" /></View>
//         </SafeAreaView>
//     );
//   }

//   if (error) {
//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.centered}>
//                 <Text style={styles.errorText}>{error}</Text>
//             </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     // --- THIS IS THE KEY FIX ---
//     // Wrap the entire screen content in a SafeAreaView
//     <SafeAreaView style={styles.container}>
//       <FlatList
//         data={downline}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => <DownlineMember item={item} />}
//         ListHeaderComponent={() => (
//           <Text style={styles.headerText}>Your Direct Referrals ({downline.length})</Text>
//         )}
//         ListEmptyComponent={() => (
//           <View style={styles.centered}>
//               <Text style={styles.emptyText}>You have no direct referrals yet.</Text>
//           </View>
//         )}
//         contentContainerStyle={styles.listContent}
//         onRefresh={fetchDownline}
//         refreshing={isLoading}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   listContent: {
//       padding: 15, // Added more padding for better spacing around the list
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center', // Center content vertically
//     alignItems: 'center',
//     padding: 20, // Add padding for error/empty messages
//   },
//   headerText: {
//     fontSize: 22, // Slightly larger font for the main title
//     fontWeight: 'bold',
//     color: '#343a40',
//     marginBottom: 20, // More space below the header
//     paddingHorizontal: 5,
//   },
//   errorText: {
//     color: '#D32F2F',
//     fontSize: 16,
//     textAlign: 'center', // Center align error text
//   },
//   emptyText: {
//     color: '#6c757d',
//     fontSize: 16,
//   },
// });

// export default MyNetworkScreen;
















import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { mlmService } from '../services/mlmService';
import TreeNode from './TreeNode'; // Import the new component

const MyNetworkScreen = () => {
  // `nodes` is a flat array representing the tree structure
  const [nodes, setNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInitialNetwork = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await mlmService.getMyInitialNetworkTree();
      if (response && response.status) {
        // Add properties needed for the UI to each node
        const initialNodes = response.data.map(user => ({
          ...user,
          level: 0, // Top-level nodes
          isExpanded: false,
          isLoading: false,
        }));
        setNodes(initialNodes);
      } else {
        setError(response.message || 'Could not load your network.');
      }
    } catch (e) {
      setError(e.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchInitialNetwork();
    }, [fetchInitialNetwork])
  );

  const handleToggleNode = async (nodeId) => {
    // Determine the clicked node level from the current closure (it doesn't change)
    const currentNodes = [...nodes];
    const initialIndex = currentNodes.findIndex(n => n.id === nodeId);
    if (initialIndex === -1) return;
    const tappedNode = currentNodes[initialIndex];
    const tappedNodeLevel = tappedNode.level;

    // --- EXPANDING a node ---
    if (!tappedNode.isExpanded) {
      // 1. Set loading state using functional update
      setNodes(prevNodes => {
        const idx = prevNodes.findIndex(n => n.id === nodeId);
        if (idx === -1) return prevNodes;
        const updated = [...prevNodes];
        updated[idx] = { ...updated[idx], isExpanded: true, isLoading: true };
        return updated;
      });

      // 2. Fetch children from API
      try {
        const response = await mlmService.getDownlineForUser(nodeId);
        const children = (response.data || []).map(child => ({
          ...child,
          level: tappedNodeLevel + 1, // Children are one level deeper
          isExpanded: false,
          isLoading: false,
        }));

        // 3. Insert children into the array using functional update to get latest state
        setNodes(prevNodes => {
          const idx = prevNodes.findIndex(n => n.id === nodeId);
          if (idx === -1) return prevNodes;
          const updated = [...prevNodes];
          updated[idx] = { ...updated[idx], isLoading: false, isExpanded: true }; // Turn off loader
          updated.splice(idx + 1, 0, ...children);
          return updated;
        });

      } catch (e) {
        // Revert on error
        setNodes(prevNodes => {
          const idx = prevNodes.findIndex(n => n.id === nodeId);
          if (idx === -1) return prevNodes;
          const updated = [...prevNodes];
          updated[idx] = { ...updated[idx], isLoading: false, isExpanded: false };
          return updated;
        });
        setError("Failed to load downline.");
      }
    }
    // --- COLLAPSING a node ---
    else {
      setNodes(prevNodes => {
        const idx = prevNodes.findIndex(n => n.id === nodeId);
        if (idx === -1) return prevNodes;

        const currentTappedNode = prevNodes[idx];
        let childCount = 0;
        // Find all descendants to remove them
        for (let i = idx + 1; i < prevNodes.length; i++) {
          if (prevNodes[i].level > currentTappedNode.level) {
            childCount++;
          } else {
            break; // Stop when we reach a sibling or an uncle
          }
        }

        const updated = [...prevNodes];
        updated[idx] = { ...currentTappedNode, isExpanded: false }; // Close the node
        if (childCount > 0) {
          updated.splice(idx + 1, childCount); // Remove all descendants
        }
        return updated;
      });
    }
  };

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#0CA201" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>My Network</Text>
      {error && !isLoading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchInitialNetwork} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchInitialNetwork} colors={["#0CA201"]} />}
      >
        {nodes.length > 0 ? (
          nodes.map((node, index) => {
            // Determine if the node is the last child among its siblings in the flat list
            let isLast = true;
            for (let i = index + 1; i < nodes.length; i++) {
              if (nodes[i].level === node.level) {
                isLast = false;
                break;
              }
              if (nodes[i].level < node.level) {
                break;
              }
            }
            return (
              <TreeNode
                key={node.id}
                node={node}
                level={node.level}
                isLast={isLast}
                onToggle={handleToggleNode}
              />
            );
          })
        ) : (
          !isLoading && <Text style={styles.emptyText}>You have no direct referrals yet.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#0CA201',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#6c757d',
    fontSize: 16,
  },
});

export default MyNetworkScreen;