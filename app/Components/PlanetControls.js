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

const sliderConfig = {
  mass: { min: 0.1, max: 5, step: 0.1, label: "Mass (Earth masses)" },
  temperature: { min: 150, max: 400, step: 1, label: "Temperature (°K)" },
  distance: { min: 0.1, max: 2, step: 0.01, label: "Distance (AU)" },
  vegetation: { min: 0, max: 100, step: 1, label: "Vegetation (%)" },
  size: { min: 0.1, max: 5, step: 0.1, label: "Size (Earth radii)" },
  atmosphere: { min: 0, max: 1, step: 0.01, label: "Atmosphere Density" }
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