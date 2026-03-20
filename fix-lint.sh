cat << 'INNER_EOF' > src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
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

  async function fetchSystems() {
    setLoading(true);
    const { data, error } = await supabase.from("systems").select("id, name, slug, category, featured").order("created_at", { ascending: false });
    if (!error && data) {
      setSystems(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchSystems();
  }, []);

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
INNER_EOF

cat << 'INNER_EOF' > src/app/admin/settings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdminThemeStore } from "@/store/adminStore";

const THEMES = [
  { id: 'blue', name: 'Dark Blue', color: 'bg-blue-600' },
  { id: 'purple', name: 'Purple', color: 'bg-purple-600' },
  { id: 'emerald', name: 'Emerald', color: 'bg-emerald-600' },
  { id: 'orange', name: 'Orange', color: 'bg-orange-600' },
  { id: 'red', name: 'Red', color: 'bg-red-600' },
];

interface Announcement { id: string; message: string; active: boolean; }
interface Feature { id: string; name: string; enabled: boolean; }

export default function SettingsPage() {
  const { theme, setTheme } = useAdminThemeStore();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");

  const [features, setFeatures] = useState<Feature[]>([]);

  async function loadSettings() {
    const [announcementsRes, featuresRes] = await Promise.all([
      supabase.from('announcements').select('*').order('created_at', { ascending: false }),
      supabase.from('features').select('*')
    ]);

    if (announcementsRes.data) setAnnouncements(announcementsRes.data);
    if (featuresRes.data) setFeatures(featuresRes.data);
  }

  useEffect(() => {
    loadSettings();
  }, []);

  // Announcements
  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;
    const { data, error } = await supabase.from('announcements').insert([{ message: newAnnouncement, active: false }]).select().single();
    if (!error && data) {
      setAnnouncements([data, ...announcements]);
      setNewAnnouncement("");
    }
  };

  const toggleAnnouncement = async (id: string, current: boolean) => {
    const { error } = await supabase.from('announcements').update({ active: !current }).eq('id', id);
    if (!error) setAnnouncements(announcements.map(a => a.id === id ? { ...a, active: !current } : a));
  };

  const deleteAnnouncement = async (id: string) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (!error) setAnnouncements(announcements.filter(a => a.id !== id));
  };

  // Features
  const toggleFeature = async (id: string, current: boolean) => {
    const { error } = await supabase.from('features').update({ enabled: !current }).eq('id', id);
    if (!error) setFeatures(features.map(f => f.id === id ? { ...f, enabled: !current } : f));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-muted-foreground mt-1">Manage themes, features, and announcements.</p>
      </motion.div>

      {/* Theme Switcher */}
      <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">Admin Theme</h2>
          <p className="text-sm text-muted-foreground">Customize the appearance of your admin dashboard.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${theme === t.id ? 'border-white/50 bg-white/10' : 'border-white/10 hover:bg-white/5'}`}
            >
              <div className={`w-6 h-6 rounded-full ${t.color}`} />
              <span className="font-medium">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">Announcements</h2>
          <p className="text-sm text-muted-foreground">Global messages displayed to all users.</p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            placeholder="Type a new announcement..."
            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAddAnnouncement()}
          />
          <button onClick={handleAddAnnouncement} className="flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-colors">
            <PlusCircle className="w-5 h-5" /> Add
          </button>
        </div>

        <div className="space-y-3">
          {announcements.map((ann) => (
            <div key={ann.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
              <span className={ann.active ? 'text-white' : 'text-gray-500'}>{ann.message}</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleAnnouncement(ann.id, ann.active)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ann.active ? 'bg-blue-600' : 'bg-gray-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ann.active ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <button onClick={() => deleteAnnouncement(ann.id)} className="text-red-400 hover:text-red-300 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {announcements.length === 0 && <p className="text-sm text-muted-foreground italic">No announcements created yet.</p>}
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">Feature Toggles</h2>
          <p className="text-sm text-muted-foreground">Enable or disable platform features dynamically.</p>
        </div>

        <div className="space-y-3">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
              <span className="font-mono text-sm text-blue-300">{feature.name}</span>
              <button
                onClick={() => toggleFeature(feature.id, feature.enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${feature.enabled ? 'bg-green-600' : 'bg-gray-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${feature.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
INNER_EOF
