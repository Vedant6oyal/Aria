// components/OnboardingPopup.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface OnboardingPopupProps {
  isVisible: boolean;
  onDismiss: () => void;
  currentStreakDay?: number; // Added prop for streak day
}

const OnboardingPopup: React.FC<OnboardingPopupProps> = ({ 
  isVisible, 
  onDismiss, 
  currentStreakDay = 1 // Default to day 1 for preview
}) => {
  const screenHeight = Dimensions.get('window').height;
  const challengeTotalDays = 21;
  const progressPercent = Math.min((currentStreakDay / challengeTotalDays) * 100, 100);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onDismiss} 
    >
      <View style={styles.modalOverlay}>
        {/* Use the same gradient as the splash screen */}
        <LinearGradient
          colors={['#4c0668', '#9921e8', '#5643fd']}
          style={[styles.modalContent, { height: screenHeight * 0.75 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Header with Icon */}
          <View style={styles.header}>
             <MaterialCommunityIcons name="brain" size={48} color="#FFFFFF" />
             <ThemedText type="title" style={styles.title}>Welcome to Aria!</ThemedText>
          </View>

          {/* Body Content */}
          <View style={styles.body}>
             <ThemedText type="subtitle" style={styles.subtitle}>
               Unlock Your Potential
             </ThemedText>
            <ThemedText style={styles.description}>
              Enjoy personalised gratitude songs,
            </ThemedText>
             <ThemedText style={styles.descriptionEmphasized}>
               crafted to transform your brain.
             </ThemedText>
          </View>

          {/* 21-Day Challenge Progress */}
          <View style={styles.challengeContainer}>
            <ThemedText style={styles.challengeTitle}>Your 21-Day Transformation</ThemedText>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}> 
                <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
              </View>
              <ThemedText style={styles.progressText}>Day {currentStreakDay} / {challengeTotalDays}</ThemedText>
            </View>
          </View>

          {/* Footer Button */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.continueButton} onPress={onDismiss}>
               <MaterialCommunityIcons name="music-note" size={24} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.continueButtonText}>Begin Your Journey</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end', 
  },
  modalContent: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 30,
    paddingTop: 30, // Maintain top padding
    paddingBottom: 20, // Adjust bottom padding slightly
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    justifyContent: 'space-between', 
  },
  header: {
     alignItems: 'center',
     marginBottom: 20, // Reduced margin slightly
  },
  title: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 28,
  },
  body: {
    // Removed flex: 1 to allow challenge section to fit below
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 10,
    marginBottom: 25, // Add space below body text
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20, // Reduced margin
  },
  description: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 26,
  },
   descriptionEmphasized: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10, // Reduced margin
    fontWeight: 'bold',
    lineHeight: 26,
  },
  challengeContainer: {
    alignItems: 'center',
    marginBottom: 30, // Space before the button
    paddingHorizontal: 10, // Align with body padding
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 15,
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBarBackground: {
    height: 10,
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    overflow: 'hidden', // Ensure fill stays within bounds
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF', // Bright white fill
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  footer: {
    // Removed marginTop: 30 - handled by challengeContainer margin
  },
  continueButton: {
    backgroundColor: '#344054',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
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
