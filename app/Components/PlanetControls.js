// import React from 'react';
// import { Slider } from "@/components/ui/slider";

// const sliderConfigs = [
//   { label: "Distance from Star (AU)", key: "distance", max: 5, min: 0.1, step: 0.1 },
//   { label: "Mass (Earth masses)", key: "mass", max: 5, min: 0.1, step: 0.1 },
//   { label: "Radius (Earth radii)", key: "radius", max: 5, min: 0.1, step: 0.1 },
//   { label: "Orbital Period (Earth years)", key: "orbitalPeriod", max: 1000, min: 1, step: 1 },
//   { label: "Stellar Mass (Solar masses)", key: "stellarMass", max: 5, min: 0.1, step: 0.1 },
//   { label: "Stellar Radius (Solar radii)", key: "stellarRadius", max: 5, min: 0.1, step: 0.1 },
//   { label: "Equilibrium Temperature (K)", key: "ETemp", max: 1000, min: 0, step: 1 },
//   { label: "System Age (Billion years)", key: "SystemAge", max: 10, min: 0.1, step: 0.1 },
//   { label: "Atmospheric Thickness (Earth = 1)", key: "atmosphericThickness", max: 5, min: 0, step: 0.1 },
//   { label: "Magnetic Field Strength (Earth = 1)", key: "magneticField", max: 1, min: 0, step: 1 },
//   { label: "Oxygen Level (%)", key: "oxygen", max: 100, min: 0, step: 1 },
//   { label: "Nitrogen Level (%)", key: "nitrogen", max: 100, min: 0, step: 1 },
//   { label: "CO2 Level (%)", key: "carbon", max: 100, min: 0, step: 1 },
//   { label: "Temperature (K)", key: "temp", max: 10000, min: -100, step: 1 },
//   { label: "Size (Earth = 1)", key: "size", max: 5, min: 0.1, step: 0.1 }
// ];

// export function PlanetControls({ values, setValues }) {
//   const defaultValues = sliderConfigs.reduce((acc, config) => {
//     acc[config.key] = values[config.key] ?? config.min;
//     return acc;
//   }, {});

//   return (
//     <div className="w-80 h-screen flex flex-col border-l pb-16 border-white/10">
//       <div className="flex-none p-4 border-b border-white/10">
//         <h3 className="text-lg font-semibold text-white">Planet Controls</h3>
//       </div>
//       <div className="flex-1 overflow-y-auto">
//         <div className="space-y-6 p-4">
//           {sliderConfigs.map((config) => (
//             <div key={config.key} className="space-y-2">
//               <h4 className="font-medium text-white">{config.label}</h4>
//               <Slider
//                 value={[defaultValues[config.key]]}
//                 onValueChange={([value]) =>
//                   setValues(prev => ({ ...prev, [config.key]: value }))
//                 }
//                 max={config.max}
//                 min={config.min}
//                 step={config.step}
//               />
//               <span className="text-sm text-white/70">
//                 {defaultValues[config.key]?.toFixed(config.step < 1 ? 1 : 0)}
//                 {config.key === "oxygen" || config.key === "nitrogen" || config.key === "carbon"
//                   ? "%"
//                   : ""}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


import React from 'react';
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
    { label: "Temperature (K)", key: "temp", max: 10000, min: -100, step: 1 },
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
  

export const PlanetControls = ({ planetValues, onUpdate }) => {
  const handleSliderChange = (key, [value]) => {
    // Use a timeout to debounce the API calls
    const newValues = { ...planetValues, [key]: value };
    
    // Animate the transition using CSS
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
      <SheetContent className="w-[400px] bg-black/90 border-white/20 text-white">
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
              <Slider
                defaultValue={[planetValues[key]]}
                max={config.max}
                min={config.min}
                step={config.step}
                onValueChange={(value) => handleSliderChange(key, value)}
                className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-white/20"
              />
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};