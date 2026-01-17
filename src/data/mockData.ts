// Mock data for the booking system - will be replaced with Supabase data later

export const governorates = [
  { id: "1", name: "القاهرة" },
  { id: "2", name: "الجيزة" },
  { id: "3", name: "الإسكندرية" },
  { id: "4", name: "الدقهلية" },
];

export const branches = [
  { id: "1", governorateId: "1", name: "فرع مدينة نصر", address: "شارع عباس العقاد" },
  { id: "2", governorateId: "1", name: "فرع المعادي", address: "شارع 9 المعادي" },
  { id: "3", governorateId: "2", name: "فرع الهرم", address: "شارع الهرم الرئيسي" },
  { id: "4", governorateId: "2", name: "فرع 6 أكتوبر", address: "المحور المركزي" },
  { id: "5", governorateId: "3", name: "فرع سموحة", address: "شارع فوزي معاذ" },
  { id: "6", governorateId: "4", name: "فرع المنصورة", address: "شارع الجمهورية" },
];

export const courses = [
  { 
    id: "1", 
    title: "كورس تمهيدي", 
    sessions: 4, 
    price: 800,
    description: "للمبتدئين الجدد - تعلم أساسيات القيادة" 
  },
  { 
    id: "2", 
    title: "كورس ممارسة", 
    sessions: 6, 
    price: 1200,
    description: "لمن لديه خبرة سابقة - تحسين المهارات" 
  },
  { 
    id: "3", 
    title: "كورس المبتدئين", 
    sessions: 10, 
    price: 2000,
    description: "كورس شامل من الصفر حتى الاحتراف" 
  },
  { 
    id: "4", 
    title: "حجز بالحصة", 
    sessions: 1, 
    price: 250,
    description: "حصة واحدة للتدريب أو المراجعة" 
  },
];

export const captains = [
  { id: "1", branchId: "1", name: "كابتن أحمد محمود", image: "https://i.pravatar.cc/150?img=11", rating: 4.9 },
  { id: "2", branchId: "1", name: "كابتن محمد علي", image: "https://i.pravatar.cc/150?img=12", rating: 4.8 },
  { id: "3", branchId: "2", name: "كابتن خالد حسن", image: "https://i.pravatar.cc/150?img=13", rating: 4.7 },
  { id: "4", branchId: "3", name: "كابتن عمر سعيد", image: "https://i.pravatar.cc/150?img=14", rating: 4.9 },
  { id: "5", branchId: "4", name: "كابتن يوسف أحمد", image: "https://i.pravatar.cc/150?img=15", rating: 4.6 },
  { id: "6", branchId: "5", name: "كابتن إبراهيم فتحي", image: "https://i.pravatar.cc/150?img=16", rating: 4.8 },
  { id: "7", branchId: "6", name: "كابتن مصطفى كمال", image: "https://i.pravatar.cc/150?img=17", rating: 4.7 },
];

// Generate available time slots for the next 14 days
export const generateTimeSlots = (captainId: string) => {
  const slots: { date: string; times: string[] }[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Skip Fridays (day 5)
    if (date.getDay() === 5) continue;
    
    const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
    // Randomly remove some times to simulate booked slots
    const availableTimes = times.filter(() => Math.random() > 0.3);
    
    if (availableTimes.length > 0) {
      slots.push({
        date: date.toISOString().split("T")[0],
        times: availableTimes,
      });
    }
  }
  
  return slots;
};
