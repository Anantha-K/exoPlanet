import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const GeneratePlanet = () => {
  return (
    <div className="space-y-6 py-4">
    <div className="space-y-2">
      <label className="text-sm text-white/70">Distance from Star (AU)</label>
      <Slider
        defaultValue={[parameters.distance]}
        max={5}
        min={0.1}
        step={0.1}
        onValueChange={(value) => handleSliderChange(value, 'distance')}
      />
      <span className="text-xs text-white/50">Current: {parameters.distance} AU</span>
    </div>

    <div className="space-y-2">
      <label className="text-sm text-white/70">Oxygen Level (%)</label>
      <Slider
        defaultValue={[parameters.o2Level]}
        max={100}
        min={0}
        step={1}
        onValueChange={(value) => handleSliderChange(value, 'o2Level')}
      />
      <span className="text-xs text-white/50">Current: {parameters.o2Level}%</span>
    </div>

    <div className="space-y-2">
      <label className="text-sm text-white/70">Temperature (°C)</label>
      <Slider
        defaultValue={[parameters.temperature]}
        max={100}
        min={-100}
        step={1}
        onValueChange={(value) => handleSliderChange(value, 'temperature')}
      />
      <span className="text-xs text-white/50">Current: {parameters.temperature}°C</span>
    </div>

    <div className="space-y-2">
      <label className="text-sm text-white/70">Size (Earth masses)</label>
      <Slider
        defaultValue={[parameters.size]}
        max={5}
        min={0.1}
        step={0.1}
        onValueChange={(value) => handleSliderChange(value, 'size')}
      />
      <span className="text-xs text-white/50">Current: {parameters.size}x Earth</span>
    </div>

    <Button 
      onClick={handleGenerate} 
      disabled={loading}
      className="w-full bg-white/10 hover:bg-white/20"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : null}
      Generate Exoplanet
    </Button>
  </div>
  )
}

export default GeneratePlanet