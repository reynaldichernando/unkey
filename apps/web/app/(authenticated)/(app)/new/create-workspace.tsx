"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useOrganizationList } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Box, Code2 } from "lucide-react";
import { Loading } from "@/components/dashboard/loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Workspace } from "@unkey/db";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(3, "Name is required and should be at least 3 characters").max(50),
  slug: z.string().min(1, "Slug is required").max(50).regex(/^[a-zA-Z0-9-_\.]+$/),
  plan: z.enum(["free", "pro"]),
});

type Props = {
  workspaces: Workspace[];
};

export const CreateWorkspace: React.FC<Props> = ({ workspaces }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: workspaces.length === 0 ? "free" : "pro",
    },
  });
  const { setActive } = useOrganizationList();

  const { toast } = useToast();
  const router = useRouter();
  const createWorkspace = trpc.workspace.create.useMutation({
    onSuccess: async ({ workspace, organizationId }) => {
      toast({
        title: "Workspace Created",
        description: "Your workspace has been created",
      });

      if (setActive) {
        await setActive({ organization: organizationId });
      }
      router.push(`/new?workspaceId=${workspace.id}`);
    },
    onError(err) {
      if (err.message.includes("Duplicate entry")) {
        toast({
          title: "Error",
          description: "Workspace already exists, please change the slug and try again",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: `An error occured while creating your workspace: ${err.message}`,
          variant: "destructive",
        });
      }
    },
  });

  return (
    <div className="flex items-start justify-between gap-16">
      <main className="w-3/4">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => createWorkspace.mutate({ ...values }))}
              className="flex flex-col space-y-4"
            >
              <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormMessage className="text-xs" />
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>What should your workspace be called?</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormMessage className="text-xs" />
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        This will be used in urls etc. Only alphanumeric, dashes, underscores and
                        periods are allowed
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-8">
                <FormField
                  control={form.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-lg">Plan</FormLabel>
                      <FormControl>
                        <div className="flex flex-col space-y-4">
                          <FormItem
                            className={cn(
                              "flex items-start justify-between space-x-3 space-y-0 border rounded-md p-4",
                              {
                                "border-primary": field.value === "pro",
                              },
                            )}
                            onClick={() => {
                              field.onChange("pro");
                            }}
                          >
                            <div>
                              <FormLabel className="font-semibold">PRO</FormLabel>

                              <p className="text-sm text-muted-foreground">
                                Usage based billing for teams
                              </p>
                              <p className="text-xs text-muted-foreground">
                                250 Monthly active keys and 10,000 verifications included.
                              </p>
                            </div>
                            <div>
                              <Badge>
                                $25<span className="ml-1 font-light">/ month</span>
                              </Badge>
                            </div>
                          </FormItem>
                          <FormItem
                            className={cn(
                              "flex items-start justify-between  space-x-3 space-y-0 border rounded-md p-4",
                              {
                                "border-primary": field.value === "free",
                              },
                            )}
                            onClick={() => {
                              {
                                if (workspaces.length > 0) {
                                  // only one free workspace allowed
                                  return;
                                }
                                field.onChange("free");
                              }
                            }}
                          >
                            <div>
                              <div
                                className={cn({
                                  "opacity-60 cursor-disabled": workspaces.length > 0,
                                })}
                              >
                                <FormLabel className="font-semibold">FREE</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Free forever for side projects
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  The free tier allows up to 100 monthly active keys and 2,500
                                  verifications per month.
                                </p>
                              </div>
                              {workspaces.length > 0 ? (
                                <p className="mt-2 text-xs text-destructive">
                                  Only one free workspace allowed
                                </p>
                              ) : null}
                            </div>
                          </FormItem>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-8">
                <Button
                  variant={form.formState.isValid ? "default" : "outline"}
                  disabled={createWorkspace.isLoading || !form.formState.isValid}
                  type="submit"
                  className="w-full"
                >
                  {createWorkspace.isLoading ? <Loading /> : "Create Workspace"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
      <aside className="flex flex-col items-start justify-center w-1/4 space-y-16">
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center p-4 border rounded-full bg-primary/5">
            <Box className="w-6 h-6 text-primary" />
          </div>
          <h4 className="text-lg font-medium">What is a workspace?</h4>
          <p className="text-sm text-muted-foreground">
            A workspace groups all your resources and billing. You can have one personal workspace
            for free and create more workspaces with your teammates.
          </p>
        </div>
      </aside>
    </div>
  );
};
