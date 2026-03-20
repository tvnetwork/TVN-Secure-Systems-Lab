import { create } from 'zustand';

export type LayerType = 'perimeter' | 'detection' | 'access' | 'response' | 'asset';

export interface SystemLayers {
  perimeter: string[];
  detection: string[];
  access: string[];
  response: string[];
  asset: string[];
}

export interface SecuritySystem {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: 'Beginner' | 'Advanced';
  layers: SystemLayers;
}

interface SystemState {
  activeSystem: SecuritySystem | null;
  activeLayers: Record<LayerType, boolean>;
  simulationResult: {
    message: string;
    success: boolean;
    weaknessScore: number;
    failedLayers: LayerType[];
  } | null;
  setActiveSystem: (system: SecuritySystem) => void;
  toggleLayer: (layer: LayerType) => void;
  runSimulation: (type: 'intrusion' | 'insider' | 'failure') => void;
  resetSimulation: () => void;
}

export const useSystemStore = create<SystemState>((set, get) => ({
  activeSystem: null,
  activeLayers: {
    perimeter: true,
    detection: true,
    access: true,
    response: true,
    asset: true,
  },
  simulationResult: null,

  setActiveSystem: (system) => set({ activeSystem: system, simulationResult: null }),

  toggleLayer: (layer) => set((state) => ({
    activeLayers: {
      ...state.activeLayers,
      [layer]: !state.activeLayers[layer],
    }
  })),

  runSimulation: (type) => {
    const { activeLayers } = get();
    let success = true;
    let message = '';
    let weaknessScore = 0;
    const failedLayers: LayerType[] = [];

    // Basic simulation logic based on active layers
    if (type === 'intrusion') {
      if (!activeLayers.perimeter) {
        success = false;
        failedLayers.push('perimeter');
        weaknessScore += 40;
      }
      if (!activeLayers.detection) {
        success = false;
        failedLayers.push('detection');
        weaknessScore += 30;
      }
      if (!activeLayers.response) {
        success = false;
        failedLayers.push('response');
        weaknessScore += 30;
      }

      message = success ? 'Intrusion repelled. Perimeter and detection systems operational.' : 'Intrusion successful. Defense layers breached.';
    } else if (type === 'insider') {
      if (!activeLayers.access) {
        success = false;
        failedLayers.push('access');
        weaknessScore += 50;
      }
      if (!activeLayers.response) {
        success = false;
        failedLayers.push('response');
        weaknessScore += 50;
      }
      message = success ? 'Insider threat neutralized by strict access controls and rapid response.' : 'Insider threat successful. Access controls bypassed.';
    } else if (type === 'failure') {
      success = false;
      failedLayers.push('perimeter', 'detection', 'access', 'response');
      weaknessScore = 100;
      message = 'Catastrophic system failure. All systems down.';
    }

    if (success) {
      weaknessScore = 0;
    }

    set({
      simulationResult: {
        success,
        message,
        weaknessScore,
        failedLayers,
      }
    });
  },

  resetSimulation: () => set({ simulationResult: null }),
}));
