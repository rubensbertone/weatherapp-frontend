<template>
  <div class="register-container">
    <h1>Registrierung</h1>

    <form @submit.prevent="registerUser">
      <div class="form-group">
        <label for="username">Benutzername</label>
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="Name eingeben"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Passwort</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Passwort eingeben"
          required
        />
      </div>

      <button type="submit">Account erstellen</button>
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

async function registerUser() {
  message.value = '';
  isSuccess.value = false;

  const userData = {
    username: username.value,
    password: password.value
  };

  try {
    const response = await fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      isSuccess.value = true;
      message.value = 'Erfolg! Du bist registriert.';
      username.value = '';
      password.value = '';
    } else {
      isSuccess.value = false;
      message.value = 'Fehler: Registrierung fehlgeschlagen (Name vergeben?).';
    }
  } catch (error) {
    console.error(error);
    isSuccess.value = false;
    message.value = 'Server nicht erreichbar.';
  }
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #3aa876;
}

.message {
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  text-align: center;
}
.success {
  background-color: #e6fffa;
  color: #2c7a7b;
  border: 1px solid #b2f5ea;
}
.error {
  background-color: #fff5f5;
  color: #c53030;
  border: 1px solid #feb2b2;
}
</style>
