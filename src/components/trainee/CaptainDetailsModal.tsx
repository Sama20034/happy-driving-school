import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Car, MapPin, Clock, User, Phone, Image } from "lucide-react";

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

interface CaptainDetailsModalProps {
  captain: Captain;
  open: boolean;
  onClose: () => void;
  onBook: () => void;
}

export const CaptainDetailsModal = ({ captain, open, onClose, onBook }: CaptainDetailsModalProps) => {
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
              <span className="font-medium">السعر:</span>
              <span className="text-primary font-bold">{captain.hourly_rate} جنيه / ساعة</span>
            </div>

            {captain.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="font-medium">الهاتف:</span>
                <span dir="ltr">{captain.phone}</span>
              </div>
            )}
          </div>

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
