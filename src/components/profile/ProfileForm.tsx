"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Camera, User, Check, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ProfileForm() {
  const { update: updateSession } = useSession();
  const [profile, setProfile] = useState({ nombre: "", apellido: "", email: "", foto: "", rol: "" });
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        setProfile({
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          email: data.email || "",
          foto: data.foto || "",
          rol: data.rol || ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: profile.nombre,
          apellido: profile.apellido,
          email: profile.email
        }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Perfil actualizado exitosamente." });
        if (updateSession) updateSession();
      } else {
        const err = await res.json();
        setMessage({ type: "error", text: err.error || "Error al actualizar el perfil." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error de red al actualizar perfil." });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden." });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({ type: "error", text: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPassword: passwords.newPassword
        }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Contraseña actualizada exitosamente." });
        setPasswords({ newPassword: "", confirmPassword: "" });
      } else {
        const err = await res.json();
        setMessage({ type: "error", text: err.error || "Error al actualizar la contraseña." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error de red al cambiar contraseña." });
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "La foto no debe superar los 5MB." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadingFoto(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/upload/foto", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.foto) {
        setProfile(prev => ({ ...prev, foto: data.foto }));
        setMessage({ type: "success", text: "¡Foto de perfil actualizada con éxito!" });
        if (updateSession) updateSession();
      } else {
        setMessage({ type: "error", text: data.error || "Error al subir la foto." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error de conexión al subir la foto." });
    } finally {
      setUploadingFoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {message.text && (
        <div className={`p-4 rounded-md flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <Check className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tarjeta de Foto de Perfil */}
      <Card>
        <CardHeader>
          <CardTitle>Foto de Perfil</CardTitle>
          <CardDescription>Agrega o actualiza tu fotografía para tu identificación escolar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-100 shadow-md bg-slate-100 flex items-center justify-center">
                {profile.foto ? (
                  <img 
                    src={profile.foto} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFoto}
                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                title="Subir foto"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div>
                <h4 className="font-semibold text-slate-900 text-base">
                  {profile.nombre} {profile.apellido}
                </h4>
                <p className="text-sm text-slate-500">{profile.email}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  {profile.rol || "Usuario"}
                </span>
              </div>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFoto}
                  className="gap-2"
                >
                  <Camera className="w-4 h-4" />
                  {uploadingFoto ? "Subiendo..." : "Cambiar fotografía"}
                </Button>
                <p className="text-xs text-slate-400 mt-1">Formatos admitidos: JPG, PNG, WEBP (Máx. 5MB)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta de Información Personal */}
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>Actualiza tu nombre y correo electrónico institucional</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" name="nombre" value={profile.nombre} onChange={handleProfileChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input id="apellido" name="apellido" value={profile.apellido} onChange={handleProfileChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" name="email" type="email" value={profile.email} onChange={handleProfileChange} required />
            </div>
            <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
              {saving ? "Guardando..." : "Guardar Perfil"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tarjeta de Cambio de Contraseña */}
      <Card>
        <CardHeader>
          <CardTitle>Cambiar Contraseña</CardTitle>
          <CardDescription>Actualiza tu contraseña de acceso al sistema escolar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSavePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Input 
                id="newPassword" 
                name="newPassword" 
                type="password" 
                placeholder="Mínimo 6 caracteres"
                value={passwords.newPassword} 
                onChange={handlePasswordChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                placeholder="Repite la nueva contraseña"
                value={passwords.confirmPassword} 
                onChange={handlePasswordChange} 
                required 
              />
            </div>
            <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
              {saving ? "Actualizando..." : "Actualizar Contraseña"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
