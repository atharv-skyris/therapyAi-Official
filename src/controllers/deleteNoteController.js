import jounral from "../models/jounralModel.js";
import { deleteVector } from "../services/qdrandOperationsService.js";
import appError from "../utils/appErrorUtils.js";



async function deleteNote(req ,  res ,  next){
    console.log("delete note controller");
    try {
        const id = req.body._id;
        const user = req.user;

        console.log("_id from delete note controller" ,  id);

        const deleteNote = await jounral.findOneAndDelete({id:id});
        if(!deleteNote){
            console.log("unable to delete note");
            return next(new appError('unable to delete note' ,  500))
        }
        
        const deleEmebedding = await deleteVector(id);  

        console.log("note deleted successfully" ,  deleteNote);


        return res.status(200).json({
            success : true,
            message : "note deleted successfully"
        })
    } catch (error) {
        console.log("error in delete note controller" ,  error);
        next(error)

    }
    
}

export default deleteNote;