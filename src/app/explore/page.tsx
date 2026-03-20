"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

const allSystems = [
  { id: "fort-knox", name: "Fort Knox", category: "Vault System", difficulty: "Beginner", desc: "The world&apos;s most famous gold depository." },
  { id: "crown-jewels", name: "Crown Jewels", category: "Vault System", difficulty: "Beginner", desc: "Tower of London's high-security jewel house." },
  { id: "cia", name: "CIA", category: "Intelligence System", difficulty: "Advanced", desc: "Global intelligence and covert operations." },
  { id: "mossad", name: "Mossad", category: "Intelligence System", difficulty: "Advanced", desc: "Israeli national intelligence agency." },
  { id: "mss", name: "MSS", category: "Intelligence System", difficulty: "Advanced", desc: "Ministry of State Security, China." },
  { id: "raw", name: "RAW", category: "Intelligence System", difficulty: "Advanced", desc: "Research and Analysis Wing, India." },
  { id: "fsb", name: "FSB", category: "Intelligence System", difficulty: "Advanced", desc: "Federal Security Service, Russia." },
  { id: "isi", name: "ISI", category: "Intelligence System", difficulty: "Advanced", desc: "Inter-Services Intelligence, Pakistan." },
  { id: "mi6", name: "MI6", category: "Intelligence System", difficulty: "Advanced", desc: "Secret Intelligence Service, UK." },
  { id: "dgse", name: "DGSE", category: "Intelligence System", difficulty: "Advanced", desc: "General Directorate for External Security, France." },
  { id: "seed-vault", name: "Svalbard Seed Vault", category: "Preservation System", difficulty: "Beginner", desc: "Doomsday vault for global crop diversity." },
  { id: "vatican-archives", name: "Vatican Archives", category: "Preservation System", difficulty: "Beginner", desc: "Highly restricted historical archives." },
  { id: "area-51", name: "Area 51", category: "Isolation System", difficulty: "Advanced", desc: "Highly classified USAF facility." },
  { id: "north-sentinel", name: "North Sentinel Island", category: "Isolation System", difficulty: "Beginner", desc: "Isolated indigenous population." },
  { id: "snake-island", name: "Snake Island", category: "Isolation System", difficulty: "Beginner", desc: "Ilha da Queimada Grande, highly restricted due to venomous snakes." },
  { id: "qin-shi-huang", name: "Qin Shi Huang Tomb", category: "Isolation System", difficulty: "Advanced", desc: "Unexcavated mausoleum with suspected booby traps." },
];

export default function ExplorePage() {
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
          {allSystems.map((system, i) => (
            <motion.div
              key={system.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/systems/${system.id}`}>
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
                    <CardDescription>{system.desc}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
