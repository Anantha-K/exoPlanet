import React, { useState, useEffect, useCallback } from "react";
import { TypeAnimation } from "react-type-animation";
import { Globe2, Thermometer, Ruler, Navigation, Dna, Trees, Waypoints, Settings2,Menu } from "lucide-react";
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
  { 
    name: "Earth", 
    component: Modelx, 
    details: { 
      distance: 1, 
      mass: 1, 
      radius: 1, 
      orbitalPeriod: 365, 
      stellarMass: 1, 
      stellarRadius: 1, 
      temp: 288, 
      ETemp: 255, 
      systemAge: 4.5, 
      atmosphericthickness: 1, 
      magneticfield: 1, 
      oxygen: 21, 
      nitrogen: 78, 
      carbon: 0.04, 
      vegetation: 0.2, 
      sunProximity: "N/A", 
      size: 1, 
      atmosphere: 1,
      habitability: 100
    }
  },
  { 
    name: "Kepler-22b", 
    component: Keplar, 
    details: { 
      distance: 0.849, 
      mass: 2.4, 
      radius: 2.38, 
      orbitalPeriod: 290, 
      stellarMass: 0.97, 
      stellarRadius: 0.98, 
      temp: 295, 
      ETemp: 262, 
      systemAge: 4, 
      atmosphericthickness: 0.7, 
      magneticfield: 1.2, 
      oxygen: 18, 
      nitrogen: 75, 
      carbon: 0.1, 
      vegetation: 10, 
      sunProximity: "0.849 AU", 
      size: 2.4, 
      atmosphere: 0.7,
      habitability: 85
    }
  },
  { 
    name: "Kepler-1229b", 
    component: Kepler1229b, 
    details: { 
      distance: 0.581, 
      mass: 1.8, 
      radius: 1.4, 
      orbitalPeriod: 86.8, 
      stellarMass: 0.54, 
      stellarRadius: 0.51, 
      temp: 243, 
      ETemp: 213, 
      systemAge: 3.5, 
      atmosphericthickness: 0.8, 
      magneticfield: 0.9, 
      oxygen: 15, 
      nitrogen: 80, 
      carbon: 0.2, 
      vegetation: 12, 
      sunProximity: "0.581 AU", 
      size: 1.4, 
      atmosphere: 0.8,
      habitability: 70
    }
  },
  { 
    name: "Kepler-1544", 
    component: Kepler1544, 
    details: { 
      distance: 0.659, 
      mass: 1.9, 
      radius: 1.6, 
      orbitalPeriod: 168.8, 
      stellarMass: 0.67, 
      stellarRadius: 0.64, 
      temp: 258, 
      ETemp: 226, 
      systemAge: 5, 
      atmosphericthickness: 0.75, 
      magneticfield: 1.1, 
      oxygen: 17, 
      nitrogen: 77, 
      carbon: 0.15, 
      vegetation: 5, 
      sunProximity: "0.659 AU", 
      size: 1.6, 
      atmosphere: 0.75,
      habitability: 75
    }
  },
  { 
    name: "Kepler-442", 
    component: Kepler442, 
    details: { 
      distance: 0.409, 
      mass: 2.36, 
      radius: 1.34, 
      orbitalPeriod: 112.3, 
      stellarMass: 0.61, 
      stellarRadius: 0.60, 
      temp: 233, 
      ETemp: 206, 
      systemAge: 2.9, 
      atmosphericthickness: 0.8, 
      magneticfield: 1.3, 
      oxygen: 16, 
      nitrogen: 79, 
      carbon: 0.18, 
      vegetation: 2, 
      sunProximity: "0.409 AU", 
      size: 1.34, 
      atmosphere: 0.8,
      habitability: 80
    }
  },
];
const sliderConfig = [
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

const PlanetControls = ({ planetValues, onUpdate }) => {
  const handleSliderChange = (key, [value]) => {
    const newValues = { ...planetValues, [key]: value };
    onUpdate(newValues);
  };

  return (
    <Sheet>
    <SheetTrigger asChild>
      <Button
        className="fixed lg:top-48 lg:right-8 bottom-4 right-4 lg:bottom-auto bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 z-50"
        size="lg"
      >
        <Settings2 className="mr-2 h-5 w-5" />
        <span className="hidden sm:inline">Adjust Parameters</span>
      </Button>
    </SheetTrigger>
    <SheetContent className="w-full sm:w-[400px] bg-black/90 border-white/20 text-white max-h-[100vh] overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="text-white">Planet Parameters</SheetTitle>
        <SheetDescription className="text-white/70">
          Adjust the parameters to see how they affect habitability
        </SheetDescription>
      </SheetHeader>
      <div className="mt-8 space-y-8">
        {sliderConfig.map((config) => (
          <div key={config.key} className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm text-white/70">{config.label}</label>
              <span className="text-sm font-medium">
                {planetValues[config.key]?.toFixed(2)}
              </span>
            </div>
            <Slider
              value={[planetValues[config.key]]}
              max={config.max}
              min={config.min}
              step={config.step}
              onValueChange={(value) => handleSliderChange(config.key, value)}
              className="relative flex items-center select-none touch-none w-full"
            />
          </div>
        ))}
      </div>
    </SheetContent>
  </Sheet>
  );
};

const StatItem = ({ icon: Icon, label, value, unit = "" }) => (
  <div className="flex items-center text-white/90">
    <Icon className="w-5 h-5 mr-3" />
    <span className="flex justify-between w-full">
      <span>{label}:</span>
      <span className="font-semibold">{typeof value === 'number' ? value.toFixed(2) : value}{unit}</span>
    </span>
  </div>
);



const PlanetSelector = ({ planets, selectedPlanet, onPlanetChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-4 left-4 z-20">
      {/* Mobile Dropdown */}
      <div className="lg:hidden">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 w-full"
        >
          <Menu className="mr-2 h-5 w-5" />
          {selectedPlanet}
        </Button>
        {isOpen && (
          <div className="absolute mt-2 w-48 bg-black/90 backdrop-blur-md border border-white/20 rounded-md shadow-lg">
            {planets.map((planet) => (
              <Button
                key={planet.name}
                onClick={() => {
                  onPlanetChange(planet.name);
                  setIsOpen(false);
                }}
                variant={selectedPlanet === planet.name ? "default" : "outline"}
                className="w-full justify-start rounded-none bg-transparent hover:bg-white/20 text-white"
              >
                {planet.name}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      {/* Desktop Buttons */}
      <div className="hidden lg:flex space-x-2">
        {planets.map((planet) => (
          <Button
            key={planet.name}
            onClick={() => onPlanetChange(planet.name)}
            variant={selectedPlanet === planet.name ? "default" : "outline"}
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
          >
            {planet.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

const Model = () => {
  const [selectedPlanet, setSelectedPlanet] = useState("Earth");
  const [key, setKey] = useState(0);
  const [planetValues, setPlanetValues] = useState(exoplanets[0].details);
  const [isLoading, setIsLoading] = useState(false);

  const checkHabitability = useCallback(async (values) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://nasaspaceapps-0xn3.onrender.com/receiveData', {
        method: 'POST',
        mode:'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          distance: values.distance,
          mass: values.mass,
          radius: values.radius,
          orbitalPeriod: values.orbitalPeriod,
          stellarMass: values.stellarMass,
          stellarRadius: values.stellarRadius,
          temp: values.temp,
          ETemp: values.ETemp,
          systemAge: values.systemAge,
          atmosphericthickness: values.atmosphericthickness,
          magneticfield: values.magneticfield,
          oxygen: values.oxygen,
          carbon: values.carbon,
          nitrogen: values.nitrogen
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      return {
        habitability_score: parseFloat(data.habitability_score) || 0,
        vegetation: parseFloat(data.vegetation) || 0,
        seaLevel: parseFloat(data.sea_level) || 0,
      };
    } catch (error) {
      console.error("Error checking habitability:", error);
      return {
        habitability_score: 0,
        vegetation: 0,
        seaLevel: 0,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handlePlanetChange = useCallback((planetName) => {
    const planet = exoplanets.find((p) => p.name === planetName);
    setSelectedPlanet(planetName);
    setPlanetValues(planet.details);
    
    checkHabitability(planet.details).then(result => {
      setPlanetValues(prevValues => ({
        ...prevValues,
        habitability: result.habitability_score,
        vegetation: result.vegetation / 100, 
        seaLevel: result.seaLevel / 100,
      }));
    });
    
    setKey((prevKey) => prevKey + 1);
  }, [checkHabitability]);

  const handleControlUpdate = useCallback((newValues) => {
    setPlanetValues(newValues);
    checkHabitability(newValues).then(result => {
      setPlanetValues(prevValues => ({
        ...newValues,
        habitability: result.habitability_score,
        vegetation: result.vegetation / 100,
        seaLevel: result.seaLevel / 100,
      }));
    });
  }, [checkHabitability]);

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-black" />

      <PlanetSelector 
        planets={exoplanets}
        selectedPlanet={selectedPlanet}
        onPlanetChange={handlePlanetChange}
      />

      <h1 className="text-white mt-14 flex text-3xl lg:text-5xl z-10" style={{ fontFamily: "Array,sans-serif" }}>
        <TypeAnimation
          key={key}
          sequence={[selectedPlanet, 3000, 500]}
          wrapper="span"
          speed={20}
          repeat={0}
          style={{ display: "inline-block" }}
        />
      </h1>

      <div className="stats-panel fixed bottom-0 left-0 lg:absolute lg:left-8 lg:top-1/2 lg:-translate-y-1/2 w-full lg:w-80 backdrop-blur-md bg-white/10 rounded-none lg:rounded-xl p-4 lg:p-6 border border-white/20 shadow-lg z-10 max-h-[40vh] lg:max-h-none overflow-y-auto lg:overflow-visible">
        <h2 className="text-white text-xl lg:text-2xl mb-4 lg:mb-6" style={{ fontFamily: "Array, sans-serif" }}>
          Planet Stats
        </h2>

        <div className="space-y-4 lg:space-y-6">
          <StatItem icon={Globe2} label="Mass" value={planetValues.mass} unit=" Earth masses" />
          <StatItem icon={Navigation} label="Distance from Star" value={planetValues.distance} unit=" AU" />
          <StatItem icon={Thermometer} label="Temperature" value={planetValues.temp} unit="K" />
          <StatItem icon={Trees} label="Vegetation" value={planetValues.vegetation} unit="%" />
          <StatItem icon={Waypoints} label="Sun Proximity" value={planetValues.sunProximity} />
          <StatItem icon={Ruler} label="Size" value={planetValues.size} unit="x Earth" />
          <StatItem icon={Dna} label="Habitability" value={planetValues.habitability} unit="%" />
        </div>
      </div>

      <PlanetControls 
        planetValues={planetValues}
        onUpdate={handleControlUpdate}
      />

      <AI selectedPlanet={selectedPlanet} />

      {exoplanets.map((planet) => {
        const PlanetComponent = planet.component;
        return selectedPlanet === planet.name ? (
          <PlanetComponent 
            key={`${planet.name}-${key}`} 
            vegetation={planetValues.vegetation}
            seaLevel={planetValues.seaLevel || 1}
          />
        ) : null;
      })}
    </div>
  );
};

export default Model;