# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MLC Soundboard is a React Native (v0.39.2) application that provides a soundboard for Mountain Lair Camp. The app downloads sound files from Azure Blob Storage and allows users to play them offline.

## Key Commands

### Development
```bash
# Install dependencies
npm install

# Start React Native packager
npm start

# Run on Android
react-native run-android

# Run on iOS
react-native run-ios

# Run tests
npm test
```

### Build Commands
```bash
# Android build
cd android && ./gradlew assembleDebug

# iOS build (requires Xcode)
cd ios && open mlcSoundboard.xcodeproj
```

### Clean Builds
```bash
# Clean Android build
cd android && ./gradlew clean

# Clean iOS build
cd ios && rm -rf build/
```

## Architecture Overview

### Core Application Flow
1. **main.js**: Central component that manages the entire soundboard functionality
   - Fetches sound manifest from Azure Blob Storage
   - Downloads and caches sound files locally
   - Manages playback state and UI updates

2. **Sound Storage**: 
   - Remote: `https://mountainlaircamp.blob.core.windows.net/mlcsoundbank/`
   - Local: Device document directory via `react-native-fetch-blob`
   - Manifest: `MLCSoundBank.json` contains metadata for all sounds

3. **Platform Entry Points**:
   - `index.android.js`: Android-specific initialization
   - `index.ios.js`: iOS-specific initialization

### Key Technologies
- **UI Framework**: Native Base 0.5.18 for cross-platform components
- **Audio Playback**: react-native-sound for playing audio files
- **File Management**: react-native-fetch-blob for downloading and storing files
- **Functional Programming**: Ramda for data transformations
- **State Management**: React component state (no Redux/MobX)

### Sound Data Structure
Each sound object contains:
- `Name`: Display name
- `Path`: Relative path to sound file
- `Tags`: Array of categorization tags
- `SortOrder`: Display order
- `LastModified`: Timestamp for sync updates

### Critical Functions in main.js
- `componentWillMount()`: Initializes app, loads cached sounds, checks for updates
- `loadSounds()`: Main sync function that downloads new/updated sounds
- `playSound()`: Handles audio playback with error handling
- `setupAndPlay()`: Platform-specific sound setup (especially for Android)

## Development Notes

### Platform Differences
- Android requires directory creation logic in `ensureDirectoryExists()`
- iOS handles directories automatically
- Both platforms use different base paths for document storage

### Testing
- Jest tests exist in `__tests__/` but are minimal
- No ESLint configuration file exists despite dependencies being installed

### Legacy Considerations
- Uses React Native 0.39.2 (2016 era) - very outdated
- Compatibility issues likely with modern Node.js, Xcode, and Android Studio
- Consider upgrading dependencies for continued development

### Network and Storage
- App works offline after initial sync
- Uses AsyncStorage to cache sound metadata
- Implements smart sync - only downloads changed files
- Network connectivity check before sync operations