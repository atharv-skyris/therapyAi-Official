import mongoose from "mongoose"
import appError from "../utils/appErrorUtils.js"
async function connectMongoDB() {
    try {
        await mongoose.connect(process.env.MONGODB_STRING)
        console.log("connected with mongo db ")
        // console.log(db)

    } catch (error) {
        console.log(error)

        // this comand will stop  the server and 1 is tell that 
        // it stops with a critical error
        process.exit(1)
    }
}

export default connectMongoDB
