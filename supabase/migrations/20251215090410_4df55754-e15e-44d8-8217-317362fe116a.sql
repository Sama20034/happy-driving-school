-- Create storage bucket for captain images
INSERT INTO storage.buckets (id, name, public) VALUES ('captains', 'captains', true);

-- Storage policies for captain images
CREATE POLICY "Anyone can view captain images"
ON storage.objects FOR SELECT
USING (bucket_id = 'captains');

CREATE POLICY "Admins can upload captain images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'captains' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update captain images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'captains' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete captain images"
ON storage.objects FOR DELETE
USING (bucket_id = 'captains' AND has_role(auth.uid(), 'admin'));

-- Create course pricing table
CREATE TABLE public.course_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  governorate_id UUID REFERENCES governorates(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, governorate_id, branch_id)
);

-- Enable RLS
ALTER TABLE public.course_prices ENABLE ROW LEVEL SECURITY;

-- RLS policies for course_prices
CREATE POLICY "Anyone can read course prices"
ON public.course_prices FOR SELECT
USING (true);

CREATE POLICY "Admins can insert course prices"
ON public.course_prices FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update course prices"
ON public.course_prices FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete course prices"
ON public.course_prices FOR DELETE
USING (has_role(auth.uid(), 'admin'));