
import { GoogleGenAI } from "@google/genai";
import { TOOLS } from "../constants";

const GEMINI_KEY = process.env.API_KEY || "";

export interface ArchivalRecord {
  title: string;
  content: string;
  imageUrl: string | null;
  type: 'MASTER' | 'PRO' | 'DRAFT';
  timestamp: number;
}

const cleanSimpleProse = (text: string) => {
  return text
    .replace(/[\*\~\#\>\-\+]/g, '') // Remove confusing markdown symbols
    .replace(/\s\s+/g, ' ') // Remove double spaces
    .trim();
};

export const getPixabayImage = async (query: string): Promise<string | null> => {
  try {
    const url = `https://pixabay.com/api/?key=48924033-0c30626359e86566498506253&q=${encodeURIComponent(query + ' technology')}&image_type=photo&orientation=horizontal&safesearch=true&per_page=3`;
    const response = await fetch(url);
    const data = await response.json();
    return data.hits?.length > 0 ? data.hits[0].largeImageURL : null;
  } catch { return null; }
};

const generateComprehensiveArchive = async (tool: any, retryCount = 0): Promise<Partial<ArchivalRecord> | null> => {
  if (!GEMINI_KEY) return null;
  const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });
  
  const prompt = `Act as a senior technical historian. Write an extensive professional manuscript for the tool '${tool.name}' that exceeds 600 words in clear, natural English.
  
  The manuscript must follow this structure with bold, clear headers:
  1. **What is this tool?** (A deep conceptual and technical definition).
  2. **How to use this tool?** (Detailed step-by-step instructions for professionals).
  3. **Why do you need this tool?** (Compelling benefits and real-world impact).
  4. **Frequently Asked Questions?** (Include at least 5 conversational questions ending with a question mark and their deep answers).
  
  STRICT RULES:
  - Total word count must be 600 or more.
  - DO NOT use bullet points or excessive symbols. Use flowing paragraphs.
  - The tone must be human, sophisticated, and authoritative.
  - Use standard 1234567890 numerals only.
  - Avoid technical jargon that is too obscure; keep it professional but understandable.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        systemInstruction: "You are the Head Scribe of StrongTools. You write very long, scholarly, and human-like prose without using lists or symbols unless absolutely necessary.",
        temperature: 0.7
      }
    });
    
    let rawText = response.text || "";
    // Transform double newlines into paragraphs for clean HTML rendering
    const formattedContent = rawText.split('\n\n').map(p => `<p class="mb-6">${cleanSimpleProse(p)}</p>`).join('');
    
    return { 
      title: `${tool.name}: Complete Professional Guide`, 
      content: formattedContent, 
      type: 'MASTER' 
    };
  } catch (error: any) {
    return null;
  }
};

export const getAutomatedArchive = async (toolId: string): Promise<ArchivalRecord | null> => {
  const tool = TOOLS.find(t => t.id === toolId);
  if (!tool) return null;

  const cacheKey = `st_v5_archive_${toolId}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  let record = await generateComprehensiveArchive(tool);
  
  if (!record) {
    record = {
      title: `${tool.name} Manual`,
      content: `<p>The archive is currently synchronizing. Please refresh to view the full 600-word manuscript.</p>`,
      type: 'DRAFT'
    };
  }

  const imageUrl = await getPixabayImage(tool.name);
  const finalRecord: ArchivalRecord = {
    title: record.title || tool.name,
    content: record.content || "",
    imageUrl,
    type: record.type || 'DRAFT',
    timestamp: Date.now()
  };

  localStorage.setItem(cacheKey, JSON.stringify(finalRecord));
  return finalRecord;
};

export const getCycleMetadata = () => ({ cycleString: "Registry v5.0.1" });
export const getArchivedContent = async (id: string) => getAutomatedArchive(id);
export const getDailyQuote = async () => ({ quote: "Accuracy is the foundation of digital sovereignty.", author: "StrongTools Archive" });
export const getOnThisDay = async () => "A day of precision and archival excellence.";
export const getDetailedArticle = async (id: string) => getAutomatedArchive(id);
export const getDailyChronicles = async () => [];
