import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, StatusBar, Platform, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Define icon types to avoid TypeScript errors
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

// Define types for the song data
interface SongItem {
  id: string;
  title: string;
  artist: string;
  plays: number;
  likes: number;
  comments: number;
  version: string | null;
  color: string;
}

// Mock data for liked songs
const likedSongs: SongItem[] = [
  { 
    id: '1', 
    title: 'Affirmation', 
    artist: 'Affirmation', 
    plays: 3, 
    likes: 1, 
    comments: 0,
    version: null,
    color: '#FF7B54',
  },
  { 
    id: '2', 
    title: 'Thank you', 
    artist: '', 
    plays: 14, 
    likes: 1, 
    comments: 0,
    version: 'v4',
    color: '#FFB6C1',
  },
  { 
    id: '3', 
    title: 'You Are Light', 
    artist: '', 
    plays: 5, 
    likes: 1, 
    comments: 0,
    version: null,
    color: '#8E92EF',
  },
  { 
    id: '4', 
    title: 'Whispers Of The Universe', 
    artist: '', 
    plays: 4, 
    likes: 1, 
    comments: 0,
    version: null,
    color: '#00CCB4',
  },
  { 
    id: '5', 
    title: 'Untitled', 
    artist: 'folk-pop, soft rock', 
    plays: 7, 
    likes: 1, 
    comments: 0,
    version: null,
    color: '#FFA07A',
  },
  { 
    id: '6', 
    title: 'Everything going to be alright', 
    artist: '', 
    plays: 3, 
    likes: 1, 
    comments: 0,
    version: 'v4',
    color: '#36D97F',
  },
  { 
    id: '7', 
    title: 'Everything going to be alright', 
    artist: '', 
    plays: 3, 
    likes: 1, 
    comments: 0,
    version: 'v4',
    color: '#87CEEB',
  },
  { 
    id: '8', 
    title: 'Thank you goddd', 
    artist: '', 
    plays: 2, 
    likes: 1, 
    comments: 0,
    version: 'v4',
    color: '#FFD700',
  },
];

export default function LibraryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const scrollY = useRef(new Animated.Value(0)).current;
  const [scrollOffset, setScrollOffset] = useState(0);
  
  // Animation values for header
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });
  
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });
  
  const subHeaderOpacity = scrollY.interpolate({
    inputRange: [0, 40, 70],
    outputRange: [1, 0.7, 0],
    extrapolate: 'clamp',
  });

  // Helper function to darken or lighten a color
  const shadeColor = (color: string, percent: number) => {
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
  };

  const renderSongItem = ({ item, index }: { item: SongItem, index: number }) => {
    // Calculate a slight delay for each item to create a staggered animation effect
    const animationDelay = index * 100;
    
    return (
      <Animated.View
        style={{
          opacity: 1,
          transform: [{ 
            translateY: 0
          }]
        }}
      >
        <TouchableOpacity 
          style={styles.songItem}
          onPress={() => router.push('/player')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[item.color, shadeColor(item.color, -20)]}
            style={styles.songArtwork}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialCommunityIcons name="music" size={20} color="#FFFFFF" />
          </LinearGradient>
          
          <View style={styles.songInfo}>
            <View>
              <ThemedText style={styles.songTitle}>
                {item.title}
                {item.version && (
                  <View style={styles.versionBadge}>
                    <ThemedText style={styles.versionText}>{item.version}</ThemedText>
                  </View>
                )}
              </ThemedText>
              {item.artist ? (
                <ThemedText style={styles.songArtist}>{item.artist}</ThemedText>
              ) : null}
            </View>
            
            <View style={styles.songStats}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="play" size={14} color={colors.text} style={styles.statIcon} />
                <ThemedText style={styles.statText}>{item.plays}</ThemedText>
              </View>
              
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="thumb-up" size={14} color={colors.text} style={styles.statIcon} />
                <ThemedText style={styles.statText}>{item.likes}</ThemedText>
              </View>
              
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="comment" size={14} color={colors.text} style={styles.statIcon} />
                <ThemedText style={styles.statText}>{item.comments}</ThemedText>
              </View>
              
              <MaterialCommunityIcons name="web" size={14} color={colors.text} style={styles.webIcon} />
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.likeButton}>
              <MaterialCommunityIcons 
                name="thumb-up" 
                size={22} 
                color={colors.tint} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuButton}>
              <MaterialCommunityIcons name="dots-vertical" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Render header component
  const renderHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <ThemedText style={styles.statCount}>42</ThemedText>
          <ThemedText style={styles.statLabel}>Songs</ThemedText>
        </View>
        <View style={styles.statBox}>
          <ThemedText style={styles.statCount}>18</ThemedText>
          <ThemedText style={styles.statLabel}>Artists</ThemedText>
        </View>
        <View style={styles.statBox}>
          <ThemedText style={styles.statCount}>3.2</ThemedText>
          <ThemedText style={styles.statLabel}>Hours</ThemedText>
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialCommunityIcons name="sort" size={16} color={colors.text} />
          <ThemedText style={styles.filterText}>Recent</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterButton}>
          <MaterialCommunityIcons name="filter-variant" size={16} color={colors.text} />
          <ThemedText style={styles.filterText}>Filter</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Handle scroll event without using native driver
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollOffset(offsetY);
    scrollY.setValue(offsetY);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }]
          }
        ]}
      >
        <LinearGradient
          colors={[colors.tint, shadeColor(colors.tint, -20)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <MaterialCommunityIcons 
              name="music-box-multiple" 
              size={28} 
              color="#FFFFFF" 
              style={styles.headerIcon} 
            />
            <ThemedText style={styles.mainHeaderTitle}>Your Library</ThemedText>
            <Animated.View style={{ opacity: subHeaderOpacity }}>
              <ThemedText style={styles.subHeaderTitle}>Liked Songs</ThemedText>
            </Animated.View>
          </View>
        </LinearGradient>
      </Animated.View>
      
      <FlatList
        data={likedSongs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
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
    height: Platform.OS === 'ios' ? 140 : 120,
  },
  headerGradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerIcon: {
    marginBottom: 8,
  },
  mainHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subHeaderTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  listContent: {
    paddingTop: Platform.OS === 'ios' ? 140 : 120,
    paddingBottom: 100, // Extra space for the tab bar and mini player
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 10,
  },
  statBox: {
    alignItems: 'center',
  },
  statCount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  filterText: {
    fontSize: 14,
    marginLeft: 6,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  songArtwork: {
    width: 44,
    height: 44,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionBadge: {
    backgroundColor: '#FFD93D', // Use the warning color from common
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  songArtist: {
    fontSize: 14,
    opacity: 0.7,
  },
  songStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statIcon: {
    marginRight: 4,
    opacity: 0.7,
  },
  statText: {
    fontSize: 12,
    opacity: 0.7,
  },
  webIcon: {
    opacity: 0.7,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
  },
});
