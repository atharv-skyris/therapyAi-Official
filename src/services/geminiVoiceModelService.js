import { GoogleGenAI } from "@google/genai";
import convertIntoWav from "./convertIntoWavService.js";


async function geminiVoiceModel(aiResponse) {
  console.log("gemini voice model called");

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMENI_AIP_KEY,
  });

  console.log("Instance Created");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: aiResponse }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Zephyr" },
          },
        },
      },
    });

    console.log("response genrated")

    const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const audioBuffer = Buffer.from(data, "base64");

    console.log("audio buffer created from base64");

    const buffer = await convertIntoWav(audioBuffer)

    console.log("buffer converted into wav")

    return {
      success: true,
      message: buffer.toString("base64"),   
    };
  } catch (error) {

    console.log("error in gemini voice model", error);

    return {
      success: false,
      message: "unable to make the audio",
    };
  }
}

export default geminiVoiceModel