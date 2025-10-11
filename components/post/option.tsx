"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Trash,
  Ellipsis,
  SquareArrowOutUpRight,
  MessageSquareShare,
  Edit,
  FileTextIcon,
  UserPlusIcon,
  UserMinusIcon,
  Volume2Icon,
  VolumeOffIcon,
  BanIcon,
  Circle,
  FlagIcon,
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { handleDeletePost } from "@/actions/post"
import { postPathname, pu } from "@/utils/ps"
import { toast } from "@/hooks/use-toast"
import { PostContentProps } from "./content"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ToolTipComponent } from "../ui/tooltip"
import { PostIconButton } from "./footer"
import { usePosts } from "@/hooks/use-posts"
import { useUser } from "@/hooks/use-user"
import { SetAction } from "@/types/generics.type"
import { useWindowWidth } from "@/hooks/use-window"

export function PostOptions({ post, type }: PostContentProps) {
  const router = useRouter()
  const { isAuthorized } = useUser()
  const width = useWindowWidth()
  const { removePost } = usePosts()
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isAlertModelLink, setIsAlertModelLink] = useState(false)
  const [isAlertChatLink, setIsAlertChatLink] = useState(false)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const authorized = isAuthorized(pu(post).email)
  const postUserId = pu(post)._id?.toString() as string

  const handleDeletePostClick = async () => {
    try {
      setIsLoading(true)
      const postId = post._id?.toString()
      if (!postId) throw new Error("Invalid post ID")

      const { success } = await handleDeletePost(postId)
      if (!success) throw new Error("Failed to delete post")

      removePost(postId)

      if (type === "post") router.back()

      toast({
        variant: "default",
        description: "Post deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete post",
        variant: "destructive",
      })
    } finally {
      setIsAlertOpen(false)
      setIsMenuOpen(false)
      setIsLoading(false)
    }
  }

  const PostOptionItems = () => (
    <div className="flex flex-col">
      {type === "posts" && (
        <Link href={postPathname(post)} className="w-full">
          <Button variant="ghost" className="option-button">
            <FileTextIcon className="size-5 sm:size-4" />
            <span>View Promptory</span>
          </Button>
        </Link>
      )}
      {authorized && (
        <Link href={postPathname(post, "edit")} className="w-full">
          <Button variant="ghost" className="option-button">
            <Edit className="size-5 sm:size-4" />
            <span>Edit</span>
          </Button>
        </Link>
      )}
      {post.model_url && (
        <AlertDialogComponent
          title="Navigate to model"
          description={`You are about to visit "${post.model_url}". Do you want to continue?`}
          isAlertOpen={isAlertModelLink}
          setIsAlertOpen={setIsAlertModelLink}
          action={
            <AlertDialogAction asChild>
              <a
                href={post.model_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Continue
              </a>
            </AlertDialogAction>
          }
        >
          <Button variant="ghost" className="option-button">
            <SquareArrowOutUpRight className="size-5 sm:size-4" />
            <span>Test it</span>
          </Button>
        </AlertDialogComponent>
      )}
      {post.chat_link && (
        <AlertDialogComponent
          title="Open chat"
          description={`You are about to visit "${post.chat_link}". Do you want to continue?`}
          isAlertOpen={isAlertChatLink}
          setIsAlertOpen={setIsAlertChatLink}
          action={
            <AlertDialogAction asChild>
              <a
                href={post.chat_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Continue
              </a>
            </AlertDialogAction>
          }
        >
          <Button variant="ghost" className="option-button">
            <MessageSquareShare className="size-5 sm:size-4" />
            <span>View chat</span>
          </Button>
        </AlertDialogComponent>
      )}
      {!authorized && (
        <>
          <div className="max-sm:hidden">
            <UserOptions
              userId={postUserId}
              username={pu(post).username}
              setIsMenuOpen={setIsMenuOpen}
            />
          </div>
          <div className="sm:hidden">
            <UserOptions
              userId={postUserId}
              username={pu(post).username}
              setIsMenuOpen={setIsMenuOpen}
            />
          </div>
          <Button
            variant="ghost"
            className="option-button"
            onClick={() => setIsMenuOpen(false)}
          >
            <FlagIcon className="size-5 sm:size-4" />
            <span>Report post</span>
          </Button>
        </>
      )}
      {authorized && (
        <AlertDialogComponent
          isAlertOpen={isAlertOpen}
          setIsAlertOpen={setIsAlertOpen}
          title="Confirm Deletion"
          description="This action will permanently delete the promptory. Are you sure
                you want to proceed? This cannot be undone."
          action={
            <AlertDialogAction
              onClick={handleDeletePostClick}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          }
        >
          <Button
            variant="ghost"
            className="option-button text-red-500 hover:text-red-500"
          >
            <Trash className="size-5 sm:size-4" />
            <span>Delete</span>
          </Button>
        </AlertDialogComponent>
      )}
    </div>
  )

  const isDesktop = width >= 640

  if (isDesktop) {
    return (
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <ToolTipComponent content="More">
          <DropdownMenuTrigger asChild>
            <PostIconButton className="max-sm:hidden">
              <Ellipsis className="h-4 w-4" />
              <span className="sr-only">Post options</span>
            </PostIconButton>
          </DropdownMenuTrigger>
        </ToolTipComponent>
        <DropdownMenuContent className="absolute -left-48 -top-8 min-w-52 shadow-2xl shadow-slate-900">
          <DropdownMenuLabel className="px-3">Post Options</DropdownMenuLabel>
          <DropdownMenuSeparator className="h-[.1mm]" />
          <PostOptionItems />
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <PostIconButton className="sm:hidden">
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Post options</span>
        </PostIconButton>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl px-0 sm:hidden">
        <SheetHeader>
          <SheetTitle className="mb-4 text-xl">Post Options</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <PostOptionItems />
      </SheetContent>
    </Sheet>
  )
}

export function AlertDialogComponent({
  children,
  title,
  description,
  action,
  isAlertOpen,
  setIsAlertOpen,
}: {
  children: React.ReactElement
  title: string
  description: string
  action: React.ReactNode
  isAlertOpen: boolean
  setIsAlertOpen: SetAction<boolean>
}) {
  return (
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {action}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function UserOptions({
  userId,
  username,
  setIsMenuOpen,
}: {
  userId: string
  username: string
  setIsMenuOpen: SetAction<boolean>
}) {
  const { posts, removePost } = usePosts()
  const {
    user,
    setUserFollowing,
    setUserMuted,
    setUserBlocked,
    isUserMuted,
    isUserBlocked,
    isUserFollowed,
  } = useUser()

  const authorized = userId === user?.id

  const handleAddFollower = async () => {
    setIsMenuOpen(false)
    const { success, status } = await setUserFollowing(userId)
    if (!success) return

    toast({
      variant: "default",
      description: `You ${status === "Follow" ? "unfollowed" : "followed"} @${username}`,
    })
  }

  const removePostFromState = (userId: string) => {
    const userPosts = [
      ...posts.forYou.filter((post) => pu(post)._id?.toString() === userId),
      ...posts.following.filter((post) => pu(post)._id?.toString() === userId),
    ].map((post) => post._id!.toString())

    removePost(userPosts)
  }

  const handleMuteClick = async () => {
    setIsMenuOpen(false)
    const { success, status } = await setUserMuted(userId)
    if (!success) return

    removePostFromState(userId)

    toast({
      variant: "default",
      description: `You ${status} @${username}`,
    })
  }
  const handleBlockClick = async () => {
    setIsMenuOpen(false)
    const { success, status } = await setUserBlocked(userId)
    if (!success) return

    removePostFromState(userId)

    toast({
      variant: "default",
      description: `You ${status} @${username}`,
    })
  }

  return (
    <>
      {!authorized && (
        <>
          <Button
            variant="ghost"
            onClick={handleAddFollower}
            className="option-button"
          >
            {isUserFollowed(userId) ? (
              <>
                <UserMinusIcon className="size-5 sm:size-4" />
                <span>Unfollow &#64;{username}</span>
              </>
            ) : (
              <>
                <UserPlusIcon className="size-5 sm:size-4" />
                <span>Follow &#64;{username}</span>
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={handleMuteClick}
            className="option-button"
          >
            {isUserMuted(userId) ? (
              <>
                <Volume2Icon className="size-5 sm:size-4" />
                <span>Unmute &#64;{username}</span>
              </>
            ) : (
              <>
                <VolumeOffIcon className="size-5 sm:size-4" />
                <span>Mute &#64;{username}</span>
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={handleBlockClick}
            className="option-button"
          >
            {isUserBlocked(userId) ? (
              <>
                <Circle className="size-5 sm:size-4" />
                <span>Unblock &#64;{username}</span>
              </>
            ) : (
              <>
                <BanIcon className="size-5 sm:size-4" />
                <span>Block &#64;{username}</span>
              </>
            )}
          </Button>
        </>
      )}
    </>
  )
}
