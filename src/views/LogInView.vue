<template>
  <div class="login-page">
    <div class="login-box">
      <h2>Log in</h2>
      <form @submit.prevent="handleLogin">
        <label>Phone Number</label>
        <input type="phoneNumber" v-model="phoneNumber" required />

        <label>Password</label>
        <input type="password" v-model="password" required />

        <button type="submit">登入</button>
        <p class="error" v-if="error">{{ error }}</p>
        <button @click="goToSignUp">回到註冊頁</button>
      </form>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'

  const phoneNumber = ref('')
  const password = ref('')
  const error = ref('')
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8080/User/Login", {
        phoneNumber: phoneNumber.value,
        password: password.value
      });

      if (res.status === 200) {
        const token= res.data.token;
        const userId = res.data.userId;

        localStorage.setItem('jwtToken',token);
        localStorage.setItem('userId', userId);
                
        router.push('/')
      } else {
        error.value = res.data || "登入失敗，請重試";
        }
    } catch (err) {
      if (err.response && err.response.status === 400) {
      error.value = "請填寫正確的資料";
      } else {
      error.value = "伺服器錯誤，請稍後再試";
      }
    }
  }

  const goToSignUp=()=>{
    router.push('/register')
  }
</script>

<style scoped>
  .login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 700px;
    background-color: #f3f4f6;
  }

  .login-box {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 100%;
    max-width: 650px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  h2 {
    text-align: center;
    margin-bottom: 1rem;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  label {
    margin-top: 1rem;
    margin-bottom: 0.25rem;
    font-weight: bold;
    font-family: sans-serif;
  }

  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    margin-top: 1.5rem;
    padding: 0.5rem;
    background-color:  #96a48b;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #e0e5df;
  }

  .error {
    color: red;
    margin-top: 1rem;
    text-align: center;
  }
</style>
