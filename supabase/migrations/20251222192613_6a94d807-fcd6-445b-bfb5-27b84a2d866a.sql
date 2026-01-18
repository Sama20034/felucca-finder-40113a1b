-- Add wallet refund option to return settings
ALTER TABLE public.return_settings 
ADD COLUMN IF NOT EXISTS allow_wallet_refund boolean DEFAULT true;