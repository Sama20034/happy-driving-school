import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingStepperProps {
  currentStep: number;
  steps: string[];
}

const BookingStepper = ({ currentStep, steps }: BookingStepperProps) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-1 items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                  index < currentStep
                    ? "gradient-primary text-primary-foreground"
                    : index === currentStep
                    ? "gradient-primary text-primary-foreground animate-pulse-glow"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {index < currentStep ? (
                  <Check size={20} />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs md:text-sm font-medium text-center",
                  index <= currentStep ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-1 flex-1 mx-2 rounded-full transition-all duration-300",
                  index < currentStep ? "gradient-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingStepper;
