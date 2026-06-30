<template>
  <AppLayout :navItems="navItems" userName="Admin">
    <!-- Page header -->
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
        <button class="btn-kelola" @click="toggleManage">
          {{ manageMode ? "Selesai" : "Edit Mode" }}
        </button>
        <button class="btn-tambah" @click="openModal(null)">
          + Tambah Mata Kuliah
        </button>
        <select class="semester-select" v-model="filterTipe">
          <option value="all">Semua Semester</option>
          <option value="ganjil">Semester Ganjil</option>
          <option value="genap">Semester Genap</option>
        </select>
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
            title="Grid"
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
            title="List"
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

    <!-- Cards -->
    <div
      :class="viewMode === 'grid' ? 'cards-grid' : 'cards-list'"
      v-if="filteredList.length > 0"
    >
      <RouterLink
        v-for="mk in filteredList"
        :key="mk.id"
        :to="`/admin/penilaian/${mk.id}`"
        class="mk-card"
        :class="{ 'manage-active': manageMode }"
      >
        <!-- ICON BARU -->
        <div
          class="mk-icon-new"
          :style="`background:${getMKIcon(mk.name).light}`"
        >
          <!-- MOBILE -->
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
          <!-- CODE / KOMPUTER -->
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
          <!-- WIFI / JARINGAN -->
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
          <!-- ROBOT / IOT -->
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
          <!-- DESAIN -->
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
          <!-- CAMERA / MEDIA -->
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
          <!-- DATABASE -->
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
          <!-- SECURITY -->
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
          <!-- AI -->
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
          <!-- MATH -->
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
          <!-- SISTEM OPERASI -->
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

          <!-- GAME -->
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

          <!-- DEFAULT BOOK -->
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
            <span class="badge-semester">
              {{ mk.tipe === "ganjil" ? "Semester Ganjil" : "Semester Genap" }}
            </span>
            {{ mk.tahun || "-" }}
          </div>
        </div>
        <div v-if="manageMode" class="mk-actions" @click.prevent>
          <button class="edit-btn" @click.prevent="openModal(mk)" title="Edit">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 20h9" />
              <path
                d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
              />
            </svg>
          </button>
          <button
            class="delete-btn"
            @click.prevent="hapusMK(mk.id)"
            title="Hapus"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </RouterLink>
    </div>

    <!-- Empty state -->
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

    <!-- MODAL TAMBAH / EDIT MK -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ editTarget ? "Edit Mata Kuliah" : "Tambah Mata Kuliah" }}</h2>
        <input type="text" v-model="form.name" placeholder="Nama Mata Kuliah" />
        <select v-model="form.tipe">
          <option value="ganjil">Semester Ganjil</option>
          <option value="genap">Semester Genap</option>
        </select>
        <select v-model="form.tahun">
          <option value="2023/2024">2023/2024</option>
          <option value="2024/2025">2024/2025</option>
          <option value="2025/2026">2025/2026</option>
          <option value="2026/2027">2026/2027</option>
        </select>
        <div class="modal-actions">
          <button @click="closeModal">Batal</button>
          <button class="btn-save" @click="simpanMK">Simpan</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import AppLayout from "@/layouts/AppLayout.vue";
import { useMataKuliahStore } from "@/stores/mataKuliah";

const mkStore = useMataKuliahStore();

const viewMode = ref("grid");
const manageMode = ref(false);
const filterTipe = ref("all");
const searchQuery = ref("");
const showModal = ref(false);
const editTarget = ref(null);

const form = reactive({ name: "", tipe: "ganjil", tahun: "2025/2026" });

const navItems = [
  {
    to: "/admin/dashboard",
    label: "Halaman Utama",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>`,
  },
  {
    to: "/mata-kuliah",
    label: "Mata Kuliah",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>`,
    exact: true,
  },
];

// ── ICON BERDASARKAN NAMA MATA KULIAH ──
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

const filteredList = computed(() =>
  mkStore.filtered(filterTipe.value, searchQuery.value),
);

// Load mata kuliah dari API saat halaman dibuka
onMounted(async () => {
  await mkStore.fetch();
});

function toggleManage() {
  manageMode.value = !manageMode.value;
}

function openModal(mk) {
  editTarget.value = mk;
  if (mk) {
    form.name = mk.name;
    form.tipe = mk.tipe;
    form.tahun = mk.tahun;
  } else {
    form.name = "";
    form.tipe = "ganjil";
    form.tahun = "2025/2026";
  }
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editTarget.value = null;
}

async function simpanMK() {
  if (!form.name.trim()) {
    alert("Nama mata kuliah kosong");
    return;
  }
  try {
    if (editTarget.value) {
      await mkStore.edit(editTarget.value.id, { ...form });
    } else {
      await mkStore.tambah({ ...form });
    }
    closeModal();
  } catch (e) {
    alert("Gagal menyimpan: " + e.message);
  }
}

async function hapusMK(id) {
  if (confirm("Yakin ingin menghapus mata kuliah ini?")) {
    await mkStore.hapus(id);
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
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
  flex-wrap: wrap;
}

.btn-kelola {
  height: 42px;
  padding: 0 16px;
  border: none;
  border-radius: 10px;
  background: #374151;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-family: "Inter", sans-serif;
}
.btn-tambah {
  height: 42px;
  padding: 0 16px;
  border: none;
  border-radius: 10px;
  background: #9b1530;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-family: "Inter", sans-serif;
}
.semester-select {
  height: 42px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #1f2937;
  font-family: "Inter", sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  min-width: 180px;
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

/* Cards */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.cards-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mk-card {
  background: #fff;
  border-radius: 18px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.25s;
  border: 1.5px solid transparent;
  text-decoration: none;
}
.mk-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  border-color: #e5e7eb;
}

/* ICON BARU */
.mk-icon-new {
  width: 64px;
  height: 64px;
  border-radius: 18px;
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
  width: 30px;
  height: 30px;
  stroke-width: 2.2;
}

.mk-info {
  flex: 1;
  min-width: 0;
}
.mk-name {
  font-size: 0.92rem;
  font-weight: 700;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mk-semester {
  font-size: 0.76rem;
  color: #9ca3af;
  margin-top: 4px;
}

.mk-actions {
  display: flex;
  gap: 6px;
}
.edit-btn,
.delete-btn {
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.edit-btn {
  background: #ede9fe;
  color: #7c3aed;
}
.edit-btn:hover {
  background: #ddd6fe;
  transform: scale(1.1);
}
.edit-btn svg {
  width: 14px;
  height: 14px;
}
.delete-btn {
  background: #fee2e2;
  color: #dc2626;
}
.delete-btn:hover {
  background: #fecaca;
  transform: scale(1.1);
}
.delete-btn svg {
  width: 14px;
  height: 14px;
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

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal {
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.modal h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 4px;
}
.modal input,
.modal select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  font-size: 0.9rem;
}
.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.modal-actions button {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: pointer;
  font-family: "Inter", sans-serif;
}
.btn-save {
  background: #9b1530;
  color: white;
  border-color: #9b1530 !important;
}
</style>
