import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Car, MapPin, Clock, User, Search, X, ChevronLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

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
    
    const { data: captainProfiles } = await supabase
      .from("captain_profiles")
      .select(`
        *,
        governorates (name)
      `)
      .eq("is_available", true)
      .order("rating", { ascending: false });

    const { data: approvedProfiles } = await supabase
      .from("profiles")
      .select(`
        id,
        user_id,
        full_name,
        phone,
        training_governorate_id,
        car_type,
        transmission_type,
        car_photo_url,
        personal_photo_url,
        governorates:training_governorate_id (name)
      `)
      .eq("approval_status", "approved");

    const combinedCaptains: Captain[] = [];
    
    if (captainProfiles) {
      captainProfiles.forEach((captain: any) => {
        combinedCaptains.push({
          ...captain,
          governorate_name: captain.governorates?.name || null,
        });
      });
    }

    if (approvedProfiles) {
      const existingUserIds = combinedCaptains.map(c => c.user_id);
      
      approvedProfiles.forEach((profile: any) => {
        if (!existingUserIds.includes(profile.user_id)) {
          combinedCaptains.push({
            id: profile.id,
            user_id: profile.user_id,
            full_name: profile.full_name || "كابتن",
            phone: profile.phone,
            governorate_id: profile.training_governorate_id,
            governorate_name: profile.governorates?.name || null,
            car_type: profile.car_type,
            transmission_type: profile.transmission_type,
            car_photo_url: profile.car_photo_url,
            personal_photo_url: profile.personal_photo_url,
            hourly_rate: 100,
            bio: null,
            is_available: true,
            rating: 5.0,
            total_sessions: 0,
          });
        } else {
          const existingIndex = combinedCaptains.findIndex(c => c.user_id === profile.user_id);
          if (existingIndex !== -1) {
            const existing = combinedCaptains[existingIndex];
            if (!existing.personal_photo_url && profile.personal_photo_url) {
              combinedCaptains[existingIndex].personal_photo_url = profile.personal_photo_url;
            }
            if (!existing.car_photo_url && profile.car_photo_url) {
              combinedCaptains[existingIndex].car_photo_url = profile.car_photo_url;
            }
            if (!existing.car_type && profile.car_type) {
              combinedCaptains[existingIndex].car_type = profile.car_type;
            }
            if (!existing.transmission_type && profile.transmission_type) {
              combinedCaptains[existingIndex].transmission_type = profile.transmission_type;
            }
          }
        }
      });
    }

    setCaptains(combinedCaptains);
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
      
      {/* Hero Section */}
      <section className="gradient-navy pt-28 pb-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-[10%] w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-[20%] w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center text-primary-foreground">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
              <Star className="w-4 h-4 fill-white/50" />
              <span>كباتن معتمدين وموثقين</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              اختر كابتنك المثالي
            </h1>
            <p className="text-lg text-white/70 mb-8">
              تصفح أفضل كباتن تعليم القيادة، شوف التقييمات ونوع السيارة واحجز بسهولة
            </p>
            
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  placeholder="ابحث عن كابتن أو نوع سيارة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-12 h-12 bg-white border-0 text-gray-900 placeholder:text-gray-500 rounded-xl shadow-lg"
                />
              </div>
              <Select value={selectedGovernorate} onValueChange={setSelectedGovernorate}>
                <SelectTrigger className="w-full sm:w-[180px] h-12 bg-white border-0 rounded-xl shadow-lg text-gray-900">
                  <SelectValue placeholder="المحافظة" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="all">كل المحافظات</SelectItem>
                  {governorates.map((gov) => (
                    <SelectItem key={gov.id} value={gov.id}>
                      {gov.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L60 52C120 44 240 28 360 22C480 16 600 20 720 26C840 32 960 40 1080 42C1200 44 1320 40 1380 38L1440 36V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Captains Grid */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">الكباتن المتاحين</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {filteredCaptains.length} كابتن متاح
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card-navy p-0 overflow-hidden animate-pulse">
                <div className="h-48 bg-primary/10" />
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-primary/10 rounded w-2/3" />
                      <div className="h-4 bg-primary/10 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-4 bg-primary/10 rounded w-full" />
                  <div className="h-4 bg-primary/10 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCaptains.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <User className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">لا يوجد كباتن متاحين</h3>
            <p className="text-muted-foreground">جرب تغيير البحث أو المحافظة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCaptains.map((captain, index) => (
              <div 
                key={captain.id} 
                className="card-navy overflow-hidden cursor-pointer group"
                onClick={() => setSelectedCaptain(captain)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Car Photo */}
                <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                  {captain.car_photo_url ? (
                    <img
                      src={captain.car_photo_url}
                      alt="صورة السيارة"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="h-16 w-16 text-primary/30" />
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="badge-navy-solid text-xs">
                      متاح
                    </span>
                  </div>
                  
                  {/* Rating on image */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm font-medium">{captain.rating?.toFixed(1) || "5.0"}</span>
                  </div>
                </div>

                <div className="p-5">
                  {/* Captain Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-primary/20 bg-primary/5">
                        {captain.personal_photo_url ? (
                          <img
                            src={captain.personal_photo_url}
                            alt={captain.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="h-6 w-6 text-primary/50" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-foreground truncate">{captain.full_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {captain.total_sessions || 0} جلسة تدريبية
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2.5 text-sm">
                    {captain.governorate_name && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-muted-foreground">{captain.governorate_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
                        <Car className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-foreground font-medium">{captain.car_type || "غير محدد"}</span>
                      {captain.transmission_type && (
                        <span className="badge-navy text-xs">
                          {captain.transmission_type === "automatic" || captain.transmission_type === "أوتوماتيك" 
                            ? "أوتوماتيك" 
                            : "مانيوال"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-primary/10">
                    <div>
                      <span className="text-2xl font-bold text-primary">{captain.hourly_rate}</span>
                      <span className="text-muted-foreground text-sm mr-1">جنيه/ساعة</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg gap-1"
                    >
                      <span>التفاصيل</span>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Captain Details Modal */}
      <Dialog open={!!selectedCaptain} onOpenChange={() => setSelectedCaptain(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 bg-background border-primary/10">
          {selectedCaptain && (
            <>
              {/* Header with gradient */}
              <div className="gradient-navy p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
                
                <button 
                  onClick={() => setSelectedCaptain(null)}
                  className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div 
                    className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white/20 bg-white/10 mb-4 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => selectedCaptain.personal_photo_url && openImageModal(selectedCaptain.personal_photo_url)}
                  >
                    {selectedCaptain.personal_photo_url ? (
                      <img
                        src={selectedCaptain.personal_photo_url}
                        alt={selectedCaptain.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-12 w-12 text-white/50" />
                      </div>
                    )}
                  </div>
                  
                  {/* Name & Rating */}
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedCaptain.full_name}</h2>
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{selectedCaptain.rating?.toFixed(1) || "5.0"}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span>{selectedCaptain.total_sessions || 0} جلسة</span>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="badge-navy-solid text-xs">متاح</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedCaptain.governorate_name && (
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-2 text-primary mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">المنطقة</span>
                      </div>
                      <p className="font-semibold text-foreground">{selectedCaptain.governorate_name}</p>
                    </div>
                  )}
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">السعر</span>
                    </div>
                    <p className="font-bold text-foreground text-lg">{selectedCaptain.hourly_rate} جنيه/ساعة</p>
                  </div>
                </div>

                {/* Car Info */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2 text-primary mb-3">
                    <Car className="w-4 h-4" />
                    <span className="text-sm font-medium">السيارة</span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold text-foreground">{selectedCaptain.car_type || "غير محدد"}</span>
                    {selectedCaptain.transmission_type && (
                      <span className="badge-navy text-sm">
                        {selectedCaptain.transmission_type === "automatic" || selectedCaptain.transmission_type === "أوتوماتيك" 
                          ? "أوتوماتيك" 
                          : "مانيوال"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {selectedCaptain.bio && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">نبذة عن الكابتن</h4>
                    <p className="text-muted-foreground leading-relaxed">{selectedCaptain.bio}</p>
                  </div>
                )}

                {/* Car Photo */}
                {selectedCaptain.car_photo_url && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">صورة السيارة</h4>
                    <div 
                      className="rounded-xl overflow-hidden border border-primary/10 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openImageModal(selectedCaptain.car_photo_url!)}
                    >
                      <img
                        src={selectedCaptain.car_photo_url}
                        alt="صورة السيارة"
                        className="w-full h-56 object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-base font-medium" asChild>
                  <Link to="/booking">
                    احجز جلسة تدريبية الآن
                    <ChevronLeft className="w-5 h-5 mr-2" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Zoom Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl p-2 bg-black/95 border-0">
          <button 
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
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