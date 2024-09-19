import { Post } from "@/models/post.model";
import { connectToDatabase } from "./db";
import { TPost } from "@/types/schema.type";
import { User } from "@/models/user.model";

export const getPosts = async () => {
  try {
    await connectToDatabase();

    const posts: TPost[] = await Post.find({}).populate("user");

    console.log(posts);
    return posts;
  } catch (error) {
    console.log(error);
  }
};

export const getPostsByUsername = async (username: string) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ username });

    const posts: TPost[] = await Post.find({ user }).populate("user");

    console.log(posts);
    return posts;
  } catch (error) {
    console.log(error);
  }
};

export const cleanPosts = async () => {
  try {
    await connectToDatabase();

    await Post.deleteMany({});

    // return posts;
  } catch (error) {
    console.log(error);
  }
};
