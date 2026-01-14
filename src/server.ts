import express from 'express'
import { clerkMiddleware } from '@clerk/express'
import 'dotenv/config';
import cors from 'cors';



const app = express()
app.use(cors({
  origin: 'http://localhost:3000', // Your Next.js origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Crucial for Clerk
}));
app.use(clerkMiddleware())

app.get('/', (req, res) => {
  res.send('User is not authenticated')
})


import userHook from './api/webHooks/userHook.js'
app.use('/api/webhooks', userHook)


const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})


