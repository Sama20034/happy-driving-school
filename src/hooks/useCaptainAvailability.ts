import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, getDay } from "date-fns";

interface TimeSlot {
  date: string;
  times: string[];
}

interface Availability {
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
}

// Generate time slots from start to end with given duration
const generateTimeSlotsFromRange = (
  startTime: string,
  endTime: string,
  durationMinutes: number
): string[] => {
  const times: string[] = [];
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  const endTotalMinutes = endHour * 60 + endMin;

  while (currentHour * 60 + currentMin + durationMinutes <= endTotalMinutes) {
    times.push(
      `${currentHour.toString().padStart(2, "0")}:${currentMin.toString().padStart(2, "0")}`
    );

    currentMin += durationMinutes;
    while (currentMin >= 60) {
      currentMin -= 60;
      currentHour += 1;
    }
  }

  return times;
};

export const useCaptainAvailability = (captainId: string) => {
  return useQuery({
    queryKey: ["captain-availability", captainId],
    queryFn: async () => {
      if (!captainId) return [];

      // Fetch captain's availability schedule
      const { data: availabilityData, error: availabilityError } = await supabase
        .from("captain_availability")
        .select("*")
        .eq("captain_id", captainId)
        .eq("is_active", true);

      if (availabilityError) throw availabilityError;

      // Fetch existing bookings for this captain in the next 30 days
      const today = new Date();
      const thirtyDaysLater = addDays(today, 30);

      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("booking_date, booking_time")
        .eq("captain_id", captainId)
        .gte("booking_date", format(today, "yyyy-MM-dd"))
        .lte("booking_date", format(thirtyDaysLater, "yyyy-MM-dd"))
        .neq("status", "cancelled");

      if (bookingsError) throw bookingsError;

      // Create a map of booked slots
      const bookedSlots = new Map<string, Set<string>>();
      bookingsData?.forEach((booking) => {
        const dateKey = booking.booking_date;
        if (!bookedSlots.has(dateKey)) {
          bookedSlots.set(dateKey, new Set());
        }
        bookedSlots.get(dateKey)?.add(booking.booking_time);
      });

      // Generate available slots for the next 30 days
      const slots: TimeSlot[] = [];

      for (let i = 1; i <= 30; i++) {
        const date = addDays(today, i);
        const dayOfWeek = getDay(date); // 0 = Sunday
        const dateStr = format(date, "yyyy-MM-dd");

        // Find availability for this day
        const dayAvailability = availabilityData?.find(
          (a: Availability) => a.day_of_week === dayOfWeek
        );

        if (dayAvailability) {
          // Generate time slots
          const allTimes = generateTimeSlotsFromRange(
            dayAvailability.start_time,
            dayAvailability.end_time,
            dayAvailability.slot_duration_minutes
          );

          // Filter out booked times
          const bookedTimesForDate = bookedSlots.get(dateStr) || new Set();
          const availableTimes = allTimes.filter(
            (time) => !bookedTimesForDate.has(time)
          );

          if (availableTimes.length > 0) {
            slots.push({
              date: dateStr,
              times: availableTimes,
            });
          }
        }
      }

      return slots;
    },
    enabled: !!captainId,
  });
};
