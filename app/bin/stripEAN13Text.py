#!/usr/bin/env python3
"""Erzeugt aus "Libre Barcode EAN13 Text" eine Variante ohne Klarschrift.

Die Ziffern sind beim Build als Outlines in die Balken-Glyphen eingeflossen.
Balken-Konturen sind immer >= 663 Einheiten hoch, Ziffern-Konturen ca. 110 –
alles unterhalb MIN_BAR_HEIGHT wird entfernt. Danach bekommen alle Balken
(inkl. Guards, UPC-A-Randzeichen und Add-Ons) die Höhe der normalen
Daten-Balken, auch EAN-8, und stehen auf der Grundlinie; die Unterlänge der
Schrift wird auf 0 gesetzt. Die Literal-Glyphen (Anzeige bei ungültiger
Eingabe) bleiben erhalten. GSUB/calt bleibt unverändert.

Aufruf: python app/bin/stripEAN13Text.py <in.ttf> <out.ttf>
(läuft automatisch am Ende von app/bin/buildAll, wenn EAN13TEXT gebaut wird)
"""
import sys

from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._g_l_y_f import Glyph, GlyphCoordinates, flagOverlapSimple
from fontTools.ttLib.tables import ttProgram

MIN_BAR_HEIGHT = 300
KEEP = {
    '.notdef',
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'shortUPCE.marker', 'longUPCE.marker', 'addon.marker', 'checkdigit.marker',
}
# Referenz-Glyph für die Ziel-Balkenhöhe (normaler Daten-Balken)
REF_MAIN = 'zero.setA'
RENAMES = [('EAN13 Text', 'EAN13'), ('EAN13Text', 'EAN13')]


def split_contours(glyf, name):
    coords, ends, flags = glyf[name].getCoordinates(glyf)
    start = 0
    for end in ends:
        yield list(coords[start:end + 1]), flags[start:end + 1]
        start = end + 1


def bar_extent(glyf, name):
    ys = [y for pts, _ in split_contours(glyf, name)
            for _, y in pts]
    return min(ys), max(ys)


def normalize_glyph(glyf, name, bottom, top):
    g = glyf[name]
    if name in KEEP or g.isComposite() or g.numberOfContours <= 0:
        return False
    contours = list(split_contours(glyf, name))
    new_coords, new_ends, new_flags = [], [], bytearray()
    for pts, flags in contours:
        ys = [y for _, y in pts]
        y_min, y_max = min(ys), max(ys)
        if y_max - y_min < MIN_BAR_HEIGHT:
            continue
        new_coords.extend((x, bottom if y == y_min else top if y == y_max else y)
                          for x, y in pts)
        new_flags.extend(flags)
        new_ends.append(len(new_coords) - 1)
    if new_coords == list(g.coordinates) and len(new_ends) == g.numberOfContours:
        return False

    if not new_ends:
        glyf[name] = Glyph()
        return True
    if g.flags[0] & flagOverlapSimple:
        new_flags[0] |= flagOverlapSimple
    g.coordinates = GlyphCoordinates(new_coords)
    g.endPtsOfContours = new_ends
    g.flags = new_flags
    g.numberOfContours = len(new_ends)
    # Hinting-Instruktionen referenzieren Punkt-Indizes, die es nicht mehr gibt.
    g.program = ttProgram.Program()
    g.program.fromBytecode(b'')
    return True


def main(src, dst):
    font = TTFont(src)
    glyf, hmtx = font['glyf'], font['hmtx']

    # Daten-Balken bestehen nur aus Balken + Ziffer; die Ziffer liegt
    # unterhalb 0, daher reicht max() für top, bottom ist der Balkenfuß.
    bottom = min(y for pts, _ in split_contours(glyf, REF_MAIN)
                   for _, y in pts if y >= 0)
    top = bar_extent(glyf, REF_MAIN)[1]

    changed = [n for n in font.getGlyphOrder()
               if normalize_glyph(glyf, n, bottom, top)]
    for name in changed:
        g = glyf[name]
        g.recalcBounds(glyf)
        hmtx[name] = (hmtx[name][0], getattr(g, 'xMin', 0))

    # Ohne Klarschrift wird unter der Grundlinie kein Platz mehr gebraucht.
    font['hhea'].descent = 0
    font['OS/2'].sTypoDescender = 0
    font['OS/2'].usWinDescent = 0

    for rec in font['name'].names:
        s = rec.toUnicode()
        for old, new in RENAMES:
            s = s.replace(old, new)
        rec.string = s

    font.save(dst)
    print(f'Balken: {bottom}..{top}; {len(changed)} Glyphen geändert -> {dst}')


if __name__ == '__main__':
    main(*sys.argv[1:3])
