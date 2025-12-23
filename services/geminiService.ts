
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export class GeminiService {
  /**
   * Edits an image based on a text prompt using Gemini 2.5 Flash Image.
   */
  static async editImage(base64Image: string, prompt: string): Promise<string | null> {
    // Initialize the client right before the API call to ensure the latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      // Removing data:image/png;base64, prefix if present
      const cleanBase64 = base64Image.split(',')[1] || base64Image;
      
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: 'image/png',
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      // Iterate through candidates to find the image part
      for (const part of response.candidates?.[0]?.content.parts || []) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Gemini Image Edit Error:", error);
      return null;
    }
  }

  /**
   * Generates a summary or analysis of movement trends (text-based).
   */
  static async analyzeTrends(dataStr: string): Promise<string> {
    // Initialize the client right before the API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the following inventory movement data and provide a concise summary of logistics efficiency and any anomalies: ${dataStr}`,
      });
      // Directly access .text property as it is a getter, not a method
      return response.text || "No analysis available.";
    } catch (error) {
      console.error("Gemini Trend Analysis Error:", error);
      return "Trend analysis failed.";
    }
  }
}
