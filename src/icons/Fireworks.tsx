/* eslint-disable */ 
// @ts-nocheck 
import { useEffect, useRef } from "react";
import "./Fireworks.css";

interface FireworkProps {
  x: number;
  y: number;
}

interface ParticleProps {
  x: number;
  y: number;
  color: string;
}

function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let ctx: CanvasRenderingContext2D | null = null;
  const fireworks: FireworkProps[] = [];

  class Firework {
    constructor(canvas: any, ctx: any) {
      this.canvas = canvas;
      this.x = canvas.width / 2;
      this.y = canvas.height;
      this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      this.radius = 2;
      this.velocity = {
        x: Math.random() * 6 - 3,
        y: Math.random() * -10 - 2,
      };
      this.gravity = 0.2;
      this.opacity = 1;
      this.isExploded = false;
      this.particles = [];
      this.maxParticles = 100;
      this.life = 100;
    }

    explode() {
      for (let i = 0; i < this.maxParticles; i++) {
        this.particles.push(new Particle(this.x, this.y, this.color));
      }
      this.isExploded = true;
    }

    update() {
      if (!this.isExploded) {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (this.y <= this.canvas.height / 2) {
          this.explode();
        }
      } else {
        for (let i = this.particles.length - 1; i >= 0; i--) {
          this.particles[i].update();
          if (this.particles[i].life <= 0) {
            this.particles.splice(i, 1);
          }
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.closePath();
      ctx.globalAlpha = 1;
      if (this.isExploded) {
        for (const particle of this.particles) {
          particle.draw();
        }
      }
    }
  }

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.radius = 2;
      this.velocity = {
        x: Math.random() * 6 - 3,
        y: Math.random() * 6 - 3,
      };
      this.life = 50;
    }

    update() {
      this.velocity.x *= 0.98;
      this.velocity.y *= 0.98;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.life--;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.life / 50;
      ctx.fill();
      ctx.closePath();
      ctx.globalAlpha = 1;
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    ctx = canvas?.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 300;

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.03) {
        fireworks.push(new Firework(canvas, ctx));
      }

      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw();
        if (fireworks[i].life <= 0) {
          fireworks.splice(i, 1);
        }
      }
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} className="fireworks-canvas"></canvas>;
}

export default Fireworks;
