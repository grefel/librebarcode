#!/usr/bin/env python3
"""Erzeugt den Datenblock für ean13-compare.jsx.

Definiert die Testfälle, prüft mit HarfBuzz, dass "Libre Barcode EAN13 Text"
und "Libre Barcode EAN13" identische Glyphenfolgen und Breiten liefern, und
kodiert die Fallback- (Glyph -> Unicode) und Kompatibel-Varianten (Grandzebu,
app/lib/ean13Encoder/compatible.mjs via node) vor. Das Ergebnis ersetzt den
Block zwischen den @@DATA-Markern in ean13-compare.jsx.

Benötigt: fonttools, uharfbuzz, node
Aufruf:   python tests/indesign/build-ean13-compare.py
"""
import datetime
import json
import pathlib
import re
import subprocess
import sys

import uharfbuzz as hb
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
FONT_OLD = ROOT / 'fonts' / 'LibreBarcodeEAN13Text-Regular.ttf'
FONT_NEW = ROOT / 'fonts' / 'LibreBarcodeEAN13-Regular.ttf'
JSX = pathlib.Path(__file__).with_name('ean13-compare.jsx')
COMPAT_MJS = ROOT / 'app' / 'lib' / 'ean13Encoder' / 'compatible.mjs'

# Testfälle aus web_assets/js/ean13tester.mjs
PROJECT_TESTS = [
    ('EAN-13 chksm 5', ['001234567890?', '0012345678905']),
    ('EAN-13 chksm 5 - 2', ['001234567890?12', '001234567890512']),
    ('EAN-13 chksm 5 - 5', ['001234567890?12345', '001234567890512345']),
    ('+ 5', ['-12345']),
    ('EAN-8 chksm 0', ['1234567?', '12345670']),
    ('EAN-8 chksm 7', ['9031101?', '90311017']),
    ('EAN-8 chksm 2', ['0154684?', '01546842']),
    ('UPC-A chksm 5', ['01234567890?', '012345678905']),
    ('UPC-A (B) chksm 6', ['60251743703?', '602517437036']),
    ('UPC-E long (A) chksm 8', ['X01234500005?', 'X012345000058']),
    ('UPC-E long (B) chksm 0 - 2', ['X04567000008?62', 'X04567000008062']),
    ('UPC-E long (C) chksm 3', ['X03400000567?', 'X034000005673']),
    ('UPC-E long (D) chksm 1 - 5', ['X09840000075?83611', 'X09840000075183611']),
    ('UPC-E short (A) chksm 8', ['x123455?', 'x1234558']),
    ('UPC-E short (B) chksm 0 - 2', ['x456784?62', 'x456784262']),
    ('UPC-E short (C) chksm 3', ['x345670?', 'x3456703']),
    ('UPC-E short (D) chksm 1 - 5', ['x984753?83611', 'x984753183611']),
]


def item(label, text, **opts):
    return dict(label=label, text=text, **opts)


def addon5_checksum(digits):
    d = [int(c) for c in digits]
    return (3 * (d[0] + d[2] + d[4]) + 9 * (d[1] + d[3])) % 10


def upce_long(p):
    """UPC-E-Ziffern P1..P6 (Zahlensystem 0) -> UPC-A D1..D11 (GS1 5.2.2.4.2)."""
    x1, x2, x3, x4, x5, d6 = p
    if d6 in '012':
        return '0' + x1 + x2 + d6 + '0000' + x3 + x4 + x5
    if d6 == '3':
        return '0' + x1 + x2 + x3 + '00000' + x4 + x5
    if d6 == '4':
        return '0' + x1 + x2 + x3 + x4 + '00000' + x5
    return '0' + x1 + x2 + x3 + x4 + x5 + '0000' + d6


