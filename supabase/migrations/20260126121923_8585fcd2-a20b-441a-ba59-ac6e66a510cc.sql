-- Create captain wallets table
CREATE TABLE public.captain_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  captain_id UUID NOT NULL REFERENCES public.captain_profiles(id) ON DELETE CASCADE,
  balance NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(captain_id)
);

-- Create wallet transactions table for history
CREATE TABLE public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID NOT NULL REFERENCES public.captain_wallets(id) ON DELETE CASCADE,
  captain_id UUID NOT NULL REFERENCES public.captain_profiles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'settlement')),
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.captain_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Wallets policies
CREATE POLICY "Admins can view all wallets"
ON public.captain_wallets FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert wallets"
ON public.captain_wallets FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update wallets"
ON public.captain_wallets FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Captains can view own wallet"
ON public.captain_wallets FOR SELECT
USING (EXISTS (
  SELECT 1 FROM captain_profiles
  WHERE captain_profiles.id = captain_wallets.captain_id
  AND captain_profiles.user_id = auth.uid()
));

-- Transactions policies
CREATE POLICY "Admins can view all transactions"
ON public.wallet_transactions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert transactions"
ON public.wallet_transactions FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Captains can view own transactions"
ON public.wallet_transactions FOR SELECT
USING (EXISTS (
  SELECT 1 FROM captain_profiles
  WHERE captain_profiles.id = wallet_transactions.captain_id
  AND captain_profiles.user_id = auth.uid()
));

-- Trigger to update wallet updated_at
CREATE TRIGGER update_captain_wallets_updated_at
BEFORE UPDATE ON public.captain_wallets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();