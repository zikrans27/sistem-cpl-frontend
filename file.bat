@echo off
title Setup Struktur Folder Sistem CPL Frontend
echo ===================================================
echo Memulai pembuatan folder dan file baru...
echo ===================================================

:: 1. Membuat semua folder yang diperlukan
echo Menyiapkan struktur folder...
mkdir public\assets 2>nul
mkdir src\router 2>nul
mkdir src\stores 2>nul
mkdir src\layouts 2>nul
mkdir src\components 2>nul
mkdir src\views\auth 2>nul
mkdir src\views\admin 2>nul
mkdir src\views\mahasiswa 2>nul

:: 2. Membuat file baru (kosong)
echo Membuat file Vue, JS, dan konfigurasi baru...
type nul > src\App.vue
type nul > src\main.js
type nul > src\router\index.js
type nul > src\stores\auth.js
type nul > src\stores\mataKuliah.js
type nul > src\layouts\AppLayout.vue
type nul > src\views\auth\LoginView.vue
type nul > src\views\admin\DashboardAdmin.vue
type nul > src\views\admin\TabelPenilaianAdmin.vue
type nul > src\views\mahasiswa\DashboardMahasiswa.vue
type nul > src\views\mahasiswa\TabelPenilaianMahasiswa.vue

echo ===================================================
echo Struktur folder dan file berhasil dibuat!
echo ===================================================
echo.
echo Catatan untuk pemindahan aset (Logo PNUP & campus.jpg):
echo Silakan salin manual file logo dan gambar tersebut 
echo ke dalam folder: public\assets\
echo.
pause