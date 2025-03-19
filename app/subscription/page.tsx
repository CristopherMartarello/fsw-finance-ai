import { redirect } from "next/navigation";
import NavBar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";

const SubscriptionPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/login");
  }
  return <NavBar />;
};

export default SubscriptionPage;
