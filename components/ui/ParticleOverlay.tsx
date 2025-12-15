'use client';

import { useEffect, useState } from 'react';

export const ParticleOverlay = () => {
    const [particles, setParticles] = useState<{ id: number; left: number; top: number; delay: number; duration: number }[]>([]);

    useEffect(() => {
        // Generate particles only on client side to avoid hydration mismatch
        const newParticles = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 5,
            duration: Math.random() * 10 + 10, // 10-20s
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
            <style jsx>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-100px) scale(1.2); opacity: 0; }
        }
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background-color: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
          animation-name: floatUp;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>

            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `-${p.delay}s`, // Negative delay to start mid-animation
                    }}
                />
            ))}

            {/* Light Shaft Effect */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-amber-100/10 to-transparent transform -skew-x-12 pointer-events-none mix-blend-overlay" />
        </div>
    );
};
