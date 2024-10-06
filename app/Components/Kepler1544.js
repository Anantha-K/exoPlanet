import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { useControls } from 'leva';

const vertexShader = `
  varying vec2 vertexUV;
  varying vec3 vertexNormal;
  
  void main() {
    vertexUV = uv;
    vertexNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D globeTexture;
  varying vec2 vertexUV;
  varying vec3 vertexNormal;
  uniform float temperature;
  uniform float scale;
  uniform float vegetatian;
  uniform float opacity;
  
  void main() {
    float intensity = 1.05 - dot(vertexNormal, vec3(0.0078, 0.0667, 0.0157));
    vec3 atmosphere = vec3(scale, vegetatian, temperature) * pow(intensity, 1.5);
    vec4 textureColor = texture2D(globeTexture, vertexUV);
    
    vec3 oceanColor = vec3(0.0824, 0.502, 0.0);
    bool isLand = length(textureColor.rgb - oceanColor) > 0.1;
    
    vec3 greenTint = vec3(0.0, vegetatian * 0.5, 0.0);
    vec3 finalColor = textureColor.rgb;
    if (isLand) {
      finalColor = mix(finalColor, finalColor + greenTint, vegetatian);
    }
    
    finalColor += atmosphere;
    float finalAlpha = textureColor.a * opacity;
    
    gl_FragColor = vec4(finalColor, finalAlpha);
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
  uniform float atmoTemp;
  void main() {
    float intensity = pow(0.8 - dot(vertexNormal, vec3(0.051, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(atmoTemp, 0.2706, 0.2235, 1.0) * intensity;
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
  

function Planet() {
    const details = {
        "mass":1,
        "radius":1,
        "distance":1,
        "orbitalPeriod":365,
        "vegetatian":56,
        "temperature":288,
    
      }
  const landRef = useRef();
  const vegRef = useRef();
  const cloudsRef = useRef();
  const atmosphereRef = useRef();

  const [landTexture, vegTexture, cloudsTexture] = useLoader(TextureLoader, [
    '/kepler1544b.jpg',
    '/keplernew.png',
    '/clouds.jpg'
  ]);

  const {
    temperature,
    vegetatian,
    SEALEVEL,
    sunProximity
  } = useControls({
    vegetatian: { value: 0, min: 0, max: 0.3, step: 0.01 },
    SEALEVEL: { value: 0, min: 0, max: 0.7, step: 0.01 },
    temperature: { value: 0, min: 0.27, max: 0.8, step: 0.1 },
    sunProximity: { value: 0, min: 0.27, max: 0.8, step: 0.1 }
  });

  const landUniforms = useMemo(() => ({
    globeTexture: { value: landTexture },
    scale: { value: 0 },
    vegetatian: { value: 0 },
    temperature: { value: 0 },
    opacity: { value: 1 }
  }), [landTexture]);

  const vegUniforms = useMemo(() => ({
    globeTexture: { value: vegTexture },
    scale: { value: 0 },
    vegetatian: { value: 0 },
    temperature: { value: 0 },
    opacity: { value: 0 }
  }), [vegTexture]);

  const cloudsUniforms = useMemo(() => ({
    globeTexture: { value: cloudsTexture },
    scale: { value: 0 },
    vegetatian: { value: 0 },
    temperature: { value: 0 },
    opacity: { value: 0 }
  }), [cloudsTexture]);

  const atmosphereUniforms = useMemo(() => ({
    atmoTemp: { value: 0.2706 }
  }), []);

  useFrame(() => {
    landRef.current.rotation.y += 0.002;
    vegRef.current.rotation.y += 0.002;
    cloudsRef.current.rotation.y += 0.002;
    atmosphereRef.current.rotation.y += 0.002;

    // Update uniforms
    ;

    vegUniforms.vegetatian.value = vegetatian;
    vegUniforms.opacity.value = vegetatian;

    cloudsUniforms.opacity.value = SEALEVEL;

    atmosphereUniforms.atmoTemp.value = temperature;
    atmosphereUniforms.atmoTemp.value = sunProximity;
  });

  return (
    <>
      <mesh ref={landRef}>
        <sphereGeometry args={[5, 50, 50]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={landUniforms}
          transparent
          depthWrite={true}
        />
      </mesh>

      <mesh ref={vegRef}>
        <sphereGeometry args={[5, 50, 50]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={vegUniforms}
          transparent
          depthWrite={true}
        />
      </mesh>

      <mesh ref={cloudsRef}>
        <sphereGeometry args={[5, 50, 50]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={cloudsUniforms}
          transparent
          depthWrite={true}
        />
      </mesh>

      <mesh ref={atmosphereRef} scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[5, 50, 50]} />
        <shaderMaterial
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          uniforms={atmosphereUniforms}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      <directionalLight position={[-2, -0.5, 1.5]} intensity={1} />
    </>
  );
}

export default function Kepler1544() {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={75} />
      <OrbitControls />
      <Starfield numStars={1000} />

      <Planet />
    </Canvas>
  );
}