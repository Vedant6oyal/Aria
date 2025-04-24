// components/ReelsMiniPlayer.tsx
import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Dimensions,
  GestureResponderEvent
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useReelsPlayer } from './ReelsPlayerContext';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ReelsMiniPlayerProps {
  title: string;
  creator: string;
  thumbnailUrl: string;
  isPlaying: boolean;
  onPlayPause: (event: GestureResponderEvent) => void;
  onPress: () => void;
}

export function ReelsMiniPlayer({ 
  title, 
  creator, 
  thumbnailUrl, 
  isPlaying, 
  onPlayPause, 
  onPress 
}: ReelsMiniPlayerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Access the reels player context
  const reelsPlayer = useReelsPlayer();

  // Handle play/pause button press
  const lastClickRef = useRef<number | null>(null);
  const handlePlayPausePress = (event: GestureResponderEvent) => {
    // Stop propagation to prevent the container's onPress from firing
    event.stopPropagation();
    
    // Prevent multiple rapid clicks
    const now = Date.now();
    if (lastClickRef.current && now - lastClickRef.current < 300) {
      return; // Ignore clicks that happen too quickly
    }
    lastClickRef.current = now;
    
    // Use the context's toggle function if available, otherwise fallback to props
    if (reelsPlayer.currentReel) {
      reelsPlayer.togglePlayPause();
    } else {
      onPlayPause(event);
    }
  };

  // Determine which play state to use (context or props)
  const isCurrentlyPlaying = reelsPlayer.currentReel ? reelsPlayer.isPlaying : isPlaying;

  // Handle press on the main content area
  const handleMainPress = () => {
    if (reelsPlayer.currentReel) {
      reelsPlayer.navigateToReels();
    } else {
      onPress();
    }
  };

  return (
    <View style={styles.container}>
      {/* Main content area (clickable to open full reel) */}
      <TouchableOpacity 
        style={styles.mainContent} 
        onPress={handleMainPress}
        activeOpacity={0.7}
      >
        {/* Reel Thumbnail */}
        <View style={styles.thumbnailContainer}>
          <Image 
            source={{ uri: thumbnailUrl }} 
            style={styles.thumbnail} 
            resizeMode="cover"
          />
        </View>
        
        {/* Reel Info */}
        <View style={styles.reelInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.creator} numberOfLines={1}>
            {creator}
          </Text>
        </View>
      </TouchableOpacity>
      
      {/* Controls */}
      <View style={styles.controls}>
        {/* Play/Pause button */}
        <TouchableOpacity 
          onPress={handlePlayPausePress}
          style={styles.controlButton}
          activeOpacity={0.6}
        >
          <MaterialCommunityIcons 
            name={isCurrentlyPlaying ? 'pause' : 'play'} 
            size={22} 
            color="#ffffff" 
          />
        </TouchableOpacity>

        {/* Share button */}
        <TouchableOpacity 
          style={styles.controlButton}
          activeOpacity={0.6}
        >
          <MaterialCommunityIcons 
            name="share-variant" 
            size={20} 
            color="#ffffff" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(60, 60, 60, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 8,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnailContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reelInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  creator: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  }
});