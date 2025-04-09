import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Video } from 'expo-av';

// Define the reel interface
export interface Reel {
  id: string;
  title: string;
  creator: string;
  thumbnailUrl: string;
  videoUrl?: string;
  duration?: number;
  likes?: number;
  comments?: number;
  shares?: number;
}

// Define the context interface
interface ReelsPlayerContextType {
  currentReel: Reel | null;
  isPlaying: boolean;
  setCurrentReel: (reel: Reel | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlayPause: () => void;
  navigateToReels: () => void;
  progress: number;
  duration: number;
  playbackInstance: Video | null;
  setPlaybackInstance: (instance: Video | null) => void;
}

// Create the context with default values
const ReelsPlayerContext = createContext<ReelsPlayerContextType>({
  currentReel: null,
  isPlaying: false,
  setCurrentReel: () => {},
  setIsPlaying: () => {},
  togglePlayPause: () => {},
  navigateToReels: () => {},
  progress: 0,
  duration: 0,
  playbackInstance: null,
  setPlaybackInstance: () => {},
});

// Create a provider component
export function ReelsPlayerProvider({ children }: { children: ReactNode }) {
  const [currentReel, setCurrentReel] = useState<Reel | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackInstance, setPlaybackInstance] = useState<Video | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Add refs for debouncing toggle operations
  const isTogglingRef = useRef<boolean>(false);
  const lastStateUpdateTimeRef = useRef<number>(0);
  const toggleDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const router = useRouter();

  // Toggle play/pause for the current reel
  const togglePlayPause = async () => {
    console.log("Reels: Toggle play/pause called, current state:", isPlaying, "playbackInstance:", !!playbackInstance);
    
    if (!playbackInstance) {
      console.log("Reels: No playback instance available");
      return;
    }
    
    // Prevent rapid toggles and race conditions
    const now = Date.now();
    if (isTogglingRef.current || (now - lastStateUpdateTimeRef.current < 300)) {
      console.log("Reels: Toggling too fast, ignoring request");
      return;
    }
    
    // Set toggling flag and update timestamp
    isTogglingRef.current = true;
    lastStateUpdateTimeRef.current = now;
    
    try {
      // Set a flag to indicate we're in the middle of a toggle operation
      const newPlayingState = !isPlaying;
      
      // Update state first to make UI responsive
      setIsPlaying(newPlayingState);
      
      if (!newPlayingState) {
        console.log("Reels: Pausing playback");
        await playbackInstance.pauseAsync();
      } else {
        console.log("Reels: Starting playback");
        await playbackInstance.playAsync();
      }
    } catch (error) {
      console.error("Reels: Error toggling playback:", error);
      // Revert state on error
      setIsPlaying(isPlaying);
    } finally {
      // Clear the toggling flag after a short delay to prevent bouncing
      toggleDebounceTimeoutRef.current = setTimeout(() => {
        isTogglingRef.current = false;
      }, 300);
    }
  };

  // Navigate to the full reels screen
  const navigateToReels = () => {
    if (currentReel) {
      router.push('/reels');
    }
  };

  return (
    <ReelsPlayerContext.Provider
      value={{
        currentReel,
        isPlaying,
        setCurrentReel,
        setIsPlaying,
        togglePlayPause,
        navigateToReels,
        progress,
        duration,
        playbackInstance,
        setPlaybackInstance,
      }}
    >
      {children}
    </ReelsPlayerContext.Provider>
  );
}

// Custom hook to use the reels player context
export function useReelsPlayer() {
  return useContext(ReelsPlayerContext);
}

// Sample reels data for testing
export const sampleReels: Reel[] = [
  {
    id: 'reel1',
    title: 'Believe',
    creator: 'Justin Bieber',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
    videoUrl: require('@/assets/audio/Believe.mp4'),
    duration: 180,
    likes: 45200,
    comments: 1250,
    shares: 3800,
  },
  {
    id: 'reel2',
    title: 'Everything Going to Be Alright',
    creator: 'Bob Marley',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop',
    videoUrl: require('@/assets/audio/Everything going to be alright .mp4'),
    duration: 210,
    likes: 78500,
    comments: 2340,
    shares: 5670,
  },
  {
    id: 'reel3',
    title: 'Sample Music',
    creator: 'Aria Artist',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
    videoUrl: require('@/assets/audio/sample.mp4'),
    duration: 160,
    likes: 12300,
    comments: 450,
    shares: 980,
  },
];