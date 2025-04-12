package domain

import (
	"time"

	"gorm.io/gorm"
)

type PaymentStatus string

const (
	PaymentStatusPending   PaymentStatus = "pending"
	PaymentStatusSuccess   PaymentStatus = "success"
	PaymentStatusFailed    PaymentStatus = "failed"
	PaymentStatusRefunded  PaymentStatus = "refunded"
	PaymentStatusCanceled  PaymentStatus = "canceled"
)

type PaymentMethod string

const (
	PaymentMethodCreditCard PaymentMethod = "credit_card"
	PaymentMethodPix       PaymentMethod = "pix"
	PaymentMethodBoleto    PaymentMethod = "boleto"
)

type Payment struct {
	gorm.Model
	UserID        string        `json:"user_id" gorm:"index"`
	Amount        int64         `json:"amount"`           // em centavos
	Currency      string        `json:"currency"`         // BRL, USD, etc
	Status        PaymentStatus `json:"status"`
	PaymentMethod PaymentMethod `json:"payment_method"`
	Description   string        `json:"description"`
	ExternalID    string        `json:"external_id" gorm:"index"` // ID do Stripe/outro gateway
	Metadata      JSON          `json:"metadata" gorm:"type:jsonb"`
	PaidAt        *time.Time    `json:"paid_at"`
	RefundedAt    *time.Time    `json:"refunded_at"`
	CanceledAt    *time.Time    `json:"canceled_at"`
}

type Subscription struct {
	gorm.Model
	UserID            string    `json:"user_id" gorm:"index"`
	PlanID           string    `json:"plan_id"`
	Status           string    `json:"status"`
	CurrentPeriodEnd time.Time `json:"current_period_end"`
	CanceledAt       *time.Time `json:"canceled_at"`
	ExternalID       string    `json:"external_id" gorm:"index"`
	Metadata         JSON      `json:"metadata" gorm:"type:jsonb"`
}

type Plan struct {
	gorm.Model
	Name        string `json:"name"`
	Description string `json:"description"`
	Amount      int64  `json:"amount"` // em centavos
	Currency    string `json:"currency"`
	Interval    string `json:"interval"` // month, year
	ExternalID  string `json:"external_id" gorm:"index"`
	Active      bool   `json:"active" gorm:"default:true"`
	Features    JSON   `json:"features" gorm:"type:jsonb"`
}

// JSON é um tipo personalizado para campos JSONB
type JSON map[string]interface{} 