import { ReactNode } from "react";
import PhotoBackground from "./PhotoBackground";

interface PageHeroProps {
  image: string;
  alt: string;
  title: string;
  subtitle?: string;
  quote?: string;
  children?: ReactNode;
  overlay?: "dark" | "light" | "gradient";
  size?: "small" | "medium" | "large";
}

const sizeClasses = {
  small: "min-h-[40vh] py-16",
  medium: "min-h-[50vh] py-20",
  large: "min-h-[60vh] py-24",
};

const PageHero = ({
  image,
  alt,
  title,
  subtitle,
  quote,
  children,
  overlay = "gradient",
  size = "medium",
}: PageHeroProps) => {
  return (
    <PhotoBackground
      image={image}
      alt={alt}
      overlay={overlay}
      className={`${sizeClasses[size]} flex items-center`}
    >
      <div className="container mx-auto px-4 text-center">
        {/* Quote opcional */}
        {quote && (
          <p className="text-keepla-white/70 font-georgia italic text-lg mb-4">
            {quote}
          </p>
        )}
        
        {/* Título */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-inter font-bold text-keepla-white mb-6">
          {title.includes("keepla") ? (
            <>
              {title.split("keepla")[0]}
              <span className="text-keepla-red">keepla</span>
              {title.split("keepla")[1]}
            </>
          ) : (
            title
          )}
        </h1>
        
        {/* Subtítulo */}
        {subtitle && (
          <p className="text-lg md:text-xl text-keepla-white/80 max-w-2xl mx-auto font-inter">
            {subtitle}
          </p>
        )}
        
        {/* Conteúdo adicional (botões, etc.) */}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </PhotoBackground>
  );
};

export default PageHero;
