import redisClient from "../config/redisConfig.js";

async function updateRedis(email, aiResponse) {
    try {
        await redisClient.lPush(`users:${email}`, JSON.stringify(aiResponse));
        await redisClient.expire(`users:${email}`, 3600);
        return {
            success: true,
            message: "Redis list updated successfully",
        }
    } catch (error) {
        console.log("error in redis service updateRedislist function", error);
        return {
            success: false,
            message: "Error updating Redis list",

        }
    }
    
}

async function getMessagesFromRedis(email) {
    try {
        const messages = await redisClient.lRange(`users:${email}`, 0, 4);
        const jsonMessages = messages.map(msg => JSON.parse(msg));
        console.log("jsonMessages from redis", jsonMessages);
        return {
            success: true,
            message: jsonMessages
        }
    } catch (error) {
        console.log("error in redis service getMessagesFromRedis function", error);
        return {
            success: false,
            message: "Error getting messages from Redis list",

        }
    }
}

export { updateRedis, getMessagesFromRedis };