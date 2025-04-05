/**
 * Enhanced Colors for the Aria music app, creating a sophisticated yet uplifting experience.
 * The palette employs a musical gradient concept with harmonious transitions between colors.
 * Inspired by sunset-to-twilight transitions for an immersive and emotional music journey.
 */

// Primary colors inspired by sunset hues for warmth and emotion
const primaryLight = '#FF7B54'; // Warm coral orange
const secondaryLight = '#8E92EF'; // Soft lavender purple
const accentLight = '#00CCB4'; // Fresh teal
const positiveGreen = '#36D97F'; // Vibrant jade green

// Dark mode variants with higher luminance for contrast
const primaryDark = '#FF9A76'; // Luminous coral
const secondaryDark = '#AEB1FF'; // Bright lavender
const accentDark = '#40E0D0'; // Brighter turquoise
const neutralLight = '#F8F0E5'; // Warm cream

export const Colors = {
  light: {
    text: '#2F3542', // Deep charcoal for better readability
    background: '#FFF7ED', // Soft warm background
    tint: primaryLight,
    icon: '#566270', // Subtle slate
    tabIconDefault: '#9CA3AF', // Neutral gray
    tabIconSelected: primaryLight,
    secondary: secondaryLight,
    accent: accentLight,
    positive: positiveGreen,
    cardBackground: '#FFFFFF',
    border: '#EEE3D6', // Subtle cream border
    gradient: ['#FF7B54', '#FFB26B'], // Warm gradient
    overlay: 'rgba(255, 123, 84, 0.05)', // Subtle overlay
    highlight: '#FFE0CA', // Soft highlight
  },
  dark: {
    text: '#F8F9FA',
    background: '#1E1E2E', // Rich deep background
    tint: primaryDark,
    icon: '#E2E8F0', 
    tabIconDefault: '#94A3B8',
    tabIconSelected: primaryDark,
    secondary: secondaryDark,
    accent: accentDark,
    positive: '#4ECCA3', // Brighter green for dark mode
    cardBackground: '#2A2C39', // Slightly lighter than background
    border: '#393E4D', // Subtle border
    gradient: ['#FF9A76', '#FFBC80'], // Warm gradient
    overlay: 'rgba(255, 154, 118, 0.08)', // Subtle overlay
    highlight: '#332B25', // Subtle highlight
  },
  // Common colors that work in both themes
  common: {
    error: '#FF6B6B',
    warning: '#FFD93D',
    info: '#6BBCFF',
    success: '#4ECCA3',
    musicVisualizer: ['#FF7B54', '#8E92EF', '#36D97F', '#00CCB4'], // For audio visualization
  }
};