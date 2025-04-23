<template>
  <div class="page">
    <div class="container">
      <h1>文章列表</h1>
      <ul class="article-list">
        <li v-for="post in posts" :key="post.PostID" class="article">
          <small class="info">
            <span class="left">Author: {{ post.UserID }}</span>
            <span class="right">發佈時間：{{ new Date(post.CreatedAt).toLocaleString()}}</span>
          </small>
          <p>{{ post.Content }}</p>

          <div class="comments">
            <ul v-if="comments[post.PostID] && comments[post.PostID].length > 0">
              <li v-for="comment in comments[post.PostID]" :key="comment.CommentID">
                <div>{{ comment.Content }}</div>
                <small>{{ new Date(comment.CreatedAt).toLocaleString().slice(0, 16)}}</small> 
              </li>
            </ul>
                <p v-else style="text-align: center; color: gray;">尚無留言</p>
          </div>
          <div class="comment">
                <input
                  v-model="newComments[post.PostID]"
                  type="text"
                  placeholder="留言"
                />
              <button @click="submitComment(post.PostID)">送出</button>
          </div>
        </li>         
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const posts= ref([])
const comments= ref({})
const newComments= ref({}) 
const userId=Number(localStorage.getItem("userId"))

const fetchComments= async (postId)=> {
  try {
    const res= await axios.get(`http://localhost:8080/Comment/${postId}`)
    comments.value[postId]= res.data
  } catch (err) {
    console.error(`取得留言失敗（PostID: ${postId}）：`, err)
  }
}

const submitComment= async (postId) => {
  const formattedDate= new Date().toISOString().slice(0, 19).replace('T', ' ');
  const content= newComments.value[postId]
  if (!content) return

  const newComment= {
    userId: userId, 
    postId,
    content,
    createAt: formattedDate
  }

  try {
    await axios.post('http://localhost:8080/Comment', newComment)
    newComments.value[postId]= '' 
    await fetchComments(postId)   
  } catch (err) {
    console.error('留言送出失敗', err)
  }
}

onMounted(async ()=> {
  try {
    const res= await axios.get('http://localhost:8080/Post')
    posts.value= res.data
    res.data.forEach(post=> {
      fetchComments(post.PostID)
      newComments.value[post.PostID] = '' 
    })
  } catch (err) {
    console.error("無法取得貼文：", err)
  }
})
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

h2 {
  margin: 0;
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
.comment{
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}
.comments {
  padding: 10px;
  background-color: #fff;
  width: 100%;
  border-radius: 10px;
  max-height: 120px; 
  overflow-y: auto; 
  margin-bottom: 10px;
}

.comment {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  padding: 10px;
  background-color: #f0f0f0; 
  border-radius: 8px;
}

.comment input {
  width: 90%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.comment button {
  padding: 6px 10px;
  border: none;
  background-color: #96a48b;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.comment button:hover {
  background-color: #ccc;
}

.comments ul {
  display: center;
  padding: 0;
  margin: 0;
  list-style-type: none;
}

.comments div{
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.comments li {
  text-align: center; 
  display: flex;
  justify-content: space-evenly; 
  padding: 10px 0;
  border-bottom: 1px solid silver;
  margin-bottom: 2px;
}

.comments li small {
  color: gray;
  font-size: 12px;
  width: 30%;
  display: flex;
  justify-content: end;
  margin-left: 10px;
  padding-right: 1%;
}

.comments li:last-child {
  border-bottom: none;
}


h3{
  font-size: 15px;
  text-align: start;
  margin-left: 30px;
}
input {
  width: 85%;
  padding: 6px;
  margin-right: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
  background-color:#ccc;
}
</style>
