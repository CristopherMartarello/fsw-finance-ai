"use server";

import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Transaction } from "@prisma/client";
import Groq from "groq-sdk";
import { GenerateAiReportSchema, generateAiReportSchema } from "./schema";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateAiReport = async ({ month }: GenerateAiReportSchema) => {
  generateAiReportSchema.parse({ month });
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = (await clerkClient()).users.getUser(userId);

  const hasPremiumPlan =
    (await user).publicMetadata.subscriptionPlan === "premium";

  if (!hasPremiumPlan) {
    throw new Error(
      "Você precisa de um plano premium para gerar relatórios de IA.",
    );
  }

  // pegar as transações do mês recebido
  const transactions = await db.transaction.findMany({
    where: {
      date: {
        gte: new Date(`2025-${month}-01`),
        lt: new Date(`2025-${month}-31`),
      },
    },
  });

  // mandar para o chatgpt e pedir relatório com insights
  const chatCompletion = await getGroqChatCompletion(transactions);
  return chatCompletion.choices[0]?.message?.content || "";
};

export const getGroqChatCompletion = async (transactions: Transaction[]) => {
  const content = `Gere um relatório com insights sobre as minhas finanças, com dicas e orientações de como melhorar minha vida financeira. As transações estão divididas por pontos e vírgula. A estrutura de cada uma é {DATA}-{TIPO}-{VALOR}-{CATEGORIA}. São elas:
    ${transactions.map((transaction) => `${transaction.date.toLocaleDateString("pt-BR")}-R$${transaction.amount}-${transaction.type}-${transaction.category}`).join(";")}`;

  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Você é um especialista em gestão e organização de finanças pessoais. Você ajuda as pessoas a organizarem melhor as suas finanças e a vida financeira.",
      },
      {
        role: "user",
        content: content,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
};
