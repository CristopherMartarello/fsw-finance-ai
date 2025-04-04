import { Button } from "@/app/_components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { TRANSACTION_PAYMENT_METHOD_ICONS } from "@/app/_constants/transactions";
import { formatCurrency } from "@/app/_utils/currency";
import { Transaction, TransactionType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface LastTransactionsProps {
  lastTransactions: Transaction[];
  isEmptyData: boolean;
}

const LastTransactions = ({
  lastTransactions,
  isEmptyData,
}: LastTransactionsProps) => {
  const getAmountColor = (transaction: Transaction) => {
    if (transaction.type === TransactionType.EXPENSE) {
      return "text-red-500";
    } else if (transaction.type === TransactionType.DEPOSIT) {
      return "text-primary";
    } else {
      return "text-white";
    }
  };

  const getAmountPrefix = (transaction: Transaction) => {
    if (transaction.type === TransactionType.DEPOSIT) {
      return "+";
    } else {
      return "-";
    }
  };

  return (
    <ScrollArea className="rounded-md border">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-bold">Últimas Transações</CardTitle>
        <Button variant={"outline"} className="rounded-full font-bold" asChild>
          <Link href={"/transactions"}>Ver mais</Link>
        </Button>
      </CardHeader>
      {isEmptyData ? (
        <CardContent>
          <p>Não há nenhuma transação para este mês.</p>
        </CardContent>
      ) : (
        <CardContent className="space-y-6">
          {lastTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[rgba(255,255,255,0.03)] p-3">
                  <Image
                    src={
                      TRANSACTION_PAYMENT_METHOD_ICONS[
                        transaction.paymentMethod
                      ]
                    }
                    height={20}
                    width={20}
                    alt="PIX"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold">{transaction.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <p className={`text-sm font-bold ${getAmountColor(transaction)}`}>
                {getAmountPrefix(transaction)}
                {formatCurrency(Number(transaction.amount))}
              </p>
            </div>
          ))}
        </CardContent>
      )}
    </ScrollArea>
  );
};

export default LastTransactions;
