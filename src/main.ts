import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'


axios.interceptors.request.use(
    (config)=>{

        const token= localStorage.getItem('jwtToken');
        if (token) {
            config.headers['Authorization']= `Bearer ${token}`;

        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
