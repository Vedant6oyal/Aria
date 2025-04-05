import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Dimensions,
  Animated,
  GestureResponderEvent
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Track } from '@/context/PlayerContext';

interface MiniPlayerProps {
  isPlaying: boolean;
  currentTrack: Track;
  onPlayPause: () => void;
  onPress: () => void;
}

export function MiniPlayer({ 
  isPlaying, 
  currentTrack, 
  onPlayPause, 
  onPress 
}: MiniPlayerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  // If no track is playing, don't render the mini player
  if (!currentTrack) return null;

  // Handle play/pause button press
  const handlePlayPausePress = (event: GestureResponderEvent) => {
    // Stop propagation to prevent the container's onPress from firing
    event.stopPropagation();
    onPlayPause();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Main content area (clickable to navigate to player) */}
      <TouchableOpacity 
        style={styles.mainContent} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* Track Artwork */}
        <Image 
          source={{ uri: currentTrack.artwork }} 
          style={styles.artwork} 
        />
        
        {/* Track Info */}
        <View style={styles.trackInfo}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={[styles.artist, { color: colors.tabIconDefault }]} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>
      </TouchableOpacity>
      
      {/* Play/Pause button (separate touchable area) */}
      <TouchableOpacity 
        onPress={handlePlayPausePress}
        style={styles.playButton}
        activeOpacity={0.6}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <MaterialCommunityIcons 
          name={isPlaying ? 'pause-circle' : 'play-circle'} 
          size={32} 
          color={colors.tint} 
        />
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60, // Above the tab bar
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 999,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  artwork: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  artist: {
    fontSize: 12,
  },
  playButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  }
});
