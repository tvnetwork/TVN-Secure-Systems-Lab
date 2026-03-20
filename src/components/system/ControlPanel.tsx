"use client";

import { useSystemStore, SecuritySystem, LayerType } from "@/store/systemStore";
import { Shield, ShieldAlert, Zap, AlertTriangle, Fingerprint, Crosshair, Users } from "lucide-react";

export function ControlPanel({ system }: { system: SecuritySystem }) {
  const { activeLayers, toggleLayer, runSimulation, simulationResult, resetSimulation } = useSystemStore();

  const layerIcons = {
    perimeter: Shield,
    detection: Crosshair,
    access: Fingerprint,
    response: Zap,
    asset: ShieldAlert
  };

  const layers: { key: LayerType; label: string; desc: string }[] = [
    { key: "perimeter", label: "Perimeter", desc: "Physical outer defenses" },
    { key: "detection", label: "Surveillance", desc: "Sensors & intelligence" },
    { key: "access", label: "Access Control", desc: "Authentication & barriers" },
    { key: "response", label: "Response Units", desc: "Guards & automated actions" },
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-primary" />
          Layer Configuration: {system.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Toggle system components to test different security configurations.
        </p>

        <div className="space-y-4">
          {layers.map(({ key, label, desc }) => {
            const Icon = layerIcons[key];
            const isActive = activeLayers[key];
            const isFailed = simulationResult?.failedLayers.includes(key);

            return (
              <div
                key={key}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                  isFailed ? 'border-red-500/50 bg-red-500/10' :
                  isActive ? 'border-primary/50 bg-primary/5 hover:bg-primary/10' : 'border-white/5 bg-white/5 hover:bg-white/10 opacity-60'
                }`}
                onClick={() => {
                  toggleLayer(key);
                  if (simulationResult) resetSimulation();
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/20 text-primary' : 'bg-white/10 text-gray-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{label}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                </div>

                {/* Custom Toggle Switch */}
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isActive ? 'bg-primary' : 'bg-zinc-700'}`}>
                  <div className={`w-4 h-4 rounded-full bg-black transform transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md flex-1">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Attack Simulations
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Run stress tests against the current configuration.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => runSimulation('intrusion')}
            className="w-full flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-left group"
          >
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">Simulate Intrusion</div>
              <div className="text-xs text-muted-foreground">External brute-force attack</div>
            </div>
          </button>

          <button
            onClick={() => runSimulation('insider')}
            className="w-full flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-left group"
          >
            <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">Simulate Insider Threat</div>
              <div className="text-xs text-muted-foreground">Compromised authorized personnel</div>
            </div>
          </button>

          <button
            onClick={() => runSimulation('failure')}
            className="w-full flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-left group"
          >
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">Simulate System Failure</div>
              <div className="text-xs text-muted-foreground">Power loss / catastrophic failure</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
