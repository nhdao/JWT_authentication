const express = require('express')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const app = express()

app.use(express.json())
dotenv.config()

let refreshTokens = []

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if(refreshToken == null) {
    return res.sendStatus(401)
  }

  if(!refreshTokens.includes(refreshToken)) {
    return res.sendStatus(403)
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if(err) {
      return res.sendStatus(403)
    }
    const accessToken = generateAccessToken({name: user.name})
    res.json({accessToken: accessToken})
  })
})

app.post('/login', (req, res) => {
  const userName = req.body.userName
  const user = {name: userName}
  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  res.json({
    accessToken: accessToken,
    refreshToken: refreshToken
  })
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '10m'
  })
} 

app.listen(4000, () => {
  console.log('Server listening on port 4000')
})
