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
  },
  totalDays: 45,
  activityCalendar: [
    { date: '2025-05-01', completed: true },
    { date: '2025-05-02', completed: true },
    { date: '2025-05-03', completed: false },
    { date: '2025-05-04', completed: true },
    { date: '2025-05-05', completed: true },
    { date: '2025-05-06', completed: true },
    { date: '2025-05-07', completed: true },
  ]
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

// Activity Streak Component
interface DayActivity {
  date: string;
  completed: boolean;
}

interface ActivityStreakProps {
  streak: number;
  totalDays: number;
  activityCalendar: DayActivity[];
}

const ActivityStreak: React.FC<ActivityStreakProps> = ({ 
  streak, 
  totalDays,
  activityCalendar 
}) => {
  // Get the last 7 days of activity for the mini calendar view
  const recentActivity = activityCalendar.slice(-7);
  
  // Format date to day name (e.g., "Mon")
  const formatDay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);
  };

  return (
    <View style={styles.activityStreakContainer}>
      <View style={styles.activityStreakHeader}>
        <View style={styles.activityStreakHeaderLeft}>
          <Feather name="calendar" size={16} color="rgb(225, 29, 72)" style={styles.activityStreakIcon} />
          <Text style={styles.activityStreakTitle}>Activity Streak</Text>
        </View>
        <View style={styles.activityStreakHeaderRight}>
          <Feather name="award" size={16} color="rgb(253, 230, 138)" style={styles.activityStreakIcon} />
          <Text style={styles.activityStreakDays}>{streak} Days</Text>
        </View>
      </View>
      
      <View style={styles.activityStreakStats}>
        <Text style={styles.activityStreakStat}>
          <Text style={styles.activityStreakStatBold}>{totalDays}</Text> Total Days
        </Text>
        <Text style={styles.activityStreakStat}>
          <Text style={styles.activityStreakStatBold}>{Math.round((totalDays / 90) * 100)}%</Text> of 90-Day Program
        </Text>
      </View>
      
      {/* Mini calendar view of the last 7 days */}
      <View style={styles.activityStreakCalendar}>
        {recentActivity.map((day, index) => (
          <View key={index} style={styles.activityStreakDay}>
            <Text style={styles.activityStreakDayText}>{formatDay(day.date)}</Text>
            <View 
              style={[
                styles.activityStreakDayCircle,
                day.completed ? styles.activityStreakDayCompleted : styles.activityStreakDayIncomplete
              ]}
            >
              <Text style={day.completed ? styles.activityStreakDayCompletedText : styles.activityStreakDayIncompleteText}>
                {day.completed ? '✓' : '·'}
              </Text>
            </View>
          </View>
        ))}
      </View>
      
      <Text style={styles.activityStreakMotivation}>
        Keep going! You're building new neural pathways.
      </Text>
    </View>
  );
};

// Milestones Component
interface Milestone {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  completedDate?: string;
}

interface MilestonesProps {
  milestones: Milestone[];
}

const milestones = [
  { id: 1, title: 'Complete 7 days of meditation', description: 'Congratulations on completing your first week of meditation!', isCompleted: true, completedDate: '2025-05-01' },
  { id: 2, title: 'Reach 30 days of meditation', description: 'You\'re on a roll! Keep up the good work.', isCompleted: false },
  { id: 3, title: 'Complete 60 days of meditation', description: 'You\'re getting close to your goal! Keep pushing forward.', isCompleted: false },
  { id: 4, title: 'Reach 90 days of meditation', description: 'You did it! You\'ve completed the 90-day program.', isCompleted: false },
];

