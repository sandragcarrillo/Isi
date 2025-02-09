import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeAgent, getRecommendedExperiences } from "./chatbot"; 
import { HumanMessage } from "@langchain/core/messages";

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
