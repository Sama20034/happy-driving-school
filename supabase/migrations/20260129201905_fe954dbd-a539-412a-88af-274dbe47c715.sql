-- Add policy to allow anyone to read active products
CREATE POLICY "Anyone can read active products" 
ON public.products 
FOR SELECT 
USING (is_active = true);