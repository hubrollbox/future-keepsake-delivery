import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EditorialSectionProps {
  image?: string;
  alt?: string;
  children: ReactNode;
  variant?: "light" | "dark";
  imagePosition?: "left" | "right";
  grayscale?: boolean;
  className?: string;
}

const EditorialSection = ({
  image,
  alt = "",
  children,
  variant = "light",
  imagePosition = "left",
  grayscale = true,
  className,
}: EditorialSectionProps) => {
  const isDark = variant === "dark";

  return (
    <section
      className={cn(
        "w-full py-20 md:py-28",
        isDark ? "bg-black text-white" : "bg-white text-black",
        className
      )}
    >
      <div className="container mx-auto px-6 md:px-12">
        {image ? (
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div
              className={cn(
                "relative aspect-[4/5] overflow-hidden",
                imagePosition === "right" && "md:order-2"
              )}
            >
              <img
                src={image}
                alt={alt}
                className={cn(
                  "w-full h-full object-cover",
                  grayscale && "grayscale contrast-[1.1]"
                )}
                loading="lazy"
              />
            </div>
            <div
              className={cn(
                "max-w-xl",
                imagePosition === "right" && "md:order-1"
              )}
            >
              {children}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">{children}</div>
        )}
      </div>
    </section>
  );
};

export default EditorialSection;
