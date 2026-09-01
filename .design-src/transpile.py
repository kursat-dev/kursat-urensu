"""HTML -> JSX transpiler for the imported Claude Design markup.

Rewrites tags in place so every text node, entity and whitespace byte from the
design survives untouched. Only attributes and tag syntax change.
"""
from __future__ import annotations

import re

VOID = {"br", "hr", "img", "input", "meta", "link", "source"}

TAG_RE = re.compile(
    r'<(/?)([a-zA-Z][a-zA-Z0-9-]*)'
    r'((?:\s+[^\s=>/]+(?:="[^"]*")?)*)'
    r'\s*(/?)>'
)
ATTR_RE = re.compile(r'([^\s=]+)(?:="([^"]*)")?')


def style_to_obj(css: str) -> str:
    out = []
    for decl in css.split(";"):
        decl = decl.strip()
        if not decl:
            continue
        name, _, value = decl.partition(":")
        name, value = name.strip(), value.strip()
        if name.startswith("--"):
            key = f'"{name}"'
        elif name.startswith("-webkit-"):
            bits = name[len("-webkit-"):].split("-")
            key = "Webkit" + "".join(b.capitalize() for b in bits)
        else:
            bits = name.split("-")
            key = bits[0] + "".join(b.capitalize() for b in bits[1:])
        out.append(f'{key}: "{value}"')
    return "{ " + ", ".join(out) + " }"


def convert_attrs(raw: str, drop: set[str]) -> str:
    parts = []
    for m in ATTR_RE.finditer(raw.strip()):
        name, value = m.group(1), m.group(2)
        if not name:
            continue
        low = name.lower()
        if low in drop or low.startswith("on"):
            continue
        if low == "class":
            parts.append(f'className="{value}"')
        elif low == "style":
            parts.append(f"style={{{style_to_obj(value)}}}")
        elif value is None:
            parts.append(name)
        else:
            parts.append(f'{name}="{value}"')
    return (" " + " ".join(parts)) if parts else ""


def escape_text(html: str) -> str:
    """Escape ' and " inside text nodes only (react/no-unescaped-entities).

    Runs on raw HTML, where text nodes are exactly the gaps between <...> tags.
    The entities decode back to the original characters at render time.
    """
    out = []
    for i, part in enumerate(re.split(r"(<[^>]*>)", html)):
        if i % 2 == 0:  # even indices are text, odd are tags
            part = part.replace("'", "&apos;").replace('"', "&quot;")
        out.append(part)
    return "".join(out)


def to_jsx(html: str, drop_attrs: set[str] | None = None) -> str:
    drop = drop_attrs or set()

    def repl(m: re.Match) -> str:
        closing, tag, attrs, selfclose = m.groups()
        if closing:
            return f"</{tag}>"
        converted = convert_attrs(attrs, drop)
        if tag.lower() in VOID or selfclose:
            return f"<{tag}{converted} />"
        return f"<{tag}{converted}>"

    return TAG_RE.sub(repl, escape_text(html))


def shift_headings(html: str) -> str:
    """h2->h1, h3->h2, h4->h3, h5->h4 so each route owns exactly one <h1>.

    Every heading in the design carries an inline font-size, and modernist.css
    styles h1-h6 identically apart from size, so this is visually a no-op.
    """
    for lo in (2, 3, 4, 5):
        html = re.sub(rf"<h{lo}\b", f"<h{lo - 1}", html)
        html = html.replace(f"</h{lo}>", f"</h{lo - 1}>")
    return html
