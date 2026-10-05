//@target indesign
/*
 * EAN13-Vergleich: "Libre Barcode EAN13 Text" (alt) gegen "Libre Barcode EAN13" (neu)
 *
 * Legt ein neues Dokument an. Jedes Beispiel steht zweimal in deckungsgleichen
 * Textrahmen: Ebene "old" mit der Text-Schrift, Ebene "new" mit der
 * Nur-Balken-Schrift – Ebenen ein-/ausblenden zeigt die Unterschiede.
 * Ebene "baseline" markiert die Grundlinien (rot = alt, blau = neu, nur wenn
 * abweichend), Ebene "labels" enthält Beschriftungen und Bericht.
 *
 * Nach dem Aufbau werden beide Rahmen vermessen (Grundlinien, Zeilenanfang
 * und -ende, Textbreite, Übersatz, Tabellenzeilen, eingepasste Rahmen) und
 * Abweichungen im Bericht am Dokumentende aufgelistet. Zusätzlich wird die
 * Textbreite mit der vorab per HarfBuzz berechneten Breite verglichen – eine
 * Abweichung dort heißt meist, dass InDesign calt nicht angewendet hat.
 *
 * Testfälle und Vorberechnungen erzeugt build-ean13-compare.py (Block DATA).
 * Eigene Fälle ohne Neugenerieren: EXTRA_SECTIONS.
 */

var CONFIG = {
    fontOld: 'Libre Barcode EAN13 Text\tRegular',
    fontNew: 'Libre Barcode EAN13\tRegular',
    defaultSize: 60,              // pt
    labelFonts: ['Arial\tRegular', 'Minion Pro\tRegular'],
    labelBoldFonts: ['Arial\tBold', 'Minion Pro\tBold'],
    labelSize: 7,                 // pt
    highlightNew: false,          // true: Ebene "new" in Magenta, alt und neu gleichzeitig vergleichbar
    page: { width: 210, height: 297, top: 12, bottom: 12, left: 12, right: 12 },   // mm
    labelWidth: 50,               // mm
    gutter: 4,                    // mm
    rowGap: 4,                    // mm
    tolerance: 0.001,             // mm, Vergleich alt/neu
    hbTolerance: 0.05             // mm, InDesign-Breite gegen HarfBuzz
};

// Eigene Testfälle, z. B.:
// { title: 'Eigene Fälle', items: [ { label: 'Kunde A', text: '400638133393?', size: 40 } ] }
// Optionen je Fall: size, composer, calt, hScale, vScale, leading, firstBaseline,
// vJust, lines (Rahmenhöhe in Zeilen), fit, table: [..], mixed: { pre, post }
var EXTRA_SECTIONS = [];

var PT = 25.4 / 72;   // mm pro pt
var WARNINGS = [];

