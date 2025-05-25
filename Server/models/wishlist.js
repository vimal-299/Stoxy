import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    stock: { type: String, required: true },
    fullname: { type: String},
})

const WishlistModel = mongoose.model('Wishlist', WishlistSchema)

export default WishlistModel