import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "201515160511";
const WHATSAPP_MESSAGE = "مرحباً، أريد الاستفسار عن كورسات تعليم السواقة";

const WhatsAppButton = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float group"
      aria-label="تواصل معنا عبر واتساب"
    >
      <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
      <span className="absolute right-full mr-3 bg-card text-foreground px-3 py-1.5 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
        تواصل معنا
      </span>
    </a>
  );
};

export default WhatsAppButton;
