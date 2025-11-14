import axios from 'axios'
import { useState } from 'react'

/**
 * Hook for integrating with Friendli.ai serverless endpoints
 * Friendli provides AI-powered tool calling capabilities
 */
export function useFriendli() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  // Configure your Friendli endpoint
  // You'll need to set up your serverless endpoint and get the API key
  const FRIENDLI_API_URL = import.meta.env.VITE_FRIENDLI_API_URL || 'https://api.friendli.ai/v1'
  const FRIENDLI_API_KEY = import.meta.env.VITE_FRIENDLI_API_KEY || ''

  const processAudio = async (audioBlob) => {
    try {
      // If no API key, just return the blob as-is
      if (!FRIENDLI_API_KEY) {
        return audioBlob
      }

      setIsProcessing(true)
      setError(null)
      
      // Example: Use Friendli to analyze or enhance audio
      // This would call your serverless endpoint configured with Friendli
      
      const formData = new FormData()
      formData.append('audio', audioBlob, 'audio.mp3')
      
      const response = await axios.post(
        `${FRIENDLI_API_URL}/audio/process`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${FRIENDLI_API_KEY}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      
      return response.data
    } catch (err) {
      console.warn('Friendli processing error (non-critical):', err.message)
      setError(err.message)
      // Return original blob if processing fails
      return audioBlob
    } finally {
      setIsProcessing(false)
    }
  }

  const analyzeAudioFeatures = async (audioBlob) => {
    // Use Friendli AI to analyze audio features
    // This could extract BPM, key, genre, etc.
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)
      
      const response = await axios.post(
        `${FRIENDLI_API_URL}/audio/analyze`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${FRIENDLI_API_KEY}`,
          }
        }
      )
      
      return response.data
    } catch (err) {
      console.error('Friendli analysis error:', err)
      return null
    }
  }

  const generateVisualizationParams = async (audioFeatures) => {
    // Use Friendli AI to generate visualization parameters
    // based on audio features
    try {
      const response = await axios.post(
        `${FRIENDLI_API_URL}/visualization/generate`,
        { features: audioFeatures },
        {
          headers: {
            'Authorization': `Bearer ${FRIENDLI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      return response.data
    } catch (err) {
      console.error('Friendli visualization generation error:', err)
      return null
    }
  }

  return {
    processAudio,
    analyzeAudioFeatures,
    generateVisualizationParams,
    isProcessing,
    error
  }
}

