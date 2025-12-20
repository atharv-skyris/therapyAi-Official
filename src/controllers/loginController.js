import appError from "../utils/appErrorUtils.js";
import user from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


async function loginController(req, res, next) {
  console.log("login controller");
  const { email, password } = req.body;

  try {
    const User = await user.findOne({ email });
    if (!User) {
      console.log("Inavid email, account not exist");
      return next(new appError("Invalid cradintials", 400));
    }

    console.log("account exist,");

    const passwordMatch = await bcrypt.compare(password, User.passowrd);
    if (!passwordMatch) {
      console.log("password is  inccorect");
      return next(new appError("Invalid cradintials", 400));
    }

    console.log("password is correct");

    const token = jwt.sign({
        email:email,
        username:user.userName,
        id:User._id
    } , process.env.JWT_SECRET , {expiresIn:"7d"})

    res.cookie("auth" , token ,{
        httpOnly:true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    console.log("cookie is created")

    res.status(200).json({
        success:true,
        message:"Login successfully"
    })
  } catch (error) {
    return next(error);
  }
}

export default loginController;
