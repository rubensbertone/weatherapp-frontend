<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isBlurring = ref(false)

const goToFavorites = () => {
  if (isBlurring.value) return
  isBlurring.value = true
  setTimeout(() => {
    router.push({ name: 'favorite-locations' })
  }, 400)
}

const onSearchClick = () => {
}
</script>

<template>
  <div class="home" :class="{ 'blur-out': isBlurring }">
    <div class="content">
      <h1 class="title">Wetter App</h1>
      <div class="actions">
        <button class="btn" @click="goToFavorites">Favorite Locations</button>
        <button class="btn outline" @click="onSearchClick">Search</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  text-align: center;
}

.title {
  color: #fff;
  font-size: 3rem;
  margin-bottom: 2rem;
  font-weight: 700;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  appearance: none;
  border: none;
  background: #ffffff;
  color: #0b6b8c;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  transition: transform 0.15s ease, box-shadow 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 26px rgba(0,0,0,0.18);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
}

.btn.outline {
  background: transparent;
  color: #ffffff;
  border: 2px solid rgba(255,255,255,0.9);
}

.btn.outline:hover {
  background: rgba(255,255,255,0.1);
}

/* Blur-out animation */
.blur-out {
  animation: blurOut 400ms ease forwards;
}

@keyframes blurOut {
  0% { filter: blur(0px); opacity: 1; }
  100% { filter: blur(8px); opacity: 0; }
}
</style>
