# TrueStream Music Visualizer - Project Summary

## Overview

**TrueStream** is a real-time music visualization agent built with React and Three.js that transforms audio into immersive synthwave-style 3D visualizations. It serves as a music processing and visualization engine that can be integrated into larger projects requiring audio analysis, visualization, and music generation capabilities.

## Core Functionality

### 1. **Audio Processing & Analysis**
- **Real-time Frequency Analysis**: Uses Web Audio API to analyze audio frequencies in real-time (256 FFT size)
- **Audio Context Management**: Handles audio playback, pause, and analysis lifecycle
- **Multi-format Support**: Accepts MP3, WAV, OGG, and other audio formats
- **URL-based Audio Loading**: Can fetch and process audio from remote URLs

### 2. **3D Visualization Engine**
- **Synthwave Aesthetic**: Retro 80s-inspired visual design with neon colors (cyan, magenta, orange)
- **Audio-Reactive Elements**:
  - 64 frequency bars that scale and change color based on audio amplitude
  - Particle system (1000 particles) that reacts to audio
  - Animated grid floor with perspective effects
  - Glowing sun/orb with lens flare effects
  - Wireframe mountains in the background
- **Real-time Rendering**: 60fps Three.js rendering with React Three Fiber

### 3. **Music Source Integration**

#### **File Upload**
- Direct file upload via drag-and-drop or file picker
- Automatic audio format detection and validation
- File metadata tracking (name, size)

#### **Strudel.cc Integration**
- Live coding music generation via Strudel syntax
- Code-to-audio conversion
- Example: `s('c3 e3 g3').slow(2)`
- Hook: `useStrudel()` - `loadStrudelTrack(code)`, `executeStrudelCode(code)`

#### **URL Loading**
- Fetch audio from remote URLs
- Automatic format detection
- CORS handling

### 4. **AI-Powered Features** (via Friendli.ai)

#### **Audio Processing**
- Audio enhancement and processing via serverless endpoints
- Feature extraction (BPM, key, genre analysis)
- Visualization parameter generation based on audio features
- Hook: `useFriendli()` - `processAudio(blob)`, `analyzeAudioFeatures(blob)`, `generateVisualizationParams(features)`

### 5. **Analytics & Tracking** (via Comet Opik)

#### **Experiment Tracking**
- Tracks audio uploads, playback events, and visualization parameters
- Logs user interactions and system metadata
- Metrics tracking for performance analysis
- Hook: `useComet()` - `trackExperiment(name, data)`, `trackMetric(name, value)`, `trackAudioEvent(type, data)`

## Technical Architecture

### **Frontend Stack**
- **React 18.2**: Component-based UI framework
- **Three.js 0.158**: 3D graphics library
- **React Three Fiber 8.15**: React renderer for Three.js
- **Vite 5.0**: Build tool and dev server
- **Web Audio API**: Native browser audio processing

### **Key Components**

1. **`SynthwaveVisualizer.jsx`**: Core 3D visualization component
   - Manages all 3D objects (grid, sun, mountains, bars, particles)
   - Handles audio-reactive animations
   - Updates at 60fps using `useFrame` hook

2. **`MusicUploader.jsx`**: Audio input interface
   - Three input methods (file, Strudel, URL)
   - Integrates with all three service hooks
   - Handles file validation and processing

3. **`ControlPanel.jsx`**: Playback controls
   - Play/pause functionality
   - Track information display
   - Visualizer status indicators

4. **`App.jsx`**: Main application orchestrator
   - Manages audio context and analyser
   - Coordinates between components
   - Handles audio lifecycle (play, pause, end)

### **Integration Hooks**

Located in `src/hooks/`:

- **`useStrudel.js`**: Strudel.cc music generation
- **`useFriendli.js`**: AI audio processing
- **`useComet.js`**: Analytics and experiment tracking

## API & Integration Points

