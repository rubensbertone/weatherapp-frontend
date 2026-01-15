<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isBlurring = ref(false)
const showSearch = ref(false)
const searchQuery = ref('')

const goToFavorites = () => {
  if (isBlurring.value) return
  isBlurring.value = true
  setTimeout(() => {
    router.push({ name: 'favorite-locations' })
  }, 400)
}

const onSearchClick = () => {
  showSearch.value = !showSearch.value
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log("Suche nach Stadt:", searchQuery.value)
  }
}
</script>

<template>
  <div class="home" :class="{ 'blur-out': isBlurring }">
    <div class="glass-card">
      <h1 class="title">Wetter App</h1>

      <p class="subtitle">Finde das aktuelle Wetter für deine Lieblingsorte</p>

      <Transition name="fade-slide">
        <div v-if="showSearch" class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Stadt eingeben..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button class="search-go" @click="handleSearch">Go</button>
        </div>
      </Transition>

      <div class="actions">
        <button class="btn primary" @click="goToFavorites">
          <span class="icon">⭐</span> Favorite Locations
        </button>
        <button class="btn outline" @click="onSearchClick">
          <span class="icon">🔍</span> {{ showSearch ? 'Abbrechen' : 'Search' }}
        </button>
      </div>

      <div class="auth-footer">
        <p>Möchtest du deine Orte speichern?</p>
        <div class="auth-links">
          <router-link to="/login" class="auth-link">Login</router-link>
          <span class="divider">|</span>
          <router-link to="/register" class="auth-link">Registrieren</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container Layout */
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* Glassmorphism Card */
.glass-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 3rem 2rem;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.title {
  color: #ffffff;
  font-size: 3.5rem;
  margin: 0 0 0.5rem 0;
  font-weight: 800;
  letter-spacing: -1px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2.5rem;
  font-size: 1.1rem;
}

/* Suchfeld Styling */
.search-container {
  display: flex;
  gap: 10px;
  margin-bottom: 2rem;
  justify-content: center;
}

.search-input {
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.9);
  width: 100%;
  max-width: 250px;
  font-size: 1rem;
  outline: none;
  transition: box-shadow 0.3s ease;
}

.search-input:focus {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
}

.search-go {
  padding: 0 1.2rem;
  background: #0b6b8c;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
}

/* Buttons */
.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.btn {
  width: 100%;
  max-width: 280px;
  padding: 1rem 1.5rem;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: none;
}

.primary {
  background: #ffffff;
  color: #0b6b8c;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.outline {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 25px rgba(0,0,0,0.15);
}

.btn:active {
  transform: translateY(0);
}

/* Auth Footer */
.auth-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.auth-footer p {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.auth-links {
  display: flex;
  justify-content: center;
  gap: 15px;
  font-weight: 600;
}

.auth-link {
  color: white;
  text-decoration: none;
  transition: opacity 0.2s;
}

.auth-link:hover {
  text-decoration: underline;
  opacity: 1;
}

.divider {
  opacity: 0.3;
}

/* Animationen */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.blur-out {
  animation: blurOut 400ms ease forwards;
}

@keyframes blurOut {
  0% { filter: blur(0px); opacity: 1; }
  100% { filter: blur(10px); opacity: 0; }
}
</style>
