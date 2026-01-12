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


import userRouter from './api/users/userRoutes.ts'
app.use('/api/user', userRouter)



app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000')
})