// @@DATA-BEGIN – generiert von build-ean13-compare.py, nicht von Hand ändern
var DATA = {
 "generated": "2026-10-05",
 "fontOld": "LibreBarcodeEAN13Text-Regular.ttf",
 "fontNew": "LibreBarcodeEAN13-Regular.ttf",
 "hbCheck": {
  "total": 223,
  "mismatches": [],
  "harfbuzz": "0.56.2"
 },
 "sections": [
  {
   "title": "Projekt-Testf\u00e4lle (web_assets/js/ean13tester.mjs)",
   "items": [
    {
     "label": "EAN-13 chksm 5",
     "text": "001234567890?",
     "hbEm": 1.326172
    },
    {
     "label": "EAN-13 chksm 5",
     "text": "0012345678905",
     "hbEm": 1.326172
    },
    {
     "label": "EAN-13 chksm 5 - 2",
     "text": "001234567890?12",
     "hbEm": 1.642578
    },
    {
     "label": "EAN-13 chksm 5 - 2",
     "text": "001234567890512",
     "hbEm": 1.642578
    },
    {
     "label": "EAN-13 chksm 5 - 5",
     "text": "001234567890?12345",
     "hbEm": 1.958984
    },
    {
     "label": "EAN-13 chksm 5 - 5",
     "text": "001234567890512345",
     "hbEm": 1.958984
    },
    {
     "label": "+ 5",
     "text": "-12345",
     "hbEm": 0.609375
    },
    {
     "label": "EAN-8 chksm 0",
     "text": "1234567?",
     "hbEm": 0.950195
    },
    {
     "label": "EAN-8 chksm 0",
     "text": "12345670",
     "hbEm": 0.950195
    },
    {
     "label": "EAN-8 chksm 7",
     "text": "9031101?",
     "hbEm": 0.948242
    },
    {
     "label": "EAN-8 chksm 7",
     "text": "90311017",
     "hbEm": 0.948242
    },
    {
     "label": "EAN-8 chksm 2",
     "text": "0154684?",
     "hbEm": 0.949219
    },
    {
     "label": "EAN-8 chksm 2",
     "text": "01546842",
     "hbEm": 0.949219
    },
    {
     "label": "UPC-A chksm 5",
     "text": "01234567890?",
     "hbEm": 1.326172
    },
    {
     "label": "UPC-A chksm 5",
     "text": "012345678905",
     "hbEm": 1.326172
    },
    {
     "label": "UPC-A (B) chksm 6",
     "text": "60251743703?",
     "hbEm": 1.325195
    },
    {
     "label": "UPC-A (B) chksm 6",
     "text": "602517437036",
     "hbEm": 1.325195
    },
    {
     "label": "UPC-E long (A) chksm 8",
     "text": "X01234500005?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E long (A) chksm 8",
     "text": "X012345000058",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E long (B) chksm 0 - 2",
     "text": "X04567000008?62",
     "hbEm": 1.101562
    },
    {
     "label": "UPC-E long (B) chksm 0 - 2",
     "text": "X04567000008062",
     "hbEm": 1.101562
    },
    {
     "label": "UPC-E long (C) chksm 3",
     "text": "X03400000567?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E long (C) chksm 3",
     "text": "X034000005673",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E long (D) chksm 1 - 5",
     "text": "X09840000075?83611",
     "hbEm": 1.417969
    },
    {
     "label": "UPC-E long (D) chksm 1 - 5",
     "text": "X09840000075183611",
     "hbEm": 1.417969
    },
    {
     "label": "UPC-E short (A) chksm 8",
     "text": "x123455?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E short (A) chksm 8",
     "text": "x1234558",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E short (B) chksm 0 - 2",
     "text": "x456784?62",
     "hbEm": 1.101562
    },
    {
     "label": "UPC-E short (B) chksm 0 - 2",
     "text": "x456784262",
     "hbEm": 1.101562
    },
    {
     "label": "UPC-E short (C) chksm 3",
     "text": "x345670?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E short (C) chksm 3",
     "text": "x3456703",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E short (D) chksm 1 - 5",
     "text": "x984753?83611",
     "hbEm": 1.417969
    },
    {
     "label": "UPC-E short (D) chksm 1 - 5",
     "text": "x984753183611",
     "hbEm": 1.417969
    }
   ]
  },
  {
   "title": "EAN-13: alle Pr\u00e4fixziffern 0\u20139 (Parit\u00e4tsmuster linke H\u00e4lfte)",
   "note": "Je Pr\u00e4fix zwei Codes, damit alle Ziffern in Zeichensatz A/B (links) und C (rechts) vorkommen.",
   "items": [
    {
     "label": "Pr\u00e4fix 0",
     "text": "012345678901?",
     "hbEm": 1.324219
    },
    {
     "label": "Pr\u00e4fix 0",
     "text": "078901234567?",
     "hbEm": 1.325195
    },
    {
     "label": "Pr\u00e4fix 1",
     "text": "112345678901?",
     "hbEm": 1.324219
    },
    {
     "label": "Pr\u00e4fix 1",
     "text": "178901234567?",
     "hbEm": 1.325195
    },
    {
     "label": "Pr\u00e4fix 2",
     "text": "212345678901?",
     "hbEm": 1.325195
    },
    {
     "label": "Pr\u00e4fix 2",
     "text": "278901234567?",
     "hbEm": 1.324219
    },
    {
     "label": "Pr\u00e4fix 3",
     "text": "312345678901?",
     "hbEm": 1.325195
    },
    {
     "label": "Pr\u00e4fix 3",
     "text": "378901234567?",
     "hbEm": 1.324219
    },
    {
     "label": "Pr\u00e4fix 4",
     "text": "412345678901?",
     "hbEm": 1.326172
    },
    {
     "label": "Pr\u00e4fix 4",
     "text": "478901234567?",
     "hbEm": 1.325195
    },
    {
     "label": "Pr\u00e4fix 5",
     "text": "512345678901?",
     "hbEm": 1.326172
    },
    {
     "label": "Pr\u00e4fix 5",
     "text": "578901234567?",
     "hbEm": 1.325195
    },
    {
     "label": "Pr\u00e4fix 6",
     "text": "612345678901?",
     "hbEm": 1.325195
    },
    {
     "label": "Pr\u00e4fix 6",
     "text": "678901234567?",
     "hbEm": 1.326172
    },
    {
     "label": "Pr\u00e4fix 7",
     "text": "712345678901?",
     "hbEm": 1.325195
    },
    {
     "label": "Pr\u00e4fix 7",
     "text": "778901234567?",
     "hbEm": 1.326172
    },
    {
     "label": "Pr\u00e4fix 8",
     "text": "812345678901?",
     "hbEm": 1.325195
    },
    {
     "label": "Pr\u00e4fix 8",
     "text": "878901234567?",
     "hbEm": 1.325195
    },
    {
     "label": "Pr\u00e4fix 9",
     "text": "912345678901?",
     "hbEm": 1.325195
    },
    {
     "label": "Pr\u00e4fix 9",
     "text": "978901234567?",
     "hbEm": 1.325195
    }
   ]
  },
  {
   "title": "Praxisbeispiele",
   "items": [
    {
     "label": "EAN-13 (Stabilo), Pr\u00fcfziffer explizit",
     "text": "4006381333931",
     "hbEm": 1.323242
    },
    {
     "label": "ISBN 978-3-16-148410-0",
     "text": "978316148410?",
     "hbEm": 1.324219
    },
    {
     "label": "ISBN + 5-stelliges Preis-Add-On (USD 12.99)",
     "text": "978316148410?51299",
     "hbEm": 1.957031
    },
    {
     "label": "ISSN + 2-stelliges Heft-Add-On",
     "text": "977123456700?05",
     "hbEm": 1.641602
    },
    {
     "label": "EAN-8 (Wikipedia-Beispiel)",
     "text": "96385074",
     "hbEm": 0.950195
    },
    {
     "label": "UPC-A (Wikipedia-Beispiel)",
     "text": "036000291452",
     "hbEm": 1.321289
    },
    {
     "label": "Instore-Pr\u00e4fix 20\u201329",
     "text": "201234567890?",
     "hbEm": 1.326172
    },
    {
     "label": "Alle Nullen",
     "text": "000000000000?",
     "hbEm": 1.324219
    },
    {
     "label": "Alle Neunen",
     "text": "999999999999?",
     "hbEm": 1.324219
    }
   ]
  },
  {
   "title": "UPC-E: alle Kompressionsvarianten (P6 = 0\u20139), kurze und lange Eingabe",
   "note": "Kurze und lange Eingabe einer Zeile ergeben jeweils denselben Barcode.",
   "items": [
    {
     "label": "UPC-E kurz, P6 = 0",
     "text": "x123450?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E lang, gleicher Code (P6 = 0)",
     "text": "X01200000345?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E kurz, P6 = 1",
     "text": "x123451?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E lang, gleicher Code (P6 = 1)",
     "text": "X01210000345?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E kurz, P6 = 2",
     "text": "x123452?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E lang, gleicher Code (P6 = 2)",
     "text": "X01220000345?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E kurz, P6 = 3",
     "text": "x123453?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E lang, gleicher Code (P6 = 3)",
     "text": "X01230000045?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E kurz, P6 = 4",
     "text": "x123454?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E lang, gleicher Code (P6 = 4)",
     "text": "X01234000005?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E kurz, P6 = 5",
     "text": "x123455?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E lang, gleicher Code (P6 = 5)",
     "text": "X01234500005?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E kurz, P6 = 6",
     "text": "x123456?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E lang, gleicher Code (P6 = 6)",
     "text": "X01234500006?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E kurz, P6 = 7",
     "text": "x123457?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E lang, gleicher Code (P6 = 7)",
     "text": "X01234500007?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E kurz, P6 = 8",
     "text": "x123458?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E lang, gleicher Code (P6 = 8)",
     "text": "X01234500008?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E kurz, P6 = 9",
     "text": "x123459?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E lang, gleicher Code (P6 = 9)",
     "text": "X01234500009?",
     "hbEm": 0.785156
    }
   ]
  },
  {
   "title": "Add-Ons: alle Parit\u00e4tsvarianten",
   "note": "2-stellig: Wert mod 4 bestimmt die Parit\u00e4t; 5-stellig: Pr\u00fcfsumme 0\u20139.",
   "items": [
    {
     "label": "2-stellig, mod 4 = 0",
     "text": "-00",
     "hbEm": 0.292969
    },
    {
     "label": "2-stellig, mod 4 = 1",
     "text": "-01",
     "hbEm": 0.292969
    },
    {
     "label": "2-stellig, mod 4 = 2",
     "text": "-02",
     "hbEm": 0.292969
    },
    {
     "label": "2-stellig, mod 4 = 3",
     "text": "-03",
     "hbEm": 0.292969
    },
    {
     "label": "EAN-13 + 2-stellig, mod 4 = 0",
     "text": "400638133393?12",
     "hbEm": 1.639648
    },
    {
     "label": "EAN-13 + 2-stellig, mod 4 = 1",
     "text": "400638133393?13",
     "hbEm": 1.639648
    },
    {
     "label": "EAN-13 + 2-stellig, mod 4 = 2",
     "text": "400638133393?14",
     "hbEm": 1.639648
    },
    {
     "label": "EAN-13 + 2-stellig, mod 4 = 3",
     "text": "400638133393?15",
     "hbEm": 1.639648
    },
    {
     "label": "5-stellig, Pr\u00fcfsumme 0",
     "text": "-00000",
     "hbEm": 0.609375
    },
    {
     "label": "5-stellig, Pr\u00fcfsumme 1",
     "text": "-00007",
     "hbEm": 0.609375
    },
    {
     "label": "5-stellig, Pr\u00fcfsumme 2",
     "text": "-00004",
     "hbEm": 0.609375
    },
    {
     "label": "5-stellig, Pr\u00fcfsumme 3",
     "text": "-00001",
     "hbEm": 0.609375
    },
    {
     "label": "5-stellig, Pr\u00fcfsumme 4",
     "text": "-00008",
     "hbEm": 0.609375
    },
    {
     "label": "5-stellig, Pr\u00fcfsumme 5",
     "text": "-00005",
     "hbEm": 0.609375
    },
    {
     "label": "5-stellig, Pr\u00fcfsumme 6",
     "text": "-00002",
     "hbEm": 0.609375
    },
    {
     "label": "5-stellig, Pr\u00fcfsumme 7",
     "text": "-00009",
     "hbEm": 0.609375
    },
    {
     "label": "5-stellig, Pr\u00fcfsumme 8",
     "text": "-00006",
     "hbEm": 0.609375
    },
    {
     "label": "5-stellig, Pr\u00fcfsumme 9",
     "text": "-00003",
     "hbEm": 0.609375
    },
    {
     "label": "UPC-A + 5-stellig",
     "text": "01234567890?90000",
     "hbEm": 1.935547
    },
    {
     "label": "UPC-E kurz + 2-stellig",
     "text": "x123455?12",
     "hbEm": 1.101562
    },
    {
     "label": "UPC-E lang + 5-stellig",
     "text": "X01234500005?51299",
     "hbEm": 1.417969
    }
   ]
  },
  {
   "title": "Schriftgr\u00f6\u00dfen",
   "items": [
    {
     "label": "EAN-13 in 6 pt",
     "text": "400638133393?",
     "size": 6,
     "hbEm": 1.323242
    },
    {
     "label": "EAN-13 in 8 pt",
     "text": "400638133393?",
     "size": 8,
     "hbEm": 1.323242
    },
    {
     "label": "EAN-13 in 10 pt",
     "text": "400638133393?",
     "size": 10,
     "hbEm": 1.323242
    },
    {
     "label": "EAN-13 in 12 pt",
     "text": "400638133393?",
     "size": 12,
     "hbEm": 1.323242
    },
    {
     "label": "EAN-13 in 18 pt",
     "text": "400638133393?",
     "size": 18,
     "hbEm": 1.323242
    },
    {
     "label": "EAN-13 in 24 pt",
     "text": "400638133393?",
     "size": 24,
     "hbEm": 1.323242
    },
    {
     "label": "EAN-13 in 36 pt",
     "text": "400638133393?",
     "size": 36,
     "hbEm": 1.323242
    },
    {
     "label": "EAN-13 in 48 pt",
     "text": "400638133393?",
     "size": 48,
     "hbEm": 1.323242
    },
    {
     "label": "EAN-13 in 72 pt",
     "text": "400638133393?",
     "size": 72,
     "hbEm": 1.323242
    },
    {
     "label": "EAN-13 in 100 pt",
     "text": "400638133393?",
     "size": 100,
     "hbEm": 1.323242
    },
    {
     "label": "EAN-13 in 144 pt",
     "text": "400638133393?",
     "size": 144,
     "hbEm": 1.323242
    },
    {
     "label": "EAN-13 + 5 in 144 pt",
     "text": "978316148410?51299",
     "size": 144,
     "hbEm": 1.957031
    }
   ]
  },
  {
   "title": "Satzoptionen",
   "items": [
    {
     "label": "Adobe-Absatzsetzer",
     "text": "978316148410?51299",
     "composer": "$ID/HL Composer",
     "hbEm": 1.957031
    },
    {
     "label": "Adobe-Ein-Zeilen-Setzer",
     "text": "978316148410?51299",
     "composer": "$ID/HL Single",
     "hbEm": 1.957031
    },
    {
     "label": "Adobe-Absatzsetzer f\u00fcr alle Sprachen",
     "text": "978316148410?51299",
     "composer": "$ID/HL Composer Optyca",
     "hbEm": 1.957031
    },
    {
     "label": "Adobe-Ein-Zeilen-Setzer f\u00fcr alle Sprachen",
     "text": "978316148410?51299",
     "composer": "$ID/HL Single Optyca",
     "hbEm": 1.957031
    },
    {
     "label": "Kontextbedingte Varianten (calt) AUS",
     "text": "400638133393?",
     "calt": false,
     "note": "Ohne calt erscheinen die Literal-Ziffern \u2013 in beiden Schriften gleich.",
     "hbEm": 2.457031
    },
    {
     "label": "Horizontal skaliert 80 %",
     "text": "400638133393?",
     "hScale": 80,
     "hbEm": 1.323242
    },
    {
     "label": "Vertikal skaliert 150 %",
     "text": "400638133393?",
     "vScale": 150,
     "lines": 1.6,
     "hbEm": 1.323242
    },
    {
     "label": "Zwei Codes, Leerzeichen dazwischen",
     "text": "400638133393? 1234567?",
     "hbEm": 2.378906
    },
    {
     "label": "Zwei Codes, Tabulator dazwischen",
     "text": "400638133393?\t1234567?"
    },
    {
     "label": "Zwei Zeilen, manueller Zeilenumbruch, Auto-Zeilenabstand",
     "text": "400638133393?\n1234567?"
    },
    {
     "label": "Zwei Abs\u00e4tze, fester Zeilenabstand 60 pt",
     "text": "400638133393?\r1234567?",
     "leading": 60
    },
    {
     "label": "Barcode im Flie\u00dftext (12 pt Text, 36 pt Barcode)",
     "text": "400638133393?",
     "size": 36,
     "mixed": {
      "pre": "Artikel ",
      "post": " \u2013 Ende der Zeile"
     }
    }
   ]
  },
  {
   "title": "Rahmenoptionen: erste Grundlinie und vertikale Ausrichtung",
   "mayDiffer": true,
   "note": "Hier wirken Ober-/Unterl\u00e4nge der Schrift. Die neue Schrift hat Unterl\u00e4nge 0 \u2013 Abweichungen bei \u201ezentriert\u201c, \u201eunten\u201c und \u201eBlocksatz\u201c sind zu erwarten.",
   "items": [
    {
     "label": "Erste Grundlinie: Oberl\u00e4nge",
     "text": "400638133393?",
     "firstBaseline": "ASCENT_OFFSET",
     "mayDiffer": true,
     "hbEm": 1.323242
    },
    {
     "label": "Erste Grundlinie: Versalh\u00f6he",
     "text": "400638133393?",
     "firstBaseline": "CAP_HEIGHT",
     "mayDiffer": true,
     "hbEm": 1.323242
    },
    {
     "label": "Erste Grundlinie: Zeilenabstand",
     "text": "400638133393?",
     "firstBaseline": "LEADING_OFFSET",
     "mayDiffer": true,
     "hbEm": 1.323242
    },
    {
     "label": "Erste Grundlinie: x-H\u00f6he",
     "text": "400638133393?",
     "firstBaseline": "X_HEIGHT",
     "mayDiffer": true,
     "hbEm": 1.323242
    },
    {
     "label": "Erste Grundlinie: Geviert-H\u00f6he",
     "text": "400638133393?",
     "firstBaseline": "EMBOX_HEIGHT",
     "mayDiffer": true,
     "hbEm": 1.323242
    },
    {
     "label": "Erste Grundlinie: Fest",
     "text": "400638133393?",
     "firstBaseline": "FIXED_HEIGHT",
     "mayDiffer": true,
     "hbEm": 1.323242
    },
    {
     "label": "Vertikal oben (Rahmen 2 Zeilen hoch)",
     "text": "400638133393?",
     "vJust": "TOP_ALIGN",
     "lines": 2,
     "mayDiffer": true,
     "hbEm": 1.323242
    },
    {
     "label": "Vertikal zentriert (Rahmen 2 Zeilen hoch)",
     "text": "400638133393?",
     "vJust": "CENTER_ALIGN",
     "lines": 2,
     "mayDiffer": true,
     "hbEm": 1.323242
    },
    {
     "label": "Vertikal unten (Rahmen 2 Zeilen hoch)",
     "text": "400638133393?",
     "vJust": "BOTTOM_ALIGN",
     "lines": 2,
     "mayDiffer": true,
     "hbEm": 1.323242
    },
    {
     "label": "Vertikal Blocksatz (Rahmen 2 Zeilen hoch)",
     "text": "400638133393?",
     "vJust": "JUSTIFY_ALIGN",
     "lines": 2,
     "mayDiffer": true,
     "hbEm": 1.323242
    },
    {
     "label": "Vertikal Blocksatz mit zwei Abs\u00e4tzen (Rahmen 3 Zeilen hoch)",
     "text": "400638133393?\r1234567?",
     "vJust": "JUSTIFY_ALIGN",
     "lines": 3,
     "mayDiffer": true
    }
   ]
  },
  {
   "title": "Tabelle (Zeilenh\u00f6he automatisch)",
   "mayDiffer": true,
   "note": "Zellen ohne Abstand, Zeilenh\u00f6he \u201emindestens\u201c \u2013 die Zeilenh\u00f6he h\u00e4ngt von den Schriftmetriken ab.",
   "items": [
    {
     "label": "Tabelle mit drei Codes (36 pt)",
     "text": "",
     "size": 36,
     "table": [
      "400638133393?",
      "1234567?",
      "x123455?"
     ],
     "mayDiffer": true
    }
   ]
  },
  {
   "title": "Rahmen an Inhalt anpassen (Abweichung erwartet)",
   "mayDiffer": true,
   "note": "Rahmen werden nach dem F\u00fcllen eingepasst \u2013 hier d\u00fcrfen sich die Rahmenma\u00dfe unterscheiden.",
   "items": [
    {
     "label": "EAN-13 eingepasst",
     "text": "400638133393?",
     "fit": true,
     "mayDiffer": true,
     "hbEm": 1.323242
    },
    {
     "label": "EAN-13 + 5 eingepasst",
     "text": "978316148410?51299",
     "fit": true,
     "mayDiffer": true,
     "hbEm": 1.957031
    },
    {
     "label": "Zwei Zeilen eingepasst",
     "text": "400638133393?\n1234567?",
     "fit": true,
     "mayDiffer": true
    }
   ]
  },
  {
   "title": "Ung\u00fcltige Eingaben und Grenzf\u00e4lle",
   "note": "Kein g\u00fcltiger Barcode erwartet \u2013 die Schriften sollen sich aber gleich verhalten.",
   "items": [
    {
     "label": "1 Ziffer",
     "text": "1",
     "hbEm": 0.488281
    },
    {
     "label": "5 Ziffern",
     "text": "12345",
     "hbEm": 2.441406
    },
    {
     "label": "6 Ziffern",
     "text": "123456",
     "hbEm": 2.929688
    },
    {
     "label": "9 Ziffern",
     "text": "123456789",
     "hbEm": 1.439453
    },
    {
     "label": "10 Ziffern",
     "text": "1234567890",
     "hbEm": 1.927734
    },
    {
     "label": "20 Ziffern",
     "text": "12345678901234567890",
     "hbEm": 2.932617
    },
    {
     "label": "Falsche Pr\u00fcfziffer",
     "text": "4006381333932",
     "hbEm": 1.323242
    },
    {
     "label": "? an falscher Stelle",
     "text": "40063813339?1",
     "hbEm": 1.811523
    },
    {
     "label": "Zwei ?",
     "text": "40063813339??",
     "hbEm": 1.811523
    },
    {
     "label": "Nur ?",
     "text": "?",
     "hbEm": 0.488281
    },
    {
     "label": "Nur x",
     "text": "x",
     "hbEm": 0.488281
    },
    {
     "label": "Nur X",
     "text": "X",
     "hbEm": 0.488281
    },
    {
     "label": "Nur -",
     "text": "-",
     "hbEm": 0.488281
    },
    {
     "label": "Add-On 1-stellig",
     "text": "-1",
     "hbEm": 0.976562
    },
    {
     "label": "Add-On 3-stellig",
     "text": "-123",
     "hbEm": 0.78125
    },
    {
     "label": "Add-On 4-stellig",
     "text": "-1234",
     "hbEm": 1.269531
    },
    {
     "label": "Add-On 6-stellig",
     "text": "-123456",
     "hbEm": 1.097656
    },
    {
     "label": "EAN-8 + Add-On (nicht unterst\u00fctzt)",
     "text": "1234567?12",
     "hbEm": 1.926758
    },
    {
     "label": "UPC-A nicht UPC-E-komprimierbar",
     "text": "X012345678905",
     "hbEm": 5.976562
    },
    {
     "label": "UPC-E kurz, zu wenige Ziffern",
     "text": "x12345?",
     "hbEm": 3.417969
    },
    {
     "label": "Leerzeichen am Ende",
     "text": "400638133393? ",
     "hbEm": 1.428711
    },
    {
     "label": "Leerzeichen am Anfang",
     "text": " 400638133393?",
     "hbEm": 1.428711
    },
    {
     "label": "Leerzeichen im Code",
     "text": "4006381 333931",
     "hbEm": 6.453125
    },
    {
     "label": "Ruhezonen-Zeichen < >",
     "text": "<4006381333931>",
     "hbEm": 1.487305
    },
    {
     "label": "Kompatibel-Zeichen gemischt mit Ziffern",
     "text": "4ABCDEF*abcdef+",
     "hbEm": 1.240234
    }
   ]
  },
  {
   "title": "Fallback-Eingabe (vorkodiert, ohne calt-Logik)",
   "note": "Direkte Glyph-Kodierung wie app/lib/ean13Encoder/fallback.mjs \u2013 muss genauso aussehen wie die Standardeingabe.",
   "items": [
    {
     "label": "EAN-13 chksm 5 \u2013 Fallback von 001234567890?",
     "text": "k:ABCDEF*ghijaf+>",
     "display": "Fallback von: 001234567890?",
     "hbEm": 1.326172
    },
    {
     "label": "EAN-13 chksm 5 \u2013 Fallback von 0012345678905",
     "text": "k:ABCDEF*ghijaf+>",
     "display": "Fallback von: 0012345678905",
     "hbEm": 1.326172
    },
    {
     "label": "EAN-13 chksm 5 - 2 \u2013 Fallback von 001234567890?12",
     "text": "k:ABCDEF*ghijaf+(\u00e9}\u00ea)",
     "display": "Fallback von: 001234567890?12",
     "hbEm": 1.642578
    },
    {
     "label": "EAN-13 chksm 5 - 2 \u2013 Fallback von 001234567890512",
     "text": "k:ABCDEF*ghijaf+(\u00e9}\u00ea)",
     "display": "Fallback von: 001234567890512",
     "hbEm": 1.642578
    },
    {
     "label": "EAN-13 chksm 5 - 5 \u2013 Fallback von 001234567890?12345",
     "text": "k:ABCDEF*ghijaf+{\u00f3}\u00ea}\u00f5}\u00ec}\u00ed)",
     "display": "Fallback von: 001234567890?12345",
     "hbEm": 1.958984
    },
    {
     "label": "EAN-13 chksm 5 - 5 \u2013 Fallback von 001234567890512345",
     "text": "k:ABCDEF*ghijaf+{\u00f3}\u00ea}\u00f5}\u00ec}\u00ed)",
     "display": "Fallback von: 001234567890512345",
     "hbEm": 1.958984
    },
    {
     "label": "+ 5 \u2013 Fallback von -12345",
     "text": "{\u00f3}\u00ea}\u00f5}\u00ec}\u00ed)",
     "display": "Fallback von: -12345",
     "hbEm": 0.609375
    },
    {
     "label": "EAN-8 chksm 0 \u2013 Fallback von 1234567?",
     "text": "<;\u00c1\u00c2\u00c3\u00c4|\u00cf\u00d0\u00d1\u00ca;>",
     "display": "Fallback von: 1234567?",
     "hbEm": 0.950195
    },
    {
     "label": "EAN-8 chksm 0 \u2013 Fallback von 12345670",
     "text": "<;\u00c1\u00c2\u00c3\u00c4|\u00cf\u00d0\u00d1\u00ca;>",
     "display": "Fallback von: 12345670",
     "hbEm": 0.950195
    },
    {
     "label": "EAN-8 chksm 7 \u2013 Fallback von 9031101?",
     "text": "<;\u00c9\u00c0\u00c3\u00c1|\u00cb\u00ca\u00cb\u00d1;>",
     "display": "Fallback von: 9031101?",
     "hbEm": 0.948242
    },
    {
     "label": "EAN-8 chksm 7 \u2013 Fallback von 90311017",
     "text": "<;\u00c9\u00c0\u00c3\u00c1|\u00cb\u00ca\u00cb\u00d1;>",
     "display": "Fallback von: 90311017",
     "hbEm": 0.948242
    },
    {
     "label": "EAN-8 chksm 2 \u2013 Fallback von 0154684?",
     "text": "<;\u00c0\u00c1\u00c5\u00c4|\u00d0\u00d2\u00ce\u00cc;>",
     "display": "Fallback von: 0154684?",
     "hbEm": 0.949219
    },
    {
     "label": "EAN-8 chksm 2 \u2013 Fallback von 01546842",
     "text": "<;\u00c0\u00c1\u00c5\u00c4|\u00d0\u00d2\u00ce\u00cc;>",
     "display": "Fallback von: 01546842",
     "hbEm": 0.949219
    },
    {
     "label": "UPC-A chksm 5 \u2013 Fallback von 01234567890?",
     "text": "\u00fc:\u00d4BCDEF*ghija\u00e3+\u0152",
     "display": "Fallback von: 01234567890?",
     "hbEm": 1.326172
    },
    {
     "label": "UPC-A chksm 5 \u2013 Fallback von 012345678905",
     "text": "\u00fc:\u00d4BCDEF*ghija\u00e3+\u0152",
     "display": "Fallback von: 012345678905",
     "hbEm": 1.326172
    },
    {
     "label": "UPC-A (B) chksm 6 \u2013 Fallback von 60251743703?",
     "text": "\u0153:\u00daACFBH*edhad\u00e4+\u0153",
     "display": "Fallback von: 60251743703?",
     "hbEm": 1.325195
    },
    {
     "label": "UPC-A (B) chksm 6 \u2013 Fallback von 602517437036",
     "text": "\u0153:\u00daACFBH*edhad\u00e4+\u0153",
     "display": "Fallback von: 602517437036",
     "hbEm": 1.325195
    },
    {
     "label": "UPC-E long (A) chksm 8 \u2013 Fallback von X01234500005?",
     "text": "\u00fc:LCNEFP]\u02da",
     "display": "Fallback von: X01234500005?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E long (A) chksm 8 \u2013 Fallback von X012345000058",
     "text": "\u00fc:LCNEFP]\u02da",
     "display": "Fallback von: X012345000058",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E long (B) chksm 0 - 2 \u2013 Fallback von X04567000008?62",
     "text": "\u00fc:OPQHIE]\u00fc(\u00f8}\u00ea)",
     "display": "Fallback von: X04567000008?62",
     "hbEm": 1.101562
    },
    {
     "label": "UPC-E long (B) chksm 0 - 2 \u2013 Fallback von X04567000008062",
     "text": "\u00fc:OPQHIE]\u00fc(\u00f8}\u00ea)",
     "display": "Fallback von: X04567000008062",
     "hbEm": 1.101562
    },
    {
     "label": "UPC-E long (C) chksm 3 \u2013 Fallback von X03400000567?",
     "text": "\u00fc:NOFGHK]\u00ff",
     "display": "Fallback von: X03400000567?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E long (C) chksm 3 \u2013 Fallback von X034000005673",
     "text": "\u00fc:NOFGHK]\u00ff",
     "display": "Fallback von: X034000005673",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E long (D) chksm 1 - 5 \u2013 Fallback von X09840000075?83611",
     "text": "\u00fc:TSERFD]\u00fd{\u00fa}\u00eb}\u00f8}\u00e9}\u00e9)",
     "display": "Fallback von: X09840000075?83611",
     "hbEm": 1.417969
    },
    {
     "label": "UPC-E long (D) chksm 1 - 5 \u2013 Fallback von X09840000075183611",
     "text": "\u00fc:TSERFD]\u00fd{\u00fa}\u00eb}\u00f8}\u00e9}\u00e9)",
     "display": "Fallback von: X09840000075183611",
     "hbEm": 1.417969
    },
    {
     "label": "UPC-E short (A) chksm 8 \u2013 Fallback von x123455?",
     "text": "\u00fc:LCNEFP]\u02da",
     "display": "Fallback von: x123455?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E short (A) chksm 8 \u2013 Fallback von x1234558",
     "text": "\u00fc:LCNEFP]\u02da",
     "display": "Fallback von: x1234558",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E short (B) chksm 0 - 2 \u2013 Fallback von x456784?62",
     "text": "\u00fc:OPQHIE]\u00fc(\u00f8}\u00ea)",
     "display": "Fallback von: x456784?62",
     "hbEm": 1.101562
    },
    {
     "label": "UPC-E short (B) chksm 0 - 2 \u2013 Fallback von x456784262",
     "text": "\u00fc:OPGHSE]\u00fe(\u00f8}\u00ea)",
     "display": "Fallback von: x456784262",
     "hbEm": 1.101562
    },
    {
     "label": "UPC-E short (C) chksm 3 \u2013 Fallback von x345670?",
     "text": "\u00fc:NOFGHK]\u00ff",
     "display": "Fallback von: x345670?",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E short (C) chksm 3 \u2013 Fallback von x3456703",
     "text": "\u00fc:NOFGHK]\u00ff",
     "display": "Fallback von: x3456703",
     "hbEm": 0.785156
    },
    {
     "label": "UPC-E short (D) chksm 1 - 5 \u2013 Fallback von x984753?83611",
     "text": "\u00fc:TSERFD]\u00fd{\u00fa}\u00eb}\u00f8}\u00e9}\u00e9)",
     "display": "Fallback von: x984753?83611",
     "hbEm": 1.417969
    },
    {
     "label": "UPC-E short (D) chksm 1 - 5 \u2013 Fallback von x984753183611",
     "text": "\u00fc:TSERFD]\u00fd{\u00fa}\u00eb}\u00f8}\u00e9}\u00e9)",
     "display": "Fallback von: x984753183611",
     "hbEm": 1.417969
    }
   ]
  },
  {
   "title": "Kompatible Eingabe (Grandzebu-Kodierung)",
   "note": "Kodierung via app/lib/ean13Encoder/compatible.mjs; Layout weicht laut Doku leicht ab.",
   "items": [
    {
     "label": "Kompatibel von 12345",
     "text": "[L\\C\\N\\E\\F",
     "display": "Kompatibel von: 12345",
     "hbEm": 0.550781
    },
    {
     "label": "Kompatibel von 12345670",
     "text": ":BCDE*fgha+",
     "display": "Kompatibel von: 12345670",
     "hbEm": 0.786133
    },
    {
     "label": "Kompatibel von 90311017",
     "text": ":JADB*babh+",
     "display": "Kompatibel von: 90311017",
     "hbEm": 0.78418
    },
    {
     "label": "Kompatibel von 001234567890?",
     "text": "0ABCDEF*ghijaf+",
     "display": "Kompatibel von: 001234567890?",
     "hbEm": 1.244141
    },
    {
     "label": "Kompatibel von 0012345678905",
     "text": "0ABCDEF*ghijaf+",
     "display": "Kompatibel von: 0012345678905",
     "hbEm": 1.244141
    },
    {
     "label": "Kompatibel von 001234567890?12",
     "text": "0ABCDEF*ghijaf+[B\\C",
     "display": "Kompatibel von: 001234567890?12",
     "hbEm": 1.583984
    },
    {
     "label": "Kompatibel von 001234567890512",
     "text": "0ABCDEF*ghijaf+[B\\C",
     "display": "Kompatibel von: 001234567890512",
     "hbEm": 1.583984
    },
    {
     "label": "Kompatibel von 001234567890?12345",
     "text": "0ABCDEF*ghijaf+[L\\C\\N\\E\\F",
     "display": "Kompatibel von: 001234567890?12345",
     "hbEm": 1.900391
    },
    {
     "label": "Kompatibel von 001234567890512345",
     "text": "0ABCDEF*ghijaf+[L\\C\\N\\E\\F",
     "display": "Kompatibel von: 001234567890512345",
     "hbEm": 1.900391
    },
    {
     "label": "Kompatibel von 1234567?",
     "text": ":BCDE*fgha+",
     "display": "Kompatibel von: 1234567?",
     "hbEm": 0.786133
    },
    {
     "label": "Kompatibel von 9031101?",
     "text": ":JADB*babh+",
     "display": "Kompatibel von: 9031101?",
     "hbEm": 0.78418
    },
    {
     "label": "Kompatibel von 0154684?",
     "text": ":ABFE*giec+",
     "display": "Kompatibel von: 0154684?",
     "hbEm": 0.785156
    },
    {
     "label": "Kompatibel von 01546842",
     "text": ":ABFE*giec+",
     "display": "Kompatibel von: 01546842",
     "hbEm": 0.785156
    },
    {
     "label": "Kompatibel von 01234567890?",
     "text": "0ABCDEF*ghijaf+",
     "display": "Kompatibel von: 01234567890?",
     "hbEm": 1.244141
    },
    {
     "label": "Kompatibel von 012345678905",
     "text": "0ABCDEF*ghijaf+",
     "display": "Kompatibel von: 012345678905",
     "hbEm": 1.244141
    },
    {
     "label": "Kompatibel von 60251743703?",
     "text": "0GACFBH*edhadg+",
     "display": "Kompatibel von: 60251743703?",
     "hbEm": 1.243164
    },
    {
     "label": "Kompatibel von 602517437036",
     "text": "0GACFBH*edhadg+",
     "display": "Kompatibel von: 602517437036",
     "hbEm": 1.243164
    }
   ]
  }
 ]
};
// @@DATA-END


