import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionWithPhotoProps {
  image: string;
  alt: string;
  children: ReactNode;
  className?: string;
  imagePosition?: "left" | "right";
  grayscale?: boolean;
  /** Posição do foco da imagem em mobile (ex: "center", "top", "center_20%") */
  imageFocus?: string;
  /** Rotação da imagem em graus (ex: 90, -90, 180) */
  imageRotation?: number;
}

const SectionWithPhoto = ({ 
  image, 
  alt, 
  children, 
  className,
  imagePosition = "left",
  grayscale = true,
  imageFocus = "center",
  imageRotation = 0
}: SectionWithPhotoProps) => {
  // Gerar estilo inline para object-position customizado
  const getObjectPosition = () => {
    if (imageFocus.includes("_")) {
      return imageFocus.replace("_", " ");
    }
    return imageFocus;
  };

  // Escalar a imagem quando rodada para preencher o container
  const getImageStyle = () => {
    const baseStyle = {
      minWidth: '100%', 
      minHeight: '100%', 
      width: '100%', 
      height: '100%',
      objectPosition: getObjectPosition()
    };
    
    if (imageRotation !== 0) {
      return {
        ...baseStyle,
        transform: `rotate(${imageRotation}deg) scale(1.4)`,
        transformOrigin: 'center center'
      };
    }
    return baseStyle;
  };

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
            "absolute top-0 left-0 w-full h-full object-cover",
            grayscale && "grayscale contrast-110"
          )}
          style={getImageStyle()}
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
