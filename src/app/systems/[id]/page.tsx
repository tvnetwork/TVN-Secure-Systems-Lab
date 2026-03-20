"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import { useSystemStore, SecuritySystem } from "@/store/systemStore";
import { SystemVisualizer } from "@/components/system/SystemVisualizer";
import { ControlPanel } from "@/components/system/ControlPanel";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function SystemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { setActiveSystem, activeSystem, resetSimulation } = useSystemStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSystem() {
      if (id) {
        // Try to fetch by slug first, fallback to id if it's a UUID
        const { data: system, error } = await supabase
          .from("systems")
          .select("*")
          .or(`slug.eq.${id},id.eq.${id}`)
          .limit(1)
          .single();

        if (error || !system) {
          console.error("Error fetching system:", error);
          notFound();
        } else {
          setActiveSystem(system as SecuritySystem);
        }
        setLoading(false);
      }
    }

    loadSystem();

    return () => {
      resetSimulation();
    };
  }, [id, setActiveSystem, resetSimulation]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center text-muted-foreground gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p>Initializing secure system environment...</p>
      </div>
    );
  }

  if (!activeSystem) {
      return null;
  }

  return (
    <main className="min-h-screen pt-20 px-4 flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto pb-6">
      <div className="flex-1 rounded-2xl border border-white/10 bg-black/40 overflow-hidden relative min-h-[60vh] lg:min-h-[80vh]">
        <SystemVisualizer system={activeSystem} />
      </div>
      <div className="w-full lg:w-[450px] flex-shrink-0">
        <ControlPanel system={activeSystem} />
      </div>
    </main>
  );
}
