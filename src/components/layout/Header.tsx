"use client";

import { Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();

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
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center md:hidden">
        <h2 className="text-xl font-bold text-blue-600">EscuelaApp</h2>
      </div>
      
      <div className="flex items-center justify-end w-full space-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5 text-slate-500" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="relative flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border border-slate-200 hover:ring-2 hover:ring-blue-400 transition-all outline-none">
            {session?.user?.image ? (
              <img 
                src={session.user.image} 
                alt={session.user.name || "Foto"} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-500">
                <User className="w-5 h-5" />
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user?.name || "Usuario"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email || "usuario@escuela.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              onSelect={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
