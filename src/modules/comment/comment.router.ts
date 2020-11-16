import { Router } from 'express';
import { CommentController } from './comment.controller';
import { GlobalCheckErrorMiddleWare } from '../../middleware/CheckError';
import { CommentValidators } from './comment.validators';

class CommentRouter {

    public router: Router;


    constructor() {
        this.router = Router();

        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }


    getRoutes() { }

    postRoutes() {
        //id of that post where comment is going to add. This is basically called param.
        this.router.post('/add/:id', GlobalCheckErrorMiddleWare.authentication, CommentValidators.addComment(), GlobalCheckErrorMiddleWare.checkError, CommentController.addComment)
    }

    patchRoutes() {
        this.router.patch('/edit/:id', GlobalCheckErrorMiddleWare.authentication, CommentValidators.editComment(), GlobalCheckErrorMiddleWare.checkError, CommentController.editComment);
    }

    deleteRoutes() { 
        this.router.delete('/delete/:id', GlobalCheckErrorMiddleWare.authentication, CommentValidators.deleteComment(), GlobalCheckErrorMiddleWare.checkError, CommentController.deleteComment);
 
    }

}

export default new CommentRouter().router;