<template>
  <RouterView />
</template>

<script setup>
// RouterView akan otomatis render view yang sesuai route aktif
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  height: 100%;
  font-family: 'Inter', sans-serif;
  background: #f3f4f6;
}
</style>