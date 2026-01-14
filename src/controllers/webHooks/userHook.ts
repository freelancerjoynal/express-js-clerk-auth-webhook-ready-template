// controllers/userController.js
import { Webhook } from 'svix';
import { prisma } from '../../lib/prisma.js';

export const clerkUserActionHook = async (req, res) => {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    console.log('SIGNING_SECRET is missing in .env');
    return res.status(400).send("Error: CLERK_WEBHOOK_SECRET missing in .env");
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

  // Handle user creation or update
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, first_name, last_name, email_addresses } = evt.data;
    const primaryEmail = email_addresses[0]?.email_address;

    try {
      const user = await prisma.user.upsert({
        where: { clerk_id: id }, // use Clerk ID as the unique identifier
        update: {
          first_name,
          last_name,
          email_addresses: primaryEmail,
        },
        create: {
          clerk_id: id,
          email_addresses: primaryEmail,
          first_name,
          last_name,
        },
      });

      console.log('User Sync Success:', user);
    } catch (error) {
      console.error('Prisma Error:', error);
    }
  }

  // Handle user deletion
  if (eventType === 'user.deleted') {
    const { id } = evt.data; // Clerk user ID
    try {
      await prisma.user.delete({
        where: { clerk_id: id },
      });
      console.log(`User with Clerk ID ${id} deleted successfully`);
    } catch (error) {
      console.error('Prisma Delete Error:', error);
    }
  }

  res.status(200).json({ success: true, message: 'Webhook processed' });
};