function setProps(obj, props, context) {
    for (var k in props) {
        if (!props.hasOwnProperty(k)) continue;
        try {
            obj[k] = props[k];
        } catch (e) {
            WARNINGS.push(context + ': ' + k + ' = ' + props[k] + ' – ' + e.message);
        }
    }
}

function findFont(names) {
    for (var i = 0; i < names.length; i++) {
        var f = app.fonts.itemByName(names[i]);
        if (f.isValid && f.status === FontStatus.INSTALLED) return f;
    }
    return null;
}

function fmt(v) {
    return (Math.round(v * 1000) / 1000).toString().replace('.', ',');
}

function visible(s) {
    return s.replace(/ /g, '·').replace(/\t/g, ' [Tab] ')
            .replace(/\r/g, ' [Absatz] ').replace(/\n/g, ' [Umbruch] ');
}

function Progress(total) {
    this.w = null;
    try {
        var w = new Window('palette', 'EAN13-Vergleich');
        w.pb = w.add('progressbar', undefined, 0, total);
        w.pb.preferredSize = [420, 12];
        w.st = w.add('statictext', undefined, '');
        w.st.preferredSize = [420, 20];
        w.show();
        this.w = w;
    } catch (e) {}
}
Progress.prototype.step = function (i, msg) {
    if (!this.w) return;
    this.w.pb.value = i;
    this.w.st.text = msg;
    this.w.update();
};
Progress.prototype.close = function () {
    if (this.w) this.w.close();
};


