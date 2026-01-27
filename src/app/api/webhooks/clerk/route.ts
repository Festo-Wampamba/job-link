import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { inngest } from '@/services/inngest/client'
import { env } from '@/data/env/server'

export async function POST(req: Request) {
  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  const payload = await req.text()
  const body = JSON.parse(payload)

  // Verify webhook signature
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Invalid signature', { status: 400 })
  }

  // Send event to Inngest based on event type
  const eventType = evt.type

  try {
    if (eventType === 'user.created') {
      await inngest.send({
        name: 'clerk/user.created',
        data: {
          data: evt.data,
          raw: payload,
          headers: {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature,
          },
        },
      })
      console.log('✅ Sent user.created event to Inngest:', evt.data.id)
    } else if (eventType === 'user.updated') {
      await inngest.send({
        name: 'clerk/user.updated',
        data: {
          data: evt.data,
          raw: payload,
          headers: {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature,
          },
        },
      })
      console.log('✅ Sent user.updated event to Inngest:', evt.data.id)
    } else if (eventType === 'user.deleted') {
      await inngest.send({
        name: 'clerk/user.deleted',
        data: {
          data: evt.data,
          raw: payload,
          headers: {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature,
          },
        },
      })
      console.log('✅ Sent user.deleted event to Inngest:', evt.data.id)
    }

    return new Response('Webhook processed successfully', { status: 200 })
  } catch (error) {
    console.error('Error sending event to Inngest:', error)
    return new Response('Error processing webhook', { status: 500 })
  }
}
