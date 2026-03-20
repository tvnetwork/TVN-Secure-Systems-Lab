import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <ShieldAlert className="w-6 h-6" />
          <span className="font-bold text-xl tracking-tight">TVN Secure Systems Lab</span>
        </Link>
        <div className="flex gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/explore" className="hover:text-primary transition-colors">Explore</Link>
          <Link href="/builder" className="hover:text-primary transition-colors">Builder</Link>
          <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
        </div>
      </div>
    </nav>
  );
}
