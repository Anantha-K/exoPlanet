import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';

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
  uniform float atmoTemp;
  void main() {
    float intensity = pow(0.8 - dot(vertexNormal, vec3(0.051, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(atmoTemp, 0.2706, 0.2235, 1.0) * intensity;
  }
`;

function Planet({ parameters }) {
  const landRef = useRef();
  const vegRef = useRef();
  const cloudsRef = useRef();
  const atmosphereRef = useRef();
  const groupRef = useRef();

  const [landTexture, vegTexture, cloudsTexture] = useLoader(TextureLoader, [
    '/generator.jpg',
    '/earthcloudmapgreen.jpg',
    '/earthcloudmap.jpg'
  ]);

  const landUniforms = useMemo(() => ({
    globeTexture: { value: landTexture },
    scale: { value: 0 },
    vegetation: { value: 0 },
    temperature: { value: .27 },
    opacity: { value: 1 }
  }), [landTexture]);

  const vegUniforms = useMemo(() => ({
    globeTexture: { value: vegTexture },
    scale: { value: 0 },
    vegetation: { value: 0 },
    temperature: { value: 0 },
    opacity: { value: 0 }
  }), [vegTexture]);

  const cloudsUniforms = useMemo(() => ({
    globeTexture: { value: cloudsTexture },
    scale: { value: 0 },
    vegetation: { value: 0 },
    temperature: { value: 0 },
    opacity: { value: 0 }
  }), [cloudsTexture]);

  const atmosphereUniforms = useMemo(() => ({
    atmoTemp: { value: 0.2706 }
  }), []);

  useEffect(() => {
    landUniforms.temperature.value = parameters.temp / 1000;
    vegUniforms.vegetation.value = parameters.oxygen / 100;
    vegUniforms.opacity.value = parameters.oxygen / 100;
    cloudsUniforms.opacity.value = parameters.atmosphericthickness;
    atmosphereUniforms.atmoTemp.value = parameters.temp / 1000;

    const newScale = parameters.radius;
    groupRef.current.scale.set(newScale, newScale, newScale);
  }, [parameters, landUniforms, vegUniforms, cloudsUniforms, atmosphereUniforms]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
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
    </group>
  );
}

export default function InteractivePlanetGenerator() {
  const [loading, setLoading] = useState(false);
  const [habitability, setHabitability] = useState('');
  const [parameters, setParameters] = useState({
    distance: 1.0,
    mass: 1,
    radius: 1,
    orbitalPeriod: 1,
    stellarMass: 1,
    stellarRadius: 1,
    temp: 288,
    ETemp: 1,
    systemAge: 1,
    atmosphericthickness: 1,
    magneticfield: 1,
    oxygen: 21,
    carbon: 1,
    nitrogen: 78,
  });

  const handleSliderChange = (value, parameter) => {
    setParameters(prev => ({
      ...prev,
      [parameter]: value[0]
    }));
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://nasaspaceapps-0xn3.onrender.com/receiveData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parameters),
      });

      const planet = await response.json();
      console.log(planet)
      setHabitability(planet.habitability_score);
      setVegetation(planet.vegetation);
      setSeaLEvel(planet.sea_level);
      set
    } catch (error) {
      console.error('Error generating planet:', error);
    } finally {
      setLoading(false);
    }
  };

  const sliderConfigs = [
    { label: "Distance from Star (AU)", key: "distance", max: 5, min: 0.1, step: 0.1 },
    { label: "Mass (Earth masses)", key: "mass", max: 5, min: 0.1, step: 0.1 },
    { label: "Radius (Earth radii)", key: "radius", max: 5, min: 0.1, step: 0.1 },
    { label: "Orbital Period (Earth years)", key: "orbitalPeriod", max: 1000, min: 1, step: 1 },
    { label: "Stellar Mass (Solar masses)", key: "stellarMass", max: 5, min: 0.1, step: 0.1 },
    { label: "Stellar Radius (Solar radii)", key: "stellarRadius", max: 5, min: 0.1, step: 0.1 },
    { label: "Temperature (K)", key: "temp", max: 1000, min: 0, step: 1 },
    { label: "Equilibrium Temperature (K)", key: "ETemp", max: 1000, min: 0, step: 1 },
    { label: "System Age (Billion years)", key: "systemAge", max: 10, min: 0.1, step: 0.1 },
    { label: "Atmospheric Thickness (Earth = 1)", key: "atmosphericthickness", max: 5, min: 0, step: 0.1 },
    { label: "Magnetic Field Strength (Earth = 1)", key: "magneticfield", max: 5, min: 0, step: 0.1 },
    { label: "Oxygen Level (%)", key: "oxygen", max: 100, min: 0, step: 1 },
    { label: "Nitrogen Level (%)", key: "nitrogen", max: 100, min: 0, step: 1 },
    { label: "CO2 Level (%)", key: "carbon", max: 100, min: 0, step: 1 },
  ];

  return (
    <motion.div 
      className="min-h-screen bg-black text-white flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-1/3 p-8 border-r border-white/20 bg-black/90 overflow-y-auto">
        <motion.div 
          className="space-y-8"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className='text-white'>Generate your planet</p>
          <h1 className="text-2xl font-bold mb-8">
            Planet Parameters
          </h1>

          <div className="space-y-6">
            {sliderConfigs.map((config, index) => (
              <motion.div 
                key={config.key}
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <label className="text-sm text-white/70">{config.label}</label>
                <Slider
                  defaultValue={[parameters[config.key]]}
                  max={config.max}
                  min={config.min}
                  step={config.step}
                  onValueChange={(value) => handleSliderChange(value, config.key)}
                />
                <span className="text-xs text-white/50">Current: {parameters[config.key]} {config.key === "temp" ? "K" : ""}</span>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button 
                onClick={handleGenerate} 
                disabled={loading}
                className="w-full bg-white/10 hover:bg-white/20 mt-6"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Generate Planet
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="w-2/3">
        <Canvas style={{ width: '100%', height: '100vh' }}>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={75} />
          <OrbitControls />
          <Planet parameters={parameters} />
        </Canvas>
        {habitability && (
          <div className="absolute bottom-[700px] right-4 bg-black/50 p-4 rounded">
<p className="text-white">Habitability Score: {Number(habitability).toFixed(2)}%</p>         
 </div>
        )}
      </div>
    </motion.div>
  );
}