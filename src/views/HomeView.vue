<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface CitySearchResult {
  name: string
  country: string
  state?:  string
  lat: number
  lon: number
}

interface ApiCityResponse {
  name: string
  country: string
  state?: string
  lat:  number
  lon: number
}

const showSearch = ref(false)
const searchQuery = ref('')
const suggestions = ref<CitySearchResult[]>([])
const isLoggedIn = ref(false)
const isLoading = ref(false)
const typingTimer = ref<number | null>(null)

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ??  'http://localhost:8080'
const MIN_SEARCH_CHARS = 3
const SEARCH_DELAY = 1000

const updateAuthState = () => {
  isLoggedIn.value = !!localStorage.getItem('token')
}

const fetchSuggestions = async (query: string) => {
  if (query. length < MIN_SEARCH_CHARS) {
    suggestions.value = []
    return
  }

  isLoading.value = true

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/weather/places/search? query=${encodeURIComponent(query)}`
    )

    if (response.ok) {
      const data: ApiCityResponse[] = await response.json()
      suggestions.value = data.map((item: ApiCityResponse) => ({
        name: item.name,
        country: item.country,
        state: item.state,
        lat: item.lat,
        lon: item.lon
      }))
    } else {
      suggestions.value = []
    }
  } catch (error) {
    console.error('Fehler beim Abrufen der Städte:', error)
    suggestions.value = []
  } finally {
    isLoading.value = false
  }
}

const onInput = () => {
  if (typingTimer.value !== null) {
    clearTimeout(typingTimer.value)
  }

  if (searchQuery.value.length >= MIN_SEARCH_CHARS) {
    typingTimer.value = window.setTimeout(() => {
      fetchSuggestions(searchQuery. value)
    }, SEARCH_DELAY)
  } else {
    suggestions.value = []
    isLoading.value = false
  }
}

const selectCity = (city: CitySearchResult) => {
  searchQuery.value = `${city.name}, ${city.country}`
  suggestions.value = []
  console.log('Stadt ausgewählt:', city)
}

const onSearchClick = () => {
  showSearch.value = !showSearch.value
  if (! showSearch.value) {
    searchQuery.value = ''
    suggestions.value = []
  }
}

const closeSuggestions = () => {
  setTimeout(() => {
    suggestions.value = []
  }, 200)
}

onMounted(() => {
  updateAuthState()
  window.addEventListener('auth-changed', updateAuthState)
  window.addEventListener('storage', updateAuthState)
})

onBeforeUnmount(() => {
  window.removeEventListener('auth-changed', updateAuthState)
  window.removeEventListener('storage', updateAuthState)
  if (typingTimer.value !== null) {
    clearTimeout(typingTimer.value)
  }
})
</script>

<template>
  <div class="home">
    <div class="glass-card">
      <h1 class="title">Weather App</h1>
      <p class="subtitle">Finde das aktuelle Wetter für deine Lieblingsorte</p>

      <Transition name="fade-slide">
        <div v-if="showSearch" class="search-wrapper">
          <div class="search-container">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Stadt eingeben (mind. 3 Zeichen)..."
              class="search-input"
              @input="onInput"
              @blur="closeSuggestions"
              @focus="() => { if (searchQuery.length >= MIN_SEARCH_CHARS) fetchSuggestions(searchQuery) }"
            />

            <div v-if="isLoading" class="loading-indicator">
              <span class="loader"></span>
            </div>

            <Transition name="dropdown">
              <ul v-if="suggestions.length > 0" class="dropdown-list">
                <li
                  v-for="(city, index) in suggestions"
                  :key="index"
                  class="dropdown-item"
                  @mousedown.prevent="selectCity(city)"
                >
                  <div class="city-info">
                    <span class="city-name">{{ city.name }}</span>
                    <span class="city-location">
                      {{ city.state ? `${city.state}, ` : '' }}{{ city.country }}
                    </span>
                  </div>
                </li>
              </ul>
            </Transition>

            <div v-if="searchQuery.length >= MIN_SEARCH_CHARS && suggestions.length === 0 && !isLoading" class="no-results">
              Keine Städte gefunden
            </div>
          </div>
        </div>
      </Transition>

      <div class="actions">
        <button class="btn outline" @click="onSearchClick">
          {{ showSearch ? 'Abbrechen' : 'Stadt suchen' }}
        </button>
      </div>

      <div v-if="! isLoggedIn" class="auth-footer">
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
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 3rem 2rem;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 550px;
}

/* Titel */
.title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin:  0 0 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
}

/* Search Wrapper */
.search-wrapper {
  position:  relative;
  margin-bottom: 2rem;
}

.search-container {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #0b6b8c;
  box-shadow: 0 0 0 3px rgba(11, 107, 140, 0.1);
}

.search-input::placeholder {
  color: rgba(0, 0, 0, 0.4);
}

/* Loading Indicator */
.loading-indicator {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform:  translateY(-50%);
  pointer-events: none;
}

.loader {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #0b6b8c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Dropdown List */
.dropdown-list {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow:  0 8px 24px rgba(0, 0, 0, 0.15);
  list-style: none;
  padding: 0;
  margin:  0;
  max-height: 300px;
  overflow-y:  auto;
  z-index:  100;
}

.dropdown-item {
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: rgba(11, 107, 140, 0.08);
}

.city-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.city-name {
  font-weight: 600;
  color:  #0b6b8c;
  font-size: 1rem;
}

.city-location {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.2rem;
}

/* No Results */
.no-results {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  color: #666;
  font-size: 0.9rem;
  text-align: center;
}

/* Buttons */
.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 12px;
  font-size:  1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn.outline {
  background: transparent;
  border: 2px solid white;
  color: white;
}

.btn.outline:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Auth Footer */
.auth-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.auth-footer p {
  color: white;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.auth-links {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  justify-content: center;
}

.auth-link {
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.auth-link:hover {
  text-decoration: underline;
  opacity: 1;
}

.divider {
  opacity: 0.3;
  color: white;
}

/* Animationen */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform:  translateY(-10px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform:  translateY(-5px);
}

/* Scrollbar Styling für Dropdown */
.dropdown-list::-webkit-scrollbar {
  width: 8px;
}

.dropdown-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.dropdown-list::-webkit-scrollbar-thumb {
  background: #0b6b8c;
  border-radius: 10px;
}

.dropdown-list::-webkit-scrollbar-thumb:hover {
  background: #095a75;
}
</style>
