import { Badge } from "@/app/_components/ui/badge";
import { Transaction, TransactionType } from "@prisma/client";
import { CircleIcon } from "lucide-react";

interface TransactionTypeBadgeProps {
  transaction: Transaction;
}

const TransactionTypeBadge = ({ transaction }: TransactionTypeBadgeProps) => {
  if (transaction.type === TransactionType.DEPOSIT) {
    return (
      <Badge className="bg-[#39BE00]/10 font-bold text-primary hover:bg-[#39BE00]/10">
        <CircleIcon className="mr-2 fill-primary" size={10} />
        Depósito
      </Badge>
    );
  }

  if (transaction.type === TransactionType.EXPENSE) {
    return (
      <Badge className="bg-[#E93030]/10 font-bold text-danger hover:bg-[#E93030]/10">
        <CircleIcon className="mr-2 fill-danger" size={10} />
        Despesa
      </Badge>
    );
  }

  return (
    <Badge className="bg-muted-foreground/10 font-bold text-secondary hover:bg-muted-foreground/10">
      <CircleIcon className="mr-2 fill-secondary" size={10} />
      Investimento
    </Badge>
  );
};

export default TransactionTypeBadge;
