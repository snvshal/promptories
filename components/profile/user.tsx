import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Bell,
  MessageSquare,
  Search,
  Home,
  BookOpen,
  Compass,
  Users,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Menu,
  X,
  PlusCircle,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { posts } from "@/lib/seed";
import { PostsComponent } from "../home";

export default function UserProfileComponent() {
  //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock user data
  const user = {
    name: "Alice Johnson",
    username: "@alicewrites",
    avatar: "/placeholder.svg?height=128&width=128",
    bio: "AI enthusiast | Creative writer | Coffee lover",
    followers: 1234,
    following: 567,
    posts: 89,
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="mb-4 h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.username}</p>
                <p className="mt-2 text-gray-700">{user.bio}</p>
                <div className="mt-4 flex justify-center space-x-4">
                  <div>
                    <p className="font-semibold">{user.followers}</p>
                    <p className="text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="font-semibold">{user.following}</p>
                    <p className="text-muted-foreground">Following</p>
                  </div>
                  <div>
                    <p className="font-semibold">{user.posts}</p>
                    <p className="text-muted-foreground">Posts</p>
                  </div>
                </div>
                <div className="mt-6 flex space-x-4">
                  <Button>Follow</Button>
                  <Button variant="outline">Message</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
              <PostsComponent />
            </TabsContent>
            <TabsContent value="likes">
              <div className="py-8 text-center">
                Liked posts will appear here.
              </div>
            </TabsContent>
            <TabsContent value="saved">
              <div className="py-8 text-center">
                Saved posts will appear here.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
