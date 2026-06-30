<template>

  <!-- Background -->

  <div class="bg-wrapper">

    <img class="bg-image" src="/assets/campus.jpg" alt="Kampus PNUP" />

    <div class="bg-dots"></div>

  </div>



  <!-- Main -->

  <main class="page-wrapper" role="main">

    <div class="login-card">



      <!-- LEFT PANEL -->

      <div class="panel-left">

        <div class="deco-dots"></div>

        <div class="brand">

          <div class="brand-logo">

            <img src="/assets/Logo PNUP.png" alt="Logo PNUP" />

          </div>

          <div class="brand-text">

            <h1>PNUP</h1>

            <p>Politeknik Negeri<br />Ujung Pandang</p>

          </div>

        </div>

        <div class="welcome-block">

          <h2>Bergabung <span>di SiCPL</span></h2>

          <p>Daftar akun mahasiswa untuk mengakses Sistem Informasi Penilaian Capaian Pembelajaran Lulusan.</p>

        </div>

      </div>



      <!-- RIGHT PANEL -->

      <div class="panel-right">

        <!-- Icon -->

        <div class="lock-icon">

          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>

            <circle cx="8.5" cy="7" r="4"></circle>

            <line x1="20" y1="8" x2="20" y2="14"></line>

            <line x1="23" y1="11" x2="17" y2="11"></line>

          </svg>

        </div>



        <!-- Heading -->

        <div class="form-heading">

          <h2>Daftar Akun</h2>

          <p>Lengkapi data diri untuk membuat akun mahasiswa</p>

        </div>



        <!-- Alert box -->

        <div v-if="alert.visible" class="alert" :class="alert.type" role="alert">

          <svg v-if="alert.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>

          </svg>

          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>

          </svg>

          <span>{{ alert.message }}</span>

        </div>



        <!-- Form -->

        <form class="login-form" @submit.prevent="handleRegister" novalidate>

          <!-- Nama -->

          <div class="input-group">

            <span class="input-icon">

              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>

                <circle cx="12" cy="7" r="4"></circle>

              </svg>

            </span>

            <input

              type="text"

              v-model="form.name"

              placeholder="Nama Lengkap"

              autocomplete="name"

              required

            />

          </div>



          <!-- NIM -->

          <div class="input-group">

            <span class="input-icon">

              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />

                <path d="M6 12v5c3 3 9 3 12 0v-5" />

              </svg>

            </span>

            <input

              type="text"

              v-model="form.nim"

              placeholder="NIM Mahasiswa"

              autocomplete="off"

              required

            />

          </div>



          <!-- Email -->

          <div class="input-group">

            <span class="input-icon">

              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

                <path d="M4 4h16v16H4z" opacity="0"></path>

                <path d="M3 7l9 6 9-6"></path>

                <rect x="3" y="5" width="18" height="14" rx="2"></rect>

              </svg>

            </span>

            <input

              type="email"

              v-model="form.email"

              placeholder="Email aktif"

              autocomplete="email"

              required

            />

          </div>



          <!-- Password -->

          <div class="input-group">

            <span class="input-icon">

              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>

                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>

              </svg>

            </span>

            <input

              :type="showPassword ? 'text' : 'password'"

              v-model="form.password"

              placeholder="Password"

              autocomplete="new-password"

              required

              class="pw-input"

            />

            <button type="button" class="pw-toggle" @click="showPassword = !showPassword">

              <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>

                <circle cx="12" cy="12" r="3"></circle>

              </svg>

              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>

                <line x1="1" y1="1" x2="23" y2="23"></line>

              </svg>

            </button>

          </div>



          <!-- Konfirmasi Password -->

          <div class="input-group">

            <span class="input-icon">

              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>

                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>

              </svg>

            </span>

            <input

              :type="showConfirm ? 'text' : 'password'"

              v-model="form.confirmPassword"

              placeholder="Konfirmasi Password"

              autocomplete="new-password"

              required

              class="pw-input"

            />

            <button type="button" class="pw-toggle" @click="showConfirm = !showConfirm">

              <svg v-if="!showConfirm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>

                <circle cx="12" cy="12" r="3"></circle>

              </svg>

              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>

                <line x1="1" y1="1" x2="23" y2="23"></line>

              </svg>

            </button>

          </div>



          <!-- Submit -->

          <button type="submit" class="btn-login" :disabled="isLoading">

            <span v-if="!isLoading" class="btn-text">Daftar</span>

            <span v-else class="spinner"></span>

          </button>

        </form>



        <p class="register-hint">

          Sudah punya akun? <router-link to="/login">Masuk di sini</router-link>

        </p>

      </div>



    </div>

  </main>

