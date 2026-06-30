<template>
  <AppLayout :navItems="navItems" :userName="currentUser?.nama || 'Mahasiswa'">
    <div class="page-header">
      <div class="page-title">
        <div class="page-title-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path
              d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
            />
          </svg>
        </div>
        <h1>Mata Kuliah</h1>
      </div>

      <div class="toolbar">
        <div class="search-box">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Cari mata kuliah..."
          />
        </div>
        <div class="view-toggle">
          <button
            class="view-btn"
            :class="{ active: viewMode === 'grid' }"
            @click="viewMode = 'grid'"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </button>
          <button
            class="view-btn"
            :class="{ active: viewMode === 'list' }"
            @click="viewMode = 'list'"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Greeting banner -->
    <div class="greeting-banner" v-if="currentUser">
      <div class="greeting-left">
        <div class="greeting-avatar">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div>
          <div class="greeting-name">{{ currentUser.nama }}</div>
          <div class="greeting-nim">NIM: {{ currentUser.nim }}</div>
        </div>
      </div>
      <div class="greeting-stats">
        <div class="gstat">
          <div class="gstat-num">{{ filteredList.length }}</div>
          <div class="gstat-lbl">Mata Kuliah</div>
        </div>
        <div class="gstat gstat-ok">
          <div class="gstat-num">{{ tercapaiCount }}</div>
          <div class="gstat-lbl">CPL Tercapai</div>
        </div>
        <div class="gstat gstat-no" v-if="belumCount > 0">
          <div class="gstat-num">{{ belumCount }}</div>
          <div class="gstat-lbl">CPL Belum</div>
        </div>
      </div>
    </div>

    <!-- Cards -->
    <div
      :class="viewMode === 'grid' ? 'cards-grid' : 'cards-list'"
      v-if="filteredList.length > 0"
    >
      <RouterLink
        v-for="mk in filteredList"
        :key="mk.id"
        :to="`/mahasiswa/penilaian/${mk.id}`"
        class="mk-card"
      >
        <div
          class="mk-icon-new"
          :style="`background:${getMKIcon(mk.name).light}`"
        >
          <svg
            v-if="getMKIcon(mk.name).icon === 'mobile'"
            :style="`color:${getMKIcon(mk.name).bg}`"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
          <svg
            v-else-if="getMKIcon(mk.name).icon === 'code'"
            :style="`color:${getMKIcon(mk.name).bg}`"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <svg
            v-else-if="getMKIcon(mk.name).icon === 'wifi'"
            :style="`color:${getMKIcon(mk.name).bg}`"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
          <svg
            v-else-if="getMKIcon(mk.name).icon === 'robot'"
            :style="`color:${getMKIcon(mk.name).bg}`"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <line x1="8" y1="15" x2="8" y2="15" />
            <line x1="16" y1="15" x2="16" y2="15" />
          </svg>
          <svg
            v-else-if="getMKIcon(mk.name).icon === 'design'"
            :style="`color:${getMKIcon(mk.name).bg}`"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
          <svg
            v-else-if="getMKIcon(mk.name).icon === 'camera'"
            :style="`color:${getMKIcon(mk.name).bg}`"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
            />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <svg
            v-else-if="getMKIcon(mk.name).icon === 'database'"
            :style="`color:${getMKIcon(mk.name).bg}`"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
          <svg
            v-else-if="getMKIcon(mk.name).icon === 'security'"
            :style="`color:${getMKIcon(mk.name).bg}`"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <svg
            v-else-if="getMKIcon(mk.name).icon === 'ai'"
            :style="`color:${getMKIcon(mk.name).bg}`"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            />
          </svg>
          <svg
            v-else-if="getMKIcon(mk.name).icon === 'math'"
            :style="`color:${getMKIcon(mk.name).bg}`"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="4" y1="9" x2="20" y2="9" />
            <line x1="4" y1="15" x2="20" y2="15" />
            <line x1="10" y1="3" x2="8" y2="21" />
            <line x1="16" y1="3" x2="14" y2="21" />
          </svg>
          <svg
            v-else-if="getMKIcon(mk.name).icon === 'os'"
            :style="`color:${getMKIcon(mk.name).bg}`"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <svg
            v-else-if="getMKIcon(mk.name).icon === 'game'"
            :style="`color:${getMKIcon(mk.name).bg}`"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="6" y1="12" x2="10" y2="12" />
            <line x1="8" y1="10" x2="8" y2="14" />
            <line x1="15" y1="13" x2="15.01" y2="13" />
            <line x1="18" y1="11" x2="18.01" y2="11" />
            <rect x="2" y="6" width="20" height="12" rx="2" />
          </svg>
          <svg
            v-else
            :style="`color:${getMKIcon(mk.name).bg}`"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path
              d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
            />
          </svg>
        </div>

        <div class="mk-info">
          <div class="mk-name">{{ mk.name }}</div>
          <div class="mk-semester">
            {{ mk.semester
            }}<template v-if="mk.tahun"> • {{ mk.tahun }}</template>
          </div>
          <!-- CPL chips berdasarkan NIM yang login -->
          <div class="mk-cpl-row" v-if="getMKCPLForUser(mk.id).length > 0">
            <span
              v-for="(cpl, i) in getMKCPLForUser(mk.id).slice(0, 3)"
              :key="'cpl-' + i"
              class="cpl-chip"
              :class="cpl.ok ? 'chip-ok' : 'chip-no'"
              >{{ cpl.name }}: {{ cpl.score.toFixed(0) }}%</span
            >
            <span
              v-if="getMKCPLForUser(mk.id).length > 3"
              class="cpl-chip chip-more"
            >
              +{{ getMKCPLForUser(mk.id).length - 3 }}
            </span>
          </div>
          <div class="not-enrolled" v-else>
            <span>Belum terdaftar / nilai belum diinput</span>
          </div>
        </div>
        <div class="mk-arrow">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </RouterLink>
    </div>

    <div v-else class="empty-state">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <p>Tidak ada mata kuliah yang ditemukan.</p>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";
