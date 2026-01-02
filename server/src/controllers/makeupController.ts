import { Request, Response } from 'express';
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import * as fs from "node:fs";
dotenv.config();
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
export const generateMakeup = async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body || "hey banana nano";
        if (!prompt) {
            res.status(400).json({ error: "Prompt is required" });
            return;
        }
        console.log("Generating makeup...");
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: prompt,
        });
         res.json(response.candidates?.[0]);
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
                const buffer = Buffer.from(part.inlineData.data, "base64");
                fs.writeFileSync("banana.png", buffer);
                imageData = part.inlineData.data;
            }
        }
   
        if (imageData) {
            fs.writeFileSync("output.png", Buffer.from(imageData, "base64"));
            res.json({ image: imageData, text: textData });
        } else if (textData) {
            res.json({ text: textData });
        } else {
            res.status(500).json({ error: "No valid content found in response" });
        }

    } catch (error : any) {
        console.error("Error generating makeup:", error);
        res.status(500).json({ error: "Internal server error",err:error });
    }
};
