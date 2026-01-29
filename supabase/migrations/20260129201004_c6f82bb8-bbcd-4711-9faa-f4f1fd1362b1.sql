-- Insert test products for the store
INSERT INTO public.products (name, description, price, category_id, stock_quantity, is_active, image_url)
VALUES 
  ('حامل الموبايل المغناطيسي', 'حامل موبايل مغناطيسي قوي للسيارة، سهل التركيب على التابلوه أو فتحة التكييف', 150, 'b40386d1-136c-46b7-b4d5-caf4f5b22ce2', 50, true, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400'),
  ('معطر سيارة فاخر', 'معطر سيارة برائحة الفانيليا الفرنسية، يدوم حتى 60 يوم', 85, 'b40386d1-136c-46b7-b4d5-caf4f5b22ce2', 100, true, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400'),
  ('مثلث التحذير العاكس', 'مثلث تحذير عاكس للطوارئ، قابل للطي وسهل الحمل، معتمد دولياً', 120, 'cafb90b0-64a4-4421-b8a9-79f47269c371', 30, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'),
  ('طقم إسعافات أولية للسيارة', 'طقم إسعافات أولية شامل يحتوي على جميع المستلزمات الطبية الأساسية', 250, 'cafb90b0-64a4-4421-b8a9-79f47269c371', 25, true, 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400'),
  ('شامبو غسيل السيارات', 'شامبو غسيل سيارات مركز عالي الجودة، رغوة كثيفة ولمعان مميز', 95, 'a097e893-9aa6-4fbb-baed-11242e45fb54', 75, true, 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400');