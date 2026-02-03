const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const fetchPlants = async () => {
  const response = await fetch(`${API_BASE_URL}/api/plants`);
  if (!response.ok) {
    throw new Error("Failed to fetch plants");
  }
  return response.json();
};

export const sendChatMessage = async (message) => {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  const data = await response.json();
  return data.reply;
};
