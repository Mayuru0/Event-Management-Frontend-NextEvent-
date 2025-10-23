'use server'

import { redirect } from 'next/navigation'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

interface CheckoutData {
  title: string
  description: string
  image: string | null
  ticket_price: number // in cents
  quantity: number
}

export async function createCheckoutSession(data: CheckoutData) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
  
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: data.title,
            description: data.description,
            images: data.image ? [data.image] : [],
          },
          unit_amount: data.ticket_price,
        },
        quantity: data.quantity,
      },
    ],
    mode: 'payment',
    success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/cancel`,
  })

  if (!session.url) {
    throw new Error('Could not create Stripe Checkout session.')
  }

  redirect(session.url)
}
