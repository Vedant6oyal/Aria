import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView'; 
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock notification data (copied from components/Notifications.tsx)
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
  // ... Add other notifications from mock data as needed
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

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [notifications, setNotifications] = useState(mockNotifications);

  // Get status bar height for proper padding
  const statusBarHeight = Platform.OS === 'ios' ? RNStatusBar.currentHeight || 44 : RNStatusBar.currentHeight || 0;

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
    
    // Handle different notification types (replace with actual navigation)
    switch(notification.type) {
      case 'new_follower':
        console.log('Navigate to follower profile');
        // Example: router.push(`/profile/${notification.userId}`);
        break;
      case 'playlist_like':
      case 'playlist_update':
        console.log('Navigate to playlist');
        // Example: router.push(`/playlist/${notification.playlistId}`);
        break;
      case 'new_release':
        console.log('Navigate to album');
        // Example: router.push(`/album/${notification.albumId}`);
        break;
      case 'friend_activity':
        console.log('Navigate to song');
        // Example: router.push(`/player?trackId=${notification.trackId}`);
        break;
      default:
        // Do nothing for system or non-actionable notifications
        break;
    }
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
  };

  // Render notification item
  const renderNotificationItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.notificationItem}
      onPress={() => item.actionable && handleNotificationPress(item)}
      activeOpacity={item.actionable ? 0.7 : 1}
    >
      {/* Unread Indicator */}
      {!item.read && (
        <View style={[styles.unreadIndicator, { backgroundColor: colors.tint }]} />
      )}
      
      {/* Image or Icon */}
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.notificationImage} />
      ) : (
        <View style={[styles.iconContainer, { backgroundColor: colors.background + '80' }]}>
          <MaterialCommunityIcons 
            name={item.type === 'system' ? 'cog' : 'bell'} 
            size={24} 
            color={colors.text} 
          />
        </View>
      )}

      {/* Content */}
      <View style={styles.notificationContent}>
        <ThemedText style={styles.notificationTitle} numberOfLines={1}>{item.title}</ThemedText>
        <ThemedText style={[styles.notificationMessage, { color: colors.text }]} numberOfLines={2}>
          {item.message}
        </ThemedText>
        <ThemedText style={styles.notificationTime}>{item.time}</ThemedText>
      </View>

      {/* Action Icon (if actionable) */}      
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
        You don't have any notifications right now.
      </ThemedText>
    </View>
  );
  
  return (
    <ThemedView style={[styles.container, { paddingTop: statusBarHeight }]}>
      {/* Header */}      
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerTitleContainer}> 
          <ThemedText style={styles.headerTitle}>Notifications</ThemedText>
        </View>
        
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
    </ThemedView>
  );
}

// Styles adapted from components/Notifications.tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Removed absolute positioning and animation styles
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    // Removed marginTop for close button
  },
  headerTitleContainer: {
    // Added container to help center title when button is present/absent
    flex: 1, 
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Removed closeButton style
  markReadButton: {
    paddingVertical: 8,
    paddingHorizontal: 4, // Reduced padding a bit
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
    position: 'relative', // For unread indicator
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee', // Add a light separator
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
    marginRight: 8, // Add space before action icon
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 18, // Improve readability
  },
  notificationTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  actionIcon: {
    // marginLeft: 8, // Handled by marginRight on content
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
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
});
