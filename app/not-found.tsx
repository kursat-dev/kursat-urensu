import Link from "next/link";

export default function NotFound() {
  return (
    <section>
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "clamp(56px,8vw,112px) clamp(20px,5vw,56px)" }}>
        <p style={{ fontSize: "12px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-accent-700)", margin: "0 0 clamp(20px,3vw,32px)" }}>404</p>
        <h1 style={{ fontSize: "clamp(30px,4.6vw,60px)", lineHeight: "1.05", letterSpacing: "-0.03em", margin: "0 0 clamp(24px,3vw,32px)", maxWidth: "22ch" }}>Bu sayfa bulunamadı.</h1>
        <Link href="/" className="btn btn-primary">Ana sayfaya dön →</Link>
      </div>
    </section>
  );
}
