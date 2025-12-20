import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(request, response) {
  // 1. Check for request body
  if (!request.body || !request.body.goal) {
    return response.status(400).json({ error: "Goal is required" });
  }

  const userGoal = request.body.goal;

  try {
    // 2. Select the Model (Flash is fast and free)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Construct the Prompt (Asking for JSON explicitly)
    const prompt = `
      You are a productivity expert. The user has a goal: "${userGoal}".
      
      Please return a JSON object (NO markdown formatting, just raw JSON) with:
      1. "quantified_goal": A specific, measurable version of the goal (max 15 words).
      2. "time_options": An array of 3 recommended durations in minutes (e.g. [15, 30, 45]).
      3. "whisper": A short, motivational sentence to whisper to them.
      
      Example output format:
      {
        "quantified_goal": "Read 10 pages of biology textbook",
        "time_options": [20, 40, 60],
        "whisper": "Focus on the process, the learning will follow."
      }
    `;

    // 4. Call the API
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 5. Clean the output (Gemini sometimes adds ```json markers)
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);

    return response.status(200).json(data);

  } catch (error) {
    console.error("Gemini Error:", error);
    return response.status(500).json({ error: "Failed to process goal" });
  }
}