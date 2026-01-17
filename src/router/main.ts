import '../assets/main.css'

import { createApp } from 'vue'
import App from '../App.vue'
import router from './index.ts'

const app = createApp(App)

router.afterEach((to) => {
  document.body.classList.toggle('route-home', to.name === 'home')
})

app.use(router)
app.mount('#app')
