import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;

    const userId = req.user._id.toString();

    const user= await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!text && !img) {
      return res.status(400).json({ error: "Text or Image is required" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img, {
      });
      img = uploadedResponse.secure_url;
    }


    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();

    res.status(200).json(newPost);

  } catch (err) {
    console.log("Error in createPost", err);
    res.status(500).json({ error: "Internal Server Error" + err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user._id.toString();

    const post = await Post.findById
    (id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== userId) {
        return res.status(403).json({ error: "You are not authorized to delete this post" });
        }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(id);




    res.status(200).json({ message: "Post deleted" });
    } catch (err) {
    console.log("Error in deletePost", err);
    res.status(500).json({ error: "Internal Server Error" });
    }
}


export const commentOnPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user._id.toString();

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = {
      text,
      user: userId,
    };

    post.comments.push(newComment);
    await post.save();

    res.status(200).json(post);

  } catch (err) {
    console.log("Error in commentOnPost", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const likeUnlikePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id.toString();
    
        const user = await User
        .findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const isLiked = post.likes.includes(userId);
        if (isLiked) {
            post.likes = post.likes.filter((like) => like.toString() !== userId);
        } else {
            post.likes.push(userId);

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: 'like'
            });

            await notification.save();
        }

        await post.save();
        res.status(200).json(post);
    }
    catch (err) {
        console.log("Error in likeUnlikePost", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