</template>



<script setup>

import { ref, reactive } from 'vue'

import { useRouter } from 'vue-router'

import api from '@/api/axios'



const router = useRouter()



const showPassword = ref(false)

const showConfirm = ref(false)

const isLoading = ref(false)



const form = reactive({

  name: '',

  nim: '',

  email: '',

  password: '',

  confirmPassword: '',

})



const alert = reactive({

  visible: false,

  type: 'error',

  message: '',

})



function showAlert(message, type = 'error') {

  alert.visible = true

  alert.type = type

  alert.message = message

}



function hideAlert() {

  alert.visible = false

  alert.message = ''

}



function validate() {

  if (!form.name.trim()) {

    showAlert('Nama lengkap tidak boleh kosong.')

    return false

  }

  if (!form.nim.trim()) {

    showAlert('NIM tidak boleh kosong.')

    return false

  }

  if (!form.email.trim()) {

    showAlert('Email tidak boleh kosong.')

    return false

  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(form.email)) {

    showAlert('Format email tidak valid.')

    return false

  }

  if (!form.password) {

    showAlert('Password tidak boleh kosong.')

    return false

  }

  if (form.password.length < 6) {

    showAlert('Password minimal 6 karakter.')

    return false

  }

  if (form.password !== form.confirmPassword) {

    showAlert('Konfirmasi password tidak cocok.')

    return false

  }

  return true

}



async function handleRegister() {

  hideAlert()



  if (!validate()) return



  isLoading.value = true



  try {

    await api.post('/register', {

      name: form.name,

      nim: form.nim,

      email: form.email,

      password: form.password,

      password_confirmation: form.confirmPassword,

    })



    showAlert('Pendaftaran berhasil! Mengalihkan ke halaman login...', 'success')



    setTimeout(() => {

      router.push('/login')

    }, 1200)



  } catch (error) {

    const msg = error.response?.data?.message || 'Pendaftaran gagal. Coba lagi.'

    showAlert(msg)

  } finally {

    isLoading.value = false

  }

}

</script>



<style scoped>

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }



:root {

  --maroon-dark: #7b1020;

  --maroon-mid: #9b1530;

  --maroon-light: #c1294a;

  --maroon-pale: #f5d0d8;

  --white: #ffffff;

  --gray-50: #f9fafb;

  --gray-100: #f3f4f6;

  --gray-200: #e5e7eb;

  --gray-400: #9ca3af;

  --gray-600: #4b5563;

  --gray-800: #1f2937;

  --radius-card: 20px;

  --radius-input: 12px;

  --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

}



.bg-wrapper {

  position: fixed;

  inset: 0;

  z-index: 0;

}

.bg-wrapper::before {

  content: '';

  position: absolute;

  inset: 0;

  background: linear-gradient(135deg, #7b1020 0%, #9b1530 30%, transparent 55%),

              linear-gradient(225deg, #7b1020 0%, #9b1530 25%, transparent 50%);

  z-index: 1;

}

.bg-image {

  width: 100%; height: 100%;

  object-fit: cover;

  filter: brightness(0.45) saturate(0.8);

}

.bg-dots {

  position: absolute;

  inset: 0;

  z-index: 2;

  background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);

  background-size: 28px 28px;

}



.page-wrapper {

  position: relative;

  z-index: 10;

  width: 100%;

  max-width: 1100px;

  padding: 24px;

  display: flex;

  align-items: stretch;

  min-height: 420px;

  margin: auto;

  min-height: 100vh;

  align-items: center;

  justify-content: center;

}



.login-card {

  display: flex;

  width: 100%;

  border-radius: var(--radius-card);

  overflow: hidden;

  box-shadow: 0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1);

}



/* LEFT PANEL */

.panel-left {

  flex: 1;

  position: relative;

  background: linear-gradient(160deg, #7b1020 0%, rgba(90,5,20,0.88) 100%);

  padding: 44px 48px;

  display: flex;

  flex-direction: column;

  justify-content: space-between;

  overflow: hidden;

  min-height: 480px;

}

.panel-left::after {

  content: '';

  position: absolute;

  bottom: -80px; right: -80px;

  width: 280px; height: 280px;

  border-radius: 50%;

  border: 40px solid rgba(255,255,255,0.06);

}

.deco-dots {

  position: absolute;

  right: 0; top: 0; bottom: 0;

  width: 80px;

  background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px);

  background-size: 16px 16px;

}

.brand {

  position: relative;

  z-index: 2;

  display: flex;

  align-items: center;

  gap: 14px;

}