function createDocument() {
    var doc = app.documents.add();
    var P = CONFIG.page;
    setProps(doc.documentPreferences, {
        facingPages: false,
        pageWidth: P.width + 'mm',
        pageHeight: P.height + 'mm'
    }, 'Dokument');
    doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;
    doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;
    doc.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
    doc.zeroPoint = [0, 0];
    setProps(doc.textPreferences, { smartTextReflow: false }, 'Texteinstellungen');
    var margins = { top: P.top + 'mm', bottom: P.bottom + 'mm', left: P.left + 'mm', right: P.right + 'mm' };
    var mp = doc.masterSpreads[0].pages;
    for (var i = 0; i < mp.length; i++) setProps(mp[i].marginPreferences, margins, 'Ränder');
    setProps(doc.pages[0].marginPreferences, margins, 'Ränder');
    return doc;
}

function addColor(doc, name, cmyk) {
    var c = doc.colors.itemByName(name);
    if (c.isValid) return c;
    return doc.colors.add({ name: name, model: ColorModel.PROCESS, space: ColorSpace.CMYK, colorValue: cmyk });
}

function makeStyle(doc, name, font, size, extra) {
    var s = doc.paragraphStyles.add({ name: name, basedOn: doc.paragraphStyles[0] });
    var props = {
        appliedFont: font,
        pointSize: size + 'pt',
        leading: Leading.AUTO,
        autoLeading: 120,
        otfContextualAlternate: true,
        ligatures: false,
        composer: '$ID/HL Composer',
        kerningMethod: '$ID/Metrics',
        tracking: 0,
        horizontalScale: 100,
        verticalScale: 100,
        baselineShift: 0,
        hyphenation: false,
        justification: Justification.LEFT_ALIGN,
        spaceBefore: 0,
        spaceAfter: 0,
        firstLineIndent: 0,
        leftIndent: 0,
        rightIndent: 0,
        alignToBaseline: false
    };
    for (var k in extra) if (extra.hasOwnProperty(k)) props[k] = extra[k];
    setProps(s, props, 'Absatzformat ' + name);
    return s;
}

