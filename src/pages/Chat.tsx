import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { ArrowRight, Send, Image as ImageIcon, User, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message_type: string;
  content: string;
  image_url: string | null;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  id: string;
  captain_id: string;
  trainee_id: string;
  captain_profiles: {
    full_name: string;
    personal_photo_url: string;
    user_id: string;
  };
  captain_bookings: {
    trainee_name: string;
  };
}

const Chat = () => {
  const { bookingId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("يجب تسجيل الدخول أولاً");
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (bookingId && user) {
      fetchConversation();
    }
  }, [bookingId, user]);

  useEffect(() => {
    if (conversation) {
      fetchMessages();

      // Subscribe to new messages
      const channel = supabase
        .channel(`chat_${conversation.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
            filter: `conversation_id=eq.${conversation.id}`,
          },
          (payload) => {
            const newMsg = payload.new as Message;
            setMessages((prev) => [...prev, newMsg]);
            
            // Mark as read if not from current user
            if (newMsg.sender_id !== user?.id) {
              markAsRead(newMsg.id);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversation = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_conversations")
        .select(`
          *,
          captain_profiles (
            full_name,
            personal_photo_url,
            user_id
          ),
          captain_bookings (
            trainee_name
          )
        `)
        .eq("booking_id", bookingId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast.error("المحادثة غير موجودة");
        navigate(-1);
        return;
      }

      setConversation(data);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      toast.error("حدث خطأ في تحميل المحادثة");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!conversation) return;

    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversation.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark unread messages as read
      const unreadMessages = data?.filter(
        (m) => !m.is_read && m.sender_id !== user?.id
      );
      if (unreadMessages?.length) {
        await Promise.all(unreadMessages.map((m) => markAsRead(m.id)));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const markAsRead = async (messageId: string) => {
    await supabase
      .from("chat_messages")
      .update({ is_read: true })
      .eq("id", messageId);
  };

  const sendMessage = async (content: string, imageUrl?: string) => {
    if (!conversation || !user || (!content.trim() && !imageUrl)) return;

    setSending(true);
    try {
      const { error } = await supabase.from("chat_messages").insert({
        conversation_id: conversation.id,
        sender_id: user.id,
        message_type: imageUrl ? "image" : "text",
        content: content.trim() || "صورة",
        image_url: imageUrl,
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("فشل إرسال الرسالة");
    } finally {
      setSending(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار صورة");
      return;
    }

    setSending(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("chat-images")
        .upload(fileName, file);

      if (uploadError) {
        // If bucket doesn't exist, create it first
        if (uploadError.message.includes("bucket")) {
          toast.error("خطأ في رفع الصورة");
          return;
        }
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from("chat-images")
        .getPublicUrl(fileName);

      await sendMessage("", urlData.publicUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("فشل رفع الصورة");
    } finally {
      setSending(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getOtherUserName = () => {
    if (!conversation) return "";
    const isCaptain = conversation.captain_profiles?.user_id === user?.id;
    return isCaptain
      ? conversation.captain_bookings?.trainee_name
      : conversation.captain_profiles?.full_name;
  };

  const getOtherUserPhoto = () => {
    if (!conversation) return "";
    const isCaptain = conversation.captain_profiles?.user_id === user?.id;
    return isCaptain ? "" : conversation.captain_profiles?.personal_photo_url;
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b bg-card">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={getOtherUserPhoto()} />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{getOtherUserName()}</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isMe = message.sender_id === user?.id;
          return (
            <div
              key={message.id}
              className={`flex ${isMe ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[75%] rounded-lg p-3 ${
                  isMe
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.image_url && (
                  <img
                    src={message.image_url}
                    alt="صورة"
                    className="rounded-lg max-w-full mb-2 cursor-pointer"
                    onClick={() => window.open(message.image_url!, "_blank")}
                  />
                )}
                {message.message_type === "text" && (
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                )}
                <span
                  className={`text-xs mt-1 block ${
                    isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {format(new Date(message.created_at), "HH:mm", { locale: ar })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={sending}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(newMessage);
              }
            }}
            placeholder="اكتب رسالتك..."
            className="flex-1"
            disabled={sending}
          />
          <Button
            onClick={() => sendMessage(newMessage)}
            disabled={sending || !newMessage.trim()}
            size="icon"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
