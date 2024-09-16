import { Bookmark, Compass, Home, Menu, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function SidebarComponent() {
    return (
        <>
            <aside className="hidden md:flex flex-col w-64 h-full border-r">
                <div className="p-4">
                    <h1 className="text-2xl font-bold text-blue-600">
                        Promptories
                    </h1>
                </div>
                <SidebarContent />
            </aside>
        </>
    );
}

export function ToggleSidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <header className="shadow-sm sticky top-0 z-10 md:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-blue-600">Promptories</h1>
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="bg-black">
                        <div className="mt-8">
                            <SidebarContent />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
export const SidebarContent = () => (
    <div className="flex flex-col space-y-4 p-4">
        <Button variant="ghost" className="justify-start">
            <Home className="mr-2 h-4 w-4" />
            Home
        </Button>
        <Button variant="ghost" className="justify-start">
            <Compass className="mr-2 h-4 w-4" />
            Explore
        </Button>

        <Button variant="ghost" className="justify-start">
            <Bookmark className="mr-2 h-4 w-4" />
            Bookmarks
        </Button>

        <Button variant="ghost" className="justify-start">
            <Users className="mr-2 h-4 w-4" />
            Communities
        </Button>
        <Button variant="default" className="justify-center h-10 rounded-full">
            New Post
        </Button>
        <Button
            variant="ghost"
            className="justify-start h-14 rounded-full p-2 gap-2"
        >
            <Avatar>
                <AvatarImage src={"/"} alt={"user"} />
                <AvatarFallback>{"A"}</AvatarFallback>
            </Avatar>
            <h2 className="font-semibold text-base">Alice Johnson</h2>
        </Button>
    </div>
);
