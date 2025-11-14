import { Canvas } from '@react-three/fiber'
import React, { useEffect, useRef, useState } from 'react'
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
  const [isDragging, setIsDragging] = useState(false)
  const dragCounterRef = useRef(0)
  const audioRef = useRef(null)
  const sourceRef = useRef(null)
  const animationFrameIdRef = useRef(null)
  const audioContextRef = useRef(null)
  const audioUrlRef = useRef(null)
  
  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      // Cancel animation frame
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
        animationFrameIdRef.current = null
      }
      
      // Stop and cleanup media element
      if (audioRef.current) {
        const element = audioRef.current
        
        // Call element's cleanup if it exists
        if (element._cleanup) {
          element._cleanup()
        }
        
        element.pause()
        element.src = ''
        
        // Remove video element from DOM if it exists
        if (element.tagName === 'VIDEO' && element.parentNode) {
          element.parentNode.removeChild(element)
        }
      }
      
      // Disconnect audio source
      if (sourceRef.current) {
        try {
          sourceRef.current.disconnect()
        } catch (e) {
          // Source may already be disconnected
        }
        sourceRef.current = null
      }
      
      // Close audio context
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {})
        audioContextRef.current = null
      }
      
      // Revoke object URL
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
        audioUrlRef.current = null
      }
    }
  }, [])

  const handleFileUpload = (file) => {
    if (!file) return
    
    try {
      // Clean up previous resources
      // Cancel animation frame
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
        animationFrameIdRef.current = null
      }
      
      // Stop and cleanup previous media element
      if (audioRef.current) {
        const prevElement = audioRef.current
        
        // Call element's cleanup if it exists
        if (prevElement._cleanup) {
          prevElement._cleanup()
        }
        
        prevElement.pause()
        prevElement.src = ''
        
        // Remove video element from DOM if it exists
        if (prevElement.tagName === 'VIDEO' && prevElement.parentNode) {
          prevElement.parentNode.removeChild(prevElement)
        }
      }
      
      // Disconnect previous audio source
      if (sourceRef.current) {
        try {
          sourceRef.current.disconnect()
        } catch (e) {
          // Source may already be disconnected
        }
        sourceRef.current = null
      }
      
      // Close previous audio context
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {})
        audioContextRef.current = null
      }
      
      // Revoke previous object URL
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
        audioUrlRef.current = null
      }
      
      setAudioFile(file)
      const url = URL.createObjectURL(file)
      setAudioUrl(url)
      audioUrlRef.current = url
      
      // Initialize audio context and analyser
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const analyserNode = ctx.createAnalyser()
      analyserNode.fftSize = 256
      analyserNode.smoothingTimeConstant = 0.8
      
      // Use video element for video files, audio element for audio files
      const isVideo = file.type.startsWith('video/')
      const mediaElement = isVideo 
        ? document.createElement('video')
        : document.createElement('audio')
      
      mediaElement.src = url
      mediaElement.crossOrigin = 'anonymous'
      mediaElement.preload = 'auto'
      
      // For video files, hide the video element (we only want audio)
      if (isVideo) {
        mediaElement.style.display = 'none'
        mediaElement.style.position = 'absolute'
        mediaElement.style.visibility = 'hidden'
        document.body.appendChild(mediaElement)
      }
      
      audioRef.current = mediaElement
      
      // Create media source (can only be done once per element)
      const source = ctx.createMediaElementSource(mediaElement)
      source.connect(analyserNode)
      analyserNode.connect(ctx.destination)
      sourceRef.current = source
      
      setAudioContext(ctx)
      setAnalyser(analyserNode)
      audioContextRef.current = ctx
      
      // Update audio data
      const dataArray = new Uint8Array(analyserNode.frequencyBinCount)
      let isUpdating = false
      
      const updateData = () => {
        if (analyserNode && mediaElement && !mediaElement.paused) {
          analyserNode.getByteFrequencyData(dataArray)
          setAudioData(new Uint8Array(dataArray))
          animationFrameIdRef.current = requestAnimationFrame(updateData)
          isUpdating = true
        } else {
          isUpdating = false
        }
      }
      
      const handlePlay = () => {
        setIsPlaying(true)
        if (ctx.state === 'suspended') {
          ctx.resume()
        }
        if (!isUpdating) {
          updateData()
        }
      }
      
      const handlePause = () => {
        setIsPlaying(false)
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current)
          animationFrameIdRef.current = null
        }
      }
      
      const handleEnded = () => {
        setIsPlaying(false)
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current)
          animationFrameIdRef.current = null
        }
      }
      
      const handleError = (e) => {
        console.error('Media loading error:', e)
        alert('Error loading file. Please ensure it\'s a valid audio or video file.')
        // Cleanup will happen on next file upload or unmount
      }
      
      // Add event listeners
      mediaElement.addEventListener('play', handlePlay)
      mediaElement.addEventListener('pause', handlePause)
      mediaElement.addEventListener('ended', handleEnded)
      mediaElement.addEventListener('error', handleError)
      
      // Store cleanup function for this media element
      mediaElement._cleanup = () => {
        mediaElement.removeEventListener('play', handlePlay)
        mediaElement.removeEventListener('pause', handlePause)
        mediaElement.removeEventListener('ended', handleEnded)
        mediaElement.removeEventListener('error', handleError)
      }
      
    } catch (error) {
      console.error('Error setting up audio:', error)
      alert('Failed to load audio. Please try another file.')
    }
  }

  const handlePlayPause = async () => {
    if (!audioRef.current) return
    
    try {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        await audioRef.current.play()
      }
    } catch (error) {
      console.error('Playback error:', error)
      alert('Unable to play audio. Please check your file and try again.')
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

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current--
    if (dragCounterRef.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current = 0
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      // Check if it's an audio or video file
      if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
        handleFileUpload(file)
      } else {
        alert('Please drop an audio or video file (MP3, WAV, MP4, etc.)')
      }
    }
  }

  return (
    <div 
      className="app"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="drag-overlay">
          <div className="drag-message">
            <div className="drag-icon">📁</div>
            <h2>DROP FILE HERE</h2>
            <p>Audio or Video files</p>
          </div>
        </div>
      )}
      
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

