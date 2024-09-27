import SearchComponent from "@/components/search";
import { TUser } from "@/types/schema.type";
import { currentUser } from "@/utils/get-user";
import { ps } from "@/utils/ps";

export default async function SearchPage() {
  const user = await currentUser();
  return <SearchComponent user={ps(user as TUser)} />;
}
