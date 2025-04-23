<template>
  <div class="page">
    <div class="container">
      <h1>你發表過的文章</h1>
      <ul class="article-list">
        <li v-if="posts.length === 0" class="no-post">你還沒有發布過文章喔</li>

        <li v-else v-for="post in posts" :key="post.PostID" class="article">
          <small class="info">
            <span class="right">發佈時間：{{ new Date(post.CreatedAt).toLocaleString() }}</span>
          </small>
          <p>{{ post.Content }}</p>
          <div class="actions">
            <button @click="editPost(post)">Edit</button>
            <button @click="deletePost(post.PostID)">Delete</button>
          </div>
        </li>
      </ul>
    </div>

    <div class="modal-overlay" v-if="showModal">
      <div class="modal-content">
        <h3>編輯文章</h3>
        <textarea v-model="editedContent" rows="8" />
        <div class="actions">
          <button @click="submitEdit">儲存</button>
          <button @click="cancelEdit">取消</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const posts = ref([])
const userId = Number(localStorage.getItem("userId"))

const showModal = ref(false)
const editingPost = ref(null)
const editedContent = ref('')

onMounted(async () => {
  try {
    const res= await axios.get(`http://localhost:8080/Post/${userId}`)
    posts.value= res.data
  } catch (err) {
    console.error("無法取得貼文：", err)
  }
})

const deletePost= async (postId)=> {
  try {
    await axios.delete(`http://localhost:8080/Post/${postId}`)
    posts.value= posts.value.filter(post => post.PostID!== postId)
  } catch (err) {
    console.error("刪除失敗：", err)
  }
}

const editPost= (post)=> {
  editingPost.value= post
  editedContent.value= post.Content
  showModal.value= true
}

const submitEdit= async ()=> {
  if (!editedContent.value.trim()) {
    alert('內容不能為空')
    return
  }

  try {
    await axios.put(`http://localhost:8080/Post/${editingPost.value.PostID}`, {
      ...editingPost.value,
      content: editedContent.value,
    })

    const index= posts.value.findIndex(p=> p.PostID=== editingPost.value.PostID)
    if (index!== -1) {
      posts.value[index].Content= editedContent.value
    }

    cancelEdit()
  } catch (err) {
    console.error('編輯失敗：', err)
  }
}

const cancelEdit= () => {
  showModal.value= false
  editingPost.value= null
  editedContent.value= ''
}
</script>

<style scoped>
.page {
  background-color: #f3f4f6;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 0;
}

.container {
  background-color: white;
  width: 100%;
  max-width: 900px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.article-list {
  list-style-type: none;
  padding: 0;
}

.article {
  background-color: #e0e5df;
  padding: 15px;
  margin-bottom: 20px;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.info {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 15px;
}

p {
  margin: 10px;
  flex-grow: 1;
  width: 100%;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 10px;
}

small {
  color: gray;
  font-size: 12px;
}

.actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

button {
  padding: 6px 10px;
  border: none;
  background-color: #96a48b;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #ccc;
}

.no-post {
  text-align: center;
  color: gray;
  font-style: italic;
  padding: 20px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  height: 80%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: relative;
  display: flex;
  flex-direction: column;
}

.modal-content textarea {
  width: 100%;
  height: 100%;
  resize: vertical;
  min-height: 150px;
  padding: 10px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.modal-content .actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-content button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #96a48b;
  color: white;
  font-weight: bold;
}

.modal-content button:hover {
  background-color: #7d8b74;
}

</style>
