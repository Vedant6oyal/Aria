import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  Animated
} from 'react-native';
import { 
  LinearGradient 
} from 'expo-linear-gradient';
import Svg, { 
  Circle 
} from 'react-native-svg';
import { 
  Feather,
  FontAwesome,
  MaterialCommunityIcons
} from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { supabase } from '@/app/utils/supabase';

// Mock user data
const userData = {
  name: 'Alex Johnson',
  streak: 12, // Using the affirmationStreak from original
  totalSessions: 47,
  weeklyGoal: 5,
  weeklyCompleted: 4,
  badges: 5, // Using completedMilestones from original
  lastActivity: "Loving-kindness meditation",
  overallProgress: 78, // Using positivityScore from original
  wellnessScores: {
    selfEsteem: 72,
    selfCompassion: 65,
    positiveThinking: 58,
    gratitude: 80
  }
};

// Affirmations list
const affirmations = [
  "I am enough just as I am.",
  "I deserve peace, love, and joy in my life.",
  "I am becoming more confident and stronger each day.",
  "I release negative thoughts and embrace positivity.",
  "I am worthy of love and capable of giving love to others.",
  "My potential to succeed is infinite.",
  "I trust my journey and am open to where it leads me."
];

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [notifications, setNotifications] = useState(true);
  const [currentAffirmation, setCurrentAffirmation] = useState(affirmations[4]);
  
  // Function to get a new affirmation
  const getNewAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setCurrentAffirmation(affirmations[randomIndex]);
  };

  // Function to fetch songs from Supabase
  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from('Songs')
        .select('*')
        .limit(10);
      
      if (error) {
        console.error('Error fetching songs:', error);
      } else {
        console.log('Songs from Supabase:', data);
      }
    } catch (error) {
      console.error('Exception when fetching songs:', error);
    }
  };

  // Progress Circle Component
  const ProgressCircle = ({ value, title, color }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;
    
    return (
      <View style={styles.progressCircleContainer}>
        <View style={styles.progressCircle}>
          <Svg width="80" height="80" viewBox="0 0 100 100">
            <Circle
              cx="50"
              cy="50"
              r={radius}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="8"
              fill="transparent"
            />
            <Circle
              cx="50"
              cy="50"
              r={radius}
              stroke={color}
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90, 50, 50)"
            />
          </Svg>
          <View style={styles.progressTextContainer}>
            <Text style={[styles.progressText, { color: '#BE123C' }]}>{value}%</Text>
          </View>
        </View>
        <Text style={styles.progressTitle}>{title}</Text>
      </View>
    );
  };

  // Progress bar component
  const ProgressBar = ({ progress }) => (
    <View style={styles.progressBarBackground}>
      <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
    </View>
  );

  return (
    <LinearGradient
      colors={['rgb(255, 251, 235)', 'rgb(255, 228, 230)']}
      style={styles.container}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>My Journey</Text>
              <Text style={styles.headerSubtitle}>Welcome back, {userData.name.split(' ')[0]}!</Text>
            </View>
            <View style={styles.profileIcon}>
              <Feather name="user" size={24} color="rgb(244, 63, 94)" />
            </View>
          </View>

          {/* Overall Progress Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Overall Progress</Text>
              <View style={styles.ratingContainer}>
                <FontAwesome name="star" size={16} color="rgb(253, 230, 138)" />
                <Text style={styles.ratingText}>{userData.overallProgress}%</Text>
              </View>
            </View>
            
            {/* Progress Bar */}
            <ProgressBar progress={userData.overallProgress} />
            
            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Feather name="calendar" size={16} color="rgb(251, 113, 133)" />
                <Text style={styles.statText}>{userData.streak} day streak</Text>
              </View>
              <View style={styles.statItem}>
                <Feather name="trending-up" size={16} color="rgb(251, 113, 133)" />
                <Text style={styles.statText}>{userData.totalSessions} sessions</Text>
              </View>
              <View style={styles.statItem}>
                <Feather name="award" size={16} color="rgb(251, 113, 133)" />
                <Text style={styles.statText}>{userData.badges} badges</Text>
              </View>
            </View>
          </View>

          {/* Weekly Goal Progress */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Weekly Goal</Text>
            <View style={styles.weeklyGoalContainer}>
              {[...Array(userData.weeklyGoal)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.goalBox,
                    i < userData.weeklyCompleted ? styles.goalCompleted : styles.goalIncomplete
                  ]}
                >
                  {i < userData.weeklyCompleted ? (
                    <Feather name="check-circle" size={24} color="white" />
                  ) : (
                    <Feather name="heart" size={24} color="rgb(253, 164, 175)" />
                  )}
                </View>
              ))}
            </View>
            <Text style={styles.weeklyGoalText}>
              {userData.weeklyCompleted}/{userData.weeklyGoal} activities this week
            </Text>
          </View>

          {/* Wellness Scores */}
          <Text style={[styles.cardTitle, styles.sectionTitle]}>Your Wellness Journey</Text>
          <View style={styles.card}>
            <View style={styles.wellnessContainer}>
              <ProgressCircle
                value={userData.wellnessScores.selfEsteem}
                title="Self-Esteem"
                color="rgb(244, 63, 94)" // rose-500
              />
              <ProgressCircle
                value={userData.wellnessScores.selfCompassion}
                title="Self-Compassion"
                color="rgb(225, 29, 72)" // rose-600
              />
              <ProgressCircle
                value={userData.wellnessScores.positiveThinking}
                title="Positive Thinking"
                color="rgb(253, 164, 175)" // rose-300
              />
              <ProgressCircle
                value={userData.wellnessScores.gratitude}
                title="Gratitude"
                color="rgb(253, 230, 138)" // amber-200
              />
            </View>
          </View>

          {/* Last Activity */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Last Activity</Text>
            <View style={styles.lastActivityContainer}>
              <View style={styles.activityIcon}>
                <Feather name="heart" size={20} color="white" />
              </View>
              <View>
                <Text style={styles.activityTitle}>{userData.lastActivity}</Text>
                <Text style={styles.activitySubtitle}>Great job!</Text>
              </View>
            </View>
          </View>

          {/* Daily Affirmation */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Daily Affirmation</Text>
            <View style={styles.affirmationContainer}>
              <Text style={styles.affirmationText}>
                "{currentAffirmation}"
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.newAffirmationButton} 
              onPress={getNewAffirmation}
            >
              <Text style={styles.newAffirmationText}>New Affirmation</Text>
            </TouchableOpacity>
          </View>

          {/* Supabase Songs Button - Keeping this from the original */}
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.supabaseButton}
              onPress={fetchSongs}
            >
              <MaterialCommunityIcons name="database" size={20} color="rgb(49, 120, 198)" />
              <Text style={styles.supabaseButtonText}>Fetch Songs</Text>
            </TouchableOpacity>
          </View>

          {/* Adding some bottom margin for scrolling */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.floatingButton}>
          <Feather name="message-circle" size={24} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(190, 18, 60)', // rose-700
  },
  headerSubtitle: {
    color: 'rgb(225, 29, 72)', // rose-600
  },
  profileIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 12,
    borderRadius: 25,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(190, 18, 60)', // rose-700
  },
  sectionTitle: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: 'rgb(225, 29, 72)', // rose-600
    fontWeight: '500',
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: 'rgb(255, 228, 230)', // rose-100
    borderRadius: 6,
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'rgb(244, 63, 94)', // rose-500
    borderRadius: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: 'rgb(225, 29, 72)', // rose-600
  },
  weeklyGoalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
    gap: 4,
  },
  goalBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCompleted: {
    backgroundColor: 'rgb(244, 63, 94)', // rose-500
  },
  goalIncomplete: {
    backgroundColor: 'rgb(254, 205, 211)', // rose-200
  },
  weeklyGoalText: {
    textAlign: 'center',
    color: 'rgb(225, 29, 72)', // rose-600
    fontSize: 13,
  },
  wellnessContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  progressCircleContainer: {
    alignItems: 'center',
    width: '25%',
    marginBottom: 16,
  },
  progressCircle: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  progressTitle: {
    marginTop: 8,
    color: 'rgb(136, 19, 55)', // rose-900
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  lastActivityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgb(254, 243, 199)', // amber-100
    padding: 12,
    borderRadius: 12,
  },
  activityIcon: {
    backgroundColor: 'rgb(251, 113, 133)', // rose-400
    padding: 12,
    borderRadius: 25,
  },
  activityTitle: {
    color: 'rgb(136, 19, 55)', // rose-900
    fontWeight: '500',
  },
  activitySubtitle: {
    color: 'rgb(225, 29, 72)', // rose-600
    fontSize: 13,
  },
  affirmationContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: 'rgb(254, 243, 199)', // amber-100
  },
  affirmationText: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 26,
    color: 'rgb(136, 19, 55)', // rose-900
  },
  newAffirmationButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgb(244, 63, 94)',
  },
  newAffirmationText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgb(244, 63, 94)',
  },
  supabaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgb(49, 120, 198)',
  },
  supabaseButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: 'rgb(49, 120, 198)',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: 'rgb(244, 63, 94)', // rose-500
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
