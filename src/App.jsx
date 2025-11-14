import { Canvas } from '@react-three/fiber'
import React, { useRef, useState } from 'react'
import './App.css'
import ControlPanel from './components/ControlPanel'
import MusicUploader from './components/MusicUploader'
import SynthwaveVisualizer from './components/SynthwaveVisualizer'

function App() {
  const [audioFile, setAudioFile] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioContext, setAudioContext] = useState(null)
  const [analyser, setAnalyser] = useState(null)
  const [audioData, setAudioData] = useState(null)
  const audioRef = useRef(null)
  const sourceRef = useRef(null)

  const handleFileUpload = (file) => {
    if (file) {
      setAudioFile(file)
      const url = URL.createObjectURL(file)
      setAudioUrl(url)
      
      // Initialize audio context and analyser
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const analyserNode = ctx.createAnalyser()
      analyserNode.fftSize = 256
      
      const audio = new Audio(url)
      audioRef.current = audio
      
      // Create media source
      const source = ctx.createMediaElementSource(audio)
      source.connect(analyserNode)
      analyserNode.connect(ctx.destination)
      sourceRef.current = source
      
      setAudioContext(ctx)
      setAnalyser(analyserNode)
      
      // Update audio data
      const dataArray = new Uint8Array(analyserNode.frequencyBinCount)
      let animationFrameId = null
      
      const updateData = () => {
        analyserNode.getByteFrequencyData(dataArray)
        setAudioData(new Uint8Array(dataArray))
        animationFrameId = requestAnimationFrame(updateData)
      }
      
      audio.addEventListener('play', () => {
        setIsPlaying(true)
        if (ctx.state === 'suspended') {
          ctx.resume()
        }
        updateData()
      })
      
      audio.addEventListener('pause', () => {
        setIsPlaying(false)
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
        }
      })
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false)
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
        }
      })
    }
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
    }
  }

  const handleStrudelLoad = async (strudelCode) => {
    // Integration with Strudel.cc
    try {
      // This would integrate with Strudel's API
      console.log('Loading Strudel code:', strudelCode)
      // Implementation would go here
    } catch (error) {
      console.error('Error loading Strudel:', error)
    }
  }

  return (
    <div className="app">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#0a0a0a' }}
      >
        <SynthwaveVisualizer 
          audioData={audioData}
          isPlaying={isPlaying}
        />
      </Canvas>
      
      <ControlPanel
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        audioFile={audioFile}
      />
      
      <MusicUploader
        onFileUpload={handleFileUpload}
        onStrudelLoad={handleStrudelLoad}
      />
    </div>
  )
}

export default App

