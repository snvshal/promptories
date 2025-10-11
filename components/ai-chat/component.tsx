"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MoreHorizontal, Trash, Flag, User } from "lucide-react"
import { TimeAgo } from "../time-ago"
import { AvatarComponent } from "../post/content"
import { NavigateBackHeader } from "../home"
import Link from "next/link"
import { cl } from "@/utils/ps"
import { AIChatPT } from "@/types/generics.type"
import AIChatDialogForm from "./create"
import { deleteAIChat } from "@/actions/ai-chats"
import { AlertDialogComponent } from "../post/option"
import { AlertDialogAction } from "../ui/alert-dialog"
import { useState } from "react"
import { useUser } from "@/hooks/use-user"

export default function AIChatsComponent({ aiChats }: { aiChats: AIChatPT[] }) {
  return (
    <div className="w-full">
      <NavigateBackHeader
        page="AI Chats"
        classNames="py-3"
        rsC={<AIChatDialogForm />}
      />
      <main className="main-content">
        {aiChats.map((aiChat, index) => (
          <AIChatComponent key={index} aiChat={aiChat} />
        ))}
        <div className="h-20 w-full" />
      </main>
    </div>
  )
}

export function AIChatComponent({ aiChat }: { aiChat: AIChatPT }) {
  const [isAlertChatOpen, setIsAlertChatOpen] = useState(false)

  const { isAuthorized } = useUser()

  const { title, description, user, updatedAt, model_name, chat_link, _id } =
    aiChat
  return (
    <Card className="m-4 overflow-hidden">
      {/* <Link href={chat_link} target="_blank"> */}
      <AlertDialogComponent
        isAlertOpen={isAlertChatOpen}
        setIsAlertOpen={setIsAlertChatOpen}
        title="Open Chat"
        description={`You are about to visit "${chat_link}". Do you want to continue?`}
        action={
          <AlertDialogAction asChild>
            <a href={chat_link} target="_blank" rel="noopener noreferrer">
              Continue
            </a>
          </AlertDialogAction>
        }
      >
        <div role="button" onClick={() => setIsAlertChatOpen(true)}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex-1 text-balance text-lg font-semibold leading-none">
                {title}
              </h2>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-balance text-sm text-muted-foreground">
              {description}
            </p>
            <div className="mt-4 flex items-center justify-start">
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                {model_name}
              </span>
            </div>
          </CardContent>
        </div>
      </AlertDialogComponent>

      {/* </Link> */}
      <div className="mx-6 h-px bg-border" />
      <CardFooter className="flex items-center justify-between py-3">
        <div className="flex items-center space-x-2">
          <AvatarComponent user={user} />
          <Link
            href={cl(user.username)}
            className="text-sm font-medium sm:hover:underline"
          >
            {user.username}
          </Link>
          <div className="flex items-center text-nowrap text-sm text-muted-foreground">
            <span className="pr-1">&#183;</span>
            <TimeAgo timestamp={updatedAt as Date} />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isAuthorized(user.email) ? (
              <DropdownMenuItem>
                <Button
                  variant="ghost"
                  className="flex-start h-auto w-full p-0 hover:bg-inherit"
                  onClick={async () => await deleteAIChat(_id as string)}
                >
                  <Trash className="mr-2 h-4 w-4 text-red-500 hover:text-red-500" />
                  <span className="text-red-500 hover:text-red-500">
                    Delete
                  </span>
                </Button>
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem>
                  <Link href={cl(user.username)} className="w-full">
                    <Button
                      variant="ghost"
                      className="flex-start h-auto w-full p-0 hover:bg-inherit"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Button>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant="ghost"
                    className="flex-start h-auto w-full p-0 hover:bg-inherit"
                  >
                    <Flag className="mr-2 h-4 w-4" />
                    <span>Report chat</span>
                  </Button>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
