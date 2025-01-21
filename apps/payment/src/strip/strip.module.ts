import { DynamicModule, Module } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_SERVICE } from '../constants';

@Module({})
export class StripModule {
  static forRoot(apiKey: string, config?: Stripe.StripeConfig): DynamicModule {
    const stripe = new Stripe(apiKey, config);

    const provideStripe = { provide: STRIPE_SERVICE, useValue: stripe };

    return {
      module: StripModule,
      providers: [provideStripe],
      exports: [provideStripe],
      global: true,
    };
  }
}
