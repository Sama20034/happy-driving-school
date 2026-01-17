-- Insert sample governorates
INSERT INTO public.governorates (id, name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'القاهرة'),
  ('22222222-2222-2222-2222-222222222222', 'الجيزة'),
  ('33333333-3333-3333-3333-333333333333', 'الإسكندرية'),
  ('44444444-4444-4444-4444-444444444444', 'الدقهلية');

-- Insert sample branches
INSERT INTO public.branches (id, governorate_id, name, address) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'فرع مدينة نصر', 'شارع عباس العقاد'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'فرع المعادي', 'شارع 9 المعادي'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'فرع الهرم', 'شارع الهرم الرئيسي'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'فرع 6 أكتوبر', 'المحور المركزي'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'فرع سموحة', 'شارع فوزي معاذ'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '44444444-4444-4444-4444-444444444444', 'فرع المنصورة', 'شارع الجمهورية');

-- Insert sample courses
INSERT INTO public.courses (id, title, sessions, price, description) VALUES
  ('11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'كورس تمهيدي', 4, 800.00, 'للمبتدئين الجدد - تعلم أساسيات القيادة'),
  ('22222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'كورس ممارسة', 6, 1200.00, 'لمن لديه خبرة سابقة - تحسين المهارات'),
  ('33333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'كورس المبتدئين', 10, 2000.00, 'كورس شامل من الصفر حتى الاحتراف'),
  ('44444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'حجز بالحصة', 1, 250.00, 'حصة واحدة للتدريب أو المراجعة');

-- Insert sample captains
INSERT INTO public.captains (id, branch_id, name, image_url, rating) VALUES
  ('11111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'كابتن أحمد محمود', 'https://i.pravatar.cc/150?img=11', 4.9),
  ('22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'كابتن محمد علي', 'https://i.pravatar.cc/150?img=12', 4.8),
  ('33333333-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'كابتن خالد حسن', 'https://i.pravatar.cc/150?img=13', 4.7),
  ('44444444-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'كابتن عمر سعيد', 'https://i.pravatar.cc/150?img=14', 4.9),
  ('55555555-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'كابتن يوسف أحمد', 'https://i.pravatar.cc/150?img=15', 4.6),
  ('66666666-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'كابتن إبراهيم فتحي', 'https://i.pravatar.cc/150?img=16', 4.8),
  ('77777777-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'كابتن مصطفى كمال', 'https://i.pravatar.cc/150?img=17', 4.7);