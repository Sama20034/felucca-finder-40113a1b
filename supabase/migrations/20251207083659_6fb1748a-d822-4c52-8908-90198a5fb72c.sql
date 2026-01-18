-- Create order status history table
CREATE TABLE public.order_status_history (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view order status history"
ON public.order_status_history
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage order status history"
ON public.order_status_history
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX idx_order_status_history_order_id ON public.order_status_history(order_id);

-- Insert initial history for existing orders
INSERT INTO public.order_status_history (order_id, status, note, created_at)
SELECT id, status::text, 'Initial status', created_at
FROM public.orders
WHERE status IS NOT NULL;