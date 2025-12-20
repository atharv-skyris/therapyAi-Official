import appError from "../utils/appErrorUtils.js";
import geminiWrapper from "../services/geminiWrapperService.js";
import geminiVoiceModel from "../services/geminiVoiceModelService.js";
import usersObj from "../config/userTrakeerConfig.js";
import updateDB from "../services/updatedDbService.js";

async function callGeminiForResponse(email, username, prompt) {
  console.log("gemini for response");
  console.log("first req sended");

  let geminiResponse = await geminiWrapper(
    email,
    username,
    prompt,
    "response",
    "gemini-2.5-pro"
  );

  if (!geminiResponse.success) {
    console.log("sencond request sended");

    geminiResponse = await geminiWrapper(
      email,
      username,
      prompt,
      "response",
      "gemini-2.5-flash"
    );
    if (!geminiResponse.success) {
      console.log(geminiResponse.message);
      return {
        success: false,
        message: "I am having issues right now.Please try again later",
      };
    }
  }

  console.log("gemini response success");

  if (geminiResponse.success) {
    return {
      success: true,
      message: geminiResponse.message,
      data: geminiResponse.data
    };
  }
}

async function aiController(req, res, next) {
  console.log("Ai controller");
  const { userPrompt ,  audioRes} = req.body;
  const user = req.user;

  console.log("user from ai controller", user);
  console.log("userPrompt from ai controller", req.body);

  if (!userPrompt || userPrompt.trim().length === 0) {
    // call gemini voice model with message "sorry i can't here anything"
    return res.status(200).json({
      success: true,
      message: "sorry i can't here anything",
    });
  }

  if (!usersObj[user.email]) {
    console.log("new user object created into usersObj(userTraker) " ,  user.email);
    usersObj[user.email] = {
      TotalMessages: 0,
      VecDbUpdates:0,
      Last5Messages:0
    }
    // this condtion is for if is this user 1st prompt of the session
  }

  const geminiResponse = await callGeminiForResponse(
    user.email,
    user.username,
    userPrompt
  );

  // console.log("====geminiResponse from ai controller", geminiResponse);

  const aiResponse = geminiResponse.message?.response || geminiResponse.message;
  console.log("aiResponse", aiResponse);  
  if (geminiResponse.success) {
    await updateDB(user.email, geminiResponse.message.summaries ,  geminiResponse.data)

  }

  console.log("response from gemini api", aiResponse);

  if(!audioRes){
    return res.status(200).json({
      success: true,
      data: aiResponse,
    });
  }

  const voiceResponse = await geminiVoiceModel(aiResponse);

  if (!voiceResponse.success) {
    return res.status(500).json({
      success: false,
      data: "I am issues right now.Please try again later--fuck off",
    });
  }

  return res.status(200).json({
    success: true,
    data: voiceResponse.message,
  });
}

export default aiController;
