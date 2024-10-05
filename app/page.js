'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Model from './Components/Model';
import PlanetGenerator from './Components/PlanetGenerator';

export default function Home() {
    const [active, setActive] = useState('Explore');
    const [generatedPlanet, setGeneratedPlanet] = useState(null);

    const NavItem = ({ text }) => (
        <motion.li
            className={`px-4 py-2 rounded-full z-10 mx-auto cursor-pointer ${
                active === text ? 'text-black' : 'text-white'
            }`}
            onClick={() => setActive(text)}
            whileTap={{ scale: 0.95 }}
        >
            {text}
        </motion.li>
    );

    const handlePlanetGenerated = (planet) => {
        setGeneratedPlanet(planet);
        setActive('Explore'); // Optionally switch back to explore view after generation
    };

    return (
        <>
            <AnimatePresence mode="wait">
                {active === 'Explore' ? (
                    <Model key="model" planet={generatedPlanet} />
                ) : (
                    <motion.div
                        key="generator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10"
                    >
                        <PlanetGenerator onPlanetGenerated={handlePlanetGenerated} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative bg-black">
                <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black border-white border-[1px] w-64 h-fit py-2 rounded-[55px] px-2 z-50">
                    <ul className="flex items-center w-full justify-between relative">
                        <NavItem text="Explore" />
                        <NavItem text="Generate" />
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-full bg-white rounded-full z-0"
                            initial={false}
                            animate={{
                                x: active === 'Explore' ? 0 : '100%',
                                width: '50%',
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                    </ul>
                </nav>
            </div>
        </>
    );
}