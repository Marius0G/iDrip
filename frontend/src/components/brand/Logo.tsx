import { cn } from "@/lib/utils";

import logoWideLight from "@/assets/logo-wide-light.svg";
import logoWideDark from "@/assets/logo-wide-dark.svg";
import logoIconLight from "@/assets/logo-icon-light.svg";
import logoIconDark from "@/assets/logo-icon-dark.svg";

type LogoProps = {
  className?: string;
  alt?: string;
};

export function LogoWide({ className, alt = "iDrip" }: LogoProps) {
  return (
    <>
      <img
        src={logoWideLight}
        alt={alt}
        className={cn("block dark:hidden", className)}
      />
      <img
        src={logoWideDark}
        alt={alt}
        aria-hidden
        className={cn("hidden dark:block", className)}
      />
    </>
  );
}

export function LogoIcon({ className, alt = "iDrip" }: LogoProps) {
  return (
    <>
      <img
        src={logoIconLight}
        alt={alt}
        className={cn("block dark:hidden", className)}
      />
      <img
        src={logoIconDark}
        alt={alt}
        aria-hidden
        className={cn("hidden dark:block", className)}
      />
    </>
  );
}
