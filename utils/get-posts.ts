import { Post } from "@/models/post.model";
import { connectToDatabase } from "./db";
import { TPost, TUser } from "@/types/schema.type";
import { User } from "@/models/user.model";
import { getUserByUsername } from "./get-user";

export const getPosts = async () => {
  try {
    await connectToDatabase();

    const posts: TPost[] = await Post.find({}).populate("user");

    console.log(posts);
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

    // console.log(posts);
    return posts as TPost[];
  } catch (error) {
    console.log(error);
  }
};

export const getPostsByPromptoryId = async (
  username: string,
  promptory_id: string,
) => {
  try {
    await connectToDatabase();
    const user = await getUserByUsername(username);
    const post = await Post.findOne({
      promptory_id,
      user: user?._id,
    })
      .populate("user")
      .populate("replies.user");

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

    console.log("likedPosts: ", likedPosts);

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

    console.log("likedPosts: ", bookmarkedPosts);

    return bookmarkedPosts as TPost[];
  } catch (error) {
    console.log(error);
  }
};