const Milestones: React.FC<MilestonesProps> = ({ milestones }) => {
  return (
    <View style={styles.milestonesContainer}>
      <Text style={styles.milestonesTitle}>Achievement Milestones</Text>
      
      <View style={styles.milestonesContent}>
        {milestones.map((milestone, index) => (
          <View 
            key={milestone.id}
            style={styles.milestoneItem}
          >
            {/* Connector line between milestones */}
            {index !== milestones.length - 1 && (
              <View 
                style={[
                  styles.milestoneConnector,
                  milestone.isCompleted ? styles.milestoneConnectorCompleted : styles.milestoneConnectorIncomplete
                ]}
              />
            )}
            
            {/* Milestone circle */}
            <View style={styles.milestoneCircleContainer}>
              {milestone.isCompleted ? (
                <Feather name="check-circle" size={28} color="rgb(244, 63, 94)" />
              ) : (
                <Feather name="circle" size={28} color="rgb(253, 164, 175)" />
              )}
            </View>
            
            {/* Milestone content */}
            <View 
              style={[
                styles.milestoneContent,
                milestone.isCompleted ? styles.milestoneContentCompleted : styles.milestoneContentIncomplete
              ]}
            >
              <Text style={[
                styles.milestoneTitle,
                milestone.isCompleted ? styles.milestoneTitleCompleted : styles.milestoneTitleIncomplete
              ]}>
                {milestone.title}
              </Text>
              <Text style={[
                styles.milestoneDescription,
                milestone.isCompleted ? styles.milestoneDescriptionCompleted : styles.milestoneDescriptionIncomplete
              ]}>
                {milestone.description}
              </Text>
              
              {milestone.completedDate && (
                <Text style={styles.milestoneDate}>
                  Completed on {new Date(milestone.completedDate).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

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
    return (
      <View style={styles.progressCircleContainer}>
        <View style={styles.progressCircle}>
          <View style={styles.progressCircleBackground} />
          <View style={[styles.progressCircleFill, { width: `${value}%`, backgroundColor: color }]} />
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

          {/* Activity Streak Component */}
          <ActivityStreak 
            streak={userData.streak} 
            totalDays={userData.totalDays} 
            activityCalendar={userData.activityCalendar} 
          />

          {/* Milestones Component */}
          <Milestones milestones={milestones} />

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
  // Activity Streak Component Styles
  activityStreakContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityStreakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityStreakHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityStreakHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityStreakIcon: {
    marginRight: 8,
  },
  activityStreakTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgb(190, 18, 60)', // rose-700
  },
  activityStreakDays: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(225, 29, 72)', // rose-600
  },
  activityStreakStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  activityStreakStat: {
    fontSize: 14,
    color: 'rgb(136, 19, 55)', // rose-900
  },
  activityStreakStatBold: {
    fontWeight: '600',
  },
  activityStreakCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  activityStreakDay: {
    alignItems: 'center',
  },
  activityStreakDayText: {
    fontSize: 12,
    color: 'rgb(136, 19, 55)', // rose-900
    marginBottom: 4,
  },
  activityStreakDayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityStreakDayCompleted: {
    backgroundColor: 'rgb(244, 63, 94)', // rose-500
  },
  activityStreakDayIncomplete: {
    backgroundColor: 'rgb(254, 205, 211)', // rose-200
  },
  activityStreakDayCompletedText: {
    color: 'white',
    fontSize: 16,
  },
  activityStreakDayIncompleteText: {
    color: 'rgb(253, 164, 175)', // rose-300
    fontSize: 16,
  },
  activityStreakMotivation: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    color: 'rgb(225, 29, 72)', // rose-600
    fontWeight: '500',
  },
  // Milestones Component Styles
  milestonesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  milestonesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgb(190, 18, 60)', // rose-700
    marginBottom: 16,
  },
  milestonesContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  milestoneConnector: {
    width: 2,
    height: 40,
    backgroundColor: 'rgb(225, 29, 72)', // rose-600
    position: 'absolute',
    left: 18,
    top: 20,
  },
  milestoneConnectorCompleted: {
    backgroundColor: 'rgb(244, 63, 94)', // rose-500
  },
  milestoneConnectorIncomplete: {
    backgroundColor: 'rgb(254, 205, 211)', // rose-200
  },
  milestoneCircleContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  milestoneContent: {
    flex: 1,
    marginLeft: 12,
  },
  milestoneContentCompleted: {
    backgroundColor: 'rgb(244, 63, 94)', // rose-500
    padding: 12,
    borderRadius: 12,
  },
  milestoneContentIncomplete: {
    backgroundColor: 'rgb(254, 205, 211)', // rose-200
    padding: 12,
    borderRadius: 12,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(136, 19, 55)', // rose-900
  },
  milestoneTitleCompleted: {
    color: 'white',
  },
  milestoneTitleIncomplete: {
    color: 'rgb(225, 29, 72)', // rose-600
  },
  milestoneDescription: {
    fontSize: 14,
    color: 'rgb(136, 19, 55)', // rose-900
  },
  milestoneDescriptionCompleted: {
    color: 'white',
  },
  milestoneDescriptionIncomplete: {
    color: 'rgb(225, 29, 72)', // rose-600
  },
  milestoneDate: {
    fontSize: 12,
    color: 'rgb(225, 29, 72)', // rose-600
    marginTop: 4,
  },
});
