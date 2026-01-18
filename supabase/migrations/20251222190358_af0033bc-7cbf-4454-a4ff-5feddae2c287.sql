-- Add 'refund' type to loyalty_transaction_type enum
ALTER TYPE public.loyalty_transaction_type ADD VALUE IF NOT EXISTS 'refund';