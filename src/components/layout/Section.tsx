import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  background?: "default" | "cream" | "wine" | "parchment";
}

const backgroundVariants = {
  default: "bg-background",
  cream: "bg-cream-gradient",
  wine: "bg-hero text-primary-foreground",
  parchment: "bg-parchment",
};

export const Section = ({ children, className, containerClassName, id, background = "default" }: SectionProps) => {
  return (
    <section id={id} className={cn("py-16 md:py-24", backgroundVariants[background], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
};
