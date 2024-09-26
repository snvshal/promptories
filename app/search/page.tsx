import SearchComponent from "@/components/search";
import { posts, users } from "@/lib/seed";
import { Post } from "@/models/post.model";
import { User } from "@/models/user.model";

export default async function SearchPage() {
  // await User.insertMany(users);
  // await Post.insertMany(posts);
  return <SearchComponent />;
}
