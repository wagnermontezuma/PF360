package services

import (
	"context"
	"errors"
	"fitness360/payment-service/internal/domain"
	"time"

	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/customer"
	"github.com/stripe/stripe-go/v74/paymentintent"
	"github.com/stripe/stripe-go/v74/plan"
	"github.com/stripe/stripe-go/v74/subscription"
)

type StripeService struct {
	apiKey string
}

func NewStripeService(apiKey string) *StripeService {
	stripe.Key = apiKey
	return &StripeService{apiKey: apiKey}
}

func (s *StripeService) CreatePaymentIntent(ctx context.Context, amount int64, currency string, metadata map[string]string) (*stripe.PaymentIntent, error) {
	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(amount),
		Currency: stripe.String(currency),
		Metadata: metadata,
		PaymentMethodTypes: stripe.StringSlice([]string{
			"card",
		}),
	}

	return paymentintent.New(params)
}

func (s *StripeService) CreateCustomer(ctx context.Context, email, name string) (*stripe.Customer, error) {
	params := &stripe.CustomerParams{
		Email: stripe.String(email),
		Name:  stripe.String(name),
	}

	return customer.New(params)
}

func (s *StripeService) CreatePlan(ctx context.Context, name string, amount int64, interval string, currency string) (*stripe.Plan, error) {
	params := &stripe.PlanParams{
		Nickname: stripe.String(name),
		Amount:   stripe.Int64(amount),
		Currency: stripe.String(currency),
		Interval: stripe.String(interval),
		Product: &stripe.PlanProductParams{
			Name: stripe.String(name),
		},
	}

	return plan.New(params)
}

func (s *StripeService) CreateSubscription(ctx context.Context, customerID, planID string) (*stripe.Subscription, error) {
	params := &stripe.SubscriptionParams{
		Customer: stripe.String(customerID),
		Items: []*stripe.SubscriptionItemsParams{
			{
				Plan: stripe.String(planID),
			},
		},
	}

	return subscription.New(params)
}

func (s *StripeService) CancelSubscription(ctx context.Context, subscriptionID string) (*stripe.Subscription, error) {
	return subscription.Cancel(subscriptionID, nil)
}

func (s *StripeService) HandleWebhook(ctx context.Context, payload []byte, signature string) (interface{}, error) {
	const webhookSecret = "seu_webhook_secret_aqui"

	event, err := stripe.ConstructEvent(payload, signature, webhookSecret)
	if err != nil {
		return nil, err
	}

	switch event.Type {
	case "payment_intent.succeeded":
		var paymentIntent stripe.PaymentIntent
		err := json.Unmarshal(event.Data.Raw, &paymentIntent)
		if err != nil {
			return nil, err
		}
		return &domain.Payment{
			ExternalID: paymentIntent.ID,
			Status:    domain.PaymentStatusSuccess,
			PaidAt:    &time.Time{Time: time.Unix(paymentIntent.Created, 0)},
		}, nil

	case "payment_intent.payment_failed":
		var paymentIntent stripe.PaymentIntent
		err := json.Unmarshal(event.Data.Raw, &paymentIntent)
		if err != nil {
			return nil, err
		}
		return &domain.Payment{
			ExternalID: paymentIntent.ID,
			Status:    domain.PaymentStatusFailed,
		}, nil

	case "customer.subscription.deleted":
		var sub stripe.Subscription
		err := json.Unmarshal(event.Data.Raw, &sub)
		if err != nil {
			return nil, err
		}
		cancelTime := time.Unix(sub.CanceledAt, 0)
		return &domain.Subscription{
			ExternalID:  sub.ID,
			Status:      "canceled",
			CanceledAt:  &cancelTime,
		}, nil

	default:
		return nil, errors.New("unhandled event type")
	}
} 