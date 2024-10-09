import React, { useRef, useMemo, useEffect } from 'react';
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
  uniform float vegetation;
  uniform float opacity;
  
  void main() {
    float intensity = 1.05 - dot(vertexNormal, vec3(0.0078, 0.0667, 0.0157));
    vec3 atmosphere = vec3(scale, vegetation, temperature) * pow(intensity, 1.5);
    vec4 textureColor = texture2D(globeTexture, vertexUV);
    
    vec3 oceanColor = vec3(0.0824, 0.502, 0.0);
    bool isLand = length(textureColor.rgb - oceanColor) > 0.1;
    
    vec3 greenTint = vec3(0.0, vegetation * 0.5, 0.0);
    vec3 finalColor = textureColor.rgb;
    if (isLand) {
      finalColor = mix(finalColor, finalColor + greenTint, vegetation);
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
  uniform float temperature;
  uniform float sunProximity;
  
  void main() {
    float intensity = pow(0.8 - dot(vertexNormal, vec3(0.051, 0.0, 1.0)), 2.0);
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
      <primitive object={starGeometry} attach="geometry" />
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

function Planet({ vegetationProp, seaLevelProp }) {
  const landRef = useRef();
  const vegRef = useRef();
  const cloudsRef = useRef();
  const atmosphereRef = useRef();

  const [landTexture, vegTexture, cloudsTexture] = useLoader(TextureLoader, [
    '/kepler1229b.jpg',
    '/Keplernew.png',
    '/clouds.jpg'
  ]);

  const {
    temperature,
    sunProximity,
    vegetation,
    seaLevel
  } = useControls({
    temperature: { value: 0, min: 0, max: 0.8, step: 0.1 },
    sunProximity: { value: 0, min: 0, max: 0.8, step: 0.1 },
    vegetation: { value: vegetationProp ?? 0, min: 0, max: 0.3, step: 0.01 },
    seaLevel: { value: seaLevelProp ?? 0, min: 0, max: 0.7, step: 0.01 }
  });

  const materials = useMemo(() => {
    const landMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        globeTexture: { value: landTexture },
        scale: { value: 0 },
        vegetation: { value: 0 },
        temperature: { value: 0 },
        opacity: { value: 1 }
      },
      transparent: true,
      depthWrite: true
    });

    const vegMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        globeTexture: { value: vegTexture },
        scale: { value: 0 },
        vegetation: { value: vegetationProp ?? 0 },
        temperature: { value: 0 },
        opacity: { value: vegetationProp ?? 0 }
      },
      transparent: true,
      depthWrite: true
    });

    const cloudsMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        globeTexture: { value: cloudsTexture },
        scale: { value: 0 },
        vegetation: { value: 0 },
        temperature: { value: 0 },
        opacity: { value: seaLevelProp ?? 0 }
      },
      transparent: true,
      depthWrite: true
    });

    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      uniforms: {
        temperature: { value: 0 },
        sunProximity: { value: 0 }
      }
    });

    return {
      landMat,
      vegMat,
      cloudsMat,
      atmosphereMat
    };
  }, [landTexture, vegTexture, cloudsTexture, vegetationProp, seaLevelProp]);

  // Update uniforms when control values or props change
  useEffect(() => {
    if (materials) {
      // Update based on control values
      materials.landMat.uniforms.scale.value = sunProximity;
      materials.landMat.uniforms.temperature.value = temperature;
      
      // Update vegetation based on prop or control
      const vegValue = vegetationProp !== undefined ? vegetationProp : vegetation;
      materials.vegMat.uniforms.vegetation.value = vegValue;
      materials.vegMat.uniforms.opacity.value = vegValue;
      
      // Update sea level based on prop or control
      const seaValue = seaLevelProp !== undefined ? seaLevelProp : seaLevel;
      materials.cloudsMat.uniforms.opacity.value = seaValue;
      
      // Update atmosphere
      materials.atmosphereMat.uniforms.temperature.value = temperature;
      materials.atmosphereMat.uniforms.sunProximity.value = sunProximity;
    }
  }, [
    materials,
    temperature,
    sunProximity,
    vegetation,
    seaLevel,
    vegetationProp,
    seaLevelProp
  ]);

  useFrame(() => {
    const speed = 0.002;
    [landRef, vegRef, cloudsRef, atmosphereRef].forEach(ref => {
      if (ref.current) {
        ref.current.rotation.y += speed;
      }
    });
  });

  return (
    <>
      <mesh ref={landRef}>
        <sphereGeometry args={[5, 50, 50]} />
        <primitive object={materials.landMat} attach="material" />
      </mesh>

      <mesh ref={vegRef}>
        <sphereGeometry args={[5, 50, 50]} />
        <primitive object={materials.vegMat} attach="material" />
      </mesh>

      <mesh ref={cloudsRef}>
        <sphereGeometry args={[5, 50, 50]} />
        <primitive object={materials.cloudsMat} attach="material" />
      </mesh>

      <mesh ref={atmosphereRef} scale={1.2}>
        <sphereGeometry args={[5, 50, 50]} />
        <primitive object={materials.atmosphereMat} attach="material" />
      </mesh>

      <directionalLight position={[-2, -0.5, 1.5]} intensity={1} />
      <ambientLight intensity={0.2} />
    </>
  );
}

export default function Kepler1229b({ vegetation, seaLevel }) {
  return (
    <Canvas style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={75} />
      <OrbitControls enableZoom={true} enableRotate={true} />
      <Starfield numStars={1000} />
      <Planet vegetationProp={vegetation} seaLevelProp={seaLevel} />
    </Canvas>
  );
}