import jounral from "../models/jounralModel.js";
import appError from "../utils/appErrorUtils.js";
import generateEmbeddings from "../services/generateEmbeddingsConfig.js";
import  {updateEmbedding}  from "../services/qdrandOperationsService.js";

async function updateNote(req, res, next) {
    console.log("Notes update controller")

    try {
        const { _id, title, content } = req.body;
        const email = req.user.email;

        console.log("emai ,  _id ,  title , content" ,  email ,  _id ,  title , content)


        const text = `Title:-${title}, Note:-${content}`

        console.log("Text for embeddings:", text);

        const emebeddings = await generateEmbeddings(text)
        if(emebeddings.success){
            console.log("Embeddings generated successfully");
            const qdOperation =  await updateEmbedding(emebeddings.message[0], { _id, email , text});
            if(!qdOperation.success) return next(new  appError("Unable to update"  , 500))
        }else{
            return next(new appError("Unable to update note" ,  500))
        }

        const updatedNote = await jounral.findOneAndUpdate(
        { id:_id, email },
        { title, content, updatedAt: Date.now() },
        { new: true }
        );

        if (!updatedNote) {
            console.log("unable to update the note")
            return next(new appError("Note not found or unauthorized", 404));
        }

        console.log("note is updated" ,  updateNote)

        res.status(200).json({
            success: true,
            data: "Successfully updated",
        });
    } catch (error) {
        console.error("Error in updateNoteController:", error);
        next(error);
    }
}

export default updateNote;
