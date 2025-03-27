import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

const LoadingSpinner = ({ size = "md", className }: LoadingSpinnerProps) => {
  return (
    <div className="flex justify-center items-center p-4">
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size], className)} />
    </div>
  );
};

export default LoadingSpinner;