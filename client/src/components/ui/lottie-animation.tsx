import React, { useRef, useEffect } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import { cn } from '@/lib/utils';

interface LottieAnimationProps {
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  onComplete?: () => void;
  speed?: number;
  style?: React.CSSProperties;
}

export default function LottieAnimation({
  animationData,
  loop = true,
  autoplay = true,
  className,
  onComplete,
  speed = 1,
  style
}: LottieAnimationProps) {
  const animationContainer = useRef<HTMLDivElement>(null);
  const anim = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!animationContainer.current) return;

    anim.current = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: loop,
      autoplay: autoplay,
      animationData: animationData,
    });

    if (speed !== 1 && anim.current) {
      anim.current.setSpeed(speed);
    }

    const animationItem = anim.current;

    if (onComplete && !loop) {
      animationItem.addEventListener('complete', onComplete);
    }

    return () => {
      if (onComplete && !loop && animationItem) {
        animationItem.removeEventListener('complete', onComplete);
      }
      animationItem?.destroy();
    };
  }, [animationData, loop, autoplay, onComplete, speed]);

  return (
    <div 
      ref={animationContainer}
      className={cn('w-full h-full', className)}
      style={style}
    />
  );
}