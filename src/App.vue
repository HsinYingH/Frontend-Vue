<template>
  <div class="app">

    <nav class="nav" v-if="isAuthenticated">
      <router-link to="/addPost">發文</router-link> 
      <router-link to="/myPost">我的發文</router-link> 
      <router-link to="/">首頁</router-link> 
      <button @click="logout">登出</button>
    </nav>

    <main :class="['main-content', { fullWidth: !isAuthenticated }]">      
      <router-view />
    </main>

  </div>
</template>

<script setup>
  import { useRouter, useRoute } from 'vue-router'
  import { ref, watchEffect } from 'vue'

  const router = useRouter()

  const isAuthenticated = ref(false)

  watchEffect(() => {
    isAuthenticated.value = !!localStorage.getItem('jwtToken')
  })

  const logout = () => {
    localStorage.removeItem('jwtToken')
    router.push('/login')
  }
</script>


<style scoped>
  .app {
    min-height: 100vh;
    background-color: #f3f4f6;
  }

  .nav {
    padding: 1rem;
    width: 100vw;
    background: #eee;
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .nav a {
    margin-right: 1rem;
    width: 150px;
    height: 60%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #96a48b;
    border-radius: 10px;
    color: white; 
    text-decoration: none;
    font-weight: bold;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .nav a:hover {
    transform: translateY(-2px);
    box-shadow: 4px 4px 10px rgba(0,0,0,0.3);
  }

  .nav button {
    margin-right: 1rem;
    width: 150px;
    height: 60%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #96a48b;
    border-radius: 10px;
    color: white;
    font-weight: bold;
    border: none;
    cursor: pointer;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .nav button:hover {
    transform: translateY(-2px);
    box-shadow: 4px 4px 10px rgba(0,0,0,0.3);
  }


  .main-content {
    padding-top: 3rem;
    padding: 20px;
    transition: all 0.3s ease;
  }

  .fullWidth {
    width: 100vw;
    padding-top: 0;
  }
</style>
