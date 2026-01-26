import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface WalletData {
  id: string;
  balance: number;
}

interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  description: string | null;
  created_at: string;
}

interface CaptainWalletProps {
  captainId: string;
}

export const CaptainWallet = ({ captainId }: CaptainWalletProps) => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();

    // Subscribe to wallet changes
    const channel = supabase
      .channel("captain_wallet_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "captain_wallets",
          filter: `captain_id=eq.${captainId}`,
        },
        () => {
          fetchWalletData();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wallet_transactions",
          filter: `captain_id=eq.${captainId}`,
        },
        () => {
          fetchWalletData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [captainId]);

  const fetchWalletData = async () => {
    try {
      // Fetch wallet
      const { data: walletData, error: walletError } = await supabase
        .from("captain_wallets")
        .select("id, balance")
        .eq("captain_id", captainId)
        .maybeSingle();

      if (walletError) throw walletError;
      setWallet(walletData);

      // Fetch transactions if wallet exists
      if (walletData) {
        const { data: txData, error: txError } = await supabase
          .from("wallet_transactions")
          .select("*")
          .eq("captain_id", captainId)
          .order("created_at", { ascending: false })
          .limit(10);

        if (txError) throw txError;
        setTransactions(txData || []);
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (!wallet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            المحفظة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>لم يتم تفعيل المحفظة بعد</p>
            <p className="text-sm">سيقوم الأدمن بتفعيل محفظتك قريباً</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          المحفظة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Balance Display */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">رصيدك الحالي</p>
          <p className="text-4xl font-bold text-primary">{wallet.balance} جنيه</p>
        </div>

        {/* Transactions History */}
        <div>
          <h3 className="font-semibold mb-3">آخر المعاملات</h3>
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4 text-sm">
              لا توجد معاملات حتى الآن
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {tx.transaction_type === "deposit" ? (
                      <div className="p-2 bg-green-100 rounded-full">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                    ) : (
                      <div className="p-2 bg-blue-100 rounded-full">
                        <TrendingDown className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {tx.transaction_type === "deposit" ? "إيداع رصيد" : "تحويل رصيد"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(tx.created_at), "d MMMM yyyy", { locale: ar })}
                      </p>
                      {tx.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {tx.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={tx.amount > 0 ? "default" : "secondary"}
                    className={tx.amount > 0 ? "bg-green-500" : "bg-blue-500"}
                  >
                    {tx.amount > 0 ? "+" : ""}{tx.amount} جنيه
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
