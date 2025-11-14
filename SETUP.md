# Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   The app will automatically open at `http://localhost:3000`

## API Configuration (Optional)

### Strudel.cc
No API key required! Strudel.cc can be used directly in the browser. Just enter your Strudel code in the uploader.

Example Strudel code:
```javascript
s('c3 e3 g3').slow(2)
```

### Friendli.ai
1. Sign up at [Friendli.ai](https://friendli.ai)
2. Create a serverless endpoint following their [tutorial](https://friendli.ai/docs/guides/tutorials/tool-calling-with-serverless-endpoints)
3. Add your API key to `.env`:
   ```
   VITE_FRIENDLI_API_URL=your_endpoint_url
   VITE_FRIENDLI_API_KEY=your_api_key
   ```

### Comet Opik
1. Sign up at [Comet.com](https://www.comet.com)
2. Get your API key from the dashboard
3. Add to `.env`:
   ```
   VITE_COMET_API_KEY=your_api_key
   VITE_COMET_WORKSPACE=your_workspace
   VITE_COMET_PROJECT=truestream-visualizer
   ```

## Features

- **File Upload**: Drag and drop or click to upload audio files
- **Strudel Integration**: Enter Strudel code to generate music
- **URL Loading**: Load audio from any direct URL
- **Real-time Visualization**: Watch your music come to life with synthwave visuals
- **Audio Analysis**: Live frequency analysis drives the visualization

## Troubleshooting

### Audio not playing?
- Make sure you've uploaded a valid audio file
- Check browser console for errors
- Some browsers require user interaction before playing audio

### Visualizer not reacting?
- Make sure audio is playing
- Check that the audio file loaded successfully
- Try refreshing the page

### API errors?
- Verify your API keys are correct in `.env`
- Check that the services are accessible
- API integrations are optional - the visualizer works without them!

