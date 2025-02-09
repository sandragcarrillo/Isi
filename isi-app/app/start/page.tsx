"use client";

import { useState } from "react";
import PreferenceSelector from "../components/preference-selector";
import RecommendationCards from "../components/ReccomendationCards";
import { fetchRecommendations } from "../utils/api";
import { Recommendation } from "../types";
import { Transaction, TransactionButton } from "@coinbase/onchainkit/transaction";
import { parseEther } from "ethers";
import contractABI from "@/artifacts/Isi.json";

const contractAddress = "0x8D9B5030de69F1f872BE8c8BCC57542815a7203c";

const questions = [
  { key: "preferences", question: "What do you prefer?", options: ["Travel", "Try new food", "Learn", "Explore nature"] },
  { key: "typeOfExperience", question: "Do you prefer...?", options: ["Locals", "Elite", "Adventurous"] },
  { key: "idealSetting", question: "Ideal setting?", options: ["City", "Retreat", "Both"] },
  { key: "personality", question: "Personality?", options: ["Planner", "Spontaneous", "Managed"] },
  { key: "budget", question: "Budget?", options: ["High", "Moderate", "Affordable"] },
];

export default function ChatInterface() {
  const [step, setStep] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<Record<string, string>>({});
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedCall, setSelectedCall] = useState<any[]>([]);

  const handlePreferenceSelect = async (key: string, value: string) => {
    const updatedProfile = { ...userProfile, [key]: value };
    setUserProfile(updatedProfile);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const data = await fetchRecommendations(updatedProfile);
      setRecommendations(data.recommendations);
      setStep(questions.length);
    }
  };

  const handleRecommendationSelect = (recommendation: Recommendation) => {
    const calls = [
      {
        to: contractAddress,
        functionName: "buyService", 
        args: [recommendation.serviceId], 
        value: parseEther(recommendation.price.toString()).toString(), 
      },
    ];
    setSelectedCall(calls);
  };

  const handleTransactionStatus = (status: any) => {
    const { statusName } = status;
    switch (statusName) {
      case "success":
        alert("Purchase completed successfully!");
        setStep(questions.length + 1);
        break;
      case "error":
        alert("An error occurred during the transaction.");
        break;
      default:
        console.log("Transaction status:", statusName);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {step < questions.length && (
        <PreferenceSelector
          question={questions[step].question}
          options={questions[step].options}
          onSelect={(value) => handlePreferenceSelect(questions[step].key, value)}
        />
      )}

      {step === questions.length && (
        <>
          <RecommendationCards
            recommendations={recommendations}
            onSelect={handleRecommendationSelect}
          />
          {selectedCall.length > 0 && (
            <Transaction
              calls={selectedCall}
              onStatus={handleTransactionStatus}
              abi={contractABI} 
            >
              <TransactionButton></TransactionButton>
            </Transaction>
          )}
        </>
      )}

      {step === questions.length + 1 && (
        <div className="text-center"> 
          <h2 className="text-2xl font-bold mb-4">Thank you!</h2>
          <p className="text-lg">Your purchase has been successfully completed.</p>
        </div>
      )}
    </div>
  );
}
