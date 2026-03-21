"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Edit3, Trash2, ShieldAlert, Star, StarOff, PlusCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SystemData {
  id: string;
  name: string;
  slug: string;
  category: string;
  featured: boolean;
}

export default function AdminPage() {
  const [systems, setSystems] = useState<SystemData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSystems = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("systems").select("id, name, slug, category, featured").order("created_at", { ascending: false });
    if (!error && data) {
      setSystems(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSystems();
  }, [fetchSystems]);

  async function toggleFeatured(id: string, currentStatus: boolean) {
    const { error } = await supabase.from("systems").update({ featured: !currentStatus }).eq("id", id);
    if (!error) {
      setSystems(systems.map(s => s.id === id ? { ...s, featured: !currentStatus } : s));
    }
  }

  async function deleteSystem(id: string) {
    if (confirm("Are you sure you want to delete this system?")) {
      const { error } = await supabase.from("systems").delete().eq("id", id);
      if (!error) {
        setSystems(systems.filter(s => s.id !== id));
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Systems Management</h1>
          <p className="text-muted-foreground mt-1">Create, edit, and organize secure environments.</p>
        </div>
        <Link href="/admin/systems/create" className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors">
          <PlusCircle className="w-4 h-4" /> New System
        </Link>
      </motion.div>

      <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading systems...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 font-medium text-muted-foreground">Name</th>
                <th className="p-4 font-medium text-muted-foreground">Category</th>
                <th className="p-4 font-medium text-muted-foreground text-center">Featured</th>
                <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {systems.map((sys) => (
                <tr key={sys.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-white">{sys.name}</div>
                        <div className="text-xs text-muted-foreground">/{sys.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-medium">{sys.category}</span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleFeatured(sys.id, sys.featured)}
                      className={`p-2 rounded-lg transition-colors ${sys.featured ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20' : 'text-gray-500 hover:bg-white/10'}`}
                      title={sys.featured ? "Unfeature" : "Feature"}
                    >
                      {sys.featured ? <Star className="w-5 h-5 fill-current" /> : <StarOff className="w-5 h-5" />}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/systems/${sys.id}/edit`} className="p-2 rounded-lg text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => deleteSystem(sys.id)} className="p-2 rounded-lg text-red-400 bg-red-400/10 hover:bg-red-400/20 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {systems.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No systems found. Create one to get started.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
