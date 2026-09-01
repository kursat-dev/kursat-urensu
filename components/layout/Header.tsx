import Link from "next/link";

import NavLink from "./NavLink";

const NAV_ITEMS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/about", label: "Hakkında" },
  { href: "/projects", label: "Projeler" },
  { href: "/experience", label: "Deneyim" },
  { href: "/achievements", label: "Başarılar" },
  { href: "/writing", label: "Yazılar" },
] as const;

const navLinkStyle = { color: "var(--color-text)", textDecoration: "none" } as const;

export default function Header() {
  return (
    <header style={{ position: "sticky", top: "0", zIndex: "20", background: "var(--color-bg)", borderBottom: "2px solid var(--color-divider)" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto", display: "flex", alignItems: "center", gap: "clamp(12px,2vw,28px)", padding: "14px clamp(20px,5vw,56px)" }}>
        <Link href="/" style={{ fontFamily: "var(--font-heading)", fontWeight: "800", fontSize: "17px", letterSpacing: "-0.02em", color: "var(--color-text)", textDecoration: "none", marginRight: "auto", whiteSpace: "nowrap" }}>Kürşat Ürensü</Link>
        <nav style={{ display: "flex", flexWrap: "wrap", gap: "clamp(10px,1.6vw,22px)", fontSize: "14px" }} aria-label="Ana gezinme">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} href={item.href} style={navLinkStyle}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link href="/contact" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>İletişime Geç</Link>
      </div>
    </header>
  );
}
