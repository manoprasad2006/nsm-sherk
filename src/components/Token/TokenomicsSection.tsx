import React, { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

interface TokenomicsItem {
  label: string
  percentage: number
  color: string
}

interface TokenomicsSectionProps {
  tokenomics?: TokenomicsItem[]
}

const defaultTokenomics: TokenomicsItem[] = [
  { label: 'Community Open Mint', percentage: 70, color: '#1BD6D1' },
  { label: 'Future Developments', percentage: 5, color: '#06B6D4' },
  { label: 'Airdrop for NFT Holders', percentage: 5, color: '#0891B2' },
  { label: 'Giveaways & Marketing', percentage: 5, color: '#0E7490' },
  { label: 'Exchange Listings, Dex & Pools', percentage: 5, color: '#164E63' },
  { label: 'Team (In Future)', percentage: 5, color: '#164E63' },
  { label: 'Dev Wallet', percentage: 5, color: '#164E63' },
]

const PieChart3D = ({ tokenomics, hoveredIndex, setHoveredIndex }) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const sectorsRef = useRef<THREE.Mesh[]>([])
  const labelsRef = useRef<THREE.Mesh[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f172a)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.set(3, 4, 6)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(400, 400)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    mountRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
    directionalLight.position.set(8, 12, 6)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 50
    scene.add(directionalLight)

    // Rim lighting
    const rimLight = new THREE.DirectionalLight(0x00ffff, 0.5)
    rimLight.position.set(-5, 2, -5)
    scene.add(rimLight)

    // Point lights for dramatic effect
    const pointLight1 = new THREE.PointLight(0x1BD6D1, 0.8, 10)
    pointLight1.position.set(2, 3, 2)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x06B6D4, 0.6, 8)
    pointLight2.position.set(-2, 2, -2)
    scene.add(pointLight2)

    // Create base platform
    const platformGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.05, 64)
    const platformMaterial = new THREE.MeshPhongMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.3,
      shininess: 200
    })
    const platform = new THREE.Mesh(platformGeometry, platformMaterial)
    platform.position.y = -0.35
    platform.receiveShadow = true
    scene.add(platform)

    // Create pie chart sectors with enhanced details
    const radius = 2.2
    const height = 0.8
    const sectors: THREE.Mesh[] = []
    const labels: THREE.Mesh[] = []
    
    let currentAngle = 0
    
    tokenomics.forEach((item, index) => {
      const angle = (item.percentage / 100) * Math.PI * 2
      
      // Create detailed sector geometry with more segments
      const geometry = new THREE.CylinderGeometry(radius, radius, height, 64, 1, false, currentAngle, angle)
      
      // Enhanced material with better reflections and textures
      const material = new THREE.MeshPhongMaterial({
        color: item.color,
        transparent: true,
        opacity: 0.95,
        shininess: 150,
        specular: 0x111111,
        reflectivity: 0.3
      })
      
      const sector = new THREE.Mesh(geometry, material)
      sector.castShadow = true
      sector.receiveShadow = true
      
      // Add edge highlights
      const edgeGeometry = new THREE.EdgesGeometry(geometry)
      const edgeMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.1 
      })
      const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial)
      sector.add(edges)
      
      // Store original position and material for animations
      sector.userData = {
        originalY: 0,
        originalColor: item.color,
        index: index,
        hovered: false,
        angle: currentAngle + angle / 2
      }
      
      scene.add(sector)
      sectors.push(sector)
      
      // Create floating percentage labels
      const labelRadius = radius + 0.8
      const labelX = Math.cos(currentAngle + angle / 2) * labelRadius
      const labelZ = Math.sin(currentAngle + angle / 2) * labelRadius
      
      // Create canvas for text
      const canvas = document.createElement('canvas')
      canvas.width = 128
      canvas.height = 64
      const context = canvas.getContext('2d')
      context.fillStyle = item.color
      context.font = 'bold 24px Arial'
      context.textAlign = 'center'
      context.fillText(`${item.percentage}%`, 64, 32)
      context.fillStyle = 'white'
      context.font = '12px Arial'
      context.fillText(item.label, 64, 52)
      
      const texture = new THREE.CanvasTexture(canvas)
      const labelMaterial = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true, 
        opacity: 0.9 
      })
      const labelGeometry = new THREE.PlaneGeometry(1, 0.5)
      const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial)
      labelMesh.position.set(labelX, 1.5, labelZ)
      labelMesh.lookAt(camera.position)
      labelMesh.userData = { index: index }
      
      scene.add(labelMesh)
      labels.push(labelMesh)
      
      currentAngle += angle
    })
    
    sectorsRef.current = sectors
    labelsRef.current = labels

    // Mouse interaction with enhanced effects
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    
    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(sectors)
      
      // Reset all sectors
      sectors.forEach((sector, index) => {
        sector.position.y = sector.userData.originalY
        sector.material.emissive.setHex(0x000000)
        sector.scale.set(1, 1, 1)
        sector.userData.hovered = false
        
        // Reset label opacity
        if (labels[index]) {
          labels[index].material.opacity = 0.9
        }
      })
      
      if (intersects.length > 0) {
        const intersectedSector = intersects[0].object as THREE.Mesh
        const index = intersectedSector.userData.index
        
        // Enhanced hover effects
        intersectedSector.position.y = 0.4
        intersectedSector.material.emissive.setHex(0x333333)
        intersectedSector.scale.set(1.05, 1.1, 1.05)
        intersectedSector.userData.hovered = true
        
        // Highlight corresponding label
        if (labels[index]) {
          labels[index].material.opacity = 1
          labels[index].scale.set(1.2, 1.2, 1.2)
        }
        
        setHoveredIndex(index)
      } else {
        setHoveredIndex(null)
      }
    }
    
    renderer.domElement.addEventListener('mousemove', onMouseMove)

    // Enhanced animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      
      // Smooth auto-rotate
      scene.rotation.y += 0.003
      
      // Animate point lights
      const time = Date.now() * 0.001
      pointLight1.position.x = Math.cos(time) * 3
      pointLight1.position.z = Math.sin(time) * 3
      pointLight2.position.x = Math.cos(time + Math.PI) * 2
      pointLight2.position.z = Math.sin(time + Math.PI) * 2
      
      // Animate labels to always face camera
      labels.forEach(label => {
        label.lookAt(camera.position)
      })
      
      renderer.render(scene, camera)
    }
    
    animate()

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      renderer.domElement.removeEventListener('mousemove', onMouseMove)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [tokenomics, setHoveredIndex])

  // Handle external hover changes with enhanced effects
  useEffect(() => {
    if (sectorsRef.current && labelsRef.current) {
      sectorsRef.current.forEach((sector, index) => {
        if (index === hoveredIndex) {
          sector.position.y = 0.4
          sector.material.emissive.setHex(0x333333)
          sector.scale.set(1.05, 1.1, 1.05)
          
          // Highlight label
          if (labelsRef.current[index]) {
            labelsRef.current[index].material.opacity = 1
            labelsRef.current[index].scale.set(1.2, 1.2, 1.2)
          }
        } else {
          sector.position.y = sector.userData.originalY
          sector.material.emissive.setHex(0x000000)
          sector.scale.set(1, 1, 1)
          
          // Reset label
          if (labelsRef.current[index]) {
            labelsRef.current[index].material.opacity = 0.9
            labelsRef.current[index].scale.set(1, 1, 1)
          }
        }
      })
    }
  }, [hoveredIndex])

  return <div ref={mountRef} className="w-full h-full flex items-center justify-center" />
}

