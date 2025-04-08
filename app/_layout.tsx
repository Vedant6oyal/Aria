/// <reference types="@react-navigation/native" />
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/useColorScheme';
import { PlayerProvider, sampleTracks } from '@/context/PlayerContext';
import { ReelsPlayerProvider, sampleReels } from '@/components/ReelsPlayerContext';
import { UserProvider, useUser } from '@/context/UserContext';
import CustomSplashScreen from '@/components/SplashScreen';
import OnboardingScreen from '@/components/OnboardingScreen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const colorScheme = useColorScheme();
  const { hasOnboarded, isLoading, completeOnboarding } = useUser();
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  // DEBUG: Log states to identify the issue
  useEffect(() => {
    console.log('DEBUG - App states:', { showCustomSplash, hasOnboarded, isLoading });
  }, [showCustomSplash, hasOnboarded, isLoading]);

  const handleSplashComplete = () => {
    console.log('DEBUG - Splash animation completed');
    setShowCustomSplash(false);
  };

  const handleOnboardingComplete = async (userData: { 
    name: string; 
    ageRange: string; 
    musicPreference: string; 
    gender: string;
  }) => {
    console.log('DEBUG - Onboarding completed with data:', userData);
    await completeOnboarding();
  };

  // Reset onboarding status for testing (remove in production)
  useEffect(() => {
    const resetOnboarding = async () => {
      try {
        console.log('DEBUG - Resetting onboarding status for testing');
        await AsyncStorage.removeItem('ARIA_HAS_ONBOARDED');
      } catch (error) {
        console.error('Failed to reset onboarding status:', error);
      }
    };
    
    // Enabling the reset function for testing
    resetOnboarding();
  }, []);

  // Determine which screen to show
  if (isLoading) {
    console.log('DEBUG - Still loading user data...');
    return null; // Show nothing while loading AsyncStorage data
  }

  if (showCustomSplash) {
    console.log('DEBUG - Rendering splash screen');
    return <CustomSplashScreen onAnimationComplete={handleSplashComplete} />;
  }

  if (!hasOnboarded) {
    console.log('DEBUG - Rendering onboarding screen');
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  console.log('DEBUG - Rendering main app');
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      // Hide the native splash screen
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <UserProvider>
      <PlayerProvider>
        <ReelsPlayerProvider>
          <AppContent />
        </ReelsPlayerProvider>
      </PlayerProvider>
    </UserProvider>
 );
}
