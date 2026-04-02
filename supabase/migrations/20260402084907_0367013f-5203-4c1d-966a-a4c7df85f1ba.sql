
-- Function to list all admin users with their emails
CREATE OR REPLACE FUNCTION public.list_admin_emails()
RETURNS TABLE(user_id uuid, email text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ur.user_id, au.email::text
  FROM public.user_roles ur
  JOIN auth.users au ON au.id = ur.user_id
  WHERE ur.role = 'admin'
  ORDER BY au.email;
$$;

-- Function to grant admin role by email
CREATE OR REPLACE FUNCTION public.grant_admin_by_email(_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
BEGIN
  -- Only allow existing admins to call this
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Find user by email
  SELECT id INTO _user_id FROM auth.users WHERE email = _email;
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User not found with this email';
  END IF;

  -- Insert admin role (ignore if already exists)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN true;
END;
$$;

-- Function to revoke admin role by email
CREATE OR REPLACE FUNCTION public.revoke_admin_by_email(_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
BEGIN
  -- Only allow existing admins to call this
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Find user by email
  SELECT id INTO _user_id FROM auth.users WHERE email = _email;
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User not found with this email';
  END IF;

  -- Prevent removing yourself
  IF _user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot remove your own admin access';
  END IF;

  DELETE FROM public.user_roles WHERE user_id = _user_id AND role = 'admin';

  RETURN true;
END;
$$;
