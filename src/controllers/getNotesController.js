import jounral from "../models/jounralModel.js";

async function getNotes(req, res, next) {
    console.log("Inside getNotesController");   
    try {
        const email = req.user.email;

        console.log("fetching notes for user:", email);
        
        const notes = await jounral.find({ email }).sort({ createdAt: -1 });

        console.log(email  + " notes fetched. ", notes);

        return res.status(200).json({
            success: true,
            data: { notes  ,  notesCount: notes.length},
        })
    } catch (error) {
        console.log("Error in getNotesController:", error);
        next(error);
    }
}

export default getNotes;