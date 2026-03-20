"use client";

import { motion } from "framer-motion";
import { Settings2, Layers, Cpu, ShieldAlert } from "lucide-react";

export default function BuilderPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
            Phase 2 Feature
          </div>
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Settings2 className="w-8 h-8 text-primary" />
            System Builder
          </h1>
          <p className="text-muted-foreground text-lg">Drag-and-drop modules to design and test your own secure architecture.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md h-full flex flex-col">
              <h3 className="font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                <Layers className="w-4 h-4" /> Modules
              </h3>

              <div className="flex-1 space-y-2 overflow-y-auto pr-2">
                {['Camera Network', 'Armed Guards', 'Biometric Scanner', 'Motion Sensors', 'Reinforced Vault', 'Cyber Firewall'].map((mod, i) => (
                  <div key={i} className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-move transition-colors text-sm flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-gray-400" />
                    {mod}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas placeholder */}
          <div className="lg:col-span-3">
            <div className="w-full h-full rounded-2xl border-2 border-dashed border-white/20 bg-black/20 flex flex-col items-center justify-center text-muted-foreground relative overflow-hidden group">
              <ShieldAlert className="w-16 h-16 mb-4 opacity-20 group-hover:opacity-40 transition-opacity" />
              <p className="font-medium text-lg">Drag modules here to build your system</p>
              <p className="text-sm mt-2 opacity-60">Coming soon in Phase 2</p>

              {/* Decorative grid */}
              <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
