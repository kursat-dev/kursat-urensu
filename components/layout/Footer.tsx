import Link from "next/link";

import { siteConfig } from "@/lib/site";

const SITE_LINKS = [
  { href: "/projects", label: "Projeler" },
  { href: "/experience", label: "Deneyim" },
  { href: "/achievements", label: "Başarılar" },
] as const;

const SOCIAL_LINKS = [
  { href: siteConfig.social.github, label: "GitHub" },
  { href: siteConfig.social.linkedin, label: "LinkedIn" },
  { href: siteConfig.social.instagram, label: "Instagram" },
] as const;

const linkStyle = { color: "var(--color-text)", textDecoration: "none" } as const;
const columnStyle = { display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" } as const;

export default function Footer() {
  return (
    <footer style={{ borderTop: "2px solid var(--color-divider)" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "clamp(32px,4vw,56px) clamp(20px,5vw,56px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "clamp(20px,3vw,40px)" }}>
        <div>
          <p style={{ fontFamily: "var(--font-heading)", fontWeight: "800", fontSize: "17px", margin: "0 0 6px" }}>{siteConfig.name}</p>
          <p style={{ margin: "0", fontSize: "13px", color: "var(--color-neutral-700)" }}>{siteConfig.role}</p>
        </div>
        <nav style={columnStyle} aria-label="Alt bilgi gezinmesi">
          {SITE_LINKS.map((link) => (
            <Link key={link.href} href={link.href} style={linkStyle}>{link.label}</Link>
          ))}
        </nav>
        <div style={columnStyle}>
          {SOCIAL_LINKS.map((link) => (
            <a key={link.href} href={link.href} style={linkStyle} rel="me noopener noreferrer">{link.label}</a>
          ))}
        </div>
        <p style={{ margin: "0", fontSize: "12px", color: "var(--color-neutral-700)" }}>© 2026 Kürşat Ürensü. Trabzon, Türkiye.</p>
      </div>
    </footer>
  );
}
