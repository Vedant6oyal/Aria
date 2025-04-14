import React, { useEffect, ReactNode } from 'react';
import * as SplashScreen from 'expo-splash-screen';

interface AppLoaderProps {
  children: ReactNode;
}

const AppLoader: React.FC<AppLoaderProps> = ({ children }) => {
  useEffect(() => {
    // Hide the native splash screen once this component (and its children) mount
    console.log('DEBUG - Hiding native splash screen from AppLoader');
    SplashScreen.hideAsync();
  }, []);

  return <>{children}</>; // Render the children passed to it
};

export default AppLoader;