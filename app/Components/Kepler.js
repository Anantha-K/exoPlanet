
import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { useControls } from 'leva';

const fragmentShader = `
  uniform sampler2D globeTexture;
  varying vec2 vertexUV;
  varying vec3 vertexNormal;
  uniform float Temperature;
  uniform float scale;
  uniform float Vegetation;
  uniform float opacity;
  
  void main() {
    float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
    vec3 atmosphere = vec3(scale, Vegetation, 1.0) * pow(intensity, 1.5);
    vec4 textureColor = texture2D(globeTexture, vertexUV);
    
    textureColor.rgb *= 1.2;
    
    vec3 finalColor = textureColor.rgb;
    finalColor += atmosphere;
    
    // Adjust color based on Temperature
    finalColor += Temperature * vec3(0.3, 0.1, 0.1);
    
    float finalAlpha = textureColor.a * opacity;
    
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

const vertexShader = `
  varying vec2 vertexUV;
  varying vec3 vertexNormal;
  
  void main() {
    vertexUV = uv;
    vertexNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereVertexShader = `
  varying vec3 vertexNormal;
  
  void main() {
    vertexNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vertexNormal;
  uniform float AtmosphereIntensity;
  
  void main() {
    float intensity = pow(0.7 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
    vec3 atmosColor = vec3(0.1, 0.6, 1.0);
    gl_FragColor = vec4(atmosColor, 1.0) * intensity * AtmosphereIntensity;
  }
`;




function Starfield({ numStars = 500 }) {
    const starsRef = useRef();
    
    const starPositions = useMemo(() => {
      const positions = [];
      const colors = [];
      
      for (let i = 0; i < numStars; i++) {
        const radius = Math.random() * 25 + 25;
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        positions.push(x, y, z);
        
        // Add slight blue tint to stars
        const color = new THREE.Color().setHSL(0.6, 0.2, Math.random());
        colors.push(color.r, color.g, color.b);
      }
      
      return { positions, colors };
    }, [numStars]);
    
    const starGeometry = useMemo(() => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions.positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(starPositions.colors, 3));
      return geometry;
    }, [starPositions]);
  
    // Optional: Add subtle twinkling effect
    useFrame(() => {
      if (starsRef.current) {
        const colors = starsRef.current.geometry.attributes.color.array;
        for (let i = 0; i < colors.length; i += 3) {
          const flicker = 0.95 + Math.random() * 0.1;
          colors[i] *= flicker;
          colors[i + 1] *= flicker;
          colors[i + 2] *= flicker;
        }
        starsRef.current.geometry.attributes.color.needsUpdate = true;
      }
    });
  
    return (
      <points ref={starsRef}>
        <bufferGeometry attach="geometry" {...starGeometry} />
        <pointsMaterial
          attach="material"
          size={0.2}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation={true}
        />
      </points>
    );
  }
  

  function Earth({ vegetationProp = 0, seaLevelProp = 0 }) {
    const earthRef = useRef();
    const groundRef = useRef();
    const landRef = useRef();
    const seaRef = useRef();
    const atmosphereRef = useRef();
  
    // Ensure vegetationProp and seaLevelProp are numbers
    const vegetation = Number(vegetationProp) || 0;
    const seaLevel = Number(seaLevelProp) || 0;
  
    const [
      groundTexture,
      earthTexture,
      landTexture,
      seaTexture
    ] = useLoader(TextureLoader, [
      '/keplarland.png',
      '/keplarveg.png',
    ]);
  
    const {
      Temperature,
      sunProximity,
      Brightness,
      AtmosphereIntensity,
      rotationSpeed
    } = useControls({
      Temperature: { value: 0, min: 0, max: 1, step: 0.01 },
      sunProximity: { value: 0, min: 0, max: 1, step: 0.01 },
      Brightness: { value: 1.2, min: 0.1, max: 2, step: 0.01 },
      AtmosphereIntensity: { value: 2.5, min: 1.3, max: 5, step: 0.1 },
      rotationSpeed: { value: 0.001, min: 0, max: 0.01, step: 0.0001 }
    });
    useFrame(() => {
      [earthRef, groundRef, landRef, seaRef, atmosphereRef].forEach(ref => {
        if (ref.current) {
          ref.current.rotation.y += rotationSpeed;
        }
      });
    });
  
    const earthMaterial = useMemo(() => {
      return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          globeTexture: { value: earthTexture },
          scale: { value: sunProximity },
          Vegetation: { value: 0 },
          Temperature: { value: Temperature },
          opacity: { value: 1 }
        },
        transparent: true,
        depthWrite: false
      });
    }, [earthTexture, sunProximity, Temperature]);
  
    const groundMaterial = useMemo(() => {
      return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          globeTexture: { value: groundTexture },
          scale: { value: 0 },
          Vegetation: { value: 0 },
          Temperature: { value: Temperature },
          opacity: { value: 1 - seaLevelProp }  // Use seaLevelProp here
        },
        transparent: true,
        depthWrite: false
      });
    }, [groundTexture, Temperature, seaLevelProp]);
  
    const landMaterial = useMemo(() => {
      return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          globeTexture: { value: landTexture },
          scale: { value: 0 },
          Vegetation: { value: vegetationProp },  // Use vegetationProp here
          Temperature: { value: 0 },
          opacity: { value: vegetationProp }  // Use vegetationProp for opacity
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
    }, [landTexture, vegetationProp]);
  
    const seaMaterial = useMemo(() => {
      return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          globeTexture: { value: seaTexture },
          scale: { value: 0 },
          Vegetation: { value: 0 },
          Temperature: { value: 0 },
          opacity: { value: seaLevelProp }  // Use seaLevelProp for opacity
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
    }, [seaTexture, seaLevelProp]);
  
    const atmosphereMaterial = useMemo(() => {
      return new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        uniforms: {
          AtmosphereIntensity: { value: AtmosphereIntensity }
        }
      });
    }, [AtmosphereIntensity]);
  
    return (
      <>
        <mesh ref={earthRef}>
          <sphereGeometry args={[5, 50, 50]} />
          <primitive object={earthMaterial} attach="material" />
        </mesh>
  
        <mesh ref={groundRef}>
          <sphereGeometry args={[5.005, 50, 50]} />
          <primitive object={groundMaterial} attach="material" />
        </mesh>
  
        <mesh ref={landRef}>
          <sphereGeometry args={[5.01, 50, 50]} />
          <primitive object={landMaterial} attach="material" />
        </mesh>
  
        <mesh ref={seaRef}>
          <sphereGeometry args={[5.02, 50, 50]} />
          <primitive object={seaMaterial} attach="material" />
        </mesh>
  
        <mesh ref={atmosphereRef} scale={[1.2, 1.2, 1.2]}>
          <sphereGeometry args={[5, 50, 50]} />
          <primitive object={atmosphereMaterial} attach="material" />
        </mesh>
  
        <directionalLight position={[-2, -0.5, 1.5]} intensity={1.5} />
        <ambientLight intensity={0.2} />
      </>
    );
  }
  

  export default function Kepler({ vegetation, seaLevel }) {
    // Ensure values are numbers

  
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
        <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
          <Suspense fallback={null}>
            <Starfield numStars={1000} />
            <Earth vegetationProp={vegetation} seaLevelProp={seaLevel} />
            <OrbitControls enableZoom={true} enableRotate={true} />
          </Suspense>
        </Canvas>

      </div>
    );
  }