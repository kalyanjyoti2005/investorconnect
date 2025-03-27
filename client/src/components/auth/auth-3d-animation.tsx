import { useEffect, useRef } from 'react';
import { motion, useAnimationControls, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Create 3D cube animation component
const Cube = ({ color = 'rgba(149, 76, 233, 0.7)', size = 60, delay = 0 }: { color?: string, size?: number, delay?: number }) => {
  const controls = useAnimationControls();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: false });

  useEffect(() => {
    if (inView) {
      controls.start('animate');
    } else {
      controls.start('initial');
    }
  }, [inView, controls]);

  const variants: Variants = {
    initial: { 
      rotateX: 0, 
      rotateY: 0, 
      rotateZ: 0,
      scale: 0.8,
      opacity: 0.5,
    },
    animate: { 
      rotateX: 360, 
      rotateY: 360, 
      rotateZ: 0,
      scale: 1,
      opacity: 1,
      transition: { 
        duration: 3, 
        ease: "easeInOut", 
        delay, 
        repeat: Infinity,
        repeatType: "loop"
      } 
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={controls}
      variants={variants}
      style={{
        width: size,
        height: size,
        position: 'relative',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Front face */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: color,
        opacity: 0.8,
        transform: `translateZ(${size/2}px)`,
        borderRadius: '10%'
      }} />
      
      {/* Back face */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: color,
        opacity: 0.8,
        transform: `translateZ(-${size/2}px) rotateY(180deg)`,
        borderRadius: '10%'
      }} />
      
      {/* Right face */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: color,
        opacity: 0.6,
        transform: `translateX(${size/2}px) rotateY(90deg)`,
        borderRadius: '10%'
      }} />
      
      {/* Left face */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: color,
        opacity: 0.6,
        transform: `translateX(-${size/2}px) rotateY(-90deg)`,
        borderRadius: '10%'
      }} />
      
      {/* Top face */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: color,
        opacity: 0.7,
        transform: `translateY(-${size/2}px) rotateX(90deg)`,
        borderRadius: '10%'
      }} />
      
      {/* Bottom face */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: color,
        opacity: 0.7,
        transform: `translateY(${size/2}px) rotateX(-90deg)`,
        borderRadius: '10%'
      }} />
    </motion.div>
  );
};

// Create floating sphere component
const Sphere = ({ color = 'rgba(149, 76, 233, 0.5)', size = 50, delay = 0 }: { color?: string, size?: number, delay?: number }) => {
  const controls = useAnimationControls();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: false });

  useEffect(() => {
    if (inView) {
      controls.start('animate');
    } else {
      controls.start('initial');
    }
  }, [inView, controls]);

  const variants: Variants = {
    initial: { 
      y: 0, 
      opacity: 0.5,
      scale: 0.8
    },
    animate: { 
      y: [-20, 20, -20], 
      opacity: [0.7, 1, 0.7],
      scale: [0.9, 1.1, 0.9],
      transition: { 
        duration: 4, 
        ease: "easeInOut", 
        delay, 
        repeat: Infinity,
      } 
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={controls}
      variants={variants}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, white, ${color})`,
        boxShadow: `0 0 20px ${color}`,
      }}
    />
  );
};

// Create glowing connection lines
const ConnectingLine = ({ 
  start = { x: 0, y: 0 }, 
  end = { x: 100, y: 100 },
  color = 'rgba(149, 76, 233, 0.6)',
  width = 2,
  delay = 0
}: { 
  start?: { x: number, y: number }, 
  end?: { x: number, y: number },
  color?: string,
  width?: number,
  delay?: number
}) => {
  const controls = useAnimationControls();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: false });
  
  // Calculate angle and length
  const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
  const length = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));

  useEffect(() => {
    if (inView) {
      controls.start('animate');
    } else {
      controls.start('initial');
    }
  }, [inView, controls]);

  const variants: Variants = {
    initial: { 
      scaleX: 0, 
      opacity: 0
    },
    animate: { 
      scaleX: 1, 
      opacity: [0.3, 0.8, 0.3],
      transition: { 
        duration: 3, 
        ease: "easeInOut", 
        delay,
        opacity: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }
      } 
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={controls}
      variants={variants}
      style={{
        position: 'absolute',
        left: start.x,
        top: start.y,
        width: length,
        height: width,
        backgroundColor: color,
        transformOrigin: '0 0',
        transform: `rotate(${angle}deg)`,
        boxShadow: `0 0 8px ${color}`,
      }}
    />
  );
};

// Main 3D animation component
export default function Auth3DAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/30 z-0" />
      
      {/* 3D elements */}
      <div className="absolute left-[20%] top-[15%]">
        <Cube color="rgba(149, 76, 233, 0.7)" size={80} delay={0.5} />
      </div>
      
      <div className="absolute right-[30%] top-[25%]">
        <Sphere color="rgba(149, 76, 233, 0.6)" size={60} delay={0.2} />
      </div>
      
      <div className="absolute left-[50%] top-[60%]">
        <Cube color="rgba(149, 76, 233, 0.5)" size={70} delay={0.8} />
      </div>
      
      <div className="absolute right-[15%] bottom-[20%]">
        <Sphere color="rgba(149, 76, 233, 0.7)" size={90} delay={0.4} />
      </div>
      
      <div className="absolute left-[30%] bottom-[30%]">
        <Sphere color="rgba(149, 76, 233, 0.5)" size={50} delay={1} />
      </div>
      
      {/* Connecting lines */}
      <ConnectingLine 
        start={{ x: 140, y: 120 }} 
        end={{ x: 270, y: 160 }}
        delay={1.2}
      />
      
      <ConnectingLine 
        start={{ x: 140, y: 120 }} 
        end={{ x: 190, y: 280 }}
        delay={1.5}
      />
      
      <ConnectingLine 
        start={{ x: 270, y: 160 }} 
        end={{ x: 350, y: 300 }}
        delay={1.8}
      />
      
      <ConnectingLine 
        start={{ x: 190, y: 280 }} 
        end={{ x: 270, y: 160 }}
        delay={2}
      />
      
      <ConnectingLine 
        start={{ x: 190, y: 280 }} 
        end={{ x: 350, y: 300 }}
        delay={2.2}
      />
      
      {/* Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.2,
          }}
          animate={{
            y: [0, -Math.random() * 100 - 50],
            x: [0, (Math.random() - 0.5) * 50],
            opacity: [0, Math.random() * 0.5 + 0.2, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}