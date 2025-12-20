import { GoogleGenAI } from "@google/genai";

async function generateEmbeddings(text){
    console.log("generate embeddings config service")
    try {
        const ai = new GoogleGenAI({apiKey:process.env.GEMENI_AIP_KEY});

        console.log("Instance created")

        const response = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: text,
        });
        // const embeddings  = response.embeddings[0].values

        console.log("Embeddings generated from gemini api")

        const embeddingsList = response.embeddings
        const  embeddings = embeddingsList.map(emb => emb.values)
        return{
            success:true,
            message:embeddings
        }
    
    } catch (error) {
        console.log("Error in generate embeddings config service" ,  error)
        return{
            success:false,
            message:"Internal error occur"
        }
    }
}

export default generateEmbeddings