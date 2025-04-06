import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, Dimensions, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { usePlayer } from '@/context/PlayerContext';
import { MiniPlayer } from '@/components/MiniPlayer';

// Get screen dimensions for responsive layout
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 60;

/**
 * Tab layout for the Aria music app, with tabs for Home, Search, Library, Player, and Profile.
 * The icons are chosen to reflect the positive and uplifting theme of the app.
 */
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { currentTrack, isPlaying, togglePlayPause, navigateToPlayer } = usePlayer();
  const pathname = usePathname();
  
  // Determine if we should show the mini player
  // Hide mini player when on the player screen
  const showMiniPlayer = currentTrack !== null && !pathname.includes('/player');

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.tint,
          tabBarInactiveTintColor: colors.tabIconDefault,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            height: TAB_BAR_HEIGHT,
            paddingBottom: Platform.OS === 'ios' ? 20 : 0,
          },
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }: { color: string, size: number }) => (
              <MaterialCommunityIcons name="home-heart" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="foryou"
          options={{
            title: 'For You',
            tabBarIcon: ({ color, size }: { color: string, size: number }) => (
              <MaterialCommunityIcons name="playlist-star" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="reels"
          options={{
            title: 'Reels',
            tabBarIcon: ({ color, size }: { color: string, size: number }) => (
              <MaterialCommunityIcons name="video" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Discover',
            tabBarIcon: ({ color, size }: { color: string, size: number }) => (
              <MaterialCommunityIcons name="magnify" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="player"
          options={{
            title: 'Now Playing',
            tabBarIcon: ({ color, size }: { color: string, size: number }) => (
              <MaterialCommunityIcons name="music-note" size={size} color={color} />
            ),
            href: null, // This screen will be accessed through other means
          }}
        />
        <Tabs.Screen
          name="playlist"
          options={{
            title: 'Playlist',
            tabBarIcon: ({ color, size }: { color: string, size: number }) => (
              <MaterialCommunityIcons name="playlist-music" size={size} color={color} />
            ),
            href: null, // Hide from tab bar, accessed through navigation
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
            tabBarIcon: ({ color, size }: { color: string, size: number }) => (
              <MaterialCommunityIcons name="bookshelf" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }: { color: string, size: number }) => (
              <MaterialCommunityIcons name="account-circle" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* Mini Player - positioned just above the tab bar */}
      {showMiniPlayer && (
        <View style={styles.miniPlayerContainer}>
          <MiniPlayer
            isPlaying={isPlaying}
            currentTrack={currentTrack}
            onPlayPause={togglePlayPause}
            onPress={navigateToPlayer}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  miniPlayerContainer: {
    position: 'absolute',
    bottom: 0 , // Slight overlap with tab bar
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  }
});
