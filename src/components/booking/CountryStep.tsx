import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Country {
  id: string;
  name: string;
  code: string | null;
}

interface CountryStepProps {
  selectedId: string;
  onSelect: (id: string, name: string) => void;
}

const CountryStep = ({ selectedId, onSelect }: CountryStepProps) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      const { data, error } = await supabase
        .from("countries")
        .select("id, name, code")
        .order("display_order");

      if (!error) {
        setCountries(data || []);
      }
      setLoading(false);
    };

    fetchCountries();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-center">اختر الدولة</h2>
      <p className="text-muted-foreground mb-6 text-center">
        اختر الدولة التي تريد الحجز فيها
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {countries.map((country) => (
          <button
            key={country.id}
            onClick={() => onSelect(country.id, country.name)}
            className={cn(
              "p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg",
              selectedId === country.id
                ? "border-primary bg-primary/10 shadow-lg"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center",
                  selectedId === country.id
                    ? "gradient-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Globe size={28} />
              </div>
              <span className="font-bold text-lg">{country.name}</span>
              {country.code && (
                <span className="text-sm text-muted-foreground">
                  {country.code}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {countries.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          لا توجد دول متاحة حالياً
        </div>
      )}
    </div>
  );
};

export default CountryStep;
