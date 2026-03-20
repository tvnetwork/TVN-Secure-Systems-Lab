"use client";

import { useEffect, use } from "react";
import { notFound } from "next/navigation";
import { useSystemStore, SecuritySystem } from "@/store/systemStore";
import { SystemVisualizer } from "@/components/system/SystemVisualizer";
import { ControlPanel } from "@/components/system/ControlPanel";

// Mock data (would be fetched from Supabase in a real app)
const systemDatabase: Record<string, SecuritySystem> = {
  "fort-knox": {
    id: "fort-knox",
    name: "Fort Knox",
    category: "Vault System",
    description: "The United States Bullion Depository.",
    difficulty: "Beginner",
    layers: {
      perimeter: ["fences", "armed patrol", "minefields"],
      detection: ["cameras", "motion sensors", "laser tripwires"],
      access: ["vault door", "multi-person authentication", "biometrics"],
      response: ["military response", "lockdown sequence"],
      asset: ["gold reserves"]
    }
  },
  "cia": {
    id: "cia",
    name: "CIA Headquarters",
    category: "Intelligence System",
    description: "George Bush Center for Intelligence.",
    difficulty: "Advanced",
    layers: {
      perimeter: ["cybersecurity", "classified access", "physical barricades"],
      detection: ["global surveillance", "signals intelligence", "insider threat monitoring"],
      access: ["clearance levels", "polygraph", "SCIFs"],
      response: ["covert operations", "rapid response teams", "data purge"],
      asset: ["intelligence data", "classified sources"]
    }
  }
};

export default function SystemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { setActiveSystem, activeSystem, resetSimulation } = useSystemStore();

  useEffect(() => {
    if (id) {
      const system = systemDatabase[id];
      if (system) {
        setActiveSystem(system);
      } else {
        notFound();
      }
    }

    return () => {
      resetSimulation();
    };
  }, [id, setActiveSystem, resetSimulation]);

  if (!activeSystem) {
    return <div className="min-h-screen pt-24 px-4 flex items-center justify-center">Loading system data...</div>;
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
