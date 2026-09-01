import re, sys

src = open('.design-src/portfolio.dc.html', encoding='utf-8').read()

hm = re.search(r'<helmet>(.*?)</helmet>', src, re.S)
helmet = hm.group(1).strip('\n')

tm = re.search(r'<x-dc>(.*?)</x-dc>', src, re.S)
tpl = tm.group(1).replace(hm.group(0), '').strip('\n')

PAGES = {'isHome':'home','isAbout':'about','isProjects':'projects','isDetail':'detail',
         'isExperience':'experience','isAchievements':'achievements',
         'isWriting':'writing','isContact':'contact'}

# sc-if -> plain wrappers, stack-matched so nesting stays correct
out, pos, stack = [], 0, []
for m in re.finditer(r'<sc-if value="\{\{ (\w+) \}\}"[^>]*>|</sc-if>', tpl):
    out.append(tpl[pos:m.start()]); pos = m.end()
    if m.group(0).startswith('</'):
        out.append(stack.pop())
    else:
        var = m.group(1)
        out.append('<div class="ku-page" data-page="%s" hidden>' % PAGES[var]
                   if var in PAGES else '<div data-if="%s">' % var)
        stack.append('</div>')
out.append(tpl[pos:])
tpl = ''.join(out)
assert not stack, 'unbalanced sc-if'

tpl = re.sub(r'onClick="\{\{ go\.(\w+) \}\}"',
             lambda m: 'onclick="go(event, \'%s\')"' % m.group(1), tpl)
tpl = re.sub(r'\s*aria-current="\{\{ cur\.(\w+) \}\}"',
             lambda m: ' data-nav="%s"' % m.group(1), tpl)
tpl = tpl.replace('{{ contribCells }}', '')
assert tpl.count('key="{{ page }}"') == 1, 'main key anchor not found'
tpl = tpl.replace('key="{{ page }}"', 'id="ku-main"')
old = 'grid-template-columns:repeat(26,1fr);grid-auto-rows:1fr;gap:3px"></div>'
assert tpl.count(old) == 1, 'contrib grid anchor not found'
tpl = tpl.replace(old, 'grid-template-columns:repeat(26,1fr);grid-auto-rows:1fr;gap:3px" id="ku-contrib"></div>')

leftover = re.findall(r'\{\{[^}]*\}\}', tpl)
assert not leftover, 'unresolved bindings: %r' % leftover
assert 'sc-if' not in tpl and 'onClick' not in tpl

html = '''<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kürşat Ürensü — Portfolyo</title>
%s
<style>
  [hidden] { display: none !important; }
</style>
<script src="app.js" defer></script>
</head>
<body>
%s
</body>
</html>
''' % (helmet, tpl)

open('index.html', 'w', encoding='utf-8').write(html)
print('index.html written:', len(html), 'bytes')
print('pages:', len(re.findall(r'data-page="', html)))
print('nav links:', len(re.findall(r'data-nav="', html)))
print('onclick handlers:', len(re.findall(r'onclick="go\(', html)))
