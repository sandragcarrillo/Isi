export const fetchRecommendations = async (userProfile: any) => {
    console.log("Calling /api/recommendations with:", userProfile);
  
    const response = await fetch("http://localhost:3001/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userProfile }),
    });
  
    const data = await response.json();
    console.log("Response from /api/recommendations:", data);
  
    return data;
  };
  
  export async function sendChatMessage(userInput: string) {
    const response = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput }),
    });
    if (!response.ok) {
      throw new Error("Failed to send chat message");
    }
    return response.json();
  }
  