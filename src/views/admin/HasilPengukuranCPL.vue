<template>
  <AppLayout :navItems="navItems" userName="Admin">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <RouterLink :to="`/admin/penilaian/${mkId}`" class="back-btn">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Kembali
      </RouterLink>
      <div class="page-title-wrap">
        <h1>{{ mk?.name || "Hasil Pengukuran CPL" }}</h1>
        <div class="subtitle">{{ mk?.semester || "Semester Aktif" }}</div>
      </div>
      <button
        class="btn btn-secondary ht-print-btn"
        @click="cetak"
        style="margin-left: auto"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          style="width: 16px; height: 16px"
        >
          <polyline points="6 9 6 2 18 2 18 9" />
          <path
            d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
          />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        Cetak / Print
      </button>
    </div>

    <!-- LOADING STATE -->
    <div v-if="loading" class="ht-empty">
      <div class="ht-empty-icon">⏳</div>
      <h3>Memuat Data...</h3>
      <p>Sedang mengambil data penilaian dari server.</p>
    </div>

    <!-- EMPTY STATE -->
    <div v-else-if="!hasData" class="ht-empty">
      <div class="ht-empty-icon">📭</div>
      <h3>Data Belum Tersedia</h3>
      <p>
        Belum ada data penilaian untuk mata kuliah ini.<br />Silakan input nilai
        terlebih dahulu melalui tabel penilaian.
      </p>
      <RouterLink
        :to="`/admin/penilaian/${mkId}`"
        class="btn btn-primary"
        style="
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          margin-top: 20px;
          padding: 10px 20px;
        "
      >
        ← Input Nilai
      </RouterLink>
    </div>

    <!-- CONTENT AREA -->
    <div v-else id="contentArea">
      <!-- ── SECTION 1: Rekap Wide-Table (mengikuti format sheet 'Praktik') ── -->
      <div class="ht-card">
        <div class="ht-card-hdr">
          <span class="ht-card-ico">📋</span>
          <div>
            <h2 class="ht-card-title">Rekap Capaian CPL Per Mahasiswa</h2>
            <p class="ht-card-sub">
              Rincian komponen, total, grade, dan capaian CPMK/CPL setiap
              mahasiswa terhadap standar minimum 80%
            </p>
          </div>
        </div>
        <div class="ht-table-scroll">
          <table class="ht-table ht-wide-table">
            <thead>
              <!-- Baris 1: CPL (kolom komponen) -->
              <tr>
                <th class="col-no" rowspan="4">No.</th>
                <th class="col-nim" rowspan="4">NIM</th>
                <th class="col-nama" rowspan="4" style="text-align: left">
                  Nama
                </th>
                <th
                  v-for="cpl in data.cplList"
                  :key="'w-cpl-' + cpl.name"
                  :colspan="cplKomponenSpan(cpl)"
                  class="wt-cpl-hdr"
                >
                  {{ cpl.name }}
                </th>
                <th rowspan="4">TOTAL</th>
                <th rowspan="4">GRADE</th>
                <template
                  v-for="cpl in data.cplList"
                  :key="'w-cpmk-sum-' + cpl.name"
                >
                  <th
                    v-for="cpmk in cpl.cpmkList"
                    :key="'w-cpmk-sum-th-' + cpl.name + '-' + cpmk.name"
                    rowspan="4"
                    class="wt-cpmk-group-hdr"
                  >
                    {{ cpmk.name }}
                  </th>
                </template>
                <template
                  v-for="cpl in data.cplList"
                  :key="'w-cpl-sum-' + cpl.name"
                >
                  <th rowspan="4" class="wt-cpl-group-hdr">
                    {{ cpl.name }}<br /><small>Capaian</small>
                  </th>
                  <th rowspan="4" class="wt-cpl-group-hdr">
                    {{ cpl.name }}<br /><small>Status</small>
                  </th>
                </template>
              </tr>
              <!-- Baris 2: CPMK (dengan persen) -->
              <tr>
                <template
                  v-for="cpl in data.cplList"
                  :key="'w-cpmk-' + cpl.name"
                >
                  <th
                    v-for="cpmk in cpl.cpmkList"
                    :key="'w-cpmk-' + cpl.name + '-' + cpmk.name"
                    :colspan="cpmkKomponenSpan(cpmk)"
                    class="wt-cpmk-hdr"
                  >
                    {{ cpmk.name }} - {{ cpmk.persen }}%
                  </th>
                </template>
              </tr>
              <!-- Baris 3: Sub-CPMK (dengan persen totalBobot) -->
              <tr>
                <template
                  v-for="cpl in data.cplList"
                  :key="'w-sub-cpl-' + cpl.name"
                >
                  <template
                    v-for="cpmk in cpl.cpmkList"
                    :key="'w-sub-cpmk-' + cpl.name + '-' + cpmk.name"
                  >
                    <th
                      v-for="sub in cpmk.subCpmkList"
                      :key="
                        'w-sub-' + cpl.name + '-' + cpmk.name + '-' + sub.name
                      "
                      :colspan="sub.bobotItems.length || 1"
                      class="wt-sub-hdr"
                    >
                      {{ sub.name }} - {{ sub.totalBobot }}%
                    </th>
                  </template>
                </template>
              </tr>
              <!-- Baris 4: Komponen (dengan persen bobot) -->
              <tr>
                <template
                  v-for="cpl in data.cplList"
                  :key="'w-k-cpl-' + cpl.name"
                >
                  <template
                    v-for="cpmk in cpl.cpmkList"
                    :key="'w-k-cpmk-' + cpl.name + '-' + cpmk.name"
                  >
                    <template
                      v-for="sub in cpmk.subCpmkList"
                      :key="
                        'w-k-sub-' + cpl.name + '-' + cpmk.name + '-' + sub.name
                      "
                    >
                      <th
                        v-if="sub.bobotItems.length === 0"
                        class="wt-komponen-hdr"
                      >
                        —
                      </th>
                      <th
                        v-for="b in sub.bobotItems"
                        :key="
                          'w-k-' +
                          cpl.name +
                          '-' +
                          cpmk.name +
                          '-' +
                          sub.name +
                          '-' +
                          (b.label || b.nama)
                        "
                        class="wt-komponen-hdr"
                      >
                        {{ b.label || b.nama }} - {{ b.bobot }}%
                      </th>
                    </template>
                  </template>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, idx) in wideTableRows"
                :key="'wt-' + idx"
                :class="row.allOk ? 'row-ok' : 'row-no'"
              >
                <td class="col-no">{{ idx + 1 }}</td>
                <td class="col-nim">{{ row.nim }}</td>
                <td class="col-nama" style="text-align: left; font-weight: 500">
                  {{ row.nama }}
                </td>
                <td
                  v-for="(val, ci2) in row.komponenValues"
                  :key="'wt-k-' + idx + '-' + ci2"
                  class="kmp-val"
                >
                  {{ val }}
                </td>
                <td class="pct-cell">
                  {{ row.total.toFixed(2) }}
                </td>
                <td>
                  <span class="ht-badge badge-sm badge-ok">{{
                    row.grade
                  }}</span>
                </td>
                <td
                  v-for="(c, ci3) in row.cpmkValues"
                  :key="'wt-cpmk-' + idx + '-' + ci3"
                  class="pct-cell"
                >
                  {{ c.toFixed(2) }}
                </td>
                <template
                  v-for="(cell, ci4) in row.cplCells"
                  :key="'wt-cpl-' + idx + '-' + ci4"
                >
                  <td class="pct-cell">{{ cell.pct.toFixed(2) }}</td>
                  <td>
                    <span
                      class="ht-badge"
                      :class="cell.ok ? 'badge-ok' : 'badge-no'"
                      >{{ cell.ok ? "TERCAPAI" : "TIDAK" }}</span
                    >
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── SECTION 2: Ringkasan Kelas ── -->
      <div class="ht-card">
        <div class="ht-card-hdr">
          <span class="ht-card-ico">🏫</span>
          <div>
            <h2 class="ht-card-title">Ringkasan Ketercapaian Kelas</h2>
            <p class="ht-card-sub">
              Jumlah mahasiswa yang tercapai dan tidak tercapai per CPL
            </p>
          </div>
        </div>

        <div class="ht-stats-grid">
          <div
            v-for="r in ringkasanKelas"
            :key="'stat-' + r.cplName"
            class="ht-stat-card"
            :class="r.kelasOk ? 'stat-ok' : 'stat-no'"
          >
            <div class="stat-cpl-label">{{ r.cplName }}</div>
            <div class="stat-big-pct">
              {{ r.rata.toFixed(1) }}<span class="stat-pct-sym">%</span>
            </div>
            <div class="stat-caption">Rata-rata Kelas</div>
            <div class="stat-mhs-info">
              <span class="stat-mhs-ok">{{ r.tercapai }} tercapai</span>
              <span class="stat-mhs-sep">/</span>
              <span class="stat-mhs-no">{{ r.tidak }} tidak</span>
            </div>
            <div class="stat-progress">
              <div
                class="stat-progress-bar"
                :style="`width:${r.pctTercapai}%`"
              ></div>
            </div>
            <div
              class="stat-kelas-badge"
              :class="r.kelasOk ? 'skbadge-ok' : 'skbadge-no'"
            >
              {{ r.kelasOk ? "✓ KELAS TERCAPAI" : "✗ KELAS TIDAK TERCAPAI" }}
            </div>
          </div>
        </div>

        <div class="ht-table-scroll" style="margin-top: 20px">
          <table class="ht-table">
            <thead>
              <tr>
                <th style="text-align: left">CPL</th>
                <th>Rata-rata Kelas</th>
                <th>Standar Minimum</th>
                <th>Mahasiswa Tercapai</th>
                <th>Mahasiswa Tidak Tercapai</th>
                <th>Status Kelas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in ringkasanKelas" :key="'ring-' + r.cplName">
                <td style="font-weight: 700; text-align: left">
                  {{ r.cplName }}
                </td>
                <td class="pct-cell">{{ r.rata.toFixed(2) }}%</td>
                <td>{{ STANDAR_MIN }}%</td>
                <td>
                  <span class="ht-count-badge count-ok"
                    >{{ r.tercapai }} mahasiswa ({{ r.pctTercapai }}%)</span
                  >
                </td>
                <td>
                  <span class="ht-count-badge count-no"
                    >{{ r.tidak }} mahasiswa ({{ r.pctTidak }}%)</span
                  >
                </td>
                <td>
                  <span
                    class="ht-badge"
                    :class="r.kelasOk ? 'badge-ok' : 'badge-no'"
                    >{{ r.kelasOk ? "TERCAPAI" : "TIDAK TERCAPAI" }}</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── SECTION 3: Radar Chart ── -->
      <div class="ht-card">
        <div class="ht-card-hdr">
          <span class="ht-card-ico">📡</span>
          <div>
            <h2 class="ht-card-title">Grafik Radar CPL</h2>
            <p class="ht-card-sub">
              Rata-rata kelas per CPL dibandingkan standar minimum 80%
            </p>
          </div>
        </div>
        <div class="ht-radar-wrap">
          <canvas ref="radarChartRef"></canvas>
        </div>
      </div>

      <!-- ── SECTION 4: Accordion per Mahasiswa ── -->
      <div class="ht-card">
        <div class="ht-card-hdr">
          <span class="ht-card-ico">🔍</span>
          <div>
            <h2 class="ht-card-title">Detail Sub-CPMK Per Mahasiswa</h2>
            <p class="ht-card-sub">
              Klik nama mahasiswa untuk melihat detail capaian setiap sub-CPMK
            </p>
          </div>
          <div
            style="margin-left: auto; display: flex; gap: 8px; flex-shrink: 0"
          >
            <button class="ht-ghost-btn" @click="expandAll">Buka Semua</button>
            <button class="ht-ghost-btn" @click="collapseAll">
              Tutup Semua
            </button>
          </div>
        </div>

        <div
          v-if="data.mahasiswa.length === 0"
          style="padding: 24px; color: #9ca3af; text-align: center"
        >
          Belum ada data mahasiswa.
        </div>

        <div v-else>
          <div
            v-for="(mhs, idx) in accordionData"
            :key="'acc-' + idx"
            class="ht-accordion"
            :class="{ open: openSet.has(idx) }"
          >
            <div class="ht-acc-hdr" @click="toggleAccordion(idx)">
              <span class="acc-number"> {{ idx + 1 }}</span>
              <div class="acc-identity">
                <span class="acc-nim">NIM: {{ mhs.nim }}</span>
                <span class="acc-nama">{{ mhs.nama }}</span>
              </div>
              <div class="acc-pills">
                <span
                  v-for="p in mhs.pills"
                  :key="'pill-' + p.cplName"
                  class="ht-badge badge-sm"
                  :class="p.ok ? 'badge-ok' : 'badge-no'"
                >
                  {{ p.cplName }}: {{ p.pct.toFixed(1) }}%
                </span>
              </div>
              <span
                class="acc-final-badge"
                :class="mhs.allOk ? 'badge-ok' : 'badge-no'"
              >
                {{ mhs.allOk ? "✓ Semua Tercapai" : "✗ Belum Semua Tercapai" }}
              </span>
              <span class="acc-chevron">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>

            <div class="ht-acc-body">
              <div class="ht-table-scroll" style="padding: 0 4px 16px">
                <table class="ht-table ht-detail-table">
                  <thead>
                    <tr>
                      <th style="text-align: left">Sub-CPMK / Komponen</th>
                      <th>Capaian (%)</th>
                      <th>Total Bobot</th>
                      <th>Capaian Bobot</th>
                      <th>Standar</th>
                      <th>Status</th>
                      <th>CPL / CPMK</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template
                      v-for="(sub, si) in mhs.subDetails"
                      :key="'sub-detail-' + idx + '-' + si"
                    >
                      <tr class="sub-detail-row">
                        <td class="sub-name-cell">
                          <strong>{{ sub.subName }}</strong>
                        </td>
                        <td class="pct-cell">
                          <strong>{{ sub.nilaiSub.toFixed(2) }}%</strong>
                        </td>
                        <td>{{ sub.totalBobot }}</td>
                        <td>—</td>
                        <td>{{ sub.standarSub }}%</td>
                        <td>
                          <span
                            class="ht-badge"
                            :class="sub.ok ? 'badge-ok' : 'badge-no'"
                            >{{ sub.ok ? "TERCAPAI" : "TIDAK TERCAPAI" }}</span
                          >
                        </td>
                        <td class="cpl-cpmk-cell">
                          {{ sub.cplName }} / {{ sub.cpmkName }}
                        </td>
                      </tr>
                      <tr
                        v-for="(k, ki) in sub.komponen"
                        :key="'kmp-' + idx + '-' + si + '-' + ki"
                        class="komponen-row"
                      >
                        <td class="kmp-indent">↳ {{ k.label }}</td>
                        <td class="kmp-val">{{ k.nilai.toFixed(0) }}</td>
                        <td class="kmp-bobot">{{ k.bobot }}</td>
                        <td class="kmp-cap">{{ k.capaian }}</td>
                        <td>—</td>
                        <td></td>
                        <td></td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /contentArea -->
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";
import { useMataKuliahStore } from "@/stores/mataKuliah";
import api from "@/api/axios";
import Chart from "chart.js/auto";