import { useMataKuliahStore } from "@/stores/mataKuliah";
import api from '@/api/axios';

const nilaiSaya = ref([])

const loadNilai = async () => {
  try {
    const res = await api.get('/nilai-saya')
    nilaiSaya.value = res.data

    console.log('Data Nilai:', res.data)
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  loadNilai()
})

const mkStore = useMataKuliahStore();
const router = useRouter();
const viewMode = ref("grid");

function getMKIcon(name) {
  const n = name.toLowerCase();
  if (n.includes("mobile") || n.includes("android") || n.includes("ios"))
    return { icon: "mobile", bg: "#6366f1", light: "#ede9fe" };
  if (
    n.includes("web") ||
    n.includes("pemrograman") ||
    n.includes("algoritma") ||
    n.includes("struktur data")
  )
    return { icon: "code", bg: "#3b82f6", light: "#dbeafe" };
  if (n.includes("jaringan") || n.includes("network") || n.includes("wifi"))
    return { icon: "wifi", bg: "#06b6d4", light: "#cffafe" };
  if (
    n.includes("robot") ||
    n.includes("iot") ||
    n.includes("embedded") ||
    n.includes("mikro")
  )
    return { icon: "robot", bg: "#f97316", light: "#ffedd5" };
  if (
    n.includes("desain") ||
    n.includes("ui") ||
    n.includes("ux") ||
    n.includes("grafis")
  )
    return { icon: "design", bg: "#ec4899", light: "#fce7f3" };
  if (
    n.includes("kamera") ||
    n.includes("media") ||
    n.includes("multimedia") ||
    n.includes("video")
  )
    return { icon: "camera", bg: "#84cc16", light: "#ecfccb" };
  if (n.includes("basis data") || n.includes("database") || n.includes("sql"))
    return { icon: "database", bg: "#8b5cf6", light: "#ede9fe" };
  if (n.includes("keamanan") || n.includes("security") || n.includes("cyber"))
    return { icon: "security", bg: "#ef4444", light: "#fee2e2" };
  if (
    n.includes("kecerdasan") ||
    n.includes("ai") ||
    n.includes("machine") ||
    n.includes("deep")
  )
    return { icon: "ai", bg: "#10b981", light: "#d1fae5" };
  if (
    n.includes("matematika") ||
    n.includes("statistik") ||
    n.includes("kalkulus") ||
    n.includes("diskrit")
  )
    return { icon: "math", bg: "#f59e0b", light: "#fef3c7" };
  if (
    n.includes("sistem operasi") ||
    n.includes("os") ||
    n.includes("komputer")
  )
    return { icon: "os", bg: "#64748b", light: "#f1f5f9" };
  if (
    n.includes("game") ||
    n.includes("gaming") ||
    n.includes("interaktif") ||
    n.includes("simulasi")
  )
    return { icon: "game", bg: "#a855f7", light: "#f3e8ff" };
  return { icon: "book", bg: "#9b1530", light: "#ffe4e6" };
}

