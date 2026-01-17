import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, User, Eye, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Conversation {
  id: string;
  booking_id: string;
  captain_id: string;
  trainee_id: string;
  is_active: boolean;
  created_at: string;
  captain_name: string;
  captain_photo: string;
  trainee_name: string;
  last_message?: string;
  last_message_time?: string;
  message_count: number;
}

const AdminChats = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();

    const channel = supabase
      .channel("admin_chat_list")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_messages",
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_conversations")
        .select(`
          *,
          captain_profiles (
            full_name,
            personal_photo_url
          ),
          captain_bookings (
            trainee_name
          )
        `)
        .order("created_at", { ascending: false });

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
            .eq("conversation_id", conv.id);

          return {
            ...conv,
            captain_name: conv.captain_profiles?.full_name || "غير معروف",
            captain_photo: conv.captain_profiles?.personal_photo_url,
            trainee_name: conv.captain_bookings?.trainee_name || "غير معروف",
            last_message: lastMsg?.content,
            last_message_time: lastMsg?.created_at,
            message_count: count || 0,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">المحادثات</h1>
          <p className="text-muted-foreground">عرض جميع المحادثات بين الكباتن والمتدربين</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {conversations.length} محادثة
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            جميع المحادثات
          </CardTitle>
        </CardHeader>
        <CardContent>
          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">لا توجد محادثات حتى الآن</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الكابتن</TableHead>
                  <TableHead>المتدرب</TableHead>
                  <TableHead>آخر رسالة</TableHead>
                  <TableHead>عدد الرسائل</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conversations.map((conv) => (
                  <TableRow key={conv.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={conv.captain_photo} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{conv.captain_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{conv.trainee_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        {conv.last_message ? (
                          <>
                            <p className="text-sm truncate">{conv.last_message}</p>
                            {conv.last_message_time && (
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(conv.last_message_time), "dd/MM/yyyy HH:mm", { locale: ar })}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-muted-foreground">لا توجد رسائل</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{conv.message_count} رسالة</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(conv.created_at), "dd/MM/yyyy", { locale: ar })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={conv.is_active ? "default" : "secondary"}>
                        {conv.is_active ? "نشطة" : "غير نشطة"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/chat/${conv.booking_id}`)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        عرض
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminChats;
