import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(request, response) {
  if (!request.body || !request.body.goal) {
    return response.status(400).json({ error: "Goal is required" });
  }

  const userGoal = request.body.goal;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // The Prompt is now a Judge
    const prompt = `
      You are a strict productivity coach. Analyze this user goal: "${userGoal}".

      Determine if this goal is "Quantified" (Specific, Measurable, Attainable).
      
      Examples of BAD goals: "Read book", "Work on project", "Study".
      Examples of GOOD goals: "Read 10 pages", "Fix the login bug", "Study Chapter 4 for 30 mins".

      Return a JSON object (NO markdown):
      {
        "is_valid": boolean, // true if quantified, false if vague
        "feedback": "string", // If false, explain why (friendly tone).
        "suggestions": ["string", "string", "string"], // If false, give 3 specific variations based on their input.
        "refined_goal": "string", // If true, just clean up the grammar/capitalization.
        "whisper": "string", // If true, give a motivational whisper.
        "time_options": [number, number, number] // If true, suggest times.
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);

    return response.status(200).json(data);

  } catch (error) {
    console.error("Gemini Error:", error);
    return response.status(500).json({ error: "AI Failed" });
  }
}