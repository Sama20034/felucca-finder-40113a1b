CREATE TABLE public.customer_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews"
ON public.customer_reviews FOR SELECT TO public
USING (is_approved = true);

CREATE POLICY "Anyone can submit reviews"
ON public.customer_reviews FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Admins can view all reviews"
ON public.customer_reviews FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update reviews"
ON public.customer_reviews FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete reviews"
ON public.customer_reviews FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));