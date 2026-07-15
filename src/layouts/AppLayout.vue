<template>
  <!-- SIDEBAR -->
  <aside class="sidebar" v-if="!hideSidebar">
    <div class="sidebar-brand">
      <div class="logo-box">
        <img src="/assets/Logo PNUP.png" alt="Logo PNUP" @error="e => e.target.style.display='none'" />
      </div>
      <div class="sidebar-brand-text">
        <h2>PNUP</h2>
        <p>Politeknik Negeri<br />Ujung Pandang</p>
      </div>
    </div>

    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :exact="item.exact"
        class="nav-item"
        active-class="active"
      >
        <span v-html="item.icon"></span>
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>

  <!-- TOPBAR -->
  <header class="topbar" :class="{ 'full-width': hideSidebar }">
    <div class="topbar-user" @click="handleLogout">
      <div class="user-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <span class="user-name">{{ userName }}</span>
      <span class="topbar-chevron">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </span>
    </div>
  </header>

  <!-- MAIN SLOT -->
  <main class="main" :class="{ 'full-width': hideSidebar }">
    <slot />
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  navItems: { type: Array, default: () => [] },
  userName: { type: String, default: 'Pengguna' },
  hideSidebar: { type: Boolean, default: false },
})

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  if (confirm('Keluar dari akun?')) {
    authStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
:root {
  --maroon-dark: #7b1020;
  --sidebar-w: 220px;
  --header-h: 64px;
  --transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
}

.sidebar {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: 220px;
  background: linear-gradient(180deg, #7b1020 0%, #5a0514 100%);
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow: hidden;
}
.sidebar::before {
  content: '';
  position: absolute;
  top: -60px; right: -60px;
  width: 200px; height: 200px;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
  pointer-events: none;
}
.sidebar-brand {
  position: relative; z-index: 2;
  display: flex; align-items: center; gap: 12px;
  padding: 20px 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.12);
}
.logo-box {
  width: 44px; height: 44px;
  border-radius: 10px;
  background: rgba(255,255,255,0.14);
  border: 1px solid rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; overflow: hidden;
}
.logo-box img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
.sidebar-brand-text { color: #fff; }
.sidebar-brand-text h2 { font-size: 1rem; font-weight: 700; }
.sidebar-brand-text p { font-size: 0.6rem; opacity: 0.65; text-transform: uppercase; letter-spacing: 0.05em; line-height: 1.4; }

.sidebar-nav {
  position: relative; z-index: 2;
  flex: 1;
  padding: 16px 12px;
  display: flex; flex-direction: column; gap: 4px;
}
.nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 14px;
  border-radius: 12px;
  color: rgba(255,255,255,0.72);
  font-size: 0.875rem; font-weight: 500;
  text-decoration: none;
  transition: all 0.25s;
  position: relative;
}
.nav-item:hover { background: rgba(255,255,255,0.1); color: #fff; }
.nav-item.active {
  background: rgba(255,255,255,0.18);
  color: #fff; font-weight: 600;
}
.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0; top: 50%;
  transform: translateY(-50%);
  width: 3px; height: 60%;
  background: #fff;
  border-radius: 0 3px 3px 0;
}

.topbar {
  position: fixed;
  top: 0; left: 220px; right: 0;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex; align-items: center; justify-content: flex-end;
  padding: 0 28px;
  z-index: 50; gap: 14px;
}
.topbar-user {
  display: flex; align-items: center; gap: 10px;
  cursor: pointer; padding: 6px 10px;
  border-radius: 10px;
  transition: all 0.25s;
}
.topbar-user:hover { background: #f3f4f6; }
.user-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex; align-items: center; justify-content: center;
  color: #4b5563;
}
.user-avatar svg { width: 20px; height: 20px; }
.user-name { font-size: 0.875rem; font-weight: 600; color: #1f2937; }
.topbar-chevron { color: #9ca3af; }
.topbar-chevron svg { width: 16px; height: 16px; }

.main {
  margin-left: 220px;
  margin-top: 64px;
  padding: 28px;
  min-height: calc(100vh - 64px);
  background: #f3f4f6;
}

.topbar.full-width {
  left: 0;
}
.main.full-width {
  margin-left: 0;
}

@media (max-width: 768px) {
  .sidebar { transform: translateX(-220px); }
  .topbar { left: 0; }
  .main { margin-left: 0; }
}
</style>