import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Car, MapPin, Clock, User, Image, GraduationCap } from "lucide-react";

interface Captain {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  governorate_id: string;
  governorate_name?: string;
  car_type: string;
  transmission_type: string;
  car_photo_url: string;
  personal_photo_url: string;
  hourly_rate: number;
  bio: string;
  is_available: boolean;
  rating: number;
  total_sessions: number;
}

interface CoursePrice {
  course_type: string;
  session_price: number;
}

const COURSE_CONFIG: Record<string, { name: string; sessions: number }> = {
  practice: { name: "كورس الممارسة", sessions: 6 },
  beginner: { name: "كورس المبتدئين", sessions: 8 },
  professional: { name: "كورس الاحتراف", sessions: 10 }
};

const DISCOUNT_PERCENTAGE = 0.05;

interface CaptainDetailsModalProps {
  captain: Captain;
  open: boolean;
  onClose: () => void;
  onBook: () => void;
  coursePrices?: CoursePrice[];
}

export const CaptainDetailsModal = ({ captain, open, onClose, onBook, coursePrices = [] }: CaptainDetailsModalProps) => {
  const calculateCourseTotal = (sessionPrice: number, sessions: number) => {
    return Math.round(sessionPrice * sessions * (1 - DISCOUNT_PERCENTAGE));
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">تفاصيل الكابتن</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Captain Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={captain.personal_photo_url} alt={captain.full_name} />
              <AvatarFallback>
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-xl">{captain.full_name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{captain.rating?.toFixed(1) || "5.0"}</span>
                </div>
                <span className="text-muted-foreground">
                  ({captain.total_sessions || 0} جلسة)
                </span>
              </div>
              {captain.is_available ? (
                <Badge className="mt-2 bg-green-500">متاح</Badge>
              ) : (
                <Badge variant="secondary" className="mt-2">غير متاح</Badge>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 bg-muted/50 rounded-lg p-4">
            {captain.governorate_name && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium">المنطقة:</span>
                <span>{captain.governorate_name}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-primary" />
              <span className="font-medium">السيارة:</span>
              <span>{captain.car_type || "غير محدد"}</span>
              {captain.transmission_type && (
                <Badge variant="outline">
                  {captain.transmission_type === "automatic" ? "أوتوماتيك" : "مانيوال"}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-medium">سعر الساعة:</span>
              <span className="text-primary font-bold">{captain.hourly_rate} جنيه</span>
            </div>

          </div>

          {/* Course Prices */}
          {coursePrices.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                أسعار الكورسات (خصم 5%)
              </h4>
              <div className="grid gap-2">
                {coursePrices.map((price) => {
                  const config = COURSE_CONFIG[price.course_type];
                  if (!config || price.session_price <= 0) return null;
                  const totalPrice = calculateCourseTotal(price.session_price, config.sessions);
                  const originalPrice = price.session_price * config.sessions;
                  return (
                    <div key={price.course_type} className="flex justify-between items-center bg-muted/50 px-3 py-2 rounded-lg">
                      <div>
                        <span className="font-medium">{config.name}</span>
                        <span className="text-muted-foreground text-sm mr-2">({config.sessions} حصص)</span>
                      </div>
                      <div className="text-left">
                        <span className="line-through text-muted-foreground text-sm ml-2">{originalPrice} ج</span>
                        <span className="font-bold text-primary">{totalPrice} ج</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bio */}
          {captain.bio && (
            <div className="space-y-2">
              <h4 className="font-semibold">نبذة عن الكابتن</h4>
              <p className="text-muted-foreground leading-relaxed">{captain.bio}</p>
            </div>
          )}

          {/* Car Photo */}
          {captain.car_photo_url && (
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Image className="h-5 w-5" />
                صورة السيارة
              </h4>
              <div className="rounded-lg overflow-hidden border">
                <img
                  src={captain.car_photo_url}
                  alt="صورة السيارة"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          )}

          {/* Book Button */}
          <Button className="w-full" size="lg" onClick={onBook}>
            احجز الآن
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
