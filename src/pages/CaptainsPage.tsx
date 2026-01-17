import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Car, MapPin, Clock, User, Search, Phone, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface Captain {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  governorate_id: string | null;
  governorate_name?: string;
  car_type: string | null;
  transmission_type: string | null;
  car_photo_url: string | null;
  personal_photo_url: string | null;
  hourly_rate: number;
  bio: string | null;
  is_available: boolean;
  rating: number | null;
  total_sessions: number | null;
}

interface Governorate {
  id: string;
  name: string;
}

const CaptainsPage = () => {
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>("all");
  const [selectedCaptain, setSelectedCaptain] = useState<Captain | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState<string>("");

  useEffect(() => {
    fetchGovernorates();
    fetchCaptains();
  }, []);

  const fetchGovernorates = async () => {
    const { data } = await supabase
      .from("governorates")
      .select("id, name")
      .order("display_order");
    if (data) setGovernorates(data);
  };

  const fetchCaptains = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("captain_profiles")
      .select(`
        *,
        governorates (name)
      `)
      .eq("is_available", true)
      .order("rating", { ascending: false });

    if (data) {
      const captainsWithGov = data.map((captain: any) => ({
        ...captain,
        governorate_name: captain.governorates?.name || null,
      }));
      setCaptains(captainsWithGov);
    }
    setLoading(false);
  };

  const filteredCaptains = captains.filter((captain) => {
    const matchesSearch = captain.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      captain.car_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGovernorate = selectedGovernorate === "all" || captain.governorate_id === selectedGovernorate;
    return matchesSearch && matchesGovernorate;
  });

  const openImageModal = (imageUrl: string) => {
    setModalImage(imageUrl);
    setShowImageModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">كباتن التدريب</h1>
          <p className="text-muted-foreground text-lg">تعرف على أفضل كباتن تعليم القيادة المعتمدين لدينا</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="ابحث عن كابتن..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <Select value={selectedGovernorate} onValueChange={setSelectedGovernorate}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="اختر المحافظة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل المحافظات</SelectItem>
              {governorates.map((gov) => (
                <SelectItem key={gov.id} value={gov.id}>
                  {gov.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Captains Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCaptains.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">لا يوجد كباتن متاحين حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCaptains.map((captain) => (
              <Card 
                key={captain.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedCaptain(captain)}
              >
                {/* Car Photo */}
                <div className="relative h-48 bg-muted overflow-hidden">
                  {captain.car_photo_url ? (
                    <img
                      src={captain.car_photo_url}
                      alt="صورة السيارة"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  {/* Availability Badge */}
                  <Badge className="absolute top-3 right-3 bg-green-500">متاح</Badge>
                </div>

                <CardContent className="p-4">
                  {/* Captain Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-14 w-14 border-2 border-primary">
                      <AvatarImage src={captain.personal_photo_url || undefined} alt={captain.full_name} />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{captain.full_name}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{captain.rating?.toFixed(1) || "5.0"}</span>
                        <span className="text-muted-foreground">({captain.total_sessions || 0} جلسة)</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    {captain.governorate_name && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">المنطقة:</span>
                        <span className="font-medium">{captain.governorate_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Car className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">السيارة:</span>
                      <span className="font-medium">{captain.car_type || "غير محدد"}</span>
                      {captain.transmission_type && (
                        <Badge variant="secondary" className="text-xs">
                          {captain.transmission_type === "automatic" || captain.transmission_type === "أوتوماتيك" 
                            ? "أوتوماتيك" 
                            : "مانيوال"}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">السعر:</span>
                      <span className="font-bold text-primary">{captain.hourly_rate} جنيه / ساعة</span>
                    </div>
                  </div>

                  {captain.bio && (
                    <p className="text-sm text-muted-foreground mt-3 pt-3 border-t line-clamp-2">
                      {captain.bio}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Captain Details Modal */}
      <Dialog open={!!selectedCaptain} onOpenChange={() => setSelectedCaptain(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">تفاصيل الكابتن</DialogTitle>
          </DialogHeader>

          {selectedCaptain && (
            <div className="space-y-6">
              {/* Personal Photo - Large */}
              <div className="flex justify-center">
                <div 
                  className="relative cursor-pointer"
                  onClick={() => selectedCaptain.personal_photo_url && openImageModal(selectedCaptain.personal_photo_url)}
                >
                  <Avatar className="h-32 w-32 border-4 border-primary shadow-lg">
                    <AvatarImage src={selectedCaptain.personal_photo_url || undefined} alt={selectedCaptain.full_name} />
                    <AvatarFallback>
                      <User className="h-16 w-16" />
                    </AvatarFallback>
                  </Avatar>
                  {selectedCaptain.is_available && (
                    <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500">
                      متاح
                    </Badge>
                  )}
                </div>
              </div>

              {/* Name & Rating */}
              <div className="text-center">
                <h3 className="font-bold text-2xl mb-2">{selectedCaptain.full_name}</h3>
                <div className="flex items-center justify-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-lg">{selectedCaptain.rating?.toFixed(1) || "5.0"}</span>
                  <span className="text-muted-foreground">({selectedCaptain.total_sessions || 0} جلسة تدريبية)</span>
                </div>
              </div>

              {/* Details Card */}
              <div className="bg-muted/50 rounded-xl p-5 space-y-4">
                {selectedCaptain.governorate_name && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="font-medium">المنطقة:</span>
                    <span>{selectedCaptain.governorate_name}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 flex-wrap">
                  <Car className="h-5 w-5 text-primary" />
                  <span className="font-medium">السيارة:</span>
                  <span>{selectedCaptain.car_type || "غير محدد"}</span>
                  {selectedCaptain.transmission_type && (
                    <Badge variant="outline">
                      {selectedCaptain.transmission_type === "automatic" || selectedCaptain.transmission_type === "أوتوماتيك" 
                        ? "أوتوماتيك" 
                        : "مانيوال"}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-medium">السعر:</span>
                  <span className="text-primary font-bold text-lg">{selectedCaptain.hourly_rate} جنيه / ساعة</span>
                </div>

                {selectedCaptain.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="font-medium">الهاتف:</span>
                    <span dir="ltr">{selectedCaptain.phone}</span>
                  </div>
                )}
              </div>

              {/* Bio */}
              {selectedCaptain.bio && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">نبذة عن الكابتن</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedCaptain.bio}</p>
                </div>
              )}

              {/* Car Photo */}
              {selectedCaptain.car_photo_url && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    صورة السيارة
                  </h4>
                  <div 
                    className="rounded-xl overflow-hidden border cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => openImageModal(selectedCaptain.car_photo_url!)}
                  >
                    <img
                      src={selectedCaptain.car_photo_url}
                      alt="صورة السيارة"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Book Button */}
              <Button className="w-full" size="lg" asChild>
                <a href="/booking">احجز جلسة تدريبية الآن</a>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Zoom Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl p-2">
          <img
            src={modalImage}
            alt="صورة مكبرة"
            className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default CaptainsPage;
