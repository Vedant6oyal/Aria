import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';

// Mock user data
const userData = {
  name: 'Alex Johnson',
  username: '@alexjmusic',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
  followers: 1245,
  following: 420,
  bio: 'Music enthusiast | Playlist curator | Always looking for new sounds',
  favoriteGenres: ['Pop', 'Indie', 'Electronic', 'R&B'],
  recentlyPlayed: [
    { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop' },
    { id: '2', title: 'As It Was', artist: 'Harry Styles', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop' },
    { id: '3', title: 'Bad Habit', artist: 'Steve Lacy', cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop' },
  ],
  playlists: [
    { id: '1', title: 'Morning Vibes', tracks: 24, cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop' },
    { id: '2', title: 'Workout Mix', tracks: 18, cover: 'https://images.unsplash.com/photo-1594623930572-300a3011d9ae?q=80&w=2070&auto=format&fit=crop' },
    { id: '3', title: 'Chill Evening', tracks: 32, cover: 'https://images.unsplash.com/photo-1483000805330-4eaf0a0d82da?q=80&w=2070&auto=format&fit=crop' },
  ]
};

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  
  const [notifications, setNotifications] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 60,
      paddingBottom: 24,
      paddingHorizontal: 20,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileImage: {
      width: 90,
      height: 90,
      borderRadius: 45,
      marginRight: 20,
      borderWidth: 3,
      borderColor: colors.tint,
    },
    userInfo: {
      flex: 1,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    username: {
      fontSize: 16,
      color: colors.tabIconDefault,
      marginBottom: 8,
    },
    statsContainer: {
      flexDirection: 'row',
      marginTop: 8,
    },
    statItem: {
      marginRight: 20,
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    statLabel: {
      fontSize: 14,
      color: colors.tabIconDefault,
    },
    bioSection: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    bioText: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 22,
    },
    genreContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 12,
    },
    genreTag: {
      backgroundColor: colors.tint + '20', // 20% opacity
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginRight: 8,
      marginBottom: 8,
    },
    genreText: {
      color: colors.tint,
      fontWeight: '600',
    },
    section: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    viewAllText: {
      color: colors.tint,
      fontSize: 14,
    },
    horizontalList: {
      paddingBottom: 8,
    },
    itemCard: {
      width: 150,
      marginRight: 16,
    },
    itemCover: {
      width: 150,
      height: 150,
      borderRadius: 8,
      marginBottom: 8,
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    itemSubtitle: {
      fontSize: 14,
      color: colors.tabIconDefault,
    },
    settingsSection: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingLabel: {
      fontSize: 16,
      color: colors.text,
    },
    logoutButton: {
      marginTop: 20,
      marginHorizontal: 20,
      marginBottom: 30,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    logoutText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    headerButtons: {
      position: 'absolute',
      top: 50,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      zIndex: 10,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background + '80', // 50% opacity
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* Header Buttons */}
      <View style={styles.headerButtons}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialCommunityIcons name="cog" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={[colors.tint + '40', colors.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
            <View style={styles.userInfo}>
              <Text style={styles.name}>{userData.name}</Text>
              <Text style={styles.username}>{userData.username}</Text>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{userData.followers}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{userData.following}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
        
        {/* Bio Section */}
        <View style={styles.bioSection}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{userData.bio}</Text>
          
          <View style={styles.genreContainer}>
            {userData.favoriteGenres.map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Recently Played Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Played</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalList}
          >
            {userData.recentlyPlayed.map((item) => (
              <TouchableOpacity key={item.id} style={styles.itemCard}>
                <Image source={{ uri: item.cover }} style={styles.itemCover} />
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle}>{item.artist}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Playlists Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Playlists</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalList}
          >
            {userData.playlists.map((playlist) => (
              <TouchableOpacity key={playlist.id} style={styles.itemCard}>
                <Image source={{ uri: playlist.cover }} style={styles.itemCover} />
                <Text style={styles.itemTitle}>{playlist.title}</Text>
                <Text style={styles.itemSubtitle}>{playlist.tracks} tracks</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.tint }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Data Saver</Text>
            <Switch
              value={dataSaver}
              onValueChange={setDataSaver}
              trackColor={{ false: colors.border, true: colors.tint }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.border, true: colors.tint }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity>
          <LinearGradient
            colors={[colors.tint, colors.secondary || '#FF6B6B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
