# The Tree Tells a Story — Print Edition

A print-ready edition of the *Advent Christmas Tree Devotional*, formatted as a
paperback book for self-publication through [Lulu.com](https://www.lulu.com).

## What's in this folder

| File | Purpose |
| ---- | ------- |
| `book.html` | The full book as a single self-contained HTML document. Open it in any browser to preview. |
| `book.css` | Print stylesheet — defines the trim size, margins, running heads, page numbers, and section breaks. |
| `build.sh` | Converts `book.html` to a print-ready PDF using WeasyPrint, Prince, or headless Chromium. |
| `EDITING.md` | How to edit the book's text without breaking the layout. **Read this first if you only want to change the words.** |
| `README.md` | This file. |

## Trim size

**5.5" × 8.5" — Lulu "Digest" paperback.** This is a classic devotional / trade
paperback size. It is one of Lulu's standard global-distribution-eligible
trim sizes and prints well on cream or white paper.

If you want a different size, change the `@page { size: ... }` rule at the top
of `book.css`. Lulu also supports:

- Pocket Book — 4.25" × 6.875"
- US Trade — 6" × 9"
- Royal — 6.14" × 9.21"

## Layout choices

- **Recto starts.** Every major section (front matter, each Week, back matter)
  begins on a right-hand page (`page-break-before: right`). Blank verso pages
  are inserted automatically.
- **Front matter** uses Roman numerals (i, ii, iii…) and no running heads.
- **Body** uses Arabic numerals with a running title in the top corner —
  the book title on verso pages, the chapter title on recto pages.
- **Each week** opens with a part-title page (numeral, title, theme verse),
  followed by a blank verso, then the essay, then the four study sessions.
- **Each study session** starts on a fresh page.
- **Boxed elements** (preparation notes, scripture lists, reflection
  questions) are kept together and won't break across pages where possible.
- **Type:** Lora for body text (10.5 pt / 1.55 leading), Instrument Serif for
  display headings — same families as the website. Both are loaded from
  Google Fonts in `book.html`.

## Building the PDF

### Recommended: WeasyPrint or Prince

Both fully support CSS Paged Media — running heads, page numbers, recto-verso
margin mirroring.

```bash
# WeasyPrint (free, MIT)
pip install weasyprint
./build.sh weasyprint

# Prince (commercial; free for non-commercial use)
# https://www.princexml.com/download/
./build.sh prince
```

### Fallback: headless Chromium

Chromium produces a usable PDF but ignores some CSS Paged Media features
(running heads via `@top-*`, mirrored margins via `@page :left/:right`). The
book will still be paginated correctly, with sections starting on the right
page; you simply lose the decorative running heads.

```bash
./build.sh chrome
```

### Manual: browser print dialog

If you cannot install any of the above, open `book.html` in Chrome or Firefox
and choose **File → Print → Save as PDF**. In the print dialog:

1. **Destination:** Save as PDF
2. **Pages:** All
3. **Paper size:** Custom — **5.5 × 8.5 inches** (you may need to add this
   custom paper size in your OS print settings first)
4. **Margins:** Default (CSS handles them)
5. **Scale:** 100% (no fit-to-page)
6. **Background graphics:** ON (this is essential — the boxed elements use
   tinted backgrounds)
7. **Headers and footers:** OFF (CSS handles page numbers)

## Uploading to Lulu

1. Sign in at <https://www.lulu.com>.
2. Choose **Create → Print Book → Paperback**.
3. **Book size:** Digest (5.5" × 8.5"). **Paper:** 60# Cream is traditional
   for devotionals. **Binding:** Perfect Bound. **Cover finish:** Matte.
4. Upload the PDF produced by `build.sh` as the **interior**.
5. Lulu will run an automatic file check. The PDF should pass — margins and
   gutter are within Lulu's safe area for books up to ~150 pages.
6. **Cover.** Lulu provides a Cover Wizard, or you can upload your own cover
   PDF. The cover image at `images/hero-tree.png` works well for the front;
   add the title (`The Tree Tells a Story`), subtitle (`A Four-Week Family
   Advent Devotional`), and author name (`Martin J. Gallagher`).
7. Set price, ISBN (Lulu can issue a free one if you want global
   distribution), and publish.

## Editing the book

**If you only want to change the words**, see [`EDITING.md`](EDITING.md) —
it explains the edit-zone markers in `book.html` and exactly what is safe
to change without affecting the printed page layout.

The book is a single HTML file with comment-delimited sections:

```
<!-- FRONT MATTER -->
<!-- NOTES ON FAMILY WORSHIP -->
<!-- WEEK ONE — THE TREE -->
<!-- WEEK TWO — THE LIGHT -->
<!-- WEEK THREE — PROPHECY & HERITAGE -->
<!-- WEEK FOUR — THE GIFT & THE PRIZE -->
<!-- BACK MATTER — RESOURCES & ABOUT -->
```

Within each section, every prose region is wrapped in `<!-- === EDIT TEXT
BELOW === -->` / `<!-- === END EDIT TEXT === -->` markers. Anything
between those two comments is safe to retext; anything outside controls
the printed-page layout.

The book is intentionally not generated from the website HTML files — it
is a standalone, print-tuned copy so that you can adjust pacing, line
breaks, and language specifically for the printed page without affecting
the website.

To change the typography or layout, edit `book.css`.

## Pre-publication checklist

- [ ] Read through the whole PDF in a 2-page spread view (Acrobat: View → Page
      Display → Two Page View) and confirm every Week, the Foreword, and
      every part-title actually opens on a right-hand page.
- [ ] Check the Table of Contents page numbers against the printed PDF and
      adjust the hard-coded numbers in the contents `<ul>` if they have
      drifted.
- [ ] Spot-check a session block does not break awkwardly across pages.
- [ ] Verify the copyright page contains the correct year and ESV permission
      statement.
- [ ] Add a dedication page if desired (between the copyright and epigraph
      pages — a simple `<section class="epigraph-page front-matter">…</section>`
      will do).
- [ ] Order a single proof copy from Lulu before enabling distribution.
