-- Drop the existing check constraint and add a new one that includes 'wallet'
ALTER TABLE public.return_requests DROP CONSTRAINT IF EXISTS return_requests_refund_type_check;

ALTER TABLE public.return_requests ADD CONSTRAINT return_requests_refund_type_check 
CHECK (refund_type IN ('money', 'points', 'wallet'));