// ── ROUTE & STORE ──
const route = useRoute();
const mkStore = useMataKuliahStore();
const mkId = route.params.id || "1";
const mk = computed(() => mkStore.getById(mkId));
const STORAGE_KEY = `admin_tabel_${mkId}`; // fallback lama, cuma dipakai kalau API gagal
const STANDAR_MIN = 80;

// ── SIDEBAR NAV (custom — "Hasil CPL" item, auto-active via route match) ──
const navItems = [
  {
    to: "/admin/dashboard",
    label: "Halaman Utama",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  },
  {
    to: `/admin/hasil-cpl/${mkId}`,
    label: "Hasil CPL",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>`,
  },
];

// ── LOAD DATA dari API (bukan localStorage lagi) ──
const data = reactive({
  cplList: [],
  mahasiswa: [],
});
const loading = ref(true);

async function loadData() {
  loading.value = true;
  try {
    const [strukturRes, nilaiRes] = await Promise.all([
      api.get(`/penilaian/${mkId}/struktur`),
      api.get(`/penilaian/${mkId}/nilai`),
    ]);
    data.cplList = strukturRes.data?.struktur?.cplList || [];
    data.mahasiswa = nilaiRes.data || [];
  } catch (err) {
    console.error("Gagal memuat data Hasil CPL dari API:", err);
    // fallback: coba localStorage biar tidak total kosong kalau API bermasalah
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        data.cplList = parsed.cplList || [];
        data.mahasiswa = parsed.mahasiswa || [];
      }
    } catch (e) {
      // ignore
    }
  } finally {
    loading.value = false;
  }
}

// ── EMPTY STATE ──
const hasData = computed(
  () =>
    Array.isArray(data.cplList) &&
    data.cplList.length > 0 &&
    Array.isArray(data.mahasiswa) &&
    data.mahasiswa.length > 0,
);

/* ═══════════════════════════════════════════
   FORMULA KALKULASI CPL
   ─────────────────────────────────────────
   capaian_sub = Σ (nilai[key]/100 × bobot)   ← per komponen dalam satu sub
   persen_CPL  = Σ capaian_sub (semua sub di CPL)
                 ─────────────────────────────── × 100
                 Σ totalBobot_sub (semua sub di CPL)
═══════════════════════════════════════════ */

function nilaiKey(ci, mi, si, bi) {
  return `${ci}_${mi}_${si}_${bi}`;
}

function hitungCPLperMhs(mhs, cpl, ci) {
  let sumCapaian = 0;
  let sumBobot = 0;
  (cpl.cpmkList || []).forEach((cpmk, mi) => {
    (cpmk.subCpmkList || []).forEach((sub, si) => {
      let capaianSub = 0;
      (sub.bobotItems || []).forEach((b, bi) => {
        const key = `${ci}_${mi}_${si}_${bi}`;
        const val = parseFloat((mhs.nilai || {})[key]);
        capaianSub += (isNaN(val) ? 0 : val / 100) * b.bobot;
      });
      sumCapaian += capaianSub;
      sumBobot += sub.totalBobot || 0;
    });
  });
  return sumBobot > 0 ? (sumCapaian / sumBobot) * 100 : 0;
}

function hitungCPLrataKelas(cpl, ci) {
  let sumCapaian = 0;
  let sumBobot = 0;
  (cpl.cpmkList || []).forEach((cpmk, mi) => {
    (cpmk.subCpmkList || []).forEach((sub, si) => {
      let capaianSub = 0;
      (sub.bobotItems || []).forEach((b, bi) => {
        const key = `${ci}_${mi}_${si}_${bi}`;
        let total = 0,
          count = 0;
        (data.mahasiswa || []).forEach((m) => {
          const v = parseFloat((m.nilai || {})[key]);
          if (!isNaN(v)) {
            total += v;
            count++;
          }
        });
        const avg = count > 0 ? total / count : 0;
        capaianSub += (avg / 100) * b.bobot;
      });
      sumCapaian += capaianSub;
      sumBobot += sub.totalBobot || 0;
    });
  });
  return sumBobot > 0 ? (sumCapaian / sumBobot) * 100 : 0;
}

function hitungSubPerMhs(mhs, sub, ci, mi, si) {
  let capaianSub = 0;
  (sub.bobotItems || []).forEach((b, bi) => {
    const key = `${ci}_${mi}_${si}_${bi}`;
    const val = parseFloat((mhs.nilai || {})[key]);
    capaianSub += (isNaN(val) ? 0 : val / 100) * b.bobot;
  });
  return sub.totalBobot > 0 ? (capaianSub / sub.totalBobot) * 100 : 0;
}

// ── SECTION 1: Wide-table helpers (mengikuti format sheet 'Praktik') ──
function cplKomponenSpan(cpl) {
  return (cpl.cpmkList || []).reduce(
    (s, cpmk) => s + cpmkKomponenSpan(cpmk),
    0,
  );
}
function cpmkKomponenSpan(cpmk) {
  return (cpmk.subCpmkList || []).reduce(
    (s, sub) => s + (sub.bobotItems.length || 1),
    0,
  );
}

// GRADE scale, sama dengan formula IFS di Excel:
// >=86 A, >=83 A-, >=80 B+, >=77 B, >=74 B-, >=71 C+, >=67 C, >=64 D, else E
function gradeFromTotal(total) {
  if (total >= 86) return "A";
  if (total >= 83) return "A-";
  if (total >= 80) return "B+";
  if (total >= 77) return "B";
  if (total >= 74) return "B-";
  if (total >= 71) return "C+";
  if (total >= 67) return "C";
  if (total >= 64) return "D";
  return "E";
}

const wideTableRows = computed(() => {
  return data.mahasiswa.map((mhs, idx) => {
    const komponenValues = [];
    const cpmkValues = [];
    let total = 0;
    let allOk = true;

    const cplCells = data.cplList.map((cpl, ci) => {
      let sumCplRaw = 0;
      let sumCplPersen = 0;

      (cpl.cpmkList || []).forEach((cpmk, mi) => {
        let sumCpmkRaw = 0;

        (cpmk.subCpmkList || []).forEach((sub, si) => {
          if (sub.bobotItems.length === 0) {
            komponenValues.push("—");
          }
          sub.bobotItems.forEach((b, bi) => {
            const key = nilaiKey(ci, mi, si, bi);
            const raw = parseFloat((mhs.nilai || {})[key]);
            const n = isNaN(raw) ? 0 : raw;
            const kontribusi = (n / 100) * b.bobot;
            komponenValues.push(kontribusi.toFixed(2));
            sumCpmkRaw += kontribusi;
            total += kontribusi;
          });
        });

        // Nilai CPMK = jumlah semua komponen
        cpmkValues.push(sumCpmkRaw);

        // Untuk menghitung CPL
        sumCplRaw += sumCpmkRaw / cpmkPersenDesimal(cpmk);
      });

      const jumlahCpmk = cpl.cpmkList.length;
      const pctCpl = jumlahCpmk > 0 ? sumCplRaw / jumlahCpmk : 0;

      const ok = pctCpl >= STANDAR_MIN;
      if (!ok) allOk = false;
      return { cplName: cpl.name, pct: pctCpl, ok };
    });

    return {
      nim: mhs.nim,
      nama: mhs.nama || `Mahasiswa ${idx + 1}`,
      komponenValues,
      total,
      grade: gradeFromTotal(total),
      cpmkValues,
      cplCells,
      allOk,
    };
  });
});

function cpmkPersenDesimal(cpmk) {
  return (cpmk.persen || 0) / 100;
}

// ── SECTION 2: Ringkasan kelas per CPL ──
const ringkasanKelas = computed(() => {
  const total = data.mahasiswa.length;
  return data.cplList.map((cpl, ci) => {
    const rata = hitungCPLrataKelas(cpl, ci);
    let tercapai = 0;
    data.mahasiswa.forEach((mhs) => {
      if (hitungCPLperMhs(mhs, cpl, ci) >= STANDAR_MIN) tercapai++;
    });
    const tidak = total - tercapai;
    const pctTercapai = total > 0 ? Math.round((tercapai / total) * 100) : 0;
    const pctTidak = total > 0 ? Math.round((tidak / total) * 100) : 0;
    const kelasOk = rata >= STANDAR_MIN;
    return {
      cplName: cpl.name,
      rata,
      tercapai,
      tidak,
      pctTercapai,
      pctTidak,
      kelasOk,
    };
  });
});

// ── SECTION 4: Accordion detail per mahasiswa ──
const accordionData = computed(() => {
  return data.mahasiswa.map((mhs, rowIdx) => {
    let allOk = true;
    const pills = data.cplList.map((cpl, ci) => {
      const pct = hitungCPLperMhs(mhs, cpl, ci);
      const ok = pct >= STANDAR_MIN;
      if (!ok) allOk = false;
      return { cplName: cpl.name, pct, ok };
    });

    const subDetails = [];
    data.cplList.forEach((cpl, ci) => {
      (cpl.cpmkList || []).forEach((cpmk, mi) => {
        (cpmk.subCpmkList || []).forEach((sub, si) => {
          const nilaiSub = hitungSubPerMhs(mhs, sub, ci, mi, si);
          const standarSub = sub.standar || STANDAR_MIN;
          const ok = nilaiSub >= standarSub;

          const komponen = (sub.bobotItems || []).map((b, bi) => {
            const key = `${ci}_${mi}_${si}_${bi}`;
            const rawVal = parseFloat((mhs.nilai || {})[key]);
            const n = isNaN(rawVal) ? 0 : rawVal;
            const capaian = ((n / 100) * b.bobot).toFixed(2);
            return {
              label: b.label || b.nama,
              nilai: n,
              bobot: b.bobot,
              capaian,
            };
          });

          subDetails.push({
            subName: sub.name,
            cplName: cpl.name,
            cpmkName: cpmk.name,
            totalBobot: sub.totalBobot,
            nilaiSub,
            standarSub,
            ok,
            komponen,
          });
        });
      });
    });

    return {
      nim: mhs.nim,
      nama: mhs.nama || `Mahasiswa ${rowIdx + 1}`,
      pills,
      allOk,
      subDetails,
    };
  });
});

// ── ACCORDION OPEN STATE (mahasiswa pertama terbuka secara default) ──
const openSet = reactive(new Set([0]));
function toggleAccordion(idx) {
  if (openSet.has(idx)) openSet.delete(idx);
  else openSet.add(idx);
}
function expandAll() {
  accordionData.value.forEach((_, idx) => openSet.add(idx));
}
function collapseAll() {
  openSet.clear();
}

// ── PRINT ──
function cetak() {
  window.print();
}

// ── RADAR CHART ──
const radarChartRef = ref(null);
let radarChart = null;

function renderRadarChart() {
  const ctx = radarChartRef.value;
  if (!ctx) return;

  const labels = data.cplList.map((c) => c.name);
  const rataKelas = ringkasanKelas.value.map((r) => Number(r.rata.toFixed(2)));
  const standar = data.cplList.map(() => STANDAR_MIN);

  if (radarChart) radarChart.destroy();
  radarChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels,
      datasets: [
        {
          label: "Rata-rata Kelas",
          data: rataKelas,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,0.15)",
          borderWidth: 3,
          pointBackgroundColor: "#2563eb",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: `Standar Minimum (${STANDAR_MIN}%)`,
          data: standar,
          borderColor: "#f97316",
          backgroundColor: "rgba(249,115,22,0.06)",
          borderWidth: 2.5,
          borderDash: [7, 4],
          pointBackgroundColor: "#f97316",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            font: { size: 11, family: "Inter" },
            color: "#9ca3af",
            backdropColor: "transparent",
          },
          pointLabels: {
            font: { size: 13, weight: "600", family: "Inter" },
            color: "#1a1d2e",
          },
          grid: { color: "rgba(0,0,0,0.07)" },
          angleLines: { color: "rgba(0,0,0,0.07)" },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 24,
            font: { size: 13, family: "Inter" },
            usePointStyle: true,
            pointStyleWidth: 12,
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%`,
          },
        },
      },
    },
  });
}

