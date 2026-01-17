import { Shield, Lock } from "lucide-react";

const PaymentMethodsSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">طرق الدفع المتاحة</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            ادفع بسهولة وأمان من خلال أشهر وسائل الدفع الإلكتروني في مصر
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
          {/* Vodafone Cash */}
          <div className="flex flex-col items-center gap-3 p-6 bg-card rounded-2xl border border-border min-w-[160px]">
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="font-semibold">فودافون كاش</span>
          </div>

          {/* InstaPay */}
          <div className="flex flex-col items-center gap-3 p-6 bg-card rounded-2xl border border-border min-w-[160px]">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">IP</span>
            </div>
            <span className="font-semibold">إنستا باي</span>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-3 text-muted-foreground">
          <Lock className="w-5 h-5 text-accent" />
          <span className="text-sm">جميع المعاملات مشفرة وآمنة بنسبة 100%</span>
          <Shield className="w-5 h-5 text-accent" />
        </div>
      </div>
    </section>
  );
};

export default PaymentMethodsSection;
