import { getServerSession } from "next-auth";
import { connectToDatabase } from "./db";
import { User } from "@/models/user.model";

export const currentUser = async () => {
  try {
    await connectToDatabase();
    const session = await getServerSession();

    const user = User.findOne({ email: session?.user?.email });

    return user;
  } catch (error) {
    console.log(error);
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    await connectToDatabase();

    const user = User.findOne({ username });

    return user;
  } catch (error) {
    console.log(error);
  }
};
