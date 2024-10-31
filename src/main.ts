import './assets/main.css'

import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

// Components
import App from './App.vue'
import router from './router'

const vuetify = createVuetify({})

createApp(App)
    .use(router)
    .use(vuetify)
    .mount('#app')