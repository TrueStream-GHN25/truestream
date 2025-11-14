import axios from 'axios'
import { useState } from 'react'

/**
 * Hook for integrating with Comet Opik
 * Comet provides experiment tracking and monitoring
 */
export function useComet() {
  const [isTracking, setIsTracking] = useState(false)

  // Configure your Comet API credentials
  // Get these from https://www.comet.com/docs/opik/quickstart
  const COMET_API_KEY = import.meta.env.VITE_COMET_API_KEY || ''
  const COMET_WORKSPACE = import.meta.env.VITE_COMET_WORKSPACE || ''
  const COMET_PROJECT = import.meta.env.VITE_COMET_PROJECT || 'truestream-visualizer'

  const trackExperiment = async (experimentName, data) => {
    try {
      if (!COMET_API_KEY) {
        // Silently skip if no API key - this is expected
        return
      }

      setIsTracking(true)
      
      // Track experiment with Comet Opik
      // This logs events, metrics, and data to Comet
      
      const experimentData = {
        experiment_name: experimentName,
        timestamp: new Date().toISOString(),
        data: data,
        metadata: {
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
          screen_resolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'unknown'
        }
      }

      // Log to Comet
      // In production, you would use Comet's SDK or API
      const response = await axios.post(
        `https://www.comet.com/api/experiment/log`,
        experimentData,
        {
          headers: {
            'Authorization': `Bearer ${COMET_API_KEY}`,
            'Content-Type': 'application/json'
          },
          params: {
            workspace: COMET_WORKSPACE,
            project: COMET_PROJECT
          }
        }
      )

      console.log('Comet tracking:', experimentName, data)
      return response.data
    } catch (err) {
      // Silently fail - tracking shouldn't break the app
      console.warn('Comet tracking error (non-critical):', err.message)
    } finally {
      setIsTracking(false)
    }
  }

  const trackMetric = async (metricName, value, step = null) => {
    if (!COMET_API_KEY) return

    try {
      await axios.post(
        `https://www.comet.com/api/experiment/log-metric`,
        {
          metric_name: metricName,
          value: value,
          step: step,
          timestamp: new Date().toISOString()
        },
        {
          headers: {
            'Authorization': `Bearer ${COMET_API_KEY}`,
            'Content-Type': 'application/json'
          },
          params: {
            workspace: COMET_WORKSPACE,
            project: COMET_PROJECT
          }
        }
      )
    } catch (err) {
      console.error('Comet metric tracking error:', err)
    }
  }

  const trackAudioEvent = async (eventType, audioData) => {
    // Track audio-related events
    await trackExperiment(`audio_${eventType}`, {
      type: eventType,
      audio_length: audioData?.duration || 0,
      audio_format: audioData?.format || 'unknown',
      timestamp: Date.now()
    })
  }

  const trackVisualizationEvent = async (eventType, vizParams) => {
    // Track visualization-related events
    await trackExperiment(`visualization_${eventType}`, {
      type: eventType,
      parameters: vizParams,
      timestamp: Date.now()
    })
  }

  return {
    trackExperiment,
    trackMetric,
    trackAudioEvent,
    trackVisualizationEvent,
    isTracking
  }
}

