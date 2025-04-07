import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Payment, PaymentMethod } from '../../domain/entities/payment.entity';
import { PaymentsService } from './payments.service';

@Resolver(() => Payment)
export class PaymentsResolver {
  constructor(private paymentsService: PaymentsService) {}

  @Query(() => Payment, { nullable: true })
  async payment(@Args('id') id: string): Promise<Payment> {
    return this.paymentsService.getPaymentById(id);
  }

  @Query(() => [Payment])
  async paymentsByMember(@Args('memberId') memberId: string): Promise<Payment[]> {
    return this.paymentsService.getPaymentsByMemberId(memberId);
  }

  @Query(() => [Payment])
  async paymentsByInvoice(@Args('invoiceId') invoiceId: string): Promise<Payment[]> {
    return this.paymentsService.getPaymentsByInvoiceId(invoiceId);
  }

  @Mutation(() => Payment)
  async createPayment(
    @Args('invoiceId') invoiceId: string,
    @Args('memberId') memberId: string,
    @Args('amount') amount: number,
    @Args('currency') currency: string,
    @Args('paymentMethod') paymentMethod: PaymentMethod,
    @Args('tenantId') tenantId: string,
  ): Promise<Payment> {
    return this.paymentsService.createPayment({
      invoiceId,
      memberId,
      amount,
      currency,
      paymentMethod,
      tenantId,
    });
  }
} 