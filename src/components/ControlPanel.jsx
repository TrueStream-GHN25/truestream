import React from 'react'
import './ControlPanel.css'

function ControlPanel({ isPlaying, onPlayPause, audioFile }) {
  return (
    <div className="control-panel">
      <div className="panel-content">
        <div className="panel-section">
          <h3>CONTROLS</h3>
          <button 
            className="play-pause-btn"
            onClick={onPlayPause}
          >
            {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
          </button>
        </div>
        
        {audioFile && (
          <div className="panel-section">
            <h3>TRACK INFO</h3>
            <p className="track-name">{audioFile.name}</p>
            <p className="track-size">
              {(audioFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
        
        <div className="panel-section">
          <h3>VISUALIZER</h3>
          <div className="info-text">
            <p>Synthwave Mode: ACTIVE</p>
            <p>Audio Analysis: {isPlaying ? 'LIVE' : 'STANDBY'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel

