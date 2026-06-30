<template>
  <AppLayout :navItems="navItems" userName="Mahasiswa">

    <!-- PAGE HEADER -->
    <div class="page-header">
      <RouterLink to="/mahasiswa/dashboard" class="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Kembali
      </RouterLink>
      <div class="page-title-wrap">
        <h1>{{ mk?.name || 'Detail Mata Kuliah' }}</h1>
        <div class="subtitle">{{ mk?.semester || 'Semester Aktif' }}<template v-if="mk?.tahun"> • {{ mk.tahun }}</template></div>
      </div>
    </div>


    <!-- ── EMPTY STATE (belum ada data admin) ── -->
    <div v-if="!hasData" class="ht-empty">
      <div class="ht-empty-icon">📭</div>
      <h3>Data Belum Tersedia</h3>
      <p>Data penilaian untuk mata kuliah ini belum diisi oleh dosen.<br>Silakan kembali nanti.</p>
      <RouterLink to="/mahasiswa/dashboard" class="btn btn-primary"
        style="display:inline-flex;align-items:center;gap:8px;text-decoration:none;margin-top:20px;padding:10px 20px">
        ← Kembali ke Daftar MK
      </RouterLink>
    </div>

    <!-- ── CONTENT (mahasiswa dipilih) ── -->
    <template v-else-if="selectedMhs">

      <!-- Identity card -->
      <div class="identity-card">
        <div class="id-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="id-info">
          <div class="mk-name-display">{{ selectedMhs.nama || '(Tanpa Nama)' }}</div>
          <div class="mk-meta">
            <span v-if="selectedMhs.nim"><strong>NIM:</strong> {{ selectedMhs.nim }}</span>
            <span><strong>Mata Kuliah:</strong> {{ mk?.name }}</span>
            <span><strong>Semester:</strong> {{ mk?.semester }}</span>
          </div>
        </div>
        <div class="id-stats">
          <div class="stat-pill">
            <div class="num">{{ data.cplList.length }}</div>
            <div class="lbl">CPL</div>
          </div>
          <div class="stat-pill">
            <div class="num">{{ cplTercapaiCount }}</div>
            <div class="lbl">Tercapai</div>
          </div>
          <div class="stat-pill">
            <div class="num">{{ data.cplList.length - cplTercapaiCount }}</div>
            <div class="lbl">Belum</div>
          </div>
        </div>
      </div>

      <!-- ── TABEL NILAI (read-only) ── -->
      <div class="wrapper">
        <div class="table-header">
          <h2>Tabel Nilai</h2>
          <span class="badge">{{ data.cplList.length }} CPL</span>
          <span class="badge">{{ totalCPMK }} CPMK</span>
          <span class="badge">{{ totalSubCPMK }} Sub-CPMK</span>
        </div>

        <div class="table-scroll">
          <table>
            <thead>
              <!-- ROW 1: CPL -->
              <tr class="meta-row">
                <td colspan="3" class="label-cell">CPL</td>
                <template v-for="(cpl, ci) in data.cplList" :key="'cpl-hd-'+ci">
                  <td :colspan="cplTotalSpan(ci)" style="border-left:4px solid #000;text-align:center;">{{ cpl.name }}</td>
                </template>
              </tr>

              <!-- ROW 2: CPMK -->
              <tr class="meta-row">
                <td colspan="3" class="label-cell">CPMK</td>
                <template v-for="(cpl, ci) in data.cplList" :key="'cpmk-hd-'+ci">
                  <template v-if="isCplEmpty(ci)">
                    <td class="empty-cell">—</td>
                  </template>
                  <template v-else>
                    <template v-for="(cpmk, mi) in cpl.cpmkList" :key="'cpmk-hd-'+ci+'-'+mi">
                      <td :colspan="cpmkTotalSpan(ci,mi)"
                          :style="`border-left:${mi===0?'4px':'3px'} solid ${mi===0?'#000':'rgba(0,0,0,0.7)'};text-align:center;`">
                        {{ cpmk.name }} ({{ cpmk.persen }}%)
                      </td>
                    </template>
                  </template>
                </template>
              </tr>

              <!-- ROW 3: Sub-CPMK -->
              <tr class="subcpmk-row">
                <td colspan="3" class="row-label">Sub-CPMK</td>
                <template v-for="(cpl, ci) in data.cplList" :key="'sub-hd-'+ci">
                  <template v-if="isCplEmpty(ci)">
                    <td class="empty-cell">—</td>
                  </template>
                  <template v-else>
                    <template v-for="(cpmk, mi) in cpl.cpmkList" :key="'sub-hd-cpmk-'+ci+'-'+mi">
                      <template v-for="(sub, si) in cpmk.subCpmkList" :key="'sub-hd-sub-'+ci+'-'+mi+'-'+si">
                        <td v-if="sub.bobotItems.length > 0"
                            :colspan="sub.bobotItems.length"
                            :style="`${subBorderStyle(mi,si)}background:${subColor(ci,mi,si).bg};color:${subColor(ci,mi,si).text};font-weight:700;`">
                          {{ sub.name }}
                        </td>
                      </template>
                      <td v-if="isCpmkEmpty(ci,mi)" class="empty-cell">—</td>
                    </template>
                  </template>
                </template>
              </tr>

              <!-- ROW 4: Total Bobot -->
              <tr class="bobot-row">
                <td colspan="3" class="row-label">Total Bobot</td>
                <template v-for="(cpl, ci) in data.cplList" :key="'tb-hd-'+ci">
                  <template v-if="isCplEmpty(ci)"><td class="empty-cell">—</td></template>
                  <template v-else>
                    <template v-for="(cpmk, mi) in cpl.cpmkList" :key="'tb-cpmk-'+ci+'-'+mi">
                      <template v-for="(sub, si) in cpmk.subCpmkList" :key="'tb-sub-'+ci+'-'+mi+'-'+si">
                        <td v-if="sub.bobotItems.length > 0"
                            :colspan="sub.bobotItems.length"
                            class="big-bobot"
                            :style="subBorderStyle(mi,si)">{{ sub.totalBobot }}</td>
                      </template>
                      <td v-if="isCpmkEmpty(ci,mi)" class="empty-cell">—</td>
                    </template>
                  </template>
                </template>
              </tr>

              <!-- ROW 5: Bobot per kolom -->
              <tr class="bobot-row">
                <td colspan="3" class="row-label">Bobot</td>
                <template v-for="(cpl, ci) in data.cplList" :key="'b-hd-'+ci">
                  <template v-if="isCplEmpty(ci)"><td class="empty-cell">—</td></template>
                  <template v-else>
                    <template v-for="(cpmk, mi) in cpl.cpmkList" :key="'b-cpmk-'+ci+'-'+mi">
                      <template v-for="(sub, si) in cpmk.subCpmkList" :key="'b-sub-'+ci+'-'+mi+'-'+si">
                        <template v-for="(b, bi) in sub.bobotItems" :key="'b-item-'+ci+'-'+mi+'-'+si+'-'+bi">
                          <td :style="colBorderStyle(ci,mi,si,bi)">{{ b.bobot }}</td>
                        </template>
                      </template>
                      <td v-if="isCpmkEmpty(ci,mi)" class="empty-cell">—</td>
                    </template>
                  </template>
                </template>
              </tr>

              <!-- ROW 6: Column headers -->
              <tr class="col-header">
                <th class="left" style="width:50px">No.</th>
                <th>NIM</th>
                <th class="left">Nama</th>
                <template v-for="(cpl, ci) in data.cplList" :key="'ch-'+ci">
                  <template v-if="isCplEmpty(ci)">
                    <th style="font-style:italic;font-weight:400;opacity:0.5;">—</th>
                  </template>
                  <template v-else>
                    <template v-for="(cpmk, mi) in cpl.cpmkList" :key="'ch-cpmk-'+ci+'-'+mi">
                      <template v-for="(sub, si) in cpmk.subCpmkList" :key="'ch-sub-'+ci+'-'+mi+'-'+si">
                        <template v-for="(b, bi) in sub.bobotItems" :key="'ch-b-'+ci+'-'+mi+'-'+si+'-'+bi">
                          <th :style="colBorderStyle(ci,mi,si,bi)">{{ b.label || b.nama }}</th>
                        </template>
                      </template>
                      <th v-if="isCpmkEmpty(ci,mi)" style="font-style:italic;font-weight:400;opacity:0.5;">—</th>
                    </template>
                  </template>
                </template>
              </tr>
            </thead>
            <tbody>
              <!-- BARIS NILAI MAHASISWA TERPILIH (highlighted) -->
              <tr class="selected-row">
                <td class="no">★</td>
                <td class="nim">{{ selectedMhs.nim || '—' }}</td>
                <td class="nama nama-selected">{{ selectedMhs.nama || '(Tanpa Nama)' }}</td>
                <template v-for="(cpl, ci) in data.cplList" :key="'dr-cpl-'+ci">
                  <template v-if="isCplEmpty(ci)"><td class="empty-cell">—</td></template>
                  <template v-else>
                    <template v-for="(cpmk, mi) in cpl.cpmkList" :key="'dr-cpmk-'+ci+'-'+mi">
                      <template v-for="(sub, si) in cpmk.subCpmkList" :key="'dr-sub-'+ci+'-'+mi+'-'+si">
                        <template v-for="(b, bi) in sub.bobotItems" :key="'dr-b-'+ci+'-'+mi+'-'+si+'-'+bi">
                          <td :style="colBorderStyle(ci,mi,si,bi)" class="nilai-cell">
                            <span :class="getNilaiClass(ci,mi,si,bi)">
                              {{ getNilaiMhs(ci, mi, si, bi) }}
                            </span>
                          </td>
                        </template>
                      </template>
                      <td v-if="isCpmkEmpty(ci,mi)" class="empty-cell">—</td>
                    </template>
                  </template>
                </template>
              </tr>

              <!-- RATA-RATA KELAS ROW -->
              <tr class="avg-row">
                <td colspan="3" class="label">Rata-rata Kelas</td>
                <template v-for="(cpl, ci) in data.cplList" :key="'avg-cpl-'+ci">
                  <template v-if="isCplEmpty(ci)"><td>—</td></template>
                  <template v-else>
                    <template v-for="(cpmk, mi) in cpl.cpmkList" :key="'avg-cpmk-'+ci+'-'+mi">
                      <template v-for="(sub, si) in cpmk.subCpmkList" :key="'avg-sub-'+ci+'-'+mi+'-'+si">
                        <template v-for="(b, bi) in sub.bobotItems" :key="'avg-b-'+ci+'-'+mi+'-'+si+'-'+bi">
                          <td :style="colBorderStyle(ci,mi,si,bi)">{{ avgNilai(ci,mi,si,bi) }}</td>
                        </template>
                      </template>
                      <td v-if="isCpmkEmpty(ci,mi)">—</td>
                    </template>
                  </template>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── CPL ACHIEVEMENT SECTION ── -->
      <div class="analysis-card">
        <div class="analysis-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
          </svg>
          Capaian CPL & CPMK
        </div>
        <p class="analysis-sub">Hasil pencapaian Anda berdasarkan nilai yang telah diinputkan</p>

        <div class="cpl-grid">
          <template v-for="(cpl, ci) in data.cplList" :key="'cpl-card-'+ci">
            <div class="cpl-card" :class="hitungCPLperMhs(selectedMhs, cpl, ci) >= STANDAR_MIN ? 'cpl-ok' : 'cpl-no'">
              <div class="cpl-card-top">
                <span class="cpl-name">{{ cpl.name }}</span>
                <span class="cpl-badge" :class="hitungCPLperMhs(selectedMhs, cpl, ci) >= STANDAR_MIN ? 'badge-ok' : 'badge-no'">
                  {{ hitungCPLperMhs(selectedMhs, cpl, ci) >= STANDAR_MIN ? '✓ TERCAPAI' : '✗ BELUM' }}
                </span>
              </div>
              <div class="cpl-score">{{ hitungCPLperMhs(selectedMhs, cpl, ci).toFixed(1) }}<span class="cpl-pct">%</span></div>
              <div class="cpl-bar-wrap">
                <div class="cpl-bar">
                  <div class="cpl-bar-fill"
                    :style="`width:${Math.min(hitungCPLperMhs(selectedMhs, cpl, ci), 100)}%;background:${hitungCPLperMhs(selectedMhs, cpl, ci) >= STANDAR_MIN ? '#16a34a' : '#dc2626'}`">
                  </div>
                  <div class="cpl-bar-standar" :style="`left:${STANDAR_MIN}%`"></div>
                </div>
                <div class="cpl-bar-labels">
                  <span>0</span>
                  <span>Standar {{ STANDAR_MIN }}%</span>
                  <span>100</span>
                </div>
              </div>

              <!-- CPMK sub-items -->
              <div class="cpmk-list">
                <div v-for="(cpmk, mi) in cpl.cpmkList" :key="'cpmk-detail-'+ci+'-'+mi" class="cpmk-item">
                  <div class="cpmk-item-row">
                    <span class="cpmk-label">{{ cpmk.name }}</span>
                    <span class="cpmk-persen">{{ cpmk.persen }}%</span>
                    <span class="cpmk-score">{{ hitungCPMKperMhs(selectedMhs, cpmk, ci, mi).toFixed(1) }}%</span>
                  </div>
                  <div class="cpmk-bar">
                    <div class="cpmk-bar-fill"
                      :style="`width:${Math.min(hitungCPMKperMhs(selectedMhs, cpmk, ci, mi), 100)}%;`">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- ── DETAIL SUB-CPMK ── -->
      <div class="analysis-card">
        <div class="analysis-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Detail Pencapaian Sub-CPMK
        </div>
        <div class="modern-table-wrap">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Sub-CPMK</th>
                <th>CPL / CPMK</th>
                <th>Nilai Anda (%)</th>
                <th>Total Bobot</th>
                <th>Standar</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(cpl, ci) in data.cplList" :key="'sub-detail-cpl-'+ci">
                <template v-for="(cpmk, mi) in cpl.cpmkList" :key="'sub-detail-cpmk-'+ci+'-'+mi">
                  <tr v-for="(sub, si) in cpmk.subCpmkList" :key="'sub-detail-'+ci+'-'+mi+'-'+si">
                    <td>{{ sub.name }}</td>
                    <td style="color:#9ca3af;font-size:0.78rem">{{ cpl.name }} / {{ cpmk.name }}</td>
                    <td>
                      <strong>{{ hitungSubPerMhs(selectedMhs, sub, ci, mi, si).toFixed(2) }}%</strong>
                    </td>
                    <td>{{ sub.totalBobot }}</td>
                    <td>{{ sub.standar || STANDAR_MIN }}%</td>
                    <td>
                      <span class="ht-badge"
                        :class="hitungSubPerMhs(selectedMhs, sub, ci, mi, si) >= (sub.standar || STANDAR_MIN) ? 'badge-ok' : 'badge-no'">
                        {{ hitungSubPerMhs(selectedMhs, sub, ci, mi, si) >= (sub.standar || STANDAR_MIN) ? 'TERCAPAI' : 'BELUM' }}
                      </span>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
      </div>

    </template>

    <!-- ── PROMPT pilih mahasiswa ── -->
<div v-else-if="!selectedMhs" class="ht-empty">
  <div class="ht-empty-icon">📭</div>
  <h3>Nilai Belum Tersedia</h3>
  <p>Nilai untuk akun Anda belum diinputkan oleh dosen.<br>Silakan kembali nanti.</p>
  <RouterLink to="/mahasiswa/dashboard" class="btn btn-primary"
    style="display:inline-flex;align-items:center;gap:8px;text-decoration:none;margin-top:20px;padding:10px 20px">
    ← Kembali
  </RouterLink>
</div>

  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { useMataKuliahStore } from '@/stores/mataKuliah'
import api from '@/api/axios'

// ── CONSTANTS ──
const STANDAR_MIN = 80
const SUB_COLORS = [
  { bg: '#fff4ef', accent: '#f97316', text: '#f97316' },
  { bg: '#fffbe8', accent: '#eab308', text: '#92680a' },
  { bg: '#f0fdf4', accent: '#16a34a', text: '#166534' },
  { bg: '#eff6ff', accent: '#3b82f6', text: '#1e40af' },
  { bg: '#fdf4ff', accent: '#a855f7', text: '#7e22ce' },
  { bg: '#fff1f2', accent: '#f43f5e', text: '#be123c' },
]

// ── ROUTE & STORE ──
const route = useRoute()
const mkStore = useMataKuliahStore()
const mkId = route.params.id || '1'
const mk = computed(() => mkStore.getById(mkId))