function addTextFrame(page, layer, bounds) {
    var f = page.textFrames.add({ itemLayer: layer, geometricBounds: bounds });
    setProps(f.textFramePreferences, {
        insetSpacing: [0, 0, 0, 0],
        firstBaselineOffset: FirstBaseline.ASCENT_OFFSET,
        verticalJustification: VerticalJustification.TOP_ALIGN,
        ignoreWrap: true
    }, 'Rahmen');
    return f;
}

function addRule(page, layer, x0, x1, y, color) {
    var g = page.graphicLines.add({ itemLayer: layer });
    g.paths[0].entirePath = [[x0, y], [x1, y]];
    setProps(g, { strokeWeight: '0.25pt', strokeColor: color }, 'Grundlinie');
}

function newPage(ctx) {
    ctx.page = ctx.doc.pages.add(LocationOptions.AT_END);
    ctx.y = CONFIG.page.top;
}

function ensureSpace(ctx, h) {
    if (ctx.y + h > CONFIG.page.height - CONFIG.page.bottom) newPage(ctx);
}


function addSectionHeader(ctx, sec, num) {
    var P = CONFIG.page;
    ensureSpace(ctx, 45);
    var f = addTextFrame(ctx.page, ctx.layers.labels, [ctx.y, P.left, ctx.y + 20, P.width - P.right]);
    f.contents = num + '  ' + sec.title + (sec.note ? '\r' + sec.note : '');
    f.parentStory.texts[0].applyParagraphStyle(ctx.styles.label, true);
    f.parentStory.paragraphs[0].applyParagraphStyle(ctx.styles.heading, true);
    f.fit(FitOptions.FRAME_TO_CONTENT);
    ctx.y = f.geometricBounds[2] + 3;
}

