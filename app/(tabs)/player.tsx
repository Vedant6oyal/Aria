import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, StatusBar, TouchableWithoutFeedback, GestureResponderEvent, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Get screen dimensions for responsive layout
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Define icon types to avoid TypeScript errors
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

// Mock data for the currently playing track
const currentTrack = {
  id: '1',
  title: 'Happy Vibes',
  artist: 'Positive Energy',
  duration: 200, // in seconds
  icon: 'music-note-eighth' as IconName,
  coverColor: '#FF7B54', // Primary Light from the new sunset-inspired color scheme
  secondaryColor: '#8E92EF', // Secondary Light from the new sunset-inspired color scheme
  mediaSource: require('@/assets/audio/sample.mp4'), // Fixed path to MP4 file
  isVideo: true, // Set to true for MP4 video files, false for audio-only MP4 files
};

export default function PlayerScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [progress, setProgress] = useState(0); // current progress in seconds
  const [volume, setVolume] = useState(0.8);
  const [duration, setDuration] = useState(currentTrack.duration);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<Video>(null);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const controlsAnimation = useRef(new Animated.Value(1)).current; // Start visible (1)
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Set initial timer for controls
  useEffect(() => {
    startHideControlsTimer();
    
    // Clean up on unmount
    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, []);
  
  // Handle controls visibility timer
  const startHideControlsTimer = () => {
    // Clear any existing timer first
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
      controlsTimerRef.current = null;
    }
    
    // Only set timer if controls are visible and it's a video
    if (showControls && currentTrack.isVideo) {
      console.log("Starting 3s timer to hide controls");
      controlsTimerRef.current = setTimeout(() => {
        console.log("Timer finished, hiding controls");
        hideControlsWithAnimation();
      }, 200);
    }
  };

  // Animate controls showing
  const showControlsWithAnimation = () => {
    console.log("Showing controls with animation");
    setShowControls(true);
    Animated.timing(controlsAnimation, {
      toValue: 1,
      duration: 300, // Animation duration in ms
      useNativeDriver: true,
    }).start();
    startHideControlsTimer();
  };
  
  // Animate controls hiding
  const hideControlsWithAnimation = () => {
    console.log("Hiding controls with animation");
    Animated.timing(controlsAnimation, {
      toValue: 0,
      duration: 300, // Animation duration in ms
      useNativeDriver: true,
    }).start(() => {
      // Only update state after animation completes
      setShowControls(false);
    });
    
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
      controlsTimerRef.current = null;
    }
  };
  
  // Show controls (legacy function, now uses animation)
  const showControlsHandler = () => {
    showControlsWithAnimation();
  };
  
  // Hide controls immediately (legacy function, now uses animation)
  const hideControlsHandler = () => {
    hideControlsWithAnimation();
  };
  
  // Toggle controls visibility (triggered by tapping video background)
  const toggleControlsHandler = () => {
    console.log("Background tapped, toggling controls. Current state:", showControls);
    if (showControls) {
      hideControlsWithAnimation();
    } else {
      showControlsWithAnimation();
    }
  };
  
  // Prevent event bubbling to parent when tapping controls
  const handleControlPress = (event: GestureResponderEvent) => {
    console.log("Control area pressed, stopping propagation and resetting timer.");
    event.stopPropagation(); // Stop tap from reaching videoTouchOverlay
    startHideControlsTimer(); // Reset timer as user interacted
  };

  // Handle playback status updates
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      // Handle unloaded state if necessary
      if (status.error) {
        console.error(`Error loading video: ${status.error}`);
      }
      return;
    }
    
    setProgress(status.positionMillis / 1000);
    if (status.durationMillis) {
      setDuration(status.durationMillis / 1000);
    }
    // Update playing state based on status
    setIsPlaying(status.isPlaying);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Toggle play/pause
  const togglePlayback = async () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    
    // Reset controls visibility timer
    startHideControlsTimer();
  };

  // Toggle favorite
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    startHideControlsTimer();
  };

  // Skip to previous track (mock function)
  const skipToPrevious = () => {
    console.log('Skip to previous');
    startHideControlsTimer();
  };

  // Skip to next track (mock function)
  const skipToNext = () => {
    console.log('Skip to next');
    startHideControlsTimer();
  };

  // Handle progress change
  const onProgressChange = async (value: number) => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(value * 1000);
    }
    setProgress(value);
    startHideControlsTimer();
  };

  // Handle volume change
  const onVolumeChange = async (value: number) => {
    // Set the volume state first
    setVolume(value);
    
    // Then apply it to the video if it exists
    if (videoRef.current) {
      try {
        // Just set volume without any other operations
        await videoRef.current.setVolumeAsync(value);
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    }
  };

  // Special handler for volume slider to prevent propagation
  const handleVolumeSliderTouch = (event: GestureResponderEvent) => {
    // This is crucial - prevent the event from bubbling up
    event.stopPropagation();
    
    // Don't start hide controls timer here - will be handled once when sliding completes
    return true;
  };
  
  // Handle when volume sliding is complete
  const handleVolumeSlidingComplete = () => {
    // Reset the timer only once when sliding is finished
    startHideControlsTimer();
  };

  // If it's a video with lyrics, use a full-screen layout
  if (currentTrack.isVideo) {
    // Calculate transform for slide-up animation
    const translateY = controlsAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [200, 0], // Slide up from 200px below
    });
    
    // Calculate opacity for fade-in animation
    const opacity = controlsAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    
    return (
      <View style={styles.fullScreenContainer}>
        <StatusBar hidden />
        
        {/* Video Container */}
        <View style={styles.fullScreenVideoContainer}>
          {/* Video Player */}
          <Video
            ref={videoRef}
            source={currentTrack.mediaSource}
            style={styles.fullScreenVideo}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false}
            isLooping
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            useNativeControls={false}
            volume={volume}
          />
          
          {/* Persistent header at the top (always visible) */}
          <View style={styles.persistentHeader}>
            <TouchableOpacity 
              style={styles.headerBackButton}
              onPress={() => router.back()}
            >
              <MaterialCommunityIcons name="chevron-down" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <ThemedText style={styles.headerTitlePersistent}>{currentTrack.title}</ThemedText>
              <ThemedText style={styles.headerSubtitlePersistent}>{currentTrack.artist}</ThemedText>
            </View>
            <TouchableOpacity style={styles.headerMenuButton}>
              <MaterialCommunityIcons name="dots-horizontal" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {/* Touchable overlay for tap-to-show/hide controls */}
          <TouchableWithoutFeedback onPress={toggleControlsHandler}>
            <View style={styles.videoTouchOverlay} />
          </TouchableWithoutFeedback>
          
          {/* Overlay Controls - Only shown when showControls is true */}
          {showControls && (
            <TouchableWithoutFeedback onPress={handleControlPress}>
              <View style={styles.overlayContainer}>
                {/* Main controls container that animates */}
                <Animated.View 
                  style={[
                    styles.mainControlsContainer,
                    { 
                      opacity,
                      transform: [{ translateY }]
                    }
                  ]}
                >
                  {/* Bottom Controls */}
                  <View style={styles.overlayBottom}>
                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                      <ThemedText style={styles.timeTextLight}>{formatTime(progress)}</ThemedText>
                      {/* Slider needs direct interaction handling */}                    
                      <Slider
                        style={styles.progressBar}
                        minimumValue={0}
                        maximumValue={duration}
                        value={progress}
                        // Stop propagation during sliding start/end if needed, but onValueChange should be fine
                        // as long as the parent TouchableWithoutFeedback resets the timer
                        onValueChange={onProgressChange} 
                        minimumTrackTintColor={colors.tint}
                        maximumTrackTintColor="rgba(255,255,255,0.3)"
                        thumbTintColor={colors.tint}
                      />
                      <ThemedText style={styles.timeTextLight}>{formatTime(duration)}</ThemedText>
                    </View>

                    {/* Playback Controls */}
                    <View style={styles.controlsContainer}>
                      <TouchableOpacity style={styles.controlButton} onPress={toggleFavorite}>
                        <MaterialCommunityIcons
                          name={isFavorite ? 'heart' : 'heart-outline'}
                          size={28}
                          color={isFavorite ? colors.tint : "#FFFFFF"}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.controlButton} onPress={skipToPrevious}>
                        <MaterialCommunityIcons name="skip-previous" size={40} color="#FFFFFF" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayback}>
                        <LinearGradient
                          colors={[colors.tint, colors.secondary]}
                          style={styles.playPauseGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <MaterialCommunityIcons
                            name={isPlaying ? 'pause' : 'play'}
                            size={36}
                            color="#FFFFFF"
                          />
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.controlButton} onPress={skipToNext}>
                        <MaterialCommunityIcons name="skip-next" size={40} color="#FFFFFF" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.controlButton}
                        onPress={() => {
                          // Timer reset is handled by parent TouchableWithoutFeedback
                          console.log('Shuffle');
                        }}
                      >
                        <MaterialCommunityIcons name="shuffle-variant" size={28} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>

                    {/* Volume Control */}
                    <View 
                      style={styles.volumeContainer}
                      onStartShouldSetResponder={handleVolumeSliderTouch}
                      onMoveShouldSetResponder={handleVolumeSliderTouch}
                      onResponderGrant={handleVolumeSliderTouch}
                    >
                      <MaterialCommunityIcons name="volume-low" size={24} color="#FFFFFF" />
                       {/* Slider needs direct interaction handling */} 
                      <Slider
                        style={styles.volumeSlider}
                        minimumValue={0}
                        maximumValue={1}
                        value={volume}
                        onValueChange={onVolumeChange}
                        onSlidingComplete={handleVolumeSlidingComplete}
                        minimumTrackTintColor={colors.tint}
                        maximumTrackTintColor="rgba(255,255,255,0.3)"
                        thumbTintColor={colors.tint}
                      />
                      <MaterialCommunityIcons name="volume-high" size={24} color="#FFFFFF" />
                    </View>
                  </View>
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          )}
          
          {/* Persistent mini-player at the bottom (always visible) */}
          <View style={styles.miniPlayerContainer}>
            <View style={styles.miniPlayerContent}>
              {/* Track info */}
              <View style={styles.miniTrackInfo}>
                <View style={styles.miniAlbumArt}>
                  <MaterialCommunityIcons name="music" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.miniTrackDetails}>
                  <ThemedText style={styles.miniTrackTitle}>{currentTrack.title}</ThemedText>
                  <ThemedText style={styles.miniTrackArtist}>{currentTrack.artist}</ThemedText>
                </View>
              </View>
              
              {/* Mini player controls */}
              <View style={styles.miniControls}>
                <TouchableOpacity 
                  style={styles.miniControlButton} 
                  onPress={togglePlayback}
                >
                  <MaterialCommunityIcons
                    name={isPlaying ? 'pause-circle' : 'play-circle'}
                    size={36}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.miniControlButton}
                  onPress={() => {
                    console.log('Next track');
                    skipToNext();
                  }}
                >
                  <MaterialCommunityIcons name="skip-next-circle" size={36} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Mini progress bar */}
            <View style={styles.miniProgressBarContainer}>
              <View 
                style={[
                  styles.miniProgressBar, 
                  { width: `${(progress / duration) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  // For non-video tracks, use the original layout with album art
  return (
    <LinearGradient
      colors={[colors.gradient[0], colors.gradient[1]]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-down" size={30} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <ThemedText style={styles.headerTitle}>Now Playing</ThemedText>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Album Art */}
      <View style={styles.mediaContainer}>
        <LinearGradient
          colors={[currentTrack.coverColor, currentTrack.secondaryColor]}
          style={styles.albumArtGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.albumArtInner}>
            <MaterialCommunityIcons name={currentTrack.icon} size={100} color="rgba(255,255,255,0.8)" />
          </View>
        </LinearGradient>
      </View>

      {/* Track Info */}
      <View style={styles.trackInfoContainer}>
        <ThemedText style={styles.trackTitle}>{currentTrack.title}</ThemedText>
        <ThemedText style={styles.trackArtist}>{currentTrack.artist}</ThemedText>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ThemedText style={styles.timeText}>{formatTime(progress)}</ThemedText>
        <Slider
          style={styles.progressBar}
          minimumValue={0}
          maximumValue={duration}
          value={progress}
          onValueChange={onProgressChange}
          minimumTrackTintColor={colors.tint}
          maximumTrackTintColor={colors.overlay}
          thumbTintColor={colors.tint}
        />
        <ThemedText style={styles.timeText}>{formatTime(duration)}</ThemedText>
      </View>

      {/* Playback Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleFavorite}>
          <MaterialCommunityIcons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={28}
            color={isFavorite ? colors.tint : colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={skipToPrevious}>
          <MaterialCommunityIcons name="skip-previous" size={40} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayback}>
          <LinearGradient
            colors={[colors.tint, colors.secondary]}
            style={styles.playPauseGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialCommunityIcons
              name={isPlaying ? 'pause' : 'play'}
              size={36}
              color="#FFFFFF"
            />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={skipToNext}>
          <MaterialCommunityIcons name="skip-next" size={40} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <MaterialCommunityIcons name="shuffle-variant" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Volume Control */}
      <View 
        style={styles.volumeContainer}
        onStartShouldSetResponder={handleVolumeSliderTouch}
        onMoveShouldSetResponder={handleVolumeSliderTouch}
        onResponderGrant={handleVolumeSliderTouch}
      >
        <MaterialCommunityIcons name="volume-low" size={24} color={colors.text} />
        <Slider
          style={styles.volumeSlider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={onVolumeChange}
          onSlidingComplete={handleVolumeSlidingComplete}
          minimumTrackTintColor={colors.tint}
          maximumTrackTintColor={colors.overlay}
          thumbTintColor={colors.tint}
        />
        <MaterialCommunityIcons name="volume-high" size={24} color={colors.text} />
      </View>

      {/* Music Visualizer */}
      <View style={styles.visualizerContainer}>
        {Colors.common.musicVisualizer.map((color, index) => (
          <View 
            key={index} 
            style={[
              styles.visualizerBar, 
              { 
                backgroundColor: color,
                height: isPlaying ? 20 + Math.random() * 40 : 10 + index * 5,
                marginLeft: index > 0 ? 4 : 0
              }
            ]} 
          />
        ))}
      </View>

      {/* Additional Options */}
      <View style={styles.additionalOptions}>
        <TouchableOpacity style={styles.optionButton}>
          <MaterialCommunityIcons name="playlist-music" size={24} color={colors.text} />
          <ThemedText style={styles.optionText}>Queue</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <MaterialCommunityIcons name="share-variant" size={24} color={colors.text} />
          <ThemedText style={styles.optionText}>Share</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <MaterialCommunityIcons name="equalizer" size={24} color={colors.text} />
          <ThemedText style={styles.optionText}>EQ</ThemedText>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullScreenVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenVideo: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
  },
  videoTouchOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  mainControlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  overlayBottom: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    paddingBottom: 50,
    paddingHorizontal: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginBottom: 60, // Space for mini player
  },
  persistentHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerBackButton: {
    padding: 5,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerTitlePersistent: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitlePersistent: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  headerTitleLight: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitleLight: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  headerMenuButton: {
    padding: 5,
  },
  menuButton: {
    padding: 5,
  },
  mediaContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  albumArtGradient: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  albumArtInner: {
    flex: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  trackInfoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trackArtist: {
    fontSize: 18,
    opacity: 0.8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  timeText: {
    fontSize: 12,
    width: 40,
    textAlign: 'center',
  },
  timeTextLight: {
    fontSize: 12,
    width: 40,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  progressBar: {
    flex: 1,
    height: 40,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  controlButton: {
    padding: 10,
  },
  playPauseButton: {
    padding: 0,
  },
  playPauseGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  volumeSlider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  visualizerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 60,
    marginVertical: 20,
  },
  visualizerBar: {
    width: 6,
    borderRadius: 3,
  },
  additionalOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  optionButton: {
    alignItems: 'center',
  },
  optionText: {
    fontSize: 12,
    marginTop: 5,
  },
  miniPlayerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingTop: 2, // Space for progress bar
  },
  miniPlayerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  miniTrackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  miniAlbumArt: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  miniTrackDetails: {
    flex: 1,
  },
  miniTrackTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  miniTrackArtist: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  miniControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniControlButton: {
    marginLeft: 8,
  },
  miniProgressBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  miniProgressBar: {
    height: 2,
    backgroundColor: '#FFFFFF',
  },
});
