import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ParallaxItemProps {
  depth: number;  // 0 to 1, 1 being the most affected by parallax
  className?: string;
  children: React.ReactNode;
}

export const ParallaxItem: React.FC<ParallaxItemProps> = ({ 
  depth, 
  className = "", 
  children 
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Apply spring physics for smoother movement
  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  // Transform the spring values based on depth
  const moveX = useTransform(springX, [-500, 500], [-30 * depth, 30 * depth]);
  const moveY = useTransform(springY, [-500, 500], [-30 * depth, 30 * depth]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to the center of the screen
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);
  
  return (
    <motion.div
      className={className}
      style={{
        x: moveX,
        y: moveY,
      }}
    >
      {children}
    </motion.div>
  );
};

interface ParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({ 
  children, 
  className = "" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

// Floating element with a more complex motion
interface FloatingElementProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  xOffset?: number;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  className = "",
  children,
  delay = 0,
  duration = 3,
  yOffset = 15,
  xOffset = 5,
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -yOffset, 0],
        x: [-xOffset, 0, xOffset, 0, -xOffset],
        rotate: [0, 1, 0, -1, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};