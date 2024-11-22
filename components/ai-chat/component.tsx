"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MoreHorizontal, MessageSquare, Clock, Trash, User } from "lucide-react"
import { TimeAgo } from "../time-ago"
import { AvatarComponent } from "../post/content"
import { NavigateBackHeader } from "../home"
import Link from "next/link"
import { cl } from "@/utils/ps"
import { AIChatPT } from "@/types/generics.type"
import AIChatDialogForm from "./create"
import { deleteAIChat } from "@/actions/aiChatActions"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function AIChatsComponent({ aiChats }: { aiChats: AIChatPT[] }) {
  return (
    <div className="w-full sm:min-h-screen">
      <NavigateBackHeader page="AI Chats" rsC={<AIChatDialogForm />} />
      <main className="main-content">
        {aiChats.map((aiChat, index) => (
          <AIChatComponent key={index} aiChat={aiChat} />
        ))}
      </main>
    </div>
  )
}

export function AIChatComponent({ aiChat }: { aiChat: AIChatPT }) {
  const { data: session } = useSession()
  const currentUser = session?.user

  const router = useRouter()

  const { title, description, user, updatedAt, model_name, chat_link, _id } =
    aiChat
  return (
    <Card className="m-4 overflow-hidden">
      <Link href={chat_link} target="_blank">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 self-start text-primary" />
              <h2 className="flex-1 text-lg font-semibold leading-none">
                {title}
              </h2>
            </div>
            <div className="flex items-center text-nowrap text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              <TimeAgo timestamp={updatedAt as Date} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="mt-4 flex items-center justify-start">
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              {model_name}
            </span>
          </div>
        </CardContent>
      </Link>
      <div className="mx-6 h-px bg-border" />
      <CardFooter className="flex items-center justify-between py-3">
        <div className="flex items-center space-x-2">
          <AvatarComponent user={user} />
          <Link
            href={cl(user.username)}
            className="text-sm font-medium hover:underline"
          >
            {user?.name}
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem> */}
            {currentUser?.email === user.email ? (
              <DropdownMenuItem
                onClick={async () => await deleteAIChat(_id as string)}
              >
                <Trash className="mr-2 h-4 w-4 text-red-500 hover:text-red-500" />
                <span className="text-red-500 hover:text-red-500">Delete</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => router.push(cl(user.username))}>
                <User className="mr-2 h-4 w-4" />
                <span>&#64;{user.username}</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
