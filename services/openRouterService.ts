
import { TOOLS } from '../constants';

const OPENROUTER_API_KEY = process.env.OPENROUTER_KEY || "";

export interface BatchArticle {
  toolId: string;
  title: string;
  content: string;
  summary: string;
}

/**
 * StrongTools OpenRouter Integration
 * Handles bulk generation of scholarly articles for AdSense optimization.
 */
export const generateDailyBatch = async (): Promise<BatchArticle[]> => {
  if (!OPENROUTER_API_KEY) {
    console.error("OpenRouter API key is missing. Batch generation aborted.");
    return [];
  }

  // Select 10 tools based on current date to ensure daily variety
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const selectedTools = Array.from({ length: 10 }).map((_, i) => {
    const index = (dayOfYear + i) % TOOLS.length;
    return TOOLS[index];
  });

  const toolPromptList = selectedTools.map(t => `'${t.name}' (ID: ${t.id}): ${t.description}`).join('\n');

  const systemInstruction = `You are a Senior Technical Technical Writer for StrongTools. 
  Your tone is formal, efficient, and highly professional. 
  You generate high-quality, unique HTML content optimized for Google AdSense. 
  Avoid repetitive phrasing. Focus on technical utility and expert professional guides.`;

  const prompt = `Generate 10 distinct professional articles (600 words each) for the following digital instruments:
  ${toolPromptList}

  REQUIREMENTS:
  1. Content must be unique, artisanal, and scholarly.
  2. Use structured HTML (h2, h3, p, strong) for the content field.
  3. Format the output as a STICKY JSON ARRAY of 10 objects.
  
  JSON SCHEMA:
  [{
    "toolId": "string",
    "title": "Professional SEO-optimized title",
    "content": "HTML string (600 words)",
    "summary": "Brief 20-word scholarly abstract"
  }]`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://strongtools.site",
        "X-Title": "StrongTools Archive Generator",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.0-flash-001", // Optimized for high-token output and JSON structure
        "messages": [
          { "role": "system", "content": systemInstruction },
          { "role": "user", "content": prompt }
        ],
        "response_format": { "type": "json_object" }
      })
    });

    const result = await response.json();
    const contentText = result.choices[0]?.message?.content;

    if (!contentText) throw new Error("Null response from OpenRouter");

    // Handle cases where AI wraps JSON in a root object or markdown
    const cleanedJson = contentText.replace(/```json|```/gi, "").trim();
    const parsed = JSON.parse(cleanedJson);

    // Return the array directly if it's the root, or extract the list property
    return Array.isArray(parsed) ? parsed : (parsed.articles || parsed.data || []);

  } catch (error) {
    console.error("Critical Batch Generation Failure:", error);
    return selectedTools.map(t => ({
      toolId: t.id,
      title: `${t.name}: The Professional Utility Benchmark`,
      content: `<h2>Technical Overview</h2><p>The ${t.name} remains a foundational instrument in the StrongTools vault. Its logic is designed for peak professional efficiency.</p>`,
      summary: "Institutional failover summary for technical instruments."
    }));
  }
};
