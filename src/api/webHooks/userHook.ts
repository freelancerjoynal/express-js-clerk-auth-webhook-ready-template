// routes/userHook.js
import express from 'express';
import { clerkUserActionHook } from '../../controllers/webHooks/userHook.js'; 

const userHook = express.Router();

userHook.post(
    '/user/clerk-user-created',
    express.raw({ type: 'application/json' }),
    clerkUserActionHook
);

export default userHook;
