"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function EditSystemPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "Vault System",
    description: "",
    difficulty: "Beginner",
    featured: false,
    layers: { perimeter: [], detection: [], access: [], response: [], asset: [] } as Record<string, string[]>
  });

  const [layerInputs, setLayerInputs] = useState({ perimeter: "", detection: "", access: "", response: "", asset: "" });

  useEffect(() => {
    async function loadSystem() {
      if (id) {
        const { data, error } = await supabase.from('systems').select('*').eq('id', id).single();
        if (error) {
          setError("Failed to load system data.");
        } else if (data) {
          setFormData({
            name: data.name,
            slug: data.slug,
            category: data.category,
            description: data.description,
            difficulty: data.difficulty,
            featured: data.featured,
            layers: data.layers as Record<string, string[]>
          });
        }
        setLoading(false);
      }
    }
    loadSystem();
  }, [id]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({ ...prev, name, slug: prev.slug === prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') ? slug : prev.slug }));
  };

  const addLayerItem = (layerType: keyof typeof layerInputs) => {
    const item = layerInputs[layerType].trim();
    if (item) {
      setFormData(prev => ({
        ...prev,
        layers: { ...prev.layers, [layerType]: [...prev.layers[layerType], item] }
      }));
      setLayerInputs(prev => ({ ...prev, [layerType]: "" }));
    }
  };

  const removeLayerItem = (layerType: keyof typeof layerInputs, index: number) => {
    setFormData(prev => ({
      ...prev,
      layers: { ...prev.layers, [layerType]: prev.layers[layerType].filter((_, i) => i !== index) }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { error } = await supabase.from('systems').update(formData).eq('id', id);

    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      router.push('/admin');
    }
  };

  if (loading) return <div className="p-8">Loading system details...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 rounded-xl border border-white/10 bg-black/40 hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit System: {formData.name}</h1>
          <p className="text-muted-foreground mt-1">Modify configuration and layers.</p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-6">
          <h2 className="text-xl font-semibold border-b border-white/10 pb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">System Name</label>
              <input required type="text" value={formData.name} onChange={handleNameChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">URL Slug</label>
              <input required type="text" value={formData.slug} onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <select value={formData.category} onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white [&>option]:bg-zinc-900">
                <option>Vault System</option>
                <option>Intelligence System</option>
                <option>Isolation System</option>
                <option>Preservation System</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Difficulty</label>
              <select value={formData.difficulty} onChange={e => setFormData(prev => ({ ...prev, difficulty: e.target.value }))} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white [&>option]:bg-zinc-900">
                <option>Beginner</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <textarea required rows={3} value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2 flex items-center gap-3 mt-2">
              <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))} className="w-5 h-5 rounded bg-black border-white/20 text-blue-500 focus:ring-blue-500" />
              <label htmlFor="featured" className="text-sm font-medium">Feature on Homepage</label>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-6">
          <h2 className="text-xl font-semibold border-b border-white/10 pb-4">Security Layers</h2>
          <div className="space-y-8">
            {(Object.keys(formData.layers) as Array<keyof typeof formData.layers>).map((layer) => (
              <div key={layer} className="p-4 rounded-xl border border-white/5 bg-white/5">
                <label className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-3 block">{layer}</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={layerInputs[layer as keyof typeof layerInputs]} onChange={e => setLayerInputs(prev => ({ ...prev, [layer]: e.target.value }))} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLayerItem(layer as keyof typeof layerInputs); } }} className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder={`Add item to ${layer}...`} />
                  <button type="button" onClick={() => addLayerItem(layer as keyof typeof layerInputs)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.layers[layer].map((item, idx) => (
                    <span key={idx} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs border border-blue-500/30">
                      {item}
                      <button type="button" onClick={() => removeLayerItem(layer as keyof typeof layerInputs, idx)} className="hover:text-red-400">&times;</button>
                    </span>
                  ))}
                  {formData.layers[layer].length === 0 && <span className="text-xs text-muted-foreground italic">No items added yet.</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin" className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 font-medium transition-colors">Cancel</Link>
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
            {saving ? "Saving..." : <><Save className="w-5 h-5" /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
}
