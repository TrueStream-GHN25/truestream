import React, { useState } from 'react'
import { useComet } from '../hooks/useComet'
import { useFriendli } from '../hooks/useFriendli'
import { useStrudel } from '../hooks/useStrudel'
import './MusicUploader.css'

function MusicUploader({ onFileUpload, onStrudelLoad }) {
  const [uploadMethod, setUploadMethod] = useState('file') // 'file', 'strudel', 'url'
  const [strudelCode, setStrudelCode] = useState('')
  const [songUrl, setSongUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  const { loadStrudelTrack } = useStrudel()
  const { processAudio } = useFriendli()
  const { trackExperiment } = useComet()

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('audio/')) {
      onFileUpload(file)
      // Track asynchronously - don't block file upload
      trackExperiment('file_upload', { filename: file.name, size: file.size }).catch(() => {})
    }
  }

  const handleStrudelSubmit = async () => {
    setIsProcessing(true)
    try {
      const track = await loadStrudelTrack(strudelCode)
      if (track) {
        onStrudelLoad(strudelCode)
        trackExperiment('strudel_load', { code: strudelCode }).catch(() => {})
      }
    } catch (error) {
      console.error('Error loading Strudel track:', error)
      alert('Failed to load Strudel track. Please check your code.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUrlSubmit = async () => {
    if (!songUrl) return
    
    setIsProcessing(true)
    try {
      // Fetch audio from URL
      const response = await fetch(songUrl)
      const blob = await response.blob()
      const file = new File([blob], 'audio.mp3', { type: 'audio/mpeg' })
      
      // Process with Friendli if needed (non-blocking)
      processAudio(blob).catch(() => {})
      
      onFileUpload(file)
      trackExperiment('url_load', { url: songUrl }).catch(() => {})
    } catch (error) {
      console.error('Error loading audio from URL:', error)
      alert('Failed to load audio from URL. Please check the link.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="music-uploader">
      <div className="uploader-header">
        <h2>MUSIC SOURCE</h2>
      </div>
      
      <div className="upload-tabs">
        <button
          className={uploadMethod === 'file' ? 'tab active' : 'tab'}
          onClick={() => setUploadMethod('file')}
        >
          UPLOAD FILE
        </button>
        <button
          className={uploadMethod === 'strudel' ? 'tab active' : 'tab'}
          onClick={() => setUploadMethod('strudel')}
        >
          STRUDEL.CC
        </button>
        <button
          className={uploadMethod === 'url' ? 'tab active' : 'tab'}
          onClick={() => setUploadMethod('url')}
        >
          URL
        </button>
      </div>

      <div className="upload-content">
        {uploadMethod === 'file' && (
          <div className="upload-section">
            <label className="file-input-label">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="file-input"
              />
              <span className="file-input-text">
                {isProcessing ? 'PROCESSING...' : 'CHOOSE AUDIO FILE'}
              </span>
            </label>
            <p className="upload-hint">
              Supports MP3, WAV, OGG, and other audio formats
            </p>
          </div>
        )}

        {uploadMethod === 'strudel' && (
          <div className="upload-section">
            <textarea
              className="strudel-input"
              placeholder="Enter Strudel code here...&#10;Example:&#10;s('c3 e3 g3').slow(2)"
              value={strudelCode}
              onChange={(e) => setStrudelCode(e.target.value)}
              rows={6}
            />
            <button
              className="submit-btn"
              onClick={handleStrudelSubmit}
              disabled={isProcessing || !strudelCode.trim()}
            >
              {isProcessing ? 'LOADING...' : 'LOAD STRUDEL TRACK'}
            </button>
            <p className="upload-hint">
              Enter Strudel code to generate music. Visit{' '}
              <a href="https://strudel.cc" target="_blank" rel="noopener noreferrer">
                strudel.cc
              </a>{' '}
              for examples.
            </p>
          </div>
        )}

        {uploadMethod === 'url' && (
          <div className="upload-section">
            <input
              type="text"
              className="url-input"
              placeholder="Enter audio URL (MP3, WAV, etc.)"
              value={songUrl}
              onChange={(e) => setSongUrl(e.target.value)}
            />
            <button
              className="submit-btn"
              onClick={handleUrlSubmit}
              disabled={isProcessing || !songUrl.trim()}
            >
              {isProcessing ? 'LOADING...' : 'LOAD FROM URL'}
            </button>
            <p className="upload-hint">
              Enter a direct link to an audio file
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MusicUploader