### **Input Methods**
1. **File Upload**: `handleFileUpload(file: File)`
2. **Strudel Code**: `handleStrudelLoad(code: string)`
3. **URL**: `handleUrlSubmit(url: string)`

### **Output Data**
- **Audio Data**: `Uint8Array` frequency data (128 values, updated at 60fps)
- **Playback State**: `isPlaying: boolean`
- **Audio Context**: Web Audio API context and analyser nodes

### **Event Callbacks**
- `onFileUpload(file)`: Triggered when audio file is loaded
- `onStrudelLoad(code)`: Triggered when Strudel code is executed
- `onPlayPause()`: Playback control

## Use Cases for Integration

### 1. **Music Streaming Platform**
- Real-time visualization for music players
- Audio analysis for recommendation engines
- User engagement tracking via Comet

### 2. **Music Production Tool**
- Visual feedback during music creation
- Integration with DAWs via Strudel
- AI-assisted audio enhancement via Friendli

### 3. **Live Performance System**
- Real-time visualization for concerts/events
- Audio-reactive stage visuals
- Performance analytics

### 4. **Music Education Platform**
- Visual representation of music theory
- Interactive music generation via Strudel
- Learning analytics via Comet

### 5. **Social Media Music App**
- Shareable music visualizations
- AI-generated visual effects
- User behavior tracking

## Data Flow

```
Audio Input (File/Strudel/URL)
    ↓
Web Audio API Processing
    ↓
Frequency Analysis (FFT)
    ↓
Audio Data Array (Uint8Array)
    ↓
3D Visualizer (React Three Fiber)
    ↓
Real-time Rendering (60fps)
    ↓
Optional: AI Processing (Friendli)
    ↓
Optional: Analytics (Comet)
```

## Environment Configuration

Required environment variables (optional - app works without them):

```env
VITE_FRIENDLI_API_URL=https://api.friendli.ai/v1
VITE_FRIENDLI_API_KEY=your_key
VITE_COMET_API_KEY=your_key
VITE_COMET_WORKSPACE=your_workspace
VITE_COMET_PROJECT=truestream-visualizer
```

## Performance Characteristics

- **Rendering**: 60fps target with Three.js
- **Audio Analysis**: Real-time, 256 FFT size (128 frequency bins)
- **Memory**: Efficient buffer management, automatic cleanup
- **Network**: Optional API calls (gracefully handles failures)

## Dependencies

### Core
- `react`, `react-dom`: UI framework
- `three`: 3D graphics
- `@react-three/fiber`: React Three.js integration
- `@react-three/drei`: Three.js helpers

### Audio
- `tone`: Audio synthesis (available but not actively used)
- `wavesurfer.js`: Waveform visualization (available but not actively used)

### Utilities
- `axios`: HTTP client for API integrations

## Build & Deployment

```bash
# Development
npm run dev          # Starts dev server on :3000

# Production
npm run build        # Creates optimized build in /dist
npm run preview      # Preview production build
```

## Connection Points for Other Projects

### **As a Microservice**
- Expose audio analysis endpoints
- Provide visualization data via WebSocket
- Serve as visualization component library

### **As a Component Library**
- Import `SynthwaveVisualizer` component
- Use hooks (`useStrudel`, `useFriendli`, `useComet`) independently
- Integrate audio processing logic

### **As a Standalone App**
- Deploy as independent visualization tool
- Embed via iframe
- Use as music player with visual feedback

## Key Features Summary

✅ Real-time audio frequency analysis  
✅ 3D synthwave visualization (64 bars, 1000 particles)  
✅ Multiple audio input methods (file, code, URL)  
✅ AI-powered audio processing (optional)  
✅ Analytics and experiment tracking (optional)  
✅ Responsive, modern UI with error handling  
✅ Production-ready build system  

## Repository

**GitHub**: https://github.com/TrueStream-GHN25/truestream

---

*This agent serves as a complete music visualization solution that can be integrated into larger music platforms, production tools, or used as a standalone visualization application.*

