# Editing the Book — Text-Only Guide

The book is one HTML file (`book.html`). You don't need to know HTML to edit
the words in it — every prose section is wrapped in clearly marked **edit
zones** so you can tell at a glance which parts of the file are safe to
change and which control the printed-page layout.

## The marker

Look for this pair of comments:

```html
<!-- === EDIT TEXT BELOW — keep tags and class names — see book/EDITING.md === -->
   ... section content ...
<!-- === END EDIT TEXT === -->
```

**Anything between those two markers is safe to retext.** Anything outside
them — section wrappers, blank pages, page breaks, the contents page, the
big roman numerals on part-title pages — is layout. Leave it alone unless
you specifically want to redesign the printed page.

## What "safe to retext" means

Inside an edit zone you can freely rewrite the **words** that appear on
the page. The text you see between `>` and `<` is the text that prints.

```html
<p>You can change every word in this sentence.</p>
                   ↑ everything between > and < is yours
```

You can change:

- Paragraph text — anything inside `<p>...</p>`
- Headings — anything inside `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`
- List items — `<li>...</li>`
- Italics — `<em>...</em>`
- Bold — `<strong>...</strong>`
- Blockquotes and citations — `<blockquote>...</blockquote>`, `<cite>...</cite>`
- Scripture references — `<span class="scripture-ref">Genesis 2:4–17</span>`
- Scripture one-line descriptions — `<span class="scripture-desc">...</span>`
- The verses themselves inside `<div class="scripture-text">`

## What NOT to change

Even inside an edit zone, four things are layout and should be left alone:

1. **Tag names** — don't replace `<p>` with `<div>`, or `<h2>` with `<h3>`.
   The CSS targets specific tags; the wrong tag means the wrong typography.
2. **Class names** — `class="lead"`, `class="prep-box"`,
   `class="reflection-box"`, etc. These pick the boxed-element style.
3. **The `data-running="..."` attribute** on each section. It controls the
   running header at the top of each printed page. If you change a chapter
   title and want the page header to match, change `data-running` to the
   same new text.
4. **`<span class="verse-num">N</span>`** markers inside scripture text.
   These number the verses on the page.

If you remember nothing else: **edit only the words between `>` and `<`,
not the angle brackets or anything inside them**, and you can't break the
layout.

## Sections that are partly layout

Three places in the book mix prose with layout. They don't have edit-zone
markers — edit them with a little extra care.

### Table of contents

Inside `<section class="contents-page">`. The chapter titles in the
contents are safe to retext. The numbers in the right-hand column
(`<span class="toc-page-num">19</span>`) are the **printed page numbers**
and must match the actual PDF. After a meaningful edit, rebuild the PDF
and update any TOC page numbers that have shifted.

Don't change the `<li class="toc-part">` / `<li class="toc-sub">` class
names — they control the indenting in the contents listing.

### Part-title pages

Inside `<section class="part-title">`. The big display numeral
(`<span class="part-numeral">I</span>` etc.) is set in display type and is
part of the page design — leave it alone unless you specifically want
different numerals. The eyebrow, the heading, and the theme verse below
the numeral are all safe to retext.

### Half-title and title page

The book title (`The Tree Tells<br>a Story`) uses a `<br>` to force the
line break exactly where the design wants it. If you change the title to
something with a different length, you may need to move or remove the
`<br>` so it still looks right on the printed page.

### Copyright page

Almost all of this is editable, but the **ESV® permission paragraph** is a
legal requirement when quoting the ESV translation. Don't remove it. If
you switch to a different Bible translation, replace this paragraph with
the permission statement that translation's publisher requires.

## After you edit

Rebuild the PDF and spot-check the section you changed:

```bash
cd book
./build.sh weasyprint    # or `prince`, or `chrome`
```

Open `the-tree-tells-a-story.pdf`. If you edited a chapter title, scroll
through that chapter and check the running head at the top of each page
matches.

## If a layout change you didn't intend shows up

The most likely causes, in order:

1. A tag accidentally deleted — e.g. a closing `</p>` removed.
2. A class name changed or a typo introduced.
3. A `<br>` removed from a heading that needed two lines.
4. The `data-running` value no longer matches its section title.

To see exactly what you changed since the last commit:

```bash
git diff book/book.html
```

The diff will usually show the problem in one or two lines.
