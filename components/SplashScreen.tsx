import { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const iconFadeAnim = useRef(new Animated.Value(0)).current;
  const titleFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('DEBUG - Starting splash screen animations');
    
    // Reduced animation durations for faster testing
    const animationDuration = 500; // Reduced from 800
    
    // Sequence of animations
    Animated.sequence([
      // First fade in the icon
      Animated.timing(iconFadeAnim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      // Then animate the icon scale
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: animationDuration / 2,
        useNativeDriver: true,
      }),
      // Fade in the title
      Animated.timing(titleFadeAnim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      // Finally fade in the background
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      console.log('DEBUG - Animations completed, will call onAnimationComplete in 500ms');
      
      // Slight delay before calling the completion function
      setTimeout(() => {
        console.log('DEBUG - Calling onAnimationComplete now');
        onAnimationComplete();
      }, 500);
    });
    
    // Force completion after a timeout as a fallback
    const forceCompletionTimeout = setTimeout(() => {
      console.log('DEBUG - Force completing animation after timeout');
      onAnimationComplete();
    }, 5000); // 5 seconds max for splash screen
    
    return () => {
      clearTimeout(forceCompletionTimeout);
    };
  }, [onAnimationComplete]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c0668', '#9921e8', '#5643fd']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animated.View style={{ opacity: iconFadeAnim }}>
            <View style={styles.iconContainer}>
              <Ionicons name="musical-notes" size={60} color="#ffffff" />
            </View>
          </Animated.View>
          
          <Animated.View style={{ opacity: titleFadeAnim }}>
            <Text style={styles.title}>ARIA</Text>
            <Text style={styles.subtitle}>Your music, reimagined</Text>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 10,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
});
