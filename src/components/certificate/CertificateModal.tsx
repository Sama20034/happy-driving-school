import { useState, useRef } from "react";
import { Download, Award } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import certificateTemplate from "@/assets/certificate-template.jpg";

interface CertificateModalProps {
  defaultName?: string;
}

const CertificateModal = ({ defaultName = "" }: CertificateModalProps) => {
  const [name, setName] = useState(defaultName);
  const [showCertificate, setShowCertificate] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Detect if text is Arabic
  const isArabic = (text: string) => {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
  };

  const generateCertificate = () => {
    if (!name.trim()) {
      toast.error("الرجاء إدخال الاسم");
      return;
    }
    setShowCertificate(true);
    
    // Wait for state update and then draw on canvas
    setTimeout(() => {
      drawCertificate();
    }, 100);
  };

  const drawCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the template
      ctx.drawImage(img, 0, 0);
      
      // Choose font based on language
      const fontFamily = isArabic(name) ? "Cairo" : "Poppins";
      
      // Format name - uppercase for English
      const displayName = isArabic(name) ? name : name.toUpperCase();
      
      // Configure text style for the name
      ctx.font = `bold 72px ${fontFamily}`;
      ctx.fillStyle = "#FF66C4"; // Pink color
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Position the name - in the empty area below the line
      const nameY = img.height * 0.62;
      ctx.fillText(displayName, img.width / 2, nameY);
    };
    img.src = certificateTemplate;
  };

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `certificate-${name}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("تم تحميل الشهادة بنجاح");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-primary-foreground gap-2">
          <Award className="h-4 w-4" />
          اطلب شهادتك
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            شهادة إتمام الكورس
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {!showCertificate ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="certificateName">أدخل اسمك كما تريده على الشهادة</Label>
                <Input
                  id="certificateName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="أدخل اسمك هنا..."
                  className="text-lg"
                  dir="auto"
                />
              </div>
              <Button 
                onClick={generateCertificate}
                className="w-full gradient-primary text-primary-foreground"
                size="lg"
              >
                إنشاء الشهادة
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border border-border rounded-xl overflow-hidden shadow-lg">
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-auto"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={downloadCertificate}
                  className="flex-1 gradient-primary text-primary-foreground gap-2"
                  size="lg"
                >
                  <Download className="h-5 w-5" />
                  تحميل الشهادة
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowCertificate(false);
                    setName("");
                  }}
                  size="lg"
                >
                  إنشاء شهادة جديدة
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateModal;
