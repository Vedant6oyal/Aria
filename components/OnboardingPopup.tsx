// components/OnboardingPopup.tsx
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Define the color palette
const palette = {
  background: '#DDEDE6',
  messageBubble: '#F7F0D8',
  accentPeach: '#E8B89C',
  primaryText: '#5D5A4D',
  nameText: '#4A4535',
  iconsBackground: '#F3EBD3',
  searchBarBackground: '#FDFDFB',
  micIcon: '#4A3C2F',
};

interface OnboardingPopupProps {
  isVisible: boolean;
  onDismiss: () => void;
  currentStreakDay?: number;
}

// Confetti piece component
const ConfettiPiece = ({ startY, delay, color, size, duration }) => {
  const position = React.useRef(new Animated.ValueXY({ x: 0, y: startY })).current;
  const opacity = React.useRef(new Animated.Value(1)).current;
  const rotation = React.useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  
  // Random starting position within screen width
  const startX = Math.random() * screenWidth;
  
  useEffect(() => {
    // Wait for the specified delay
    const timer = setTimeout(() => {
      // Animate the confetti piece falling and fading
      Animated.parallel([
        Animated.timing(position, {
          toValue: { 
            x: startX + (Math.random() * 200 - 100), // Random horizontal movement
            y: startY + 500 // Fall down
          },
          duration: duration,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: duration,
          useNativeDriver: false,
        }),
        Animated.timing(rotation, {
          toValue: Math.random() * 2 - 1, // Random rotation
          duration: duration,
          useNativeDriver: false,
        })
      ]).start();
    }, delay);
    
    return () => clearTimeout(timer);
  }, []);
  
  const spin = rotation.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-360deg', '360deg']
  });
  
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        opacity,
        transform: [{ rotate: spin }],
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: size / 5,
      }}
    />
  );
};

// Confetti container component
const Confetti = ({ count = 50, colors, duration = 5000 }) => {
  const [pieces, setPieces] = useState([]);
  const screenHeight = Dimensions.get('window').height;
  
  useEffect(() => {
    // Create confetti pieces
    const newPieces = [];
    for (let i = 0; i < count; i++) {
      newPieces.push({
        id: i,
        startY: -20, // Start above the screen
        delay: Math.random() * 2000, // Random delay for natural effect
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5, // Random size between 5-15
        duration: duration + (Math.random() * 1000), // Slightly randomized duration
      });
    }
    setPieces(newPieces);
  }, []);
  
  return (
    <View style={StyleSheet.absoluteFill}>
      {pieces.map((piece) => (
        <ConfettiPiece key={piece.id} {...piece} />
      ))}
    </View>
  );
};

const OnboardingPopup: React.FC<OnboardingPopupProps> = ({ 
  isVisible, 
  onDismiss, 
  currentStreakDay = 1
}) => {
  const screenHeight = Dimensions.get('window').height;
  const challengeTotalDays = 21;
  const progressPercent = Math.min((currentStreakDay / challengeTotalDays) * 100, 100);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Show confetti when popup becomes visible
  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      // Hide confetti after animation completes
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const confettiColors = [
    palette.accentPeach,
    palette.background,
    palette.messageBubble,
    '#9FD8CB', // Lighter mint
    '#FFD9C0', // Lighter peach
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onDismiss} 
    >
      <View style={styles.modalOverlay}>
        {showConfetti && (
          <Confetti colors={confettiColors} count={80} duration={4000} />
        )}
        
        <View style={[styles.modalContent, { backgroundColor: palette.background }]}>
          {/* Header with Icon */}
          <View style={styles.header}>
             <View style={styles.iconContainer}>
               <MaterialCommunityIcons name="brain" size={48} color={palette.nameText} />
             </View>
             <ThemedText type="title" style={[styles.title, { color: palette.nameText }]}>Welcome to Aria!</ThemedText>
          </View>

          {/* Body Content */}
          <View style={styles.body}>
             <ThemedText type="subtitle" style={[styles.subtitle, { color: palette.nameText }]}>
               Unlock Your Potential
             </ThemedText>
            <ThemedText style={[styles.description, { color: palette.primaryText }]}>
              Enjoy personalised gratitude songs,
            </ThemedText>
             <ThemedText style={[styles.descriptionEmphasized, { color: palette.nameText }]}>
               crafted to transform your brain.
             </ThemedText>
          </View>

          {/* 21-Day Challenge Progress */}
          <View style={styles.challengeContainer}>
            <ThemedText style={[styles.challengeTitle, { color: palette.nameText }]}>
              Your 21-Day Transformation
            </ThemedText>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarBackground, { backgroundColor: 'rgba(93, 90, 77, 0.1)' }]}> 
                <View style={[styles.progressBarFill, { 
                  width: `${progressPercent}%`,
                  backgroundColor: palette.accentPeach
                }]} />
              </View>
              <View style={styles.streakInfo}>
                <ThemedText style={[styles.progressText, { color: palette.primaryText }]}>
                  Day {currentStreakDay} / {challengeTotalDays}
                </ThemedText>
                {currentStreakDay > 1 && (
                  <View style={styles.streakBadge}>
                    <MaterialCommunityIcons name="fire" size={14} color="#FFFFFF" />
                    <Text style={styles.streakText}>{currentStreakDay} day streak!</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Footer Button */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.continueButton, { backgroundColor: palette.accentPeach }]} 
              onPress={onDismiss}
            >
               <MaterialCommunityIcons name="music-note" size={24} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.continueButtonText}>Begin Your Journey</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end', 
  },
  modalContent: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 25,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
    justifyContent: 'space-between', 
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: palette.iconsBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    marginTop: 5,
    fontSize: 28,
    fontWeight: 'bold',
  },
  body: {
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 10,
    marginBottom: 25,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 26,
  },
  descriptionEmphasized: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    lineHeight: 26,
  },
  challengeContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
    backgroundColor: palette.messageBubble,
    paddingVertical: 20,
    borderRadius: 15,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBarBackground: {
    height: 12,
    width: '90%',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 14,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 10,
  },
  streakText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  footer: {
    marginTop: 5,
  },
  continueButton: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 10,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingPopup;
