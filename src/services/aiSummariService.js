import { GoogleGenAI ,  Type } from "@google/genai";


async function aiSummarie(sysPrompt , messages ,   model) {
    console.log(" AI summaries function service ")
    const ai = new GoogleGenAI({apiKey:process.env.GEMENI_AIP_KEY});
    console.log("Gemini instance created")
    try {
        const response = await  ai.models.generateContent({
            model,
            contents:messages,
            config:{
                systemInstruction:sysPrompt
            }
        })
        console.log(response
            
        )
        console.log(response.candidates[0].content)
        return {
            success:true,
            message:response.text
        }
    } catch (error) {
        console.log("Error in error in ai response service" ,  error)
        return {
            success:false,
            message:error.message || "Failed to generate response from api"
        }
    }
}

export default aiSummarie