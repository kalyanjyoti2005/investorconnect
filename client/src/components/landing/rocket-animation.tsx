import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function RocketAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);
  const smokeRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const planetRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !rocketRef.current || !smokeRef.current || 
        !starsRef.current || !cloudsRef.current || !planetRef.current) return;
    
    const container = containerRef.current;
    const rocket = rocketRef.current;
    const smoke = smokeRef.current;
    const stars = starsRef.current;
    const clouds = cloudsRef.current;
    const planet = planetRef.current;
    
    // Set initial positions
    gsap.set(rocket, { y: 100, scale: 0.8, rotation: -5 });
    gsap.set(smoke, { autoAlpha: 0 });
    gsap.set(stars, { autoAlpha: 0 });
    gsap.set(clouds, { y: 50, autoAlpha: 0 });
    gsap.set(planet, { scale: 0.8, autoAlpha: 0 });
    
    // Initial animation timeline
    const initialTimeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
    initialTimeline
      .to(stars, { autoAlpha: 0.7, duration: 1 })
      .to(planet, { autoAlpha: 0.9, scale: 1, duration: 1.5 }, "-=0.5")
      .to(rocket, { y: 0, scale: 1, rotation: 0, duration: 1.2, ease: 'elastic.out(0.5, 0.3)' }, "-=1")
      .to(clouds, { y: 0, autoAlpha: 0.7, duration: 1, stagger: 0.2 }, "-=0.8")
      .to(smoke, { autoAlpha: 0.7, duration: 0.5 }, "-=0.5");
    
    // Scroll-based animations
    // 1. Rocket movement
    gsap.to(rocket, {
      y: -150,
      rotation: 10,
      scale: 1.2,
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    });
    
    // 2. Stars parallax
    const starElements = stars.querySelectorAll('.star');
    starElements.forEach((star) => {
      const depth = parseFloat((star as HTMLElement).dataset.depth || '0.5');
      gsap.to(star, {
        y: -100 * depth,
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    });
    
    // 3. Clouds movement
    const cloudElements = clouds.querySelectorAll('.cloud');
    cloudElements.forEach((cloud, i) => {
      const direction = i % 2 === 0 ? -1 : 1;
      gsap.to(cloud, {
        x: direction * 50,
        y: -30,
        autoAlpha: 0,
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'center center',
          scrub: true,
        }
      });
    });
    
    // 4. Planet rotation
    gsap.to(planet, {
      rotation: 10,
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });
    
    // Mouse movement effect for parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - rect.width / 2) / 50;
      const mouseY = (e.clientY - rect.top - rect.height / 2) / 50;
      
      gsap.to(rocket, {
        x: mouseX * -1,
        y: mouseY * -1,
        duration: 1,
        ease: 'power2.out',
      });
      
      gsap.to(stars, {
        x: mouseX * -0.5,
        y: mouseY * -0.5,
        duration: 1,
        ease: 'power2.out',
      });
      
      gsap.to(planet, {
        x: mouseX * -0.2,
        y: mouseY * -0.2,
        duration: 1.5,
        ease: 'power2.out',
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      // Clean up all ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Generate stars with different depths
  const renderStars = () => {
    const starCount = 50;
    return Array.from({ length: starCount }).map((_, i) => {
      const size = Math.random() * 3 + 1;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const depth = Math.random() * 0.8 + 0.2; // 0.2 to 1
      const opacity = Math.random() * 0.7 + 0.3;
      
      return (
        <div
          key={i}
          className="star absolute rounded-full bg-white"
          data-depth={depth.toString()}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}%`,
            left: `${left}%`,
            opacity: opacity,
          }}
        />
      );
    });
  };
  
  // Generate cloud elements
  const renderClouds = () => {
    const cloudCount = 6;
    return Array.from({ length: cloudCount }).map((_, i) => {
      const width = Math.random() * 100 + 50;
      const height = width * 0.5;
      const top = 60 + Math.random() * 20;
      const left = (i * 20) % 100;
      const opacity = Math.random() * 0.4 + 0.1;
      
      return (
        <div
          key={i}
          className="cloud absolute bg-white/30 rounded-full blur-xl"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            top: `${top}%`,
            left: `${left}%`,
            opacity: opacity,
          }}
        />
      );
    });
  };
  
  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* Stars background */}
      <div ref={starsRef} className="absolute inset-0 z-0">
        {renderStars()}
      </div>
      
      {/* Planet */}
      <div 
        ref={planetRef}
        className="absolute right-10 top-1/3 z-0"
      >
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 blur-md"></div>
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-primary/20 via-transparent to-primary/10"></div>
      </div>
      
      {/* Clouds */}
      <div ref={cloudsRef} className="absolute inset-0 z-10">
        {renderClouds()}
      </div>
      
      {/* Rocket */}
      <div 
        ref={rocketRef}
        className="absolute left-2/3 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 will-change-transform"
      >
        <svg width="120" height="240" viewBox="0 0 120 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Rocket Body */}
          <path d="M40 120 L40 200 L80 200 L80 120 Z" fill="#f5f5f5" stroke="#e2e2e2" strokeWidth="2" />
          <path d="M40 120 Q40 100 60 100 Q80 100 80 120 Z" fill="#f5f5f5" stroke="#e2e2e2" strokeWidth="2" />
          
          {/* Rocket Details */}
          <rect x="40" y="160" width="40" height="10" rx="2" fill="#e0e0e0" />
          <rect x="45" y="140" width="30" height="10" rx="5" fill="#e0e0e0" />
          
          {/* Rocket Window */}
          <circle cx="60" cy="130" r="8" fill="hsl(215, 100%, 75%)" stroke="#e2e2e2" strokeWidth="1" />
          <circle cx="60" cy="130" r="4" fill="hsl(215, 100%, 85%)" />
          
          {/* Rocket Fins */}
          <path d="M80 170 L95 180 L95 200 L80 200 Z" fill="hsl(258, 75%, 65%)" />
          <path d="M40 170 L25 180 L25 200 L40 200 Z" fill="hsl(258, 75%, 65%)" />
          
          {/* Rocket Nose */}
          <path d="M40 100 Q60 60 80 100 Z" fill="hsl(258, 75%, 65%)" />
          
          {/* Rocket Flames - Animated separately with Framer Motion */}
        </svg>
        
        {/* Flames using Framer Motion */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{
              scaleY: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '30px',
              height: '40px',
              background: 'linear-gradient(to bottom, #FF6, #F60)',
              borderBottomLeftRadius: '15px',
              borderBottomRightRadius: '15px',
              transformOrigin: 'center bottom',
            }}
          />
          
          <motion.div
            animate={{
              scaleY: [1, 1.2, 1],
              opacity: [0.9, 1, 0.9]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1
            }}
            style={{
              position: 'absolute',
              bottom: '0',
              left: '5px',
              width: '20px',
              height: '25px',
              background: 'linear-gradient(to bottom, #FFF, #FF6)',
              borderBottomLeftRadius: '10px',
              borderBottomRightRadius: '10px',
              transformOrigin: 'center bottom',
            }}
          />
        </div>
      </div>
      
      {/* Smoke particles */}
      <div 
        ref={smokeRef}
        className="absolute left-2/3 bottom-1/3 transform -translate-x-1/2 z-10"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/20 rounded-full blur-sm"
            style={{
              width: Math.random() * 15 + 5,
              height: Math.random() * 15 + 5,
            }}
            initial={{ 
              x: 0, 
              y: 0, 
              opacity: 0.8 
            }}
            animate={{ 
              x: (Math.random() - 0.5) * 30,
              y: 20 + Math.random() * 30,
              opacity: 0,
              scale: 1 + Math.random()
            }}
            transition={{ 
              repeat: Infinity,
              duration: 1 + Math.random() * 2,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    </div>
  );
}