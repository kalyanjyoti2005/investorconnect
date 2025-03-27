import { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";

interface LottieAnimationProps {
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
  style?: React.CSSProperties;
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function LottieAnimation({
  animationData,
  loop = true,
  autoplay = true,
  style,
  className,
  width = "100%",
  height = "100%"
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop,
      autoplay,
      animationData
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [animationData, loop, autoplay]);

  return (
    <div
      ref={containerRef}
      style={{ width, height, ...style }}
      className={className}
    />
  );
}