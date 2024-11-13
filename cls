[1mdiff --git a/components/post.tsx b/components/post.tsx[m
[1mindex 99fd448..2208b69 100644[m
[1m--- a/components/post.tsx[m
[1m+++ b/components/post.tsx[m
[36m@@ -68,6 +68,18 @@[m [mimport {[m
 import { toast } from "@/hooks/use-toast"[m
 import Image from "next/image"[m
 [m
[32m+[m[32mimport {[m
[32m+[m[32m  AlertDialog,[m
[32m+[m[32m  AlertDialogAction,[m
[32m+[m[32m  AlertDialogCancel,[m
[32m+[m[32m  AlertDialogContent,[m
[32m+[m[32m  AlertDialogDescription,[m
[32m+[m[32m  AlertDialogFooter,[m
[32m+[m[32m  AlertDialogHeader,[m
[32m+[m[32m  AlertDialogTitle,[m
[32m+[m[32m  AlertDialogTrigger,[m
[32m+[m[32m} from "@/components/ui/alert-dialog"[m
[32m+[m
 export default function SinglePostPage({ post }: { post: TPost }) {[m
   const [postReplies, setPostReplies] = useState(post.replies)[m
 [m
[36m@@ -358,20 +370,22 @@[m [mexport function PostReplyOptions({[m
   )[m
 }[m
 [m
[31m-export function PostOptions({ post, type }: PostContentProps) {[m
[32m+[m[32mexport function PostOptions({ post, type }: { post: any; type: string }) {[m
   const { data: session } = useSession()[m
   const user = session?.user[m
[31m-[m
   const router = useRouter()[m
[32m+[m[32m  const [isAlertOpen, setIsAlertOpen] = useState(false)[m
[32m+[m[32m  const [isDeleting, setIsDeleting] = useState(false)[m
 [m
   const handleDeletePostClick = async () => {[m
     try {[m
[32m+[m[32m      setIsDeleting(true)[m
       const data_key = post._id?.toString() as string[m
       const element = document.querySelector(`[data-key="${data_key}"]`)[m
 [m
       if (element) {[m
         await handleDeletePost(post._id as string)[m
[31m-        type === "post" && router.push("/home")[m
[32m+[m[32m        type === "post" && router.back()[m
         element.remove()[m
       }[m
 [m
[36m@@ -384,71 +398,112 @@[m [mexport function PostOptions({ post, type }: PostContentProps) {[m
         description: "There was a problem deleting your post.",[m
         variant: "destructive",[m
       })[m
[32m+[m[32m    } finally {[m
[32m+[m[32m      setIsDeleting(false)[m
[32m+[m[32m      setIsAlertOpen(false)[m
     }[m
   }[m
 [m
   const authorized = post.user._id?.toString() === user?.id[m
 [m
[32m+[m[32m  useEffect(() => {[m
[32m+[m[32m    const handleKeyDown = (event: KeyboardEvent) => {[m
[32m+[m[32m      if (event.key === "Escape" && isAlertOpen) {[m
[32m+[m[32m        setIsAlertOpen(false)[m
[32m+[m[32m      }[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    document.addEventListener("keydown", handleKeyDown)[m
[32m+[m
[32m+[m[32m    return () => {[m
[32m+[m[32m      document.removeEventListener("keydown", handleKeyDown)[m
[32m+[m[32m    }[m
[32m+[m[32m  }, [isAlertOpen])[m
[32m+[m
   return ([m
[31m-    <DropdownMenu>[m
[31m-      <DropdownMenuTrigger asChild>[m
[31m-        <Button[m
[31m-          size="icon"[m
[31m-          variant={"ghost"}[m
[31m-          className={`${type === "post" && "self-start"} absolute -right-2 size-8 rounded-full`}[m
[31m-        >[m
[31m-          <Ellipsis className="h-4 w-4 text-muted-foreground" />[m
[31m-          <span className="sr-only">Post options</span>[m
[31m-        </Button>[m
[31m-      </DropdownMenuTrigger>[m
[31m-      <DropdownMenuContent className="absolute -left-28 -top-8 w-auto shadow-2xl shadow-slate-900">[m
[31m-        <DropdownMenuLabel>Post Options</DropdownMenuLabel>[m
[31m-        <DropdownMenuSeparator className="h-[.1mm]" />[m
[31m-        <DropdownMenuItem[m
[31m-          onClick={() => router.push(`/${pu(post).username}`)}[m
[31m-          className="cursor-pointer sm:hidden"[m
[31m-        >[m
[31m-          <User className="mr-2 h-4 w-4" />[m
[31m-          <span>&#64;{pu(post).username}</span>[m
[31m-        </DropdownMenuItem>[m
[31m-        <Link href={post.model_url} target="_black" prefetch={false}>[m
[31m-          <DropdownMenuItem className="cursor-pointer">[m
[31m-            <SquareArrowOutUpRight className="mr-2 h-4 w-4" />[m
[31m-            <span>Try it</span>[m
[31m-          </DropdownMenuItem>[m
[31m-        </Link>[m
[31m-        {post.chat_link && ([m
[31m-          <Link href={post.chat_link} target="_black" prefetch={false}>[m
[32m+[m[32m    <>[m
[32m+[m[32m      <DropdownMenu>[m
[32m+[m[32m        <DropdownMenuTrigger asChild>[m
[32m+[m[32m          <Button[m
[32m+[m[32m            size="icon"[m
[32m+[m[32m            variant="ghost"[m
[32m+[m[32m            className={`${type === "post" && "self-start"} absolute -right-2 size-8 rounded-full`}[m
[32m+[m[32m          >[m
[32m+[m[32m            <Ellipsis className="h-4 w-4 text-muted-foreground" />[m
[32m+[m[32m            <span className="sr-only">Post options</span>[m
[32m+[m[32m          </Button>[m
[32m+[m[32m        </DropdownMenuTrigger>[m
[32m+[m[32m        <DropdownMenuContent className="absolute -left-28 -top-8 w-auto shadow-2xl shadow-slate-900">[m
[32m+[m[32m          <DropdownMenuLabel>Post Options</DropdownMenuLabel>[m
[32m+[m[32m          <DropdownMenuSeparator className="h-[.1mm]" />[m
[32m+[m[32m          <Link href={`/${pu(post).username}`} prefetch={false}>[m
[32m+[m[32m            <DropdownMenuItem className="cursor-pointer sm:hidden">[m
[32m+[m[32m              <User className="mr-2 h-4 w-4" />[m
[32m+[m[32m              <span>&#64;{pu(post).username}</span>[m
[32m+[m[32m            </DropdownMenuItem>[m
[32m+[m[32m          </Link>[m
[32m+[m[32m          <Link href={post.model_url} target="_blank" prefetch={false}>[m
             <DropdownMenuItem className="cursor-pointer">[m
[31m-              <MessageSquareShare className="mr-2 h-4 w-4" />[m
[31m-              <span>View chat</span>[m
[32m+[m[32m              <SquareArrowOutUpRight className="mr-2 h-4 w-4" />[m
[32m+[m[32m              <span>Try it</span>[m
             </DropdownMenuItem>[m
           </Link>[m
[31m-        )}[m
[31m-        {authorized && ([m
[31m-          <DropdownMenuItem[m
[31m-            onClick={() =>[m
[31m-              router.push([m
[31m-                `/${pu(post).username}/promptories/${post._id as string}/edit`,[m
[31m-              )[m
[31m-            }[m
[31m-            className="cursor-pointer"[m
[31m-          >[m
[31m-            <Edit className="mr-2 h-4 w-4" />[m
[31m-            <span>Edit</span>[m
[31m-          </DropdownMenuItem>[m
[31m-        )}[m
[31m-        {authorized && ([m
[31m-          <DropdownMenuItem[m
[31m-            onClick={handleDeletePostClick}[m
[31m-            className="cursor-pointer"[m
[31m-          >[m
[31m-            <Trash className="mr-2 h-4 w-4 text-red-500" />[m
[31m-            <span className="text-red-500">Delete</span>[m
[31m-          </DropdownMenuItem>[m
[31m-        )}[m
[31m-      </DropdownMenuContent>[m
[31m-    </DropdownMenu>[m
[32m+[m[32m          {post.chat_link && ([m
[32m+[m[32m            <Link href={post.chat_link} target="_blank" prefetch={false}>[m
[32m+[m[32m              <DropdownMenuItem className="cursor-pointer">[m
[32m+[m[32m                <MessageSquareShare className="mr-2 h-4 w-4" />[m
[32m+[m[32m                <span>View chat</span>[m
[32m+[m[32m              </DropdownMenuItem>[m
[32m+[m[32m            </Link>[m
[32m+[m[32m          )}[m
[32m+[m[32m          {authorized && ([m
[32m+[m[32m            <Link[m
[32m+[m[32m              href={`/${pu(post).username}/promptories/${post._id as string}/edit`}[m
[32m+[m[32m              prefetch={false}[m
[32m+[m[32m            >[m
[32m+[m[32m              <DropdownMenuItem className="cursor-pointer">[m
[32m+[m[32m                <Edit className="mr-2 h-4 w-4" />[m
[32m+[m[32m                <span>Edit</span>[m
[32m+[m[32m              </DropdownMenuItem>[m
[32m+[m[32m            </Link>[m
[32m+[m[32m          )}[m
[32m+[m[32m          {authorized && ([m
[32m+[m[32m            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>[m
[32m+[m[32m              <AlertDialogTrigger asChild>[m
[32m+[m[32m                <DropdownMenuItem[m
[32m+[m[32m                  className="cursor-pointer"[m
[32m+[m[32m                  onSelect={(event) => {[m
[32m+[m[32m                    event.preventDefault()[m
[32m+[m[32m                    setIsAlertOpen(true)[m
[32m+[m[32m                  }}[m
[32m+[m[32m                >[m
[32m+[m[32m                  <Trash className="mr-2 h-4 w-4 text-red-500" />[m
[32m+[m[32m                  <span className="text-red-500">Delete</span>[m
[32m+[m[32m                </DropdownMenuItem>[m
[32m+[m[32m              </AlertDialogTrigger>[m
[32m+[m[32m              <AlertDialogContent>[m
[32m+[m[32m                <AlertDialogHeader>[m
[32m+[m[32m                  <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>[m
[32m+[m[32m                  <AlertDialogDescription>[m
[32m+[m[32m                    This action will permanently delete the promptory. Are you[m
[32m+[m[32m                    sure you want to proceed? This cannot be undone.[m
[32m+[m[32m                  </AlertDialogDescription>[m
[32m+[m[32m                </AlertDialogHeader>[m
[32m+[m[32m                <AlertDialogFooter>[m
[32m+[m[32m                  <AlertDialogCancel>Cancel</AlertDialogCancel>[m
[32m+[m[32m                  <AlertDialogAction[m
[32m+[m[32m                    onClick={handleDeletePostClick}[m
[32m+[m[32m                    disabled={isDeleting}[m
[32m+[m[32m                  >[m
[32m+[m[32m                    {isDeleting ? "Deleting..." : "Delete"}[m
[32m+[m[32m                  </AlertDialogAction>[m
[32m+[m[32m                </AlertDialogFooter>[m
[32m+[m[32m              </AlertDialogContent>[m
[32m+[m[32m            </AlertDialog>[m
[32m+[m[32m          )}[m
[32m+[m[32m        </DropdownMenuContent>[m
[32m+[m[32m      </DropdownMenu>[m
[32m+[m[32m    </>[m
   )[m
 }[m
 [m
[1mdiff --git a/package-lock.json b/package-lock.json[m
[1mindex 970918c..cf44e3b 100644[m
[1m--- a/package-lock.json[m
[1m+++ b/package-lock.json[m
[36m@@ -9,6 +9,7 @@[m
       "version": "0.1.0",[m
       "dependencies": {[m
         "@hookform/resolvers": "^3.9.0",[m
[32m+[m[32m        "@radix-ui/react-alert-dialog": "^1.1.2",[m
         "@radix-ui/react-avatar": "^1.1.0",[m
         "@radix-ui/react-dialog": "^1.1.1",[m
         "@radix-ui/react-dropdown-menu": "^2.1.1",[m
[36m@@ -631,6 +632,49 @@[m
       "integrity": "sha512-4Z8dn6Upk0qk4P74xBhZ6Hd/w0mPEzOOLxy4xiPXOXqjF7jZS0VAKk7/x/H6FyY2zCkYJqePf1G5KmkmNJ4RBA==",[m
       "license": "MIT"[m
     },[m
[32m+[m[32m    "node_modules/@radix-ui/react-alert-dialog": {[m
[32m+[m[32m      "version": "1.1.2",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@radix-ui/react-alert-dialog/-/react-alert-dialog-1.1.2.tgz",[m
[32m+[m[32m      "integrity": "sha512-eGSlLzPhKO+TErxkiGcCZGuvbVMnLA1MTnyBksGOeGRGkxHiiJUujsjmNTdWTm4iHVSRaUao9/4Ur671auMghQ==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@radix-ui/primitive": "1.1.0",[m
[32m+[m[32m        "@radix-ui/react-compose-refs": "1.1.0",[m
[32m+[m[32m        "@radix-ui/react-context": "1.1.1",[m
[32m+[m[32m        "@radix-ui/react-dialog": "1.1.2",[m
[32m+[m[32m        "@radix-ui/react-primitive": "2.0.0",[m
[32m+[m[32m        "@radix-ui/react-slot": "1.1.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@types/react": "*",[m
[32m+[m[32m        "@types/react-dom": "*",[m
[32m+[m[32m        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",[m
[32m+[m[32m        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependenciesMeta": {[m
[32m+[m[32m        "@types/react": {[m
[32m+[m[32m          "optional": true[m
[32m+[m[32m        },[m
[32m+[m[32m        "@types/react-dom": {[m
[32m+[m[32m          "optional": true[m
[32m+[m[32m        }[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@radix-ui/react-alert-dialog/node_modules/@radix-ui/react-context": {[m
[32m+[m[32m      "version": "1.1.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@radix-ui/react-context/-/react-context-1.1.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-UASk9zi+crv9WteK/NU4PLvOoL3OuE6BWVKNF6hPRBtYBDXQ2u5iu3O59zUlJiTVvkyuycnqrztsHVJwcK9K+Q==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@types/react": "*",[m
[32m+[m[32m        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependenciesMeta": {[m
[32m+[m[32m        "@types/react": {[m
[32m+[m[32m          "optional": true[m
[32m+[m[32m        }[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/@radix-ui/react-arrow": {[m
       "version": "1.1.0",[m
       "resolved": "https://registry.npmjs.org/@radix-ui/react-arrow/-/react-arrow-1.1.0.tgz",[m
[36m@@ -737,25 +781,130 @@[m
       }[m
     },[m
     "node_modules/@radix-ui/react-dialog": {[m
[31m-      "version": "1.1.1",[m
[31m-      "resolved": "https://registry.npmjs.org/@radix-ui/react-dialog/-/react-dialog-1.1.1.tgz",[m
[31m-      "integrity": "sha512-zysS+iU4YP3STKNS6USvFVqI4qqx8EpiwmT5TuCApVEBca+eRCbONi4EgzfNSuVnOXvC5UPHHMjs8RXO6DH9Bg==",[m
[32m+[m[32m      "version": "1.1.2",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@radix-ui/react-dialog/-/react-dialog-1.1.2.tgz",[m
[32m+[m[32m      "integrity": "sha512-Yj4dZtqa2o+kG61fzB0H2qUvmwBA2oyQroGLyNtBj1beo1khoQ3q1a2AO8rrQYjd8256CO9+N8L9tvsS+bnIyA==",[m
       "license": "MIT",[m
       "dependencies": {[m
         "@radix-ui/primitive": "1.1.0",[m
         "@radix-ui/react-compose-refs": "1.1.0",[m
[31m-        "@radix-ui/react-context": "1.1.0",[m
[31m-        "@radix-ui/react-dismissable-layer": "1.1.0",[m
[31m-        "@radix-ui/react-focus-guards": "1.1.0",[m
[32m+[m[32m        "@radix-ui/react-context": "1.1.1",[m
[32m+[m[32m        "@radix-ui/react-dismissable-layer": "1.1.1",[m
[32m+[m[32m        "@radix-ui/react-focus-guards": "1.1.1",[m
         "@radix-ui/react-focus-scope": "1.1.0",[m
         "@radix-ui/react-id": "1.1.0",[m
[31m-        "@radix-ui/react-portal": "1.1.1",[m
[31m-        "@radix-ui/react-presence": "1.1.0",[m
[32m+[m[32m        "@radix-ui/react-portal": "1.1.2",[m
[32m+[m[32m        "@radix-ui/react-presence": "1.1.1",[m
         "@radix-ui/react-primitive": "2.0.0",[m
         "@radix-ui/react-slot": "1.1.0",[m
         "@radix-ui/react-use-controllable-state": "1.1.0",[m
         "aria-hidden": "^1.1.1",[m
[31m-        "react-remove-scroll": "2.5.7"[m
[32m+[m[32m        "react-remove-scroll": "2.6.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@types/react": "*",[m
[32m+[m[32m        "@types/react-dom": "*",[m
[32m+[m[32m        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",[m
[32m+[m[32m        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependenciesMeta": {[m
[32m+[m[32m        "@types/react": {[m
[32m+[m[32m          "optional": true[m
[32m+[m[32m        },[m
[32m+[m[32m        "@types/react-dom": {[m
[32m+[m[32m          "optional": true[m
[32m+[m[32m        }[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@radix-ui/react-dialog/node_modules/@radix-ui/react-context": {[m
[32m+[m[32m      "version": "1.1.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@radix-ui/react-context/-/react-context-1.1.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-UASk9zi+crv9WteK/NU4PLvOoL3OuE6BWVKNF6hPRBtYBDXQ2u5iu3O59zUlJiTVvkyuycnqrztsHVJwcK9K+Q==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@types/react": "*",[m
[32m+[m[32m        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependenciesMeta": {[m
[32m+[m[32m        "@types/react": {[m
[32m+[m[32m          "optional": true[m
[32m+[m[32m        }[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@radix-ui/react-dialog/node_modules/@radix-ui/react-dismissable-layer": {[m
[32m+[m[32m      "version": "1.1.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@radix-ui/react-dismissable-layer/-/react-dismissable-layer-1.1.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-QSxg29lfr/xcev6kSz7MAlmDnzbP1eI/Dwn3Tp1ip0KT5CUELsxkekFEMVBEoykI3oV39hKT4TKZzBNMbcTZYQ==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@radix-ui/primitive": "1.1.0",[m
[32m+[m[32m        "@radix-ui/react-compose-refs": "1.1.0",[m
[32m+[m[32m        "@radix-ui/react-primitive": "2.0.0",[m
[32m+[m[32m        "@radix-ui/react-use-callback-ref": "1.1.0",[m
[32m+[m[32m        "@radix-ui/react-use-escape-keydown": "1.1.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@types/react": "*",[m
[32m+[m[32m        "@types/react-dom": "*",[m
[32m+[m[32m        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",[m
[32m+[m[32m        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependenciesMeta": {[m
[32m+[m[32m        "@types/react": {[m
[32m+[m[32m          "optional": true[m
[32m+[m[32m        },[m
[32m+[m[32m        "@types/react-dom": {[m
[32m+[m[32m          "optional": true[m
[32m+[m[32m        }[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@radix-ui/react-dialog/node_modules/@radix-ui/react-focus-guards": {[m
[32m+[m[32m      "version": "1.1.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@radix-ui/react-focus-guards/-/react-focus-guards-1.1.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-pSIwfrT1a6sIoDASCSpFwOasEwKTZWDw/iBdtnqKO7v6FeOzYJ7U53cPzYFVR3geGGXgVHaH+CdngrrAzqUGxg==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@types/react": "*",[m
[32m+[m[32m        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependenciesMeta": {[m
[32m+[m[32m        "@types/react": {[m
[32m+[m[32m          "optional": true[m
[32m+[m[32m        }[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@radix-ui/react-dialog/node_modules/@radix-ui/react-portal": {[m
[32m+[m[32m      "version": "1.1.2",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@radix-ui/react-portal/-/react-portal-1.1.2.tgz",[m
[32m+[m[32m      "integrity": "sha512-WeDYLGPxJb/5EGBoedyJbT0MpoULmwnIPMJMSldkuiMsBAv7N1cRdsTWZWht9vpPOiN3qyiGAtbK2is47/uMFg==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@radix-ui/react-primitive": "2.0.0",[m
[32m+[m[32m        "@radix-ui/react-use-layout-effect": "1.1.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@types/react": "*",[m
[32m+[m[32m        "@types/react-dom": "*",[m
[32m+[m[32m        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",[m
[32m+[m[32m        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependenciesMeta": {[m
[32m+[m[32m        "@types/react": {[m
[32m+[m[32m          "optional": true[m
[32m+[m[32m        },[m
[32m+[m[32m        "@types/react-dom": {[m
[32m+[m[32m          "optional": true[m
[32m+[m[32m        }[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@radix-ui/react-dialog/node_modules/@radix-ui/react-presence": {[m
[32m+[m[32m      "version": "1.1.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@radix-ui/react-presence/-/react-presence-1.1.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-IeFXVi4YS1K0wVZzXNrbaaUvIJ3qdY+/Ih4eHFhWA9SwGR9UDX7Ck8abvL57C4cv3wwMvUE0OG69Qc3NCcTe/A==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@radix-ui/react-compose-refs": "1.1.0",[m
[32m+[m[32m        "@radix-ui/react-use-layout-effect": "1.1.0"[m
       },[m
       "peerDependencies": {[m
         "@types/react": "*",[m
[36m@@ -772,6 +921,31 @@[m
         }[m
       }[m
     },[m
[32m+[m[32m    "node_modules/@radix-ui/react-dialog/node_modules/react-remove-scroll": {[m
[32m+[m[32m      "version": "2.6.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/react-remove-scroll/-/react-remove-scroll-2.6.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-I2U4JVEsQenxDAKaVa3VZ/JeJZe0/2DxPWL8Tj8yLKctQJQiZM52pn/GWFpSp8dftjM3pSAHVJZscAnC/y+ySQ==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "react-remove-scroll-bar": "^2.3.6",[m
[32m+[m[32m        "react-style-singleton": "^2.2.1",[m
[32m+[m[32m        "tslib": "^2.1.0",[m
[32m+[m[32m        "use-callback-ref": "^1.3.0",[m
[32m+[m[32m        "use-sidecar": "^1.1.2"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=10"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@types/react": "^16.8.0 || ^17.0.0 || ^18.0.0",[m
[32m+[m[32m        "react": "^16.8.0 || ^17.0.0 || ^18.0.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependenciesMeta": {[m
[32m+[m[32m        "@types/react": {[m
[32m+[m[32m          "optional": true[m
[32m+[m[32m        }[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/@radix-ui/react-direction": {[m
       "version": "1.1.0",[m
       "resolved": "https://registry.npmjs.org/@radix-ui/react-direction/-/react-direction-1.1.0.tgz",[m
[1mdiff --git a/package.json b/package.json[m
[1mindex 07057b2..07905c7 100644[m
[1m--- a/package.json[m
[1m+++ b/package.json[m
[36m@@ -10,6 +10,7 @@[m
   },[m
   "dependencies": {[m
     "@hookform/resolvers": "^3.9.0",[m
[32m+[m[32m    "@radix-ui/react-alert-dialog": "^1.1.2",[m
     "@radix-ui/react-avatar": "^1.1.0",[m
     "@radix-ui/react-dialog": "^1.1.1",[m
     "@radix-ui/react-dropdown-menu": "^2.1.1",[m
