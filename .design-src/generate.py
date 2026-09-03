"""Generate the Next.js components from the imported design markup."""
from __future__ import annotations

import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from transpile import to_jsx, shift_headings  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BODY = re.search(
    r"<body>\n(.*)\n</body>", open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "index.html"), encoding="utf-8").read(), re.S
).group(1)

ROUTES = {
    "home": "/", "about": "/about", "projects": "/projects", "detail": "/projects/yon",
    "experience": "/experience", "achievements": "/achievements",
    "writing": "/writing", "contact": "/contact",
}
BANNER = ("// Generated from the Claude Design import by .design-src/generate.py — do not hand-edit.\n"
          "// Markup, inline styles and copy are preserved verbatim from the design.\n\n")


def block(src: str, start: int, tag: str) -> str:
    """Return the full balanced element beginning at `start`."""
    depth = 0
    for m in re.finditer(rf"<{tag}\b[^>]*>|</{tag}>", src[start:]):
        depth += -1 if m.group(0).startswith("</") else 1
        if depth == 0:
            return src[start:start + m.end()]
    raise SystemExit(f"unbalanced <{tag}> at {start}")


def inner(el: str, tag: str) -> str:
    return el[el.index(">") + 1:-(len(tag) + 3)]


ABOUT_KICKER = ('<p style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;'
                'color:var(--color-accent-700);margin:0 0 clamp(20px,3vw,32px)">Hakkında</p>')

# SEO: /about is the page that should answer the query "Kürşat Ürensü kimdir?".
# The heading and lede below are injected after the existing kicker; the design's
# statement heading keeps its exact styling and simply becomes the following <h2>.
# Every fact in the lede is already published elsewhere on the site (role, Trabzon,
# DentalPrices, YÖN, ZMovie, ZConnect, ZMeet) — nothing is inferred.
ABOUT_INTRO = (
    '\n      <h1 style="font-size:clamp(30px,4.6vw,60px);line-height:1.05;letter-spacing:-0.03em;'
    'margin:0 0 clamp(18px,2.5vw,24px);max-width:26ch;text-wrap:balance">Kürşat Ürensü kimdir?</h1>'
    '\n      <p style="font-size:17px;line-height:1.65;color:var(--color-neutral-800);'
    'max-width:62ch;margin:0 0 clamp(32px,5vw,56px);text-wrap:pretty">'
    'Kürşat Ürensü, Trabzon merkezli bir yazılım geliştirici ve girişimci. Web ürünleri '
    'geliştiriyor, platform kuruyor ve kullanıcı araştırması yapıyor. Şu anda DentalPrices\'ta '
    'Jr. Developer olarak çalışıyor; paralelde YÖN ve ZMovie\'yi geliştiriyor. Daha önce ZConnect '
    'konseptini ve ZMeet\'i çıkardı. Geliştirdiği ürünlerin tamamı '
    '<a href="/projects">projeler sayfasında</a>.</p>'
)


def about_intro(html: str) -> str:
    """Inject the "Kürşat Ürensü kimdir?" H1 + lede after the About kicker."""
    assert html.count(ABOUT_KICKER) == 1, "About kicker anchor not found"
    return html.replace(ABOUT_KICKER, ABOUT_KICKER + ABOUT_INTRO)


def fix_contrast(html: str) -> str:
    """Accessibility: --color-neutral-600 on the page background is 3.85:1, below
    WCAG AA for the small text it is used on. --color-neutral-700 is the next step
    on the same ramp and measures 5.83:1. Colour-only change; nothing else moves.

    In the design source this token is only ever used as a `color:` value
    (verified: 58/58 occurrences), so the substitution is unambiguous.
    """
    return html.replace("color:var(--color-neutral-600)", "color:var(--color-neutral-700)")


def link_routes(html: str) -> str:
    """Design nav handlers -> real hrefs."""
    return re.sub(
        r'<a href="#" onclick="go\(event, \'(\w+)\'\)"',
        lambda m: f'<a href="{ROUTES[m.group(1)]}"', html,
    )


def anchors_to_link(jsx: str) -> str:
    """Internal <a> -> next/link <Link>."""
    return re.sub(r'<a (href="/[^"]*")(.*?)>(.*?)</a>',
                  lambda m: f"<Link {m.group(1)}{m.group(2)}>{m.group(3)}</Link>",
                  jsx, flags=re.S)


def component(name: str, body_jsx: str, imports: str = "") -> str:
    return (f"{BANNER}{imports}export default function {name}() {{\n"
            f"  return (\n    <>\n{body_jsx}\n    </>\n  );\n}}\n")


def write(path: str, text: str) -> None:
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    open(full, "w", encoding="utf-8").write(text)
    print("wrote", path)


# ---- page fragments -------------------------------------------------------
pages: dict[str, str] = {}
for m in re.finditer(r'<div class="ku-page" data-page="(\w+)" hidden>', BODY):
    el = block(BODY, m.start(), "div")
    pages[m.group(1)] = inner(el, "div")

gh_start = pages["home"].index('<div data-if="showGithub">')
gh_el = block(pages["home"], gh_start, "div")
home_top = pages["home"][:gh_start]
home_goals = pages["home"][gh_start + len(gh_el):]

# The goals cards sit directly under the section's <h2>, but the design marked
# them <h4>. Promote to <h3> so the home page has no skipped heading level;
# every heading carries an inline font-size, so this is visually a no-op.
home_goals = home_goals.replace("<h4 ", "<h3 ").replace("</h4>", "</h3>")

FRAGMENTS = {
    "components/pages/HomeIntro.tsx": ("HomeIntro", home_top, False),
    "components/pages/HomeGoals.tsx": ("HomeGoals", home_goals, False),
    "components/pages/AboutContent.tsx": ("AboutContent", about_intro(pages["about"]), False),
    "components/pages/ProjectsContent.tsx": ("ProjectsContent", pages["projects"], True),
    "components/pages/YonProjectContent.tsx": ("YonProjectContent", pages["detail"], True),
    "components/pages/ExperienceContent.tsx": ("ExperienceContent", pages["experience"], True),
    "components/pages/AchievementsContent.tsx": ("AchievementsContent", pages["achievements"], True),
    "components/pages/WritingContent.tsx": ("WritingContent", pages["writing"], True),
    "components/pages/ContactContent.tsx": ("ContactContent", pages["contact"], True),
}

IMG_SRC = ('<img src="assets/kursat.jpeg" alt="Kürşat Ürensü" '
           'style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />')
IMG_NEXT = (
    '<Image\n'
    '            src="/assets/kursat.jpeg"\n'
    '            alt="Kürşat Ürensü, dizüstü bilgisayarında çalışırken çekilmiş siyah beyaz portre"\n'
    '            width={1134}\n'
    '            height={2016}\n'
    '            priority\n'
    '            sizes="(max-width: 880px) 100vw, 45vw"\n'
    '            style={{ width: "100%", height: "auto", aspectRatio: "4/5", objectFit: "cover", display: "block" }}\n'
    '          />'
)

for path, (name, frag, shift) in FRAGMENTS.items():
    html = shift_headings(frag) if shift else frag
    jsx = anchors_to_link(to_jsx(fix_contrast(link_routes(html))))
    imports = ""
    if "<Link " in jsx:
        imports += 'import Link from "next/link";\n'
    if IMG_SRC in jsx:
        jsx = jsx.replace(IMG_SRC, IMG_NEXT)
        imports = 'import Image from "next/image";\n' + imports
    if imports:
        imports += "\n"
    write(path, component(name, jsx.rstrip("\n"), imports))
