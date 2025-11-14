# TrueStream - Synthwave Music Visualizer

A cool Three.js-based synthwave music visualizer with editing capabilities, featuring integrations with Strudel.cc, Friendli.ai, and Comet Opik.

## Features

- 🎵 **Music Upload**: Upload audio files directly
- 🎹 **Strudel.cc Integration**: Load music from Strudel code
- 🔗 **URL Support**: Load audio from URLs
- 🎨 **Synthwave Aesthetics**: Retro 80s-inspired visuals
- 📊 **Real-time Audio Analysis**: Live frequency visualization
- 🤖 **AI Processing**: Friendli.ai integration for audio enhancement
- 📈 **Experiment Tracking**: Comet Opik integration for analytics

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (optional):
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. Start the development server:
```bash
npm run dev
```

## Configuration

### Strudel.cc
Strudel.cc is a live coding environment for music. You can enter Strudel code in the uploader to generate music.

Example Strudel code:
```
s('c3 e3 g3').slow(2)
```

### Friendli.ai
Configure your Friendli.ai serverless endpoint in `.env`:
- `VITE_FRIENDLI_API_URL`: Your Friendli API endpoint
- `VITE_FRIENDLI_API_KEY`: Your Friendli API key

### Comet Opik
Configure Comet for experiment tracking in `.env`:
- `VITE_COMET_API_KEY`: Your Comet API key
- `VITE_COMET_WORKSPACE`: Your workspace name
- `VITE_COMET_PROJECT`: Project name (default: truestream-visualizer)

## Usage

1. **Upload Music**: Click "UPLOAD FILE" and select an audio file
2. **Use Strudel**: Switch to "STRUDEL.CC" tab and enter Strudel code
3. **Load from URL**: Switch to "URL" tab and paste an audio file URL
4. **Control Playback**: Use the control panel to play/pause
5. **Watch the Visuals**: Enjoy the real-time synthwave visualization!

## Technologies

- **React**: UI framework
- **Three.js**: 3D graphics and visualization
- **React Three Fiber**: React renderer for Three.js
- **Web Audio API**: Audio analysis and processing
- **Strudel.cc**: Music generation
- **Friendli.ai**: AI-powered audio processing
- **Comet Opik**: Experiment tracking

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

MIT

