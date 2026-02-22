// SQA Playground — Evaluasi Page Logic

let currentStep = 0;
const TOTAL_STEPS = 5;

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadSavedData();
    buildAttrCheckboxes();
    buildRatingTable();
    updateStepUI();
    setupAutoSave();
});

// ── Step Navigation ───────────────────────────────────────────
function nextStep() {
    if (!validateStep(currentStep)) return;
    saveCurrentStep();
    if (currentStep < TOTAL_STEPS - 1) {
        currentStep++;
        if (currentStep === 2) buildTugasACards();   // rebuild Tugas A cards with chosen attrs
        if (currentStep === 3) buildRatingTable();   // rebuild rating table with chosen attrs
        updateStepUI();
    }
}

function prevStep() {
    if (currentStep > 0) {
        saveCurrentStep();
        currentStep--;
        updateStepUI();
    }
}

function updateStepUI() {
    // Panels
    document.querySelectorAll('.step-panel').forEach((p, i) => {
        p.classList.toggle('active', i === currentStep);
    });
    // Stepper circles
    document.querySelectorAll('.step').forEach((s, i) => {
        s.classList.remove('active', 'completed');
        if (i === currentStep) s.classList.add('active');
        else if (i < currentStep) s.classList.add('completed');
    });
    // Progress
    const pct = Math.round((currentStep / (TOTAL_STEPS - 1)) * 100);
    document.getElementById('progressFill').style.width = pct + '%';
    // Scroll
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Validation ────────────────────────────────────────────────
function validateStep(step) {
    if (step === 0) {
        const nama = document.getElementById('nama').value.trim();
        const nim = document.getElementById('nim').value.trim();
        const app = document.getElementById('appName').value.trim();
        const cat = document.getElementById('appCategory').value;
        if (!nama || !nim || !app || !cat) {
            highlightEmpty(['nama', 'nim', 'appName', 'appCategory']);
            return false;
        }
    }
    if (step === 1) {
        const checked = getSelectedAttrs();
        const alert = document.getElementById('minAttrAlert');
        if (checked.length < 3) {
            alert.style.display = 'flex';
            return false;
        }
        alert.style.display = 'none';
    }
    if (step === 2) {
        // Tugas A: at least one explanation must be non-empty
        const missing = [];
        getSelectedAttrs().forEach(id => {
            const el = document.getElementById('tugasa_' + id);
            if (el && !el.value.trim()) missing.push(id);
        });
        if (missing.length > 0) {
            missing.forEach(id => {
                const el = document.getElementById('tugasa_' + id);
                if (el) {
                    el.style.borderColor = 'var(--danger)';
                    el.addEventListener('input', () => el.style.borderColor = '', { once: true });
                }
            });
            alert('Mohon isi penjelasan untuk semua atribut yang dipilih sebelum melanjutkan.');
            return false;
        }
    }
    return true;
}

function highlightEmpty(ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el.value.trim()) {
            el.style.borderColor = 'var(--danger)';
            el.addEventListener('input', () => el.style.borderColor = '', { once: true });
        }
    });
}

// ── Attribute Checkboxes ──────────────────────────────────────
function buildAttrCheckboxes() {
    const container = document.getElementById('attrCheckboxes');
    const data = AppData.get();
    const preSelected = data.selectedAttrs || [];

    container.innerHTML = ISO25010.map(char => `
    <div class="checkbox-card">
      <input type="checkbox" id="cb_${char.id}" value="${char.id}"
        ${preSelected.includes(char.id) ? 'checked' : ''}
        onchange="syncAttrAlert()" />
      <label for="cb_${char.id}">
        <span class="cb-icon">${char.icon}</span>
        <div class="cb-text">
          <strong>${char.nameId}</strong>
          <span>${char.name}</span>
        </div>
        <div class="cb-check">✓</div>
      </label>
    </div>
  `).join('');
}

function syncAttrAlert() {
    const alert = document.getElementById('minAttrAlert');
    if (getSelectedAttrs().length >= 3) alert.style.display = 'none';
}

function getSelectedAttrs() {
    return Array.from(document.querySelectorAll('#attrCheckboxes input:checked')).map(i => i.value);
}

// ── Tugas A Cards ─────────────────────────────────────────────
function buildTugasACards() {
    const data = AppData.get();
    const selected = data.selectedAttrs || getSelectedAttrs();
    const tugasA = data.tugasA || {};

    const selectedChars = ISO25010.filter(c => selected.includes(c.id));
    const container = document.getElementById('tugasACards');

    container.innerHTML = selectedChars.map((char, i) => {
        const savedText = tugasA[char.id] || '';
        const wordCount = savedText.trim() ? savedText.trim().split(/\s+/).length : 0;
        return `
      <div class="tugasa-card">
        <div class="tugasa-card-header">
          <span class="tugasa-card-icon">${char.icon}</span>
          <div>
            <div class="tugasa-card-title">${i + 1}. ${char.nameId} <span style="color:var(--text-muted); font-weight:400; font-size:0.78rem;">(${char.name})</span></div>
          </div>
          <span class="badge badge-primary" style="margin-left:auto;">Tugas A · Poin ${Math.floor(20 / selectedChars.length)}</span>
        </div>
        <div class="tugasa-card-hint">
          <strong>📌 Referensi definisi standar ISO/IEC 25010:</strong><br/>
          ${char.description}
        </div>
        <div class="tugasa-card-body">
          <label class="form-label" style="margin-bottom:6px;">
            Penjelasan Anda <span class="required">*</span>
            <span style="font-weight:400; color:var(--text-muted); font-size:0.78rem;">— tulis dengan bahasa sendiri</span>
          </label>
          <textarea
            id="tugasa_${char.id}"
            class="alasan-input"
            rows="4"
            placeholder="Menurut saya, ${char.nameId} adalah... Contohnya dalam ${char.name.toLowerCase()}..."
            oninput="updateWordCount('${char.id}', this.value)"
          >${savedText}</textarea>
          <div class="tugasa-char-count" id="wc_${char.id}">${wordCount} kata</div>
        </div>
      </div>
    `;
    }).join('');
}

