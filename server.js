const express = require('express')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const app = express()

app.use(express.json())
dotenv.config()

const posts = [
  {
    username: 'admin 1',
    title: 'Post 1'
  }, 
  {
    username: 'admin 2',
    title: 'Post 2'
  }
]

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts)
})

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
