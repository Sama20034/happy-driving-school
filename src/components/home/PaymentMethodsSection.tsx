import { Shield } from "lucide-react";

const PaymentMethodsSection = () => {
  return (
    <section className="section-sm bg-card border-y border-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            طرق الدفع المتاحة
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
            {/* Vodafone Cash */}
            <div className="flex items-center gap-3 px-6 py-4 bg-background rounded-xl border border-primary/10 hover:border-primary/20 transition-colors">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="font-medium text-foreground">فودافون كاش</span>
            </div>

            {/* InstaPay */}
            <div className="flex items-center gap-3 px-6 py-4 bg-background rounded-xl border border-primary/10 hover:border-primary/20 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">IP</span>
              </div>
              <span className="font-medium text-foreground">إنستا باي</span>
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Shield className="w-4 h-4 text-primary" />
            <span>جميع المعاملات مشفرة وآمنة</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentMethodsSection;