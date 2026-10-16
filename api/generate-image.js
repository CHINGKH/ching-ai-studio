import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, aspectRatio } = req.body;
    
    // បង្កើត instance ជាមួយ Gemini API Key ដែលបានកំណត់ក្នុង Vercel Environment Variables
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // ប្រើប្រាស់ Imagen model របស់ Google សម្រាប់បង្កើតរូបភាព
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio || '1:1',
      },
    });

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Failed to generate image with Gemini API' });
  }
}
