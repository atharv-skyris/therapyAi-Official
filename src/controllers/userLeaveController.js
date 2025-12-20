import redisClient from "../config/redisConfig.js";
import usersObj from "../config/userTrakeerConfig.js";
import generateEmbeddings from "../services/generateEmbeddingsConfig.js";
import { appendEmbedding } from "../services/qdrandOperationsService.js";

async function userLeave(req, res, next) {
  console.log("User leave controller");

  const { email } = req.user;
  if (usersObj[email]) {
    const remainingMessages =
      usersObj[email].TotalMessages - usersObj[email].VecDbUpdates * 5;

    console.log(remainingMessages);

    const redisMessages = (
      await redisClient.lRange(
        `users:${email}`,
        0,
        Number(remainingMessages) - 1
      )
    ).map((msg) => JSON.parse(msg));

    console.log(redisMessages);

    let text = redisMessages.map((mes) => {
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
      if (!qdOperation.success)
        return next(new appeError("Unable to save", 500));
      usersObj[email].Last5Messages = 0;
      usersObj[email].VecDbUpdates += 1;
    }

    await redisClient.del(`users:${email}`);
    console.log("user deleted from redis")

    delete  usersObj[email]
    console.log("user trace deleted")
  }

  return;
}

export default userLeave;
