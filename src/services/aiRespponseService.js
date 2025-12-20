import { GoogleGenAI ,  Type } from "@google/genai";

const JSON_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        response: {
            type: Type.STRING,
            description: "The full, generated AI response to the user's prompt."
        },
        summaries: {
            type: Type.OBJECT,
            properties: {
                ai: {
                    type: Type.STRING,
                    description: "A summary of the 'response' field. Use the original text if it's short, or a 2-3 sentence summary if it's long."
                },
                user: {
                    type: Type.STRING,
                    description: "A summary of the user's input prompt. Use the original text if it's short, or a 2-3 sentence summary if it's long."
                }
            },
            required: ["user", "ai"]
        }
    },
    required: ["response", "summaries"]
};

async function aiResponse(sysPrompt , userPrompt ,  model) {
    console.log("ai response")
    const ai = new GoogleGenAI({apiKey:process.env.GEMENI_AIP_KEY});
    console.log("Gemini instance created")
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents:userPrompt,
            config:{
                responseMimeType:"application/json",
                responseSchema:JSON_SCHEMA,
                systemInstruction:sysPrompt
            }
        });
        const responseData =  JSON.parse(response.text)
        console.log("response genrated from gemini api")
        return{
            success:true,
            message:responseData
        }
    } catch (error) {
        console.log("Error in error in ai response service" ,  error)
        return {
            success:false,
            message:error.message || "Failed to generate response from api"
        }
        
    }
}

export default aiResponse