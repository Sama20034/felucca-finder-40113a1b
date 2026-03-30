-- Add admin_reply column and change default approval to true
ALTER TABLE public.customer_reviews 
  ADD COLUMN admin_reply text,
  ALTER COLUMN is_approved SET DEFAULT true;