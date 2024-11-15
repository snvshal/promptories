"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Trash,
  Ellipsis,
  User,
  SquareArrowOutUpRight,
  MessageSquareShare,
  Edit,
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
import { handleDeletePost } from "@/actions/postActions"
import { pu } from "@/utils/ps"
import { useSession } from "next-auth/react"
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

export function PostOptions({ post, type }: PostContentProps) {
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleDeletePostClick = async () => {
    try {
      setIsDeleting(true)
      const data_key = post._id?.toString() as string
      const element = document.querySelector(`[data-key="${data_key}"]`)

      if (element) {
        await handleDeletePost(post._id as string)
        type === "post" && router.back()
        element.remove()
      }

      toast({
        description: "Your post has been deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem deleting your post.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsAlertOpen(false)
      setIsSheetOpen(false)
    }
  }

  const authorized = post.user._id?.toString() === user?.id

  const PostOptionItems = () => (
    <>
      <Link
        href={`/${pu(post).username}`}
        prefetch={false}
        className="sm:hidden"
      >
        <Button variant="ghost" className="w-full justify-start">
          <User className="mr-2 h-4 w-4" />
          <span>&#64;{pu(post).username}</span>
        </Button>
      </Link>
      <Link href={post.model_url} target="_blank" prefetch={false}>
        <Button variant="ghost" className="w-full justify-start">
          <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
          <span>Try it</span>
        </Button>
      </Link>
      {post.chat_link && (
        <Link href={post.chat_link} target="_blank" prefetch={false}>
          <Button variant="ghost" className="w-full justify-start">
            <MessageSquareShare className="mr-2 h-4 w-4" />
            <span>View chat</span>
          </Button>
        </Link>
      )}
      {authorized && (
        <Link
          href={`/${pu(post).username}/promptories/${post._id as string}/edit`}
          prefetch={false}
        >
          <Button variant="ghost" className="w-full justify-start">
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </Button>
        </Link>
      )}
      {authorized && (
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-500"
              onClick={(event) => {
                event.preventDefault()
                setIsAlertOpen(true)
              }}
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete the promptory. Are you sure
                you want to proceed? This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeletePostClick}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )

  return (
    <>
      {/* Mobile View */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className={`${type === "post" && "self-start"} absolute -right-2 size-8 rounded-full sm:hidden`}
          >
            <Ellipsis className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Post options</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-3xl sm:hidden">
          <SheetHeader>
            <SheetTitle>Post Options</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <PostOptionItems />
        </SheetContent>
      </Sheet>

      {/* Desktop View */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className={`${type === "post" && "self-start"} absolute -right-2 size-8 rounded-full max-sm:hidden`}
          >
            <Ellipsis className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Post options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="absolute -left-36 -top-8 w-40 shadow-2xl shadow-slate-900">
          <DropdownMenuLabel>Post Options</DropdownMenuLabel>
          <DropdownMenuSeparator className="h-[.1mm]" />
          <PostOptionItems />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
