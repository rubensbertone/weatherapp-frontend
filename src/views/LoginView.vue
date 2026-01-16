<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const message = ref('');
const isSuccess = ref(false);

const router = useRouter();

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8080';

async function performLogin() {
  message.value = '';
  isSuccess.value = false;

  const authHeader = 'Basic ' + btoa(username.value + ':' + password.value);

  try {
    const response = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const text = await response.text();
      isSuccess.value = true;
      message.value = text;

      // Token/Auth-Header im localStorage speichern
      localStorage.setItem('token', authHeader);

      // Kurz warten, damit der Nutzer die Erfolgsmeldung sieht, dann weiterleiten
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      isSuccess.value = false;
      message.value = 'Login fehlgeschlagen. Falsche Daten?';
    }
  } catch (error) {
    console.error(error);
    isSuccess.value = false;
    message.value = 'Server nicht erreichbar.';
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="glass-card">
      <h1 class="title">Login</h1>
      <p class="subtitle">Schön, dass du wieder da bist!</p>

      <form @submit.prevent="performLogin">
        <div class="form-group">
          <label>Benutzername</label>
          <input v-model="username" type="text" required placeholder="Dein Name" />
        </div>

        <div class="form-group">
          <label>Passwort</label>
          <input v-model="password" type="password" required placeholder="••••••••" />
        </div>

        <button type="submit" class="btn-auth">Einloggen</button>
      </form>

      <div v-if="message" :class="['message-box', isSuccess ? 'success' : 'error']">
        {{ message }}
      </div>

      <div class="switch-auth">
        Noch kein Account? <router-link to="/register">Registrieren</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
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
  max-width: 450px;
}

.title { color: #fff; text-align: center; margin-bottom: 0.5rem; }
.subtitle { color: rgba(255,255,255,0.8); text-align: center; margin-bottom: 2rem; font-size: 0.9rem; }

.form-group { margin-bottom: 1.2rem; }
label { display: block; color: white; margin-bottom: 0.4rem; font-size: 0.9rem; font-weight: 600; }

input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.9);
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
}

.btn-auth {
  width: 100%;
  padding: 0.8rem;
  background-color: #0b6b8c;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s;
  margin-top: 1rem;
}

.btn-auth:hover { transform: translateY(-2px); background-color: #095a75; }

.message-box { margin-top: 1.5rem; padding: 0.8rem; border-radius: 12px; text-align: center; font-weight: 600; }
.success { background: rgba(72, 187, 120, 0.2); color: #c6f6d5; border: 1px solid rgba(72, 187, 120, 0.4); }
.error { background: rgba(245, 101, 101, 0.2); color: #fed7d7; border: 1px solid rgba(245, 101, 101, 0.4); }

.switch-auth { margin-top: 1.5rem; text-align: center; color: white; font-size: 0.9rem; }
.switch-auth a { color: #fff; font-weight: 700; text-decoration: none; }
</style>
