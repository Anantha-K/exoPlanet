import React, { useCallback } from 'react';
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

// const sliderConfig = [
//   { label: "Distance from Star (AU)", key: "distance", max: 5, min: 0.1, step: 0.1 },
//   { label: "Mass (Earth masses)", key: "mass", max: 5, min: 0.1, step: 0.1 },
//   { label: "Radius (Earth radii)", key: "radius", max: 5, min: 0.1, step: 0.1 },
//   { label: "Orbital Period (Earth years)", key: "orbitalPeriod", max: 1000, min: 1, step: 1 },
//   { label: "Temperature (K)", key: "temperature", max: 6000, min: -100, step: 1 },
//   { label: "Size (Earth = 1)", key: "size", max: 5, min: 0.1, step: 0.1 }
// ];


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

const CustomSlider = ({ config, value, onChange }) => {
  const percentage = ((value - config.min) / (config.max - config.min)) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm text-white/70">{config.label}</label>
        <span className="text-sm font-medium">
          {value?.toFixed(2)}
        </span>
      </div>
      <div className="relative py-4">
        <Slider
          value={[value]}
          max={config.max}
          min={config.min}
          step={config.step}
          onValueChange={onChange}
          className="relative flex items-center select-none touch-none w-full"
        >
          <div className="absolute h-2 w-full rounded-full bg-gray-600" />
          <div
            className="absolute h-2 rounded-full bg-blue-500"
            style={{ width: `${percentage}%` }}
          />
          <div
            className="block w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-md absolute cursor-pointer"
            style={{
              left: `calc(${percentage}% - 12px)`,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
        </Slider>
      </div>
    </div>
  );
};

export const PlanetControls = ({ planetValues, onUpdate }) => {
  const handleSliderChange = useCallback((key, value) => {
    const newValues = {
      ...planetValues,
      [key]: value[0]
    };
    onUpdate(newValues);
  }, [planetValues, onUpdate]);

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
          {sliderConfig.map((config) => (
            <CustomSlider
              key={config.key}
              config={config}
              value={planetValues[config.key] || config.min}
              onChange={(value) => handleSliderChange(config.key, value)}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PlanetControls;