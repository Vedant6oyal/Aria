// components/OnboardingPopup.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Assuming you have this

interface OnboardingPopupProps {
  isVisible: boolean;
  onDismiss: () => void;
}

const OnboardingPopup: React.FC<OnboardingPopupProps> = ({ isVisible, onDismiss }) => {
  const screenHeight = Dimensions.get('window').height;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onDismiss} // Allow closing with back button on Android
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { height: screenHeight * 0.75 }]}>
          {/* Header */}
          <View style={styles.header}>
             <ThemedText type="title" style={styles.title}>Welcome to Aria!</ThemedText>
             {/* Optional: Add a close 'X' button if needed */}
             {/* <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
               <Text style={styles.closeButtonText}>X</Text>
             </TouchableOpacity> */}
          </View>

          {/* Body Content */}
          <View style={styles.body}>
            <ThemedText style={styles.description}>
              Discover endless music reels tailored just for you. Swipe up and down to explore,
              and tap to interact.
            </ThemedText>
            <ThemedText style={styles.description}>
              Ready to dive in?
            </ThemedText>
          </View>

          {/* Footer Button */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.continueButton} onPress={onDismiss}>
              <Text style={styles.continueButtonText}>Get Started</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dim background
    justifyContent: 'flex-end', // Align popup to bottom
  },
  modalContent: {
    backgroundColor: '#1C1C1E', // Dark background for the popup
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'space-between', // Pushes footer to bottom
  },
  header: {
     flexDirection: 'row',
     justifyContent: 'center', // Center title
     alignItems: 'center',
     marginBottom: 20,
     position: 'relative', // For potential close button positioning
  },
  title: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  // closeButton: { /* Style if needed */ },
  // closeButtonText: { /* Style if needed */ },
  body: {
    flex: 1, // Takes up available space
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    paddingHorizontal: 10,
  },
  description: {
    color: '#E0E0E0', // Light gray text
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  footer: {
    marginTop: 20, // Space above the button
  },
  continueButton: {
    backgroundColor: '#FF5757', // Your primary color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingPopup;
