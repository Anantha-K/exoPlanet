// // App.js
// import React, { useRef, Suspense, useState, useEffect } from 'react';
// import { Canvas,useFrame } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import { Leva, useControls } from 'leva';
// import * as THREE from 'three';
// import img from '../Textures/earthland.jpg'

// function Scene() {
//   const earthRef = useRef();
//   const atmosphereRef = useRef();
//   const [earthTexture, setEarthTexture] = useState(null);

//   const controls = useControls({
//     scale: { value: 0, min: 0, max: 5 },
//     vegetation: { value: 0.1, min: 0.1, max: 0.19 },
//     temperature: { value: 0, min: 0, max: 5 },
//     atmoTemp: { value: 0.0198, min: 0, max: 5 },
//     rotationSpeed: { value: 0.002, min: 0, max: 0.01 }
//   });
  
//   useEffect(() => {
//     const loader = new THREE.TextureLoader();
//     loader.load(
//       '/earth.jpg',
//       (texture) => {
//         console.log('Texture loaded successfully');
//         setEarthTexture(texture);
//       },
//       undefined,
//       (error) => {
//         console.error('Error loading texture:', error);
//       }
//     );
//   }, []);

//   useEffect(() => {
//     const animate = () => {
//       if (earthRef.current) {
//         earthRef.current.rotation.y += controls.rotationSpeed;
//       }
//       requestAnimationFrame(animate);
//     };
    
//     animate();
//     return () => cancelAnimationFrame(animate);
//   }, [controls.rotationSpeed]);

//   if (!earthTexture) {
//     return null;
//   }

//   const earthMaterial = new THREE.ShaderMaterial({
//     vertexShader: `
//       varying vec2 vertexUV;
//       varying vec3 vertexNormal;
      
//       void main() {
//         vertexUV = uv;
//         vertexNormal = normalize(normalMatrix * normal);
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//       }
//     `,
//     fragmentShader: `
//       uniform sampler2D globeTexture;
//       uniform float scale;
//       uniform float vegetation;
//       uniform float temperature;
      
//       varying vec2 vertexUV;
//       varying vec3 vertexNormal;
      
//       void main() {
//         float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
//         vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.5);
        
//         vec4 color = texture2D(globeTexture, vertexUV);
//         color.rgb += vegetation * vec3(0.0, 0.3, 0.0);
//         color.rgb += temperature * vec3(0.3, 0.1, 0.0);
//         color.rgb += scale * atmosphere;
        
//         gl_FragColor = color;
//       }
//     `,
//     uniforms: {
//       globeTexture: { value: earthTexture },
//       scale: { value: controls.scale },
//       vegetation: { value: controls.vegetation },
//       temperature: { value: controls.temperature },
//     }
//   });

//   const atmosphereMaterial = new THREE.ShaderMaterial({
//     vertexShader: `
//       varying vec3 vertexNormal;
      
//       void main() {
//         vertexNormal = normalize(normalMatrix * normal);
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//       }
//     `,
//     fragmentShader: `
//       varying vec3 vertexNormal;
//       uniform float atmoTemp;
      
//       void main() {
//         float intensity = pow(0.6 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
//         gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity * atmoTemp;
//       }
//     `,
//     uniforms: {
//       atmoTemp: { value: controls.atmoTemp }
//     },
//     blending: THREE.AdditiveBlending,
//     side: THREE.BackSide,
//     transparent: true
//   });

//   return (
//     <>
//       <mesh ref={earthRef}>
//         <sphereGeometry args={[5, 50, 50]} />
//         <primitive attach="material" object={earthMaterial} />
//       </mesh>
      
//       <mesh ref={atmosphereRef} scale={[1.2, 1.2, 1.2]}>
//         <sphereGeometry args={[5, 50, 50]} />
//         <primitive attach="material" object={atmosphereMaterial} />
//       </mesh>
//     </>
//   );
// }

