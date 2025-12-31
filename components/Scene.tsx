import React from 'react';
import { useCountdown } from '../hooks/useCountdown';
import ParticleText from './ParticleText';

const Scene: React.FC = () => {
  const timeLeft = useCountdown('2026-01-01T00:00:00');
  
  const totalHours = timeLeft.days * 24 + timeLeft.hours;
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  // Compact Digital Clock Format: Removed colons as requested
  // Replaced " : " with spaces to eliminate the "glowing dots" between number groups
  const countdownString = `${pad(totalHours)}   ${pad(timeLeft.minutes)}   ${pad(timeLeft.seconds)}`;

  // Color Palette
  const SILVER_BRIGHT = "#FFFFFF"; 
  // Darker Grey for Title to reduce Bloom intensity (Bloom threshold is usually ~0.2-0.6)
  const TITANIUM_GREY = "#6B7280"; 
  const SILVER_DARK = "#9CA3AF"; 

  return (
    <group>
      {/* Top Title - Literary Font ("ZCOOL XiaoWei") */}
      <ParticleText 
        text="距离 2026" 
        size={1.1} 
        position={[0, 2.2, 0]} 
        color={TITANIUM_GREY} // Darker color = Less Bloom
        density={2} 
        fontFamily='"ZCOOL XiaoWei", serif'
      />

      {/* Main Countdown - Monospaced Digital Clock Style */}
      <ParticleText 
        text={countdownString} 
        size={3.0} 
        position={[0, 0, 0]} 
        color={SILVER_BRIGHT} 
        density={2.5} 
        fontFamily="'Share Tech Mono', monospace" 
      />

      {/* Signature Footer */}
      <ParticleText 
        text="MENGTIAN LIVESHOW" 
        size={1.2} 
        position={[0, -2.2, 0]} 
        color={SILVER_DARK} 
        density={1.5}
        fontFamily="'Orbitron', sans-serif" 
      />
    </group>
  );
};

export default Scene;