import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NavBar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import { isMatch } from "date-fns";
import TransactionsPieChart from "./_components/transactions-pie-chart";
import { getDashboard } from "../_data/get-dashboard";
import ExpensesPerCategory from "./_components/expenses-per-category";
import LastTransactions from "./_components/last-transactions";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import AiReportButton from "./_components/ai-report-button";

interface HomeProps {
  searchParams: {
    month: string;
  };
}

interface DashboardData {
  balance: number;
  depositsTotal: number;
  investmentsTotal: number;
  expensesTotal: number;
  typesPercentage: {
    DEPOSIT: number;
    EXPENSE: number;
    INVESTMENT: number;
  };
  totalExpensePerCategory: unknown[];
  lastTransactions: unknown[];
}

const Home = async ({ searchParams: { month } }: HomeProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const monthIsInvalid = !month || !isMatch(month, "MM");

  if (monthIsInvalid) {
    const currentMonth = (new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0");
    redirect(`/?month=${currentMonth}`);
  }

  const isEmptyData = (dashboard: DashboardData) => {
    return (
      dashboard.balance === 0 &&
      dashboard.depositsTotal === 0 &&
      dashboard.investmentsTotal === 0 &&
      dashboard.expensesTotal === 0 &&
      Object.values(dashboard.typesPercentage).every((val) => isNaN(val)) &&
      dashboard.totalExpensePerCategory.length === 0 &&
      dashboard.lastTransactions.length === 0
    );
  };

  const dashboard = await getDashboard(month);
  const userCanAddTransactions = await canUserAddTransaction();
  const user = (await clerkClient()).users.getUser(userId);

  return (
    <>
      <NavBar />
      <div className="flex flex-col space-y-6 overflow-hidden p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <AiReportButton
              month={month}
              hasPremiumPlan={
                (await user).publicMetadata.subscriptionPlan === "premium"
              }
              isEmptyData={isEmptyData(dashboard)}
            />
            <TimeSelect />
          </div>
        </div>
        <div className="grid grid-cols-[2fr,1fr] gap-6 overflow-hidden">
          <div className="flex flex-col gap-6 overflow-hidden">
            <SummaryCards
              {...dashboard}
              userCanAddTransaction={userCanAddTransactions}
            />
            <div className="grid grid-cols-3 grid-rows-1 gap-6 overflow-hidden">
              <TransactionsPieChart
                {...dashboard}
                isEmptyData={isEmptyData(dashboard)}
              />
              <ExpensesPerCategory
                expensesPerCategory={dashboard.totalExpensePerCategory}
                isEmptyData={isEmptyData(dashboard)}
              />
            </div>
          </div>
          <LastTransactions
            lastTransactions={dashboard.lastTransactions}
            isEmptyData={isEmptyData(dashboard)}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
