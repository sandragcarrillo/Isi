"use client";

import { useState } from "react";
import PreferenceSelector from "../components/preference-selector";
import RecommendationCards from "../components/ReccomendationCards";
import { fetchRecommendations, sendChatMessage } from "../utils/api";
import { Recommendation } from "../types";

const questions = [
  { key: "preferences", question: "What do you prefer?", options: ["Travel", "Try new food", "Learn", "Explore nature"] },
  { key: "typeOfExperience", question: "Do you prefer...?", options: ["Locals", "Elite", "Adventurous"] },
  { key: "idealSetting", question: "Ideal setting?", options: ["City", "Retreat", "Both"] },
  { key: "personality", question: "Personality?", options: ["Planner", "Spontaneous", "Managed"] },
  { key: "budget", question: "Budget?", options: ["High", "Moderate", "Affordable"] },
];

export default function ChatInterface() {
  const [step, setStep] = useState(0); // Indica la pregunta actual
  const [userProfile, setUserProfile] = useState<Record<string, string>>({});
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [chatResponse, setChatResponse] = useState("");

  const handlePreferenceSelect = async (key: string, value: string) => {
    const updatedProfile = { ...userProfile, [key]: value };
    setUserProfile(updatedProfile);

    console.log("Updated user profile:", updatedProfile); // Debug log

    // Avanzar a la siguiente pregunta
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      console.log("Profile completed. Fetching recommendations...");
      const data = await fetchRecommendations(updatedProfile);
      setRecommendations(data.recommendations);
      setStep(questions.length); // Cambia al paso de recomendaciones
    }
  };

  const handleRecommendationSelect = async (recommendation: Recommendation) => {
    console.log("Selected recommendation:", recommendation); // Debug log
    const data = await sendChatMessage(`I chose ${recommendation.name}`);
    setChatResponse(data.response);
    setStep(questions.length + 1); // Cambia al paso de chat
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
        <RecommendationCards
          recommendations={recommendations}
          onSelect={handleRecommendationSelect}
        />
      )}
      {step === questions.length + 1 && (
        <div className="chat-response">
          <h2 className="text-2xl font-bold">Chatbot Response</h2>
          <p className="mt-4 text-lg">{chatResponse}</p>
        </div>
      )}
    </div>
  );
}
