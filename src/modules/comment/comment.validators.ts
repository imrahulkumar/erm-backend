import { body, query, param } from 'express-validator'
import Comment from './comment.modal';
import Post from '../post/post.modal';



export class CommentValidators {

    static addComment() {
        return [
            body('content', 'Content is required').isString(),
            param('id').custom(async (id, { req }) => {
                try {
                    let isFound = await Post.findOne({ _id: id });
                    if (isFound) {
                        req.post = isFound;
                        return true;
                    }
                    else {
                        throw new Error('Post Does Not Exist');
                    }
                } catch (e) {
                    throw new Error(e);
                }
            })

        ]
    }

    static editComment() {
        return [
            body('content', 'Content is Required').isString()
        ]
    }
    static deleteComment() {
        return [
            param('id').custom((id, { req }) => {
                return Comment.findOne({_id: id}).then((comment)=>{
                    if(comment){
                       req.comment = comment;
                       return true;
                    }
                    else{
                        throw new Error("Comment Does Not Exist");
                    }
                })
            })
        ]
    }

}