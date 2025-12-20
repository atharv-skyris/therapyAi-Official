import mongoose from "mongoose";

const personalityTraitSchema = new mongoose.Schema({
    values: [String],
    likes: [String],
    dislikes: [String],
    sensitivities: [String]
  }, { _id: false }
);

const userSchema = new mongoose.Schema({
    userName:{type:String ,  required:true},
    email:{type:String ,  required:true ,  unique:true},
    passowrd:{type:String , required:true ,  unique:true},
    traits:personalityTraitSchema
})

const user = mongoose.model("User" ,  userSchema)
export default user