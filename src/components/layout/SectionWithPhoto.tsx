import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionWithPhotoProps {
  image: string;
  alt: string;
  children: ReactNode;
  className?: string;
  imagePosition?: "left" | "right";
  grayscale?: boolean;
}

const SectionWithPhoto = ({ 
  image, 
  alt, 
  children, 
  className,
  imagePosition = "left",
  grayscale = true 
}: SectionWithPhotoProps) => {
  return (
    <div className={cn(
      "grid md:grid-cols-2 gap-8 lg:gap-12 items-center",
      className
    )}>
      {/* Image */}
      <div className={cn(
        "relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden shadow-keepla-intense",
        imagePosition === "right" && "md:order-2"
      )}>
        <img 
          src={image} 
          alt={alt}
          className={cn(
            "w-full h-full object-cover object-center",
            grayscale && "grayscale contrast-110"
          )}
          style={{ minWidth: '100%', minHeight: '100%' }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      
      {/* Content */}
      <div className={cn(
        imagePosition === "right" && "md:order-1"
      )}>
        {children}
      </div>
    </div>
  );
};

export default SectionWithPhoto;
