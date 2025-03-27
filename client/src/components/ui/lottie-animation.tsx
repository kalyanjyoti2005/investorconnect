import React, { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';

interface LottieAnimationProps {
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  height?: number | string;
  width?: number | string;
  onComplete?: () => void;
}

export const LottieAnimation = ({
  animationData,
  loop = true,
  autoplay = true,
  className = '',
  height = 300,
  width = 300,
  onComplete,
}: LottieAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      if (animationRef.current) {
        animationRef.current.destroy();
      }

      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop,
        autoplay,
        animationData,
      });

      if (onComplete) {
        animationRef.current.addEventListener('complete', onComplete);
      }
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        if (onComplete && animationRef.current) {
          animationRef.current.removeEventListener('complete', onComplete);
        }
      }
    };
  }, [animationData, loop, autoplay, onComplete]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
};

export default LottieAnimation;