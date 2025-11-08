<script setup lang="ts">
export interface FavoriteLocation {
  locationName: string
  country: string
  latitude?: number
  longitude?: number
}

defineProps<{
  location: FavoriteLocation
}>()
</script>

<template>
  <div class="location-item">
    <h3>{{ location.locationName }}</h3>
    <p class="country">{{ location.country }}</p>
    <p v-if="location.latitude && location.longitude" class="coordinates">
      📍 {{ location.latitude.toFixed(2) }}°, {{ location.longitude.toFixed(2) }}°
    </p>
  </div>
</template>

<style scoped>
.location-item {
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.location-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.location-item h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.location-item .country {
  margin: 0 0 0.5rem 0;
  color: deepskyblue;
  font-weight: 500;
}

.location-item .coordinates {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}
</style>