.brand-logo {

  width: 56px; height: 56px;

  border-radius: 12px;

  background: rgba(255,255,255,0.12);

  border: 1px solid rgba(255,255,255,0.2);

  display: flex; align-items: center; justify-content: center;

  overflow: hidden;

}

.brand-logo img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }

.brand-text { color: #fff; }

.brand-text h1 { font-size: 1.35rem; font-weight: 700; }

.brand-text p { font-size: 0.68rem; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.06em; }

.welcome-block { position: relative; z-index: 2; }

.welcome-block h2 { font-size: 1.7rem; font-weight: 700; color: #fff; margin-bottom: 10px; }

.welcome-block h2 span { display: block; color: #f5d0d8; }

.welcome-block p { font-size: 0.88rem; color: rgba(255,255,255,0.7); line-height: 1.6; }



/* RIGHT PANEL */

.panel-right {

  width: 400px;

  flex-shrink: 0;

  background: #fff;

  padding: 50px 44px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

}

.lock-icon {

  width: 68px; height: 68px;

  border-radius: 50%;

  background: linear-gradient(135deg, #f5d0d8, #fce4ea);

  display: flex; align-items: center; justify-content: center;

  margin-bottom: 20px;

  box-shadow: 0 4px 20px rgba(155,21,48,0.15);

}

.lock-icon svg { width: 30px; height: 30px; color: #9b1530; }

.form-heading { text-align: center; margin-bottom: 24px; }

.form-heading h2 { font-size: 1.6rem; font-weight: 700; color: #1f2937; margin-bottom: 6px; }

.form-heading p { font-size: 0.82rem; color: #9ca3af; }



.alert {

  width: 100%;

  padding: 11px 14px;

  border-radius: 10px;

  font-size: 0.82rem;

  font-weight: 500;

  display: flex;

  align-items: center;

  gap: 8px;

  margin-bottom: 8px;

}

.alert.error { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; }

.alert.success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }

.alert svg { width: 16px; height: 16px; flex-shrink: 0; }



.login-form {

  width: 100%;

  display: flex;

  flex-direction: column;

  gap: 14px;

  margin-top: 6px;

}

.input-group { position: relative; width: 100%; }

.input-icon {

  position: absolute;

  left: 14px; top: 50%;

  transform: translateY(-50%);

  color: #9ca3af;

  display: flex; align-items: center;

  pointer-events: none;

}

.input-icon svg { width: 18px; height: 18px; }

.input-group input {

  width: 100%;

  padding: 13px 14px 13px 44px;

  border: 1.5px solid #e5e7eb;

  border-radius: var(--radius-input);

  font-family: 'Inter', sans-serif;

  font-size: 0.9rem;

  color: #1f2937;

  background: #f9fafb;

  outline: none;

  transition: var(--transition);

}

.input-group input:focus { border-color: #9b1530; background: #fff; box-shadow: 0 0 0 3px rgba(155,21,48,0.1); }

.pw-toggle {

  position: absolute;

  right: 14px; top: 50%;

  transform: translateY(-50%);

  background: none; border: none;

  cursor: pointer; color: #9ca3af;

  display: flex; align-items: center;

  transition: var(--transition);

}

.pw-toggle:hover { color: #9b1530; }

.pw-toggle svg { width: 18px; height: 18px; }

.pw-input { padding-right: 44px !important; }



.btn-login {

  width: 100%;

  padding: 14px;

  border: none; border-radius: var(--radius-input);

  background: linear-gradient(135deg, #9b1530, #7b1020);

  color: #fff;

  font-family: 'Inter', sans-serif;

  font-size: 0.9rem; font-weight: 700;

  letter-spacing: 0.12em;

  text-transform: uppercase;

  cursor: pointer;

  transition: var(--transition);

  margin-top: 4px;

}

.btn-login:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(155,21,48,0.4); }

.btn-login:disabled { opacity: 0.7; cursor: not-allowed; }



.spinner {

  display: inline-block;

  width: 18px; height: 18px;

  border: 2.5px solid rgba(255,255,255,0.4);

  border-top-color: white;

  border-radius: 50%;

  animation: spin 0.7s linear infinite;

  margin: 0 auto;

}

@keyframes spin { to { transform: rotate(360deg); } }



.register-hint { margin-top: 18px; font-size: 0.8rem; color: #9ca3af; text-align: center; }

.register-hint a { color: #9b1530; font-weight: 600; text-decoration: none; cursor: pointer; }



@media (max-width: 768px) {

  .login-card { flex-direction: column; }

  .welcome-block { display: none; }

  .panel-right { width: 100%; padding: 36px 28px; }

}

</style>