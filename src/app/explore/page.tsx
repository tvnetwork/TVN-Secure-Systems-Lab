"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";

interface SecuritySystem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  difficulty: 'Beginner' | 'Advanced';
}

export default function ExplorePage() {
  const [systems, setSystems] = useState<SecuritySystem[]>([]);

  useEffect(() => {
    async function loadSystems() {
      const { data, error } = await supabase.from("systems").select("*").order("name");
      if (error) {
        console.error("Error fetching systems:", error);
      } else {
        setSystems((data as SecuritySystem[]) || []);
      }
    }

    loadSystems();
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Explore Systems</h1>
          <p className="text-muted-foreground text-lg">Browse our database of the world&apos;s most secure systems.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {systems.map((system, i) => (
            <motion.div
              key={system.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.05, 0.5) }}
            >
              <Link href={`/systems/${system.slug}`}>
                <Card className="h-full cursor-pointer group flex flex-col">
                  <CardHeader className="flex-grow">
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
                    <CardTitle className="group-hover:text-primary/80 transition-colors text-lg">{system.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3">{system.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}

          {systems.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground p-12 bg-white/5 border border-white/10 rounded-2xl">
              No systems available in the database.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
