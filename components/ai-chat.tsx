"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MoreHorizontal, MessageSquare, Clock } from "lucide-react"
import { TAIChat, TUser } from "@/types/schema.type"
import { TimeAgo } from "./time-ago"
import { AvatarComponent } from "./post/content"
import { NavigateBackHeader } from "./home"
import Link from "next/link"
import { useRouter } from "next/navigation"

// interface ChatCardProps {
//   title: string
//   description: string
//   aiModel: string
//   time: string
//   userName: string
//   userAvatar: string
// }

export default function AIChatsComponent({ aiChats }: { aiChats: TAIChat[] }) {
  const router = useRouter()

  return (
    <div className="min-h-screen w-full">
      <NavigateBackHeader
        page="AI Chats"
        rsC={
          <Button onClick={() => router.push("/ai-chats/create")}>
            Create
          </Button>
        }
      />
      <main className="main-content">
        {aiChats.map((aiChat, index) => (
          <AIChatComponent key={index} aiChat={aiChat} />
        ))}
      </main>
    </div>
  )
}

export function AIChatComponent({ aiChat }: { aiChat: TAIChat }) {
  const { title, description, user, updatedAt, model, chat_link } = aiChat
  return (
    <Card className="m-4 overflow-hidden">
      <Link href={chat_link} target="_blank">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 self-start text-primary" />
              <h2 className="text-lg font-semibold leading-none">{title}</h2>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              <TimeAgo timestamp={updatedAt as Date} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="mt-4 flex items-center justify-start">
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              {model}
            </span>
          </div>
        </CardContent>
      </Link>
      <div className="mx-6 h-px bg-border" />
      <CardFooter className="flex items-center justify-between py-3">
        <div className="flex items-center space-x-2">
          <AvatarComponent user={user as TUser} />
          <span className="text-sm font-medium">{(user as TUser)?.name}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
