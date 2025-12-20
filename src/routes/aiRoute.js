import express from "express";
import authValidation from "../utils/authValidatorUtils.js";
import fieldValidator from "../middlewares/fieldValidatorMiddleware.js";
import aiController from "../controllers/aiController.js";

const router = express.Router();


router.get("/", (req, res) => {
    res.render("index");
});

router.post("/" , authValidation ,  aiController )

export default router;
