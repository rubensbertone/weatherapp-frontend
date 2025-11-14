<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LocationItem, { type FavoriteLocation } from '../components/LocationItem.vue'

const locations = ref<FavoriteLocation[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8080/favoriteLocations'

const fetchLocations = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await fetch(BACKEND_URL)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    locations.value = await response.json()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ein Fehler ist aufgetreten'
    console.error('Fehler beim Laden der Locations:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLocations()
})
</script>
