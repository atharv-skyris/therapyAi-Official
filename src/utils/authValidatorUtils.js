import jwt from "jsonwebtoken";
import appError from "./appErrorUtils.js";

async function authValidation(req , res ,  next) {
    const token =  req.cookies.auth
    if(!token){
        return res.redirect("/auth")
    }
    try {
        const decode =  await jwt.decode(token , process.env.JWT_SECRET)
        req.user = decode
        next()
    } catch (error) {
        next(error)
    }
}

export default authValidation