import jounral from "../models/jounralModel.js";
import generateEmbeddings from "../services/generateEmbeddingsConfig.js";
import { appendEmbedding } from "../services/qdrandOperationsService.js";
import appError from "../utils/appErrorUtils.js";
import { v4 as uuidv4 } from 'uuid';


async function createNote(req, res, next) {
    try {
        console.log("Inside createNoteController");

        const { title, content } = req.body;
        const email = req.user.email;

        console.log("Creating note with title:", title);
        console.log("Creating note with content:", content);
        console.log("Creating note for user:", email);

        const _id = uuidv4();    

        console.log("Id " ,  _id)

        const text = [`Title:-${title}, Note:-${content}`]

        console.log("Text for embeddings:", text);

        const emebeddings = await generateEmbeddings(text)
        if(emebeddings.success){
            console.log("Embeddings generated successfully");
            console.log("Error generating embeddings:", emebeddings.message[0]);

            const qdOperation = await appendEmbedding(emebeddings.message, true, { _id, email , text});
            if(!qdOperation.success) return next(new  appeError("Unable to save"  , 500))
        }else{
            return next(new appError("Unable to save note" ,  500))
        }

        const newNote = await jounral.create({ email:email, id:_id , title:title, content:content });

        console.log("Note created with ID:", _id);        
        
        return res.status(201).json({
            success: true,
            message: "Note created successfully",
            data:_id
        });

    } catch (error) {
        console.log("Error in createNoteController:", error);
        next(error);
    }
}

export default createNote;