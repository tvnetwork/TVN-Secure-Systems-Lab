"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Database, Building2, EyeOff } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import { SecuritySystem } from "@/store/systemStore";

const categories = [
  { name: "Vault Systems", icon: Database, desc: "Physical security & preservation" },
  { name: "Intelligence Systems", icon: EyeOff, desc: "Surveillance & information control" },
  { name: "Isolation Systems", icon: Building2, desc: "Total perimeter containment" },
  { name: "Preservation Systems", icon: ShieldCheck, desc: "Long-term data & biological storage" },
];

export default function Home() {
  const [featuredSystems, setFeaturedSystems] = useState<SecuritySystem[]>([]);

  useEffect(() => {
    async function loadFeatured() {
      const { data, error } = await supabase
        .from("systems")
        .select("*")
        .in('id', ['fort-knox', 'cia', 'seed-vault'])
        .limit(3);

      if (error) {
        console.error("Error fetching featured systems:", error);
      } else {
        setFeaturedSystems((data as SecuritySystem[]) || []);
      }
    }

    loadFeatured();
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center mb-24 mt-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent"
        >
          Understand the World&apos;s<br/>Most Secure Systems
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
        >
          From Fort Knox to the CIA — learn how security really works through interactive 3D simulations.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.4)]"
          >
            Explore Systems <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="max-w-5xl mx-auto mb-24">
        <h2 className="text-2xl font-semibold mb-8 border-b border-white/10 pb-4">System Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <cat.icon className="w-8 h-8 mb-4 text-white/70" />
              <h3 className="font-semibold mb-2">{cat.name}</h3>
              <p className="text-sm text-muted-foreground">{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Systems */}
      <section className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-semibold">Featured Systems</h2>
          <Link href="/explore" className="text-sm text-muted-foreground hover:text-white transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSystems.map((system) => (
            <Link href={`/systems/${system.id}`} key={system.id}>
              <Card className="h-full cursor-pointer group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/10 text-white/80">
                      {system.category}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      system.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {system.difficulty}
                    </span>
                  </div>
                  <CardTitle className="group-hover:text-primary/80 transition-colors">{system.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{system.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
