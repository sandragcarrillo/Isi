import {
  AgentKit,
  CdpWalletProvider,
  wethActionProvider,
  walletActionProvider,
  erc20ActionProvider,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  pythActionProvider,
} from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as readline from "readline";
import fetch from "node-fetch";

dotenv.config();

const SUBGRAPH_URL = "https://api.studio.thegraph.com/query/95085/isi-services-subgraph/version/latest";

async function querySubgraph(query: string) {
  const response = await fetch(SUBGRAPH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return response.json();
}

async function getRecommendedExperiences(userProfile) {
  const query = `{
    serviceCreateds(first: 5) {
      serviceId
      name
      price
      merchant
    }
  }`;
  const data = await querySubgraph(query);


  const recommendations = data.data.serviceCreateds.slice(0, 2).map(service => ({
    ...service,
    price: service.price / 10 ** 6, 
  }));

  return recommendations;
}

function validateEnvironment(): void {
  const missingVars: string[] = [];
  const requiredVars = ["OPENAI_API_KEY", "CDP_API_KEY_NAME", "CDP_API_KEY_PRIVATE_KEY"];
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });
  if (missingVars.length > 0) {
    console.error("Error: Required environment variables are not set");
    process.exit(1);
  }
  if (!process.env.NETWORK_ID) {
    console.warn("Warning: NETWORK_ID not set, defaulting to base-sepolia testnet");
  }
}

validateEnvironment();

async function initializeAgent() {
  const llm = new ChatOpenAI({ model: "gpt-4o-mini" });
  const config = {
    apiKeyName: process.env.CDP_API_KEY_NAME,
    apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    networkId: process.env.NETWORK_ID || "base-sepolia",
  };
  const walletProvider = await CdpWalletProvider.configureWithWallet(config);
  const agentkit = await AgentKit.from({
    walletProvider,
    actionProviders: [
      wethActionProvider(),
      pythActionProvider(),
      walletActionProvider(),
      erc20ActionProvider(),
      cdpApiActionProvider(config),
      cdpWalletActionProvider(config),
    ],
  });
  const tools = await getLangChainTools(agentkit);
  const memory = new MemorySaver();
  const agentConfig = { configurable: { thread_id: "CDP AgentKit Chatbot Example!" } };
  const agent = createReactAgent({ llm, tools, checkpointSaver: memory });
  return { agent, config: agentConfig };
}

async function runChatMode(agent: any, config: any) {
  console.log("Starting chat mode... Type 'exit' to end.");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = (prompt: string): Promise<string> => new Promise(resolve => rl.question(prompt, resolve));

  console.log("\nI'm Isi and will help you find your next experience.");
  console.log("Please select one option for each question.\n");

  const userProfile = {
    preferences: await question("1. What do you prefer? (a) Travel (b) Try new food (c) Learn (d) Explore nature: "),
    typeOfExperience: await question("2. Do you prefer...? (a) Locals (b) Elite (c) Adventurous: "),
    idealSetting: await question("3. Ideal setting? (a) City (b) Retreat (c) Both: "),
    personality: await question("4. Personality? (a) Planner (b) Spontaneous (c) Managed: "),
    budget: await question("5. Budget? (a) High (b) Moderate (c) Affordable: "),
  };

  console.log("\nFetching recommendations for you...");
  const recommendations = await getRecommendedExperiences(userProfile);

  if (recommendations.length > 0) {
    console.log("Here are some experiences you might like:");
    recommendations.forEach(exp => {
      console.log(`- ${exp.name} (Price: $${exp.price.toFixed(2)} by ${exp.merchant})`);
    });
  } else {
    console.log("No matching experiences found at the moment.");
  }

  while (true) {
    const userInput = await question("\nPrompt: ");
    if (userInput.toLowerCase() === "exit") break;
    const stream = await agent.stream({ messages: [new HumanMessage(userInput)] }, config);
    for await (const chunk of stream) {
      console.log(chunk.agent?.messages[0]?.content || "");
    }
  }
  rl.close();
}

async function chooseMode(): Promise<"chat" | "auto"> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = (prompt: string): Promise<string> => new Promise(resolve => rl.question(prompt, resolve));
  console.log("\nAvailable modes:\n1. chat - Interactive chat mode\n2. auto - Autonomous action mode");
  const choice = (await question("Choose a mode: ")).toLowerCase().trim();
  rl.close();
  return choice === "1" || choice === "chat" ? "chat" : "auto";
}

async function main() {
  try {
    const { agent, config } = await initializeAgent();
    const mode = await chooseMode();
    if (mode === "chat") {
      await runChatMode(agent, config);
    } else {
      console.log("Autonomous mode not yet implemented.");
    }
  } catch (error) {
    console.error("Fatal error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

if (require.main === module) {
  console.log("Starting Agent...");
  main().catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export { initializeAgent, getRecommendedExperiences };