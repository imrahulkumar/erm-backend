import * as mongoose from 'mongoose';
import { model } from 'mongoose'
import Post from '../post/post.modal';

const commentSchema = new mongoose.Schema(
    {

        created_at: { type: Date, required: true },
        updated_at: { type: Date, required: true },
        content: { type: String, required: true }
    }
);

commentSchema.post('remove', async (doc) => {
    const comment = doc as any;

    // to find the comment id from the array of comment in post collection.
    const post: any = await Post.findOne({ comments: { $in: [comment._id] } });


    // basically it remove the comment id from the post collection and update it.
    await Post.findOneAndUpdate({ _id: post._id }, { $pull: { comments: comment._id } })
})

export default model('comments', commentSchema);