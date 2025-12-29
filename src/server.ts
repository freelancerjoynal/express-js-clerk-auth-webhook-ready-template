import express from 'express'
import 'dotenv/config';


const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

import userRouter from './api/users/user.js'

app.use('/users', userRouter)



app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})