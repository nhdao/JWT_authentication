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

app.post('/login', (req, res) => {
  const userName = req.body.userName
  const user = {name: userName}
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  res.json({
    accessToken: accessToken
  })
})

function authenticateToken(req, res, next) {
  const authHeader = req.header['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) {
    return res.sendStatus(401)
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) {
      return res.sendStatus(403)
    }

    req.user = user
    next()
  })
} 

app.listen(300, () => {
  console.log('Server listening on port 3000')
})
