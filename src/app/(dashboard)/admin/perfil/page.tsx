import ProfileForm from "@/components/profile/ProfileForm";

export default function AdminProfilePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
      <ProfileForm />
    </div>
  );
}
