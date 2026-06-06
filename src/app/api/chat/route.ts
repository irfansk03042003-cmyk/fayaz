import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIRDOSA_SYSTEM_PROMPT } from "@/lib/airdosa-knowledge";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "GEMINI_API_KEY is not configured." },
      { status: 500 },
    );
  }

  let messages: ChatMessage[];

  try {
    const body = await request.json();
    messages = body.messages;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "Messages are required." }, { status: 400 });
  }

  const lastMessage = messages[messages.length - 1];

  if (lastMessage.role !== "user" || !lastMessage.content.trim()) {
    return Response.json(
      { error: "Last message must be a non-empty user message." },
      { status: 400 },
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: AIRDOSA_SYSTEM_PROMPT,
    });

    const history = messages.slice(0, -1).map((message) => ({
      role: message.role === "user" ? ("user" as const) : ("model" as const),
      parts: [{ text: message.content }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    const reply = result.response.text();

    return Response.json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error);
    return Response.json(
      { error: "Failed to get a response. Please try again." },
      { status: 500 },
    );
  }
}
