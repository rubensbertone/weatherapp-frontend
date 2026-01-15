<template>
  <div class="app-layout">
    <nav class="navbar">
      <router-link to="/" class="nav-logo">☁️ WeatherApp</router-link>
      <div class="nav-links">
        <router-link to="/favorite-locations">Favoriten</router-link>
        <router-link to="/login" class="nav-btn">Login</router-link>
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

.nav-links { display: flex; gap: 1.5rem; align-items: center; }
.nav-links a { text-decoration: none; color: #0b6b8c; font-weight: 600; }
.nav-btn {
  background: #0b6b8c;
  color: white !important;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}
</style>
