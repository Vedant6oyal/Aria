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
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface OnboardingScreenProps {
  onComplete: (userData: UserData) => void;
}

export interface UserData {
  name: string;
  ageRange: string;
  musicPreference: string;
  gender: string;
}

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    ageRange: '',
    musicPreference: '',
    gender: ''
  });

  const handleNext = () => {
    if (currentStep < 4) {
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
    if (currentStep < 4) {
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

  const updateUserData = (key: keyof UserData, value: string) => {
    setUserData({
      ...userData,
      [key]: value
    });
  };

  const renderOptionButton = (option: string, value: string, dataKey: keyof UserData) => {
    const isSelected = userData[dataKey] === value;
    
    return (
      <TouchableOpacity 
        style={[styles.optionButton, isSelected && styles.selectedOption]} 
        onPress={() => updateUserData(dataKey, value)}
      >
        <Text style={styles.optionText}>{option}</Text>
        <View style={[styles.radioButton, isSelected && styles.radioSelected]} />
      </TouchableOpacity>
    );
  };

  const renderStep = () => {
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
                  placeholderTextColor="rgba(52, 64, 84, 0.5)"
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
            <Text style={styles.subtitleText}>This will help us personalize your recommendations</Text>
            
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
              <TouchableOpacity style={styles.continueButton} onPress={handleComplete}>
                <Text style={styles.continueText}>Get Started</Text>
              </TouchableOpacity>
            )}
          </>
        );
      
      default:
        return null;
    }
  };

  // Dynamically show "Skip" text based on whether it's the last step
  const renderSkipText = () => {
    return currentStep < 4 ? "Skip" : "Skip All";
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f6e1ea', '#fdeef4', '#f5e6f0']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            disabled={currentStep === 1}
          >
            {currentStep > 1 && (
              <Ionicons name="chevron-back" size={24} color="#344054" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>{renderSkipText()}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.progressBar}>
          {[1, 2, 3, 4].map(step => (
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
    color: '#344054',
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
    backgroundColor: 'rgba(52, 64, 84, 0.2)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#344054',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  questionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#344054',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#5D6B98',
    textAlign: 'center',
    marginBottom: 32,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(208, 213, 221, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedOption: {
    borderColor: '#7F56D9',
    backgroundColor: 'rgba(127, 86, 217, 0.08)',
  },
  optionText: {
    fontSize: 16,
    color: '#344054',
    fontWeight: '500',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D0D5DD',
  },
  radioSelected: {
    borderColor: '#7F56D9',
    backgroundColor: '#7F56D9',
  },
  inputContainer: {
    marginBottom: 24,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(208, 213, 221, 0.8)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#344054',
  },
  continueButton: {
    backgroundColor: '#344054',
    borderRadius: 12,
    padding: 16,

    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#D0D5DD',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
