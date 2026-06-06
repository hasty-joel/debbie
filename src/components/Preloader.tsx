/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingBag, Eye, HelpCircle } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
}

// Interactive sound synthesis for an authentic futuristic experience from year 2050
class SoundSynth {
  private ctx: AudioContext | null = null;

  init() {
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio not supported or blocked');
    }
  }

  playStageTransition() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 1.2);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1800, this.ctx.currentTime + 1.0);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    } catch (e) {
      // Ignored
    }
  }

  playFinalExplosion() {
    if (!this.ctx) return;
    try {
      // Lush low frequency ambient boom
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(90, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 2.0);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(45, this.ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(15, this.ctx.currentTime + 2.0);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.2);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc2.start();
      osc.stop(this.ctx.currentTime + 2.5);
      osc2.stop(this.ctx.currentTime + 2.5);
    } catch (e) {
      // Ignored
    }
  }
}

// Vector inline holographic luxury fashion outlines
const HologramSneaker = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-luxury-gold/50 cursor-default" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M15,65 L25,65 C30,65 35,62 38,58 L52,40 C55,36 59,34 64,34 L82,34 L85,45 L85,60 C85,63 83,65 80,65 L15,65 Z" className="hologram-path" />
    <path d="M15,65 C15,69 18,72 22,72 L80,72 C84,72 85,69 85,65" strokeDasharray="3,3" />
    <circle cx="32" cy="72" r="5" className="animate-pulse" />
    <circle cx="68" cy="72" r="5" className="animate-pulse" />
    <path d="M50,45 L62,55 M55,42 L67,52" opacity="0.6" />
    <text x="50" y="28" fill="currentColor" fontSize="6" fontFamily="monospace" letterSpacing="1" opacity="0.8" textAnchor="middle">ATELIER CORE-01</text>
  </svg>
);

const HologramWatch = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-luxury-gold/50 cursor-default" fill="none" stroke="currentColor" strokeWidth="1.2">
    <circle cx="50" cy="50" r="18" className="hologram-path" />
    <circle cx="50" cy="50" r="22" strokeDasharray="4,2" />
    <path d="M50,15 L50,28 M50,72 L50,85 M15,50 L28,50 M72,50 L85,50" />
    <path d="M50,50 L62,42 M50,50 L45,60" strokeWidth="1.8" />
    <rect x="42" y="10" width="16" height="5" rx="1" />
    <rect x="42" y="85" width="16" height="5" rx="1" />
    <text x="50" y="8" fill="currentColor" fontSize="6" fontFamily="monospace" letterSpacing="1" opacity="0.8" textAnchor="middle">CHRONO-50</text>
  </svg>
);

const HologramSunglasses = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-luxury-gold/50 cursor-default" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M12,42 C20,42 24,38 30,42 C36,46 38,55 30,58 C22,61 14,55 12,42 Z" className="hologram-path" />
    <path d="M88,42 C80,42 76,38 70,42 C64,46 62,55 70,58 C78,61 86,55 88,42 Z" className="hologram-path" />
    <path d="M30,42 C38,40 62,40 70,42" />
    <path d="M12,42 C8,42 5,50 5,52" />
    <path d="M88,42 C92,42 95,50 95,52" />
    <line x1="16" y1="46" x2="26" y2="54" opacity="0.7" strokeWidth="1.5" />
    <line x1="74" y1="46" x2="84" y2="54" opacity="0.7" strokeWidth="1.5" />
    <text x="50" y="32" fill="currentColor" fontSize="6" fontFamily="monospace" letterSpacing="1" opacity="0.8" textAnchor="middle">VISION AURA</text>
  </svg>
);

const HologramJacket = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-luxury-gold/50 cursor-default" fill="none" stroke="currentColor" strokeWidth="1.1">
    <path d="M25,25 L35,15 L50,22 L65,15 L75,25 L75,80 L65,85 L50,85 L35,85 L25,80 Z" className="hologram-path" />
    <path d="M35,15 L38,45 L50,45 M65,15 L62,45 L50,45" strokeDasharray="3,3" />
    <path d="M50,22 L50,85" />
    <circle cx="50" cy="35" r="1.5" fill="currentColor" />
    <circle cx="50" cy="50" r="1.5" fill="currentColor" />
    <circle cx="50" cy="65" r="1.5" fill="currentColor" />
    <text x="50" y="10" fill="currentColor" fontSize="6" fontFamily="monospace" letterSpacing="1" opacity="0.8" textAnchor="middle">ATELIER DRAPE</text>
  </svg>
);

