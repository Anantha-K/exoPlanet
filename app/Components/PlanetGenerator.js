'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import AI from './AI';

const PlanetGenerator = ({ onPlanetGenerated }) => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [parameters, setParameters] = useState({
        distance: 1.0,
        o2Level: 21,
        n2Level: 12,
        temperature: 15,
        size: 1.0,
        mass: 1,
        radius: 1,
        OrbitalPeriod: 1,
        StellarMass: 1,
        StellarRadius: 1,
        ETemp: 1,
        SystemAge: 1,
        atmosphericthickness: 1,
        magneticfield: 1,
        co2Level: 1,
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
            const response = await fetch('/routes/Habitability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parameters),
            });

            if (!response.ok) throw new Error('Failed to generate planet');

            const planet = await response.json();
             console.log(planet);
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
        { label: "Orbital Period (Earth years)", key: "OrbitalPeriod", max: 10, min: 0.1, step: 0.1 },
        { label: "Stellar Mass (Solar masses)", key: "StellarMass", max: 5, min: 0.1, step: 0.1 },
        { label: "Stellar Radius (Solar radii)", key: "StellarRadius", max: 5, min: 0.1, step: 0.1 },
        { label: "Equilibrium Temperature (K)", key: "ETemp", max: 1000, min: 0, step: 1 },
        { label: "System Age (Billion years)", key: "SystemAge", max: 10, min: 0.1, step: 0.1 },
        { label: "Atmospheric Thickness (Earth = 1)", key: "atmosphericthickness", max: 5, min: 0, step: 0.1 },
        { label: "Magnetic Field Strength (Earth = 1)", key: "magneticfield", max: 5, min: 0, step: 0.1 },
        { label: "Oxygen Level (%)", key: "o2Level", max: 100, min: 0, step: 1 },
        { label: "Nitrogen Level (%)", key: "n2Level", max: 100, min: 0, step: 1 },
        { label: "CO2 Level (%)", key: "co2Level", max: 100, min: 0, step: 1 },
        { label: "Temperature (°C)", key: "temperature", max: 100, min: -100, step: 1 },
        { label: "Size (Earth = 1)", key: "size", max: 5, min: 0.1, step: 0.1 },
    ];

    return (
        <>
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
                                    <span className="text-xs text-white/50">Current: {parameters[config.key]} {config.key === "temperature" ? "°C" : ""}</span>
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

            {/* Right Panel - Preview */}
           
        </motion.div>
        {/* <AI selectedPlanet={name}></AI> */}
        </>
    );
};

export default PlanetGenerator;