-- Drop the old select policy that only shows approved reviews
DROP POLICY "Anyone can view approved reviews" ON public.customer_reviews;

-- Create new policy that shows all reviews publicly
CREATE POLICY "Anyone can view all reviews"
ON public.customer_reviews FOR SELECT TO public
USING (true);