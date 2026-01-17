import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageSquare, User, Eye, Search, ArrowLeftRight } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";

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

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  message_type: string;
  content: string;
  image_url: string | null;
  is_read: boolean;
  created_at: string;
}

const AdminChats = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();

    const channel = supabase
      .channel("admin_chat_monitor")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_messages",
        },
        () => {
          fetchConversations();
          if (selectedConversation) {
            fetchMessages(selectedConversation.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = conversations.filter(
        (c) =>
          c.captain_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.trainee_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      setFilteredConversations(conversationsWithMessages);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setMessagesLoading(true);
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Get captain and trainee info
      const conv = conversations.find((c) => c.id === conversationId);

      const messagesWithNames = (data || []).map((msg) => ({
        ...msg,
        sender_name:
          msg.sender_id === conv?.trainee_id
            ? conv?.trainee_name || "المتدرب"
            : conv?.captain_name || "الكابتن",
      }));

      setMessages(messagesWithNames);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    fetchMessages(conv.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>مراقبة المحادثات | لوحة التحكم</title>
      </Helmet>

      <div className="space-y-6" dir="rtl">
        <div className="flex items-center gap-3">
          <Eye className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">مراقبة جميع المحادثات</h1>
            <p className="text-muted-foreground">عرض جميع المحادثات بين الكباتن والمتدربين</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  المحادثات
                </div>
                <Badge variant="secondary">{conversations.length}</Badge>
              </CardTitle>
              <div className="relative mt-2">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث بالاسم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد محادثات
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={cn(
                        "p-3 rounded-xl cursor-pointer transition-colors border",
                        selectedConversation?.id === conv.id
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-muted border-transparent"
                      )}
                    >
                      {/* Users row */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{conv.trainee_name}</p>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              متدرب
                            </Badge>
                          </div>
                        </div>

                        <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />

                        <div className="flex items-center gap-2">
                          <div className="text-left">
                            <p className="text-sm font-medium">{conv.captain_name}</p>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              كابتن
                            </Badge>
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={conv.captain_photo} />
                            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>

                      {/* Last message */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <p className="truncate max-w-[180px]">{conv.last_message || "لا توجد رسائل"}</p>
                        <Badge variant="outline">{conv.message_count} رسالة</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat View */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/20 text-primary">
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedConversation.trainee_name}</p>
                          <Badge variant="outline" className="text-xs">متدرب</Badge>
                        </div>
                      </div>

                      <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />

                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedConversation.captain_photo} />
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedConversation.captain_name}</p>
                          <Badge variant="secondary" className="text-xs">كابتن</Badge>
                        </div>
                      </div>
                    </div>

                    <Badge variant="outline">{messages.length} رسالة</Badge>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      لا توجد رسائل في هذه المحادثة
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const isTrainee = message.sender_id === selectedConversation.trainee_id;
                        return (
                          <div
                            key={message.id}
                            className={cn("flex", isTrainee ? "justify-start" : "justify-end")}
                          >
                            <div
                              className={cn(
                                "max-w-[70%] rounded-2xl p-3",
                                isTrainee
                                  ? "bg-muted rounded-br-none"
                                  : "bg-primary/10 rounded-bl-none"
                              )}
                            >
                              <p className="text-xs font-medium mb-1 text-muted-foreground">
                                {message.sender_name}
                              </p>
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
                              <span className="text-[10px] text-muted-foreground mt-1 block">
                                {format(new Date(message.created_at), "d MMMM، h:mm a", { locale: ar })}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </CardContent>

                {/* Read-only footer */}
                <div className="p-4 border-t bg-muted/50">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>وضع المراقبة فقط - لا يمكنك الإرسال</span>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">اختر محادثة لعرضها</p>
                  <p className="text-sm">اضغط على أي محادثة من القائمة لعرض الرسائل</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminChats;
