import { body, param, query } from 'express-validator'
import Post from './post.modal'

export class PostValidators {

    static addPost() {
        return [
            body('content', 'Post is required').isString()
        ]
    }

    static getPostId() {
        return [param('id').custom((id, { req }) => {
            return Post.findOne({ _id: id }).then((post) => {
                if (post) {
                    req.post = post;
                    return true;
                } else {
                    throw new Error('Post Not Exist');
                }
            })

        })]
    }

    static editPost() {
        return [
            body('content', 'Post is required').isString()
        ]
    }

    static deletePost() {
        return [
            param('id').custom((id, { req }) => {

                return Post.findOne({ _id: id }, { __v: 0, user_id: 0 })
                .then((post)=>{
                    if(post){
                        req.post = post;
                        return true;
                    }
                    else{
                        throw new Error("Post Does Not Exist")
                    }
                })

            })
        ]
    }

}