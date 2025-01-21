import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateSessionDto } from './dto/create-session.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @MessagePattern({ cmd: 'create_payment_session' })
  createPaymentSession(data: CreateSessionDto) {
    return this.paymentService.createPaymentSession(data);
  }

  @Post('webhook')
  paymentStatusHook(@Body() paymentStatus: any) {
    console.log(paymentStatus);

    // const res = {
    //   id: 'evt_1QjPEZD1key56JX1Frx2BrbQ',
    //   object: 'event',
    //   api_version: '2024-12-18.acacia',
    //   created: 1737395879,
    //   data: {
    //     object: {
    //       id: 'cs_test_a1z8Kp9vI1joLQa7d98YewabTDExDBuCIvWjFfI7CetjVppxrbRACasHbp',
    //       object: 'checkout.session',
    //       amount_total: 2000,
    //       cancel_url: 'https://example.com/cancel',
    //       created: 1737395747,
    //       currency: 'usd',
    //       mode: 'payment',
    //       payment_intent: 'pi_3QjPEYD1key56JX11RfS791Y',
    //       payment_status: 'paid',
    //       status: 'complete',
    //       ui_mode: 'hosted',
    //     },
    //   },
    //   type: 'checkout.session.completed',
    // };
  }
}
