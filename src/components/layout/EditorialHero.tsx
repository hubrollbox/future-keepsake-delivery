import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EditorialHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  variant?: "dark" | "light";
  size?: "small" | "medium" | "large";
  className?: string;
}

const sizeClasses = {
  small: "min-h-[50vh] py-20",
  medium: "min-h-[70vh] py-24",
  large: "min-h-[85vh] py-32",
};

const EditorialHero = ({
  eyebrow,
  title,
  subtitle,
  children,
  variant = "dark",
  size = "medium",
  className,
}: EditorialHeroProps) => {
  const isDark = variant === "dark";

  return (
    <section
      className={cn(
        "relative w-full flex items-center",
        isDark ? "bg-black text-white" : "bg-white text-black",
        sizeClasses[size],
        className
      )}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-4xl">
          {eyebrow && (
            <motion.p
              className={cn(
                "text-xs md:text-sm uppercase tracking-[0.2em] font-inter font-medium mb-8",
                isDark ? "text-white/60" : "text-black/60"
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {eyebrow}
            </motion.p>
          )}

          <motion.h1
            className={cn(
              "font-bold leading-[1.05] tracking-tight mb-8",
              "text-5xl md:text-7xl lg:text-8xl",
              "font-['Playfair_Display',Georgia,serif]",
              isDark ? "text-white" : "text-black"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {title}
          </motion.h1>

          {/* Linha vermelha de acento */}
          <motion.div
            className="h-[2px] w-16 bg-[#E63946] mb-8"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />

          {subtitle && (
            <motion.div
              className={cn(
                "text-lg md:text-xl font-inter leading-relaxed max-w-2xl mb-10",
                isDark ? "text-white/80" : "text-black/75"
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {subtitle}
            </motion.div>
          )}

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EditorialHero;
