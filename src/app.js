import express from "express";
import dotenv from "dotenv";
import path from "path"
import connectMongoDB from "./config/mongodbConfig.js";
import cookieParser from "cookie-parser";

// load env variables
// dotenv.config();

// routes import
import aiRoute from "./routes/aiRoute.js"
import notesRoute from "./routes/notesRoute.js"
import authRoute from "./routes/authRoute.js"
import settingsRoute from "./routes/settingsRoute.js"
import authValidation from "./utils/authValidatorUtils.js";
import redisClient from "./config/redisConfig.js";
import qdrantClient from "./config/qdrantdbConfig.js";
import getSummarie from "./controllers/getSummarieController.js";
import userLeave from "./controllers/userLeaveController.js";




const app = express();
// const PORT = process.env.PORT || 4000;

// middleware for json response & cookieparser
app.use(express.json());
app.use(cookieParser())

// setup ejs
app.set("view engine" ,  "ejs")
app.set("views" ,  path.resolve("src" , "views"))

// setup public folder
app.use("/public" ,  express.static(path.resolve("public")))

// routes
app.use("/ai" , authValidation ,  aiRoute)
app.use("/notes" , authValidation ,   notesRoute)
app.use("/auth"  , authRoute)
app.use("/settings" , authValidation , settingsRoute)
app.use("/getSum"  ,  authValidation ,  getSummarie)
app.use("/leaving" , authValidation , userLeave)


// dummy routes
app.get("/", (req, res) => {
  res.redirect("/ai");
});



// global error handler
app.use((err, req, res, next) => {
  console.log("==============  Global error handler  ==============")

  let status  = 500
  let errMess = 'something went wrong'

  if(err.isOperational){
    console.log("error is operational")
    status  =  err.statusCode
    errMess =  err.message
  }
  console.log(status  ,  errMess)
  console.error(err.stack);

  res.status(status).json({ message: errMess});
});

// await connectMongoDB()
// await redisClient.connect()

// await qdrantClient.createCollection('Therapy-ai' , {
//   vectors: { size:3072 , distance: "Cosine" }
// })

// const collections =  await qdrantClient.getCollections()

// console.log("qdrantdb is successfully connected-->" ,  collections)

// redisClient.set('foo', 'bar');
// const result = await redisClient.get('foo');

// console.log("redis is successfully  connected-->" ,  result)  



// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

export default app