-- Insert 4 more products
INSERT INTO public.products (name, description, category_id, price, stock_quantity, image_url, is_active)
SELECT 'جهاز ضخ هواء كهربائي', 'منفاخ كهربائي للإطارات مع شاشة ديجيتال لقياس الضغط، يعمل على ولاعة السيارة 12V', id, 320, 20, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', true
FROM product_categories WHERE name = 'مستلزمات السيارات';

INSERT INTO public.products (name, description, category_id, price, stock_quantity, image_url, is_active)
SELECT 'سجادة أرضية للسيارة', 'طقم سجاد أرضي 5 قطع مقاوم للماء والأتربة، سهل التنظيف', id, 280, 30, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500', true
FROM product_categories WHERE name = 'مستلزمات السيارات';

INSERT INTO public.products (name, description, category_id, price, stock_quantity, image_url, is_active)
SELECT 'طفاية حريق للسيارة', 'طفاية حريق صغيرة 1 كجم مناسبة للسيارات مع حامل تثبيت', id, 220, 25, 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500', true
FROM product_categories WHERE name = 'معدات السلامة';

INSERT INTO public.products (name, description, category_id, price, stock_quantity, image_url, is_active)
SELECT 'ملمع إطارات', 'بخاخ تلميع الإطارات يعطي لمعان دائم وحماية من التشقق 500 مل', id, 55, 70, 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500', true
FROM product_categories WHERE name = 'منتجات العناية';