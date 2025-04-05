import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Define icon types to avoid TypeScript errors
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

// Mock data for positive music categories with sunset-inspired theme
const searchCategories = [
  { id: '1', title: 'Happy', color: '#FF7B54', icon: 'emoticon-happy-outline' as IconName },
  { id: '2', title: 'Energetic', color: '#8E92EF', icon: 'lightning-bolt' as IconName },
  { id: '3', title: 'Uplifting', color: '#00CCB4', icon: 'arrow-up-bold' as IconName },
  { id: '4', title: 'Motivational', color: '#36D97F', icon: 'run-fast' as IconName },
  { id: '5', title: 'Peaceful', color: '#FF9A76', icon: 'weather-sunset' as IconName },
  { id: '6', title: 'Inspiring', color: '#AEB1FF', icon: 'lightbulb-on' as IconName },
  { id: '7', title: 'Joyful', color: '#FF7B54', icon: 'party-popper' as IconName },
  { id: '8', title: 'Relaxing', color: '#40E0D0', icon: 'meditation' as IconName },
];

// Mock search results
const mockSearchResults = [
  { id: '1', title: 'Happy Day', artist: 'Positive Vibes', type: 'song', icon: 'music-note' as IconName, color: '#FF7B54' },
  { id: '2', title: 'Good Energy', type: 'artist', icon: 'account-music' as IconName, color: '#8E92EF' },
  { id: '3', title: 'Mood Lifters 2025', type: 'playlist', description: 'Songs to brighten your day', icon: 'playlist-music' as IconName, color: '#00CCB4' },
  { id: '4', title: 'Positive Thoughts', artist: 'Happy Beats', type: 'album', icon: 'album' as IconName, color: '#36D97F' },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setIsSearching(true);
      // In a real app, we would fetch results from an API
      setSearchResults(mockSearchResults);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

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

  const renderSearchResult = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity style={styles.searchResultItem} onPress={() => router.push('/player')}>
        <LinearGradient
          colors={[item.color, shadeColor(item.color, 20)]}
          style={styles.searchResultCover}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialCommunityIcons name={item.icon} size={32} color="#FFFFFF" />
        </LinearGradient>
        <View style={styles.searchResultInfo}>
          <ThemedText style={styles.searchResultTitle}>{item.title}</ThemedText>
          <ThemedText style={styles.searchResultSubtitle}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} {item.artist ? `• ${item.artist}` : ''}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity 
        style={styles.categoryItem}
        onPress={() => console.log(`Category ${item.title} selected`)}
      >
        <LinearGradient
          colors={[item.color, shadeColor(item.color, 20)]}
          style={styles.categoryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ThemedText style={styles.categoryTitle}>{item.title}</ThemedText>
          <View style={styles.categoryIconContainer}>
            <MaterialCommunityIcons name={item.icon} size={40} color="rgba(255,255,255,0.8)" />
          </View>
        </LinearGradient>
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
        <ThemedText style={styles.headerTitle}>Discover</ThemedText>
        <Searchbar
          placeholder="Find your happy tunes..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: colors.overlay }]}
          iconColor={colors.text}
          inputStyle={{ color: colors.text }}
          placeholderTextColor={colors.tabIconDefault}
        />
      </LinearGradient>

      {isSearching ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={item => item.id}
          style={styles.searchResults}
        />
      ) : (
        <ScrollView style={styles.content}>
          <ThemedText style={styles.browseTitle}>Browse Positive Vibes</ThemedText>
          <FlatList
            data={searchCategories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </ScrollView>
      )}
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    elevation: 0,
    borderRadius: 12,
    shadowColor: "transparent",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  browseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingBottom: 24,
  },
  categoryItem: {
    flex: 1,
    height: 100,
    margin: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryGradient: {
    flex: 1,
    padding: 16,
    position: 'relative',
  },
  categoryTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    zIndex: 1,
  },
  categoryIconContainer: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    transform: [{ rotate: '25deg' }],
  },
  searchResults: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  searchResultCover: {
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
  searchResultInfo: {
    marginLeft: 12,
    flex: 1,
  },
  searchResultTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  searchResultSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
});