function labelText(it, id, size) {
    var lines = [id + '  ' + it.label];
    if (it.table) lines.push('Zellen: ' + it.table.join('  |  '));
    else if (it.mixed) lines.push('Text: ' + visible(it.mixed.pre) + '[' + visible(it.text) + ']' + visible(it.mixed.post));
    else lines.push('Eingabe: ' + visible(it.display || it.text));
    var opts = [size + ' pt'];
    if (it.composer) opts.push(it.composer.replace('$ID/', ''));
    if (it.calt === false) opts.push('calt aus');
    if (it.hScale) opts.push('H ' + it.hScale + ' %');
    if (it.vScale) opts.push('V ' + it.vScale + ' %');
    if (it.leading) opts.push('ZAB ' + it.leading + ' pt');
    if (it.firstBaseline) opts.push('1. GL ' + it.firstBaseline);
    if (it.vJust) opts.push('vert. ' + it.vJust);
    if (it.fit) opts.push('eingepasst');
    lines.push(opts.join(' · '));
    if (it.note) lines.push(it.note);
    return lines.join('\r');
}

function itemLines(it) {
    if (it.lines) return it.lines;
    var n = 1;
    for (var i = 0; i < it.text.length; i++) {
        var c = it.text.charAt(i);
        if (c === '\r' || c === '\n') n++;
    }
    return n;
}

function fillFrame(ctx, frame, it, style, size, id) {
    var tfp = frame.textFramePreferences;
    if (it.firstBaseline) {
        setProps(tfp, { firstBaselineOffset: FirstBaseline[it.firstBaseline] }, id + ' Rahmen');
        if (it.firstBaseline === 'FIXED_HEIGHT')
            setProps(tfp, { minimumFirstBaselineOffset: Math.round(size * 0.85) + 'pt' }, id + ' Rahmen');
    }
    if (it.vJust) setProps(tfp, { verticalJustification: VerticalJustification[it.vJust] }, id + ' Rahmen');

    var story = frame.parentStory;
    if (it.table) {
        fillTable(ctx, frame, it, style, size, id);
        return;
    }
    frame.contents = it.mixed ? it.mixed.pre + it.text + it.mixed.post : it.text;
    var t = story.texts[0];
    t.applyParagraphStyle(style, true);
    var o = { pointSize: size + 'pt' };
    if (it.composer) o.composer = it.composer;
    if (it.calt === false) o.otfContextualAlternate = false;
    if (it.hScale) o.horizontalScale = it.hScale;
    if (it.vScale) o.verticalScale = it.vScale;
    if (it.leading) o.leading = it.leading + 'pt';
    setProps(t, o, id + ' Text');
    if (it.mixed) {
        var plain = { appliedFont: ctx.labelFont, pointSize: '12pt' };
        var a = it.mixed.pre.length, b = a + it.text.length, n = story.characters.length;
        if (a > 0) setProps(story.characters.itemByRange(0, a - 1), plain, id + ' Fließtext');
        if (n > b) setProps(story.characters.itemByRange(b, n - 1), plain, id + ' Fließtext');
    }
    if (CONFIG.highlightNew && style === ctx.styles.neu) setProps(t, { fillColor: ctx.colors.highlight }, id);
}

