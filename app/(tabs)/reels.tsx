import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
  ScrollView,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { usePlayer, Track } from '@/context/PlayerContext';
import { useReelsPlayer, sampleReels, Reel as ReelType } from '@/components/ReelsPlayerContext';

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

// Define tab types
type ReelsTab = 'ForYou' | 'Library';

// Converter function to map from ReelsPlayerContext Reel type to VideoReel type used in this component
const convertReelsToVideoReels = (reels: ReelType[]): VideoReel[] => {
  return reels.map(reel => ({
    id: reel.id,
    title: reel.title,
    artist: reel.creator,
    artwork: reel.thumbnailUrl,
    duration: reel.duration,
    mediaSource: reel.videoUrl,
    coverColor: ['#3A1078', '#D21312', '#2D4356'][Math.floor(Math.random() * 3)],
    secondaryColor: ['#4E31AA', '#F15A59', '#435B66'][Math.floor(Math.random() * 3)],
    isVideo: true,
    description: `${reel.title} by ${reel.creator}`,
    likes: reel.likes,
    comments: reel.comments,
    shares: reel.shares,
    tags: ['music', 'trending'],
  }));
};

export default function ReelsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setCurrentTrack, setIsPlaying } = usePlayer();
  
  // Get URL parameters from navigation
  const params = useLocalSearchParams();
  const { activeTab: tabParam, songId, songTitle, songArtist, songColor } = params;

  // Add state for current tab with initial value from params if available
  const [activeTab, setActiveTab] = useState<ReelsTab>(
    tabParam === 'Library' ? 'Library' : 'ForYou'
  );

  // Reference to track if we've already processed the URL params
  const hasProcessedParams = useRef(false);

  // Use our ReelsPlayerContext
  const { 
    currentReel, 
    setCurrentReel, 
    isPlaying: isReelPlaying, 
    setIsPlaying: setReelIsPlaying, 
    togglePlayPause: toggleReelPlayPause,
    playbackInstance,
    setPlaybackInstance
  } = useReelsPlayer();
  
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
  
  // Video ref objects to control multiple videos
  const videoRefs = useRef<{ [key: string]: Video }>({});
  
  // Create separate datasets for ForYou and Library tabs
  const forYouReels = useMemo(() => convertReelsToVideoReels(sampleReels), []);
  
  // Create library reels dataset
  const [libraryReels, setLibraryReels] = useState<VideoReel[]>([
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
  
  // Get reels based on active tab
  const reels = useMemo(() => {
    return activeTab === 'ForYou' ? forYouReels : libraryReels;
  }, [activeTab, forYouReels, libraryReels]);

  // Handle incoming song from Library screen
  useEffect(() => {
    if (songId && songTitle && !hasProcessedParams.current) {
      // Create a new reel from the selected song
      const newSongReel: VideoReel = {
        id: songId as string,
        title: songTitle as string,
        artist: songArtist as string || 'Unknown Artist',
        artwork: 'https://i.imgur.com/K3DvZbd.jpeg', // Default artwork
        duration: 60,
        mediaSource: require('@/assets/audio/sample.mp4'), // Use a sample media file
        coverColor: songColor as string || '#3A1078',
        secondaryColor: '#4E31AA',
        isVideo: true,
        description: `${songTitle} by ${songArtist || 'Unknown Artist'}`,
        likes: 0,
        comments: 0,
        shares: 0,
        tags: ['music', 'library'],
      };
      
      // Check if this song already exists in library reels
      const existingIndex = libraryReels.findIndex(reel => reel.id === songId);
      
      // If not in library, add it; otherwise move it to the top
      let updatedLibraryReels;
      if (existingIndex === -1) {
        updatedLibraryReels = [newSongReel, ...libraryReels];
      } else {
        updatedLibraryReels = [
          newSongReel,
          ...libraryReels.filter(reel => reel.id !== songId)
        ];
      }
      
      setLibraryReels(updatedLibraryReels);
      
      // Set active tab to Library
      setActiveTab('Library');
      
      // Reset to the first video (which is the selected song)
      setActiveVideoIndex(0);
      
      // Scroll to beginning
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToOffset({ offset: 0, animated: false });
        }
        
        // Auto-play the selected song
        if (videoRefs.current[newSongReel.id]) {
          videoRefs.current[newSongReel.id].playAsync();
          setReelIsPlaying(true);
        }
      }, 300);
      
      hasProcessedParams.current = true;
    }
  }, [songId, songTitle]);

  // Config for FlatList viewability
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  
  // State to track if we're transitioning between reels
  const [isChangingReel, setIsChangingReel] = useState(false);

  // Handle viewable items change in FlatList
  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      
      // Only update if the active index has changed
      if (activeVideoIndex !== newIndex) {
        console.log(`Changing active reel from index ${activeVideoIndex} to ${newIndex}`);
        
        // Set transition flag to prevent UI flickering
        setIsChangingReel(true);
        
        // First pause the current video if it exists
        if (activeVideoIndex !== -1 && reels[activeVideoIndex]) {
          const currentVideoRef = videoRefs.current[reels[activeVideoIndex].id];
          if (currentVideoRef) {
            try {
              currentVideoRef.pauseAsync().catch(err => {
                console.log('Error pausing previous video - ignoring:', err);
              });
            } catch (err) {
              console.log('Error accessing previous video ref - ignoring:', err);
            }
          }
        }
        
        // Update active index
        setActiveVideoIndex(newIndex);
        
        // Update current reel in context
        if (reels[newIndex]) {
          // Convert VideoReel to ReelType for the context
          const contextReel: ReelType = {
            id: reels[newIndex].id,
            title: reels[newIndex].title,
            creator: reels[newIndex].artist,
            thumbnailUrl: reels[newIndex].artwork,
            videoUrl: reels[newIndex]?.mediaSource ? 'video://local' : undefined,
          };
          
          // Update current reel in context and reset play state
          setCurrentReel(contextReel);
          setReelIsPlaying(true); // Auto-play when switching reels
          
          // Also update the local state to show playing icon immediately
          setIsCurrentVideoPlaying(true);
          
          // Set the active video ref in the ReelsPlayerContext if available
          const videoRef = videoRefs.current[reels[newIndex].id];
          if (videoRef) {
            setTimeout(() => {
              try {
                // Update playback instance in context
                setPlaybackInstance(videoRef);
                
                // Make sure the video starts playing
                videoRef.getStatusAsync().then(status => {
                  if (status.isLoaded) {
                    // Always play the new video
                    videoRef.playAsync().then(() => {
                      // End transition period after video starts playing
                      setTimeout(() => {
                        setIsChangingReel(false);
                      }, 500);
                    }).catch(err => {
                      console.log('Error playing new video - ignoring:', err);
                      setIsChangingReel(false);
                    });
                  } else {
                    setIsChangingReel(false);
                  }
                }).catch(err => {
                  console.log('Error getting video status when changing reel - ignoring:', err);
                  setIsChangingReel(false);
                });
              } catch (err: any) {
                console.log('Error setting new reel playback instance - ignoring:', err?.message || 'Unknown error');
                setIsChangingReel(false);
              }
            }, 200);
          } else {
            // If we couldn't find the video ref, end transition after a delay
            setTimeout(() => {
              setIsChangingReel(false);
            }, 700);
          }
        }
      }
    }
  }, [activeVideoIndex, reels, setCurrentReel, setPlaybackInstance, setReelIsPlaying]);

  // Sync playback state with ReelsPlayerContext
  useEffect(() => {
    if (currentReel && videoRefs.current) {
      const videoId = currentReel.id;
      const videoRef = videoRefs.current[videoId];
      
      if (videoRef) {
        try {
          videoRef.getStatusAsync().then(status => {
            if (status.isLoaded) {
              if (isReelPlaying && !status.isPlaying) {
                videoRef.playAsync().catch(err => 
                  console.log('Error playing video from context state change - ignoring:', err.message)
                );
              } else if (!isReelPlaying && status.isPlaying) {
                videoRef.pauseAsync().catch(err => 
                  console.log('Error pausing video from context state change - ignoring:', err.message)
                );
              }
            }
          }).catch(err => {
            console.log('Error getting video status - ignoring:', err.message);
          });
        } catch (err) {
          console.log('Unexpected error in playback sync - ignoring:', err);
        }
      }
    }
  }, [isReelPlaying, currentReel]);

  // Handle video playback status updates
  const onPlaybackStatusUpdate = (status: any, index: number) => {
    // Skip updates during reel transitions to prevent flickering
    if (isChangingReel) {
      return;
    }
    
    if (status.isLoaded && activeVideoIndex === index) {
      // Update local state - but only if triggered by the video itself, not by our toggle action
      const isCurrentlyPlaying = status.isPlaying;
      
      // We need to add a flag to prevent circular updates
      if (!isTogglingPlayback) {
        setIsCurrentVideoPlaying(isCurrentlyPlaying);
        
        // Only update context if state is different - avoid unnecessary updates
        if (currentReel && reels[index].id === currentReel.id && isCurrentlyPlaying !== isReelPlaying) {
          console.log(`Auto-syncing playback state from video: ${isCurrentlyPlaying}`);
          setReelIsPlaying(isCurrentlyPlaying);
        }
      }
      
      if (status.durationMillis > 0) {
        const newProgress = status.positionMillis / status.durationMillis;
        if (!isDraggingProgress) {
          setProgress(newProgress);
          progressAnim.setValue(newProgress);
        }
      }
    }
  };

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
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentVideoDuration, setCurrentVideoDuration] = useState(0);
  const [isCurrentVideoPlaying, setIsCurrentVideoPlaying] = useState(true);

  // Update current position when progress changes
  useEffect(() => {
    if (currentVideoDuration > 0) {
      setCurrentPosition(progress * currentVideoDuration);
    }
  }, [progress, currentVideoDuration]);

  // State to track if we're currently toggling playback to prevent circular updates
  const [isTogglingPlayback, setIsTogglingPlayback] = useState(false);

  // Toggle play/pause for the current video
  const togglePlayPause = async () => {
    console.log("Toggling play/pause on main reels screen");
    
    // Set flag to prevent circular updates
    setIsTogglingPlayback(true);
    
    // Make sure we're targeting the correct video based on active index
    if (activeVideoIndex >= 0 && activeVideoIndex < reels.length) {
      const currentReelId = reels[activeVideoIndex].id;
      console.log(`Toggling playback for reel ID: ${currentReelId} at index ${activeVideoIndex}`);
      
      const videoRef = videoRefs.current[currentReelId];
      if (videoRef) {
        try {
          const status = await videoRef.getStatusAsync();
          
          if (status.isLoaded) {
            if (status.isPlaying) {
              await videoRef.pauseAsync();
              setIsCurrentVideoPlaying(false);
              setReelIsPlaying(false); // Update context
            } else {
              await videoRef.playAsync();
              setIsCurrentVideoPlaying(true);
              setReelIsPlaying(true); // Update context
            }
          }
        } catch (error) {
          console.error('Error toggling play/pause:', error);
        }
      } else {
        console.log(`Video ref not found for reel ID: ${currentReelId}`);
      }
    } else {
      console.log(`Invalid activeVideoIndex: ${activeVideoIndex}`);
    }
    
    // Reset flag after a short delay to allow the video to update its status
    setTimeout(() => {
      setIsTogglingPlayback(false);
    }, 300);
  };

  // Handle like animation
  const animateLike = (index: number) => {
    // Update likes count (we don't update the array anymore since it's a constant)
    // For a real implementation, this would make an API call to update likes on the server
    console.log(`Liked video: ${reels[index].title}`);
    
    // Animate the like button
    Animated.sequence([
      Animated.timing(likeAnimation, {
        toValue: 1.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 1,
        duration: 200,
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
      {/* Song title, artist and play controls in one row */}
      <View style={styles.songMainInfoContainer}>
        <TouchableOpacity 
          style={styles.mainPlayPauseButton}
          onPress={togglePlayPause}
        >
          <MaterialCommunityIcons 
            name={isCurrentVideoPlaying ? "pause-circle" : "play-circle"} 
            size={36} 
            color="#FF5757" 
          />
        </TouchableOpacity>
        <View style={styles.songDetailsContainer}>
          <ThemedText style={styles.songName} numberOfLines={1}>{item.title}</ThemedText>
          <Text style={styles.artistName} numberOfLines={1}>{item.artist}</Text>
        </View>
        <View style={styles.albumArtContainer}>
          <Image 
            source={{ uri: item.artwork }} 
            style={styles.albumArt}
          />
        </View>
      </View>
      
      {/* Progress bar */}
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
                  setIsCurrentVideoPlaying(true);
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
            ref={(ref) => {
              if (ref) {
                videoRefs.current[item.id] = ref;
                
                // Only update context when this is the active video
                if (index === activeVideoIndex) {
                  setTimeout(() => {
                    try {
                      setPlaybackInstance(ref);
                    } catch (err: any) {
                      console.log('Error setting playback instance - ignoring:', err?.message || 'Unknown error');
                    }
                  }, 100);
                }
              }
            }}
            source={item.mediaSource}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            shouldPlay={index === activeVideoIndex}
            isLooping={true}
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

  // Tab selection handler
  const handleTabPress = (tab: ReelsTab) => {
    setActiveTab(tab);
  };

  // Tab indicator
  const renderTabIndicator = () => {
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'ForYou' && styles.activeTab
          ]}
          onPress={() => handleTabPress('ForYou')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'ForYou' && styles.activeTabText
            ]}
          >
            For You
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Library' && styles.activeTab
          ]}
          onPress={() => handleTabPress('Library')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Library' && styles.activeTabText
            ]}
          >
            Library
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Main reels content */}
      <FlatList
        ref={flatListRef}
        data={reels}
        renderItem={renderReelItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="start"
        decelerationRate="fast"
        initialScrollIndex={0}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
        contentContainerStyle={{ minHeight: '100%' }}
      />
      
      {/* Floating tab navigation bar at top */}
      <View style={[styles.floatingTabBar, { paddingTop: insets.top + 10 }]}>
        {renderTabIndicator()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  floatingTabBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
    paddingBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(40, 40, 40, 0.7)',
    borderRadius: 20,
    padding: 5,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 87, 87, 0.3)',
  },
  tabText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
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
    borderRadius: 16,
    padding: 12,
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
  },
  songMainInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  albumArtContainer: {
    height: 42,
    width: 42,
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: 12,
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
    fontSize: 15,
    marginBottom: 2,
  },
  artistName: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontWeight: '500',
  },
  mainPlayPauseButton: {
    padding: 5,
    marginRight: 8,
  },
  progressBarContainer: {
    marginVertical: 0,
    paddingHorizontal: 2,
  },
  progressTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  progressTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontWeight: '500',
  },
  progressSlider: {
    width: '100%',
    height: 24,
    marginTop: -8,
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
  playPauseButton: {
    padding: 5,
  },
});
