import { getMessagesFromRedis, updateRedis } from "./redisService.js";
import usersObj from "../config/userTrakeerConfig.js";
import generateEmbeddings from "./generateEmbeddingsConfig.js";
import { appendEmbedding } from "./qdrandOperationsService.js";

async function updateDB(email, aiResponse, data) {
  console.log("updateDB function called");
  // console.log(data)
  const updateRedislist = await updateRedis(email, aiResponse);
  if (updateRedislist.success) {
    usersObj[email].TotalMessages += 1;
    usersObj[email].Last5Messages += 1;
  }

  console.log("updateRedislist", updateRedislist.message);
  //   data.pop();
  //   data.unshift({ user: aiResponse.user, ai: aiResponse.ai });
  if (usersObj[email].Last5Messages >= 5) {
    let text = data.map((mes) => {
      return `user--> ${mes.user}\nAI--> ${mes.ai}`;
    });
    console.log("messageList", text);
    const emebeddings = await generateEmbeddings(text);
    if (emebeddings.success) {
      console.log("Embeddings generated successfully");
      console.log(emebeddings);
      const qdOperation = await appendEmbedding(emebeddings.message, false, {
        email,
        text,
      });
      if (!qdOperation.success) return next(new appeError("Unable to save", 500));
      usersObj[email].Last5Messages = 0;
      usersObj[email].VecDbUpdates += 1 
    } else {
      return next(new appError("i am having issues righ now", 500));
    }
  }

  console.log("usersObj after update", usersObj[email]);

  return {
    success: true,
    message: "Database updated successfully",
  };
}
export default updateDB;
