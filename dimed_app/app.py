import os
import uuid
import logging
from pathlib import Path
from flask import Flask, request, jsonify, send_file, render_template
from werkzeug.utils import secure_filename
from pdf_processor import overlay_pdfs, PDFProcessingError

# ── Configuration ────────────────────────────────────────────────────────────
BASE_DIR   = Path(__file__).parent
UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"
MAX_MB     = 50

UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = MAX_MB * 1024 * 1024
app.config["SECRET_KEY"] = os.urandom(24)


def _allowed(filename: str) -> bool:
    return filename.lower().endswith(".pdf")


def _save_upload(file_storage, prefix: str) -> Path:
    """Validate and persist an uploaded file; return its path."""
    if not file_storage or not file_storage.filename:
        raise ValueError("Arquivo não enviado.")
    if not _allowed(file_storage.filename):
        raise ValueError(f"'{file_storage.filename}' não é um PDF válido.")
    name = f"{prefix}_{uuid.uuid4().hex}_{secure_filename(file_storage.filename)}"
    path = UPLOAD_DIR / name
    file_storage.save(str(path))
    log.info("Saved upload: %s", path.name)
    return path


# ── Routes ───────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/merge", methods=["POST"])
def merge():
    """
    Expects multipart/form-data with:
      - letterhead : PDF file (background / papel timbrado)
      - document   : PDF file (content to overlay)
    Returns the merged PDF as a download.
    """
    try:
        letterhead_path = _save_upload(request.files.get("letterhead"), "lh")
        document_path   = _save_upload(request.files.get("document"),   "doc")
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    # Read margin overrides sent from the UI (fall back to defaults if missing/invalid)
    def _int_param(name: str, default: int) -> int:
        try:
            return max(0, min(int(request.form.get(name, default)), 500))
        except (TypeError, ValueError):
            return default

    margin_left   = _int_param("marginLeft",   72)
    margin_right  = _int_param("marginRight",  36)
    margin_top    = _int_param("marginTop",    85)
    margin_bottom = _int_param("marginBottom", 72)

    log.info("Margins → left=%d right=%d top=%d bottom=%d",
             margin_left, margin_right, margin_top, margin_bottom)

    output_name = f"resultado_{uuid.uuid4().hex}.pdf"
    output_path = OUTPUT_DIR / output_name

    try:
        overlay_pdfs(
            letterhead_path=letterhead_path,
            document_path=document_path,
            output_path=output_path,
            margin_left=margin_left,
            margin_right=margin_right,
            margin_top=margin_top,
            margin_bottom=margin_bottom,
        )
    except PDFProcessingError as exc:
        log.error("Processing failed: %s", exc)
        return jsonify({"error": str(exc)}), 422
    except Exception as exc:
        log.exception("Unexpected error during PDF merge")
        return jsonify({"error": "Erro interno ao processar o PDF."}), 500
    finally:
        # Clean up uploads regardless of outcome
        for p in (letterhead_path, document_path):
            try:
                p.unlink(missing_ok=True)
            except Exception:
                pass

    log.info("Merge complete → %s", output_path.name)
    return send_file(
        str(output_path),
        as_attachment=True,
        download_name="documento_timbrado.pdf",
        mimetype="application/pdf",
    )


@app.errorhandler(413)
def too_large(_):
    return jsonify({"error": f"Arquivo muito grande. Limite: {MAX_MB} MB."}), 413


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
