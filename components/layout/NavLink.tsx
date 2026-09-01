"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

interface NavLinkProps {
  href: string;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}

/**
 * The only client component in the app: it needs the current pathname to mark
 * the active nav item, matching the design's `aria-current="page"` highlight.
 *
 * `/projects/yon` keeps the "Projeler" item active, exactly as the design did.
 */
export default function NavLink({ href, style, className, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      style={style}
      className={className}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
