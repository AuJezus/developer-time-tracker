import ProfileForm from "@/components/ProfileForm";
import { getUser } from "@/lib/actions/user";

async function ProfileSettingsPage() {
  const user = await getUser();

  return (
    <main className="max-w-[1200px] mx-auto w-full mt-12">
      <h1 className="text-3xl font-semibold mb-2">Profile settings</h1>
      <p className="text-muted-foreground mb-8">Update your profile settings</p>

      <ProfileForm user={user} />
    </main>
  );
}

export default ProfileSettingsPage;
