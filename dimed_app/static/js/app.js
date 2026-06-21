"use strict";

// ── State ────────────────────────────────────────────────────────────────────
const state = { letterhead: null, document: null };

// ── DOM references ───────────────────────────────────────────────────────────
const form       = document.getElementById("mergeForm");
const submitBtn  = document.getElementById("submitBtn");
const btnLabel   = submitBtn.querySelector(".btn-label");
const btnSpinner = submitBtn.querySelector(".btn-spinner");
const statusArea = document.getElementById("statusArea");
const progressBar = document.getElementById("progressBar");
const successBox = document.getElementById("successBox");
const errorBox   = document.getElementById("errorBox");
const errorMsg   = document.getElementById("errorMsg");

// ── Helpers ──────────────────────────────────────────────────────────────────
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function isPdf(file) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function showError(msg) {
  statusArea.hidden = false;
  progressBar.hidden = true;
  successBox.hidden  = true;
  errorBox.hidden    = false;
  errorMsg.textContent = msg;
}

function showSuccess() {
  statusArea.hidden  = false;
  progressBar.hidden = true;
  errorBox.hidden    = true;
  successBox.hidden  = false;
}

function showProgress() {
  statusArea.hidden  = false;
  progressBar.hidden = false;
  successBox.hidden  = true;
  errorBox.hidden    = true;
}

function hideStatus() {
  statusArea.hidden = true;
  progressBar.hidden = successBox.hidden = errorBox.hidden = true;
}

function setLoading(loading) {
  submitBtn.disabled = loading || !state.letterhead || !state.document;
  btnLabel.hidden    = loading;
  btnSpinner.hidden  = !loading;
}

function updateSubmitState() {
  submitBtn.disabled = !(state.letterhead && state.document);
}

// ── File handling ────────────────────────────────────────────────────────────
function setFile(key, file) {
  if (!isPdf(file)) {
    showError(`"${file.name}" não é um PDF válido.`);
    return false;
  }
  if (file.size > MAX_BYTES) {
    showError(`"${file.name}" excede o limite de 50 MB (${formatSize(file.size)}).`);
    return false;
  }
  hideStatus();
  state[key] = file;

  const capitalised = key.charAt(0).toUpperCase() + key.slice(1);
  const previewEl   = document.getElementById(`preview${capitalised}`);
  const nameEl      = document.getElementById(`name${capitalised}`);
  const inputEl     = document.getElementById(key);
  const dropEl      = document.getElementById(`drop${capitalised}`);

  nameEl.textContent = `${file.name} (${formatSize(file.size)})`;
  previewEl.hidden   = false;
  dropEl.hidden      = true;
  inputEl.value      = "";   // reset so same file can be re-selected

  updateSubmitState();
  return true;
}

function clearFile(key) {
  state[key] = null;
  const capitalised = key.charAt(0).toUpperCase() + key.slice(1);
  document.getElementById(`preview${capitalised}`).hidden = true;
  document.getElementById(`drop${capitalised}`).hidden    = false;
  updateSubmitState();
  hideStatus();
}

// ── Wire up file inputs ──────────────────────────────────────────────────────
["letterhead", "document"].forEach(key => {
  const inputEl = document.getElementById(key);
  const capitalised = key.charAt(0).toUpperCase() + key.slice(1);
  const dropEl  = document.getElementById(`drop${capitalised}`);

  // File input change
  inputEl.addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) setFile(key, file);
  });

  // Drag-and-drop
  dropEl.addEventListener("dragover", e => {
    e.preventDefault();
    dropEl.classList.add("drag-over");
  });
  dropEl.addEventListener("dragleave", () => dropEl.classList.remove("drag-over"));
  dropEl.addEventListener("drop", e => {
    e.preventDefault();
    dropEl.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file) setFile(key, file);
  });
});

// ── Clear buttons ────────────────────────────────────────────────────────────
document.querySelectorAll(".btn-clear").forEach(btn => {
  btn.addEventListener("click", () => clearFile(btn.dataset.target));
});

// ── Form submission ──────────────────────────────────────────────────────────
form.addEventListener("submit", async e => {
  e.preventDefault();
  if (!state.letterhead || !state.document) return;

  setLoading(true);
  showProgress();

  const fd = new FormData();
  fd.append("letterhead", state.letterhead);
  fd.append("document",   state.document);

  // Append margin config
  ["marginLeft", "marginRight", "marginTop", "marginBottom"].forEach(id => {
    const el = document.getElementById(id);
    if (el) fd.append(id, el.value);
  });

  try {
    const res = await fetch("/api/merge", { method: "POST", body: fd });

    if (!res.ok) {
      let msg = "Erro ao processar o PDF.";
      try {
        const data = await res.json();
        if (data.error) msg = data.error;
      } catch (_) { /* ignore JSON parse errors */ }
      showError(msg);
      return;
    }

    // Trigger download from the blob
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "documento_timbrado.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10_000);

    showSuccess();
  } catch (err) {
    console.error(err);
    showError("Falha de conexão. Verifique se o servidor está rodando.");
  } finally {
    setLoading(false);
  }
});
