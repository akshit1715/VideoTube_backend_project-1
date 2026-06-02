import { addComment,updateComment,deleteComment,getVideoComments } from "../controllers/comment.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js";
import{Router} from "express"


const router = Router()

router.use(verifyJWT)
router.route("/:videoId").get(getVideoComments).post(addComment)
router.route("/comment/:commentId").put(updateComment).delete(deleteComment)

export default router