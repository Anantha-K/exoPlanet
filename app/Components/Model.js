import React, { useState } from "react";
import { TypeAnimation } from "react-type-animation";
import Head from "next/head";
import AI from "./AI";
import { Globe2, Thermometer, Ruler, Navigation, Dna } from "lucide-react";
import PlanetGenerator from "./PlanetGenerator";
import Modelx from "./Modelx";


const exoplanets = [
  {
    name: "Earth",
    mass: "400",
    distance: 500,
    temperature: -50,
    size: 1.17,
    color: "#8B4513",
  },
  {
    name: "HD 189733b",
    mass: "Gas Giant",
    mass: 63,
    temperature: 1000,
    size: 1.14,
    color: "#4169E1",
  },
  {
    name: "Proxima Centauri b",
    mass: "Rocky",
    distance: 4.2,
    temperature: -39,
    size: 1.08,
    color: "#A52A2A",
  },
];

const Model = () => {
  const [planets, setPlanets] = useState(exoplanets);
  const [selectedPlanet, setSelectedPlanet] = useState(exoplanets[0]);
  const [key, setKey] = useState(0);

  const handlePlanetGenerated = (newPlanet) => {
    const mass = newPlanet.size > 2 ? "Gas Giant" : "Rocky";
    const color =
      newPlanet.temperature < 0
        ? "#8B4513"
        : newPlanet.temperature > 500
        ? "#4169E1"
        : "#A52A2A";

    const formattedPlanet = {
      ...newPlanet,
      mass,
      color,
    };

    setPlanets((prev) => [...prev, formattedPlanet]);
    setSelectedPlanet(formattedPlanet);
  };

  const handlePlanetChange = (planet) => {
    setSelectedPlanet(planet);
    setKey((prevKey) => prevKey + 1);
  };

  return (
    <>
      <div className="w-screen h-screen bg-black flex flex-col items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-black" />

       

        {/* <div className="mt-2 z-10">
          {planets.map((planet) => (
            <button
              key={planet.name}
              onClick={() => handlePlanetChange(planet)}
              className="text-white p-2 m-2 border border-white rounded hover:bg-white hover:text-black transition-colors"
            >
              {planet.name}
            </button>
          ))}
        </div> */}  
        <h1
          className="text-white mt-7 absolute left-20 -translate-x-4 top-16 text-4xl z-10"
          style={{ fontFamily: "Array,sans-serif" }}
        >
          <TypeAnimation
            key={key}
            sequence={[
              selectedPlanet ? selectedPlanet.name : "Loading...",
              3000,
              500,
              selectedPlanet ? selectedPlanet.name : "Loading...",
            ]}
            wrapper="span"
            speed={20}
            repeat={0}
            style={{ display: "inline-block" }}
          />
        </h1>
        <div className="absolute left-8 top-1/2 -translate-y-1/2 w-80 backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 shadow-lg z-10">
        
          <h2
            className="text-white text-2xl mb-6"
            style={{ fontFamily: "Array, sans-serif" }}
          >
            Planet Stats
          </h2>

          <div className="space-y-6">
            <div className="flex items-center text-white/90">
              <Globe2 className="w-5 h-5 mr-3" />
              <span className="flex justify-between w-full">
                <span>Mass:</span>
                <span className="font-semibold">{selectedPlanet.mass}</span>
              </span>
            </div>

            <div className="flex items-center text-white/90">
              <Navigation className="w-5 h-5 mr-3" />
              <span className="flex justify-between w-full">
                <span>Distance:</span>
                <span className="font-semibold">
                  {selectedPlanet.distance} light years
                </span>
              </span>
            </div>

            <div className="flex items-center text-white/90">
              <Thermometer className="w-5 h-5 mr-3" />
              <span className="flex justify-between w-full">
                <span>Temperature:</span>
                <span className="font-semibold">
                  {selectedPlanet.temperature}°C
                </span>
              </span>
            </div>

            <div className="flex items-center text-white/90">
              <Ruler className="w-5 h-5 mr-3" />
              <span className="flex justify-between w-full">
                <span>Size:</span>
                <span className="font-semibold">
                  {selectedPlanet.size}x Earth
                </span>
              </span>
            </div>

            <div className="flex items-center text-white/90">
              <Dna className="w-5 h-5 mr-3" />
              <span className="flex justify-between w-full">
                <span>Habitability:</span>
                <span className="font-semibold">99.01%</span>
              </span>
            </div>
          </div>
        </div>

        {/* <PlanetGenerator onPlanetGenerated={handlePlanetGenerated} /> */}
        <AI selectedPlanet={selectedPlanet.name} className="z-100" />
        <Modelx></Modelx>
        
      </div>
    </>
  );
};

export default Model;