const HologramAccessory = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-luxury-gold/50 cursor-default" fill="none" stroke="currentColor" strokeWidth="1.2">
    <rect x="35" y="45" width="30" height="35" rx="3" className="hologram-path" />
    <rect x="42" y="30" width="16" height="15" rx="8" />
    <path d="M35,55 L65,55" />
    <circle cx="50" cy="65" r="3" />
    <path d="M47,65 L53,65 M50,62 L50,68" />
    <text x="50" y="24" fill="currentColor" fontSize="6" fontFamily="monospace" letterSpacing="1" opacity="0.8" textAnchor="middle">LUX SADDLE</text>
  </svg>
);

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; speedY: number; opacity: number }>>([]);
  
  const synthRef = useRef<SoundSynth | null>(null);

  // Loading sequence messages
  const stages = [
    "Curating Your Style Experience",
    "Assembling The Collection",
    "Preparing Luxury",
    "Welcome To The Future Of Fashion"
  ];

  // Initialize Particles and Synth
  useEffect(() => {
    synthRef.current = new SoundSynth();
    synthRef.current.init();

    // Spawn 35 fine high-end particles
    const created: typeof particles = [];
    for (let i = 0; i < 35; i++) {
      created.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 5 + 4,
        speedY: -(Math.random() * 0.4 + 0.1),
        opacity: Math.random() * 0.6 + 0.2
      });
    }
    setParticles(created);
  }, []);

  // Sync animation progress with stages
  useEffect(() => {
    const totalDuration = 4800; // 4.8 seconds total immersive sequence
    const intervalTime = 40;
    const increment = 100 / (totalDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + increment, 100);
        if (next >= 100) {
          clearInterval(timer);
          triggerExplosion();
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Update loading message active stage
  useEffect(() => {
    const nextStage = Math.min(Math.floor(progress / 25), 3);
    if (nextStage !== stage) {
      setStage(nextStage);
      if (synthRef.current) {
        synthRef.current.playStageTransition();
      }
    }
  }, [progress, stage]);

  const triggerExplosion = () => {
    setIsExploded(true);
    if (synthRef.current) {
      synthRef.current.playFinalExplosion();
    }
    // Final reveal duration 1.2s
    setTimeout(() => {
      onComplete();
    }, 1400);
  };

  // Render holographic outline relative to timeline
  const renderCurrentHologram = () => {
    if (progress < 20) return <HologramSneaker />;
    if (progress >= 20 && progress < 45) return <HologramWatch />;
    if (progress >= 45 && progress < 65) return <HologramSunglasses />;
    if (progress >= 65 && progress < 85) return <HologramJacket />;
    return <HologramAccessory />;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between items-center py-10 overflow-hidden font-sans select-none pointer-events-auto">
      {/* Cinematic Metallic/Slate Background Gradients */}
      <div className="absolute inset-0 bg-radial from-slate-900/10 via-zinc-950 to-black z-0" />
      
      {/* Animated Subtle Ambient Highlight Spotlight */}
      <motion.div 
        className="absolute w-[600px] h-[600px] rounded-full bg-slate-800/20 blur-3xl mix-blend-screen"
        animate={{
          x: ['-20%', '20%', '-20%'],
          y: ['-10%', '10%', '-10%'],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Luxury Float Dust Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-luxury-gold/60 filtered-glow"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
            animate={{
              y: [`${p.y}%`, `${p.y - 30}%`],
              opacity: [0, p.opacity, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* TOP HEADER: Luxurious Atelier Coordinates */}
      <div className="w-full max-w-7xl px-8 flex justify-between items-center text-zinc-500 font-mono text-xxs tracking-widest z-20">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 1 }}
        >
          DEBBIE ATELIER COUTURE // SYSTEM v3.0
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex items-center space-x-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-ping" />
          <span>EST. 2026 // ESTRELLA</span>
        </motion.div>
      </div>

      {/* CORE EXPERIENCE STAGE: Circular ring, holographic fashion items, brand materializing */}
      <div className="relative flex-grow flex flex-col justify-center items-center w-full z-20">
        <AnimatePresence mode="wait">
          {!isExploded ? (
            <motion.div
              key="loader-core"
              className="relative flex flex-col items-center justify-center"
              exit={{ scale: 1.4, opacity: 0, filter: "blur(18px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Spinning circular fashion energy ring */}
              <div className="relative w-72 h-72 rounded-full flex items-center justify-center p-6 border border-zinc-900/40 bg-zinc-950/40 backdrop-blur-2xl shadow-[0_0_80px_-15px_rgba(212,175,55,0.15)] overflow-visible">
                
                {/* Outermost Orbiting Light Arc & Particles */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-dashed border-luxury-gold/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />

                {/* Smooth Glowing Ring with actual progress indicator */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                  {/* Underlay tracks */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="47" 
                    fill="none" 
                    stroke="rgba(212, 175, 55, 0.05)" 
                    strokeWidth="0.8" 
                  />
                  {/* Filled active ring */}
                  <motion.circle 
                    cx="50" 
                    cy="50" 
                    r="47" 
                    fill="none" 
                    stroke="url(#goldGradient)" 
                    strokeWidth="1.6"
                    strokeDasharray="295"
                    strokeDashoffset={295 - (295 * progress) / 100}
                    strokeLinecap="round"
                    transition={{ ease: "easeOut" }}
                  />
                  {/* Dynamic gradients definition */}
                  <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#D4AF37" />
                      <stop offset="50%" stopColor="#FFF2CC" />
                      <stop offset="100%" stopColor="#8C7853" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Inner fast-spinning light streak node */}
                <motion.div 
                  className="absolute w-[95%] h-[95%] rounded-full border border-t-2 border-r-transparent border-b-transparent border-l-transparent border-luxury-gold/60"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                {/* Floating Holographic Space in the center */}
                <div className="w-40 h-40 flex items-center justify-center relative p-4">
                  {/* Scanning active timeline laser line effect */}
                  <motion.div 
                    className="absolute left-0 right-0 h-[1.5px] bg-luxury-gold/75 z-10 shadow-[0_0_12px_#D4AF37]"
                    animate={{
                      top: ['10%', '90%', '10%'],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 3.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Holographic interactive mesh visualizer */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={Math.floor(progress / 20)}
                      className="w-28 h-28 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.7, rotateY: 90, filter: "blur(10px)" }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 1.1, rotateY: -90, filter: "blur(12px)" }}
                      transition={{ duration: 0.65, ease: "easeInOut" }}
                    >
                      {renderCurrentHologram()}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Energy pulse orbit particles */}
                <motion.div
                  className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_15px_#fff]"
                  style={{
                    offsetPath: "path('M 144, 0 A 144,144 0 1,1 143.99,0')",
                  }}
                  animate={{
                    offsetDistance: ["0%", "100%"]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>

              {/* BRAND MATERIALIZING LOGO */}
              <motion.div 
                className="mt-14 text-center"
                initial={{ opacity: 0, letterSpacing: '0.4em' }}
                animate={{ opacity: 1, letterSpacing: '0.6em' }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              >
                <h1 className="font-display text-2xl font-bold uppercase text-white tracking-widest leading-none">
                  DEBBIE
                </h1>
                <p className="text-xxxxs font-mono tracking-[0.8em] text-luxury-gold mt-2 uppercase font-medium">
                  FASHION ATELIER
                </p>
              </motion.div>
              
              {/* Dynamic Percentage Counter */}
              <div className="mt-8 flex items-baseline justify-center space-x-1">
                <span className="font-mono text-3xl font-extralight text-white font-semibold">
                  {Math.round(progress)}
                </span>
                <span className="font-mono text-xs text-luxury-gold uppercase tracking-widest font-bold">
                  % COMPILATION
                </span>
              </div>
            </motion.div>
          ) : (
            /* Explosion stage overlay transformation to logo */
            <motion.div 
              key="loader-explosion"
              className="absolute flex flex-col items-center justify-center"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: [1, 1.4, 3], opacity: [1, 1, 0] }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
            >
              {/* Explosion Particle Wave */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute w-full h-full rounded-full border-8 border-luxury-gold/80 animate-ping" />
                <div className="absolute w-3/4 h-3/4 rounded-full border-4 border-white/60 animate-ping [animation-delay:0.2s]" />
                <div className="absolute w-1/2 h-1/2 rounded-full border border-luxury-bronze/55 animate-ping [animation-delay:0.35s]" />
                
                {/* Center Core Flash */}
                <div className="w-16 h-16 rounded-full bg-white shadow-[0_0_80px_30px_#fff]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM SECTION: Staged messaging and elegant text flow */}
      <div className="w-full max-w-xl px-12 flex flex-col items-center mb-6 z-20">
        <div className="h-10 flex items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={stage}
              className="font-sans text-xs tracking-[0.25em] text-zinc-350 dark:text-zinc-200 uppercase"
              initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(6px)" }}
              transition={{ duration: 0.55 }}
            >
              ⚜  {stages[stage]}  ⚜
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Staged micro dots progress indicator */}
        <div className="flex space-x-3 mt-6">
          {stages.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 transition-all duration-500 rounded-full ${
                idx === stage 
                  ? 'w-10 bg-luxury-gold shadow-[0_0_8px_#D4AF37]' 
                  : idx < stage 
                    ? 'w-1.5 bg-luxury-gold/50' 
                    : 'w-1.5 bg-zinc-800'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
