import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Dimensions,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

interface OnboardingScreenProps {
  onComplete: (userData: UserData) => void;
}

export interface UserData {
  name: string;
  ageRange: string;
  musicPreference: string;
  gender: string;
  interests: string[];
}

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    ageRange: '',
    musicPreference: '',
    gender: '',
    interests: []
  });
  const [notificationDenied, setNotificationDenied] = useState(false);

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Skip only skips the current question/step
  const handleSkip = () => {
    if (currentStep < 6) {
      // Move to the next step without saving data for the current step
      setCurrentStep(currentStep + 1);
    } else {
      // If on the last step, complete the onboarding
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      // Save user data to AsyncStorage
      await AsyncStorage.setItem('ARIA_USER_DATA', JSON.stringify(userData));
      await AsyncStorage.setItem('ARIA_HAS_ONBOARDED', 'true');
      onComplete(userData);
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };

  const openAppSettings = async () => {
    try {
      await Linking.openSettings();
      // We'll still complete onboarding after they've seen the settings prompt
      setTimeout(() => {
        handleComplete();
      }, 500);
    } catch (error) {
      console.error('Error opening settings:', error);
      handleComplete();
    }
  };

  const requestNotificationPermission = async () => {
    // Use Alert to simulate the notification permission dialog since Expo Go has limitations
    Alert.alert(
      '"Aria" Would Like to Send You Notifications',
      'Notifications may include alerts, sounds, and icon badges.',
      [
        {
          text: "Don't Allow",
          style: 'cancel',
          onPress: () => {
            console.log('Notification permission denied (simulated)');
            setNotificationDenied(true);
          }
        },
        {
          text: 'Allow',
          onPress: async () => {
            console.log('Notification permission granted (simulated)');
            // Save the notification preference
            await AsyncStorage.setItem('ARIA_NOTIFICATIONS_ENABLED', 'true');
            handleComplete();
          }
        }
      ]
    );
  };

  const updateUserData = (key: keyof UserData, value: string | string[]) => {
    setUserData({
      ...userData,
      [key]: value
    });
  };

  const toggleInterest = (interest: string) => {
    let updatedInterests: string[];
    
    if (userData.interests.includes(interest)) {
      // Remove the interest if it's already selected
      updatedInterests = userData.interests.filter(item => item !== interest);
    } else {
      // Add the interest if it's not already selected
      updatedInterests = [...userData.interests, interest];
    }
    
    updateUserData('interests', updatedInterests);
  };

  const renderOptionButton = (option: string, value: string, dataKey: keyof UserData) => {
    const isSelected = userData[dataKey] === value;
    
    return (
      <TouchableOpacity 
        style={[styles.optionButton, isSelected && styles.selectedOption]} 
        onPress={() => updateUserData(dataKey, value)}
      >
        <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>{option}</Text>
        <View style={[styles.radioButton, isSelected && styles.radioSelected]}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>
    );
  };

  const renderInterestButton = (interest: string) => {
    const isSelected = userData.interests.includes(interest);
    
    return (
      <TouchableOpacity 
        style={[styles.interestButton, isSelected && styles.selectedInterest]} 
        onPress={() => toggleInterest(interest)}
      >
        <Text style={[styles.interestText, isSelected && styles.selectedInterestText]}>
          {interest}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderStep = () => {
    // If notification permission was denied and we're on step 6, show the follow-up screen
    if (currentStep === 6 && notificationDenied) {
      return renderNotificationFollowUp();
    }

    switch (currentStep) {
      case 1:
        return (
          <>
            <Text style={styles.questionText}>What do you want to be called?</Text>
            <Text style={styles.subtitleText}>Your name will personalize your experience</Text>
            
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.inputContainer}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Your name"
                  placeholderTextColor="rgba(253, 164, 175, 0.7)"
                  value={userData.name}
                  onChangeText={(text) => updateUserData('name', text)}
                />
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            
            <TouchableOpacity 
              style={[styles.continueButton, !userData.name.trim() && styles.disabledButton]} 
              onPress={handleNext}
              disabled={!userData.name.trim()}
            >
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </>
        );
      
      case 2:
        return (
          <>
            <Text style={styles.questionText}>How old are you?</Text>
            <Text style={styles.subtitleText}>Your age helps us personalize your music content</Text>
            
            {renderOptionButton('13 to 17', '13-17', 'ageRange')}
            {renderOptionButton('18 to 24', '18-24', 'ageRange')}
            {renderOptionButton('25 to 34', '25-34', 'ageRange')}
            {renderOptionButton('35 to 44', '35-44', 'ageRange')}
            {renderOptionButton('45 to 54', '45-54', 'ageRange')}
            {renderOptionButton('55+', '55+', 'ageRange')}
            
            {userData.ageRange && (
              <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>
            )}
          </>
        );
      
      case 3:
        return (
          <>
            <Text style={styles.questionText}>What music do you listen to most?</Text>
            <Text style={styles.subtitleText}>
              This will help us personalize your recommendations
            </Text>
            
            {renderOptionButton('Pop', 'pop', 'musicPreference')}
            {renderOptionButton('Rock', 'rock', 'musicPreference')}
            {renderOptionButton('Hip-Hop / Rap', 'hip-hop', 'musicPreference')}
            {renderOptionButton('Electronic / Dance', 'electronic', 'musicPreference')}
            {renderOptionButton('R&B / Soul', 'r&b', 'musicPreference')}
            {renderOptionButton('Everything', 'everything', 'musicPreference')}
            
            {userData.musicPreference && (
              <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>
            )}
          </>
        );
      
      case 4:
        return (
          <>
            <Text style={styles.questionText}>Which option represents you best?</Text>
            <Text style={styles.subtitleText}>This helps us tailor your experience</Text>
            
            {renderOptionButton('Female', 'female', 'gender')}
            {renderOptionButton('Male', 'male', 'gender')}
            {renderOptionButton('Others', 'others', 'gender')}
            {renderOptionButton('Prefer not to say', 'not-specified', 'gender')}
            
            {userData.gender && (
              <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>
            )}
          </>
        );
      
      case 5:
        return (
          <>
            <Text style={styles.questionText}>Select your interests</Text>
            <Text style={styles.subtitleText}>Choose one or more</Text>
            
            <View style={styles.interestsContainer}>
              {renderInterestButton('News')}
              {renderInterestButton('Culture')}
              {renderInterestButton('Business')}
              {renderInterestButton('Mental health')}
              {renderInterestButton('Family')}
              {renderInterestButton('Pop')}
              {renderInterestButton('Education')}
              {renderInterestButton('Health')}
              {renderInterestButton('Art')}
              {renderInterestButton('Comedy')}
              {renderInterestButton('Society')}
              {renderInterestButton('History')}
              {renderInterestButton('Sport')}
              {renderInterestButton('Science')}
              {renderInterestButton('Interviews')}
              {renderInterestButton('Movies')}
              {renderInterestButton('True crime stories')}
            </View>
            
            <TouchableOpacity 
              style={[styles.continueButton, userData.interests.length === 0 && styles.disabledButton]} 
              onPress={handleNext}
              disabled={userData.interests.length === 0}
            >
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </>
        );

      case 6:
        return (
          <View style={styles.notificationContainer}>
            <Ionicons name="notifications" size={60} color="#E11D48" style={styles.notificationIcon} />
            
            <Text style={styles.questionText}>Get Personalised Song For You Everyday</Text>
            <Text style={styles.subtitleText}>
              We advise you to listen to this everyday in the morning for best effect
            </Text>
            
            <View style={styles.spacer} />
            
            <TouchableOpacity 
              style={styles.allowButton} 
              onPress={requestNotificationPermission}
            >
              <Text style={styles.allowButtonText}>Allow</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.skipNotificationButton} 
              onPress={() => setNotificationDenied(true)}
            >
              <Text style={styles.skipNotificationText}>Not now</Text>
            </TouchableOpacity>
          </View>
        );
      
      default:
        return null;
    }
  };

  // Render the follow-up screen when notification permission is denied
  const renderNotificationFollowUp = () => {
    return (
      <View style={styles.notificationContainer}>
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../assets/images/bell-hand.png')}
            style={styles.bellHandImage}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.questionText}>Aria works better with reminders</Text>
        <Text style={styles.subtitleText}>
          Open settings to allow notifications, it'll have a big impact in your music experience
        </Text>
        
        <View style={styles.spacer} />
        
        <TouchableOpacity 
          style={styles.allowButton} 
          onPress={openAppSettings}
        >
          <Text style={styles.allowButtonText}>Go to settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.skipNotificationButton} 
          onPress={handleComplete}
        >
          <Text style={styles.skipNotificationText}>I'm not ready yet</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Dynamically show "Skip" text based on whether it's the last step
  const renderSkipText = () => {
    // Don't show "Skip" text on the last step (notifications)
    if (currentStep === 6) {
      return '';
    }
    return currentStep < 5 ? "Skip" : "Skip All";
  };

  // Don't show back button on notification screens
  const showBackButton = currentStep > 1 && currentStep !== 6;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 251, 235, 1)', 'rgba(255, 228, 230, 1)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            disabled={!showBackButton}
          >
            {showBackButton && (
              <Ionicons name="chevron-back" size={24} color="#BE123C" />
            )}
          </TouchableOpacity>
          
          {currentStep !== 6 && (
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>{renderSkipText()}</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.progressBar}>
          {[1, 2, 3, 4, 5, 6].map(step => (
            <View 
              key={step} 
              style={[
                styles.progressDot, 
                currentStep >= step && styles.activeDot
              ]} 
            />
          ))}
        </View>
        
        <View style={styles.content}>
          {renderStep()}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: '#E11D48',
    fontSize: 16,
    fontWeight: '500',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(253, 164, 175, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#F43F5E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  questionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#BE123C',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#881937',
    textAlign: 'center',
    marginBottom: 32,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    borderColor: '#F43F5E',
    backgroundColor: 'rgba(255, 228, 230, 0.8)',
  },
  optionText: {
    fontSize: 16,
    color: '#881937',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#E11D48',
    fontWeight: '600',
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#FCA5AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#F43F5E',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F43F5E',
  },
  inputContainer: {
    marginBottom: 24,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#881937',
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  continueButton: {
    backgroundColor: '#F43F5E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#881937',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: 'rgba(251, 113, 133, 0.5)',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  notificationIcon: {
    marginBottom: 24,
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  allowButton: {
    backgroundColor: '#F43F5E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    shadowColor: '#881937',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  allowButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipNotificationButton: {
    padding: 12,
  },
  skipNotificationText: {
    color: '#E11D48',
    fontSize: 14,
    fontWeight: '500',
  },
  illustrationContainer: {
    marginBottom: 30,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(254, 243, 199, 0.5)',
    borderRadius: 60,
    width: 120,
  },
  bellHandImage: {
    width: 120,
    height: 120,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  interestButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#FECDD3',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 6,
    marginBottom: 12,
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedInterest: {
    backgroundColor: '#F43F5E',
    borderColor: '#E11D48',
  },
  interestText: {
    color: '#881937',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedInterestText: {
    color: '#FFFFFF',
  },
});