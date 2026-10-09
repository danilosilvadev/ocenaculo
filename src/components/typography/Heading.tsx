import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeadingProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
  size?: "xl" | "lg" | "md" | "sm";
}

const sizeVariants = {
  xl: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight",
  lg: "text-3xl sm:text-4xl md:text-5xl font-bold leading-tight",
  md: "text-2xl sm:text-3xl font-semibold",
  sm: "text-xl sm:text-2xl font-semibold",
};

export const Heading = ({ children, className, as: Component = "h2", size = "lg" }: HeadingProps) => {
  return <Component className={cn("font-serif", sizeVariants[size], className)}>{children}</Component>;
};