def sections():
    S = []

    S.append(dict(title='Projekt-Testfälle (web_assets/js/ean13tester.mjs)', items=[
        item(title, text) for title, texts in PROJECT_TESTS for text in texts]))

    S.append(dict(
        title='EAN-13: alle Präfixziffern 0–9 (Paritätsmuster linke Hälfte)',
        note='Je Präfix zwei Codes, damit alle Ziffern in Zeichensatz A/B (links) und C (rechts) vorkommen.',
        items=[item(f'Präfix {d}', f'{d}{rest}?') for d in '0123456789'
               for rest in ('12345678901', '78901234567')]))

    S.append(dict(title='Praxisbeispiele', items=[
        item('EAN-13 (Stabilo), Prüfziffer explizit', '4006381333931'),
        item('ISBN 978-3-16-148410-0', '978316148410?'),
        item('ISBN + 5-stelliges Preis-Add-On (USD 12.99)', '978316148410?51299'),
        item('ISSN + 2-stelliges Heft-Add-On', '977123456700?05'),
        item('EAN-8 (Wikipedia-Beispiel)', '96385074'),
        item('UPC-A (Wikipedia-Beispiel)', '036000291452'),
        item('Instore-Präfix 20–29', '201234567890?'),
        item('Alle Nullen', '000000000000?'),
        item('Alle Neunen', '999999999999?'),
    ]))

    upce = []
    for d6 in '0123456789':
        p = '12345' + d6
        upce.append(item(f'UPC-E kurz, P6 = {d6}', f'x{p}?'))
        upce.append(item(f'UPC-E lang, gleicher Code (P6 = {d6})', f'X{upce_long(p)}?'))
    S.append(dict(
        title='UPC-E: alle Kompressionsvarianten (P6 = 0–9), kurze und lange Eingabe',
        note='Kurze und lange Eingabe einer Zeile ergeben jeweils denselben Barcode.',
        items=upce))

    addon5 = {}
    n = 0
    while len(addon5) < 10:
        v = f'{n:05d}'
        addon5.setdefault(addon5_checksum(v), v)
        n += 1
    S.append(dict(
        title='Add-Ons: alle Paritätsvarianten',
        note='2-stellig: Wert mod 4 bestimmt die Parität; 5-stellig: Prüfsumme 0–9.',
        items=[item(f'2-stellig, mod 4 = {int(v) % 4}', f'-{v}') for v in ('00', '01', '02', '03')]
        + [item(f'EAN-13 + 2-stellig, mod 4 = {int(v) % 4}', f'400638133393?{v}') for v in ('12', '13', '14', '15')]
        + [item(f'5-stellig, Prüfsumme {c}', f'-{addon5[c]}') for c in range(10)]
        + [item('UPC-A + 5-stellig', '01234567890?90000'),
           item('UPC-E kurz + 2-stellig', 'x123455?12'),
           item('UPC-E lang + 5-stellig', 'X01234500005?51299')]))

    S.append(dict(title='Schriftgrößen', items=[
        item(f'EAN-13 in {s} pt', '400638133393?', size=s)
        for s in (6, 8, 10, 12, 18, 24, 36, 48, 72, 100, 144)]
        + [item('EAN-13 + 5 in 144 pt', '978316148410?51299', size=144)]))

    S.append(dict(title='Satzoptionen', items=[
        item('Adobe-Absatzsetzer', '978316148410?51299', composer='$ID/HL Composer'),
        item('Adobe-Ein-Zeilen-Setzer', '978316148410?51299', composer='$ID/HL Single'),
        item('Adobe-Absatzsetzer für alle Sprachen', '978316148410?51299', composer='$ID/HL Composer Optyca'),
        item('Adobe-Ein-Zeilen-Setzer für alle Sprachen', '978316148410?51299', composer='$ID/HL Single Optyca'),
        item('Kontextbedingte Varianten (calt) AUS', '400638133393?', calt=False,
             note='Ohne calt erscheinen die Literal-Ziffern – in beiden Schriften gleich.'),
        item('Horizontal skaliert 80 %', '400638133393?', hScale=80),
        item('Vertikal skaliert 150 %', '400638133393?', vScale=150, lines=1.6),
        item('Zwei Codes, Leerzeichen dazwischen', '400638133393? 1234567?'),
        item('Zwei Codes, Tabulator dazwischen', '400638133393?\t1234567?'),
        item('Zwei Zeilen, manueller Zeilenumbruch, Auto-Zeilenabstand', '400638133393?\n1234567?'),
        item('Zwei Absätze, fester Zeilenabstand 60 pt', '400638133393?\r1234567?', leading=60),
        item('Barcode im Fließtext (12 pt Text, 36 pt Barcode)', '400638133393?', size=36,
             mixed=dict(pre='Artikel ', post=' – Ende der Zeile')),
    ]))

    fb = [('ASCENT_OFFSET', 'Oberlänge'), ('CAP_HEIGHT', 'Versalhöhe'), ('LEADING_OFFSET', 'Zeilenabstand'),
          ('X_HEIGHT', 'x-Höhe'), ('EMBOX_HEIGHT', 'Geviert-Höhe'), ('FIXED_HEIGHT', 'Fest')]
    vj = [('TOP_ALIGN', 'oben'), ('CENTER_ALIGN', 'zentriert'), ('BOTTOM_ALIGN', 'unten'),
          ('JUSTIFY_ALIGN', 'Blocksatz')]
    S.append(dict(
        title='Rahmenoptionen: erste Grundlinie und vertikale Ausrichtung', mayDiffer=True,
        note='Hier wirken Ober-/Unterlänge der Schrift. Die neue Schrift hat Unterlänge 0 – '
             'Abweichungen bei „zentriert“, „unten“ und „Blocksatz“ sind zu erwarten.',
        items=[item(f'Erste Grundlinie: {name}', '400638133393?', firstBaseline=key)
               for key, name in fb]
        + [item(f'Vertikal {name} (Rahmen 2 Zeilen hoch)', '400638133393?', vJust=key, lines=2)
           for key, name in vj]
        + [item('Vertikal Blocksatz mit zwei Absätzen (Rahmen 3 Zeilen hoch)', '400638133393?\r1234567?',
                vJust='JUSTIFY_ALIGN', lines=3)]))

    S.append(dict(
        title='Tabelle (Zeilenhöhe automatisch)', mayDiffer=True,
        note='Zellen ohne Abstand, Zeilenhöhe „mindestens“ – die Zeilenhöhe hängt von den Schriftmetriken ab.',
        items=[item('Tabelle mit drei Codes (36 pt)', '', size=36,
                    table=['400638133393?', '1234567?', 'x123455?'])]))

    S.append(dict(
        title='Rahmen an Inhalt anpassen (Abweichung erwartet)', mayDiffer=True,
        note='Rahmen werden nach dem Füllen eingepasst – hier dürfen sich die Rahmenmaße unterscheiden.',
        items=[item('EAN-13 eingepasst', '400638133393?', fit=True),
               item('EAN-13 + 5 eingepasst', '978316148410?51299', fit=True),
               item('Zwei Zeilen eingepasst', '400638133393?\n1234567?', fit=True)]))

    S.append(dict(
        title='Ungültige Eingaben und Grenzfälle',
        note='Kein gültiger Barcode erwartet – die Schriften sollen sich aber gleich verhalten.',
        items=[item(label, text) for label, text in [
            ('1 Ziffer', '1'), ('5 Ziffern', '12345'), ('6 Ziffern', '123456'),
            ('9 Ziffern', '123456789'), ('10 Ziffern', '1234567890'),
            ('20 Ziffern', '12345678901234567890'),
            ('Falsche Prüfziffer', '4006381333932'),
            ('? an falscher Stelle', '40063813339?1'),
            ('Zwei ?', '40063813339??'),
            ('Nur ?', '?'), ('Nur x', 'x'), ('Nur X', 'X'), ('Nur -', '-'),
            ('Add-On 1-stellig', '-1'), ('Add-On 3-stellig', '-123'),
            ('Add-On 4-stellig', '-1234'), ('Add-On 6-stellig', '-123456'),
            ('EAN-8 + Add-On (nicht unterstützt)', '1234567?12'),
            ('UPC-A nicht UPC-E-komprimierbar', 'X012345678905'),
            ('UPC-E kurz, zu wenige Ziffern', 'x12345?'),
            ('Leerzeichen am Ende', '400638133393? '),
            ('Leerzeichen am Anfang', ' 400638133393?'),
            ('Leerzeichen im Code', '4006381 333931'),
            ('Ruhezonen-Zeichen < >', '<4006381333931>'),
            ('Kompatibel-Zeichen gemischt mit Ziffern', '4ABCDEF*abcdef+'),
        ]]))
    return S


