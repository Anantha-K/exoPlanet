
import React, { useState, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import { Globe2, Thermometer, Ruler, Navigation, Dna, Trees, Waypoints, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AI from "./AI";
import Modelx from "./Modelx";
import Keplar from "./Kepler";
import Kepler442 from "./Kepler442";
import Kepler1229b from "./Kepler1229B";
import Kepler1544 from "./Kepler1544";

const exoplanets = [
  { name: "Earth", component: Modelx, details: { mass: 1, radius: 1, distance: 1, orbitalPeriod: 365, vegetation: 56, temperature: 288, sunProximity: "N/A", size: 1, atmosphere: 1 }},
  { name: "Kepler-22b", component: Keplar, details: { mass: 2.4, radius: 2.38, distance: 0.849, orbitalPeriod: 290, vegetation: 0, temperature: 295, sunProximity: "0.849 AU", size: 2.4, atmosphere: 0.7 }},
  { name: "Kepler-1229b", component: Kepler1229b, details: { mass: 1.8, radius: 1.4, distance: 0.581, orbitalPeriod: 86, vegetation: 0, temperature: 243, sunProximity: "0.581 AU", size: 1.4, atmosphere: 0.8 }},
  { name: "Kepler-1544", component: Kepler1544, details: { mass: 1.9, radius: 1.6, distance: 0.659, orbitalPeriod: 168, vegetation: 0, temperature: 258, sunProximity: "0.659 AU", size: 1.6, atmosphere: 0.75 }},
  { name: "Kepler-442", component: Kepler442, details: { mass: 2.36, radius: 1.34, distance: 0.409, orbitalPeriod: 112, vegetation: 0, temperature: 233, sunProximity: "0.409 AU", size: 1.34, atmosphere: 0.8 }},
];

const sliderConfig = [
  { label: "Distance from Star (AU)", key: "distance", max: 5, min: 0.1, step: 0.1 },
  { label: "Mass (Earth masses)", key: "mass", max: 5, min: 0.1, step: 0.1 },
  { label: "Radius (Earth radii)", key: "radius", max: 5, min: 0.1, step: 0.1 },
  { label: "Orbital Period (Earth years)", key: "orbitalPeriod", max: 1000, min: 1, step: 1 },
  { label: "Stellar Mass (Solar masses)", key: "stellarMass", max: 5, min: 0.1, step: 0.1 },
  { label: "Stellar Radius (Solar radii)", key: "stellarRadius", max: 5, min: 0.1, step: 0.1 },
  { label: "Equilibrium Temperature (K)", key: "ETemp", max: 1000, min: 0, step: 1 },
  { label: "System Age (Billion years)", key: "SystemAge", max: 10, min: 0.1, step: 0.1 },
  { label: "Atmospheric Thickness (Earth = 1)", key: "atmosphericThickness", max: 5, min: 0, step: 0.1 },
  { label: "Magnetic Field Strength (Earth = 1)", key: "magneticField", max: 1, min: 0, step: 1 },
  { label: "Oxygen Level (%)", key: "oxygen", max: 100, min: 0, step: 1 },
  { label: "Nitrogen Level (%)", key: "nitrogen", max: 100, min: 0, step: 1 },
  { label: "CO2 Level (%)", key: "carbon", max: 100, min: 0, step: 1 },
  { label: "Temperature (K)", key: "temp", max: 6000, min: -100, step: 1 },
  { label: "Size (Earth = 1)", key: "size", max: 5, min: 0.1, step: 0.1 }
];

const defaultPlanetValues = {
  distance: 1,
  mass: 1,
  radius: 1,
  orbitalPeriod: 365,
  stellarMass: 1,
  stellarRadius: 1,
  ETemp: 288,
  SystemAge: 4.6,
  atmosphericThickness: 1,
  magneticField: 1,
  oxygen: 21,
  nitrogen: 78,
  carbon: 0.04,
  temp: 288,
  size: 1
};

const PlanetControls = ({ planetValues, onUpdate }) => {
  const handleSliderChange = (key, [value]) => {
    const newValues = { ...planetValues, [key]: value };
    requestAnimationFrame(() => {
      onUpdate(newValues);
    });
  };

  return (
    <Sheet>
    <SheetTrigger asChild>
      <Button
        className="fixed bottom-8 right-8 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
        size="lg"
      >
        <Settings2 className="mr-2 h-5 w-5" />
        Adjust Parameters
      </Button>
    </SheetTrigger>
    <SheetContent className="w-[400px] bg-black/90 border-white/20 text-white max-h-[100vh] overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="text-white">Planet Parameters</SheetTitle>
        <SheetDescription className="text-white/70">
          Adjust the parameters to see how they affect habitability
        </SheetDescription>
      </SheetHeader>
      <div className="mt-8 space-y-8">
        {Object.entries(sliderConfig).map(([key, config]) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm text-white/70">{config.label}</label>
              <span className="text-sm font-medium">
                {planetValues[key]?.toFixed(2)}
              </span>
            </div>
            <div className="relative py-4">
              <Slider
                value={[planetValues[key]]}
                max={config.max}
                min={config.min}
                step={config.step}
                onValueChange={(value) => handleSliderChange(key, value)}
                className="relative flex items-center select-none touch-none w-full"
              >
                <span className="absolute h-2 w-full rounded-full bg-gray-600" />
                <span
                  className="absolute h-2 rounded-full bg-blue-500"
                  style={{
                    width: `${((planetValues[key] - config.min) / (config.max - config.min)) * 100}%`,
                  }}
                />
                <span
                  className="block w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-md absolute cursor-pointer"
                  style={{
                    left: `calc(${((planetValues[key] - config.min) / (config.max - config.min)) * 100}% - 12px)`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
              </Slider>
            </div>
          </div>
        ))}
      </div>
    </SheetContent>
  </Sheet>
  
  );
};

const Model = () => {
  const [selectedPlanet, setSelectedPlanet] = useState("Earth");
  const [key, setKey] = useState(0);
  const [planetValues, setPlanetValues] = useState(exoplanets[0].details);
  const [habitability, setHabitability] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkHabitability = async (values) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://nasaspaceapps-0xn3.onrender.com/receiveData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mass: values.mass,
          radius: values.size,
          distance: values.distance,
          temperature: values.temperature,
          vegetation: values.vegetation,
          atmosphere: values.atmosphere
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      // setHabitability(data.habitability);
    } catch (error) {
      console.error("Error checking habitability:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanetChange = (planetName) => {
    const planet = exoplanets.find((p) => p.name === planetName);
    setSelectedPlanet(planetName);
    setPlanetValues(planet.details);
    checkHabitability(planet.details);
    setKey((prevKey) => prevKey + 1);
  };

  const debouncedCheck = debounce(checkHabitability, 500);

  const handleControlUpdate = (newValues) => {
    const statsPanel = document.querySelector('.stats-panel');
    statsPanel?.classList.add('transitioning');
    
    setPlanetValues(prev => {
      const updated = { ...prev, ...newValues };
      debouncedCheck(updated);
      return updated;
    });
    
    setTimeout(() => {
      statsPanel?.classList.remove('transitioning');
    }, 300);
  };

const StatItem = ({ icon: Icon, label, value, unit = "", isHabitability = false }) => (
    <div className="flex items-center text-white/90">
      <Icon className="w-5 h-5 mr-3" />
      <span className="flex justify-between w-full">
        <span>{label}:</span>
        <span className="font-semibold">
          {isHabitability && isLoading ? (
            <span className="animate-pulse">Calculating...</span>
          ) : (
            `${value}${unit}`
          )}
        </span>
      </span>
    </div>
  );

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-black" />

      {/* Planet Selection Buttons */}
      <div className="absolute top-4 left-4 z-20 flex space-x-2">
        {exoplanets.map((planet) => (
          <Button
            key={planet.name}
            onClick={() => handlePlanetChange(planet.name)}
            variant={selectedPlanet === planet.name ? "default" : "outline"}
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
          >
            {planet.name}
          </Button>
        ))}
      </div>

      <h1 className="text-white mt-14 flex text-5xl z-10" style={{ fontFamily: "Array,sans-serif" }}>
        <TypeAnimation
          key={key}
          sequence={[selectedPlanet ? selectedPlanet : "Loading...", 3000, 500]}
          wrapper="span"
          speed={20}
          repeat={0}
          style={{ display: "inline-block" }}
        />
      </h1>

      {/* Stats Panel */}
      <div className="stats-panel absolute left-8 top-1/2 -translate-y-1/2 w-80 backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 shadow-lg z-10 transition-all duration-300 ease-in-out">
        <h2 className="text-white text-2xl mb-6" style={{ fontFamily: "Array, sans-serif" }}>
          Planet Stats
        </h2>

        <div className="space-y-6">
          <StatItem icon={Globe2} label="Mass" value={planetValues.mass.toFixed(2)} />
          <StatItem icon={Navigation} label="Distance from Star" value={planetValues.distance} unit=" AU" />
          <StatItem icon={Thermometer} label="Temperature" value={planetValues.temperature} unit="°K" />
          <StatItem icon={Trees} label="Vegetation" value={planetValues.vegetation} unit="%" />
          <StatItem icon={Waypoints} label="Sun Proximity" value={planetValues.sunProximity} />
          <StatItem icon={Ruler} label="Size" value={planetValues.size.toFixed(2)} unit="x Earth" />

        </div>
      </div>


      {/* Planet Controls */}
      <div className="w-full z-20 bg-black/30 backdrop-blur-md  px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <PlanetControls 
            planetValues={planetValues}
            onUpdate={handleControlUpdate}
          />
        </div>
      </div>

      <AI selectedPlanet={selectedPlanet} />

      {exoplanets.find((planet) => planet.name === selectedPlanet)?.component()}
    </div>
  );
};

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
export default Model;