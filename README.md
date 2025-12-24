<div align="center">
  <img src="./assets/images/icon.png" alt="Aria Logo" width="120" height="120" />
  
  # 🎵 Aria
  
  ### *Your Personal Music Sanctuary*
  
  [![React Native](https://img.shields.io/badge/React%20Native-0.76.9-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-52.0-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
  
  *A beautifully crafted music streaming experience inspired by modern design principles*
  
  [Features](#-features) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Screenshots](#-screenshots)
  
</div>

---

## ✨ Features

### 🎬 **Immersive Reels Experience**
- **TikTok-style vertical scrolling** for music discovery
- **Full-screen video playback** with smooth transitions
- **Interactive controls** - like, comment, share, and save
- **Auto-play on scroll** with intelligent buffering
- **Background audio support** - music continues even when app is minimized

### 📚 **Rich Music Library**
- **Curated collections** of your favorite tracks
- **Smart categorization** with playlists and albums
- **Quick search** and filter capabilities
- **Offline playback** support (coming soon)

### 🎨 **Beautiful UI/UX**
- **Warm rose & amber color palette** for a soothing experience
- **Smooth animations** powered by React Native Reanimated
- **Adaptive themes** - automatic light/dark mode
- **Gesture-based controls** for intuitive navigation
- **Mini player** with persistent playback controls

### 🚀 **Onboarding & Personalization**
- **Elegant welcome screen** with animated splash
- **Personalized onboarding flow** to collect user preferences
- **Age-appropriate content** recommendations
- **First-time user experience** optimized for engagement

### 🔐 **Authentication & Backend**
- **Supabase integration** for secure authentication
- **User profile management** with AsyncStorage
- **Cloud sync** for playlists and preferences
- **Real-time updates** (configurable)

### 🎧 **Advanced Playback**
- **Lock screen controls** with media metadata
- **Background audio playback** on iOS and Android
- **Seamless transitions** between tracks
- **Custom audio controls** with seek functionality
- **Queue management** for continuous listening

### 📱 **Cross-Platform**
- **iOS** - Native performance with optimized UI
- **Android** - Material Design compliance
- **Web** - Progressive Web App support (experimental)

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **iOS Simulator** (Mac only) or **Android Studio** for emulators

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aria-music.git
   cd aria-music
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   The app uses Supabase for backend services. Update the credentials in `app.json`:
   ```json
   "extra": {
     "supabaseUrl": "YOUR_SUPABASE_URL",
     "supabaseAnonKey": "YOUR_SUPABASE_ANON_KEY"
   }
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your device**
   - **iOS**: Press `i` to open in iOS Simulator
   - **Android**: Press `a` to open in Android Emulator
   - **Physical Device**: Scan the QR code with Expo Go app

### Building for Production

#### iOS
```bash
npx expo run:ios --configuration Release
```

#### Android
```bash
npx expo run:android --variant release
```

---

## 🛠️ Tech Stack

### **Core Technologies**
- **React Native** `0.76.9` - Cross-platform mobile framework
- **Expo** `~52.0` - Development platform and toolchain
- **TypeScript** `5.3.3` - Type-safe JavaScript
- **Expo Router** `4.0.20` - File-based routing system

### **UI & Styling**
- **React Native Paper** `5.13.1` - Material Design components
- **Expo Linear Gradient** - Beautiful gradient effects
- **React Native Reanimated** `3.16.1` - Smooth 60fps animations
- **React Native Vector Icons** - Icon library
- **@expo/vector-icons** - Additional icon sets

### **Media & Playback**
- **Expo AV** `15.0.2` - Audio/video playback engine
- **Expo Video** `2.0.6` - Advanced video player
- **@react-native-community/slider** - Custom audio scrubber

### **Navigation**
- **React Navigation** `7.1.5` - Navigation framework
- **Bottom Tabs Navigator** - Tab-based navigation
- **Stack Navigator** - Screen transitions

### **State Management & Storage**
- **React Context API** - Global state management
- **AsyncStorage** `1.23.1` - Local data persistence
- **Supabase** `2.49.4` - Backend as a Service

### **Developer Experience**
- **Jest** `29.2.1` - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting (configured)

---

## 🏗️ Architecture

### **Project Structure**
```
Aria/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab-based screens
│   │   ├── reels.tsx            # TikTok-style music reels
│   │   ├── library.tsx          # Music library
│   │   ├── profile.tsx          # User profile
│   │   └── ...
│   ├── _layout.tsx              # Root layout
│   └── +not-found.tsx           # 404 page
├── components/                   # Reusable components
│   ├── OnboardingScreen.tsx     # Welcome & onboarding
│   ├── OnboardingPopup.tsx      # User preference popup
│   ├── ReelsMiniPlayer.tsx      # Persistent mini player
│   ├── ReelsPlayerContext.tsx   # Reels state management
│   ├── SplashScreen.tsx         # Custom splash screen
│   └── ui/                      # UI components
├── context/                      # Global state providers
│   ├── PlayerContext.tsx        # Audio player state
│   └── UserContext.tsx          # User data & preferences
├── constants/                    # App constants
│   └── Colors.ts                # Color palette
├── data/                         # Static data & mocks
├── assets/                       # Images, fonts, videos
├── types/                        # TypeScript definitions
└── hooks/                        # Custom React hooks
```

### **Key Design Patterns**

#### **Context-Based State Management**
```typescript
// PlayerContext provides global audio playback state
const { currentTrack, isPlaying, playTrack } = usePlayer();

// ReelsPlayerContext manages video reel state
const { currentReel, togglePlayPause } = useReelsPlayer();
```

#### **File-Based Routing**
Expo Router automatically generates routes from the file structure:
- `app/(tabs)/reels.tsx` → `/reels`
- `app/(tabs)/library.tsx` → `/library`
- `app/(tabs)/profile.tsx` → `/profile`

#### **Component Composition**
Modular components with single responsibility:
- `MiniPlayer` - Persistent playback controls
- `ReelsMiniPlayer` - Video-specific mini player
- `OnboardingScreen` - Multi-step user onboarding

---

## 📸 Screenshots

<div align="center">
  <img src="./screenshots/onboarding.png" width="250" alt="Onboarding" />
  <img src="./screenshots/reels.png" width="250" alt="Reels" />
  <img src="./screenshots/library.png" width="250" alt="Library" />
</div>

<div align="center">
  <img src="./screenshots/player.png" width="250" alt="Player" />
  <img src="./screenshots/profile.png" width="250" alt="Profile" />
  <img src="./screenshots/search.png" width="250" alt="Search" />
</div>

---

## 🎨 Design Philosophy

Aria embraces a **warm, soothing aesthetic** with a carefully curated color palette:

- **Primary**: Rose tones (`#f43f5e`, `#fecdd3`) for warmth and energy
- **Accent**: Amber highlights (`#fffbeb`, `#fef3c7`) for contrast
- **Background**: Soft gradients for depth and visual interest
- **Typography**: Clean, readable fonts with proper hierarchy

The UI follows **modern mobile design principles**:
- ✅ Gesture-first interactions
- ✅ Minimal cognitive load
- ✅ Smooth, delightful animations
- ✅ Accessibility-focused (WCAG 2.1 AA)

---

## 🔧 Configuration

### **Audio Background Mode**
Enable background audio playback in `app.json`:
```json
"ios": {
  "infoPlist": {
    "UIBackgroundModes": ["audio"]
  }
}
```

### **Splash Screen**
Customize the splash screen:
```json
"plugins": [
  ["expo-splash-screen", {
    "image": "./assets/images/splash-icon.png",
    "backgroundColor": "#121212"
  }]
]
```

### **App Icons**
- **iOS**: `assets/images/icon.png` (1024x1024)
- **Android**: `assets/images/adaptive-icon.png` (1024x1024)

---

## 🧪 Testing

Run the test suite:
```bash
npm test
# or
yarn test
```

Run tests in watch mode:
```bash
npm run test:watch
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Code Style**
- Follow the existing code style
- Use TypeScript for type safety
- Write meaningful commit messages
- Add tests for new features

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Expo Team** - For the amazing development platform
- **React Native Community** - For the robust ecosystem
- **Supabase** - For the backend infrastructure
- **Design Inspiration** - Spotify, Apple Music, TikTok

---

## 📧 Contact

**Developer**: Vedant Goyal  


---

<div align="center">
  
  ### ⭐ Star this repo if you like it!
  
  Made with ❤️ and lots of ☕
  
  **[Report Bug](https://github.com/yourusername/aria-music/issues)** • **[Request Feature](https://github.com/yourusername/aria-music/issues)**
  
</div>
