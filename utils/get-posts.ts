import { Post } from "@/models/post.model";
import { connectToDatabase } from "./db";
import { TPost, TUser } from "@/types/schema.type";
import { User } from "@/models/user.model";
import { getUserByUsername } from "./get-user";

export const getPosts = async () => {
  try {
    await connectToDatabase();

    const posts: TPost[] = await Post.find({}).populate("user");

    return posts as TPost[];
  } catch (error) {
    console.log(error);
  }
};

export const getPostsByUsername = async (username: string) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ username });

    const posts: TPost[] = await Post.find({ user }).populate("user");

    return posts as TPost[];
  } catch (error) {
    console.log(error);
  }
};

export const getPostByPromptoryId = async (
  username: string,
  promptory_id: string,
) => {
  try {
    await connectToDatabase();

    const user = await getUserByUsername(username);
    if (!user) return null;

    const pp = await Post.find({ promptory_id })
      .populate("user")
      .populate("replies.user");

    if (!pp) return null;

    const post = pp.find((post) => post.user.equals(user?._id));
    if (!post) throw new Error("Post not found!");

    return post as TPost;
  } catch (error) {
    console.log(error);
  }
};

export const getLikedPosts = async (profileUser: TUser) => {
  try {
    await connectToDatabase();

    const likedPosts = await Post.find({ likes: profileUser._id }).populate(
      "user",
    );

    return likedPosts as TPost[];
  } catch (error) {
    console.log(error);
  }
};

export const getBookmarkedPosts = async (profileUser: TUser) => {
  try {
    await connectToDatabase();

    const bookmarkedPosts = await Post.find({
      bookmarks: profileUser._id,
    }).populate("user");

    return bookmarkedPosts as TPost[];
  } catch (error) {
    console.log(error);
  }
};
