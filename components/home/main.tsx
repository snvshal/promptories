import { ModeToggle } from "@/components/ui/theme-provider";
import { posts } from "@/lib/seed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Component() {
  return (
    <main className="flex h-dvh w-screen items-center justify-center bg-background">
      {posts.map((post) => (
        <div key={post.id}>
          <div className="flex-start">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h4>{post.user.name}</h4>
            <p>{post.user.username}</p>
          </div>
          <div>
            <p>{post.explanation}</p>
            <div>
              <div>
                <h4>Prompt:</h4>
                <p>{post.prompt}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