watch(
  () => JSON.stringify({ cplList: data.cplList, mahasiswa: data.mahasiswa }),
  () => nextTick(() => renderRadarChart()),
  { deep: true },
);

onMounted(async () => {
  await loadData();
  nextTick(() => renderRadarChart());
});
</script>

<style scoped>
/* ── PAGE HEADER ── */
.page-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}
.back-btn:hover {
  background: #f3f4f6;
}
.back-btn svg {
  width: 16px;
  height: 16px;
}
.page-title-wrap h1 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1d2e;
}
.subtitle {
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 2px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 10px;
  border: none;
  font-family: "Inter", sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}
.btn-primary {
  background: #2563eb;
  color: #fff;
}
.btn-primary:hover {
  background: #1d4ed8;
}
.btn-secondary {
  background: #fff;
  color: #4b5563;
  border: 1px solid #e5e7eb !important;
}
.btn-secondary:hover {
  background: #f3f4f6;
}

/* ═══ CARD CONTAINER ═══ */
.ht-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  margin-bottom: 24px;
  overflow: hidden;
  border: 1px solid #f0f2f8;
}
.ht-card-hdr {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 22px 24px 18px;
  border-bottom: 1px solid #f0f2f8;
  flex-wrap: wrap;
}
.ht-card-ico {
  font-size: 1.5rem;
  line-height: 1;
  flex-shrink: 0;
  margin-top: 2px;
}
.ht-card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1d2e;
  margin-bottom: 3px;
}
.ht-card-sub {
  font-size: 0.78rem;
  color: #9ca3af;
  margin: 0;
  line-height: 1.5;
}

/* ═══ EMPTY STATE ═══ */
.ht-empty {
  text-align: center;
  padding: 72px 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  border: 1px solid #f0f2f8;
}
.ht-empty-icon {
  font-size: 3.5rem;
  margin-bottom: 20px;
  display: block;
}
.ht-empty h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a1d2e;
  margin-bottom: 10px;
}
.ht-empty p {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.7;
}

/* ═══ TABLE ═══ */
.ht-table-scroll {
  overflow-x: auto;
  padding: 0 0 8px;
}
.ht-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  min-width: 600px;
}

/* ═══ WIDE TABLE (Section 1 — mengikuti format sheet Excel 'Praktik') ═══
   Palet header baru: gradasi BIRU TUA → BIRU TEAL (pengganti merah/maroon).
   Level 1 (CPL)      : biru navy sangat tua    → teks putih
   Level 2 (CPMK)     : biru tua                → teks putih
   Level 3 (Sub-CPMK) : biru sedang             → teks putih
   Level 4 (Komponen) : biru keabu-abuan gelap  → teks putih
   Group summary (CPMK summary) : slate gelap   → teks putih
   Group summary (CPL summary)  : teal           → teks putih
*/
.ht-wide-table {
  min-width: 1400px;
  border-collapse: collapse;
}
.ht-wide-table th {
  vertical-align: middle;
  white-space: normal;
  word-break: break-word;
  border: 1px solid rgba(255, 255, 255, 0.25);
  line-height: 1.3;
}
.ht-wide-table td {
  border: 1px solid #e5e7eb;
}
.wt-cpl-hdr {
  background: #0c2d4a !important;
  color: #ffffff;
  font-size: 0.78rem;
}
.wt-cpmk-hdr {
  background: #134a73 !important;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 110px;
  padding: 8px 6px !important;
}
.wt-sub-hdr {
  background: #1d6fa5 !important;
  color: #ffffff;
  font-size: 0.66rem;
  font-weight: 600;
  min-width: 90px;
  padding: 8px 6px !important;
}
.wt-komponen-hdr {
  background: #1a1d2e !important;
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 500;
  white-space: normal;
  max-width: 90px;
  padding: 8px 6px !important;
}
.wt-cpmk-group-hdr {
  background: #374151 !important;
  color: #ffffff;
  font-size: 0.72rem;
}
.wt-cpl-group-hdr {
  background: #0e7490 !important;
  color: #ffffff;
  font-size: 0.72rem;
}
.wt-cpl-group-hdr small {
  font-weight: 400;
  opacity: 0.85;
  font-size: 0.62rem;
}
.ht-wide-table .col-no,
.ht-wide-table .col-nim,
.ht-wide-table .col-nama {
  border: 1px solid rgba(255, 255, 255, 0.25);
  white-space: nowrap;
}

/* header utama tabel ringkasan kelas & detail mahasiswa — gradasi biru navy → charcoal, teks putih */
.ht-table thead tr {
  background: linear-gradient(135deg, #134a73 0%, #1a1d2e 100%);
}
.ht-table thead th {
  color: #fff;
  font-weight: 600;
  font-size: 0.76rem;
  padding: 14px 14px;
  text-align: center;
  letter-spacing: 0.3px;
  white-space: nowrap;
  border: none;
}
.ht-table tbody tr {
  border-bottom: 1px solid #f0f2f8;
  transition: background 0.15s;
}
.ht-table tbody tr:last-child {
  border-bottom: none;
}
.ht-table tbody tr:hover {
  filter: brightness(0.97);
}
.ht-table tbody td {
  padding: 12px 14px;
  text-align: center;
  color: #1a1d2e;
  font-size: 0.85rem;
  height: 50px;
}

.ht-table tbody .row-ok {
  background: #f0fdf4;
}
.ht-table tbody .row-ok:hover {
  background: #e6faf0;
}
.ht-table tbody .row-no {
  background: #fff7f7;
}
.ht-table tbody .row-no:hover {
  background: #fee9e9;
}

.col-no {
  color: #0d0d0d !important;
  font-family: "poppins", monospace;
  font-size: 0.73rem !important;
  width: 48px;
}
.col-nim {
  font-family: "poppins", monospace;
  font-size: 0.8rem !important;
  color: hsl(0, 0%, 5%) !important;
  font-weight: 500 !important;
}
.col-nama {
  text-align: left !important;
  font-weight: 500;
}
.pct-cell {
  font-family: "poppins", monospace;
  font-weight: 600;
  color: #1a1d2e;
}

/* ═══ BADGES ═══ */
.ht-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: 0.3px;
}
.badge-ok {
  background: #dcfce7;
  color: #15803d;
}
.badge-no {
  background: #fee2e2;
  color: #b91c1c;
}
.badge-lg {
  padding: 6px 14px;
  font-size: 0.78rem;
}
.badge-sm {
  padding: 3px 8px;
  font-size: 0.68rem;
}

