import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  uid: { type: mongoose.Schema.Types.ObjectId, required: true },
  caption: { type: String, default: '' },
  visibility: { type: String, enum: ['public', 'private'] },
  imp: { type: Boolean, default: false },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
});

const Post = mongoose.model('Post', postSchema);

export default Post;
