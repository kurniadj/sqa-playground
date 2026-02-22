// SQA Playground — Laporan (Report) Logic

document.addEventListener('DOMContentLoaded', () => {
  renderReport();
  renderSidebar();
});

// ── Helpers ───────────────────────────────────────────────────
function stars(n) {
  return '<span class="star-display">' + '★'.repeat(n) + '☆'.repeat(5 - n) + '</span>';
}

function ratingLabel(n) {
  const labels = { 1: 'Sangat Buruk', 2: 'Buruk', 3: 'Cukup', 4: 'Baik', 5: 'Sangat Baik' };
  return labels[n] || '-';
}

function formatDate() {
  return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function hasData(d) {
  return d.nama && d.nim && d.appName;
}

function hasTugasA(d, selected) {
  const tugasA = d.tugasA || {};
  return selected.length > 0 && selected.every(id => tugasA[id] && tugasA[id].trim());
}

// ── Render Sidebar ────────────────────────────────────────────
function renderSidebar() {
  const d = AppData.get();

  // Info block
  const sidebarInfo = document.getElementById('sidebarInfo');
  if (hasData(d)) {
    sidebarInfo.innerHTML = `
      <div><strong>Nama:</strong> ${d.nama || '—'}</div>
      <div><strong>NIM:</strong> ${d.nim || '—'}</div>
      <div><strong>Aplikasi:</strong> ${d.appName || '—'}</div>
      <div><strong>Kategori:</strong> ${d.appCategory || '—'}</div>
      <div><strong>Atribut dipilih:</strong> ${(d.selectedAttrs || []).length} dari 8</div>
    `;
  }

  // Average score
  const selected = d.selectedAttrs || [];
  const ratings = d.ratings || {};
  const avgEl = document.getElementById('avgScore');
  const avgLabelEl = document.getElementById('avgLabel');
  const avgBarEl = document.getElementById('avgBar');

  if (selected.length > 0 && Object.keys(ratings).length > 0) {
    const vals = selected.map(id => ratings[id] || 3);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const avgFixed = avg.toFixed(2);
    avgEl.textContent = avgFixed;

    const pct = (avg / 5) * 100;
    const color = avg >= 4 ? 'var(--success)' : avg >= 3 ? 'var(--accent)' : 'var(--danger)';
    avgBarEl.innerHTML = `
      <div style="background:var(--border); height:8px; border-radius:4px; overflow:hidden;">
        <div style="width:${pct}%; height:100%; background:${color}; border-radius:4px; transition:width 0.6s;"></div>
      </div>
      <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">${ratingLabel(Math.round(avg))} secara keseluruhan</div>
    `;
    avgLabelEl.textContent = `dari 5.0 maksimal`;
  }

  // Completeness
  const tugasA = d.tugasA || {};
  const checks = [
    { label: 'Info mahasiswa', ok: !!(d.nama && d.nim) },
    { label: 'Info aplikasi', ok: !!(d.appName && d.appCategory) },
    { label: 'Min. 3 atribut dipilih', ok: (d.selectedAttrs || []).length >= 3 },
    { label: 'Tugas A: penjelasan atribut', ok: (d.selectedAttrs || []).length > 0 && (d.selectedAttrs || []).every(id => tugasA[id] && tugasA[id].trim()) },
    { label: 'Semua nilai diisi', ok: (d.selectedAttrs || []).every(id => ratings[id]) },
    { label: 'Alasan penilaian', ok: Object.values(d.alasan || {}).some(v => v) },
    { label: 'Min. 2 kelemahan', ok: !!(d.kelemahan1 && d.kelemahan2) },
    { label: 'Min. 2 rekomendasi', ok: !!(d.rekomendasi1 && d.rekomendasi2) },
  ];
  document.getElementById('completenessCheck').innerHTML = checks.map(c => `
    <div style="display:flex; gap:6px; align-items:center;">
      <span style="color: ${c.ok ? 'var(--success)' : 'var(--text-muted)'};">  ${c.ok ? '✅' : '⬜'}</span>
      <span style="color: ${c.ok ? 'var(--text-primary)' : 'var(--text-muted)'};">  ${c.label}</span>
    </div>
  `).join('');
}

// ── Render Report ─────────────────────────────────────────────
function renderReport() {
  const d = AppData.get();
  const empty = document.getElementById('emptyState');
  const content = document.getElementById('reportContent');

  if (!hasData(d)) {
    empty.style.display = 'block';
    content.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  content.style.display = 'block';

  const selected = d.selectedAttrs || [];
  const ratings = d.ratings || {};
  const alasan = d.alasan || {};
  const tugasA = d.tugasA || {};
  const selectedChars = ISO25010.filter(c => selected.includes(c.id));

  // Tugas A: student's OWN explanation + definition reference
  const tugasARows = selectedChars.map((char, i) => {
    const userExplanation = tugasA[char.id];
    return `
      <div class="attr-desc-block">
        <strong>${i + 1}. ${char.nameId} (<em>${char.name}</em>)</strong>
        ${userExplanation
        ? `<p style="margin:6px 0 4px;">${userExplanation}</p>
             <div style="font-size:10pt; color:#777; border-left:3px solid #ddd; padding-left:8px; margin-top:6px;">
               <em>Referensi ISO/IEC 25010: ${char.description}</em>
             </div>`
        : `<p>${char.description}</p>`
      }
      </div>
    `;
  }).join('');

  // Tugas B table
  const tabelRows = selectedChars.map(char => {
    const val = ratings[char.id] || 3;
    return `
      <tr>
        <td>${char.nameId}<br/><small style="color:#666;">${char.name}</small></td>
        <td style="text-align:center;"><strong>${val}</strong></td>
        <td style="text-align:center;">${stars(val)}</td>
        <td>${ratingLabel(val)}</td>
        <td>${alasan[char.id] || '<em style="color:#999;">—</em>'}</td>
      </tr>
    `;
  }).join('');

  // Avg
  const vals = selectedChars.map(c => ratings[c.id] || 3);
  const avg = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : '—';

  // Weaknesses
  const kelemahanItems = [d.kelemahan1, d.kelemahan2, d.kelemahan3]
    .filter(Boolean)
    .map(k => `<li>${k}</li>`).join('');

  // Recommendations
  const rekomendasiItems = [d.rekomendasi1, d.rekomendasi2, d.rekomendasi3]
    .filter(Boolean)
    .map(r => `<li>${r}</li>`).join('');

  content.innerHTML = `
    <!-- Header -->
    <div class="report-header-doc">
      <h1>LAPORAN EVALUASI KUALITAS PERANGKAT LUNAK</h1>
      <p>Tugas-02 — Mata Kuliah Penjaminan Mutu Perangkat Lunak</p>
      <p style="font-size:10pt;">Menggunakan Model ISO/IEC 25010:2011</p>
    </div>

    <!-- Meta -->
    <div class="report-meta">
      <div class="report-meta-item"><strong>Nama:</strong> ${d.nama}</div>
      <div class="report-meta-item"><strong>NIM:</strong> ${d.nim}</div>
      <div class="report-meta-item"><strong>Aplikasi:</strong> ${d.appName}</div>
      <div class="report-meta-item"><strong>Kategori:</strong> ${d.appCategory || '—'}</div>
      <div class="report-meta-item"><strong>Platform:</strong> ${d.platform || '—'}</div>
      <div class="report-meta-item"><strong>Tanggal:</strong> ${formatDate()}</div>
    </div>

    ${d.appDesc ? `
    <div class="section-title">Pendahuluan</div>
    <p>${d.appDesc}</p>
    ` : ''}

    <!-- Tugas A -->
    <div class="section-title">TUGAS A — Identifikasi Atribut Kualitas (20 Poin)</div>
    <p>Berikut adalah atribut-atribut kualitas dari ISO/IEC 25010 yang dipilih untuk dievaluasi pada aplikasi <strong>${d.appName}</strong>:</p>
    ${tugasARows}

    <!-- Tugas B -->
    <div class="section-title">TUGAS B — Evaluasi Kualitas Aplikasi (40 Poin)</div>

    <div class="subsection-title">B.1 Tabel Penilaian Kualitas</div>
    <table class="report-table">
      <thead>
        <tr>
          <th style="width:22%;">Atribut Kualitas</th>
          <th style="width:8%; text-align:center;">Nilai</th>
          <th style="width:12%; text-align:center;">Bintang</th>
          <th style="width:15%;">Kategori</th>
          <th>Alasan Pemberian Nilai</th>
        </tr>
      </thead>
      <tbody>
        ${tabelRows}
        <tr style="background:#f0f4ff;">
          <td colspan="1"><strong>Rata-rata</strong></td>
          <td style="text-align:center;"><strong>${avg}</strong></td>
          <td style="text-align:center;">${stars(Math.round(parseFloat(avg) || 3))}</td>
          <td><strong>${ratingLabel(Math.round(parseFloat(avg) || 3))}</strong></td>
          <td><em>Rata-rata dari ${selectedChars.length} atribut yang dievaluasi</em></td>
        </tr>
      </tbody>
    </table>

    <div class="subsection-title">B.2 Kelemahan Kualitas yang Teridentifikasi</div>
    <ul class="kelemahan-list">
      ${kelemahanItems || '<li><em>Belum diisi</em></li>'}
    </ul>

    <div class="subsection-title">B.3 Rekomendasi Perbaikan</div>
    <ul class="rekomendasi-list">
      ${rekomendasiItems || '<li><em>Belum diisi</em></li>'}
    </ul>

    ${d.kesimpulan ? `
    <div class="subsection-title">Kesimpulan</div>
    <div class="kesimpulan-block">${d.kesimpulan}</div>
    ` : ''}

    <div class="page-footer-doc">
      Laporan dibuat menggunakan SQA Playground · ${formatDate()} · ISO/IEC 25010:2011
    </div>
  `;
}

// ── Clear ─────────────────────────────────────────────────────
function clearData() {
  if (confirm('Reset semua data evaluasi? Tindakan ini tidak dapat dibatalkan.')) {
    AppData.clear();
    location.reload();
  }
}