/* ═══ SECTION 2 — STAT CARDS ═══ */
.ht-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 16px;
  padding: 20px 24px 4px;
}
.ht-stat-card {
  border-radius: 14px;
  padding: 20px 18px;
  position: relative;
  overflow: hidden;
  border: 1.5px solid transparent;
}
.ht-stat-card.stat-ok {
  background: linear-gradient(135deg, #f0fdf4, #e6faf0);
  border-color: #86efac;
}
.ht-stat-card.stat-no {
  background: linear-gradient(135deg, #fff7f7, #fef2f2);
  border-color: #fca5a5;
}
.stat-cpl-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #6b7280;
  margin-bottom: 8px;
}
.stat-big-pct {
  font-size: 2.4rem;
  font-weight: 600;
  color: #1a1d2e;
  line-height: 1;
  font-family: "poppins", monospace;
  margin-bottom: 4px;
}
.stat-pct-sym {
  font-size: 1.2rem;
  font-weight: 600;
  color: #6b7280;
}
.stat-caption {
  font-size: 0.7rem;
  color: #9ca3af;
  margin-bottom: 14px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.stat-mhs-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 10px;
}
.stat-mhs-ok {
  color: #16a34a;
}
.stat-mhs-sep {
  color: #d1d5db;
}
.stat-mhs-no {
  color: #dc2626;
}
.stat-progress {
  height: 6px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 14px;
}
.stat-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #16a34a, #22c55e);
  border-radius: 99px;
  transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 4px;
}
.ht-stat-card.stat-no .stat-progress-bar {
  background: linear-gradient(90deg, #dc2626, #ef4444);
}
.stat-kelas-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.3px;
}
.skbadge-ok {
  background: #dcfce7;
  color: #15803d;
}
.skbadge-no {
  background: #fee2e2;
  color: #b91c1c;
}