const searchQuery = ref("");

// ── AMBIL currentUser dari localStorage ──
// Format yang disimpan saat login: { nim, nama, role: 'mahasiswa' }
const currentUser = computed(() => {
  try {
    const raw = localStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
});

// Guard: redirect ke login jika bukan mahasiswa
if (!currentUser.value || currentUser.value.role !== "mahasiswa") {
  router.replace("/login");
}

// ── SIDEBAR NAV ──
const navItems = [
  {
    to: "/mahasiswa/dashboard",
    label: "Halaman Utama",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>`,
    exact: true,
  },
  {
    to: "/mahasiswa/penilaian",
    label: "Raport Semester",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="3" y1="15" x2="21" y2="15"/>
      <line x1="9" y1="9" x2="9" y2="21"/>
    </svg>`,
    exact: true,
  },
];

const filteredList = computed(() => mkStore.filtered("all", searchQuery.value));

// ── CONSTANTS ──
const STANDAR_MIN = 80;

function nilaiKey(ci, mi, si, bi) {
  return `${ci}_${mi}_${si}_${bi}`;
}

function getMKData(mkId) {
  try {
    const raw = localStorage.getItem(`admin_tabel_${mkId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Hitung nilai CPL untuk satu mahasiswa (object mhs)
function hitungCPLperMhs(mhs, cpl, ci) {
  let sumCapaian = 0,
    sumBobot = 0;
  (cpl.cpmkList || []).forEach((cpmk, mi) => {
    (cpmk.subCpmkList || []).forEach((sub, si) => {
      let capaianSub = 0;
      (sub.bobotItems || []).forEach((b, bi) => {
        const val = parseFloat((mhs.nilai || {})[nilaiKey(ci, mi, si, bi)]);
        capaianSub += (isNaN(val) ? 0 : val / 100) * b.bobot;
      });
      sumCapaian += capaianSub;
      sumBobot += sub.totalBobot || 0;
    });
  });
  return sumBobot > 0 ? (sumCapaian / sumBobot) * 100 : 0;
}

// Cari baris mahasiswa berdasarkan NIM login, lalu hitung CPL-nya
function getMKCPLForUser(mkId) {
  const nim = currentUser.value?.nim;
  if (!nim) return [];
  const mkData = getMKData(mkId);
  if (!mkData?.cplList?.length || !mkData?.mahasiswa?.length) return [];

  // Cocokkan NIM (string comparison, trim spasi)
  const mhs = mkData.mahasiswa.find(
    (m) => String(m.nim).trim() === String(nim).trim(),
  );
  if (!mhs) return [];

  return mkData.cplList.map((cpl, ci) => {
    const score = hitungCPLperMhs(mhs, cpl, ci);
    return { name: cpl.name, score, ok: score >= STANDAR_MIN };
  });
}

// ── Stats summary (hanya nilai milik user yang login) ──
const totalCPLCount = computed(() =>
  filteredList.value.reduce((t, mk) => t + getMKCPLForUser(mk.id).length, 0),
);
const tercapaiCount = computed(() => {
  let n = 0;
  filteredList.value.forEach((mk) =>
    getMKCPLForUser(mk.id).forEach((c) => {
      if (c.ok) n++;
    }),
  );
  return n;
});
const belumCount = computed(() => totalCPLCount.value - tercapaiCount.value);
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 14px;
}
.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.page-title-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffb3c1, #ff8fa3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-title-icon svg {
  width: 22px;
  height: 22px;
  color: #fff;
}
.page-title h1 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #1f2937;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
}
.search-box {
  position: relative;
}
.search-box input {
  padding: 9px 14px 9px 38px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-family: "Inter", sans-serif;
  font-size: 0.85rem;
  color: #1f2937;
  background: #f9fafb;
  outline: none;
  width: 220px;
}
.search-box input:focus {
  border-color: #9b1530;
  background: #fff;
}
.search-box svg {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #9ca3af;
  pointer-events: none;
}
.view-toggle {
  display: flex;
  background: #f3f4f6;
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
}
.view-btn {
  width: 34px;
  height: 34px;
  border: none;
  background: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  cursor: pointer;
}
.view-btn svg {
  width: 18px;
  height: 18px;
}
.view-btn.active {
  background: #fff;
  color: #9b1530;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

/* ── Greeting banner ── */
.greeting-banner {
  background: linear-gradient(135deg, #7b1020 0%, #c1294a 100%);
  border-radius: 16px;
  padding: 18px 24px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}
.greeting-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.greeting-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.greeting-avatar svg {
  width: 24px;
  height: 24px;
  color: #fff;
}
.greeting-name {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}
.greeting-nim {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2px;
  font-family: "DM Mono", monospace;
}
.greeting-stats {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.gstat {
  text-align: center;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  min-width: 70px;
}
.gstat-ok {
  background: rgba(22, 163, 74, 0.35);
}
.gstat-no {
  background: rgba(220, 38, 38, 0.35);
}
.gstat-num {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  font-family: "DM Mono", monospace;
  line-height: 1;
}
.gstat-lbl {
  font-size: 0.62rem;
  color: rgba(255, 255, 255, 0.75);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-top: 3px;
}

/* ── Cards ── */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
.cards-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.mk-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: all 0.25s;
  border: 1.5px solid transparent;
  text-decoration: none;
}
.mk-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #e5e7eb;
}
.mk-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.mk-icon svg {
  width: 28px;
  height: 28px;
  color: #fff;
}
.mk-info {
  flex: 1;
  min-width: 0;
}
.mk-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mk-semester {
  font-size: 0.78rem;
  color: #9ca3af;
  margin-top: 3px;
}
.mk-cpl-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
}
.cpl-chip {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
}
.chip-ok {
  background: #dcfce7;
  color: #15803d;
}
.chip-no {
  background: #fee2e2;
  color: #b91c1c;
}
.chip-more {
  background: #f3f4f6;
  color: #6b7280;
}
.not-enrolled {
  margin-top: 7px;
}
.not-enrolled span {
  font-size: 0.68rem;
  color: #9ca3af;
  font-style: italic;
}
.mk-arrow {
  color: #d1d5db;
  flex-shrink: 0;
}
.mk-arrow svg {
  width: 18px;
  height: 18px;
}
.mk-card:hover .mk-arrow {
  color: #9b1530;
}

/* ICON BARU — ganti .mk-icon lama */
.mk-icon-new {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}
.mk-card:hover .mk-icon-new {
  transform: scale(1.08) rotate(-3deg);
}
.mk-icon-new svg {
  width: 26px;
  height: 26px;
  stroke-width: 2.2;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9ca3af;
  gap: 12px;
  text-align: center;
}
.empty-state svg {
  width: 48px;
  height: 48px;
  opacity: 0.4;
}
</style>
