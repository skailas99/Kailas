import { useState } from "react";

import { sendChatMessage } from "../services/api.js";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! Ask me about herbal remedies or traditional AYUSH usage.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(userMessage.content);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I could not reach the AI service right now.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`chat-message ${message.role}`}
          >
            <span>{message.content}</span>
          </div>
        ))}
        {isLoading && <div className="chat-message assistant">Thinking...</div>}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask about herbs, safety, or traditional uses..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
