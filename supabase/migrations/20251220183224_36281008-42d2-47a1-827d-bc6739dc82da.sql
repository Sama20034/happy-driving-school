-- Insert sample product categories
INSERT INTO public.product_categories (name, description, is_active) VALUES
  ('مستلزمات السيارات', 'جميع مستلزمات وإكسسوارات السيارات', true),
  ('معدات السلامة', 'معدات الأمان والسلامة أثناء القيادة', true),
  ('منتجات العناية', 'منتجات العناية والتنظيف للسيارة', true);

-- Insert sample products using category references
INSERT INTO public.products (name, description, category_id, price, stock_quantity, image_url, is_active)
SELECT 'حامل هاتف للسيارة', 'حامل هاتف مغناطيسي قوي يثبت على فتحات التكييف، يناسب جميع أنواع الهواتف', id, 150, 25, 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500', true
FROM product_categories WHERE name = 'مستلزمات السيارات';

INSERT INTO public.products (name, description, category_id, price, stock_quantity, image_url, is_active)
SELECT 'شاحن سيارة سريع', 'شاحن USB مزدوج بقوة 36 واط مع تقنية الشحن السريع', id, 120, 50, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', true
FROM product_categories WHERE name = 'مستلزمات السيارات';

INSERT INTO public.products (name, description, category_id, price, stock_quantity, image_url, is_active)
SELECT 'كاميرا داش للسيارة', 'كاميرا تسجيل أمامية HD 1080p مع رؤية ليلية وتسجيل دائري', id, 450, 15, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500', true
FROM product_categories WHERE name = 'مستلزمات السيارات';

INSERT INTO public.products (name, description, category_id, price, stock_quantity, image_url, is_active)
SELECT 'طقم إسعافات أولية', 'حقيبة إسعافات أولية شاملة للسيارة تحتوي على 50 قطعة', id, 180, 30, 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500', true
FROM product_categories WHERE name = 'معدات السلامة';

INSERT INTO public.products (name, description, category_id, price, stock_quantity, image_url, is_active)
SELECT 'مثلث تحذير عاكس', 'مثلث تحذير قابل للطي مع عاكسات عالية الوضوح', id, 75, 40, 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500', true
FROM product_categories WHERE name = 'معدات السلامة';

INSERT INTO public.products (name, description, category_id, price, stock_quantity, image_url, is_active)
SELECT 'مطرقة طوارئ', 'مطرقة كسر الزجاج وقاطع حزام الأمان للطوارئ', id, 95, 35, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', true
FROM product_categories WHERE name = 'معدات السلامة';

INSERT INTO public.products (name, description, category_id, price, stock_quantity, image_url, is_active)
SELECT 'شامبو غسيل السيارة', 'شامبو تنظيف فائق الرغوة لامع 1 لتر', id, 85, 60, 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500', true
FROM product_categories WHERE name = 'منتجات العناية';

INSERT INTO public.products (name, description, category_id, price, stock_quantity, image_url, is_active)
SELECT 'ملمع داخلي للسيارة', 'بخاخ تلميع وتنظيف التابلوه والأجزاء البلاستيكية', id, 65, 45, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', true
FROM product_categories WHERE name = 'منتجات العناية';

INSERT INTO public.products (name, description, category_id, price, stock_quantity, image_url, is_active)
SELECT 'فوطة مايكروفايبر', 'طقم 5 فوط مايكروفايبر ناعمة للتجفيف والتلميع', id, 120, 55, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', true
FROM product_categories WHERE name = 'منتجات العناية';