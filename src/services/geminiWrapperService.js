import { response } from "express";
import aiResponse from "./aiRespponseService.js";
import generateSystemPrompt from "./generateSystemPrompService.js";
import redisClient from "../config/redisConfig.js";
import aiSummarie from "./aiSummariService.js";

async function geminiWrapper(email , username ,  prompt ,  task ,  model) {
    console.log("gemini wrapper")
    try {
        let response  
        let  sysPrompt
        if(task === 'response'){
            //  generate user response
            sysPrompt =  await generateSystemPrompt(email ,  username ,  prompt)
            if(!sysPrompt.success){
                return{
                    success:false,
                    message:"Unable to make the system prompt"
                }
            }
            response  =  await aiResponse(sysPrompt.message ,  prompt , model)

        }else if(task === "summarie"){
            // generate user traits
            const messages = (await redisClient.lRange(`users:${email}`, 0, -1)).map(msg => JSON.parse(msg));
            console.log(messages);
            const conversation = messages
            .map(msg => `User: ${msg.user}\nAI: ${msg.ai}`)
            .join("\n\n");
            response  =  await aiSummarie(
                prompt , conversation , "gemini-2.5-flash"
            )

        }else if(task === "vecEmbeddings"){
            // generate vector embeddings
        }

        if (!response.success) {
            return response; 
        }
        console.log("200 ok")
        return {
            success:true,
            message:response.message,
            data:task === 'response' ? sysPrompt.data : null
        }
    } catch (error) {
        console.log("Error in error in gemini wrapper service" ,  error)
        return{
            success:false,
            message:"Internal  error occur "
        }
    }


}

export default geminiWrapper