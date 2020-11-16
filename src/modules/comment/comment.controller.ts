import Comment from './comment.modal'


export class CommentController {


    static async addComment(req, res, next) {

        const content = req.body.content;
        const post = req.post;
        try {
            const comment = new Comment({
                content: content,
                created_at: new Date(),
                updated_at: new Date()
            });
            post.comments.push(comment);
            await Promise.all([comment.save(), post.save()]);
            res.send(comment);

        } catch (e) {
            next(e)
        }

    }

    static async editComment(req, res, next) {

        const content = req.body.content;
        const commentId = req.params.id;

        try {

            const updateComment = await Comment.findOneAndUpdate({ _id: commentId }, {
                content: content,
                updated_at: new Date()
            }, { new: true });

            if (updateComment) {
                res.send(updateComment)
            } else {
                throw new Error('Comment Does Not Exist');
            }

        } catch (e) {
            next(e)
        }
    }

    static async deleteComment(req, res, next) {

        const comment = req.comment;

        try {

            comment.remove();
            res.send(comment);

        }
        catch (e) {

        }
    }

}