<template>
  <div class="login-container">
    <h1>Login</h1>

    <form @submit.prevent="performLogin">
      <div class="form-group">
        <label>Benutzername</label>
        <input v-model="username" type="text" required placeholder="Name" />
      </div>

      <div class="form-group">
        <label>Passwort</label>
        <input v-model="password" type="password" required placeholder="Passwort" />
      </div>

      <button type="submit">Einloggen</button>
    </form>

    <div v-if="message" :class="['message', isSuccess ? 'success' : 'error']">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const message = ref('');
const isSuccess = ref(false);

async function performLogin() {
  message.value = '';
  isSuccess.value = false;

  const authHeader = 'Basic ' + btoa(username.value + ':' + password.value);

  try {
    const response = await fetch('http://localhost:8080/login', {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const text = await response.text();
      isSuccess.value = true;
      message.value = text;

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

<style scoped>
.login-container { max-width: 400px; margin: 2rem auto; padding: 2rem; border: 1px solid #ddd; border-radius: 8px; }
.form-group { margin-bottom: 1rem; }
input { width: 100%; padding: 0.5rem; margin-top: 0.2rem; }
button { width: 100%; padding: 0.75rem; background-color: #3182ce; color: white; border: none; border-radius: 4px; cursor: pointer; }
.message { margin-top: 1rem; padding: 0.5rem; text-align: center; }
.success { color: green; background-color: #f0fff4; }
.error { color: red; background-color: #fff5f5; }
</style>
