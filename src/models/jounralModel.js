import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
const jounralSchema =  new mongoose.Schema({
    email:{type:String  , required:true},
    title:{type:String ,  required:true},
    content:{type:String ,  required:true},
    id:{type:String ,  required:true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const jounral = mongoose.model('Jounrals' ,  jounralSchema)
export default jounral