import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Dimensions,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface OnboardingScreenProps {
  onComplete: (userData: { name: string; age: number | null }) => void;
}

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const handleGetStarted = async () => {
    // For now, just save minimal data to complete onboarding
    const userData = { name: 'User', age: null };
    try {
      await AsyncStorage.setItem('ARIA_USER_DATA', JSON.stringify(userData));
      await AsyncStorage.setItem('ARIA_HAS_ONBOARDED', 'true');
      onComplete(userData);
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };

  const handleSkip = async () => {
    // Same functionality as Get Started for now
    handleGetStarted();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Purple blob background */}
        <Image 
          source={require('../assets/images/purple-image.png')} 
          style={styles.backgroundImage} 
          resizeMode="contain"
        />
        
        {/* Hand with phone icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="musical-notes" size={32} color="#000" />
        </View>
        
        {/* App name and tagline */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>ARIA</Text>
          <Text style={styles.subtitle}>Your music experience</Text>
        </View>
      </View>
      
      {/* Bottom buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.getStartedButton} 
          onPress={handleGetStarted}
        >
          <Text style={styles.getStartedText}>Get started</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0ff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backgroundImage: {
    position: 'absolute',
    width: width * 0.9,
    height: height * 0.5,
    top: height * 0.1,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 192, 203, 0.8)', // Light pink
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#000',
    transform: [{ rotate: '15deg' }],
  },
  textContainer: {
    alignItems: 'center',
    backgroundColor: '#e0f5f2', // Light mint
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  getStartedButton: {
    backgroundColor: '#FFD966', // Yellow color similar to the image
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: width * 0.8,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  skipButton: {
    paddingVertical: 5,
  },
  skipText: {
    fontSize: 14,
    color: '#555',
  },
});
