"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Users, BookOpen, Calendar, Bell, 
  BarChart, Home, CheckSquare, GraduationCap, FileSpreadsheet, User, Layers, FileText, LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";

export function Sidebar() {
  const pathname = usePathname();
  
  // Determine role based on path
  const role = pathname.startsWith("/admin") ? "admin" 
             : pathname.startsWith("/maestro") ? "maestro" 
             : "alumno";

  const menuItems = {
    admin: [
      { name: "Inicio", href: "/admin", icon: Home },
      { name: "Alumnos", href: "/admin/alumnos", icon: Users },
      { name: "Maestros", href: "/admin/maestros", icon: GraduationCap },
      { name: "Materias", href: "/admin/materias", icon: BookOpen },
      { name: "Grupos", href: "/admin/grupos", icon: Users },
      { name: "Asignaciones", href: "/admin/asignaciones", icon: Layers },
      { name: "Horarios", href: "/admin/horarios", icon: Calendar },
      { name: "Avisos", href: "/admin/avisos", icon: Bell },
      { name: "Reportes", href: "/admin/reportes", icon: BarChart },
      { name: "Importar Datos", href: "/admin/importar", icon: FileSpreadsheet },
      { name: "Mi Perfil", href: "/admin/perfil", icon: User },
    ],
    maestro: [
      { name: "Inicio", href: "/maestro", icon: Home },
      { name: "Asistencia", href: "/maestro/asistencia", icon: CheckSquare },
      { name: "Calificaciones", href: "/maestro/calificaciones", icon: BarChart },
      { name: "Horario", href: "/maestro/horario", icon: Calendar },
      { name: "Avisos", href: "/maestro/avisos", icon: Bell },
      { name: "Mi Perfil", href: "/maestro/perfil", icon: User },
    ],
    alumno: [
      { name: "Inicio", href: "/alumno", icon: Home },
      { name: "Mi Boleta", href: "/alumno/boleta", icon: FileText },
      { name: "Calificaciones", href: "/alumno/calificaciones", icon: BarChart },
      { name: "Asistencia", href: "/alumno/asistencia", icon: CheckSquare },
      { name: "Horario", href: "/alumno/horario", icon: Calendar },
      { name: "Avisos", href: "/alumno/avisos", icon: Bell },
      { name: "Mi Perfil", href: "/alumno/perfil", icon: User },
    ]
  };

  const links = menuItems[role];

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
    // Borrar cookies client-side para garantizar cierre de sesión inmediato
    document.cookie = "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "__Secure-next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col w-64 border-r bg-white h-full hidden md:flex">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-600">EscuelaApp</h2>
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                isActive 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-blue-700" : "text-slate-400")} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Botón de Cerrar Sesión fijo en el pie del menú */}
      <div className="p-4 border-t mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 active:bg-red-100 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-red-500" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
