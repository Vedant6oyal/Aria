import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  name: string;
  age: number | null;
}

interface UserContextType {
  userData: UserData | null;
  hasOnboarded: boolean;
  isLoading: boolean;
  updateUserData: (data: UserData) => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const defaultUserContext: UserContextType = {
  userData: null,
  hasOnboarded: false,
  isLoading: true,
  updateUserData: async () => {},
  completeOnboarding: async () => {},
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [userDataJson, hasOnboardedValue] = await Promise.all([
          AsyncStorage.getItem('ARIA_USER_DATA'),
          AsyncStorage.getItem('ARIA_HAS_ONBOARDED')
        ]);

        if (userDataJson) {
          setUserData(JSON.parse(userDataJson));
        }

        setHasOnboarded(hasOnboardedValue === 'true');
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const updateUserData = async (data: UserData) => {
    try {
      await AsyncStorage.setItem('ARIA_USER_DATA', JSON.stringify(data));
      setUserData(data);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('ARIA_HAS_ONBOARDED', 'true');
      setHasOnboarded(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        hasOnboarded,
        isLoading,
        updateUserData,
        completeOnboarding,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
