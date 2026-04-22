import { cn } from "@/lib/utils";

interface ImageBlockProps {
  image: string;
  alt: string;
  caption?: string;
  grayscale?: boolean;
  fullBleed?: boolean;
  className?: string;
}

const ImageBlock = ({
  image,
  alt,
  caption,
  grayscale = true,
  fullBleed = true,
  className,
}: ImageBlockProps) => {
  return (
    <figure className={cn("w-full bg-white", className)}>
      <div
        className={cn(
          "relative overflow-hidden",
          "aspect-[4/3] md:aspect-[21/9]",
          !fullBleed && "container mx-auto px-6 md:px-12"
        )}
      >
        <img
          src={image}
          alt={alt}
          className={cn(
            "w-full h-full object-cover object-center",
            grayscale && "grayscale contrast-[1.1]"
          )}
          loading="lazy"
          decoding="async"
        />
      </div>
      {caption && (
        <figcaption className="container mx-auto px-6 md:px-12 py-4 text-sm text-black/60 font-inter italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default ImageBlock;
