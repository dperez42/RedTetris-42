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
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #111;
}

/* Contenedor principal de la app */
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  font-family: "Segoe UI", sans-serif;
  color: white;
}
</style>