.ht-count-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.74rem;
  font-weight: 600;
  white-space: nowrap;
}
.count-ok {
  background: #dcfce7;
  color: #166534;
}
.count-no {
  background: #fee2e2;
  color: #991b1b;
}

/* ═══ SECTION 3 — RADAR CHART ═══ */
.ht-radar-wrap {
  padding: 28px 24px 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ht-radar-wrap canvas {
  max-width: 540px !important;
  width: 100% !important;
  height: 420px !important;
}

/* ═══ SECTION 4 — ACCORDION ═══ */
.ht-accordion {
  border-bottom: 1px solid #f0f2f8;
}
.ht-accordion:last-child {
  border-bottom: none;
}
.ht-acc-hdr {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  background: #fff;
  transition: background 0.15s;
  flex-wrap: wrap;
  user-select: none;
}
.ht-acc-hdr:hover {
  background: #f7f8fd;
}

.acc-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #1a1d2e;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: "poppins", monospace;
}
.acc-identity {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 130px;
}
.acc-nim {
  font-family: "poppins", monospace;
  font-size: 0.73rem;
  color: #2563eb;
  font-weight: 500;
}
.acc-nama {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1d2e;
}
.acc-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
}
.acc-final-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}
.acc-final-badge.badge-ok {
  background: #dcfce7;
  color: #15803d;
}
.acc-final-badge.badge-no {
  background: #fee2e2;
  color: #b91c1c;
}

