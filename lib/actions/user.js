"use server";

import { redirect } from "next/navigation";
import { profileSchema } from "../schema/profileSchema";
import { createClient } from "../supabase/server";

export async function getUser() {
  const supabase = createClient();
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .single();

  if (error) {
    console.error("Error getting user: ", error);
  }

  return user;
}

export async function updateUserSettings(id, formData) {
  try {
    // Need to convert back from FormData to object
    const data = Object.fromEntries(formData.entries());
    data.visibility = data.visibility === "true";

    const parsedData = profileSchema.parse(data);
    const supabase = createClient();

    // Upload image
    if (typeof parsedData.avatar === "object") {
      const { data: image, error: errorImage } = await supabase.storage
        .from("avatars")
        .upload(`${id}.png`, parsedData.avatar, {
          upsert: true,
        });

      if (errorImage) throw errorImage;

      const {
        data: { publicUrl },
      } = await supabase.storage.from("avatars").getPublicUrl(image.path);

      parsedData.avatar_url = publicUrl;
    }

    delete parsedData.avatar;

    const { data: user, error } = await supabase
      .from("users")
      .update(parsedData)
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error(error);
    return { error: error.errors };
  } finally {
    redirect(`/profile/${id}`);
  }
}
