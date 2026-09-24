"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, GraduationCap, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const performLogin = async (loginEmail: string, loginPass: string) => {
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: loginEmail,
        password: loginPass,
        redirect: false,
      });

      if (res?.error) {
        setError("Credenciales incorrectas");
        setLoading(false);
      } else if (res?.ok) {
        // Determine redirect target based on email prefix or session
        let target = "/admin";
        if (loginEmail.startsWith("m")) target = "/maestro";
        else if (loginEmail.startsWith("a") && !loginEmail.startsWith("admin")) target = "/alumno";

        window.location.href = target;
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(email, password);
  };

  const handleQuickLogin = (demoEmail: string) => {
    const pass = demoEmail === "admin@escuela.com" ? "admin123" : "password123";
    setEmail(demoEmail);
    setPassword(pass);
    performLogin(demoEmail, pass);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-blue-600">EscuelaApp</CardTitle>
          <CardDescription className="text-slate-500">
            Sistema de Gestión Escolar — Inicia sesión
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@escuela.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Accesos Rápidos de Demo</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickLogin("admin@escuela.com")}
              disabled={loading}
              className="flex flex-col h-auto py-2 items-center text-xs gap-1"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Admin</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickLogin("m1@escuela.com")}
              disabled={loading}
              className="flex flex-col h-auto py-2 items-center text-xs gap-1"
            >
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Maestro</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickLogin("a1@escuela.com")}
              disabled={loading}
              className="flex flex-col h-auto py-2 items-center text-xs gap-1"
            >
              <UserCheck className="w-4 h-4 text-green-600" />
              <span>Alumno</span>
            </Button>
          </div>
          <p className="text-center text-xs text-slate-400">
            Contraseña por defecto para demo: <code className="bg-slate-100 px-1 py-0.5 rounded">password123</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
