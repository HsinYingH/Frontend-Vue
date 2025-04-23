  
  <template>
      <div class="addPost-page">
        <div class="post-box">
          <h2>Create a post! </h2>
            <form @submit.prevent="handlePost">
              <label>Content</label>
              <textarea id="content" v-model="content" rows="10" required></textarea>
              <button type="submit">發布</button>
              <p class="error" v-if="error">{{ error }}</p>
            </form>
        </div>
      </div>
  </template>
  
  <script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import axios from 'axios'

    const content= ref('')
    const error= ref('')
    const router= useRouter()
    const userId = Number(localStorage.getItem("userId"))

    const handlePost= async ()=> {
      if (!content.value.trim()) {
          error.value= '請輸入內容'
          return
      }
      const postData= {
        userId: userId, 
        content: content.value,
        createAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      try {
        await axios.post('http://localhost:8080/Post', postData)
        router.push('/') 
      } catch (err) {
        error.value= '發文失敗'
        console.error('發文失敗', err)
      }
    }
  </script>
  
  <style scoped>
    .addPost-page {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 700px;
      background-color: #f3f4f6;
    }
    
    .post-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 100%;
      max-width: 800px;
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
    
    button {
      margin-top: 1.5rem;
      padding: 0.5rem;
      background-color:  #96a48b;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    textarea{
      font-size: 18px;
      padding: 15px;
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
  