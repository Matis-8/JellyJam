'use client';
import React, { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  saturation: number;
  lightness: number;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
  wobblePhase: number;
}

const BUBBLE_CONFIGS = [
  { radius: 72, hue: 174, saturation: 82, lightness: 46, opacity: 0.18 },
  { radius: 52, hue: 38,  saturation: 90, lightness: 55, opacity: 0.16 },
  { radius: 88, hue: 174, saturation: 70, lightness: 60, opacity: 0.13 },
  { radius: 44, hue: 210, saturation: 75, lightness: 58, opacity: 0.15 },
  { radius: 64, hue: 145, saturation: 65, lightness: 50, opacity: 0.14 },
  { radius: 56, hue: 38,  saturation: 80, lightness: 62, opacity: 0.17 },
  { radius: 40, hue: 174, saturation: 85, lightness: 42, opacity: 0.19 },
];

export default function PhysicsBubbles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const animFrameRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      sizeRef.current = { w, h };
    };

    resize();
    window.addEventListener('resize', resize);

    // Init bubbles
    bubblesRef.current = BUBBLE_CONFIGS.map((cfg) => {
      const { w, h } = sizeRef.current;
      const speed = 3.5 + Math.random() * 3.0;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: cfg.radius + Math.random() * (w - cfg.radius * 2),
        y: cfg.radius + Math.random() * (h - cfg.radius * 2),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: cfg.radius,
        hue: cfg.hue,
        saturation: cfg.saturation,
        lightness: cfg.lightness,
        opacity: cfg.opacity,
        wobble: 0,
        wobbleSpeed: 0.015 + Math.random() * 0.01,
        wobblePhase: Math.random() * Math.PI * 2,
      };
    });

    const drawBubble = (b: Bubble, t: number) => {
      const { x, y, radius, hue, saturation, lightness, opacity } = b;
      const wobbleAmt = Math.sin(t * b.wobbleSpeed + b.wobblePhase) * 2;
      const rx = radius + wobbleAmt;
      const ry = radius - wobbleAmt * 0.5;

      ctx.save();
      ctx.translate(x, y);

      // Main bubble body
      const bodyGrad = ctx.createRadialGradient(-rx * 0.25, -ry * 0.3, rx * 0.05, 0, 0, rx * 1.1);
      bodyGrad.addColorStop(0, `hsla(${hue}, ${saturation}%, ${Math.min(lightness + 28, 95)}%, ${opacity * 1.4})`);
      bodyGrad.addColorStop(0.4, `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`);
      bodyGrad.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness - 15}%, ${opacity * 0.6})`);

      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Rim highlight (outer glow ring)
      const rimGrad = ctx.createRadialGradient(0, 0, rx * 0.75, 0, 0, rx * 1.05);
      rimGrad.addColorStop(0, `hsla(${hue}, ${saturation}%, 95%, 0)`);
      rimGrad.addColorStop(0.7, `hsla(${hue}, ${saturation}%, 95%, 0)`);
      rimGrad.addColorStop(1, `hsla(${hue}, ${saturation}%, 95%, ${opacity * 0.9})`);

      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = rimGrad;
      ctx.fill();

      // Top specular highlight (large soft)
      const specGrad1 = ctx.createRadialGradient(-rx * 0.2, -ry * 0.45, 0, -rx * 0.2, -ry * 0.45, rx * 0.55);
      specGrad1.addColorStop(0, `rgba(255,255,255,${opacity * 3.5})`);
      specGrad1.addColorStop(0.5, `rgba(255,255,255,${opacity * 1.2})`);
      specGrad1.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.beginPath();
      ctx.ellipse(-rx * 0.2, -ry * 0.45, rx * 0.38, ry * 0.22, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = specGrad1;
      ctx.fill();

      // Small sharp specular dot
      const specGrad2 = ctx.createRadialGradient(-rx * 0.28, -ry * 0.52, 0, -rx * 0.28, -ry * 0.52, rx * 0.12);
      specGrad2.addColorStop(0, `rgba(255,255,255,${opacity * 5})`);
      specGrad2.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.beginPath();
      ctx.ellipse(-rx * 0.28, -ry * 0.52, rx * 0.1, ry * 0.07, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = specGrad2;
      ctx.fill();

      // Bottom caustic reflection
      const causticGrad = ctx.createRadialGradient(rx * 0.15, ry * 0.55, 0, rx * 0.15, ry * 0.55, rx * 0.3);
      causticGrad.addColorStop(0, `hsla(${hue}, 100%, 90%, ${opacity * 1.5})`);
      causticGrad.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.beginPath();
      ctx.ellipse(rx * 0.15, ry * 0.55, rx * 0.22, ry * 0.12, 0.4, 0, Math.PI * 2);
      ctx.fillStyle = causticGrad;
      ctx.fill();

      ctx.restore();
    };

    let t = 0;
    const GRAVITY = 0.08;
    const DAMPING = 0.999;

    const animate = () => {
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);
      t++;

      const bubbles = bubblesRef.current;

      // Update physics
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];

        // Gentle gravity
        b.vy += GRAVITY;
        b.vx *= DAMPING;
        b.vy *= DAMPING;

        // Minimum speed to keep them moving
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (speed < 2.5) {
          const angle = Math.random() * Math.PI * 2;
          b.vx += Math.cos(angle) * 1.5;
          b.vy += Math.sin(angle) * 1.5;
        }

        b.x += b.vx;
        b.y += b.vy;

        // Wall collisions
        if (b.x - b.radius < 0) {
          b.x = b.radius;
          b.vx = Math.abs(b.vx) * 0.97;
          b.wobblePhase = t * b.wobbleSpeed;
        }
        if (b.x + b.radius > w) {
          b.x = w - b.radius;
          b.vx = -Math.abs(b.vx) * 0.97;
          b.wobblePhase = t * b.wobbleSpeed;
        }
        if (b.y - b.radius < 0) {
          b.y = b.radius;
          b.vy = Math.abs(b.vy) * 0.97;
          b.wobblePhase = t * b.wobbleSpeed;
        }
        if (b.y + b.radius > h) {
          b.y = h - b.radius;
          b.vy = -Math.abs(b.vy) * 0.97;
          b.wobblePhase = t * b.wobbleSpeed;
        }

        // Bubble-bubble collisions
        for (let j = i + 1; j < bubbles.length; j++) {
          const b2 = bubbles[j];
          const dx = b2.x - b.x;
          const dy = b2.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = b.radius + b2.radius;

          if (dist < minDist && dist > 0) {
            // Separate overlapping bubbles
            const overlap = (minDist - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;
            b.x -= nx * overlap;
            b.y -= ny * overlap;
            b2.x += nx * overlap;
            b2.y += ny * overlap;

            // Elastic collision response
            const dvx = b.vx - b2.vx;
            const dvy = b.vy - b2.vy;
            const dot = dvx * nx + dvy * ny;

            if (dot > 0) {
              const m1 = b.radius * b.radius;
              const m2 = b2.radius * b2.radius;
              const total = m1 + m2;
              const restitution = 0.75;

              const impulse = (2 * dot * restitution) / total;
              b.vx -= impulse * m2 * nx;
              b.vy -= impulse * m2 * ny;
              b2.vx += impulse * m1 * nx;
              b2.vy += impulse * m1 * ny;

              // Trigger wobble on collision
              b.wobblePhase = t * b.wobbleSpeed;
              b2.wobblePhase = t * b2.wobbleSpeed;
            }
          }
        }
      }

      // Draw all bubbles
      for (const b of bubbles) {
        drawBubble(b, t);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
}
