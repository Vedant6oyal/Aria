import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, FlatList, StatusBar, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { usePlayer, Track } from '@/context/PlayerContext';

// Get screen dimensions for responsive layout
import { Dimensions } from 'react-native';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Define icon types to avoid TypeScript errors
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface ForYouTrack extends Track {
  genre?: string;
  mood?: string;
  reason?: string;
}

export default function ForYouScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { setCurrentTrack, setIsPlaying } = usePlayer();
  const [scrollY] = useState(new Animated.Value(0));
  
  // Curated tracks for the user
  const [forYouTracks, setForYouTracks] = useState<ForYouTrack[]>([
    {
      id: '101',
      title: 'Midnight City',
      artist: 'M83',
      artwork: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop',
      duration: 245,
      genre: 'Electronic',
      mood: 'Energetic',
      reason: 'Based on your recent listening',
      mediaSource: require('@/assets/audio/sample.mp4'),
      coverColor: '#3A1078',
      secondaryColor: '#4E31AA',
      isVideo: false,
    },
    {
      id: '102',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      artwork: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=2074&auto=format&fit=crop',
      duration: 203,
      genre: 'Pop',
      mood: 'Upbeat',
      reason: 'Trending now',
      mediaSource: require('@/assets/audio/sample.mp4'),
      coverColor: '#D21312',
      secondaryColor: '#F15A59',
      isVideo: false,
    },
    {
      id: '103',
      title: 'Dreams',
      artist: 'Fleetwood Mac',
      artwork: 'https://images.unsplash.com/photo-1581281567516-32073c54d2a9?q=80&w=2071&auto=format&fit=crop',
      duration: 254,
      genre: 'Classic Rock',
      mood: 'Mellow',
      reason: 'Recommended for you',
      mediaSource: require('@/assets/audio/sample.mp4'),
      coverColor: '#2D4356',
      secondaryColor: '#435B66',
      isVideo: false,
    },
    {
      id: '104',
      title: 'Redbone',
      artist: 'Childish Gambino',
      artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop',
      duration: 326,
      genre: 'R&B',
      mood: 'Smooth',
      reason: 'Because you liked similar artists',
      mediaSource: require('@/assets/audio/sample.mp4'),
      coverColor: '#A25B5B',
      secondaryColor: '#CC9C75',
      isVideo: false,
    },
    {
      id: '105',
      title: 'Starboy',
      artist: 'The Weeknd, Daft Punk',
      artwork: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?q=80&w=2071&auto=format&fit=crop',
      duration: 230,
      genre: 'Pop',
      mood: 'Confident',
      reason: 'From your favorites',
      mediaSource: require('@/assets/audio/sample.mp4'),
      coverColor: '#2B2730',
      secondaryColor: '#6554AF',
      isVideo: false,
    },
    {
      id: '106',
      title: 'Levitating',
      artist: 'Dua Lipa',
      artwork: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop',
      duration: 203,
      genre: 'Pop',
      mood: 'Danceable',
      reason: 'New release from artist you follow',
      mediaSource: require('@/assets/audio/sample.mp4'),
      coverColor: '#9376E0',
      secondaryColor: '#E893CF',
      isVideo: false,
    },
    {
      id: '107',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      artwork: 'https://images.unsplash.com/photo-1461784180009-27c1303a64c8?q=80&w=2070&auto=format&fit=crop',
      duration: 354,
      genre: 'Rock',
      mood: 'Epic',
      reason: 'All-time classic',
      mediaSource: require('@/assets/audio/sample.mp4'),
      coverColor: '#3C486B',
      secondaryColor: '#F45050',
      isVideo: false,
    },
  ]);
  
  const playTrack = (track: ForYouTrack) => {
    // Convert to Track format - using the exact same approach as playlist screen
    const playerTrack: Track = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      artwork: track.artwork || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
      duration: track.duration,
      mediaSource: require('@/assets/audio/Believe.mp4'), // Use Believe.mp4 which works in playlist
      isVideo: true, // Critical: must be true for playback to work
      coverColor: track.coverColor || '#FF7B54',
      secondaryColor: track.secondaryColor || '#8E92EF',
    };
    
    console.log("Playing track from For You:", playerTrack.title);
    
    // Set the track in the player context
    setCurrentTrack(playerTrack);
    setIsPlaying(true);
    
    // Navigate to player
    router.navigate({
      pathname: '/(tabs)/player',
      params: {
        source: 'foryou',
      }
    });
  };
  
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Header animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [120, 0], // Completely collapse the header
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 40, 60],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -10],
    extrapolate: 'clamp',
  });
  
  const renderTrackItem = ({ item, index }: { item: ForYouTrack; index: number }) => (
    <TouchableOpacity 
      style={styles.trackItem}
      onPress={() => playTrack(item)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.artwork }} 
        style={styles.trackArtwork}
        resizeMode="cover"
      />
      <LinearGradient
        colors={[shadeColor(item.coverColor || '#000000', -30), item.coverColor || '#000000']}
        style={styles.trackGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.trackInfo}>
          <ThemedText style={styles.trackTitle} numberOfLines={1}>{item.title}</ThemedText>
          <ThemedText style={styles.trackArtist} numberOfLines={1}>{item.artist}</ThemedText>
          
          <View style={styles.trackMetaContainer}>
            <View style={styles.trackMeta}>
              <MaterialCommunityIcons name="music-note" size={14} color="#FFFFFF" style={styles.metaIcon} />
              <ThemedText style={styles.metaText}>{item.genre}</ThemedText>
            </View>
            <View style={styles.trackMeta}>
              <MaterialCommunityIcons name="clock-outline" size={14} color="#FFFFFF" style={styles.metaIcon} />
              <ThemedText style={styles.metaText}>{formatDuration(item.duration)}</ThemedText>
            </View>
          </View>
          
          <View style={styles.reasonContainer}>
            <ThemedText style={styles.reasonText}>{item.reason}</ThemedText>
          </View>
        </View>
        
        <TouchableOpacity style={styles.playButton} onPress={() => playTrack(item)}>
          <LinearGradient
            colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
            style={styles.playButtonGradient}
          >
            <MaterialCommunityIcons name="play" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  // Add a handler for the Gratitude Quiz button
  const handleGratitudeQuiz = () => {
    console.log('Opening Gratitude Quiz');
    // Future implementation: Navigate to gratitude quiz screen
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated Header - Only visible when content is at the top */}
      <Animated.View 
        style={[
          styles.header, 
          { 
            height: headerHeight,
            opacity: headerOpacity // Make the entire header fade out on scroll
          }
        ]}
      >
        <LinearGradient
          colors={['#3A1078', '#4E31AA']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View 
            style={[
              styles.headerContent, 
              { 
                opacity: headerOpacity,
                transform: [{ scale: titleScale }, { translateY: titleTranslateY }]
              }
            ]}
          >
            <MaterialCommunityIcons name="playlist-music" size={40} color="#FFFFFF" style={styles.headerIcon} />
            <ThemedText style={styles.headerSubtitle}>CURATED FOR YOU</ThemedText>
          </Animated.View>
        </LinearGradient>
      </Animated.View>
      
      {/* Gratitude Quiz Button */}
      <TouchableOpacity 
        style={styles.gratitudeButton}
        onPress={handleGratitudeQuiz}
      >
        <LinearGradient
          colors={['#2A2A2A', '#1A1A1A']}
          style={styles.gratitudeButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ThemedText style={styles.gratitudeButtonText}>Gratitude Quiz</ThemedText>
        </LinearGradient>
      </TouchableOpacity>
      
       {/* Track List */}
      <FlatList
        data={forYouTracks}
        renderItem={renderTrackItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
}

// Helper function to darken or lighten a color
function shadeColor(color: string, percent: number) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.floor(R * (100 + percent) / 100);
  G = Math.floor(G * (100 + percent) / 100);
  B = Math.floor(B * (100 + percent) / 100);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  R = (R > 0) ? R : 0;
  G = (G > 0) ? G : 0;
  B = (B > 0) ? B : 0;

  const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
  const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
  const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

  return "#" + RR + GG + BB;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerIcon: {
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 2,
    textAlign: 'center',
  },
  gratitudeButton: {
    position: 'relative',
    top: 125,
    left: 16,
    elevation: 5,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderRadius: 20,
    overflow: 'hidden',
    width: 130,
  },
  gratitudeButtonGradient: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  gratitudeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingTop: 130, // Increased padding to prevent overlap with header
    paddingBottom: 120, // Extra space at bottom for tab bar and mini player
    paddingHorizontal: 16,
  },
  trackItem: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    height: 180,
  },
  trackArtwork: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  trackGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  trackInfo: {
    flex: 1,
    marginRight: 16,
  },
  trackTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  trackArtist: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  trackMetaContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  trackMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  reasonContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  reasonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  playButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
});
