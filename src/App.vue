<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const TOKEN_KEY = 'token' // ggf. anpassen, falls euer Token anders gespeichert wird

const router = useRouter()
const route = useRoute()

const isLoggedIn = ref(false)

const updateAuthState = () => {
  isLoggedIn.value = !!localStorage.getItem(TOKEN_KEY)
  window.dispatchEvent(new CustomEvent('auth-changed'))
}

const logout = async () => {
  localStorage.removeItem(TOKEN_KEY)
  updateAuthState()
  await router.push({ path: '/' })
}

onMounted(() => {
  updateAuthState()
  window.addEventListener('storage', updateAuthState)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', updateAuthState)
})

watch(
  () => route.fullPath,
  () => updateAuthState(),
)
</script>

<template>
  <div class="app-layout">
    <nav class="navbar">
      <router-link to="/" class="nav-btn">Weather App</router-link>

      <div class="nav-links">
        <!-- Favoriten nur anzeigen, wenn eingeloggt -->
        <router-link v-if="isLoggedIn" to="/favorite-locations">Favoriten</router-link>

        <!-- Login nur anzeigen, wenn NICHT eingeloggt -->
        <router-link v-if="!isLoggedIn" to="/login" class="nav-btn">Login</router-link>

        <button v-if="isLoggedIn" class="nav-btn logout-btn" type="button" @click="logout">
          Logout
        </button>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: #0b6b8c;
  font-weight: 600;
}

.nav-btn {
  background: #0b6b8c;
  color: white !important;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.logout-btn {
  font: inherit;
}
</style>
