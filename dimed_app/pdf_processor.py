"""
pdf_processor.py
────────────────
Overlays a "document" PDF on top of a "letterhead" PDF page by page.

Strategy
--------
For each page of the *document*:
  1. Take the corresponding letterhead page (cycling if the letterhead has
     fewer pages than the document).
  2. Scale / position the document content so it fits inside the letterhead's
     safe area (margins reserved for logo, footer bands, etc.).
  3. Merge the two layers: letterhead underneath, document on top.

The letterhead's visual elements (logo, coloured bands, footer, signature)
are always rendered first, so they appear behind the document text.
"""

from __future__ import annotations

import io
import logging
from pathlib import Path

from pypdf import PdfReader, PdfWriter, Transformation
from pypdf.generic import RectangleObject

log = logging.getLogger(__name__)


class PDFProcessingError(Exception):
    """Raised for known, user-facing errors during PDF processing."""


# ── Margin configuration (points, 1 pt = 1/72 inch) ─────────────────────────
# 1 cm ≈ 28.35 pt
MARGIN_LEFT   = 72    # 1 inch  – leaves room for the green vertical band
MARGIN_RIGHT  = 36    # 0.5 inch
MARGIN_TOP    = 85    # ~3 cm from top edge of page (3 × 28.35 ≈ 85 pt)
MARGIN_BOTTOM = 72    # 1 inch  – leaves room for footer band + address line


def _validate_pdf(path: Path, label: str) -> PdfReader:
    """Open and minimally validate a PDF file."""
    if not path.exists():
        raise PDFProcessingError(f"Arquivo não encontrado: {label}.")
    if path.stat().st_size == 0:
        raise PDFProcessingError(f"Arquivo vazio: {label}.")
    try:
        reader = PdfReader(str(path))
    except Exception as exc:
        raise PDFProcessingError(
            f"Não foi possível ler '{label}': arquivo corrompido ou protegido por senha."
        ) from exc
    if len(reader.pages) == 0:
        raise PDFProcessingError(f"'{label}' não contém páginas.")
    return reader


def overlay_pdfs(
    letterhead_path: Path,
    document_path: Path,
    output_path: Path,
    margin_left: int   = MARGIN_LEFT,
    margin_right: int  = MARGIN_RIGHT,
    margin_top: int    = MARGIN_TOP,
    margin_bottom: int = MARGIN_BOTTOM,
) -> None:
    """
    Merge *document_path* on top of *letterhead_path* and write to *output_path*.

    Parameters
    ----------
    letterhead_path : Path  – background PDF (papel timbrado)
    document_path   : Path  – foreground PDF (exam results / any content)
    output_path     : Path  – where the combined PDF is written
    margin_*        : int   – safe-area margins in PDF points
    """
    lh_reader  = _validate_pdf(letterhead_path, "Papel timbrado")
    doc_reader = _validate_pdf(document_path,   "Documento de resultado")

    lh_pages  = lh_reader.pages
    doc_pages = doc_reader.pages
    n_lh      = len(lh_pages)
    n_doc     = len(doc_pages)

    log.info(
        "Merging: letterhead=%d page(s), document=%d page(s)",
        n_lh, n_doc,
    )

    writer = PdfWriter()

    for i, doc_page in enumerate(doc_pages):
        # Cycle letterhead pages if document has more pages than the letterhead
        lh_page = lh_pages[i % n_lh]

        # Work on a fresh copy of the letterhead page so we don't mutate it
        # across iterations (important when n_doc > n_lh).
        lh_copy = _clone_page(lh_page)

        # Dimensions of the letterhead page (in points)
        lh_w = float(lh_copy.mediabox.width)
        lh_h = float(lh_copy.mediabox.height)

        # Available safe area
        safe_w = lh_w - margin_left - margin_right
        safe_h = lh_h - margin_top  - margin_bottom

        # Dimensions of the document page
        doc_w = float(doc_page.mediabox.width)
        doc_h = float(doc_page.mediabox.height)

        # Compute uniform scale so the document fits inside the safe area
        scale = min(safe_w / doc_w, safe_h / doc_h, 1.0)  # never upscale

        scaled_w = doc_w * scale
        scaled_h = doc_h * scale

        # Horizontally centred; vertically pinned to the top safe boundary
        # (PDF y=0 is bottom of page, so top of safe area = lh_h - margin_top,
        #  and we place the top of the scaled content exactly there)
        offset_x = margin_left + (safe_w - scaled_w) / 2
        offset_y = lh_h - margin_top - scaled_h

        # Build the transformation: scale then translate
        transform = (
            Transformation()
            .scale(scale)
            .translate(offset_x, offset_y)
        )

        # Merge document page onto the letterhead copy
        lh_copy.merge_transformed_page(doc_page, transform, expand=False)

        writer.add_page(lh_copy)
        log.debug("Page %d/%d merged (scale=%.3f, dx=%.1f, dy=%.1f)",
                  i + 1, n_doc, scale, offset_x, offset_y)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(str(output_path), "wb") as fh:
        writer.write(fh)

    log.info("Output written → %s (%.1f KB)",
             output_path.name, output_path.stat().st_size / 1024)


def _clone_page(page):
    """
    Return an independent copy of a PdfPage so merging onto it does not
    affect other iterations that reuse the same source page object.
    """
    buf = io.BytesIO()
    w = PdfWriter()
    w.add_page(page)
    w.write(buf)
    buf.seek(0)
    return PdfReader(buf).pages[0]
