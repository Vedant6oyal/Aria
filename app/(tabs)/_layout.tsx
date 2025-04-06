import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { usePlayer } from '@/context/PlayerContext';
import { MiniPlayer } from '@/components/MiniPlayer';

/**
 * Tab layout for the Aria music app, with tabs for Home, Search, Library, Player, and Profile.
 * The icons are chosen to reflect the positive and uplifting theme of the app.
 */
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { currentTrack, isPlaying, togglePlayPause, navigateToPlayer } = usePlayer();
  
  // Determine if we should show the mini player
  const hasMiniPlayer = currentTrack !== null;

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.tint,
          tabBarInactiveTintColor: colors.tabIconDefault,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            height: hasMiniPlayer ? 60 : undefined, // Adjust height when mini player is visible
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

      {/* Mini Player */}
      {currentTrack && (
        <MiniPlayer
          isPlaying={isPlaying}
          currentTrack={currentTrack}
          onPlayPause={togglePlayPause}
          onPress={navigateToPlayer}
        />
      )}
    </View>
  );
}
