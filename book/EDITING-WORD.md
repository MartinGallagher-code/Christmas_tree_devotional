# Editing the Book in Word

You don't have to touch HTML anymore. You can edit the whole book as a normal
Word document and let a small script fold your changes back into `book.html`.

There are two commands, both run from the `book/` folder:

```bash
./manuscript.py extract     # book.html  ->  manuscript.docx   (make the Word file)
./manuscript.py sync        # manuscript.docx -> book.html      (apply your edits)
```

## The workflow

1. **Make the Word file.**

   ```bash
   cd book
   ./manuscript.py extract
   ```

   This writes **`manuscript.docx`** — the entire book as editable prose:
   the essays, the family-worship notes, every study session, the reflection
   questions, the scripture references and descriptions, and the full
   scripture text.

2. **Edit it.** Open `manuscript.docx` in Word, Pages, or Google Docs and
   change the words. See *What you can do* below.

3. **Save** the document (keep it as `.docx`).

4. **Apply your changes.**

   ```bash
   ./manuscript.py sync
   ```

   The script compares your Word file to `book.html` and rewrites **only the
   blocks whose words actually changed.** Everything else in `book.html` is
   left byte-for-byte identical, so the print layout can't be disturbed.
   It prints a list of exactly what it changed.

5. **Rebuild the PDF.**

   ```bash
   ./build.sh
   ```

That's it. Edit prose in Word, `sync`, rebuild.

> **Tip:** You can also just hand the edited `manuscript.docx` back to Claude
> and say "sync my edits" — Claude will run `sync`, show you what changed, and
> rebuild the PDF.

## What you can do

- **Change any words** — paragraphs, headings, reflection questions, scripture
  descriptions, and the scripture text itself.
- **Italic and bold survive.** Make text italic or bold in Word and it becomes
  `<em>` / `<strong>`; remove it and it goes away. (Behind the scenes the doc
  uses paragraph *styles* for the brown "eyebrow" labels and the like, so that
  styling is never mistaken for emphasis.)
- **Straight or curly quotes, either way.** Word's autocorrect turns quotes
  curly and `--` into dashes; `sync` converts them back to the book's house
  style automatically.

## What to leave alone

- **The small superscript verse numbers** (¹ ² ³ …) inside the scripture
  passages. Leave them where they are to keep the verses numbered. The words
  around them are yours to change.
- **The greyed-out bits at the end of some lines** — a session's time
  (`~25 min`), the reference after a part-title verse, and the page numbers in
  the Table of Contents. These are layout, shown only so you have context.
  `sync` ignores edits to them.
- **Don't reorder, add, or delete whole blocks.** The Word file is for
  *retexting* existing blocks. If you want to add a new session, drop a
  paragraph, or move things around, do that small structural edit in
  `book.html` (see [`EDITING.md`](EDITING.md)) — or just ask Claude. If `sync`
  sees a brand-new paragraph it doesn't recognise, it leaves it out and the
  rest still applies.

## Two things worth knowing

- **Chapter titles and the running header.** If you rename a section whose
  title also appears in the running header at the top of the printed page,
  `sync` will tell you to update the `data-running="…"` attribute in
  `book.html` to match. (It won't change it for you, because the two aren't
  always meant to be identical.)

- **Scripture text and `inject-passages.js`.** The verse text was originally
  pulled in from `../passages.js` by `inject-passages.js`. If you edit verse
  wording in Word and `sync` it, that script won't overwrite your change (it
  only fills in passages that are *missing*). If you'd rather your scripture
  edits also live in `passages.js`, update them there too.

## If something looks wrong

Everything `sync` does is visible in one place:

```bash
git diff book/book.html
```

Only the blocks you edited should appear, and only the words inside them
should differ. If you see a change you didn't intend, you can undo it with
`git checkout book/book.html` and re-extract a fresh `manuscript.docx`.

## Re-extracting

`manuscript.docx` is generated from `book.html`. If `book.html` is edited
directly (by you or Claude), run `./manuscript.py extract` again to refresh
the Word file before your next round of editing, so the two stay in step.
