

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
  uniform float temperature;
  uniform float scale;
  uniform float vegetation;
  uniform float opacity;
  
  void main() {
    float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
    vec3 atmosphere = vec3(scale, vegetation, 1.0) * pow(intensity, 1.5);
    vec4 textureColor = texture2D(globeTexture, vertexUV);
    
    textureColor.rgb *= 1.2;
    
    vec3 finalColor = textureColor.rgb;
    finalColor += atmosphere;
    
    // Adjust color based on temperature
    finalColor += temperature * vec3(0.3, 0.1, 0.1);
    
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
  uniform float temperature;
  uniform float sunProximity;
  
  void main() {
    float intensity = pow(0.7 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
    vec3 atmosColor = mix(vec3(0.3, 0.6, 1.0), vec3(0.7, 0.3, 0.3), temperature);
    gl_FragColor = vec4(atmosColor, 1.0) * intensity * (sunProximity + 0.5) * 2.0;
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


function Earth() {
  const details = {
    "mass":1,
    "radius":1,
    "distance":1,
    "orbitalPeriod":365,
    "vegetation":56,
    "temperature":288,


  }
  const earthRef = useRef();
  const groundRef = useRef();
  const landRef = useRef();
  const seaRef = useRef();
  const atmosphereRef = useRef();
  
  const [
    groundTexture,
    earthTexture,
    landTexture,
    seaTexture
  ] = useLoader(TextureLoader, [
    '/ground.jpg',
    '/earthh.png',
    '/finalLand.png',
    '/seafinal.png'
  ]);

  const {
    temperature,
    sunProximity,
    vegetation,
    seaLevel
  } = useControls({
    temperature: { value: 0, min: 0, max: 1, step: 0.01 },
    sunProximity: { value: 0, min: 0, max: 1, step: 0.01 },
    vegetation: { value: 0, min: 0, max: .5, step: 0.01 },
    seaLevel: { value: 1, min: 0, max: 1, step: 0.01 }
  });




  useFrame(() => {
    const speed = 0.002;
    [earthRef, groundRef, landRef, seaRef, atmosphereRef].forEach(ref => {
      if (ref.current) {
        ref.current.rotation.y += speed;
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
        vegetation: { value: 0 },
        temperature: { value: temperature },
        opacity: { value: 1 }
      },
      transparent: true,
      depthWrite: false
    });
  }, [earthTexture, sunProximity, temperature]);

  const groundMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        globeTexture: { value: groundTexture },
        scale: { value: 0 },
        vegetation: { value: 0 },
        temperature: { value: temperature },
        opacity: { value: 1 - seaLevel }
      },
      transparent: true,
      depthWrite: false
    });
  }, [groundTexture, temperature, seaLevel]);

  const landMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        globeTexture: { value: landTexture },
        scale: { value: 0 },
        vegetation: { value: vegetation },
        temperature: { value: 0 },
        opacity: { value: vegetation }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  }, [landTexture, vegetation]);

  const seaMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        globeTexture: { value: seaTexture },
        scale: { value: 0 },
        vegetation: { value: 0 },
        temperature: { value: 0 },
        opacity: { value: 1 }
      },
      transparent: true,
      depthWrite: true,
      blending: THREE.AdditiveBlending
    });
  }, [seaTexture, seaLevel]);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      uniforms: {
        temperature: { value: temperature },
        sunProximity: { value: sunProximity }
      }
    });
  }, [temperature, sunProximity]);

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

     

      <directionalLight position={[-2, -0.5, 1.5]} intensity={1.5} />
      <ambientLight intensity={0.2} />
    </>
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <Suspense fallback={null}>

          <Earth/>
          <OrbitControls enableZoom={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  );
}









