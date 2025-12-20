import geminiWrapper from "../services/geminiWrapperService.js";
import appError from "../utils/appErrorUtils.js";


async function getSummarie(req, res, next) {
    console.log("getSummarie controller");
    try {
        const summarie = await geminiWrapper(req.user.email, req.user.username, "Generate summarie of the user conversation", "summarie");
        if(!summarie.success){
            return next(new appError("I am having issues right now.Please try again later", 500));
        }

        console.log("summarie" ,  summarie.message)

        return res.status(200).json({
            success: true,
            message: summarie.message
        });
    } catch (error) {
        console.log( 'Summarie function' ,  error);
        next(error)
    }
}

export default getSummarie