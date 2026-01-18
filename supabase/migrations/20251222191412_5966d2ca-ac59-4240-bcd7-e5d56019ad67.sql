-- Fix the existing return request - add 735 points to user
UPDATE profiles 
SET loyalty_points = COALESCE(loyalty_points, 0) + 735 
WHERE id = 'e12aa450-7710-4f1a-a3c8-e868b2457662';

-- Record the loyalty transaction
INSERT INTO loyalty_transactions (user_id, points, type, description, order_id)
VALUES (
  'e12aa450-7710-4f1a-a3c8-e868b2457662',
  735,
  'refund',
  'استرداد للطلب ORD202512220001',
  3
);