import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, User } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface Conversation {
  id: string;
  booking_id: string | null;
  captain_id: string;
  trainee_id: string;
  is_active: boolean;
  created_at: string;
  other_user_name: string;
  other_user_photo: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

interface ChatListProps {
  userId: string;
  captainId?: string;
  role: "captain" | "trainee";
}

export const ChatList = ({ userId, captainId, role }: ChatListProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();

    const channel = supabase
      .channel("chat_messages_list")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        () => { fetchConversations(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId, captainId]);

  const fetchConversations = async () => {
    try {
      let query = supabase
        .from("chat_conversations")
        .select(`
          *,
          captain_profiles (full_name, personal_photo_url, user_id),
          captain_bookings (trainee_name)
        `)
        .eq("is_active", true);

      if (role === "captain" && captainId) {
        query = query.eq("captain_id", captainId);
      } else {
        query = query.eq("trainee_id", userId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;

      const conversationsWithMessages = await Promise.all(
        (data || []).map(async (conv: any) => {
          const { data: lastMsg } = await supabase
            .from("chat_messages")
            .select("content, created_at")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          const { count } = await supabase
            .from("chat_messages")
            .select("*", { count: "exact", head: true })
            .eq("conversation_id", conv.id)
            .eq("is_read", false)
            .neq("sender_id", userId);

          // For direct chats (no booking), get trainee name from profiles table
          let traineeName = conv.captain_bookings?.trainee_name;
          if (!traineeName && role === "captain") {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("user_id", conv.trainee_id)
              .maybeSingle();
            traineeName = profile?.full_name || "متدرب";
          }

          return {
            ...conv,
            other_user_name: role === "captain" 
              ? traineeName
              : conv.captain_profiles?.full_name,
            other_user_photo: role === "trainee" 
              ? conv.captain_profiles?.personal_photo_url 
              : null,
            last_message: lastMsg?.content,
            last_message_time: lastMsg?.created_at,
            unread_count: count || 0,
          };
        })
      );

      setConversations(conversationsWithMessages);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = (conv: Conversation) => {
    if (conv.booking_id) {
      navigate(`/chat/${conv.booking_id}`);
    } else {
      // Direct chat - navigate by captain_id
      navigate(`/chat/captain/${conv.captain_id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          المحادثات
        </CardTitle>
      </CardHeader>
      <CardContent>
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">لا توجد محادثات حتى الآن</p>
            <p className="text-sm text-muted-foreground mt-2">
              يمكنك بدء محادثة مع أي كابتن من تبويب الكباتن
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleConversationClick(conv)}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted cursor-pointer transition-colors"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={conv.other_user_photo} />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold truncate">{conv.other_user_name}</h4>
                    {conv.last_message_time && (
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(conv.last_message_time), "HH:mm", { locale: ar })}
                      </span>
                    )}
                  </div>
                  {conv.last_message && (
                    <p className="text-sm text-muted-foreground truncate">
                      {conv.last_message}
                    </p>
                  )}
                </div>
                {conv.unread_count > 0 && (
                  <Badge className="bg-primary">{conv.unread_count}</Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
