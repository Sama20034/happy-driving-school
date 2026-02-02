import { useState, useEffect } from "react";
import { X, Download, Smartphone, Gift, Copy, Check, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface DiscountCode {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
}

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [delayElapsed, setDelayElapsed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showDiscountCode, setShowDiscountCode] = useState(false);
  const [pwaDiscountCode, setPwaDiscountCode] = useState<DiscountCode | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    const isAppleMobile = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isAppleMobile);

    // Fetch PWA discount code
    const fetchPwaCode = async () => {
      const { data } = await supabase
        .from("discount_codes")
        .select("code, discount_type, discount_value")
        .eq("is_pwa_code", true)
        .eq("is_active", true)
        .maybeSingle();
      
      if (data) {
        setPwaDiscountCode(data as DiscountCode);
      }
    };
    fetchPwaCode();

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed previously
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      // Show again after 7 days
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Show prompt after 3 seconds
    const timer = setTimeout(() => {
      setDelayElapsed(true);
    }, 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  // Only show the banner when install prompt is actually available (Chrome/Android)
  // or when we're on iOS (manual Add to Home Screen flow).
  useEffect(() => {
    if (isInstalled) return;
    if (!delayElapsed) return;
    if (isIOS || deferredPrompt) {
      setShowPrompt(true);
    }
  }, [delayElapsed, deferredPrompt, isIOS, isInstalled]);

  const handleOpenInstallModal = () => {
    setShowInstallModal(true);
  };

  const handleInstallAndroid = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setIsInstalled(true);
          setShowInstallModal(false);
        }
        setDeferredPrompt(null);
      } catch (error) {
        console.error("Error installing PWA:", error);
      }
    } else {
      // If no deferred prompt, show manual instructions
      alert("لتثبيت التطبيق:\n\n• على Chrome: اضغط على النقاط الثلاث ← تثبيت التطبيق\n• على Safari: اضغط على زر المشاركة ← إضافة إلى الشاشة الرئيسية");
    }
    // Show discount code after clicking install
    if (pwaDiscountCode) {
      setShowDiscountCode(true);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
    setShowPrompt(false);
    setShowInstallModal(false);
    setShowDiscountCode(false);
  };

  const handleCopyCode = () => {
    if (pwaDiscountCode) {
      navigator.clipboard.writeText(pwaDiscountCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <>
      {/* Initial prompt banner */}
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-fade-in md:left-auto md:right-4 md:max-w-sm">
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-4 relative overflow-hidden">
          {/* Gradient background accent */}
          <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
          
          <button
            onClick={handleDismiss}
            className="absolute top-3 left-3 p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-primary" />
                حمّل التطبيق
              </h3>
              {pwaDiscountCode ? (
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-primary font-medium">🎁 حمّل تطبيق كابتن مصر واحصل على كود خصم!</span>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">
                  احصل على تجربة أفضل مع تطبيق كابتن مصر
                </p>
              )}
            </div>
          </div>

          <Button
            onClick={handleOpenInstallModal}
            className="w-full mt-4 gradient-primary text-primary-foreground gap-2"
          >
            <Download className="h-4 w-4" />
            {pwaDiscountCode ? "تثبيت واحصل على الخصم" : "تثبيت التطبيق"}
          </Button>
        </div>
      </div>

      {/* Install Modal */}
      <Dialog open={showInstallModal} onOpenChange={setShowInstallModal}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-center text-xl flex items-center justify-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              تحميل التطبيق
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Android Section */}
              <div className="bg-muted/50 rounded-xl p-4 text-center border border-border">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Download className="h-6 w-6 text-green-500" />
                </div>
                <h4 className="font-bold mb-2">أندرويد</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  اضغط على الزر لتحميل التطبيق والحصول على كود الخصم
                </p>
                <Button
                  onClick={handleInstallAndroid}
                  className="w-full bg-green-500 hover:bg-green-600 text-white gap-2"
                >
                  <Download className="h-4 w-4" />
                  تنزيل التطبيق
                </Button>
              </div>

              {/* iPhone Section */}
              <div className="bg-muted/50 rounded-xl p-4 text-center border border-border">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-800/10 flex items-center justify-center">
                  <Apple className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                </div>
                <h4 className="font-bold mb-2">آيفون</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  لتثبيت التطبيق على الآيفون:
                </p>
                <ol className="text-sm text-right space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">1</span>
                    <span>افتح الموقع في Safari</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">2</span>
                    <span>اضغط على زر المشاركة ⬆️</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">3</span>
                    <span>اختر "إضافة إلى الشاشة الرئيسية"</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Discount Code Section */}
            {showDiscountCode && pwaDiscountCode && (
              <div className="mt-6 bg-primary/10 rounded-xl p-4 text-center border border-primary/20 animate-fade-in">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-primary" />
                  <span className="font-bold text-primary">🎉 مبروك! هذا كود الخصم الخاص بك</span>
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className="text-2xl font-bold font-mono text-primary bg-background px-4 py-2 rounded-lg border border-primary/30">
                    {pwaDiscountCode.code}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyCode}
                    className="h-10 w-10"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <p className="text-sm font-medium mt-2 text-primary">
                  {pwaDiscountCode.discount_type === "percentage"
                    ? `خصم ${pwaDiscountCode.discount_value}%`
                    : `خصم ${pwaDiscountCode.discount_value} جنيه`}
                </p>
              </div>
            )}

            {!showDiscountCode && pwaDiscountCode && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                <Gift className="h-4 w-4 inline ml-1 text-primary" />
                حمّل التطبيق للحصول على كود خصم حصري!
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstallPrompt;
