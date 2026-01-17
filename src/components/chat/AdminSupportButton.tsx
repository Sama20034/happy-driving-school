import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Headphones, MessageCircle, Phone, Mail } from "lucide-react";

export const AdminSupportButton = () => {
  const [open, setOpen] = useState(false);

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "واتساب",
      description: "تواصل معنا عبر واتساب",
      action: () => window.open("https://wa.me/201234567890", "_blank"),
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: Phone,
      title: "اتصال هاتفي",
      description: "اتصل بنا مباشرة",
      action: () => window.open("tel:+201234567890", "_blank"),
      color: "bg-primary hover:bg-primary/90",
    },
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      description: "أرسل لنا بريد إلكتروني",
      action: () => window.open("mailto:support@happydrivingschool.com", "_blank"),
      color: "bg-blue-500 hover:bg-blue-600",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Headphones className="h-5 w-5" />
          تواصل مع الإدارة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-primary" />
            تواصل مع الإدارة
          </DialogTitle>
          <DialogDescription>
            اختر طريقة التواصل المناسبة لك
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {supportOptions.map((option) => (
            <Button
              key={option.title}
              onClick={option.action}
              className={`${option.color} text-white h-auto py-4 justify-start gap-4`}
            >
              <option.icon className="h-6 w-6" />
              <div className="text-right">
                <div className="font-semibold">{option.title}</div>
                <div className="text-sm opacity-90">{option.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