.acc-chevron {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  flex-shrink: 0;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: auto;
}
.acc-chevron svg {
  width: 16px;
  height: 16px;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.ht-accordion.open .acc-chevron {
  background: #dbeafe;
  color: #2563eb;
}
.ht-accordion.open .acc-chevron svg {
  transform: rotate(180deg);
}
.ht-wide-table thead .col-no,
.ht-wide-table thead .col-nim {
  color: #f7f8fd !important;
}
.ht-acc-body {
  display: none;
  background: #fafbfc;
  border-top: 1px solid #f0f2f8;
  animation: accOpen 0.2s ease-out;
}
.ht-accordion.open .ht-acc-body {
  display: block;
}
@keyframes accOpen {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ht-detail-table {
  min-width: 740px;
}
.ht-detail-table .sub-detail-row td {
  background: #f5f7fd;
  font-size: 0.83rem;
  font-weight: 500;
}
.ht-detail-table .sub-detail-row td:first-child {
  text-align: left;
  padding-left: 16px;
}
.ht-detail-table .komponen-row td {
  font-size: 0.78rem;
  color: #6b7280;
  background: #fff;
  padding-top: 9px;
  padding-bottom: 9px;
}

.kmp-indent {
  text-align: left !important;
  padding-left: 34px !important;
  color: #9ca3af;
  font-family: "poppins", monospace;
  font-size: 0.74rem !important;
}
.kmp-val,
.kmp-bobot,
.kmp-cap {
  font-family: "poppins", monospace;
  font-size: 0.78rem;
}
.sub-name-cell {
  text-align: left !important;
  padding-left: 16px !important;
}
.cpl-cpmk-cell {
  font-size: 0.71rem;
  color: #9ca3af;
  white-space: nowrap;
}

/* ═══ GHOST BUTTON ═══ */
.ht-ghost-btn {
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
  padding: 7px 14px;
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.ht-ghost-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #374151;
}

/* ═══ PRINT ═══ */
@media print {
  .back-btn,
  .ht-print-btn,
  .ht-ghost-btn {
    display: none !important;
  }
  .ht-card {
    box-shadow: none !important;
    border: 1px solid #e5e7eb !important;
    page-break-inside: avoid;
    margin-bottom: 16px !important;
  }
  .ht-accordion {
    page-break-inside: avoid;
  }
  .ht-accordion.open .ht-acc-body {
    display: block !important;
  }
  .ht-radar-wrap canvas {
    height: 300px !important;
  }
}

/* ═══ RESPONSIVE ═══ */
@media (max-width: 768px) {
  .ht-stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  .acc-pills {
    display: none;
  }
  .ht-radar-wrap canvas {
    height: 300px !important;
  }
}
@media (max-width: 480px) {
  .ht-stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>