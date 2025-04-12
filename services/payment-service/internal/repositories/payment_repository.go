package repositories

import (
	"context"
	"fitness360/payment-service/internal/domain"
	"gorm.io/gorm"
)

type PaymentRepository struct {
	db *gorm.DB
}

func NewPaymentRepository(db *gorm.DB) *PaymentRepository {
	return &PaymentRepository{db: db}
}

func (r *PaymentRepository) Create(ctx context.Context, payment *domain.Payment) error {
	return r.db.WithContext(ctx).Create(payment).Error
}

func (r *PaymentRepository) Update(ctx context.Context, payment *domain.Payment) error {
	return r.db.WithContext(ctx).Save(payment).Error
}

func (r *PaymentRepository) FindByID(ctx context.Context, id uint) (*domain.Payment, error) {
	var payment domain.Payment
	if err := r.db.WithContext(ctx).First(&payment, id).Error; err != nil {
		return nil, err
	}
	return &payment, nil
}

func (r *PaymentRepository) FindByUserID(ctx context.Context, userID string) ([]domain.Payment, error) {
	var payments []domain.Payment
	if err := r.db.WithContext(ctx).Where("user_id = ?", userID).Find(&payments).Error; err != nil {
		return nil, err
	}
	return payments, nil
}

func (r *PaymentRepository) FindByExternalID(ctx context.Context, externalID string) (*domain.Payment, error) {
	var payment domain.Payment
	if err := r.db.WithContext(ctx).Where("external_id = ?", externalID).First(&payment).Error; err != nil {
		return nil, err
	}
	return &payment, nil
}

// Métodos para Subscription
func (r *PaymentRepository) CreateSubscription(ctx context.Context, subscription *domain.Subscription) error {
	return r.db.WithContext(ctx).Create(subscription).Error
}

func (r *PaymentRepository) UpdateSubscription(ctx context.Context, subscription *domain.Subscription) error {
	return r.db.WithContext(ctx).Save(subscription).Error
}

func (r *PaymentRepository) FindSubscriptionByUserID(ctx context.Context, userID string) (*domain.Subscription, error) {
	var subscription domain.Subscription
	if err := r.db.WithContext(ctx).Where("user_id = ? AND canceled_at IS NULL", userID).First(&subscription).Error; err != nil {
		return nil, err
	}
	return &subscription, nil
}

// Métodos para Plan
func (r *PaymentRepository) CreatePlan(ctx context.Context, plan *domain.Plan) error {
	return r.db.WithContext(ctx).Create(plan).Error
}

func (r *PaymentRepository) UpdatePlan(ctx context.Context, plan *domain.Plan) error {
	return r.db.WithContext(ctx).Save(plan).Error
}

func (r *PaymentRepository) FindActivePlans(ctx context.Context) ([]domain.Plan, error) {
	var plans []domain.Plan
	if err := r.db.WithContext(ctx).Where("active = ?", true).Find(&plans).Error; err != nil {
		return nil, err
	}
	return plans, nil
}

func (r *PaymentRepository) FindPlanByID(ctx context.Context, id uint) (*domain.Plan, error) {
	var plan domain.Plan
	if err := r.db.WithContext(ctx).First(&plan, id).Error; err != nil {
		return nil, err
	}
	return &plan, nil
} 