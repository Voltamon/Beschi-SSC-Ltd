
'use client';

import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import React, { useRef, useEffect } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';

const hexToRgb = (hex: string): [number, number, number] => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  }
  const int = parseInt(hex, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vRandom = random;
    vColor = color;
    
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    
    vec4 mvPos = viewMatrix * mPos;

    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }
    
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    
    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

type ParticleHeroProps = {
    onEnterClick: () => void;
};

export function ParticleHero({ onEnterClick }: ParticleHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const particleCount = 200;
    const particleSpread = 10;
    const speed = 0.1;
    const particleColors = ['#B77466', '#FFE1AF', '#E2B59A', '#957C62'];
    const moveParticlesOnHover = false;
    const particleHoverFactor = 1;
    const alphaParticles = false;
    const particleBaseSize = 130;
    const sizeRandomness = 1;
    const cameraDistance = 20;
    const disableRotation = false;
    const pixelRatio = window.devicePixelRatio;

    const renderer = new Renderer({ dpr: pixelRatio, depth: false, alpha: true });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    window.addEventListener('resize', resize, false);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current = { x, y };
    };
    
    if (moveParticlesOnHover) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      let x: number, y: number, z: number, len: number;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      const col = hexToRgb(particleColors[Math.floor(Math.random() * particleColors.length)]);
      colors.set(col, i * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors }
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize * pixelRatio },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 }
      },
      transparent: true,
      depthTest: false
    });

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let animationFrameId: number;
    let elapsed = 0;

    const update = (t: number) => {
      animationFrameId = requestAnimationFrame(update);
      elapsed += speed;

      program.uniforms.uTime.value = elapsed * 0.05;

      if (moveParticlesOnHover) {
        particles.position.x += (mouseRef.current.x * particleHoverFactor - particles.position.x) * 0.1;
        particles.position.y += (mouseRef.current.y * particleHoverFactor - particles.position.y) * 0.1;
      }

      if (!disableRotation) {
         particles.rotation.y += 0.0005;
      }
      
      renderer.render({ scene: particles, camera });
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      if (moveParticlesOnHover) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
       try {
        if (container.contains(gl.canvas)) {
            container.removeChild(gl.canvas);
        }
        renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();
      } catch (e) {
          console.error("Error during cleanup:", e);
      }
    };
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-transparent">
        <div ref={containerRef} className="absolute inset-0 z-0" />
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-center p-4 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <h1 className="text-6xl md:text-8xl font-headline tracking-tight text-primary mb-4">
                Beschi Capital
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-8">
                An exploration of digital art with captivating visual effects.
            </p>
            <Button 
                variant="ghost" 
                size="icon" 
                className="absolute bottom-8 z-10 animate-bounce"
                onClick={onEnterClick}
                aria-label="Enter site"
            >
                <ArrowDown className="h-10 w-10 text-primary" />
            </Button>
        </div>
    </div>
  );
}
