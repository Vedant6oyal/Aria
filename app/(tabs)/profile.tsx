import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Dimensions,
  Animated
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';

const { width, height } = Dimensions.get('window');

// Mock user data
const userData = {
  name: 'Alex Johnson',
  username: '@alexjmusic',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
  joinDate: 'March 15, 2025',
  currentMood: 'Peaceful',
  positivityScore: 78, // 0-100 scale
  journeyStarted: '45 days ago',
  affirmationStreak: 12,
  completedMilestones: 5,
  totalMilestones: 10,
  moodHistory: [
    { day: 'Mon', value: 45 },
    { day: 'Tue', value: 52 },
    { day: 'Wed', value: 60 },
    { day: 'Thu', value: 58 },
    { day: 'Fri', value: 65 },
    { day: 'Sat', value: 72 },
    { day: 'Sun', value: 78 },
  ],
  achievements: [
    { id: 1, title: 'First Meditation', completed: true, icon: 'meditation' },
    { id: 2, title: '7 Days of Affirmations', completed: true, icon: 'calendar-check' },
    { id: 3, title: 'Shared Your Story', completed: true, icon: 'account-voice' },
    { id: 4, title: 'Mood Improvement', completed: true, icon: 'emoticon-happy-outline' },
    { id: 5, title: 'Completed Self-Assessment', completed: true, icon: 'clipboard-check' },
    { id: 6, title: '30 Days Journey', completed: false, icon: 'calendar-month' },
    { id: 7, title: 'Helped a Friend', completed: false, icon: 'hand-heart' },
  ],
  dailyAffirmation: "I am worthy of love and capable of giving love to others."
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
  const [currentAffirmation, setCurrentAffirmation] = useState(userData.dailyAffirmation);
  
  // Animation for the progress indicator
  const progressAnimation = new Animated.Value(0);
  const progressWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${userData.positivityScore}%`]
  });
  
  useEffect(() => {
    // Animate the progress indicator when component mounts
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false
    }).start();
  }, []);

  // Function to get a new affirmation
  const getNewAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setCurrentAffirmation(affirmations[randomIndex]);
  };

  return (
    <View style={[styles.container, { backgroundColor: 'rgb(255, 251, 235)' }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={['rgb(244, 63, 94)', 'rgb(225, 29, 72)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.profileContainer}>
            <Image 
              source={{ uri: userData.profileImage }} 
              style={styles.profileImage} 
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{userData.name}</Text>
              <Text style={styles.username}>{userData.username}</Text>
              <Text style={styles.joinDate}>Journey started {userData.journeyStarted}</Text>
            </View>
          </View>
        </LinearGradient>
        
        {/* Positivity Journey Card */}
        <View style={[styles.card, { backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="heart-pulse" size={24} color="rgb(244, 63, 94)" />
            <Text style={[styles.cardTitle, { color: 'rgb(136, 19, 55)' }]}>Your Positivity Journey</Text>
          </View>
          
          <View style={styles.journeyContainer}>
            {/* Journey Path - Replaced SVG with gradient view */}
            <View style={styles.journeyPathContainer}>
              <LinearGradient
                colors={['rgb(244, 63, 94)', 'rgb(253, 230, 138)', 'rgb(253, 164, 175)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.journeyPath}
              />
              
              {/* Dashed overlay to show "remaining" path */}
              <View style={styles.dashedOverlay} />
              
              {/* Starting point - negative */}
              <View style={styles.startPoint} />
              
              {/* Current position */}
              <Animated.View 
                style={[
                  styles.currentPoint,
                  {
                    left: progressWidth,
                    backgroundColor: 'rgb(244, 63, 94)',
                    borderColor: 'rgb(255, 228, 230)'
                  }
                ]}
              />
              
              {/* End goal - positive */}
              <View style={[styles.endPoint, { backgroundColor: 'rgb(251, 113, 133)' }]} />
            </View>
            
            {/* Labels */}
            <View style={styles.journeyLabels}>
              <Text style={[styles.journeyLabel, { color: 'rgb(244, 63, 94)' }]}>Negativity</Text>
              <Text style={[styles.journeyLabel, { color: 'rgb(251, 113, 133)' }]}>Positivity</Text>
            </View>
            
            {/* Score */}
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreLabel, { color: 'rgb(190, 18, 60)' }]}>Positivity Score</Text>
              <View style={styles.scoreValueContainer}>
                <Text style={[styles.scoreValue, { color: 'rgb(244, 63, 94)' }]}>{userData.positivityScore}</Text>
                <Text style={[styles.scoreMax, { color: 'rgb(253, 164, 175)' }]}>/100</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Current Mood & Mood History */}
        <View style={[styles.card, { backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="emoticon-outline" size={24} color="rgb(244, 63, 94)" />
            <Text style={[styles.cardTitle, { color: 'rgb(136, 19, 55)' }]}>Mood Tracking</Text>
          </View>
          
          <View style={styles.moodContainer}>
            <View style={styles.currentMood}>
              <Text style={[styles.moodLabel, { color: 'rgb(253, 164, 175)' }]}>Current Mood</Text>
              <Text style={[styles.moodValue, { color: 'rgb(225, 29, 72)' }]}>{userData.currentMood}</Text>
            </View>
            
            {/* Mood History Chart - Replaced SVG with Views */}
            <View style={styles.chartContainer}>
              <View style={styles.chartLines}>
                <View style={[styles.chartLine, { backgroundColor: 'rgb(254, 205, 211)' }]} />
                <View style={[styles.chartLine, { backgroundColor: 'rgb(254, 205, 211)' }]} />
                <View style={[styles.chartLine, { backgroundColor: 'rgb(254, 205, 211)' }]} />
              </View>
              
              <View style={styles.chartContent}>
                {/* Data points and connecting lines */}
                {userData.moodHistory.map((day, index) => (
                  <React.Fragment key={index}>
                    {/* Connecting line to next point */}
                    {index < userData.moodHistory.length - 1 && (
                      <View 
                        style={[
                          styles.connectorLine,
                          {
                            left: (width - 72) / 7 * index + 20 + 6,
                            top: 100 - day.value,
                            width: (width - 72) / 7 - 12,
                            height: 2,
                            backgroundColor: 'rgb(244, 63, 94)',
                            transform: [
                              { 
                                rotate: `${Math.atan2(
                                  (userData.moodHistory[index + 1].value - day.value),
                                  ((width - 72) / 7)
                                ) * (180 / Math.PI)}deg` 
                              },
                              { translateY: -1 }
                            ],
                            transformOrigin: 'left center'
                          }
                        ]}
                      />
                    )}
                    
                    {/* Data point */}
                    <View 
                      style={[
                        styles.dataPoint, 
                        { 
                          left: (width - 72) / 7 * index + 20 - 6,
                          top: 100 - day.value - 6,
                          backgroundColor: 'rgb(244, 63, 94)',
                          borderColor: 'rgb(255, 228, 230)'
                        }
                      ]}
                    />
                  </React.Fragment>
                ))}
              </View>
              
              {/* X-axis labels */}
              <View style={styles.chartLabels}>
                {userData.moodHistory.map((day, index) => (
                  <Text key={index} style={[styles.chartLabel, { color: 'rgb(253, 164, 175)' }]}>
                    {day.day}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </View>
        
        {/* Achievements */}
        <View style={[styles.card, { backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="trophy-outline" size={24} color="rgb(253, 230, 138)" />
            <Text style={[styles.cardTitle, { color: 'rgb(136, 19, 55)' }]}>Self-Love Milestones</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(userData.completedMilestones / userData.totalMilestones) * 100}%`,
                    backgroundColor: 'rgb(244, 63, 94)'
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: 'rgb(190, 18, 60)' }]}>
              {userData.completedMilestones} of {userData.totalMilestones} milestones
            </Text>
          </View>
          
          <View style={styles.achievementsContainer}>
            {userData.achievements.slice(0, 4).map((achievement) => (
              <View 
                key={achievement.id} 
                style={[
                  styles.achievementItem, 
                  { 
                    backgroundColor: achievement.completed ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255, 251, 235, 0.6)',
                    borderColor: achievement.completed ? 'rgb(244, 63, 94)' : 'rgb(254, 205, 211)'
                  }
                ]}
              >
                <MaterialCommunityIcons 
                  name={achievement.icon} 
                  size={24} 
                  color={achievement.completed ? 'rgb(244, 63, 94)' : 'rgb(253, 164, 175)'} 
                />
                <Text 
                  style={[
                    styles.achievementTitle, 
                    { 
                      color: achievement.completed ? 'rgb(225, 29, 72)' : 'rgb(136, 19, 55)',
                      fontWeight: achievement.completed ? 'bold' : 'normal'
                    }
                  ]}
                >
                  {achievement.title}
                </Text>
                {achievement.completed && (
                  <MaterialCommunityIcons name="check-circle" size={16} color="rgb(244, 63, 94)" style={styles.checkIcon} />
                )}
              </View>
            ))}
          </View>
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={[styles.viewAllText, { color: 'rgb(244, 63, 94)' }]}>View All Milestones</Text>
          </TouchableOpacity>
        </View>
        
        {/* Daily Affirmation */}
        <View style={[styles.card, { backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="lightbulb-outline" size={24} color="rgb(253, 230, 138)" />
            <Text style={[styles.cardTitle, { color: 'rgb(136, 19, 55)' }]}>Daily Affirmation</Text>
          </View>
          
          <View style={[styles.affirmationContainer, { backgroundColor: 'rgb(254, 243, 199)' }]}>
            <Text style={[styles.affirmationText, { color: 'rgb(136, 19, 55)' }]}>
              "{currentAffirmation}"
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.newAffirmationButton, { borderColor: 'rgb(244, 63, 94)' }]} 
            onPress={getNewAffirmation}
          >
            <Text style={[styles.newAffirmationText, { color: 'rgb(244, 63, 94)' }]}>New Affirmation</Text>
          </TouchableOpacity>
        </View>
        
        {/* Settings */}
        <View style={[styles.card, { backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="cog-outline" size={24} color="rgb(136, 19, 55)" />
            <Text style={[styles.cardTitle, { color: 'rgb(136, 19, 55)' }]}>Settings</Text>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: 'rgb(136, 19, 55)' }]}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: 'rgb(254, 205, 211)', true: 'rgb(244, 63, 94)' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: 'rgb(136, 19, 55)' }]}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: 'rgb(254, 205, 211)', true: 'rgb(244, 63, 94)' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <TouchableOpacity style={[styles.logoutButton, { borderColor: 'rgb(244, 63, 94)' }]}>
            <MaterialCommunityIcons name="logout" size={20} color="rgb(244, 63, 94)" />
            <Text style={[styles.logoutText, { color: 'rgb(244, 63, 94)' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgb(255, 228, 230)',
  },
  profileInfo: {
    marginLeft: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(255, 228, 230)',
  },
  username: {
    fontSize: 16,
    color: 'rgba(255, 228, 230, 0.8)',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: 'rgba(255, 228, 230, 0.7)',
  },
  card: {
    margin: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  journeyContainer: {
    alignItems: 'center',
  },
  journeyPathContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  journeyPath: {
    width: '90%',
    height: 4,
    borderRadius: 2,
    position: 'absolute',
  },
  dashedOverlay: {
    position: 'absolute',
    width: '90%',
    height: 4,
    borderRadius: 2,
    borderWidth: 0,
    borderStyle: 'dashed',
    borderColor: 'rgba(0,0,0,0.1)',
    opacity: 0.5,
  },
  startPoint: {
    position: 'absolute',
    left: '5%',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgb(244, 63, 94)',
  },
  currentPoint: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    top: '50%',
    marginTop: -10,
    left: '5%', // Will be animated
  },
  endPoint: {
    position: 'absolute',
    right: '5%',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgb(251, 113, 133)',
    opacity: 0.5,
  },
  journeyLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 8,
  },
  journeyLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  scoreContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  scoreLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  scoreValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  scoreMax: {
    fontSize: 18,
    marginLeft: 2,
  },
  moodContainer: {
    marginTop: 8,
  },
  currentMood: {
    alignItems: 'center',
    marginBottom: 20,
  },
  moodLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  moodValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chartContainer: {
    height: 150,
    position: 'relative',
  },
  chartLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'space-between',
  },
  chartLine: {
    height: 1,
    width: '100%',
    opacity: 0.2,
  },
  chartContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  connectorLine: {
    position: 'absolute',
    height: 2,
  },
  dataPoint: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  chartLabel: {
    fontSize: 12,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(254, 205, 211, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
  },
  achievementsContainer: {
    marginBottom: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  achievementTitle: {
    marginLeft: 12,
    fontSize: 16,
    flex: 1,
  },
  checkIcon: {
    marginLeft: 8,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '500',
  },
  affirmationContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  affirmationText: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 26,
  },
  newAffirmationButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  newAffirmationText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(254, 205, 211)',
  },
  settingLabel: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgb(244, 63, 94)',
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: 'rgb(244, 63, 94)',
  },
});

