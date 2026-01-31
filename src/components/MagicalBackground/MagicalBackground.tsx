/**
 * Magical Background Component
 * Animated Hogwarts night sky with stars and floating elements
 */
import React, { useEffect, useRef } from 'react';
import './MagicalBackground.scss';

export const MagicalBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Star particles
    const stars: Array<{ x: number; y: number; size: number; speed: number; brightness: number }> = [];
    
    // Create stars
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        brightness: Math.random()
      });
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw twinkling stars
      stars.forEach(star => {
        // Twinkling effect
        star.brightness += (Math.random() - 0.5) * 0.1;
        star.brightness = Math.max(0, Math.min(1, star.brightness));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.fill();

        // Slow drift
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="magical-background">
      <canvas ref={canvasRef} className="magical-background__stars" />
      
      {/* Hogwarts Castle Silhouette */}
      <div className="magical-background__castle">
        <div className="castle__tower castle__tower--left"></div>
        <div className="castle__tower castle__tower--center"></div>
        <div className="castle__tower castle__tower--right"></div>
      </div>

      {/* Floating magical particles */}
      <div className="magical-background__particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};
