import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Scene from './components/Scene';
import * as THREE from 'three';

// Cinematic Camera Movement Component
// Pans slowly left and right in an infinite loop
const CameraRig = () => {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // X axis sway: moves between -6 and 6
    state.camera.position.x = Math.sin(t * 0.15) * 6;
    // Slight Z axis breathing: moves between 18 and 22
    state.camera.position.z = 20 + Math.cos(t * 0.1) * 2;
    // Ensure camera always looks at the center text
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

const App: React.FC = () => {
  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Canvas camera={{ position: [0, 0, 20], fov: 45 }} dpr={[1, 2]}>
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.2} /> 
          
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
          
          {/* Replaced OrbitControls with Automatic Camera Rig */}
          <CameraRig />

          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.2} 
              mipmapBlur 
              intensity={0.25} // Slightly increased global bloom, but title material is darker so it won't blow out
              radius={0.3}
            />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
};

export default App;