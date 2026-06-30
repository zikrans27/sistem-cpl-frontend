<template>

  <!-- Background -->

  <div class="bg-wrapper">

    <img class="bg-image" src="/assets/campus.jpg" alt="Kampus PNUP" />

    <div class="bg-dots"></div>

  </div>



  <!-- Main -->

  <main class="page-wrapper" role="main">

    <div class="login-card single">



      <!-- RIGHT PANEL (jadi satu-satunya panel) -->

      <div class="panel-right">

        <!-- Icon -->

        <div class="lock-icon">

          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>

          </svg>

        </div>



        <!-- Heading -->

        <div class="form-heading">

          <h2>Lupa Password</h2>

          <p v-if="!emailSent">Masukkan email atau username Anda, kami akan mengirimkan tautan untuk mereset password</p>

          <p v-else>Periksa email Anda untuk instruksi reset password</p>

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



        <!-- Form: belum dikirim -->

        <form v-if="!emailSent" class="login-form" @submit.prevent="handleSendReset" novalidate>

          <div class="input-group">

            <span class="input-icon">

              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

                <path d="M3 7l9 6 9-6"></path>

                <rect x="3" y="5" width="18" height="14" rx="2"></rect>

              </svg>

            </span>

            <input

              type="text"

              v-model="email"

              placeholder="Email atau Username / NIM"

              autocomplete="username"

              required

            />

          </div>



          <button type="submit" class="btn-login" :disabled="isLoading">

            <span v-if="!isLoading" class="btn-text">Kirim Tautan Reset</span>

            <span v-else class="spinner"></span>

          </button>

        </form>



        <!-- Setelah dikirim -->

        <div v-else class="sent-block">

          <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>

          </svg>

          <p class="sent-text">Tautan reset password telah dikirim ke <strong>{{ email }}</strong></p>

          <button type="button" class="btn-login btn-outline" @click="resetForm">Kirim ulang</button>

        </div>



        <p class="register-hint">

          <router-link to="/login">&larr; Kembali ke halaman login</router-link>

        </p>

      </div>



    </div>

  </main>

</template>



<script setup>

import { ref, reactive } from 'vue'

import api from '@/api/axios'



const email = ref('')

const isLoading = ref(false)

const emailSent = ref(false)



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



function resetForm() {

  emailSent.value = false

  email.value = ''

  hideAlert()

}



async function handleSendReset() {

  hideAlert()



  if (!email.value.trim()) {

    showAlert('Email atau username tidak boleh kosong.')

    return

  }



  isLoading.value = true



  try {

    await api.post('/forgot-password', {

      email: email.value,

    })



    emailSent.value = true

  } catch (error) {

    const msg = error.response?.data?.message || 'Gagal mengirim tautan reset. Coba lagi.'

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

  max-width: 460px;

  padding: 24px;

  margin: auto;

  min-height: 100vh;

  display: flex;

  align-items: center;

  justify-content: center;

}



.login-card.single {

  display: flex;

  width: 100%;

  border-radius: var(--radius-card);

  overflow: hidden;

  box-shadow: 0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1);

}



.panel-right {

  width: 100%;

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

.form-heading h2 { font-size: 1.6rem; font-weight: 700; color: #1f2937; margin-bottom: 8px; }

.form-heading p { font-size: 0.85rem; color: #9ca3af; line-height: 1.5; }



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

  gap: 16px;

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

}

.btn-login:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(155,21,48,0.4); }

.btn-login:disabled { opacity: 0.7; cursor: not-allowed; }

.btn-outline {

  background: #fff;

  color: #9b1530;

  border: 1.5px solid #9b1530;

  margin-top: 18px;

}

.btn-outline:hover { background: #fdf2f4; box-shadow: none; transform: none; }



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



.sent-block {

  width: 100%;

  display: flex;

  flex-direction: column;

  align-items: center;

  text-align: center;

}

.check-icon {

  width: 52px; height: 52px;

  color: #16a34a;

  margin-bottom: 14px;

}

.sent-text { font-size: 0.88rem; color: #4b5563; line-height: 1.6; }

.sent-text strong { color: #1f2937; }



.register-hint { margin-top: 22px; font-size: 0.82rem; color: #9ca3af; text-align: center; }

.register-hint a { color: #9b1530; font-weight: 600; text-decoration: none; cursor: pointer; }



@media (max-width: 768px) {

  .panel-right { padding: 36px 28px; }

}

</style>