"use client";

import { Button } from "./ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/Form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/Input";
import { Switch } from "./ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { profileSchema, timezones } from "@/lib/schema/profileSchema";
import { updateUserSettings } from "@/lib/actions/user";
import FileInput from "./FileInput";

function ProfileForm({ user }) {
  const form = useForm({
    mode: "all",
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user.username,
      email: user.email || "",
      title: user.title || "",
      occupation: user.occupation || "",
      place: user.place || "",
      timezone: user.timezone || "",
      avatar: user.avatar_url,
      visibility: user.visibility,
    },
  });

  async function submit(data) {
    // Need to use formData to handle files
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }

    await updateUserSettings(user.id, formData);
  }

  return (
    <Form {...form}>
      <form
        action={form.handleSubmit(submit)}
        className="grid grid-cols-2 items-start gap-x-12 gap-y-8"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" disabled={true} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Developer title</FormLabel>
              <FormControl>
                <Input placeholder="Full-stack viking" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occupation</FormLabel>
              <FormControl>
                <Input placeholder="Developer at Viking Inc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="place"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Place</FormLabel>
              <FormControl>
                <Input placeholder="Valhalla" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-fit block"
                    >
                      <div className="justify-between flex items-center">
                        {field.value || "Select timezone"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </div>
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-0">
                  <Command>
                    <CommandInput placeholder="Search for your timezone" />
                    <CommandList>
                      <CommandEmpty>No such timezone found.</CommandEmpty>
                      <CommandGroup>
                        {timezones.map((timezone) => (
                          <CommandItem
                            key={timezone}
                            value={timezone}
                            onSelect={(currentValue) => {
                              form.setValue(
                                "timezone",
                                currentValue === field.value ? "" : currentValue
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === timezone
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {timezone}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FileInput field={field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile visibility</FormLabel>
              <div className="rounded-md flex items-center gap-10 w-fit border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <p className="text-sm font-medium">
                  Can others view your profile
                </p>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        <Button
          className="self-center col-span-2 max-w-[150px] w-full justify-self-center"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}

export default ProfileForm;
