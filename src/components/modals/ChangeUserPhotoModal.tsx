"use client";

import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, User, Check, AlertCircle } from "lucide-react";

interface ChangeUserPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    usuarioId: string;
    nombre: string;
    apellido: string;
    foto?: string | null;
  } | null;
  onSuccess: () => void;
}

export function ChangeUserPhotoModal({
  isOpen,
  onClose,
  user,
  onSuccess
}: ChangeUserPhotoModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError(null);
    }
  }, [isOpen, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no debe superar los 5MB");
      return;
    }

    setSelectedFile(file);
    setError(null);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("usuarioId", user.usuarioId);

      const res = await fetch("/api/upload/foto", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        setError(data.error || "Error al actualizar la foto");
      }
    } catch (err: any) {
      setError("Error de conexión al subir la imagen");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const currentDisplayPhoto = previewUrl || user.foto;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modificar Foto de Perfil</DialogTitle>
          <DialogDescription>
            Administra la fotografía de <strong>{user.nombre} {user.apellido}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-md bg-slate-100 flex items-center justify-center">
              {currentDisplayPhoto ? (
                <img
                  src={currentDisplayPhoto}
                  alt={user.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-slate-400" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition-colors"
              title="Seleccionar archivo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
          >
            <Camera className="w-4 h-4" />
            {selectedFile ? "Elegir otra imagen" : "Seleccionar imagen..."}
          </Button>

          {selectedFile && (
            <p className="text-xs text-slate-600 font-medium">
              Archivo seleccionado: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </p>
          )}

          {error && (
            <div className="w-full p-3 rounded-md bg-red-50 text-red-700 border border-red-200 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Guardando..." : "Guardar Foto"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
