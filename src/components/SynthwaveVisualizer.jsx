import { useFrame } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

function SynthwaveVisualizer({ audioData, isPlaying }) {
  const gridRef = useRef()
  const sunRef = useRef()
  const mountainsRef = useRef()
  const particlesRef = useRef()
  const barsRef = useRef([])

  // Create grid
  const gridGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices = []
    const colors = []
    
    for (let i = -50; i <= 50; i++) {
      // Horizontal lines
      vertices.push(-50, 0, i, 50, 0, i)
      const color = new THREE.Color(0x00ffff)
      colors.push(color.r, color.g, color.b, color.r, color.g, color.b)
      
      // Vertical lines
      vertices.push(i, 0, -50, i, 0, 50)
      colors.push(color.r, color.g, color.b, color.r, color.g, color.b)
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    
    return geometry
  }, [])

  // Create mountains
  const mountainGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices = []
    const segments = 100
    
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * 100 - 50
      const y = Math.sin(x * 0.1) * 5 + Math.random() * 2
      vertices.push(x, y, -30)
    }
    
    // Create triangles for mountain shape
    const indices = []
    for (let i = 0; i < segments; i++) {
      indices.push(0, i, i + 1) // Connect to origin for triangle fan
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.setIndex(indices)
    
    return geometry
  }, [])

  // Audio-reactive bars
  const bars = useMemo(() => {
    const barArray = []
    const barCount = 64
    
    for (let i = 0; i < barCount; i++) {
      barArray.push({
        position: [(i - barCount / 2) * 0.3, -4, 0],
        index: i
      })
    }
    
    return barArray
  }, [])

  // Particle positions
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(1000 * 3)
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    return positions
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Animate grid
    if (gridRef.current) {
      gridRef.current.rotation.x = Math.sin(time * 0.1) * 0.1
      gridRef.current.position.y = Math.sin(time * 0.2) * 0.5
    }
    
    // Animate sun
    if (sunRef.current) {
      sunRef.current.position.y = 3 + Math.sin(time * 0.3) * 0.5
      sunRef.current.rotation.z += 0.01
    }
    
    // Animate mountains
    if (mountainsRef.current) {
      mountainsRef.current.rotation.y = Math.sin(time * 0.05) * 0.1
    }
    
    // Audio-reactive bars
    if (audioData && barsRef.current.length > 0) {
      const barCount = bars.length
      barsRef.current.forEach((bar, index) => {
        if (bar) {
          const dataIndex = Math.floor((index / barCount) * audioData.length)
          const amplitude = audioData[dataIndex] / 255
          const scale = 0.1 + amplitude * 2
          bar.scale.y = scale
          bar.position.y = -4 + scale / 2
          
          // Color based on amplitude
          const color = new THREE.Color()
          color.setHSL(0.5 + amplitude * 0.3, 1, 0.5 + amplitude * 0.5)
          bar.material.color = color
        }
      })
    }
    
    // Particles - audio reactive
    if (particlesRef.current && audioData) {
      particlesRef.current.rotation.y += 0.001
      particlesRef.current.rotation.x += 0.0005
      
      // Make particles react to audio
      const positions = particlesRef.current.geometry.attributes.position.array
      const avgAmplitude = audioData.reduce((a, b) => a + b, 0) / audioData.length / 255
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + i) * avgAmplitude * 0.01
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    } else if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001
      particlesRef.current.rotation.x += 0.0005
    }
  })

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Directional light for bars */}
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      
      {/* Sun with glow */}
      <pointLight position={[0, 3, 0]} intensity={2} color="#ff6b00" />
      <mesh ref={sunRef} position={[0, 3, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ff6b00" />
      </mesh>
      {/* Sun glow effect */}
      <mesh position={[0, 3, 0]} scale={[1.5, 1.5, 1.5]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ff6b00" transparent opacity={0.3} />
      </mesh>
      
      {/* Grid floor */}
      <lineSegments ref={gridRef} geometry={gridGeometry}>
        <lineBasicMaterial vertexColors={true} opacity={0.3} transparent />
      </lineSegments>
      
      {/* Mountains */}
      <mesh ref={mountainsRef} geometry={mountainGeometry} position={[0, -2, -20]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#ff00ff" wireframe />
      </mesh>
      
      {/* Audio-reactive bars */}
      {bars.map((bar, index) => (
        <mesh
          key={index}
          ref={(el) => (barsRef.current[index] = el)}
          position={bar.position}
          scale={[0.2, 0.1, 0.2]}
        >
          <boxGeometry />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      
      {/* Particle system */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={1000}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.15} 
          color="#00ffff" 
          transparent 
          opacity={0.6}
          sizeAttenuation={true}
        />
      </points>
      
      {/* Camera controls */}
      <fog attach="fog" args={['#0a0a0a', 10, 50]} />
    </>
  )
}

export default SynthwaveVisualizer

