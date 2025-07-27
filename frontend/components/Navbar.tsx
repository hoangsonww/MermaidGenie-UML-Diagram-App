"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { LogOut, Moon, Sun, Monitor, PanelLeft, Menu } from "lucide-react";
import useUser from "@/hooks/useUser";
import { toast } from "sonner";

export default function Navbar() {
  const pathname = usePathname();
  const { user, mutate } = useUser();
  const { theme, setTheme } = useTheme();

  const NavItem = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={`transition-colors hover:text-primary ${
        pathname === href ? "text-primary font-semibold" : ""
      }`}
    >
      {label}
    </Link>
  );

  const logout = () => {
    localStorage.removeItem("token");
    mutate(null);
    toast.success("Logged out");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b">
      <nav className="flex items-center justify-between w-full px-4 md:px-6 py-3 max-w-7xl mx-auto">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-1 text-xl md:text-2xl font-bold tracking-tight text-primary"
        >
          <PanelLeft size={22} /> MermaidGenie
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <NavItem href="/charts" label="Charts" />
              <NavItem href="/profile" label="Profile" />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Logout"
                onClick={logout}
                className="hover:bg-destructive/10"
              >
                <LogOut size={18} />
              </Button>
            </>
          ) : (
            <>
              <NavItem href="/login" label="Login" />
              <NavItem href="/register" label="Register" />
            </>
          )}

          {/* Theme toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="hover:-rotate-12 transition"
              >
                {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun size={14} className="mr-2" /> Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon size={14} className="mr-2" /> Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor size={14} className="mr-2" /> System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile menu */}
        <div className="flex md:hidden items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-secondary/10"
              >
                <Menu size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/charts">Charts</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut size={14} className="mr-2" /> Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register">Register</Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun size={14} className="mr-2" /> Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon size={14} className="mr-2" /> Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor size={14} className="mr-2" /> System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
