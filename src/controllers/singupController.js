import appError from "../utils/appErrorUtils.js"
import user from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


async function singupController(req , res ,  next) {
    const {userName ,  password ,  email} =  req.body
    try {
        const existingUser = await user.findOne({email})
        if(existingUser){
            console.log("user alredy exist")
            next(new appError("User alredy exist" ,  400))
        }

        console.log("creating user ")        

        const hashedPasswrd =  await bcrypt.hash(password ,  5)
        await user.create({ userName, passowrd:hashedPasswrd, email });
        
        console.log("user is created")

        // const token = jwt.sign({
        //     email:email,
        //     id:newUser._id
        // } , process.env.JWT_SECRET , {expiresIn:"7d"})        

        // res.cookie("token" , token ,{
        //     httpOnly:true,
        //     sameSite: "strict",
        //     maxAge: 7 * 24 * 60 * 60 * 1000, 
        // })

        // console.log("cookie is created")

        res.status(200).json({
            success: true,
            message: "Sign Up! successfully.Please login"
        });
          

    } catch (error) {
        console.log("catch error in singup controller")
        next(error)
    }    

}

export default singupController