// // Loading screen component
// function LoadingScreen() {
//   return (
//     <div style={{
//       position: 'absolute',
//       top: '50%',
//       left: '50%',
//       transform: 'translate(-50%, -50%)',
//       color: 'white',
//       fontSize: '24px'
//     }}>
//       Loading Earth...
//     </div>
//   );
// }

// // Main App component
// export default function App() {
//   return (
//     <div style={{ 
//       width: '100vw', 
//       height: '100vh',
//       background: '#000',
//       position: 'relative'
//     }}>
//       <Leva />
//       <Canvas>
//         <Suspense fallback={null}>
//           <ambientLight intensity={0.1} />
//           <directionalLight 
//             color="white" 
//             position={[-2, 0.5, 1.5]} 
//             intensity={1.5} 
//           />
//           <OrbitControls 
//             enableZoom={true} 
//             enablePan={true} 
//             enableRotate={true} 
//             minDistance={10}
//             maxDistance={100}
//           />
//           <Scene />
//         </Suspense>
//       </Canvas>
//     </div>
//   );
// }



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
  uniform float brightness;
  
  void main() {
    float intensity = 1.0 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
    vec3 atmosphere = vec3(scale * 0.3, vegetation * 0.3, 1.0 * 0.3) * pow(intensity, 2.0);
    vec4 textureColor = texture2D(globeTexture, vertexUV);
    
    vec3 finalColor = textureColor.rgb * brightness;
    finalColor += atmosphere * 0.2;
    
    // Adjust color based on temperature
    finalColor += temperature * vec3(0.1, 0.05, 0.05);
    
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
  uniform float brightness;
  
  void main() {
    float intensity = pow(0.7 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
    vec3 atmosColor = mix(vec3(0.3, 0.6, 1.0), vec3(0.7, 0.3, 0.3), temperature);
    gl_FragColor = vec4(atmosColor, 1.0) * intensity * sunProximity * brightness;
  }
`;

function Earth() {
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
    seaLevel,
    brightness
  } = useControls({
    temperature: { value: 0, min: 0, max: 1, step: 0.01 },
    sunProximity: { value: 0.5, min: 0, max: 1, step: 0.01 },
    vegetation: { value: 0.5, min: 0, max: 1, step: 0.01 },
    seaLevel: { value: 0.5, min: 0, max: 1, step: 0.01 },
    brightness: { value: 0.8, min: 0.1, max: 1, step: 0.01 }
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
        vegetation: { value: vegetation },
        temperature: { value: temperature },
        opacity: { value: 1 },
        brightness: { value: brightness }
      },
      transparent: true,
      depthWrite: false
    });
  }, [earthTexture, sunProximity, vegetation, temperature, brightness]);

  const groundMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        globeTexture: { value: groundTexture },
        scale: { value: 0 },
        vegetation: { value: 0 },
        temperature: { value: temperature },
        opacity: { value: 1 - seaLevel },
        brightness: { value: brightness }
      },
      transparent: true,
      depthWrite: false
    });
  }, [groundTexture, temperature, seaLevel, brightness]);

  const landMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        globeTexture: { value: landTexture },
        scale: { value: 0 },
        vegetation: { value: vegetation },
        temperature: { value: 0 },
        opacity: { value: vegetation },
        brightness: { value: brightness }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  }, [landTexture, vegetation, brightness]);

  const seaMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        globeTexture: { value: seaTexture },
        scale: { value: 0 },
        vegetation: { value: 0 },
        temperature: { value: 0 },
        opacity: { value: seaLevel },
        brightness: { value: brightness }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  }, [seaTexture, seaLevel, brightness]);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      uniforms: {
        temperature: { value: temperature },
        sunProximity: { value: sunProximity },
        brightness: { value: brightness * 0.5 }
      }
    });
  }, [temperature, sunProximity, brightness]);

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

      <mesh ref={atmosphereRef} scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[7.5, 50, 50]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      <directionalLight position={[-2, -0.5, 1.5]} intensity={0.5 * brightness} />
      <ambientLight intensity={0.2 * brightness} />
    </>
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <Suspense fallback={null}>
          <Earth />
          <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  );
}