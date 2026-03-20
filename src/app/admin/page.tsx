"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Edit3, Settings, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SystemData {
  name: string;
}

export default function AdminPage() {
  const [systems, setSystems] = useState<SystemData[]>([]);

  useEffect(() => {
    async function loadSystems() {
      const { data, error } = await supabase.from("systems").select("name");
      if (error) {
        console.error("Error fetching systems:", error);
      } else {
        setSystems((data as SystemData[]) || []);
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
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Manage systems, upload assets, and control platform settings.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">System Database</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  <PlusCircle className="w-4 h-4" /> Add New System
                </button>
              </div>

              <div className="space-y-4">
                {systems.map((sys, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{sys.name}</span>
                    </div>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  Upload Visual Assets
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  Manage Featured Systems
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  System Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
