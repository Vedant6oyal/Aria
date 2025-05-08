import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, StatusBar, Platform, Animated, Image, Alert } from 'react-native';
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
export interface Song {
  id: string;
  title: string;
  creator: string;
  thumbnailUrl: string;
  videoUrl: any; // Assuming require returns a specific type or number
  duration: number;
  likes: number;
  comments: number;
  shares: number;
}

// Mock data for liked songs
export const likedSongs: Song[] = [
  {
    id: 'reel1',
    title: 'Believe',
    creator: 'Justin Bieber',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
    videoUrl: require('@/assets/audio/Believe.mp4'),
    duration: 180,
    likes: 45200,
    comments: 1250,
    shares: 3800,
  },
  {
    id: 'reel2',
    title: 'Intentions',
    creator: 'Justin Bieber',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop',
    videoUrl: require('@/assets/audio/Everything going to be alright .mp4'),
    duration: 210,
    likes: 68300,
    comments: 2100,
    shares: 5500,
  },
  {
    id: 'reel3',
    title: 'Umbrella',
    creator: 'Rihanna',
    thumbnailUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop',
    videoUrl: require('@/assets/audio/Believe.mp4'),
    duration: 245,
    likes: 95000,
    comments: 4200,
    shares: 8900,
  },
  {
    id: 'reel4',
    title: 'Sorry',
    creator: 'Justin Bieber',
    thumbnailUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?q=80&w=2072&auto=format&fit=crop',
    videoUrl: require('@/assets/audio/Everything going to be alright .mp4'),
    duration: 195,
    likes: 72100,
    comments: 3500,
    shares: 6800,
  },
  
  // Add more liked songs as needed
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

  const renderSongItem = ({ item }: { item: Song }) => (
    <TouchableOpacity style={styles.songItem} onPress={() => {
      // Navigate to reels with the library tab active and play this song
      router.push({
        pathname: '/reels',
        params: {
          // Explicitly pass all song details
          activeTab: 'Library',
          songId: item.id,
          songTitle: item.title,
          songCreator: item.creator,
          songThumbnail: item.thumbnailUrl,
          // Pass the video require result. Reels screen will need to handle this.
          // Note: Passing complex objects or require results directly can sometimes be tricky.
          // If issues arise, consider passing the asset path string instead.
          songVideo: item.videoUrl,
          songLikes: item.likes.toString(), // Pass numbers as strings
          songComments: item.comments.toString(),
          songShares: item.shares.toString(),
          songDuration: item.duration.toString(),
          // Add unique timestamp for navigation detection
          navTimestamp: Date.now().toString(), 
        }
      });
    }}>
      <Image source={{ uri: item.thumbnailUrl }} style={styles.songImage} />
      <View style={styles.songInfo}>
        <ThemedText style={styles.songTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.songArtist}>{item.creator}</ThemedText>
      </View>
      <View style={styles.actionButtonsContainer}>
        <View 
          style={styles.actionButton}
         
        >
          <MaterialCommunityIcons 
            name="play-circle-outline" 
            size={22} 
            color="rgb(136, 19, 55)" /* Darker icon color */
          />
        </View>
        <TouchableOpacity 
          style={styles.actionButton} // Use consistent styling
          onPress={(e) => {
            // Stop propagation to prevent navigating to the song
            e.stopPropagation();
            
            // Show options menu (existing logic)
            Alert.alert(
              `${item.title}`,
              `by ${item.creator}`,
              [
                {
                  text: 'Remove from Liked Songs',
                  onPress: () => console.log(`Remove ${item.title} from library`),
                  style: 'destructive'
                },
                {
                  text: 'Cancel',
                  style: 'cancel'
                }
              ]
            );
          }}>
          <MaterialCommunityIcons name="dots-horizontal" size={22} color="rgb(136, 19, 55)" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
          <MaterialCommunityIcons name="sort" size={16} color="rgb(225, 29, 72)" />
          <ThemedText style={styles.filterText}>Recent</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterButton}>
          <MaterialCommunityIcons name="filter-variant" size={16} color="rgb(225, 29, 72)" />
          <ThemedText style={styles.filterText}>Mood</ThemedText>
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
    <View style={[styles.container, { backgroundColor: 'rgb(255, 251, 235)' }]}>
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
        <View
          style={[
            styles.headerGradient,
            {
              backgroundColor: 'rgb(244, 63, 94)',
            }
          ]}
        >
          <View style={styles.headerContent}>
            <MaterialCommunityIcons 
              name="music-box-multiple" 
              size={28} 
              color="rgb(255, 228, 230)" 
              style={styles.headerIcon} 
            />
            <ThemedText style={styles.mainHeaderTitle}>Liked Songs</ThemedText>
            
          </View>
        </View>
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
    color: 'rgb(255, 228, 230)',
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
    color: 'rgb(136, 19, 55)',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgb(190, 18, 60)',
    opacity: 1,
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
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgb(254, 205, 211)',
  },
  filterText: {
    fontSize: 14,
    marginLeft: 6,
    color: 'rgb(225, 29, 72)',
  },
  songItem: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: 'rgb(254, 243, 199)',
   
    width: '95%',
  },
  songImage: {
    width: 44,
    height: 44,
    borderRadius: 6,
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
    color: 'rgb(225, 29, 72)',
    fontFamily: 'Poppins',
    //font-family: "Poppins", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  },
  songArtist: {
    fontSize: 14,
    color: 'rgb(136, 19, 55)',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto', // Push buttons to the right
  },
  actionButton: {
    padding: 8, // Consistent padding for both buttons
    marginLeft: 4, // Add some space between buttons
  },
});