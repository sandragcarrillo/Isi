# Isi
Isi is an AI-powered platform that helps users discover and pay for experiences tailored to their preferences. By analyzing User Preferences, Isi suggests curated experiences, facilitates transactions, and ensures a seamless connection between Web2 and Web3.

Isi bridges the gap between Web2 users and Web3 experiences through a user-friendly AI agent. It analyzes user preferences, offering curated recommendations for local and online experiences. Users can explore, select, and pay for these experiences using cryptocurrency via OnchainKit's streamlined checkout and transaction flow. Isi simplifies onboarding to Web3 by hiding blockchain complexities and providing a smooth, intuitive interface. Its modular design supports future integrations, making it a scalable solution for personalized, onchain commerce.

### How It's Made

Isi is built with cutting-edge technologies to deliver a seamless user experience. The platform includes:

- **AI Agent**: Built with Coinbase's **AgentKit**, the AI processes user preferences and recommends experiences.
- **Smart Contracts**: Deployed on the **Base blockchain**, smart contracts facilitate secure escrow and payment transactions in USDC.
- **OnchainKit**: Provides wallet connection, transaction handling, and gas sponsorship for an effortless checkout experience.
- **Subgraph**: Built with **The Graph**, the subgraph indexes experience data, enabling efficient queries for the AI and frontend.
- **Frontend**: Developed with **Next.js** for modularity, responsiveness, and smooth user interactions. WalletConnect enables diverse wallet integrations for broader accessibility.
  
### [Smart contract Deployed on Base](https://sepolia.basescan.org/address/0x8D9B5030de69F1f872BE8c8BCC57542815a7203c)

# Getting Started
Before running Isi, ensure you have the following installed:

Node.js (v16+)
Yarn or npm
Hardhat for smart contract development
Access to a Coinbase API key (for AgentKit and OnchainKit integration)

1. Clone the repository:

```bash

git clone https://github.com/sandragcarrillo/Isi.git
```

2. Navigate to the isi-app directory:
```bash
cd isi-app 
```

3. Install dependencies for the frontend and agent:

```bash
# Frontend
cd frontend
yarn install
cd ..

# Agent
cd agent
yarn install
cd ..

```

4. Start AI Agent

```bash
cd agent
yarn start
```

5. Start the frontend
   
```bash
cd isi-app
yarn start
```

