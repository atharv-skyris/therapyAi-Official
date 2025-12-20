import fs from  "fs/promises"
import path from "path"
import { getMessagesFromRedis } from "./redisService.js"
import generateEmbeddings from "./generateEmbeddingsConfig.js"
import { searchVector } from "./qdrandOperationsService.js"


async function  generateSystemPrompt(email , username ,  text) {
    console.log("generate system prompt function")

    try {
        const filePath =  path.resolve("src/prompt" ,  "systemPrompt.txt")

        console.log("filePath " ,  filePath)

        const sysInstruction =  await fs.readFile(filePath)

        const redisMess  = await getMessagesFromRedis(email)

        let previousMemo 
        const emebeddings = await generateEmbeddings(text);
        if(emebeddings.success){
            console.log("Embeddings generated successfully")
            console.log(emebeddings.message[0])

            const qdOperation = await searchVector(emebeddings.message[0] , email);
            if(qdOperation.success){
                console.log("Qdrant search success" ,  qdOperation.message)
                previousMemo = qdOperation.data.map(obj=>{
                    return obj.payload.obj
                })
            }
        }
        
        console.log("previousMemo" ,  previousMemo)

        const systemprompt = `
        UserName-->${username}
        ${sysInstruction}

        This is the last 5 messages from the conversation history , message are from the newest at top to old at bottom
        ${JSON.stringify(redisMess.message, null, 2)}

        This is the relevant memory from the past conversations with user
        ${JSON.stringify(previousMemo ,  null , 2)}
        `

        return {
            success:true,
            message:systemprompt,
            data:redisMess.message
        }

    } catch (error) {
        console.log("systemprompt error" ,  error)
        return {
            success:false,
            message:"unable to get the system prompt"
        }
    }
}

export  default generateSystemPrompt