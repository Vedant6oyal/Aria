import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Audio, Video } from 'expo-av';

// Define the track interface
export interface Track {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  duration?: number;
  mediaSource?: any;
  isVideo?: boolean;
  coverColor?: string;
  secondaryColor?: string;
  icon?: string;
}

// Define the context interface
interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlayPause: () => void;
  navigateToPlayer: () => void;
  progress: number;
  duration: number;
  playbackInstance: Audio.Sound | Video | null;
  setPlaybackInstance: (instance: Audio.Sound | Video | null) => void;
}

// Create the context with default values
const PlayerContext = createContext<PlayerContextType>({
  currentTrack: null,
  isPlaying: false,
  setCurrentTrack: () => {},
  setIsPlaying: () => {},
  togglePlayPause: () => {},
  navigateToPlayer: () => {},
  progress: 0,
  duration: 0,
  playbackInstance: null,
  setPlaybackInstance: () => {},
});

// Create a provider component
export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackInstance, setPlaybackInstance] = useState<Audio.Sound | Video | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const router = useRouter();

  // Toggle play/pause
  const togglePlayPause = async () => {
    console.log("Toggle play/pause called, current state:", isPlaying, "playbackInstance:", !!playbackInstance);
    
    if (!playbackInstance) {
      console.log("No playback instance available");
      return;
    }
    
    try {
      if (isPlaying) {
        console.log("Pausing playback");
        await playbackInstance.pauseAsync();
      } else {
        console.log("Starting playback");
        await playbackInstance.playAsync();
      }
      
      // Update the state after successful operation
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  };

  // Navigate to the full player screen
  const navigateToPlayer = () => {
    if (currentTrack) {
      router.push('/player');
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        setCurrentTrack,
        setIsPlaying,
        togglePlayPause,
        navigateToPlayer,
        progress,
        duration,
        playbackInstance,
        setPlaybackInstance,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

// Custom hook to use the player context
export function usePlayer() {
  return useContext(PlayerContext);
}

// Sample track data for testing
export const sampleTracks: Track[] = [
  {
    id: '1',
    title: 'Happy Vibes',
    artist: 'Positive Energy',
    artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
    duration: 200,
    isVideo: true,
    coverColor: '#FF7B54',
    secondaryColor: '#8E92EF',
    icon: 'music-note-eighth',
    mediaSource: require('@/assets/audio/sample.mp4'),
  },
  {
    id: '2',
    title: 'Morning Boost',
    artist: 'Mood Lifters',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop',
    duration: 180,
    isVideo: false,
    coverColor: '#FFB26B',
    secondaryColor: '#8E92EF',
    icon: 'music-note',
  },
  {
    id: '3',
    title: 'Positive Energy',
    artist: 'Good Mood Gang',
    artwork: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop',
    duration: 240,
    isVideo: false,
    coverColor: '#FFD56F',
    secondaryColor: '#8E92EF',
    icon: 'music-note-quarter',
  },
];
