'use client';

import React, { useEffect, useRef } from "react";

const CrackerBurst = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const colors = [
      "#ff6600",
      "#ffcc33",
      "#8b0000",
      "#FF4500",
      "#FFD700",
      "#FF1493",
      "#00FF87",
      "#00BFFF",
      "#FF69B4",
      "#FFA500",
      "#7B68EE",
      "#00CED1",
      "#FF6347",
      "#32CD32",
    ];

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.008;
        this.size = Math.random() * 2.5 + 1;
        this.gravity = 0.05;
      }

      update() {
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw(ctx) {
        // Flicker effect for sparkling
        const flicker = Math.random() > 0.4 ? 1 : 0.5;
        ctx.globalAlpha = this.alpha * flicker;
        
        // Draw a sharp streak based on velocity
        const trailLength = 1.5;
        const prevX = this.x - this.vx * trailLength;
        const prevY = this.y - this.vy * trailLength;
        
        // Outer colored spark
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.lineCap = "round";
        ctx.stroke();

        // Inner white/hot core for realism
        ctx.beginPath();
        ctx.moveTo(prevX + (this.x - prevX) * 0.5, prevY + (this.y - prevY) * 0.5);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = this.size * 0.4;
        ctx.stroke();
        
        ctx.globalAlpha = 1;
      }
    }

    class Rocket {
      constructor() {
        this.x = Math.random() * w * 0.6 + w * 0.2;
        this.y = h;
        this.targetY = Math.random() * h * 0.4 + h * 0.1;
        this.speed = Math.random() * 3 + 4;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.exploded = false;
        this.trail = [];
      }

      update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 8) this.trail.shift();
        this.y -= this.speed;
        if (this.y <= this.targetY) {
          this.exploded = true;
        }
      }

      draw(ctx) {
        for (let i = 0; i < this.trail.length; i++) {
          const t = this.trail[i];
          ctx.beginPath();
          ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.globalAlpha = (i / this.trail.length) * 0.6;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 1;
        ctx.fill();
      }
    }

    let particles = [];
    let rockets = [];
    let launchCount = 0;
    const maxLaunches = 12;

    const explode = (x, y, color) => {
      const count = Math.floor(Math.random() * 40) + 50;
      for (let i = 0; i < count; i++) {
        particles.push(
          new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]),
        );
      }
    };

    const launchRocket = () => {
      if (launchCount < maxLaunches) {
        rockets.push(new Rocket());
        launchCount++;
      }
    };

    // Launch rockets in bursts
    const intervals = [];
    for (let i = 0; i < 4; i++) {
      intervals.push(
        setTimeout(() => {
          launchRocket();
          launchRocket();
          launchRocket();
        }, i * 600),
      );
    }

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Update & draw rockets
      rockets = rockets.filter((r) => {
        r.update();
        if (r.exploded) {
          explode(r.x, r.y, r.color);
          return false;
        }
        r.draw(ctx);
        return true;
      });

      // Update & draw particles
      particles = particles.filter((p) => {
        p.update();
        if (p.alpha <= 0) return false;
        p.draw(ctx);
        return true;
      });

      // Keep animating while there's stuff to draw
      if (
        particles.length > 0 ||
        rockets.length > 0 ||
        launchCount < maxLaunches
      ) {
        animId = requestAnimationFrame(animate);
      }
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      intervals.forEach(clearTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
};

export default CrackerBurst;
