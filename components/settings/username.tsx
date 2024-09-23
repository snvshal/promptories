"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User, Moon, Sun } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  isUsernameUnique,
  updateUsername,
} from "@/actions/handleProfileActions";
import { TUser } from "@/types/schema.type";

const usernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .superRefine(async (username, ctx) => {
      const result = await isUsernameUnique(username);
      if (!result.status) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.message,
        });
      }
    }),
});

type UsernameFormValues = z.infer<typeof usernameSchema>;

export default function ChangeUsernamePage({ user }: { user: TUser }) {
  const usernameForm = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: user.username,
    },
  });

  const onUsernameSubmit = async (data: UsernameFormValues) => {
    try {
      // Simulate API call
      //   await new Promise((resolve) => setTimeout(resolve, 2000));
      await updateUsername(user._id as string, data.username);
      console.log(data);
      toast({
        title: "Username updated",
        description: "Your username has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your username.",
        variant: "destructive",
      });
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Username</CardTitle>
        <CardDescription>Update your unique username</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...usernameForm}>
          <form
            onSubmit={usernameForm.handleSubmit(onUsernameSubmit)}
            className="space-y-4"
          >
            <FormField
              control={usernameForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your new username" {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose a unique username. It must be 3-20 characters long.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Change Username</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
