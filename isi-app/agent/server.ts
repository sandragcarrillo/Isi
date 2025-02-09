import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeAgent, getRecommendedExperiences } from "./chatbot"; 
import { HumanMessage } from "@langchain/core/messages";
import {
    AgentKit,
    CdpWalletProvider,
    walletActionProvider,
  } from "@coinbase/agentkit";
  
  let agentWallet: any;

  (async function initializeAgentWallet() {
    const config = {
      apiKeyName: process.env.CDP_API_KEY_NAME,
      apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      networkId: process.env.NETWORK_ID || "base-sepolia", // Puedes cambiar la red
    };
  
    agentWallet = await CdpWalletProvider.configureWithWallet(config);
    console.log("Agent wallet initialized.");
  })();

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let agentInstance: any;
let agentConfig: any;

(async function initialize() {
  const { agent, config } = await initializeAgent();
  agentInstance = agent;
  agentConfig = config;
})();

app.post("/api/recommendations", async (req, res) => {
  const { userProfile } = req.body;
  if (!userProfile) {
    return res.status(400).json({ error: "User profile is required" });
  }
  try {
    const recommendations = await getRecommendedExperiences(userProfile);
    return res.json({ recommendations });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

app.post("/api/chat", async (req, res) => {
  const { userInput } = req.body;
  if (!userInput) {
    return res.status(400).json({ error: "User input is required" });
  }
  try {
    const stream = await agentInstance.stream(
      { messages: [new HumanMessage(userInput)] },
      agentConfig
    );
    let response = "";
    for await (const chunk of stream) {
      response += chunk.agent?.messages[0]?.content || "";
    }
    return res.json({ response });
  } catch (error) {
    console.error("Error in chat interaction:", error);
    return res.status(500).json({ error: "Failed to process chat input" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.get("/api/agent-wallet", async (req, res) => {
    try {
      const walletDetails = await agentWallet.getWalletDetails();
      const balance = await agentWallet.getNativeBalance();
  
      return res.json({
        address: walletDetails.address,
        balance,
      });
    } catch (error) {
      console.error("Error fetching agent wallet details:", error);
      return res.status(500).json({ error: "Failed to fetch wallet details." });
    }
  });

  app.post("/api/purchase", async (req, res) => {
    const { experience, amount } = req.body;
  
    if (!experience || !amount) {
      return res.status(400).json({ error: "Experience and amount are required." });
    }
  
    try {
      const balance = await agentWallet.getNativeBalance();
  
      if (balance < amount) {
        return res.status(400).json({
          error: `Insufficient funds. Current balance: $${balance}. Please fund the wallet.`,
        });
      }
  
      const transaction = await agentWallet.transfer({
        to: experience.merchantWallet,
        value: amount,
      });
  
      console.log("Transaction completed:", transaction);
      return res.json({ success: true, transaction });
    } catch (error) {
      console.error("Error during purchase:", error);
      return res.status(500).json({ error: "Purchase failed." });
    }
  });
  
