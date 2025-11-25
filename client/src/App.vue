<script setup>
</script>

<template>
  <!-- 🔥 Envuelve todo el contenido en un contenedor de ancho y alto completos -->
  <div class="app-container">
    <router-view />
  </div>
</template>

<style>
/* ✅ Estilos globales (NO scoped) */

/* Asegura que html, body y #app ocupen todo el alto */
html,
body,
#app {
  display: flex; 
  margin: 0;
  padding: 0;
  min-height: 100vh;   /* ← permite crecer */
  height: 100%;
  width: 100%;
  overflow-x: hidden;  /* ← evita scroll lateral, pero PERMITE scroll vertical */
  overflow-y: auto;
  background-color: rgb(207, 51, 51);
}

/* Contenedor principal de la app */
.app-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 100vh;  /* ← clave */
  width: 100%;
  height: 100%;
  font-family: "Segoe UI", sans-serif;
  color: white;
  background-color: rgb(80, 51, 207);
}
</style>
