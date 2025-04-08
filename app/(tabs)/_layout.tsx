import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, View, Dimensions, StyleSheet, Animated, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { usePlayer } from '@/context/PlayerContext';
import { MiniPlayer } from '@/components/MiniPlayer';
import { ReelsMiniPlayer } from '@/components/ReelsMiniPlayer';

// Get screen dimensions for responsive layout
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 70; // Reduced height

// Custom tab bar button component with animations
const AnimatedTab = ({ 
  isFocused, 
  onPress, 
  label, 
  icon 
}: { 
  isFocused: boolean; 
  onPress: () => void; 
  label: string; 
  icon: React.ReactNode;
}) => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const opacity = React.useRef(new Animated.Value(0.7)).current;
  
  useEffect(() => {
    if (isFocused) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1.1, // Subtle scale
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFocused, scale, opacity]);

  return (
    <Animated.View
      style={[
        styles.tabButton,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      <Animated.View style={styles.tabIconContainer} onTouchEnd={onPress}>
        {icon}
        <Text
          style={[
            styles.tabLabel,
            { 
              opacity: isFocused ? 1 : 0.8, 
              color: isFocused ? '#fff' : 'rgba(255,255,255,0.7)' 
            }
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

/**
 * Tab layout for the Aria music app, with Reels as the primary screen.
 */
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { currentTrack, isPlaying, togglePlayPause, navigateToPlayer } = usePlayer();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // State for ReelsMiniPlayer
  const [currentReel, setCurrentReel] = useState({
    title: "Believe in yourself",
    creator: "@bassboostedmixtape724",
    thumbnailUrl: "https://i.imgur.com/9GziU7v.png",
    isPlaying: false
  });
  
  // Show ReelsMiniPlayer when not on the reels tab and not on player screen
  const showReelsMiniPlayer = !pathname.includes('/player') && pathname.includes('/reels') === false;
  
  // Show MiniPlayer only when there's a track and not on player screen
  const showMiniPlayer = currentTrack !== null && !pathname.includes('/player');
  
  // Custom tab bar renderer
  function TabBar({ state, navigation }) {
    return (
      <BlurView
        intensity={30} // Lower intensity for more subtle effect
        tint="dark" // Always dark tint to match design
        style={[
          styles.tabBar,
          { 
            paddingBottom: insets.bottom,
            bottom: 0, // Always at bottom
          }
        ]}
      >
        <View style={styles.tabBarContent}>
          {/* Reels Tab */}
          <AnimatedTab
            isFocused={state.index === 0}
            onPress={() => navigation.navigate('reels')}
            label="Reels"
            icon={
              <MaterialCommunityIcons
                name="video"
                size={22} // Slightly smaller
                color={state.index === 0 ? '#fff' : 'rgba(255,255,255,0.7)'}
              />
            }
          />
          
          {/* Library Tab */}
          <AnimatedTab
            isFocused={state.index === 1}
            onPress={() => navigation.navigate('library')}
            label="Library"
            icon={
              <MaterialCommunityIcons
                name="bookshelf"
                size={22}
                color={state.index === 1 ? '#fff' : 'rgba(255,255,255,0.7)'}
              />
            }
          />
          
          {/* Profile Tab */}
          <AnimatedTab
            isFocused={state.index === 2}
            onPress={() => navigation.navigate('profile')}
            label="Profile"
            icon={
              <MaterialCommunityIcons
                name="account-circle"
                size={22}
                color={state.index === 2 ? '#fff' : 'rgba(255,255,255,0.7)'}
              />
            }
          />
        </View>
      </BlurView>
    );
  }

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="reels"
        tabBar={props => <TabBar {...props} />}
      >
        <Tabs.Screen
          name="reels"
          options={{
            title: 'Reels',
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        />
        
        {/* Hidden tabs */}
        <Tabs.Screen
          name="player"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="playlist"
          options={{
            href: null,
          }}
        />
        
        {/* Hide these screens from the tab bar */}
        <Tabs.Screen
          name="index"
          options={{
            tabBarButton: () => null,
          }}
        />
        <Tabs.Screen
          name="foryou"
          options={{
            tabBarButton: () => null,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            tabBarButton: () => null,
          }}
        />
      </Tabs>

      {/* ReelsMiniPlayer - Show when not on the reels tab */}
      {showReelsMiniPlayer && (
        <View 
          style={[
            styles.miniPlayerContainer,
            {
              bottom: TAB_BAR_HEIGHT + insets.bottom + 5, // Position above tab bar
              zIndex: 1 // Ensure it's above other content
            }
          ]}
        >
          <ReelsMiniPlayer
            title={currentReel.title}
            creator={currentReel.creator}
            thumbnailUrl={currentReel.thumbnailUrl}
            isPlaying={currentReel.isPlaying}
            onPlayPause={(e) => {
              setCurrentReel(prev => ({
                ...prev,
                isPlaying: !prev.isPlaying
              }));
            }}
            onPress={() => {
              // Navigate to full reel view
              router.push('/reels');
            }}
          />
        </View>
      )}

      {/* Mini Player - positioned above the tab bar */}
      {showMiniPlayer && (
        <View 
          style={[
            styles.miniPlayerContainer,
            {
              bottom: TAB_BAR_HEIGHT + insets.bottom, // Position directly above tab bar
              zIndex: 1 // Ensure it's above other content
            }
          ]}
        >
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
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT,
    backgroundColor: 'rgba(60, 60, 60, 0.5)', // Darker semi-transparent background
    borderTopWidth: 0, // No border
    overflow: 'hidden',
  },
  tabBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100%',
    paddingHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  tabLabel: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
  }
});