class Shaper:
    def __init__(self, path):
        self.face = hb.Face(hb.Blob.from_file_path(str(path)))
        self.font = hb.Font(self.face)
        self.upem = self.face.upem

    def shape(self, text, features=None):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(self.font, buf, features or {})
        names = [self.font.glyph_to_string(i.codepoint) for i in buf.glyph_infos]
        adv = sum(p.x_advance for p in buf.glyph_positions)
        return names, adv


def compat_encode(inputs):
    script = (
        "import encode from " + json.dumps(COMPAT_MJS.as_uri()) + ";\n"
        "const out = {};\n"
        "for (const s of JSON.parse(process.argv[1])) {\n"
        "  try { out[s] = encode(s); } catch (e) { out[s] = null; }\n"
        "}\n"
        "console.log(JSON.stringify(out));\n")
    res = subprocess.run(['node', '--input-type=module', '-e', script, json.dumps(inputs)],
                         capture_output=True, text=True, check=True)
    return json.loads(res.stdout)


def main():
    old, new = Shaper(FONT_OLD), Shaper(FONT_NEW)
    cmap = TTFont(FONT_OLD).getBestCmap()
    glyph2cp = {}
    for cp, name in sorted(cmap.items()):
        glyph2cp.setdefault(name, cp)

    S = sections()

    # Fallback (Glyph -> Unicode, wie app/lib/ean13Encoder/fallback.mjs) und
    # Kompatibel (Grandzebu, ohne UPC-E und ohne "-"-Marker)
    project_inputs = [t for _, texts in PROJECT_TESTS for t in texts]
    fallback_items = []
    for title, texts in PROJECT_TESTS:
        for t in texts:
            names, _ = old.shape(t)
            if all(n in glyph2cp for n in names):
                enc = ''.join(chr(glyph2cp[n]) for n in names)
                fallback_items.append(item(f'{title} – Fallback von {t}', enc, display=f'Fallback von: {t}', source=t))
    S.append(dict(title='Fallback-Eingabe (vorkodiert, ohne calt-Logik)',
                  note='Direkte Glyph-Kodierung wie app/lib/ean13Encoder/fallback.mjs – '
                       'muss genauso aussehen wie die Standardeingabe.',
                  items=fallback_items))

    compat_inputs = [t[1:] if t[0] == '-' else t for t in project_inputs if t[0] not in 'xX']
    compat = compat_encode(compat_inputs)
    S.append(dict(title='Kompatible Eingabe (Grandzebu-Kodierung)',
                  note='Kodierung via app/lib/ean13Encoder/compatible.mjs; Layout weicht laut Doku leicht ab.',
                  items=[item(f'Kompatibel von {t}', enc, display=f'Kompatibel von: {t}')
                         for t, enc in compat.items() if enc]))

    # HarfBuzz-Vorprüfung: alt und neu müssen identisch shapen
    total, mismatches = 0, []
    for si, sec in enumerate(S, 1):
        for ii, it in enumerate(sec['items'], 1):
            if sec.get('mayDiffer'):
                it['mayDiffer'] = True
            features = {'calt': False} if it.get('calt') is False else None
            texts = it.get('table') or re.split(r'[\r\n]', it['text'])
            if 'mixed' in it:
                texts = [it['text']]
            ems = []
            for t in texts:
                total += 1
                a, b = old.shape(t, features), new.shape(t, features)
                if a != b:
                    mismatches.append(f'{si}.{ii} {t!r}')
                ems.append(a[1] / old.upem)
            # Tabulatorbreite bestimmt InDesign über Tabstopps, nicht über den Font
            single = not it.get('table') and not it.get('mixed') and len(texts) == 1 and '	' not in texts[0]
            if single:
                it['hbEm'] = round(ems[0], 6)
            if 'source' in it:
                if old.shape(it['text'])[0] != old.shape(it.pop('source'))[0]:
                    mismatches.append(f'{si}.{ii} Fallback ≠ Original')

    data = dict(
        generated=datetime.date.today().isoformat(),
        fontOld=FONT_OLD.name, fontNew=FONT_NEW.name,
        hbCheck=dict(total=total, mismatches=mismatches, harfbuzz=hb.__version__),
        sections=S)
    block = ('// @@DATA-BEGIN – generiert von build-ean13-compare.py, nicht von Hand ändern\n'
             'var DATA = ' + json.dumps(data, ensure_ascii=True, indent=1) + ';\n'
             '// @@DATA-END')
    src = JSX.read_text(encoding='utf-8')
    src, n = re.subn(r'// @@DATA-BEGIN.*?// @@DATA-END', lambda m: block, src, flags=re.S)
    if n != 1:
        sys.exit('DATA-Marker in ean13-compare.jsx nicht gefunden')
    JSX.write_text(src, encoding='utf-8', newline='\n')
    n_items = sum(len(s['items']) for s in S)
    print(f'{len(S)} Abschnitte, {n_items} Testfälle, HarfBuzz: {total} Shapings, '
          f'{len(mismatches)} Abweichungen {mismatches}')


if __name__ == '__main__':
    main()
