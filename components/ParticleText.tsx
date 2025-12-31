import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ParticleTextProps {
  text: string;
  size: number;
  position: [number, number, number];
  color: string;
  density?: number; 
  fontFamily?: string;
}

const ParticleText: React.FC<ParticleTextProps> = ({ 
  text, 
  size, 
  position, 
  color, 
  density = 1.5,
  fontFamily = '"Microsoft YaHei", "SimHei", sans-serif'
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  // Ensure fonts are ready before rendering
  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontLoaded(true);
    });
  }, []);
  
  const particles = useMemo(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return new Float32Array(0);

    const fontSize = 100 * density; // Slightly reduced base size for performance
    const fontStyle = `900 ${fontSize}px ${fontFamily}`;
    ctx.font = fontStyle;

    const textMetrics = ctx.measureText(text);
    const width = Math.ceil(textMetrics.width);
    const height = Math.ceil(fontSize * 1.5);

    canvas.width = width;
    canvas.height = height;

    ctx.font = fontStyle;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillText(text, width / 2, height / 2);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    const points: number[] = [];
    const step = 2; 
    
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const i = (y * width + x) * 4;
        if (data[i + 3] > 64) {
          const scale = size / fontSize; 
          const posX = (x - width / 2) * scale;
          const posY = -(y - height / 2) * scale;
          const posZ = (Math.random() - 0.5) * (size * 0.15); // Reduced Z-depth for sharper digital look
          points.push(posX, posY, posZ);
        }
      }
    }
    
    return new Float32Array(points);
  }, [text, size, density, fontFamily, fontLoaded]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.position.y = position[1] + Math.sin(time * 0.5 + position[1]) * 0.05;
  });

  return (
    // Keying by text forces React to recreate the component when text changes.
    // This ensures the BufferGeometry is rebuilt with the correct new particle count,
    // fixing the issue where time appeared frozen.
    <points ref={pointsRef} position={position} key={text}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        color={color}
        size={0.05} 
        sizeAttenuation={true}
        transparent={true}
        opacity={0.95}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleText;