import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Define icon types to avoid TypeScript errors
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

// Mock data for our positive music app with sunset-inspired theme
const recentlyPlayed = [
  { id: '1', title: 'Happy Vibes', artist: 'Various Artists', icon: 'emoticon-happy-outline' as IconName, color: '#FF7B54' },
  { id: '2', title: 'Morning Boost', artist: 'Mood Lifters', icon: 'weather-sunny' as IconName, color: '#8E92EF' },
  { id: '3', title: 'Positive Energy', artist: 'Good Mood Gang', icon: 'lightning-bolt' as IconName, color: '#00CCB4' },
];

const featuredPlaylists = [
  { id: '1', title: 'Feel Good Hits', description: 'Songs to brighten your day', icon: 'heart' as IconName, color: '#FF7B54' },
  { id: '2', title: 'Motivation Mix', description: 'Upbeat tracks to keep you going', icon: 'run-fast' as IconName, color: '#8E92EF' },
  { id: '3', title: 'Happiness Boost', description: 'Instant mood lifters', icon: 'emoticon-excited-outline' as IconName, color: '#36D97F' },
];

const recommendedArtists = [
  { id: '1', name: 'Positive Vibes', icon: 'account-music' as IconName, color: '#FF7B54' },
  { id: '2', name: 'Happy Beats', icon: 'account-music' as IconName, color: '#8E92EF' },
  { id: '3', name: 'Good Energy', icon: 'account-music' as IconName, color: '#00CCB4' },
  { id: '4', name: 'Mood Lifters', icon: 'account-music' as IconName, color: '#36D97F' },
];

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const navigateToPlayer = (item: any) => {
    // In a real app, we would pass the track ID to the player
    router.push('/player');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.6 }}
        style={styles.header}
      >
        <ThemedText style={styles.greeting}>{getGreeting()}</ThemedText>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="cog-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Recently Played</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
          {recentlyPlayed.map((item) => (
            <TouchableOpacity key={item.id} style={styles.recentItem} onPress={() => navigateToPlayer(item)}>
              <LinearGradient
                colors={[item.color, shadeColor(item.color, 20)]}
                style={styles.recentCover}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name={item.icon} size={60} color="#FFFFFF" />
              </LinearGradient>
              <ThemedText numberOfLines={1} style={styles.recentTitle}>{item.title}</ThemedText>
              <ThemedText numberOfLines={1} style={styles.recentArtist}>{item.artist}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Mood Boosters</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
          {featuredPlaylists.map((item) => (
            <TouchableOpacity key={item.id} style={styles.featuredItem} onPress={() => navigateToPlayer(item)}>
              <LinearGradient
                colors={[item.color, shadeColor(item.color, 20)]}
                style={styles.featuredCover}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name={item.icon} size={80} color="#FFFFFF" />
              </LinearGradient>
              <ThemedText numberOfLines={1} style={styles.featuredTitle}>{item.title}</ThemedText>
              <ThemedText numberOfLines={2} style={styles.featuredDescription}>{item.description}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.section, styles.visualizerSection]}>
        <ThemedText style={styles.sectionTitle}>Positive Artists</ThemedText>
        <View style={styles.visualizerContainer}>
          {Colors.common.musicVisualizer.map((color, index) => (
            <View 
              key={index} 
              style={[
                styles.visualizerBar, 
                { 
                  backgroundColor: color,
                  height: 40 + Math.random() * 60,
                  marginLeft: index > 0 ? 8 : 0
                }
              ]} 
            />
          ))}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
          {recommendedArtists.map((item) => (
            <TouchableOpacity key={item.id} style={styles.artistItem}>
              <View style={styles.artistCircle}>
                <LinearGradient
                  colors={[item.color, shadeColor(item.color, 20)]}
                  style={styles.artistCover}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MaterialCommunityIcons name={item.icon} size={50} color="#FFFFFF" />
                </LinearGradient>
              </View>
              <ThemedText numberOfLines={1} style={styles.artistName}>{item.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  horizontalList: {
    marginTop: 8,
  },
  recentItem: {
    width: 150,
    marginRight: 16,
  },
  recentCover: {
    width: 150,
    height: 150,
    borderRadius: 16,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  recentTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  recentArtist: {
    fontSize: 14,
    opacity: 0.7,
  },
  featuredItem: {
    width: 200,
    marginRight: 16,
  },
  featuredCover: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  featuredTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  artistItem: {
    width: 120,
    marginRight: 16,
    alignItems: 'center',
  },
  artistCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 12,
  },
  artistCover: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  artistName: {
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  visualizerSection: {
    marginBottom: 40,
  },
  visualizerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: 20,
  },
  visualizerBar: {
    width: 40,
    borderRadius: 8,
  },
});
