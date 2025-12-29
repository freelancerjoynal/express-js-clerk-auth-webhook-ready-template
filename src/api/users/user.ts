import express from 'express'
import { prisma } from '../../lib/prisma.ts'



const router = express.Router()

router.post('/create', async (req, res) => {
  try {
    // Dummy data for testing
    const dummyUser = {
      name: `${Math.random().toString(36).substring(2, 10)}`,
      email: `${Math.random().toString(36).substring(2, 10)}@prisma.io`,
    }

    const user = await prisma.user.create({
      data: dummyUser,
    })

    res.json({
      message: 'Dummy user created successfully',
      user,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create dummy user' })
  }
})

export default router