"use client";

import { Button } from "@/app/_components/ui/button";
import { createStripeCheckout } from "../_actions/create-checkout";
import { loadStripe } from "@stripe/stripe-js";

const handleAquirePlanClick = async () => {
  const { sessionId } = await createStripeCheckout();

  const stripe = await loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
  );

  if (!stripe) {
    throw new Error("Stripe not found");
  }

  await stripe.redirectToCheckout({ sessionId });
};

const AcquirePlanButton = () => {
  return (
    <Button
      className="w-full rounded-full font-bold"
      onClick={handleAquirePlanClick}
    >
      Adquirir plano
    </Button>
  );
};

export default AcquirePlanButton;
