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
    navy: "https://galaxy-prod.tlcdn.com/gen/user_33t8y88T1htQ2Ohh0A0DVFfvIXu/1753da7e-9f11-4763-867d-fc4591f46341.png",
    light:
      "https://galaxy-prod.tlcdn.com/gen/user_33t8y88T1htQ2Ohh0A0DVFfvIXu/7fe11f76-7e18-4064-8e6a-987609420f80.png",
  },
  mark: {
    navy: "https://galaxy-prod.tlcdn.com/gen/user_33t8y88T1htQ2Ohh0A0DVFfvIXu/b2d1deb6-0ac0-4076-955b-60cbbfb08e20.png",
    light:
      "https://galaxy-prod.tlcdn.com/gen/user_33t8y88T1htQ2Ohh0A0DVFfvIXu/b2d1deb6-0ac0-4076-955b-60cbbfb08e20.png",
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
      alt="World Wellness Weekend, South Carolina — crescent moon and palmetto tree logo"
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
      aria-label="World Wellness Weekend, South Carolina — home"
      className={cn("inline-block p-1", className)}
    >
      {image}
    </Link>
  );
}
