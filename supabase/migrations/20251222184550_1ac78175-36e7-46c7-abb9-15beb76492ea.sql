-- Create wallets for existing users who don't have one
INSERT INTO public.wallets (user_id, balance)
SELECT id, 0 FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.wallets w WHERE w.user_id = u.id)
ON CONFLICT (user_id) DO NOTHING;

-- Create trigger to automatically create wallet for new users
CREATE OR REPLACE TRIGGER on_auth_user_created_wallet
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_wallet();