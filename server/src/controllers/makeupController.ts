import { Request, Response } from 'express';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const generateMakeup = async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            res.status(400).json({ error: "Prompt is required" });
            return;
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: prompt,
        });

        const candidate = response.candidates?.[0];
        if (!candidate || !candidate.content?.parts) {
            console.error("No content found in the response.");
            res.status(500).json({ error: "No content generated" });
            return;
        }

        let imageData: string | null = null;
        let textData: string | null = null;

        for (const part of candidate.content.parts) {
            if (part.text) {
                textData = part.text;
            } else if (part.inlineData && part.inlineData.data) {
                imageData = part.inlineData.data;
            }
        }

        if (imageData) {
            res.json({ image: imageData, text: textData });
        } else if (textData) {
            res.json({ text: textData });
        } else {
            res.status(500).json({ error: "No valid content found in response" });
        }

    } catch (error) {
        console.error("Error generating makeup:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
