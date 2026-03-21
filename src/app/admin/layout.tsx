"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Database, PlusCircle, Settings, LogOut, Loader2 } from "lucide-react";
import { useAdminThemeStore } from "@/store/adminStore";
import { supabase } from "@/lib/supabase";

const themeClasses: Record<string, string> = {
  blue: "bg-blue-600/20 border-blue-500/30 text-blue-400",
  purple: "bg-purple-600/20 border-purple-500/30 text-purple-400",
  emerald: "bg-emerald-600/20 border-emerald-500/30 text-emerald-400",
  orange: "bg-orange-600/20 border-orange-500/30 text-orange-400",
  red: "bg-red-600/20 border-red-500/30 text-red-400"
};

const activeThemeClasses: Record<string, string> = {
  blue: "bg-blue-600 text-white",
  purple: "bg-purple-600 text-white",
  emerald: "bg-emerald-600 text-white",
  orange: "bg-orange-600 text-white",
  red: "bg-red-600 text-white"
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, loadTheme } = useAdminThemeStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        await loadTheme();
        setLoading(false);
      }
    }
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
            router.push('/login');
        }
    });

    return () => {
        subscription.unsubscribe();
    }
  }, [router, loadTheme]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Systems", href: "/admin", icon: Database }, // Main page doubles as systems view
    { name: "Create System", href: "/admin/systems/create", icon: PlusCircle },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const currentThemeBg = themeClasses[theme] || themeClasses.blue;
  const activeBg = activeThemeClasses[theme] || activeThemeClasses.blue;

  return (
    <div className="min-h-screen flex bg-zinc-950 pt-16">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col bg-black/50 backdrop-blur-xl">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight">Admin Console</h2>
          <p className="text-xs text-muted-foreground mt-1">TVN Secure Systems</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isStrictlyActive = pathname === item.href;
            const actualIsActive = item.name === "Systems" ? pathname === "/admin" : isStrictlyActive;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  actualIsActive
                    ? activeBg
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Dynamic theme banner strip */}
        <div className={`h-2 w-full ${currentThemeBg.split(' ')[0]}`} />
        <div className="p-8">
            {children}
        </div>
      </main>
    </div>
  );
}
