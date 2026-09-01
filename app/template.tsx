/**
 * A template (not a layout) so React remounts it on every navigation — that
 * replays the design's `kuFade` entry animation, which the canvas got from
 * re-keying <main>. Still a server component: no client JS involved.
 */
export default function MainTemplate({ children }: { children: React.ReactNode }) {
  return (
    <main id="ku-main" tabIndex={-1} style={{ animation: "kuFade 420ms ease both" }}>
      {children}
    </main>
  );
}