function fillTable(ctx, frame, it, style, size, id) {
    var story = frame.parentStory;
    frame.contents = '';
    story.texts[0].applyParagraphStyle(ctx.styles.label, true);
    var w = frame.geometricBounds[3] - frame.geometricBounds[1];
    var tbl = story.insertionPoints[0].tables.add({ bodyRowCount: 1, columnCount: it.table.length });
    for (var c = 0; c < tbl.columns.length; c++) setProps(tbl.columns[c], { width: w / it.table.length }, id + ' Spalte');
    for (var i = 0; i < it.table.length; i++) {
        var cell = tbl.cells[i];
        setProps(cell, {
            topInset: 0, bottomInset: 0, leftInset: 0, rightInset: 0,
            autoGrow: true, minimumHeight: 1,
            verticalJustification: VerticalJustification.TOP_ALIGN,
            firstBaselineOffset: FirstBaseline.ASCENT_OFFSET
        }, id + ' Zelle');
        cell.contents = it.table[i];
        cell.texts[0].applyParagraphStyle(style, true);
        setProps(cell.texts[0], { pointSize: size + 'pt' }, id + ' Zelle');
        if (CONFIG.highlightNew && style === ctx.styles.neu) setProps(cell.texts[0], { fillColor: ctx.colors.highlight }, id);
    }
}

function lineMetrics(lines, out) {
    for (var i = 0; i < lines.length; i++) {
        var l = lines[i], m = { b: l.baseline, x0: l.horizontalOffset, x1: null };
        try { m.x1 = l.endHorizontalOffset; } catch (e) {}
        out.push(m);
    }
}

function measure(frame, it) {
    var story = frame.parentStory;
    var gb = frame.geometricBounds;
    var m = { overflow: frame.overflows, lines: [], rows: [], width: null,
              height: gb[2] - gb[0], frameWidth: gb[3] - gb[1] };
    if (it.table) {
        var tbl = story.tables[0];
        for (var r = 0; r < tbl.rows.length; r++) m.rows.push(tbl.rows[r].height);
        for (var c = 0; c < tbl.cells.length; c++) {
            if (tbl.cells[c].overflows) m.overflow = true;
            lineMetrics(tbl.cells[c].lines, m.lines);
        }
        return m;
    }
    lineMetrics(frame.lines, m.lines);
    if (m.lines.length === 1) {
        var ips = story.insertionPoints;
        m.width = ips.lastItem().horizontalOffset - ips.firstItem().horizontalOffset;
    }
    return m;
}

function compareMetrics(mo, mn, it) {
    var d = [], tol = CONFIG.tolerance;
    function cmp(name, a, b) {
        if (a === null || b === null) return;
        if (Math.abs(a - b) > tol) d.push(name + ': alt ' + fmt(a) + ' / neu ' + fmt(b) + ' mm (Δ ' + fmt(b - a) + ')');
    }
    if (mo.overflow || mn.overflow) d.push('Übersatz: alt ' + mo.overflow + ' / neu ' + mn.overflow);
    if (mo.lines.length !== mn.lines.length) d.push('Zeilenzahl: alt ' + mo.lines.length + ' / neu ' + mn.lines.length);
    for (var i = 0; i < Math.min(mo.lines.length, mn.lines.length); i++) {
        cmp('Zeile ' + (i + 1) + ' Grundlinie', mo.lines[i].b, mn.lines[i].b);
        cmp('Zeile ' + (i + 1) + ' Anfang', mo.lines[i].x0, mn.lines[i].x0);
        cmp('Zeile ' + (i + 1) + ' Ende', mo.lines[i].x1, mn.lines[i].x1);
    }
    for (var r = 0; r < Math.min(mo.rows.length, mn.rows.length); r++)
        cmp('Tabellenzeile ' + (r + 1) + ' Höhe', mo.rows[r], mn.rows[r]);
    cmp('Textbreite', mo.width, mn.width);
    cmp('Rahmenhöhe', mo.height, mn.height);
    cmp('Rahmenbreite', mo.frameWidth, mn.frameWidth);
    return d;
}

function checkHarfBuzz(m, it, size) {
    if (it.hbEm === undefined || it.hbEm === null || m.width === null) return null;
    var expected = it.hbEm * size * PT * (it.hScale || 100) / 100;
    if (Math.abs(m.width - expected) <= CONFIG.hbTolerance) return null;
    return 'Breite ' + fmt(m.width) + ' mm, HarfBuzz erwartet ' + fmt(expected) + ' mm';
}

function buildItem(ctx, it, id) {
    var P = CONFIG.page;
    var size = it.size || CONFIG.defaultSize;
    var x0 = P.left + CONFIG.labelWidth + CONFIG.gutter, x1 = P.width - P.right;
    var h = (itemLines(it) * 1.2 + 0.15) * size * PT;
    if (it.table) h = 1.6 * size * PT;
    ensureSpace(ctx, Math.max(h, 14));

    var y = ctx.y;
    var label = addTextFrame(ctx.page, ctx.layers.labels, [y, P.left, y + 30, P.left + CONFIG.labelWidth]);
    label.contents = labelText(it, id, size);
    label.parentStory.texts[0].applyParagraphStyle(ctx.styles.label, true);
    label.parentStory.paragraphs[0].applyParagraphStyle(ctx.styles.labelBold, true);
    label.fit(FitOptions.FRAME_TO_CONTENT);

    var fOld = addTextFrame(ctx.page, ctx.layers.old, [y, x0, y + h, x1]);
    var fNew = addTextFrame(ctx.page, ctx.layers.neu, [y, x0, y + h, x1]);
    fillFrame(ctx, fOld, it, ctx.styles.old, size, id);
    fillFrame(ctx, fNew, it, ctx.styles.neu, size, id);
    for (var guard = 0; guard < 10 && (fOld.overflows || fNew.overflows); guard++) {
        h += 0.6 * size * PT;
        fOld.geometricBounds = [y, x0, y + h, x1];
        fNew.geometricBounds = [y, x0, y + h, x1];
    }
    if (it.fit) {
        fOld.fit(FitOptions.FRAME_TO_CONTENT);
        fNew.fit(FitOptions.FRAME_TO_CONTENT);
    }

    var mo = measure(fOld, it), mn = measure(fNew, it);
    var res = { id: id, label: it.label, diffs: compareMetrics(mo, mn, it), hb: [], mayDiffer: !!it.mayDiffer };
    var hbO = checkHarfBuzz(mo, it, size), hbN = checkHarfBuzz(mn, it, size);
    if (hbO) res.hb.push('alt: ' + hbO);
    if (hbN) res.hb.push('neu: ' + hbN);

    for (var i = 0; i < mo.lines.length; i++) {
        var l = mo.lines[i];
        addRule(ctx.page, ctx.layers.base, x0 - 2, x1, l.b, ctx.colors.baseOld);
        if (mn.lines[i] && Math.abs(mn.lines[i].b - l.b) > CONFIG.tolerance)
            addRule(ctx.page, ctx.layers.base, x0 - 2, x1, mn.lines[i].b, ctx.colors.baseNew);
    }

    var bottom = Math.max(fOld.geometricBounds[2], fNew.geometricBounds[2], label.geometricBounds[2]);
    ctx.y = bottom + CONFIG.rowGap;
    return res;
}


function addFlowingText(ctx, text, style) {
    var P = CONFIG.page, prev = null, first = null;
    for (var guard = 0; guard < 50; guard++) {
        newPage(ctx);
        var f = addTextFrame(ctx.page, ctx.layers.labels, [P.top, P.left, P.height - P.bottom, P.width - P.right]);
        if (prev) prev.nextTextFrame = f;
        else {
            first = f;
            f.contents = text;
            f.parentStory.texts[0].applyParagraphStyle(style, true);
        }
        prev = f;
        if (!f.overflows) break;
    }
    return first;
}

function fontInfo(font) {
    var s = font.name.replace('\t', ' ');
    try { s += ' – ' + font.version; } catch (e) {}
    try { s += '\r    ' + font.location; } catch (e) {}
    return s;
}