// ── STORAGE KEY — sama dengan admin, sehingga data terhubung ──
const STORAGE_KEY = `admin_tabel_${mkId}`

// ── SIDEBAR NAV ──
const navItems = [
  {
    to: '/mahasiswa/dashboard',
    label: 'Halaman Utama',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  },
  {
    to: '/mahasiswa/penilaian',
    label: "Raport Semester",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="3" y1="15" x2="21" y2="15"/>
      <line x1="9" y1="9" x2="9" y2="21"/>
    </svg>`,
exact: true,
  },
]

// ── LOAD DATA ──
const data = reactive({ cplList: [], mahasiswa: [] })

// ── STATE: pilih mahasiswa ──
const selectedNim = ref('')

// ── LOAD DATA dari localStorage (struktur CPL) + API (nilai mahasiswa) ──
onMounted(async () => {
  // Load struktur CPL dari API
  try {
    const [strukturRes, nilaiRes] = await Promise.all([
      api.get(`/penilaian/${mkId}/struktur`),
      api.get(`/penilaian/${mkId}/nilai`),
    ])

    if (strukturRes.data.struktur) {
      data.cplList = strukturRes.data.struktur.cplList || []
    }

    if (nilaiRes.data.length > 0) {
      data.mahasiswa = nilaiRes.data
    }
  } catch (e) {
    // Fallback localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        data.cplList = parsed.cplList || []
        data.mahasiswa = parsed.mahasiswa || []
      }
    } catch (e2) {}
  }

  // Auto pilih NIM mahasiswa yang sedang login
  const authData = JSON.parse(localStorage.getItem('auth') || '{}')
  const nim = authData?.user?.nim

  if (nim) {
    selectedNim.value = nim
  } else {
    // Fallback: ambil dari currentUser
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (currentUser?.nim) {
      selectedNim.value = currentUser.nim
    }
  }
})

const selectedMhs = computed(() => {
  if (!selectedNim.value) return null
  return data.mahasiswa.find(
    m => String(m.nim).trim() === String(selectedNim.value).trim()
  ) || null
})

const hasData = computed(() =>
  Array.isArray(data.cplList) && data.cplList.length > 0 &&
  selectedMhs.value !== null
)

// ── COMPUTED: badges ──
const totalCPMK = computed(() =>
  data.cplList.reduce((s, cpl) => s + cpl.cpmkList.length, 0)
)
const totalSubCPMK = computed(() =>
  data.cplList.reduce((s, cpl) =>
    cpl.cpmkList.reduce((ss, cpmk) => ss + cpmk.subCpmkList.length, s), 0)
)

const cplTercapaiCount = computed(() => {
  if (!selectedMhs.value) return 0
  return data.cplList.filter((cpl, ci) =>
    hitungCPLperMhs(selectedMhs.value, cpl, ci) >= STANDAR_MIN
  ).length
})

// ── NILAI KEY ──
function nilaiKey(ci, mi, si, bi) { return `${ci}_${mi}_${si}_${bi}` }

// ── NILAI MAHASISWA TERPILIH ──
function getNilaiMhs(ci, mi, si, bi) {
  if (!selectedMhs.value) return '—'
  const v = parseFloat((selectedMhs.value.nilai || {})[nilaiKey(ci, mi, si, bi)])
  return isNaN(v) ? '—' : v
}

function getNilaiClass(ci, mi, si, bi) {
  if (!selectedMhs.value) return ''
  const v = parseFloat((selectedMhs.value.nilai || {})[nilaiKey(ci, mi, si, bi)])
  if (isNaN(v)) return 'nilai-empty'
  if (v >= 80) return 'nilai-good'
  if (v >= 60) return 'nilai-mid'
  return 'nilai-low'
}

// ── RATA-RATA KELAS ──
function avgKolom(ci, mi, si, bi) {
  const key = nilaiKey(ci, mi, si, bi)
  let sum = 0, count = 0
  data.mahasiswa.forEach(mhs => {
    const v = parseFloat((mhs.nilai || {})[key])
    if (!isNaN(v)) { sum += v; count++ }
  })
  return count > 0 ? sum / count : 0
}

function avgNilai(ci, mi, si, bi) {
  const avg = avgKolom(ci, mi, si, bi)
  return avg > 0 ? avg.toFixed(1) : '—'
}

// ── FORMULA CPL PER MAHASISWA ──
function hitungSubPerMhs(mhs, sub, ci, mi, si) {
  let capaianSub = 0
  ;(sub.bobotItems || []).forEach((b, bi) => {
    const key = nilaiKey(ci, mi, si, bi)
    const val = parseFloat((mhs.nilai || {})[key])
    capaianSub += (isNaN(val) ? 0 : val / 100) * b.bobot
  })
  return sub.totalBobot > 0 ? (capaianSub / sub.totalBobot) * 100 : 0
}

function hitungCPMKperMhs(mhs, cpmk, ci, mi) {
  const subs = cpmk.subCpmkList || []
  if (!subs.length) return 0
  const total = subs.reduce((s, sub, si) => s + hitungSubPerMhs(mhs, sub, ci, mi, si), 0)
  return total / subs.length
}

function hitungCPLperMhs(mhs, cpl, ci) {
  let sumCapaian = 0, sumBobot = 0
  ;(cpl.cpmkList || []).forEach((cpmk, mi) => {
    ;(cpmk.subCpmkList || []).forEach((sub, si) => {
      let capaianSub = 0
      ;(sub.bobotItems || []).forEach((b, bi) => {
        const key = nilaiKey(ci, mi, si, bi)
        const val = parseFloat((mhs.nilai || {})[key])
        capaianSub += (isNaN(val) ? 0 : val / 100) * b.bobot
      })
      sumCapaian += capaianSub
      sumBobot += (sub.totalBobot || 0)
    })
  })
  return sumBobot > 0 ? (sumCapaian / sumBobot) * 100 : 0
}

// ── SPAN HELPERS ──
function cplRealSpan(ci) {
  let s = 0
  data.cplList[ci].cpmkList.forEach(cpmk =>
    cpmk.subCpmkList.forEach(sub => { s += sub.bobotItems.length })
  )
  return s
}

function isCplEmpty(ci) {
  return data.cplList[ci].cpmkList.length === 0
}

function isCpmkEmpty(ci, mi) {
  const cpmk = data.cplList[ci].cpmkList[mi]
  return cpmk.subCpmkList.length === 0 ||
    cpmk.subCpmkList.every(s => s.bobotItems.length === 0)
}

function cplTotalSpan(ci) {
  const real = cplRealSpan(ci)
  if (real > 0) return real
  return Math.max(1, data.cplList[ci].cpmkList.length)
}

function cpmkTotalSpan(ci, mi) {
  let s = 0
  data.cplList[ci].cpmkList[mi].subCpmkList.forEach(sub => { s += sub.bobotItems.length })
  return s > 0 ? s : 1
}

// ── SUB COLOR ──
function globalSubIndex(ci, mi, si) {
  let idx = 0
  for (let c = 0; c < ci; c++) {
    data.cplList[c].cpmkList.forEach(cpmk => { idx += cpmk.subCpmkList.length })
  }
  for (let m = 0; m < mi; m++) { idx += data.cplList[ci].cpmkList[m].subCpmkList.length }
  idx += si
  return idx
}

function subColor(ci, mi, si) {
  return SUB_COLORS[globalSubIndex(ci, mi, si) % SUB_COLORS.length]
}

function subBorderStyle(mi, si) {
  if (mi === 0 && si === 0) return 'border-left:4px solid #000;'
  if (si === 0) return 'border-left:3px solid rgba(0,0,0,0.7);'
  return 'border-left:2px solid rgba(0,0,0,0.7);'
}

function colBorderStyle(ci, mi, si, bi) {
  if (mi === 0 && si === 0 && bi === 0) return 'border-left:4px solid #000;'
  if (si === 0 && bi === 0) return 'border-left:3px solid rgba(0,0,0,0.7);'
  if (bi === 0) return 'border-left:2px solid rgba(0,0,0,0.7);'
  return ''
}
</script>

<style scoped>
/* ── PAGE HEADER ── */
.page-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; flex-wrap: wrap; }
.back-btn {
  display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 10px;
  background: #fff; border: 1px solid #e5e7eb; color: #4b5563; font-size: 0.8rem;
  font-weight: 500; text-decoration: none; transition: all 0.2s;
}
.back-btn:hover { background: #f3f4f6; }
.back-btn svg { width: 16px; height: 16px; }
.page-title-wrap h1 { font-size: 1.25rem; font-weight: 700; color: #1a1d2e; }
.subtitle { font-size: 0.8rem; color: #9ca3af; margin-top: 2px; }

/* ── NIM SELECT ── */
.nim-select-card {
  background: #fff; border-radius: 14px; padding: 16px 20px;
  margin-bottom: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  border: 1.5px solid #e8eaf6;
}
.nim-select-inner { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.nim-select-label {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.82rem; font-weight: 700; color: #1a1d2e; white-space: nowrap;
}
.nim-select-label svg { width: 18px; height: 18px; color: #9b1530; }
.nim-dropdown {
  flex: 1; min-width: 240px; padding: 9px 14px;
  border: 1.5px solid #e5e7eb; border-radius: 10px;
  font-family: 'Inter', sans-serif; font-size: 0.85rem; color: #1f2937;
  background: #f9fafb; outline: none; cursor: pointer; transition: all 0.2s;
}
.nim-dropdown:focus { border-color: #9b1530; background: #fff; box-shadow: 0 0 0 3px rgba(155,21,48,0.08); }

/* ── EMPTY STATE ── */
.ht-empty { text-align: center; padding: 72px 24px; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
.ht-empty-icon { font-size: 3.5rem; margin-bottom: 20px; display: block; }
.ht-empty h3 { font-size: 1.15rem; font-weight: 700; color: #1a1d2e; margin-bottom: 10px; }
.ht-empty p { color: #6b7280; font-size: 0.875rem; line-height: 1.7; }
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 10px; border: none; font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; }
.btn-primary { background: #9b1530; color: #fff; text-decoration: none; }

/* ── CHOOSE PROMPT ── */
.choose-prompt {
  background: #fff; border-radius: 14px; padding: 48px 24px; text-align: center;
  box-shadow: 0 1px 6px rgba(0,0,0,0.06); color: #9ca3af;
}
.choose-icon { font-size: 2.5rem; margin-bottom: 12px; }
.choose-prompt p { font-size: 0.875rem; }

/* ── IDENTITY CARD ── */
.identity-card {
  background: linear-gradient(135deg, #7b1020 0%, #c1294a 100%);
  border-radius: 16px; padding: 20px 24px; margin-bottom: 20px; color: white;
  display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
}
.id-icon {
  width: 52px; height: 52px; border-radius: 14px;
  background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.25);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.id-icon svg { width: 26px; height: 26px; }
.id-info { flex: 1; min-width: 200px; }
.mk-name-display { font-size: 1.2rem; font-weight: 800; }
.mk-meta { display: flex; gap: 16px; margin-top: 6px; flex-wrap: wrap; }
.mk-meta span { font-size: 0.78rem; opacity: 0.85; }
.mk-meta span strong { opacity: 1; }
.id-stats { display: flex; gap: 12px; }
.stat-pill {
  background: rgba(255,255,255,0.18); border-radius: 10px;
  padding: 8px 14px; text-align: center; min-width: 70px;
}
.stat-pill .num { font-size: 1.4rem; font-weight: 800; }
.stat-pill .lbl { font-size: 0.65rem; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.05em; }

/* ── WRAPPER TABLE ── */
.wrapper { background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); margin-bottom: 20px; }
.table-header { padding: 20px 24px 14px; border-bottom: 1px solid #e2e6ef; display: flex; align-items: center; gap: 10px; }
.table-header h2 { font-size: 1rem; font-weight: 700; color: #1a1d2e; }
.badge { font-size: 0.68rem; font-weight: 600; background: #e8eaf6; color: #5c6bc0; border-radius: 6px; padding: 2px 8px; text-transform: uppercase; }
.table-scroll { overflow-x: auto; }

table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.meta-row td { background: #f7f8fc; color: #6b7280; font-weight: 600; font-size: 0.75rem; text-align: center; padding: 9px 14px; border-bottom: 1px solid #e2e6ef; text-transform: uppercase; }
.meta-row td.label-cell { text-align: left; color: #9ca3af; font-weight: 500; }

.subcpmk-row td { padding: 10px 14px; text-align: center; font-weight: 700; font-size: 0.8rem; border-bottom: 1px solid #e2e6ef; }
.row-label { background: #f7f8fc; text-align: left !important; color: #9ca3af; font-weight: 500; padding: 10px 14px; }

.bobot-row td { background: #f7f8fc; text-align: center; font-weight: 600; font-size: 0.78rem; padding: 8px 14px; border-bottom: 1px solid #e2e6ef; color: #6b7280; }
.big-bobot { font-size: 1rem; font-weight: 700; color: #1a1d2e; }

.col-header th { background: #1a1d2e; color: #fff; font-weight: 600; font-size: 0.75rem; padding: 12px 14px; text-align: center; text-transform: uppercase; white-space: nowrap; }
.col-header th.left { text-align: left; }

tbody tr { border-bottom: 1px solid #e2e6ef; }
tbody td { padding: 12px 14px; text-align: center; color: #1a1d2e; font-size: 0.875rem; height: 48px; }
tbody td.no { color: #9ca3af; font-family: 'DM Mono', monospace; font-size: 0.78rem; }
tbody td.nim { font-family: 'DM Mono', monospace; font-size: 0.82rem; color: #5c6bc0; font-weight: 500; }
tbody td.nama { text-align: left; font-weight: 500; }
.nama-selected { font-weight: 700; color: #9b1530; }

/* Selected row highlight */
.selected-row { background: #fdf5f7; border-left: 4px solid #9b1530; }
.selected-row td { padding: 14px; }

/* Nilai cell colors */
.nilai-cell { font-family: 'DM Mono', monospace; font-weight: 700; }
.nilai-good { color: #16a34a; }
.nilai-mid { color: #d97706; }
.nilai-low { color: #dc2626; }
.nilai-empty { color: #9ca3af; font-weight: 400; }

/* Rata-rata row */
.avg-row td { background: #f0f4ff; font-weight: 600; color: #4338ca; font-size: 0.82rem; }
.avg-row td.label { text-align: left; text-transform: uppercase; letter-spacing: 0.5px; }

.empty-cell { background: #f7f8fc; color: #9ca3af; text-align: center; font-style: italic; font-size: 0.75rem; }

/* ── ANALYSIS CARD ── */
.analysis-card {
  background: #fff; border-radius: 18px; padding: 22px 24px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.05); border: 1px solid #ececec;
  margin-bottom: 20px;
}
.analysis-title {
  display: flex; align-items: center; gap: 10px;
  font-size: 1rem; font-weight: 700; color: #1a1d2e; margin-bottom: 4px;
}
.analysis-title svg { width: 20px; height: 20px; color: #9b1530; }
.analysis-sub { font-size: 0.78rem; color: #9ca3af; margin-bottom: 20px; }

/* ── CPL GRID ── */
.cpl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.cpl-card {
  border-radius: 14px; padding: 18px; border: 1.5px solid transparent;
  transition: all 0.2s;
}
.cpl-ok { background: #f0fdf4; border-color: #86efac; }
.cpl-no { background: #fff7f7; border-color: #fca5a5; }
.cpl-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.cpl-name { font-size: 0.82rem; font-weight: 700; color: #1a1d2e; }
.cpl-badge { font-size: 0.65rem; font-weight: 700; padding: 3px 8px; border-radius: 20px; letter-spacing: 0.3px; }
.badge-ok { background: #dcfce7; color: #15803d; }
.badge-no { background: #fee2e2; color: #b91c1c; }
.cpl-score { font-size: 2rem; font-weight: 800; color: #1a1d2e; font-family: 'DM Mono', monospace; line-height: 1; margin-bottom: 10px; }
.cpl-pct { font-size: 1rem; color: #9ca3af; }
.cpl-bar-wrap { margin-bottom: 14px; }
.cpl-bar { height: 8px; background: rgba(0,0,0,0.08); border-radius: 99px; overflow: visible; position: relative; }
.cpl-bar-fill { height: 100%; border-radius: 99px; transition: width 0.7s; min-width: 4px; }
.cpl-bar-standar {
  position: absolute; top: -3px; width: 2px; height: 14px;
  background: #f97316; border-radius: 2px;
}
.cpl-bar-labels { display: flex; justify-content: space-between; font-size: 0.62rem; color: #9ca3af; margin-top: 4px; }

/* CPMK items inside CPL card */
.cpmk-list { display: flex; flex-direction: column; gap: 8px; border-top: 1px solid rgba(0,0,0,0.07); padding-top: 12px; }
.cpmk-item-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.cpmk-label { font-size: 0.74rem; font-weight: 600; color: #4b5563; flex: 1; }
.cpmk-persen { font-size: 0.68rem; color: #9ca3af; }
.cpmk-score { font-size: 0.78rem; font-weight: 700; color: #1a1d2e; font-family: 'DM Mono', monospace; }
.cpmk-bar { height: 5px; background: rgba(0,0,0,0.07); border-radius: 99px; overflow: hidden; }
.cpmk-bar-fill { height: 100%; background: linear-gradient(90deg, #9b1530, #c1294a); border-radius: 99px; transition: width 0.6s; }

/* ── MODERN TABLE ── */
.modern-table-wrap { overflow-x: auto; }
.modern-table { width: 100%; border-collapse: collapse; min-width: 600px; }
.modern-table thead th {
  background: linear-gradient(135deg, #7b1020, #1a1d2e);
  color: white; font-size: 0.83rem; font-weight: 600; padding: 14px; text-align: center;
}
.modern-table thead th:first-child { border-top-left-radius: 12px; }
.modern-table thead th:last-child { border-top-right-radius: 12px; }
.modern-table tbody td { padding: 13px; border-bottom: 1px solid #eee; text-align: center; font-size: 0.84rem; color: #374151; }
.modern-table tbody tr:hover { background: #faf7f8; }
.modern-table tbody td:first-child { font-weight: 600; background: #fafafa; }
.ht-badge { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; }
</style>