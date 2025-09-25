"use client"

import { useState, useTransition } from "react"
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
import { cl, postPathname, pu } from "@/utils/ps"
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
import { ToolTipComponent } from "../ui/tooltip"
import { PostIconButton } from "./footer"

export function PostOptions({ post, type }: PostContentProps) {
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const isLoading = isDeleting || isPending

  const handleDeletePostClick = async () => {
    try {
      setIsDeleting(true)
      const postId = post._id?.toString()

      if (!postId) throw new Error("Invalid post ID")

      startTransition(async () => {
        // First delete from database
        await handleDeletePost(postId)

        // Handle DOM update and navigation
        if (type === "post") {
          router.back()
        } else {
          const postElement = document.querySelector(
            `[data-key="${postId}"].mid-width-card-content`,
          )

          if (postElement instanceof HTMLElement) {
            // Set initial styles for smooth animation
            postElement.style.cssText = `
              transition: 
                opacity 0.4s ease-out,
                transform 0.4s ease-out,
                height 0.4s ease-out 0.2s,
                margin 0.4s ease-out 0.2s,
                padding 0.4s ease-out 0.2s;
              transform-origin: top;
              overflow: hidden;
            `

            // Start the animation sequence
            requestAnimationFrame(() => {
              postElement.style.opacity = "0"
              postElement.style.transform = "translateY(-8px) scale(0.98)"

              // Add event listener for the first phase completion
              postElement.addEventListener(
                "transitionend",
                (e) => {
                  // Only proceed if opacity transition ended
                  if (e.propertyName === "opacity") {
                    const height = postElement.offsetHeight
                    postElement.style.height = `${height}px`

                    // Force browser reflow
                    postElement.offsetHeight

                    // Collapse the element
                    requestAnimationFrame(() => {
                      postElement.style.height = "0"
                      postElement.style.margin = "0"
                      postElement.style.padding = "0"

                      // Remove element after all transitions complete
                      postElement.addEventListener(
                        "transitionend",
                        (e) => {
                          if (e.propertyName === "height") {
                            postElement.remove()
                          }
                        },
                        { once: true },
                      )
                    })
                  }
                },
                { once: true },
              )
            })
          }

          toast({
            description: "Post deleted successfully",
            variant: "default",
          })
        }
      })
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete post",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsAlertOpen(false)
      setIsSheetOpen(false)
      setIsMenuOpen(false)
    }
  }

  const authorized = pu(post).email === user?.email

  const PostOptionItems = () => (
    <div className="flex flex-col">
      <Link href={cl(pu(post).username)} prefetch={false} className="sm:hidden">
        <Button
          variant="ghost"
          className="w-full justify-start max-sm:h-12 max-sm:text-lg"
        >
          <User className="mr-2 size-5 sm:size-4" />
          <span>&#64;{pu(post).username}</span>
        </Button>
      </Link>
      {post.model_url && (
        <Link href={post.model_url} target="_blank" prefetch={false}>
          <Button
            variant="ghost"
            className="w-full justify-start max-sm:h-12 max-sm:text-lg"
          >
            <SquareArrowOutUpRight className="mr-2 size-5 sm:size-4" />
            <span>Test it</span>
          </Button>
        </Link>
      )}
      {post.chat_link && (
        <Link href={post.chat_link} target="_blank" prefetch={false}>
          <Button
            variant="ghost"
            className="w-full justify-start max-sm:h-12 max-sm:text-lg"
          >
            <MessageSquareShare className="mr-2 size-5 sm:size-4" />
            <span>View chat</span>
          </Button>
        </Link>
      )}
      {authorized && (
        <Link href={postPathname(post, "edit")} prefetch={false}>
          <Button
            variant="ghost"
            className="w-full justify-start max-sm:h-12 max-sm:text-lg"
          >
            <Edit className="mr-2 size-5 sm:size-4" />
            <span>Edit</span>
          </Button>
        </Link>
      )}
      {authorized && (
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-500 max-sm:h-12 max-sm:text-lg"
              onClick={(event) => {
                event.preventDefault()
                setIsAlertOpen(true)
              }}
            >
              <Trash className="mr-2 size-5 sm:size-4" />
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
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile View */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <PostIconButton className="sm:hidden">
            <Ellipsis className="h-4 w-4" />
            <span className="sr-only">Post options</span>
          </PostIconButton>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-3xl sm:hidden">
          <SheetHeader>
            <SheetTitle className="mb-4 text-xl">Post Options</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <PostOptionItems />
        </SheetContent>
      </Sheet>

      {/* Desktop View */}
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <ToolTipComponent content="More">
          <DropdownMenuTrigger asChild>
            <PostIconButton className="max-sm:hidden">
              <Ellipsis className="h-4 w-4" />
              <span className="sr-only">Post options</span>
            </PostIconButton>
          </DropdownMenuTrigger>
        </ToolTipComponent>
        <DropdownMenuContent className="absolute -left-36 -top-8 w-40 shadow-2xl shadow-slate-900">
          <DropdownMenuLabel>Post Options</DropdownMenuLabel>
          <DropdownMenuSeparator className="h-[.1mm]" />
          <PostOptionItems />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
