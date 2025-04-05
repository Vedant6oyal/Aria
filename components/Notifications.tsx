import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  Animated,
  Dimensions,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock notification data
const mockNotifications = [
  {
    id: '1',
    type: 'new_follower',
    title: 'New Follower',
    message: 'Taylor Swift started following you',
    time: '2h ago',
    read: false,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop',
    actionable: true
  },
  {
    id: '2',
    type: 'playlist_like',
    title: 'Playlist Liked',
    message: 'John Doe liked your "Morning Vibes" playlist',
    time: '5h ago',
    read: false,
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2940&auto=format&fit=crop',
    actionable: true
  },
  {
    id: '3',
    type: 'new_release',
    title: 'New Release',
    message: 'The Weeknd just released a new album "After Hours"',
    time: '1d ago',
    read: true,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop',
    actionable: true
  },
  {
    id: '4',
    type: 'friend_activity',
    title: 'Friend Activity',
    message: 'Emma Watson is listening to "Blinding Lights"',
    time: '1d ago',
    read: true,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2788&auto=format&fit=crop',
    actionable: false
  },
  {
    id: '5',
    type: 'playlist_update',
    title: 'Playlist Updated',
    message: 'Your "Discover Weekly" playlist has been updated with 30 new songs',
    time: '2d ago',
    read: true,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop',
    actionable: true
  },
  {
    id: '6',
    type: 'system',
    title: 'Account Update',
    message: 'Your premium subscription will renew in 3 days',
    time: '3d ago',
    read: true,
    image: null,
    actionable: false
  },
];

interface NotificationProps {
  visible: boolean;
  onClose: () => void;
}

export function Notifications({ visible, onClose }: NotificationProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [slideAnim] = useState(new Animated.Value(Dimensions.get('window').height));

  // Get status bar height for proper padding
  const statusBarHeight = Platform.OS === 'ios' ? RNStatusBar.currentHeight || 44 : 0;

  // Handle notification read status
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Handle notification press
  const handleNotificationPress = (notification: any) => {
    markAsRead(notification.id);
    
    // Handle different notification types
    switch(notification.type) {
      case 'new_follower':
        // Navigate to follower profile
        console.log('Navigate to follower profile');
        break;
      case 'playlist_like':
      case 'playlist_update':
        // Navigate to playlist
        console.log('Navigate to playlist');
        break;
      case 'new_release':
        // Navigate to album
        console.log('Navigate to album');
        break;
      case 'friend_activity':
        // Navigate to song
        console.log('Navigate to song');
        break;
      default:
        // Do nothing for system notifications
        break;
    }
  };
  
  // Animation effects
  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 10
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: Dimensions.get('window').height,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    }
  }, [visible, slideAnim]);
  
  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Render notification item
  const renderNotificationItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem, 
        { backgroundColor: item.read ? colors.background : colors.tint + '10' }
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      {!item.read && <View style={[styles.unreadIndicator, { backgroundColor: colors.tint }]} />}
      
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.notificationImage} />
      ) : (
        <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
          <MaterialCommunityIcons 
            name={
              item.type === 'system' 
                ? 'information' 
                : item.type === 'new_follower' 
                  ? 'account-plus' 
                  : 'music'
            } 
            size={24} 
            color={colors.tint} 
          />
        </View>
      )}
      
      <View style={styles.notificationContent}>
        <ThemedText style={styles.notificationTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.notificationMessage}>{item.message}</ThemedText>
        <ThemedText style={styles.notificationTime}>{item.time}</ThemedText>
      </View>
      
      {item.actionable && (
        <MaterialCommunityIcons 
          name="chevron-right" 
          size={20} 
          color={colors.tabIconDefault} 
          style={styles.actionIcon}
        />
      )}
    </TouchableOpacity>
  );
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons 
        name="bell-off-outline" 
        size={60} 
        color={colors.tabIconDefault} 
      />
      <ThemedText style={styles.emptyTitle}>No notifications</ThemedText>
      <ThemedText style={styles.emptyMessage}>
        You don't have any notifications right now. We'll notify you when something interesting happens!
      </ThemedText>
    </View>
  );
  
  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.background,
          transform: [{ translateY: slideAnim }],
          paddingTop: statusBarHeight
        }
      ]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialCommunityIcons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <ThemedText style={styles.headerTitle}>Notifications</ThemedText>
        
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markReadButton}>
            <ThemedText style={[styles.markReadText, { color: colors.tint }]}>
              Mark all as read
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Notification List */}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    marginTop: 10, // Add extra margin for the close button
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  markReadButton: {
    padding: 8,
  },
  markReadText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: 'relative',
  },
  unreadIndicator: {
    position: 'absolute',
    left: 0,
    top: '50%',
    width: 4,
    height: 20,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    marginTop: -10,
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  actionIcon: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
});
