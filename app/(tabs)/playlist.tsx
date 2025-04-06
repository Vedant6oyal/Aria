import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ScrollView, TextInput, StatusBar, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { usePlayer, sampleTracks, Track } from '@/context/PlayerContext';

// Get screen dimensions for responsive layout
import { Dimensions } from 'react-native';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Define icon types to avoid TypeScript errors
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface PlaylistItem {
  id: string;
  title: string;
  artist: string;
  duration?: number;
  artwork?: string;
  mediaSource?: any;
}

export default function PlaylistScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, title, color, icon } = params;
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { setCurrentTrack, setIsPlaying, navigateToPlayer } = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');
  
  // For this demo, we'll just use the sample tracks
  // In a real app, you would fetch the playlist tracks based on the ID
  const [playlistTracks, setPlaylistTracks] = useState<PlaylistItem[]>([
    {
      id: '1',
      title: 'Easy',
      artist: 'Troye Sivan',
      duration: 180,
      mediaSource: require('@/assets/audio/sample.mp4'),
    },
    {
      id: '2',
      title: 'chance with you',
      artist: 'mehro',
      duration: 210,
      mediaSource: require('@/assets/audio/Believe.mp4'),
    },
    {
      id: '3',
      title: 'Nirvana',
      artist: 'Sam Smith',
      duration: 195,
      mediaSource: require('@/assets/audio/Believe.mp4'),

    }
  ]);
  
  const playTrack = (track: PlaylistItem) => {
    // Convert to Track format
    const fullTrack: Track = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      artwork: track.artwork || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
      duration: track.duration,
      mediaSource: track.mediaSource || require('@/assets/audio/sample.mp4'),
      isVideo: true,
      coverColor: color as string || '#FF7B54',
      secondaryColor: '#8E92EF',
    };
    
    // Set the track in the player context
    setCurrentTrack(fullTrack);
    setIsPlaying(true);
    
    // Use a different navigation approach to ensure back button works
    router.navigate({
      pathname: '/(tabs)/player',
      params: {
        source: 'playlist',
        playlistId: id as string,
        playlistTitle: title as string
      }
    });
  };
  
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const renderTrackItem = ({ item, index }: { item: PlaylistItem; index: number }) => (
    <TouchableOpacity 
      style={styles.trackItem}
      onPress={() => playTrack(item)}
    >
      <View style={styles.trackNumberContainer}>
        <ThemedText style={styles.trackNumber}>{index + 1}</ThemedText>
      </View>
      <View style={styles.trackInfo}>
        <ThemedText style={styles.trackTitle} numberOfLines={1}>{item.title}</ThemedText>
        <ThemedText style={styles.trackArtist} numberOfLines={1}>{item.artist}</ThemedText>
      </View>
      <View style={styles.trackDuration}>
        <ThemedText style={styles.durationText}>{formatDuration(item.duration)}</ThemedText>
        <TouchableOpacity style={styles.moreButton}>
          <MaterialCommunityIcons name="dots-vertical" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView style={styles.scrollView} stickyHeaderIndices={[1]}>
        {/* Header with playlist info */}
        <LinearGradient
          colors={[color as string || '#FF7B54', colors.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.playlistImageContainer}>
            <LinearGradient
              colors={[color as string || '#FF7B54', shadeColor(color as string || '#FF7B54', -20)]}
              style={styles.playlistImage}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialCommunityIcons 
                name={(icon as string || 'music') as IconName} 
                size={80} 
                color="#FFFFFF" 
              />
            </LinearGradient>
          </View>
          
          <View style={styles.playlistInfo}>
            <ThemedText style={styles.playlistTitle}>{title || 'Indie Pop'}</ThemedText>
            <ThemedText style={styles.playlistDescription}>
              New and approved indie pop. Cover: No Rome
            </ThemedText>
            <View style={styles.playlistMeta}>
              <Image 
                source={{ uri: 'https://i.scdn.co/image/ab67757000003b8255c25988a6ac314394d3fbf5' }} 
                style={styles.spotifyLogo} 
              />
              <ThemedText style={styles.playlistMetaText}>Spotify</ThemedText>
              <ThemedText style={styles.playlistMetaText}>•</ThemedText>
              <ThemedText style={styles.playlistMetaText}>1,629,592 likes</ThemedText>
              <ThemedText style={styles.playlistMetaText}>•</ThemedText>
              <ThemedText style={styles.playlistMetaText}>6h 48m</ThemedText>
            </View>
          </View>
          
          <View style={styles.playlistControls}>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="heart-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="arrow-down-circle-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="dots-vertical" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={() => playTrack(playlistTracks[0])}
            >
              <LinearGradient
                colors={['#1DB954', '#1AA34A']}
                style={styles.playButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="play" size={32} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        
        {/* Search bar (sticky) */}
        <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" size={20} color={colors.text} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Find in playlist"
              placeholderTextColor={colors.text}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.sortButton}>
            <ThemedText style={styles.sortText}>Sort</ThemedText>
          </TouchableOpacity>
        </View>
        
        {/* Tracks list */}
        <View style={styles.tracksContainer}>
          <FlatList
            data={playlistTracks}
            keyExtractor={(item) => item.id}
            renderItem={renderTrackItem}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
      
      {/* Now playing bar would be rendered by MiniPlayer component */}
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    marginBottom: 20,
  },
  playlistImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  playlistImage: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_WIDTH * 0.5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  playlistInfo: {
    marginBottom: 20,
  },
  playlistTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  playlistDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  playlistMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spotifyLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  playlistMetaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginRight: 8,
  },
  playlistControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  iconButton: {
    marginRight: 20,
  },
  playButton: {
    marginLeft: 'auto',
  },
  playButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 40,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  sortText: {
    fontSize: 16,
    fontWeight: '500',
  },
  tracksContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 100, // Extra space at bottom for mini player
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  trackNumberContainer: {
    width: 30,
    alignItems: 'center',
  },
  trackNumber: {
    fontSize: 16,
    opacity: 0.7,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 10,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    opacity: 0.7,
  },
  trackDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  durationText: {
    fontSize: 14,
    opacity: 0.7,
    marginRight: 10,
  },
  moreButton: {
    padding: 5,
  },
});
