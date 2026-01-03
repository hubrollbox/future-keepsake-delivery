import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PhotoBackgroundProps {
  image: string;
  alt: string;
  children: ReactNode;
  className?: string;
  overlay?: "light" | "dark" | "gradient";
  grayscale?: boolean;
}

const PhotoBackground = ({ 
  image, 
  alt, 
  children, 
  className,
  overlay = "gradient",
  grayscale = true 
}: PhotoBackgroundProps) => {
  const overlayClasses = {
    light: "bg-white/70",
    dark: "bg-black/60",
    gradient: "bg-gradient-to-b from-black/40 via-black/30 to-black/50"
  };

  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={image} 
          alt={alt}
          className={cn(
            "w-full h-full object-cover object-center",
            grayscale && "grayscale contrast-110"
          )}
          loading="eager"
          style={{ minWidth: '100%', minHeight: '100%' }}
        />
        <div className={cn("absolute inset-0", overlayClasses[overlay])} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default PhotoBackground;
