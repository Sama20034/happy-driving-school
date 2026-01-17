import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Car, MapPin, Clock, User } from "lucide-react";
import { BookingModal } from "./BookingModal";

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

interface CaptainCardProps {
  captain: Captain;
}

export const CaptainCard = ({ captain }: CaptainCardProps) => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={captain.personal_photo_url} alt={captain.full_name} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{captain.full_name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">{captain.rating?.toFixed(1) || "5.0"}</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  ({captain.total_sessions || 0} جلسة)
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {captain.governorate_name && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{captain.governorate_name}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span>{captain.car_type || "غير محدد"}</span>
            {captain.transmission_type && (
              <Badge variant="secondary" className="text-xs">
                {captain.transmission_type === "automatic" ? "أوتوماتيك" : "مانيوال"}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-primary">{captain.hourly_rate} جنيه / ساعة</span>
          </div>

          {captain.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2">{captain.bio}</p>
          )}
        </CardContent>

        <CardFooter className="pt-0">
          <Button className="w-full" onClick={() => setShowBookingModal(true)}>
            احجز الآن
          </Button>
        </CardFooter>
      </Card>

      <BookingModal
        captain={captain}
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </>
  );
};
