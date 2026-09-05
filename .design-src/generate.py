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


OLD_INSTAGRAM = "https://instagram.com/kursat.dev"
NEW_INSTAGRAM = "https://www.instagram.com/kursat.sft/"
OLD_HANDLE = "@kursat.dev"
NEW_HANDLE = "@kursat.sft"

# The old "Yedek: @kursat.sft" line on /contact. Matched loosely on the colour
# token because fix_contrast() has already rewritten neutral-600 -> neutral-700
# by the time this runs.
BACKUP_HANDLE_RE = re.compile(
    r'\n\s*<p style="margin:6px 0 0;font-size:12px;'
    r'color:var\(--color-neutral-\d00\)">Yedek: @kursat\.[a-z]+</p>'
)


def update_instagram(html: str) -> str:
    """Point Instagram at the current account, @kursat.sft.

    The account moved from @kursat.dev, so the link, the visible handle and the
    now-redundant "Yedek" line are all brought in line with the live profile —
    a handle that disagrees with the sameAs URL weakens entity matching.
    """
    html = html.replace(OLD_INSTAGRAM, NEW_INSTAGRAM)
    html = html.replace(f">{OLD_HANDLE}<", f">{NEW_HANDLE}<")
    if "Yedek: @kursat" in html:
        html, removed = BACKUP_HANDLE_RE.subn("", html)
        assert removed == 1, f"expected 1 backup-handle line, removed {removed}"
        assert "Yedek: @kursat" not in html, "backup handle line survived"
    return html


# ── projects: real status + verifiable links ───────────────────────────────
# Mirrors lib/projects.ts, which feeds the structured data. verify_projects()
# below asserts the two agree, so the visible card and the JSON-LD can never
# drift apart.
#
# ZConnect is dropped entirely: it is inactive and has no site or repository.
# DentalPrices intentionally has no repository link (private, business-owned).
# The GitHub links are written case studies, not product source code, so they
# are labelled "Case study" rather than "GitHub".
PROJECT_FACTS = {
    "YÖN": {
        "status": "Concept · Investment Demo",
        "website": "https://yon-dev.vercel.app/",
        "case_study": "https://github.com/kursat-dev/case-study-yon",
    },
    "ZMovie": {
        "status": "In Development",
        "website": "http://zmovie-omega.vercel.app/",
        "case_study": "https://github.com/kursat-dev/case-study-zmovie",
    },
    "ZMeet": {
        "status": "Live",
        "website": "https://zmeet.com.tr",
        "case_study": "https://github.com/kursat-dev/case-study-zmeet",
    },
    "DentalPrices": {
        "status": "Professional Experience",
        "website": "https://www.dentalprices.com/tr",
        "case_study": None,
    },
}
DROPPED_PROJECTS = ("ZConnect",)

LINK_ROW_STYLE = (
    "display:flex;flex-wrap:wrap;align-items:center;gap:clamp(10px,1.5vw,18px);margin-top:18px"
)
EXTERNAL_LINK_STYLE = "padding-inline:0"


def verify_projects() -> None:
    """Fail loudly if lib/projects.ts and PROJECT_FACTS disagree."""
    ts = open(os.path.join(ROOT, "lib", "projects.ts"), encoding="utf-8").read()
    for name, facts in PROJECT_FACTS.items():
        entry = re.search(
            r'name:\s*"' + re.escape(name) + r'",(.*?)\n  \},', ts, re.S
        )
        assert entry, f"{name} not found in lib/projects.ts"
        body = entry.group(1)
        status = re.search(r'status:\s*"([^"]*)"', body)
        assert status and status.group(1) == facts["status"], (
            f"{name}: status mismatch — card {facts['status']!r} vs ts {status and status.group(1)!r}"
        )
        for key, field in (("website", "websiteUrl"), ("case_study", "caseStudyUrl")):
            url = re.search(field + r':\s*"([^"]*)"', body)
            found = url.group(1) if url else None
            assert found == facts[key], f"{name}: {field} mismatch — {found!r} vs {facts[key]!r}"
    for name in DROPPED_PROJECTS:
        assert f'name: "{name}"' not in ts, f"{name} must not be in lib/projects.ts"


def _article_name(article: str) -> str:
    match = re.search(r"<h2[^>]*>(.*?)</h2>", article, re.S)
    return re.sub(r"<[^>]+>", "", match.group(1)).strip() if match else ""


def _links_html(facts: dict) -> str:
    links = [("Website", facts["website"])]
    if facts["case_study"]:
        links.append(("Case study", facts["case_study"]))
    anchors = "".join(
        f'\n              <a href="{url}" class="btn btn-ghost" '
        f'style="{EXTERNAL_LINK_STYLE}" rel="noopener noreferrer">{label} →</a>'
        for label, url in links
    )
    return f'\n            <div style="{LINK_ROW_STYLE}">{anchors}\n            </div>'


def projects_reality(html: str) -> str:
    """Drop inactive projects, correct each status and surface the real links."""
    if "<article" not in html:
        return html

    dropped: list[str] = []

    def replace(match: re.Match) -> str:
        article = match.group(0)
        name = _article_name(article)
        if name in DROPPED_PROJECTS:
            dropped.append(name)
            return ""
        facts = PROJECT_FACTS.get(name)
        if not facts:
            return article
        article = re.sub(
            r'(<span class="tag[^"]*">)[^<]*(</span>)',
            lambda m: m.group(1) + facts["status"] + m.group(2),
            article,
            count=1,
        )
        closing = "\n          </div>\n        </article>"
        assert article.endswith(closing), f"{name}: unexpected card ending"
        return article[: -len(closing)] + _links_html(facts) + closing

    updated = re.sub(r"<article.*?</article>", replace, html, flags=re.S)
    for name in DROPPED_PROJECTS:
        assert f">{name}</h2>" not in updated, f"{name} card survived"

    # Only the projects page loses a card, and only its intro counts them out
    # loud — keep that number honest. Other fragments (the home timeline also
    # uses <article>) are left alone.
    if dropped:
        remaining = len(re.findall(r"<article", updated))
        number_word = {3: "Üç", 4: "Dört", 5: "Beş", 6: "Altı"}[remaining]
        updated, count = re.subn(
            r"\b(Üç|Dört|Beş|Altı) ürün\b", f"{number_word} ürün", updated, count=1
        )
        assert count == 1, "project-count sentence not found after dropping a card"

    return re.sub(r"\n\s*\n\s*\n", "\n\n", updated)


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


verify_projects()

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
    jsx = anchors_to_link(to_jsx(update_instagram(fix_contrast(projects_reality(link_routes(html))))))
    imports = ""
    if "<Link " in jsx:
        imports += 'import Link from "next/link";\n'
    if IMG_SRC in jsx:
        jsx = jsx.replace(IMG_SRC, IMG_NEXT)
        imports = 'import Image from "next/image";\n' + imports
    if imports:
        imports += "\n"
    write(path, component(name, jsx.rstrip("\n"), imports))
