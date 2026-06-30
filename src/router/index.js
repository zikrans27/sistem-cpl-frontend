import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', redirect: '/login' },

  {
    path: '/login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guestOnly: true },
  },

  {
    path: '/register',
    component: () => import('@/views/auth/Register.vue'),
    meta: { guestOnly: true },
  },

  // ADMIN
  {
    path: '/admin/dashboard',
    component: () => import('@/views/admin/DashboardAdmin.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },

  {
    path: '/admin/penilaian/:id',
    component: () => import('@/views/admin/TabelPenilaianAdmin.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },

  {
    path: '/admin/hasil-cpl/:id',
    component: () => import('@/views/admin/HasilPengukuranCPL.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },

  // MAHASISWA
  {
    path: '/mahasiswa/dashboard',
    component: () => import('@/views/mahasiswa/DashboardMahasiswa.vue'),
    meta: { requiresAuth: true, role: 'mahasiswa' },
  },

  {
    path: '/mahasiswa/penilaian/:id',
    component: () => import('@/views/mahasiswa/TabelPenilaianMahasiswa.vue'),
    meta: { requiresAuth: true, role: 'mahasiswa' },
  },

  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.guestOnly && auth.isLoggedIn) {
    return next(
      auth.role === 'admin'
        ? '/admin/dashboard'
        : '/mahasiswa/dashboard'
    )
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next('/login')
  }

  if (to.meta.role && auth.role !== to.meta.role) {
    return next(
      auth.role === 'admin'
        ? '/admin/dashboard'
        : '/mahasiswa/dashboard'
    )
  }

  next()
})

export default router