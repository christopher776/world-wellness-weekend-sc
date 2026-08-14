import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "navy" | "light";
  type?: "full" | "mark";
  className?: string;
  imageClassName?: string;
  asLink?: boolean;
}

const sources = {
  full: {
    navy: "https://galaxy-prod.tlcdn.com/gen/f83cd9889fe149b39431c5fd62fdbd9c.png",
    light: "https://galaxy-prod.tlcdn.com/gen/b8ea0a95473548b7ac8dc8a4ee792392.png",
  },
  mark: {
    navy: "https://galaxy-prod.tlcdn.com/gen/e695043e8094468185b775a845faa2e6.png",
    light: "https://galaxy-prod.tlcdn.com/gen/e695043e8094468185b775a845faa2e6.png",
  },
};

export function Logo({
  variant = "navy",
  type = "full",
  className,
  imageClassName,
  asLink = true,
}: LogoProps) {
  const src = sources[type][variant];
  const defaultSize = type === "full" ? "w-[160px]" : "w-10";

  const image = (
    <Image
      src={src}
      alt="South Carolina Wellness Weekend — crescent moon and palmetto tree logo"
      width={1024}
      height={1024}
      priority
      unoptimized
      className={cn("h-auto w-full object-contain", defaultSize, imageClassName)}
    />
  );

  if (!asLink) {
    return <span className={cn("inline-block p-1", className)}>{image}</span>;
  }

  return (
    <Link
      href="/"
      aria-label="South Carolina Wellness Weekend — home"
      className={cn("inline-block p-1", className)}
    >
      {image}
    </Link>
  );
}