export function TokenomicsSection({ tokenomics = defaultTokenomics }: TokenomicsSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <section 
      ref={sectionRef}
      id="tokenomics" 
      className="py-20 bg-gray-900 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div 
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl font-bold text-white mb-4 relative">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Tokenomics
            </span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Fair and transparent token distribution for the $SHERK ecosystem
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 3D Pie Chart */}
          <div className={`transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
              <div className="bg-gray-800/60 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
                <div className="h-96 relative overflow-hidden">
                  <PieChart3D 
                    tokenomics={tokenomics} 
                    hoveredIndex={hoveredIndex}
                    setHoveredIndex={setHoveredIndex}
                  />
                </div>
                <div className="text-center mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-600/30">
                  <p className="text-white font-semibold text-lg mb-1">Total Supply</p>
                  <p className="text-cyan-400 text-3xl font-bold">999,999,999 $SHERK</p>
                  <div className="mt-2 text-xs text-gray-400">
                    Fixed supply • No inflation • Community controlled
                  </div>
                </div>
              </div>
          </div>
          
          {/* Token Distribution List */}
          <div className="space-y-4">
            {tokenomics.map((item, index) => (
              <div
                key={item.label}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`group p-6 rounded-xl transition-all duration-300 cursor-pointer border ${
                  hoveredIndex === index 
                    ? 'bg-gray-800/80 transform scale-105 shadow-2xl border-cyan-500/50' 
                    : 'bg-gray-800/40 hover:bg-gray-800/60 border-gray-700/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div 
                          className="w-8 h-8 rounded-lg transition-all duration-300 group-hover:scale-110 shadow-lg"
                          style={{ backgroundColor: item.color }}
                        />
                        {hoveredIndex === index && (
                          <div 
                            className="absolute inset-0 rounded-lg animate-ping opacity-40"
                            style={{ backgroundColor: item.color }}
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg group-hover:text-cyan-300 transition-colors">
                          {item.label}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {(999999999* item.percentage / 100).toLocaleString()} $SHERK
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Additional Info */}
        <div className={`mt-16 grid md:grid-cols-3 gap-6 transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-center p-6 bg-gray-800/40 rounded-xl border border-gray-700/50">
            <div className="text-3xl font-bold text-cyan-400 mb-2">70%</div>
            <div className="text-gray-300">Community Owned</div>
          </div>
          <div className="text-center p-6 bg-gray-800/40 rounded-xl border border-gray-700/50">
            <div className="text-3xl font-bold text-cyan-400 mb-2">5%</div>
            <div className="text-gray-300">Team Allocation</div>
          </div>
          <div className="text-center p-6 bg-gray-800/40 rounded-xl border border-gray-700/50">
            <div className="text-3xl font-bold text-cyan-400 mb-2">20%</div>
            <div className="text-gray-300">Ecosystem Growth</div>
          </div>
        </div>
      </div>
    </section>
  )
}