// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';

// const TreeNode = ({ node, onToggle, level }) => {
//   const hasChildren = node.children_count > 0;

//   return (
//     <TouchableOpacity
//       style={[styles.container, { marginLeft: level * 20 }]} // Indentation
//       onPress={() => hasChildren && onToggle(node.id)}
//       disabled={!hasChildren}
//     >
//       <View style={styles.content}>
//         <View style={styles.iconContainer}>
//           {hasChildren ? (
//             <Icon
//               name={node.isExpanded ? 'chevron-down' : 'chevron-forward'}
//               size={20}
//               color="#555"
//             />
//           ) : (
//             <View style={styles.spacer} /> // Spacer to align text
//           )}
//         </View>

//         <View style={styles.details}>
//           <Text style={styles.name}>{node.full_name}</Text>
//           <Text style={styles.username}>@{node.username} | Rank: {node.rank || 'N/A'}</Text>
//         </View>

//         {node.isLoading && (
//             <ActivityIndicator size="small" color="#0CA201" style={styles.loader} />
//         )}
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   content: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   iconContainer: {
//     width: 24,
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   spacer: {
//     width: 24, // Same width as the icon
//   },
//   details: {
//     flex: 1,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   username: {
//     fontSize: 13,
//     color: '#777',
//     marginTop: 2,
//   },
//   loader: {
//       marginRight: 10,
//   }
// });

// export default React.memo(TreeNode); // Memoize for performance











// src/screens/TreeNode.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Accept the new 'isLast' prop
const TreeNode = ({ node, onToggle, level, isLast }) => {
  const hasChildren = node.children_count > 0;

  return (
    <View style={styles.nodeContainer}>
      {/* This View will render the tree lines */}
      <View style={styles.indentationContainer}>
        {level > 0 && (
          <View style={styles.lineContainer}>
            <View style={[styles.verticalLine, isLast && styles.shortVerticalLine]} />
            <View style={styles.horizontalLine} />
          </View>
        )}
      </View>

      {/* This is the actual content row */}
      <TouchableOpacity
        style={styles.contentTouchable}
        onPress={() => hasChildren && onToggle(node.id)}
        disabled={!hasChildren && !node.isLoading}
      >
        <View style={styles.iconContainer}>
          {hasChildren ? (
            <Icon
              name={node.isExpanded ? 'remove-circle' : 'add-circle'}
              size={24}
              color="#0CA201"
            />
          ) : (
            <View style={styles.spacer} /> // Spacer to align text when there are no children
          )}
        </View>

        <View style={styles.details}>
          <Text style={styles.name}>{node.full_name}</Text>
          <Text style={styles.username}>@{node.username} | Rank: {node.rank || 'N/A'}</Text>
        </View>

        {node.isLoading && (
          <ActivityIndicator size="small" color="#0CA201" style={styles.loader} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  nodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // We control indentation from within the component now
    marginLeft: 15, 
  },
  // Renders the vertical lines for indentation
  indentationContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  lineContainer: {
    width: 20, // Width of each indentation level
    height: '100%',
    alignItems: 'center',
  },
  verticalLine: {
    width: 1,
    height: '100%',
    backgroundColor: '#dcdcdc',
  },
  // If this is the last node, the vertical line shouldn't extend all the way down
  shortVerticalLine: {
    height: '50%', 
    position: 'absolute',
    top: 0,
  },
  horizontalLine: {
    height: 1,
    width: '50%',
    backgroundColor: '#dcdcdc',
    position: 'absolute',
    left: '50%',
    top: '50%',
  },
  contentTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    flex: 1,
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  spacer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 2, // align with icon
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  username: {
    fontSize: 13,
    color: '#6c757d',
    marginTop: 2,
  },
  loader: {
    marginHorizontal: 10,
  },
});

export default React.memo(TreeNode);