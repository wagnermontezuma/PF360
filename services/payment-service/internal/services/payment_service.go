package services

import (
	"context"
	"errors"
	"fitness360/payment-service/internal/domain"
	"fitness360/payment-service/internal/repositories"
	"time"
)

type PaymentService struct {
	repo          *repositories.PaymentRepository
	stripeService *StripeService
}

func NewPaymentService(repo *repositories.PaymentRepository, stripeService *StripeService) *PaymentService {
	return &PaymentService{
		repo:          repo,
		stripeService: stripeService,
	}
}

type CreatePaymentInput struct {
	UserID      string
	Amount      int64
	Currency    string
	Description string
	Method      domain.PaymentMethod
	Metadata    map[string]interface{}
}

func (s *PaymentService) CreatePayment(ctx context.Context, input CreatePaymentInput) (*domain.Payment, error) {
	// Criar PaymentIntent no Stripe
	stripeMetadata := make(map[string]string)
	for k, v := range input.Metadata {
		if str, ok := v.(string); ok {
			stripeMetadata[k] = str
		}
	}

	intent, err := s.stripeService.CreatePaymentIntent(ctx, input.Amount, input.Currency, stripeMetadata)
	if err != nil {
		return nil, err
	}

	// Criar pagamento no banco de dados
	payment := &domain.Payment{
		UserID:        input.UserID,
		Amount:        input.Amount,
		Currency:      input.Currency,
		Status:        domain.PaymentStatusPending,
		PaymentMethod: input.Method,
		Description:   input.Description,
		ExternalID:    intent.ID,
		Metadata:      input.Metadata,
	}

	if err := s.repo.Create(ctx, payment); err != nil {
		return nil, err
	}

	return payment, nil
}

type CreateSubscriptionInput struct {
	UserID      string
	PlanID      string
	CustomerID  string
	Description string
	Metadata    map[string]interface{}
}

func (s *PaymentService) CreateSubscription(ctx context.Context, input CreateSubscriptionInput) (*domain.Subscription, error) {
	// Verificar se já existe uma assinatura ativa
	existingSub, _ := s.repo.FindSubscriptionByUserID(ctx, input.UserID)
	if existingSub != nil && existingSub.CanceledAt == nil {
		return nil, errors.New("usuário já possui uma assinatura ativa")
	}

	// Criar assinatura no Stripe
	stripeSub, err := s.stripeService.CreateSubscription(ctx, input.CustomerID, input.PlanID)
	if err != nil {
		return nil, err
	}

	// Criar assinatura no banco de dados
	subscription := &domain.Subscription{
		UserID:            input.UserID,
		PlanID:           input.PlanID,
		Status:           string(stripeSub.Status),
		CurrentPeriodEnd: time.Unix(stripeSub.CurrentPeriodEnd, 0),
		ExternalID:       stripeSub.ID,
		Metadata:         input.Metadata,
	}

	if err := s.repo.CreateSubscription(ctx, subscription); err != nil {
		// Tentar cancelar a assinatura no Stripe em caso de erro
		s.stripeService.CancelSubscription(ctx, stripeSub.ID)
		return nil, err
	}

	return subscription, nil
}

func (s *PaymentService) CancelSubscription(ctx context.Context, userID string) error {
	subscription, err := s.repo.FindSubscriptionByUserID(ctx, userID)
	if err != nil {
		return err
	}

	if subscription.CanceledAt != nil {
		return errors.New("assinatura já está cancelada")
	}

	// Cancelar no Stripe
	_, err = s.stripeService.CancelSubscription(ctx, subscription.ExternalID)
	if err != nil {
		return err
	}

	// Atualizar no banco de dados
	now := time.Now()
	subscription.CanceledAt = &now
	subscription.Status = "canceled"

	return s.repo.UpdateSubscription(ctx, subscription)
}

func (s *PaymentService) GetUserPayments(ctx context.Context, userID string) ([]domain.Payment, error) {
	return s.repo.FindByUserID(ctx, userID)
}

func (s *PaymentService) GetActivePlans(ctx context.Context) ([]domain.Plan, error) {
	return s.repo.FindActivePlans(ctx)
}

func (s *PaymentService) HandleWebhook(ctx context.Context, payload []byte, signature string) error {
	event, err := s.stripeService.HandleWebhook(ctx, payload, signature)
	if err != nil {
		return err
	}

	switch evt := event.(type) {
	case *domain.Payment:
		payment, err := s.repo.FindByExternalID(ctx, evt.ExternalID)
		if err != nil {
			return err
		}
		payment.Status = evt.Status
		payment.PaidAt = evt.PaidAt
		return s.repo.Update(ctx, payment)

	case *domain.Subscription:
		sub, err := s.repo.FindSubscriptionByUserID(ctx, evt.ExternalID)
		if err != nil {
			return err
		}
		sub.Status = evt.Status
		sub.CanceledAt = evt.CanceledAt
		return s.repo.UpdateSubscription(ctx, sub)

	default:
		return errors.New("tipo de evento não suportado")
	}
} 