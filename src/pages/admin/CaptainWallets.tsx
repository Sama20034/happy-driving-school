import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Wallet, Plus, Send, History, User } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface CaptainWithWallet {
  id: string;
  full_name: string;
  phone: string | null;
  wallet?: {
    id: string;
    balance: number;
  } | null;
}

interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  description: string | null;
  created_at: string;
}

const CaptainWallets = () => {
  const [captains, setCaptains] = useState<CaptainWithWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaptain, setSelectedCaptain] = useState<CaptainWithWallet | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCaptainsWithWallets();
  }, []);

  const fetchCaptainsWithWallets = async () => {
    try {
      // Fetch all captains
      const { data: captainsData, error: captainsError } = await supabase
        .from("captain_profiles")
        .select("id, full_name, phone")
        .order("full_name");

      if (captainsError) throw captainsError;

      // Fetch all wallets
      const { data: walletsData, error: walletsError } = await supabase
        .from("captain_wallets")
        .select("id, captain_id, balance");

      if (walletsError) throw walletsError;

      // Merge captains with their wallets
      const captainsWithWallets = captainsData?.map((captain) => ({
        ...captain,
        wallet: walletsData?.find((w) => w.captain_id === captain.id) || null,
      }));

      setCaptains(captainsWithWallets || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async (captainId: string) => {
    try {
      const { error } = await supabase
        .from("captain_wallets")
        .insert({ captain_id: captainId, balance: 0 });

      if (error) throw error;

      toast.success("تم إنشاء المحفظة بنجاح");
      fetchCaptainsWithWallets();
    } catch (error) {
      console.error("Error creating wallet:", error);
      toast.error("حدث خطأ أثناء إنشاء المحفظة");
    }
  };

  const handleDeposit = async () => {
    if (!selectedCaptain?.wallet || !amount) return;

    setSubmitting(true);
    try {
      const depositAmount = parseFloat(amount);
      const newBalance = (selectedCaptain.wallet.balance || 0) + depositAmount;

      // Update wallet balance
      const { error: walletError } = await supabase
        .from("captain_wallets")
        .update({ balance: newBalance })
        .eq("id", selectedCaptain.wallet.id);

      if (walletError) throw walletError;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Add transaction record
      const { error: transactionError } = await supabase
        .from("wallet_transactions")
        .insert({
          wallet_id: selectedCaptain.wallet.id,
          captain_id: selectedCaptain.id,
          amount: depositAmount,
          transaction_type: "deposit",
          description: description || "إضافة رصيد",
          created_by: user?.id,
        });

      if (transactionError) throw transactionError;

      // Notify captain
      const { data: captainProfile } = await supabase
        .from("captain_profiles")
        .select("user_id")
        .eq("id", selectedCaptain.id)
        .single();

      if (captainProfile) {
        await supabase.from("notifications").insert({
          user_id: captainProfile.user_id,
          title: "تم إضافة رصيد للمحفظة",
          message: `تم إضافة ${depositAmount} جنيه إلى محفظتك. ${description || ""}`,
          type: "wallet",
        });
      }

      toast.success("تم إضافة الرصيد بنجاح");
      setShowDepositModal(false);
      setAmount("");
      setDescription("");
      fetchCaptainsWithWallets();
    } catch (error) {
      console.error("Error adding deposit:", error);
      toast.error("حدث خطأ أثناء إضافة الرصيد");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSettlement = async () => {
    if (!selectedCaptain?.wallet) return;

    setSubmitting(true);
    try {
      const currentBalance = selectedCaptain.wallet.balance || 0;

      // Update wallet balance to 0
      const { error: walletError } = await supabase
        .from("captain_wallets")
        .update({ balance: 0 })
        .eq("id", selectedCaptain.wallet.id);

      if (walletError) throw walletError;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Add settlement transaction
      const { error: transactionError } = await supabase
        .from("wallet_transactions")
        .insert({
          wallet_id: selectedCaptain.wallet.id,
          captain_id: selectedCaptain.id,
          amount: -currentBalance,
          transaction_type: "settlement",
          description: description || "تم تحويل المبلغ",
          created_by: user?.id,
        });

      if (transactionError) throw transactionError;

      // Notify captain
      const { data: captainProfile } = await supabase
        .from("captain_profiles")
        .select("user_id")
        .eq("id", selectedCaptain.id)
        .single();

      if (captainProfile) {
        await supabase.from("notifications").insert({
          user_id: captainProfile.user_id,
          title: "تم تصفية المحفظة",
          message: `تم إرسال مبلغ ${currentBalance} جنيه إليك. ${description || ""}`,
          type: "wallet",
        });
      }

      toast.success("تم تصفية المحفظة بنجاح");
      setShowSettlementModal(false);
      setDescription("");
      fetchCaptainsWithWallets();
    } catch (error) {
      console.error("Error settling wallet:", error);
      toast.error("حدث خطأ أثناء تصفية المحفظة");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchTransactions = async (captainId: string) => {
    try {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("captain_id", captainId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const openHistoryModal = async (captain: CaptainWithWallet) => {
    setSelectedCaptain(captain);
    await fetchTransactions(captain.id);
    setShowHistoryModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Wallet className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">محافظ الكباتن</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الكباتن والمحافظ</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الكابتن</TableHead>
                <TableHead>الهاتف</TableHead>
                <TableHead>الرصيد</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {captains.map((captain) => (
                <TableRow key={captain.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{captain.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell dir="ltr">{captain.phone || "-"}</TableCell>
                  <TableCell>
                    {captain.wallet ? (
                      <Badge variant={captain.wallet.balance > 0 ? "default" : "secondary"}>
                        {captain.wallet.balance} جنيه
                      </Badge>
                    ) : (
                      <Badge variant="outline">لا توجد محفظة</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {!captain.wallet ? (
                        <Button
                          size="sm"
                          onClick={() => createWallet(captain.id)}
                        >
                          <Plus className="h-4 w-4 ml-1" />
                          إنشاء محفظة
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedCaptain(captain);
                              setShowDepositModal(true);
                            }}
                          >
                            <Plus className="h-4 w-4 ml-1" />
                            إضافة رصيد
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => {
                              setSelectedCaptain(captain);
                              setShowSettlementModal(true);
                            }}
                            disabled={captain.wallet.balance === 0}
                          >
                            <Send className="h-4 w-4 ml-1" />
                            تصفية
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openHistoryModal(captain)}
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Deposit Modal */}
      <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة رصيد لمحفظة {selectedCaptain?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>المبلغ (جنيه)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="أدخل المبلغ"
              />
            </div>
            <div className="space-y-2">
              <Label>ملاحظات (اختياري)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="سبب الإضافة..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDepositModal(false)}>
              إلغاء
            </Button>
            <Button onClick={handleDeposit} disabled={!amount || submitting}>
              {submitting ? "جاري الإضافة..." : "إضافة الرصيد"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settlement Modal */}
      <Dialog open={showSettlementModal} onOpenChange={setShowSettlementModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تصفية محفظة {selectedCaptain?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">الرصيد الحالي</p>
              <p className="text-2xl font-bold text-primary">
                {selectedCaptain?.wallet?.balance || 0} جنيه
              </p>
            </div>
            <div className="space-y-2">
              <Label>رسالة للكابتن (اختياري)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="مثال: تم التحويل على فودافون كاش"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettlementModal(false)}>
              إلغاء
            </Button>
            <Button 
              onClick={handleSettlement} 
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 ml-1" />
              {submitting ? "جاري التصفية..." : "تأكيد التحويل والتصفية"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>سجل معاملات {selectedCaptain?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                لا توجد معاملات
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>الوصف</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        {format(new Date(tx.created_at), "d MMMM yyyy - h:mm a", { locale: ar })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={tx.transaction_type === "deposit" ? "default" : "secondary"}>
                          {tx.transaction_type === "deposit" ? "إيداع" : "تصفية"}
                        </Badge>
                      </TableCell>
                      <TableCell className={tx.amount > 0 ? "text-green-600" : "text-red-600"}>
                        {tx.amount > 0 ? "+" : ""}{tx.amount} جنيه
                      </TableCell>
                      <TableCell>{tx.description || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaptainWallets;
