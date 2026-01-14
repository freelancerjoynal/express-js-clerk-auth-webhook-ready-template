import 'dotenv/config'
import express from 'express'
import { Webhook } from 'svix'
import { prisma } from '../../lib/prisma.js' // আপনার প্রিজমা ক্লায়েন্ট এর পাথ

const userCreated = express.Router()

userCreated.post('/user/clerk-user-created', express.raw({ type: 'application/json' }), async (req, res) => {
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!SIGNING_SECRET) {
        return res.status(400).send("Error: CLERK_WEBHOOK_SECRET missing in .env");
        console.log('SIGNING_SECRET is missing in .env');
    }

    const wh = new Webhook(SIGNING_SECRET);
    const headers = req.headers;
    const payload = req.body.toString();

    let evt;

    try {
        evt = wh.verify(payload, {
            'svix-id': headers['svix-id'],
            'svix-timestamp': headers['svix-timestamp'],
            'svix-signature': headers['svix-signature'],
        });
    } catch (err) {
        console.log('Verification failed:', err.message);
        return res.status(400).json({ success: false });
    }

    const eventType = evt.type;

    // ইউজার তৈরি বা আপডেট হলে এই ব্লকটি চলবে
    if (eventType === 'user.created' || eventType === 'user.updated') {
        const { first_name, last_name, email_addresses } = evt.data;
        
        // Clerk এর ইমেইল লিস্ট থেকে প্রথম ইমেইলটি নেওয়া
        const primaryEmail = email_addresses[0]?.email_address;

        try {
            const user = await prisma.user.upsert({
                where: {
                    email_addresses: primaryEmail, // schema অনুযায়ী unique field
                },
                update: {
                    first_name: first_name,
                    last_name: last_name,
                },
                create: {
                    email_addresses: primaryEmail,
                    first_name: first_name,
                    last_name: last_name,
                },
            });

            console.log('User Sync Success:', user);
        } catch (error) {
            console.error('Prisma Error:', error);
        }
    }

    res.status(200).json({ success: true, message: 'Webhook processed' });
});

export default userCreated;