import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Define icon types to avoid TypeScript errors
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

// Mock data for the library with sunset-inspired color scheme
const userPlaylists = [
  { id: '1', title: 'Positive Vibes', tracks: 24, icon: 'playlist-music' as IconName, color: '#FF7B54' },
  { id: '2', title: 'Morning Motivation', tracks: 18, icon: 'playlist-music' as IconName, color: '#8E92EF' },
  { id: '3', title: 'Sunset Chill', tracks: 32, icon: 'playlist-music' as IconName, color: '#00CCB4' },
  { id: '4', title: 'Happy Beats', tracks: 15, icon: 'playlist-music' as IconName, color: '#36D97F' },
];

const recentAlbums = [
  { id: '1', title: 'Positive Energy', artist: 'Good Vibes', tracks: 12, icon: 'album' as IconName, color: '#FF7B54' },
  { id: '2', title: 'Sunset Dreams', artist: 'Chill Masters', tracks: 10, icon: 'album' as IconName, color: '#8E92EF' },
  { id: '3', title: 'Morning Light', artist: 'Dawn Chorus', tracks: 8, icon: 'album' as IconName, color: '#00CCB4' },
  { id: '4', title: 'Happy Days', artist: 'Positive Minds', tracks: 14, icon: 'album' as IconName, color: '#36D97F' },
];

const followedArtists = [
  { id: '1', name: 'Positive Vibes', followers: '2.4M', icon: 'account-music' as IconName, color: '#FF7B54' },
  { id: '2', name: 'Good Energy', followers: '1.8M', icon: 'account-music' as IconName, color: '#8E92EF' },
  { id: '3', name: 'Happy Beats', followers: '950K', icon: 'account-music' as IconName, color: '#00CCB4' },
  { id: '4', name: 'Sunset Sounds', followers: '1.2M', icon: 'account-music' as IconName, color: '#36D97F' },
];

// Library tabs
const tabs = [
  { id: 'playlists', title: 'Playlists' },
  { id: 'albums', title: 'Albums' },
  { id: 'artists', title: 'Artists' },
];

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState('playlists');
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

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

  const renderPlaylistItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity 
        style={styles.libraryItem}
        onPress={() => router.push('/player')}
      >
        <LinearGradient
          colors={[item.color, shadeColor(item.color, 20)]}
          style={styles.itemCover}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialCommunityIcons name={item.icon} size={32} color="#FFFFFF" />
        </LinearGradient>
        <View style={styles.itemInfo}>
          <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
          <ThemedText style={styles.itemSubtitle}>{item.tracks} tracks</ThemedText>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={colors.tabIconDefault} />
      </TouchableOpacity>
    );
  };

  const renderAlbumItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity 
        style={styles.libraryItem}
        onPress={() => router.push('/player')}
      >
        <LinearGradient
          colors={[item.color, shadeColor(item.color, 20)]}
          style={styles.itemCover}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialCommunityIcons name={item.icon} size={32} color="#FFFFFF" />
        </LinearGradient>
        <View style={styles.itemInfo}>
          <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
          <ThemedText style={styles.itemSubtitle}>{item.artist} • {item.tracks} tracks</ThemedText>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={colors.tabIconDefault} />
      </TouchableOpacity>
    );
  };

  const renderArtistItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity 
        style={styles.libraryItem}
        onPress={() => router.push('/player')}
      >
        <View style={styles.artistCircle}>
          <LinearGradient
            colors={[item.color, shadeColor(item.color, 20)]}
            style={styles.artistCover}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialCommunityIcons name={item.icon} size={32} color="#FFFFFF" />
          </LinearGradient>
        </View>
        <View style={styles.itemInfo}>
          <ThemedText style={styles.itemTitle}>{item.name}</ThemedText>
          <ThemedText style={styles.itemSubtitle}>{item.followers} followers</ThemedText>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={colors.tabIconDefault} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.6 }}
        style={styles.header}
      >
        <ThemedText style={styles.headerTitle}>Your Library</ThemedText>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="magnify" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="plus" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && { backgroundColor: colors.tint }
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <ThemedText
              style={[
                styles.tabText,
                activeTab === tab.id && { color: '#FFFFFF' }
              ]}
            >
              {tab.title}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {activeTab === 'playlists' && (
          <>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Your Playlists</ThemedText>
              <TouchableOpacity>
                <ThemedText style={[styles.sectionAction, { color: colors.tint }]}>See All</ThemedText>
              </TouchableOpacity>
            </View>
            <FlatList
              data={userPlaylists}
              renderItem={renderPlaylistItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </>
        )}

        {activeTab === 'albums' && (
          <>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Recent Albums</ThemedText>
              <TouchableOpacity>
                <ThemedText style={[styles.sectionAction, { color: colors.tint }]}>See All</ThemedText>
              </TouchableOpacity>
            </View>
            <FlatList
              data={recentAlbums}
              renderItem={renderAlbumItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </>
        )}

        {activeTab === 'artists' && (
          <>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Artists You Follow</ThemedText>
              <TouchableOpacity>
                <ThemedText style={[styles.sectionAction, { color: colors.tint }]}>See All</ThemedText>
              </TouchableOpacity>
            </View>
            <FlatList
              data={followedArtists}
              renderItem={renderArtistItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </>
        )}
      </View>

      {/* Music Visualizer at the bottom */}
      <View style={styles.visualizerContainer}>
        {Colors.common.musicVisualizer.map((color, index) => (
          <View 
            key={index} 
            style={[
              styles.visualizerBar, 
              { 
                backgroundColor: color,
                height: 20 + Math.random() * 40,
                marginLeft: index > 0 ? 4 : 0
              }
            ]} 
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  tabText: {
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: '600',
  },
  libraryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  itemCover: {
    width: 56,
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  artistCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  artistCover: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualizerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  visualizerBar: {
    width: 6,
    borderRadius: 3,
  },
});
