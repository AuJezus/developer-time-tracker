import { z } from "zod";

export const timezones = Intl.supportedValuesOf("timeZone");

export const profileSchema = z.object({
  username: z
    .string()
    .min(5, "Username must be at least 5 characters long")
    .max(20, "Username cannot exceed 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  email: z.string().email("Invalid email address"),
  title: z
    .string()
    .min(5, "Developer title must be at least 5 character long")
    .max(45, "Developer title cannot exceed 45 characters")
    .optional(),
  occupation: z
    .string()
    .min(5, "Occupation must be at least 5 character long")
    .max(45, "Occupation cannot exceed 45 characters")
    .optional(),
  place: z
    .string()
    .min(5, "Place field must be at least 5 character long")
    .max(45, "Place field cannot exceed 45 characters")
    .optional(),
  timezone: z
    .string()
    .min(1)
    .max(100)
    .refine((value) => timezones.includes(value), {
      message: "Invalid timezone value",
    }),
  avatar: z.string(),
  visibility: z.boolean(),
});

// does it auto trim
// add avatar checking
