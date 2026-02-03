import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const createChatCompletion = async ({ messages, temperature = 0.4 }) => {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const response = await client.chat.completions.create({
    model,
    messages,
    temperature,
  });

  return response.choices?.[0]?.message?.content ?? "";
};
