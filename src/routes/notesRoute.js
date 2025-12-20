import express from "express";
import fieldValidator from "../middlewares/fieldValidatorMiddleware.js";
import createNote from "../controllers/createNoteController.js";
import getNotes from "../controllers/getNotesController.js";
import updateNote from "../controllers/updateNotesController.js";
import deleteNote from "../controllers/deleteNoteController.js";


const router = express.Router();


router.get("/", (req, res) => {
    res.render("notes");
});

router.post("/create" ,  fieldValidator(["title" , "content"]) ,  createNote);

router.get("/getNotes" ,  getNotes)

router.put("/update" ,  fieldValidator(["_id" , "title" , "content"]) , updateNote )

router.delete("/delete" ,  fieldValidator(["_id"]) , deleteNote);


export default router;
