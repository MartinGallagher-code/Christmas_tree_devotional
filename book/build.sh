#!/usr/bin/env bash
# ============================================================================
# Build the print-ready PDF of "The Tree Tells a Story"
# Trim: 5.5" x 8.5" (Lulu Digest paperback)
#
# Usage:
#   ./build.sh                    # auto-detects available engine
#   ./build.sh weasyprint         # force WeasyPrint (best paged-media support)
#   ./build.sh prince             # force Prince
#   ./build.sh chrome             # force headless Chromium
#
# Recommended: WeasyPrint or Prince. They support running headers, page
# numbers, and recto-verso margin mirroring out of the box. Headless Chromium
# works but does not honour @page :left/:right margin mirroring or running
# heads via @top-* / @bottom-*; it will still produce a paginated PDF that
# you can upload to Lulu, but page numbers will be added by Chromium itself.
# ============================================================================

set -euo pipefail

cd "$(dirname "$0")"

INPUT="book.html"
OUTPUT="the-tree-tells-a-story.pdf"
ENGINE="${1:-auto}"

if [[ "$ENGINE" == "auto" ]]; then
  if command -v weasyprint >/dev/null 2>&1; then ENGINE="weasyprint"
  elif command -v prince     >/dev/null 2>&1; then ENGINE="prince"
  elif command -v chromium   >/dev/null 2>&1; then ENGINE="chrome"
  elif command -v google-chrome >/dev/null 2>&1; then ENGINE="chrome"
  elif command -v chromium-browser >/dev/null 2>&1; then ENGINE="chrome"
  else
    echo "No PDF engine found." >&2
    echo "Install one of: weasyprint (pip install weasyprint), prince (princexml.com), chromium." >&2
    exit 1
  fi
fi

echo "Building $OUTPUT using $ENGINE…"

case "$ENGINE" in
  weasyprint)
    weasyprint "$INPUT" "$OUTPUT" --presentational-hints
    ;;

  prince)
    prince "$INPUT" -o "$OUTPUT"
    ;;

  chrome)
    CHROME_BIN="$(command -v chromium || command -v google-chrome || command -v chromium-browser)"
    "$CHROME_BIN" \
      --headless --disable-gpu --no-sandbox \
      --print-to-pdf="$OUTPUT" \
      --print-to-pdf-no-header \
      --no-pdf-header-footer \
      --virtual-time-budget=10000 \
      "file://$(pwd)/$INPUT"
    ;;

  *)
    echo "Unknown engine: $ENGINE" >&2
    exit 1
    ;;
esac

echo "Done. Output: $OUTPUT"
echo
echo "Next: upload to Lulu as a paperback book, 5.5\" x 8.5\" (\"Digest\")."
