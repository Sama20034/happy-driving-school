import { Helmet } from "react-helmet-async";
import { Clock, AlertCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const PendingApproval = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      <Helmet>
        <title>في انتظار الموافقة | كباتن القيادة</title>
      </Helmet>

      <Header />
      <main className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center">
        <div className="w-full max-w-md mx-4 text-center">
          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Clock className="h-10 w-10 text-yellow-500" />
            </div>
            
            <h1 className="text-2xl font-bold mb-4">
              حسابك في انتظار الموافقة
            </h1>
            
            <p className="text-muted-foreground mb-6">
              شكراً لتسجيلك معنا! يقوم فريق الإدارة بمراجعة بياناتك ومستنداتك. 
              سيتم إشعارك فور الموافقة على حسابك.
            </p>

            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground text-right">
                  عادة ما تتم المراجعة خلال 24 ساعة. إذا لم تتلق رداً، 
                  يمكنك التواصل معنا عبر واتساب.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PendingApproval;
