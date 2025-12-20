import express from "express";
import fieldValidator from "../middlewares/fieldValidatorMiddleware.js";
import singupController from "../controllers/singupController.js";
import loginController from "../controllers/loginController.js";

const router = express.Router();


router.get("/", (req, res) => {
    res.render("auth");
});

router.post("/singup" ,  fieldValidator(["email" , "password" ,  "userName"]) ,   singupController)
router.post("/login" ,  fieldValidator(["email"  ,  "password"])  ,  loginController)


export default router;
