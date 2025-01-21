import { Inject, Injectable } from '@nestjs/common';
import { STRIPE_SERVICE } from './constants';
import Stripe from 'stripe';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class PaymentService {
  constructor(@Inject(STRIPE_SERVICE) private readonly stripeClint: Stripe) {}
  async createPaymentSession(data: CreateSessionDto) {
    const items = data.items.map((item) => {
      return {
        price_data: {
          currency: item.currency,
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },

        quantity: item.quantity,
      };
    });

    const session = await this.stripeClint.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });

    return session.url;
  }
}
