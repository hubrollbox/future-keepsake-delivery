import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PhotoBackgroundProps {
  image: string;
  alt: string;
  children: ReactNode;
  className?: string;
  overlay?: "light" | "dark" | "gradient";
  grayscale?: boolean;
  size?: "hero" | "banner" | "compact";
}

const PhotoBackground = ({ 
  image, 
  alt, 
  children, 
  className,
  overlay = "gradient",
  grayscale = true,
  size = "hero"
}: PhotoBackgroundProps) => {
  const overlayClasses = {
    light: "bg-white/70",
    dark: "bg-black/60",
    gradient: "bg-gradient-to-b from-black/40 via-black/30 to-black/50"
  };

  const sizeClasses = {
    hero: "min-h-screen",
    banner: "min-h-[40vh]",
    compact: "min-h-[25vh]"
  };

  return (
    <div className={cn("relative overflow-hidden", sizeClasses[size], className)}>
      {/* Background Image - responsive mobile fix */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img 
          src={image} 
          alt={alt}
          className={cn(
            "absolute top-0 left-0 w-full h-full object-cover object-center",
            grayscale && "grayscale contrast-110"
          )}
          style={{ minWidth: '100%', minHeight: '100%', width: '100%', height: '100%' }}
          loading="eager"
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