function updateWordCount(id, value) {
    const count = value.trim() ? value.trim().split(/\s+/).length : 0;
    const el = document.getElementById('wc_' + id);
    if (el) {
        el.textContent = count + ' kata';
        el.style.color = count >= 20 ? 'var(--success)' : 'var(--text-muted)';
    }
}

// ── Rating Table ──────────────────────────────────────────────
function buildRatingTable() {
    const data = AppData.get();
    const selected = data.selectedAttrs || getSelectedAttrs();
    const ratings = data.ratings || {};
    const alasan = data.alasan || {};

    const selectedChars = ISO25010.filter(c => selected.includes(c.id));
    const tbody = document.getElementById('ratingBody');
    tbody.innerHTML = selectedChars.map(char => {
        const val = ratings[char.id] || 3;
        const stars = '★'.repeat(val) + '☆'.repeat(5 - val);
        return `
      <tr class="rating-row">
        <td>
          <div style="display:flex; gap:8px; align-items:center; margin-bottom:4px;">
            <span style="font-size:1.2rem;">${char.icon}</span>
            <div>
              <div class="attr-name">${char.nameId}</div>
              <div class="attr-nameid">${char.name}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="rating-input" style="flex-direction:column; gap:4px; align-items:flex-start;">
            <div style="display:flex; align-items:center; gap:8px; width:100%;">
              <input type="range" min="1" max="5" value="${val}"
                class="rating-slider"
                id="slider_${char.id}"
                oninput="updateSlider('${char.id}', this.value)" />
              <div class="rating-value" id="rval_${char.id}">${val}</div>
            </div>
            <div class="rating-stars" id="rstars_${char.id}">${stars}</div>
          </div>
        </td>
        <td>
          <textarea class="alasan-input" id="alasan_${char.id}"
            placeholder="Mengapa Anda memberi nilai ${val}? Berikan contoh konkret..."
          >${alasan[char.id] || ''}</textarea>
        </td>
      </tr>
    `;
    }).join('');
}

function updateSlider(id, value) {
    const v = parseInt(value);
    document.getElementById('rval_' + id).textContent = v;
    document.getElementById('rstars_' + id).textContent = '★'.repeat(v) + '☆'.repeat(5 - v);
}

// ── Save ──────────────────────────────────────────────────────
function saveCurrentStep() {
    if (currentStep === 0) {
        AppData.update({
            nama: document.getElementById('nama').value.trim(),
            nim: document.getElementById('nim').value.trim(),
            appName: document.getElementById('appName').value.trim(),
            appCategory: document.getElementById('appCategory').value,
            platform: document.getElementById('platform').value,
            appDesc: document.getElementById('appDesc').value.trim(),
        });
    }

    if (currentStep === 1) {
        AppData.update({ selectedAttrs: getSelectedAttrs() });
    }

    if (currentStep === 2) {
        // Save Tugas A explanations
        const tugasA = {};
        getSelectedAttrs().forEach(id => {
            const el = document.getElementById('tugasa_' + id);
            if (el) tugasA[id] = el.value.trim();
        });
        AppData.update({ tugasA });
    }

    if (currentStep === 3) {
        const ratings = {}, alasan = {};
        document.querySelectorAll('[id^="slider_"]').forEach(el => {
            const id = el.id.replace('slider_', '');
            ratings[id] = parseInt(el.value);
        });
        document.querySelectorAll('[id^="alasan_"]').forEach(el => {
            const id = el.id.replace('alasan_', '');
            alasan[id] = el.value.trim();
        });
        AppData.update({ ratings, alasan });
    }

    if (currentStep === 4) {
        AppData.update({
            kelemahan1: document.getElementById('kelemahan1').value.trim(),
            kelemahan2: document.getElementById('kelemahan2').value.trim(),
            kelemahan3: document.getElementById('kelemahan3').value.trim(),
            rekomendasi1: document.getElementById('rekomendasi1').value.trim(),
            rekomendasi2: document.getElementById('rekomendasi2').value.trim(),
            rekomendasi3: document.getElementById('rekomendasi3').value.trim(),
            kesimpulan: document.getElementById('kesimpulan').value.trim(),
            savedAt: new Date().toISOString(),
        });
    }

    showSaved();
}

function showSaved() {
    const el = document.getElementById('savedIndicator');
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2000);
}

function saveAndGenerate() {
    saveCurrentStep();
}

// ── Load Saved Data ───────────────────────────────────────────
function loadSavedData() {
    const d = AppData.get();
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== undefined) el.value = val;
    };
    setVal('nama', d.nama);
    setVal('nim', d.nim);
    setVal('appName', d.appName);
    setVal('appCategory', d.appCategory);
    setVal('platform', d.platform);
    setVal('appDesc', d.appDesc);
    setVal('kelemahan1', d.kelemahan1);
    setVal('kelemahan2', d.kelemahan2);
    setVal('kelemahan3', d.kelemahan3);
    setVal('rekomendasi1', d.rekomendasi1);
    setVal('rekomendasi2', d.rekomendasi2);
    setVal('rekomendasi3', d.rekomendasi3);
    setVal('kesimpulan', d.kesimpulan);
}

function setupAutoSave() {
    let timer;
    document.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => saveCurrentStep(), 1200);
    });
}
