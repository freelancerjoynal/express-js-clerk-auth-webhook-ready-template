import 'dotenv/config'

import { clerkClient, requireAuth, getAuth } from '@clerk/express'
import express from 'express'



const userRouter = express.Router()

userRouter.get('/', requireAuth(), async (req, res) => {

    const { userId } = getAuth(req)

    // Use Clerk's JavaScript Backend SDK to get the user's User object
    const user = await clerkClient.users.getUser(userId)

    return res.json({ user })



})

export default userRouter
