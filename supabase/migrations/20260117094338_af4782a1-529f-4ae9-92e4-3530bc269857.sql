
-- Create captain_profiles table for extended captain info
CREATE TABLE public.captain_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  governorate_id UUID REFERENCES public.governorates(id),
  car_type TEXT,
  transmission_type TEXT CHECK (transmission_type IN ('manual', 'automatic')),
  car_photo_url TEXT,
  personal_photo_url TEXT,
  hourly_rate NUMERIC NOT NULL DEFAULT 100,
  bio TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC DEFAULT 5.0,
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create captain_availability table for time slots
CREATE TABLE public.captain_schedule (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  captain_id UUID NOT NULL REFERENCES public.captain_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(captain_id, day_of_week, start_time)
);

-- Create captain_bookings table
CREATE TABLE public.captain_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  captain_id UUID NOT NULL REFERENCES public.captain_profiles(id) ON DELETE CASCADE,
  trainee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'completed', 'cancelled')),
  total_price NUMERIC NOT NULL,
  trainee_name TEXT NOT NULL,
  trainee_phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_conversations table
CREATE TABLE public.chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.captain_bookings(id) ON DELETE CASCADE,
  captain_id UUID NOT NULL REFERENCES public.captain_profiles(id) ON DELETE CASCADE,
  trainee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(booking_id)
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image')),
  content TEXT NOT NULL,
  image_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'booking', 'chat', 'system')),
  related_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.captain_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.captain_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.captain_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Captain profiles policies
CREATE POLICY "Anyone can view captain profiles" ON public.captain_profiles FOR SELECT USING (true);
CREATE POLICY "Captains can update own profile" ON public.captain_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Captains can insert own profile" ON public.captain_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Captain schedule policies
CREATE POLICY "Anyone can view captain schedules" ON public.captain_schedule FOR SELECT USING (true);
CREATE POLICY "Captains can manage own schedule" ON public.captain_schedule FOR ALL USING (
  EXISTS (SELECT 1 FROM public.captain_profiles WHERE id = captain_schedule.captain_id AND user_id = auth.uid())
);

-- Captain bookings policies
CREATE POLICY "Captains can view their bookings" ON public.captain_bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.captain_profiles WHERE id = captain_bookings.captain_id AND user_id = auth.uid())
);
CREATE POLICY "Trainees can view their bookings" ON public.captain_bookings FOR SELECT USING (auth.uid() = trainee_id);
CREATE POLICY "Trainees can create bookings" ON public.captain_bookings FOR INSERT WITH CHECK (auth.uid() = trainee_id);
CREATE POLICY "Captains can update booking status" ON public.captain_bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.captain_profiles WHERE id = captain_bookings.captain_id AND user_id = auth.uid())
);
CREATE POLICY "Trainees can cancel their bookings" ON public.captain_bookings FOR UPDATE USING (auth.uid() = trainee_id);

-- Chat conversations policies
CREATE POLICY "Participants can view conversations" ON public.chat_conversations FOR SELECT USING (
  auth.uid() = trainee_id OR 
  EXISTS (SELECT 1 FROM public.captain_profiles WHERE id = chat_conversations.captain_id AND user_id = auth.uid())
);
CREATE POLICY "System can create conversations" ON public.chat_conversations FOR INSERT WITH CHECK (
  auth.uid() = trainee_id OR 
  EXISTS (SELECT 1 FROM public.captain_profiles WHERE id = chat_conversations.captain_id AND user_id = auth.uid())
);

-- Chat messages policies
CREATE POLICY "Participants can view messages" ON public.chat_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chat_conversations c 
    WHERE c.id = chat_messages.conversation_id 
    AND (c.trainee_id = auth.uid() OR EXISTS (SELECT 1 FROM public.captain_profiles WHERE id = c.captain_id AND user_id = auth.uid()))
  )
);
CREATE POLICY "Participants can send messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Participants can mark messages as read" ON public.chat_messages FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.chat_conversations c 
    WHERE c.id = chat_messages.conversation_id 
    AND (c.trainee_id = auth.uid() OR EXISTS (SELECT 1 FROM public.captain_profiles WHERE id = c.captain_id AND user_id = auth.uid()))
  )
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_captain_profiles_governorate ON public.captain_profiles(governorate_id);
CREATE INDEX idx_captain_profiles_available ON public.captain_profiles(is_available);
CREATE INDEX idx_captain_schedule_captain ON public.captain_schedule(captain_id);
CREATE INDEX idx_captain_bookings_captain ON public.captain_bookings(captain_id);
CREATE INDEX idx_captain_bookings_trainee ON public.captain_bookings(trainee_id);
CREATE INDEX idx_captain_bookings_date ON public.captain_bookings(booking_date);
CREATE INDEX idx_chat_messages_conversation ON public.chat_messages(conversation_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_captain_profiles_updated_at
  BEFORE UPDATE ON public.captain_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_captain_bookings_updated_at
  BEFORE UPDATE ON public.captain_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for chat messages and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
