// usePlanetControls.js
import { useControls } from 'leva';

const usePlanetControls = () => {
  const { temperature, vegetation, seaLevel, sunProximity } = useControls({
    vegetation: { value: 0, min: 0, max: 0.3, step: 0.01 },
    seaLevel: { value: 0, min: 0, max: 0.7, step: 0.01 },
    temperature: { value: 0, min: 0, max: 0.8, step: 0.1 },
    sunProximity: { value: 0, min: 0, max: 0.8, step: 0.1 }
  });

  // The hook returns the control values so they can be used in components
  return { temperature, vegetation, seaLevel, sunProximity };
};

export default usePlanetControls;
