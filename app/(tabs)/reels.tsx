import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
  StatusBar,
  Image,
  Animated,
  Platform,
  Easing,
  GestureResponderEvent,
  PanResponder,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { usePlayer, Track } from '@/context/PlayerContext';

// Get screen dimensions for responsive layout
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Interface for video reels
interface VideoReel extends Track {
  description?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  tags?: string[];
}

export default function ReelsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { setCurrentTrack, setIsPlaying } = usePlayer();
  
  // Ref for FlatList to control scrolling
  const flatListRef = useRef<FlatList>(null);
  
  // Current visible video index
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  
  // Animation value for like button
  const likeAnimation = useRef(new Animated.Value(1)).current;
  
  // Animation for spinning music disc
  const discSpinValue = useRef(new Animated.Value(0)).current;
  
  // Start spinning animation when a new video becomes active
  useEffect(() => {
    if (activeVideoIndex >= 0) {
      // Reset and start spinning animation
      Animated.loop(
        Animated.timing(discSpinValue, {
          toValue: 1,
          duration: 3000, // 3 seconds per rotation
          useNativeDriver: true,
          easing: Easing.linear,
        })
      ).start();
    }
  }, [activeVideoIndex]);
  
  // Interpolate for rotation
  const spin = discSpinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  // Progress bar state
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // Progress bar interaction with PanResponder
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [initialTouchX, setInitialTouchX] = useState(0);
  const [progressBarWidth, setProgressBarWidth] = useState(SCREEN_WIDTH - 40);
  
  // Reference to measure the progress bar width
  const progressBarRef = useRef<View | null>(null);
  
  // Measure progress bar width on layout
  const onProgressBarLayout = () => {
    if (progressBarRef.current) {
      progressBarRef.current.measure((_x: number, _y: number, width: number, _height: number, _pageX: number, _pageY: number) => {
        setProgressBarWidth(width);
      });
    }
  };
  
  // Calculate progress from touch position
  const calculateProgress = (touchX: number) => {
    // Get relative position within the progress bar
    const relativeX = Math.max(0, Math.min(progressBarWidth, touchX));
    return relativeX / progressBarWidth;
  };
  
  // Apply progress to video
  const applyProgressToVideo = (newProgress: number) => {
    const videoRef = videoRefs.current[reels[activeVideoIndex].id];
    if (videoRef) {
      videoRef.getStatusAsync().then((status: any) => {
        if (status.isLoaded && status.durationMillis) {
          const newPositionMillis = newProgress * status.durationMillis;
          videoRef.setPositionAsync(newPositionMillis);
        }
      });
    }
  };
  
  const progressPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        setIsDraggingProgress(true);
        setInitialTouchX(event.nativeEvent.locationX);
        
        // Pause video while dragging
        const videoRef = videoRefs.current[reels[activeVideoIndex].id];
        if (videoRef) {
          videoRef.pauseAsync();
        }
        
        // Set initial progress based on touch position
        const newProgress = calculateProgress(event.nativeEvent.locationX);
        setProgress(newProgress);
        progressAnim.setValue(newProgress);
      },
      onPanResponderMove: (event) => {
        const newProgress = calculateProgress(event.nativeEvent.locationX);
        
        // Update progress state and animation
        setProgress(newProgress);
        progressAnim.setValue(newProgress);
      },
      onPanResponderRelease: (event) => {
        const newProgress = calculateProgress(event.nativeEvent.locationX);
        
        // Apply progress to video
        applyProgressToVideo(newProgress);
        
        // Resume playback
        const videoRef = videoRefs.current[reels[activeVideoIndex].id];
        if (videoRef) {
          videoRef.playAsync();
        }
        
        setIsDraggingProgress(false);
      },
    })
  ).current;
  
  // Double tap to like
  const doubleTapRef = useRef<any>({
    lastTap: 0,
    timer: null,
  });
  
  // Heart animation for double tap
  const [showHeart, setShowHeart] = useState(false);
  const [heartPosition, setHeartPosition] = useState({ x: 0, y: 0 });
  const heartAnim = useRef(new Animated.Value(0)).current;
  
  const animateDoubleTapHeart = (x: number, y: number) => {
    // Set position and show heart
    setHeartPosition({ x, y });
    setShowHeart(true);
    heartAnim.setValue(0);
    
    // Animate heart
    Animated.sequence([
      Animated.timing(heartAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(500),
      Animated.timing(heartAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowHeart(false);
    });
  };
  
  const handleDoubleTap = (index: number, event: GestureResponderEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    const { locationX, locationY } = event.nativeEvent;
    
    if (doubleTapRef.current.lastTap && (now - doubleTapRef.current.lastTap) < DOUBLE_TAP_DELAY) {
      // Double tap detected
      clearTimeout(doubleTapRef.current.timer);
      doubleTapRef.current.lastTap = 0;
      
      // Trigger like animation
      animateLike(index);
      
      // Show heart animation at tap position
      animateDoubleTapHeart(locationX, locationY);
    } else {
      // First tap
      doubleTapRef.current.lastTap = now;
      doubleTapRef.current.timer = setTimeout(() => {
        // Single tap actions (toggle play/pause)
        const videoRef = videoRefs.current[reels[index].id];
        if (videoRef) {
          videoRef.getStatusAsync().then((status: any) => {
            if (status.isPlaying) {
              videoRef.pauseAsync();
            } else {
              videoRef.playAsync();
            }
          });
        }
        
        doubleTapRef.current.lastTap = 0;
      }, DOUBLE_TAP_DELAY);
    }
  };
  
  // Sample video reels data
  const [reels, setReels] = useState<VideoReel[]>([
    {
      id: 'reel1',
      title: 'Believe',
      artist: 'Justin Bieber',
      artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
      duration: 180,
      mediaSource: require('@/assets/audio/Believe.mp4'),
      coverColor: '#3A1078',
      secondaryColor: '#4E31AA',
      isVideo: true,
      description: 'Latest hit from Justin Bieber! #music #pop',
      likes: 45200,
      comments: 1250,
      shares: 3800,
      tags: ['pop', 'justin', 'trending'],
    },
    {
      id: 'reel2',
      title: 'Everything Going to Be Alright',
      artist: 'Bob Marley',
      artwork: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop',
      duration: 210,
      mediaSource: require('@/assets/audio/Everything going to be alright .mp4'),
      coverColor: '#D21312',
      secondaryColor: '#F15A59',
      isVideo: true,
      description: 'Classic reggae vibes to lift your spirits! #reggae #bobmarley',
      likes: 78500,
      comments: 2340,
      shares: 5670,
      tags: ['reggae', 'classic', 'goodvibes'],
    },
    {
      id: 'reel3',
      title: 'Sample Music',
      artist: 'Aria Artist',
      artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
      duration: 160,
      mediaSource: require('@/assets/audio/sample.mp4'),
      coverColor: '#2D4356',
      secondaryColor: '#435B66',
      isVideo: true,
      description: 'Check out this amazing beat! #newmusic #aria',
      likes: 12300,
      comments: 450,
      shares: 980,
      tags: ['newmusic', 'beat', 'aria'],
    },
  ]);

  // Reference to video components
  const videoRefs = useRef<{ [key: string]: Video | null }>({});

  // Handle viewability change to play/pause videos
  const onViewableItemsChanged = useRef(({ viewableItems, changed }: any) => {
    if (viewableItems.length > 0) {
      const visibleIndex = viewableItems[0].index;
      setActiveVideoIndex(visibleIndex);
      
      // Pause all videos and play only the visible one
      Object.keys(videoRefs.current).forEach((key) => {
        const videoRef = videoRefs.current[key];
        if (videoRef) {
          if (key === reels[visibleIndex].id) {
            videoRef.playAsync();
          } else {
            videoRef.pauseAsync();
          }
        }
      });
    }
  }).current;

  // Viewability config
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  // Format numbers for display (e.g., 1.2K, 3.4M)
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Format time in mm:ss format
  const formatTime = (milliseconds: number) => {
    if (!milliseconds) return "0:00";
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Track video duration and position for the current video
  const [currentVideoDuration, setCurrentVideoDuration] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  
  // Update current position when progress changes
  useEffect(() => {
    if (currentVideoDuration > 0) {
      setCurrentPosition(progress * currentVideoDuration);
    }
  }, [progress, currentVideoDuration]);

  // Handle like animation
  const animateLike = (index: number) => {
    // Update likes count
    const updatedReels = [...reels];
    updatedReels[index].likes = (updatedReels[index].likes || 0) + 1;
    setReels(updatedReels);
    
    // Animate the like button
    Animated.sequence([
      Animated.timing(likeAnimation, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Handle adding current video to player
  const addToPlayer = (reel: VideoReel) => {
    const playerTrack: Track = {
      id: reel.id,
      title: reel.title,
      artist: reel.artist,
      artwork: reel.artwork,
      duration: reel.duration,
      mediaSource: reel.mediaSource,
      coverColor: reel.coverColor,
      secondaryColor: reel.secondaryColor,
      isVideo: true,
    };
    
    setCurrentTrack(playerTrack);
    setIsPlaying(true);
    
    // Navigate to player
    router.navigate({
      pathname: '/(tabs)/player',
      params: {
        source: 'reels',
      }
    });
  };

  // Handle video playback status updates
  const onPlaybackStatusUpdate = (status: any, index: number) => {
    if (status.isLoaded && index === activeVideoIndex) {
      if (status.durationMillis && status.durationMillis !== currentVideoDuration) {
        setCurrentVideoDuration(status.durationMillis);
      }
      if (!isDraggingProgress) {
        setProgress(status.positionMillis / status.durationMillis);
        setCurrentPosition(status.positionMillis);
      }
    }
  };

  // Right side action buttons
  const actionButtons = (item: VideoReel, index: number) => (
    <View style={styles.actionButtons}>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => animateLike(index)}
      >
        <Animated.View style={{ transform: [{ scale: index === activeVideoIndex ? likeAnimation : 1 }] }}>
          <MaterialCommunityIcons name="heart" size={40} color="#FF5757" />
        </Animated.View>
        <ThemedText style={styles.actionText}>{formatNumber(item.likes || 0)}</ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton}>
        <MaterialCommunityIcons name="comment-text-outline" size={40} color="#FFFFFF" />
        <ThemedText style={styles.actionText}>{formatNumber(item.comments || 0)}</ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton}>
        <MaterialCommunityIcons name="share" size={40} color="#FFFFFF" />
        <ThemedText style={styles.actionText}>{formatNumber(item.shares || 0)}</ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, styles.musicDisc]}
        onPress={() => addToPlayer(item)}
      >
        <Animated.View 
          style={{
            transform: [{ rotate: spin }]
          }}
        >
          <Image 
            source={{ uri: item.artwork }}
            style={styles.musicDiscImage}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );

  // Bottom info section
  const infoSection = (item: VideoReel) => (
    <View style={styles.infoContainer}>
      {/* Album art and song info */}
      <View style={styles.songMainInfoContainer}>
        <View style={styles.albumArtContainer}>
          <Image 
            source={{ uri: item.artwork }} 
            style={styles.albumArt}
          />
        </View>
        <View style={styles.songDetailsContainer}>
          <ThemedText style={styles.songName} numberOfLines={1}>{item.title}</ThemedText>
          <Text style={styles.artistName} numberOfLines={1}>{item.artist}</Text>
        </View>
      </View>
      
      {/* Enhanced progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressTimeContainer}>
          <Text style={styles.progressTime}>{formatTime(currentPosition)}</Text>
          <Text style={styles.progressTime}>{formatTime(currentVideoDuration)}</Text>
        </View>
        <Slider
          style={styles.progressSlider}
          value={progress}
          onValueChange={(value) => {
            setProgress(value);
            progressAnim.setValue(value);
          }}
          onSlidingStart={() => {
            setIsDraggingProgress(true);
            const videoRef = videoRefs.current[reels[activeVideoIndex].id];
            if (videoRef) {
              videoRef.pauseAsync();
            }
          }}
          onSlidingComplete={(value) => {
            const videoRef = videoRefs.current[reels[activeVideoIndex].id];
            if (videoRef) {
              videoRef.getStatusAsync().then((status: any) => {
                if (status.isLoaded && status.durationMillis) {
                  const newPositionMillis = value * status.durationMillis;
                  videoRef.setPositionAsync(newPositionMillis);
                  videoRef.playAsync();
                }
              });
            }
            setIsDraggingProgress(false);
          }}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#FF5757"
          maximumTrackTintColor="rgba(255, 255, 255, 0.15)"
        />
      </View>
    </View>
  );

  // Render each video reel item
  const renderReelItem = ({ item, index }: { item: VideoReel; index: number }) => {
    return (
      <View style={styles.reelContainer}>
        {/* Video Player */}
        <TouchableOpacity 
          style={styles.videoContainer}
          activeOpacity={1}
          onPress={(event) => handleDoubleTap(index, event)}
        >
          <Video
            ref={(ref) => { videoRefs.current[item.id] = ref; }}
            source={item.mediaSource}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay={index === activeVideoIndex}
            isMuted={false}
            onPlaybackStatusUpdate={(status) => onPlaybackStatusUpdate(status, index)}
          />
          
          {/* Gradient overlay for text visibility */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
            pointerEvents="none"
          />
          
          {/* Heart animation */}
          {showHeart && (
            <Animated.View 
              style={{
                position: 'absolute',
                left: heartPosition.x,
                top: heartPosition.y,
                transform: [{ scale: heartAnim }],
              }}
            >
              <MaterialCommunityIcons name="heart" size={40} color="#FF5757" />
            </Animated.View>
          )}
        </TouchableOpacity>
        
        {/* Action buttons and info section */}
        {actionButtons(item, index)}
        {infoSection(item)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        ref={flatListRef}
        data={reels}
        renderItem={renderReelItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reelContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT / 2,
    zIndex: 1,
  },
  actionButtons: {
    position: 'absolute',
    right: 10,
    bottom: 150,
    zIndex: 2,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 5,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 80,
    left: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  songMainInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  albumArtContainer: {
    height: 50,
    width: 50,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  albumArt: {
    height: '100%',
    width: '100%',
  },
  songDetailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  songName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  artistName: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  progressBarContainer: {
    marginVertical: 4,
    paddingHorizontal: 2,
  },
  progressTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  progressTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
  progressSlider: {
    width: '100%',
    height: 24,
    marginTop: -10,
  },
  progressTrack: {
    height: 3,
    borderRadius: 1.5,
  },
  progressThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF5757',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tag: {
    marginRight: 10,
    marginBottom: 5,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  musicDisc: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  musicDiscImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
