import { Redirect } from 'expo-router';

/**
 * Redirect from the index route to the Reels screen
 * This ensures that when users navigate to the tabs route, they immediately go to the reels screen
 */
export default function HomeRedirect() {
  return <Redirect href="/(tabs)/reels" />;
}
