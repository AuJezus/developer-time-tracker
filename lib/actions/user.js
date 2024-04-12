"use server";

import { redirect } from "next/navigation";
import { profileSchema } from "../schema/profileSchema";
import { createClient } from "../supabase/server";
import uniqid from "uniqid";

export async function getUser(id) {
  const supabase = createClient();
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error getting user: ", error);
  }

  return user;
}

export async function updateProfilePicture(id, parsedData) {
  const supabase = createClient();

  const { data: files, error: errorList } = await supabase.storage
    .from("avatars")
    .list(`${id}`);

  if (errorList) throw errorList;

  if (files.length) {
    const { error: errorDelete } = await supabase.storage
      .from("avatars")
      .remove(files.map((file) => `${id}/${file.name}`));

    if (errorDelete) throw errorDelete;
  }

  const { data: image, error: errorImage } = await supabase.storage
    .from("avatars")
    .upload(`${id}/${parsedData.username}_${uniqid()}.png`, parsedData.avatar, {
      upsert: false,
    });

  if (errorImage) throw errorImage;

  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(image.path);

  return publicUrl;
}

export async function updateUserSettings(id, formData) {
  try {
    // Need to convert back from FormData to object
    const data = Object.fromEntries(formData.entries());
    data.visibility = data.visibility === "true";

    const parsedData = profileSchema.parse(data);
    const supabase = createClient();

    if (typeof parsedData.avatar === "object")
      parsedData.avatar_url = await updateProfilePicture(id, parsedData);

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