function main() {
    if (!DATA) {
        alert('DATA fehlt – bitte zuerst build-ean13-compare.py ausführen.');
        return;
    }
    var fontOld = findFont([CONFIG.fontOld]), fontNew = findFont([CONFIG.fontNew]);
    if (!fontOld || !fontNew) {
        alert('Schrift nicht gefunden/installiert:\n' +
              (fontOld ? '' : CONFIG.fontOld.replace('\t', ' ') + '\n') +
              (fontNew ? '' : CONFIG.fontNew.replace('\t', ' ') + '\n') +
              '\nBitte installieren (fonts/ im Repo) und InDesign neu starten.');
        return;
    }
    var labelFont = findFont(CONFIG.labelFonts) || app.fonts[0];
    var labelBold = findFont(CONFIG.labelBoldFonts) || labelFont;

    var doc = createDocument();
    var layers = { labels: doc.layers[0] };
    layers.labels.name = 'labels';
    layers.old = doc.layers.add({ name: 'old', layerColor: UIColors.BLUE });
    layers.neu = doc.layers.add({ name: 'new', layerColor: UIColors.RED });
    layers.base = doc.layers.add({ name: 'baseline', layerColor: UIColors.GREEN });
    layers.old.move(LocationOptions.BEFORE, layers.labels);
    layers.neu.move(LocationOptions.BEFORE, layers.old);
    layers.base.move(LocationOptions.BEFORE, layers.neu);

    var ctx = {
        doc: doc, page: doc.pages[0], y: CONFIG.page.top, layers: layers, labelFont: labelFont,
        colors: {
            baseOld: addColor(doc, 'Grundlinie alt', [0, 100, 100, 0]),
            baseNew: addColor(doc, 'Grundlinie neu', [100, 50, 0, 0]),
            highlight: addColor(doc, 'EAN13 neu', [0, 100, 0, 0])
        },
        styles: {
            old: makeStyle(doc, 'Barcode old', fontOld, CONFIG.defaultSize, {}),
            neu: makeStyle(doc, 'Barcode new', fontNew, CONFIG.defaultSize, {}),
            label: makeStyle(doc, 'Label', labelFont, CONFIG.labelSize, {}),
            labelBold: makeStyle(doc, 'Label fett', labelBold, CONFIG.labelSize, {}),
            heading: makeStyle(doc, 'Abschnitt', labelBold, 10, { spaceAfter: '1mm' }),
            title: makeStyle(doc, 'Titel', labelBold, 18, { spaceAfter: '4mm' })
        }
    };

    // Deckblatt, Zusammenfassung wird am Ende ergänzt
    var P = CONFIG.page;
    var cover = addTextFrame(ctx.page, layers.labels, [P.top, P.left, P.height - P.bottom, P.width - P.right]);

    var sections = DATA.sections.concat(EXTRA_SECTIONS);
    var total = 0, done = 0;
    for (var s = 0; s < sections.length; s++) total += sections[s].items.length;
    var progress = new Progress(total);
    var results = [];

    newPage(ctx);
    for (s = 0; s < sections.length; s++) {
        var sec = sections[s];
        addSectionHeader(ctx, sec, (s + 1) + '');
        for (var i = 0; i < sec.items.length; i++) {
            var id = (s + 1) + '.' + (i + 1);
            progress.step(done++, id + '  ' + sec.items[i].label);
            try {
                results.push(buildItem(ctx, sec.items[i], id));
            } catch (e) {
                results.push({ id: id, label: sec.items[i].label, diffs: ['FEHLER: ' + e.message + ' (Zeile ' + e.line + ')'], hb: [] });
            }
        }
    }
    progress.close();

    // Bericht
    var withDiff = [], withHb = [];
    for (var r = 0; r < results.length; r++) {
        if (results[r].diffs.length) withDiff.push(results[r]);
        if (results[r].hb.length) withHb.push(results[r]);
    }
    var rep = ['Bericht: Abweichungen alt / neu'];
    rep.push(results.length + ' Fälle, ' + withDiff.length + ' mit Abweichungen zwischen alt und neu, ' +
             withHb.length + ' mit Abweichung zur HarfBuzz-Breite.');
    rep.push('');
    rep.push('Abweichungen alt / neu (Toleranz ' + fmt(CONFIG.tolerance) + ' mm):');
    if (!withDiff.length) rep.push('    keine');
    for (r = 0; r < withDiff.length; r++) {
        rep.push(withDiff[r].id + '  ' + withDiff[r].label +
                 (withDiff[r].mayDiffer ? '  (metrikabhängig – Abweichung möglich)' : ''));
        for (var k = 0; k < withDiff[r].diffs.length; k++) rep.push('    ' + withDiff[r].diffs[k]);
    }
    rep.push('');
    rep.push('Abweichungen zur HarfBuzz-Breite (Toleranz ' + fmt(CONFIG.hbTolerance) + ' mm) – Hinweis auf fehlendes calt:');
    if (!withHb.length) rep.push('    keine');
    for (r = 0; r < withHb.length; r++) {
        rep.push(withHb[r].id + '  ' + withHb[r].label);
        for (k = 0; k < withHb[r].hb.length; k++) rep.push('    ' + withHb[r].hb[k]);
    }
    if (WARNINGS.length) {
        rep.push('');
        rep.push('Warnungen beim Setzen von Eigenschaften:');
        for (r = 0; r < WARNINGS.length; r++) rep.push('    ' + WARNINGS[r]);
    }
    var repFrame = addFlowingText(ctx, rep.join('\r'), ctx.styles.label);
    repFrame.parentStory.paragraphs[0].applyParagraphStyle(ctx.styles.heading, true);

    var hbc = DATA.hbCheck;
    cover.contents = [
        'EAN13-Vergleich: alt (Text) gegen neu (nur Balken)',
        'Ebene „old“: ' + fontInfo(fontOld),
        'Ebene „new“: ' + fontInfo(fontNew),
        '',
        'Beide Ebenen enthalten deckungsgleiche Textrahmen mit identischem Inhalt. ' +
        'Ebenen ein-/ausblenden, um Unterschiede zu sehen. Ebene „baseline“: Grundlinien ' +
        '(rot; blau, falls neu abweicht). Ebene „labels“: Beschriftungen, Bericht.',
        '',
        'Daten erzeugt: ' + DATA.generated + ' aus ' + DATA.fontOld + ' / ' + DATA.fontNew,
        'HarfBuzz ' + hbc.harfbuzz + ' Vorprüfung: ' + hbc.total + ' Shapings, ' +
            (hbc.mismatches.length ? hbc.mismatches.length + ' Abweichungen: ' + hbc.mismatches.join(', ')
                                   : 'Glyphenfolge und Breiten alt/neu identisch.'),
        '',
        'InDesign: ' + results.length + ' Fälle, ' + withDiff.length + ' mit Abweichungen alt/neu, ' +
            withHb.length + ' mit Abweichung zur HarfBuzz-Breite, ' + WARNINGS.length + ' Warnungen. ' +
            'Details im Bericht ab Seite ' + repFrame.parentPage.name + '.'
    ].join('\r');
    cover.parentStory.texts[0].applyParagraphStyle(ctx.styles.label, true);
    setProps(cover.parentStory.texts[0], { pointSize: '10pt' }, 'Deckblatt');
    cover.parentStory.paragraphs[0].applyParagraphStyle(ctx.styles.title, true);

    try { app.activeWindow.activePage = doc.pages[0]; } catch (e) {}
    return { cases: results.length, diffs: withDiff.length, hb: withHb.length, warnings: WARNINGS.length };
}

(function () {
    var redraw = app.scriptPreferences.enableRedraw;
    app.scriptPreferences.enableRedraw = false;
    var summary = null;
    try {
        app.doScript(function () { summary = main(); }, ScriptLanguage.JAVASCRIPT, undefined,
                     UndoModes.ENTIRE_SCRIPT, 'EAN13-Vergleich');
    } catch (e) {
        alert('EAN13-Vergleich abgebrochen:\n' + e.message + ' (Zeile ' + e.line + ')');
    }
    app.scriptPreferences.enableRedraw = redraw;
    if (summary && !app.scriptArgs.isDefined('ean13CompareQuiet'))
        alert('EAN13-Vergleich fertig:\n' + summary.cases + ' Fälle\n' + summary.diffs +
              ' mit Abweichungen alt/neu\n' + summary.hb + ' mit Abweichung zur HarfBuzz-Breite\n' +
              summary.warnings + ' Warnungen\n\nDetails: Deckblatt und Bericht am Dokumentende.');
})();
