import { cn } from "@/lib/utils";
import logoWine from "@/assets/logo-mark.png";
import logoLight from "@/assets/logo-mark-light.png";

interface BrandMarkProps {
  className?: string;
  alt?: string;
  variant?: "wine" | "light";
}

export const BrandMark = ({ className, alt = "O Cenáculo", variant = "wine" }: BrandMarkProps) => {
  return (
    <img
      src={variant === "light" ? logoLight : logoWine}
      alt={alt}
      className={cn("h-9 w-auto object-contain", className)}
    />
  );
};
