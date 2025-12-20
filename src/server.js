import 'dotenv/config'

import http from 'http'
import app from './app.js'

const PORT = process.env.PORT || 4000

// databases
import connectMongoDB from './config/mongodbConfig.js'
import redisClient from './config/redisConfig.js'
import qdrantClient from './config/qdrantdbConfig.js'


async function connectWithDBs() {
    try {
      await connectMongoDB()
      console.log("Mongo connected successfully")  

      await redisClient.connect()
      console.log("Redis connected successfully")

      const collections = await qdrantClient.getCollections()
      console.log("QdrantDB connected successfully")
      console.log(collections)
    
        
    } catch (error) {
        console.log("Unable to the server reason is below")
        console.log(error.message)
        process.exit(1);
    }
}

await connectWithDBs();
const server = http.createServer(app)
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  
  // console.log(`Server is running on port ${PORT}`)
})