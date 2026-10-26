import fs from 'node:fs';
import path from 'node:path';

export interface PrinterSpec {
  name: string;
  slug: string;
  vendor: string;
  maxNozzleTempC: number;
  maxBedTempC: number;
  enclosed: boolean;
  extruderType: string;
  defaultNozzleMaterial: string;
  maxVolumetricFlowBaseline: number;
}

export interface FilamentSpec {
  name: string;
  slug: string;
  brand: string;
  materialType: string;
  minNozzleTempC: number;
  maxNozzleTempC: number;
  minBedTempC: number;
  maxBedTempC: number;
  volumetricFlowLimitMm3s: number;
  isAbrasive: boolean;
  isHygroscopic: boolean;
  requiresEnclosure: boolean;
}

export interface DeterministicMath {
  recommendedNozzleTempC: number;
  recommendedBedTempC: number;
  effectiveVolumetricFlowMm3s: number;
  calculatedMaxPrintSpeedMmS: number;
  requiresHardenedNozzleUpgrade: boolean;
  requiresFilamentDryer: boolean;
  enclosureWarning: boolean;
}

export interface SeedItem {
  slug: string;
  status: 'pending' | 'completed';
  printer: PrinterSpec;
  filament: FilamentSpec;
  deterministicMath: DeterministicMath;
}

export interface TroubleshootingItem {
  issue: string;
  rootCause: string;
  exactFix: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PageProfileData extends SeedItem {
  generatedAt?: string;
  compatibilityVerdict: 'Optimal Match' | 'Requires Upgrade' | 'Advanced Setup';
  heroSummary: string;
  retractionDistanceMm: number;
  retractionSpeedMmS: number;
  coolingFanMinPct: number;
  coolingFanMaxPct: number;
  firstLayerSpeedMmS: number;
  bedSurfaceRecommendation: string;
  slicerTweaks: string[];
  troubleshootingMatrix: TroubleshootingItem[];
  faq: FaqItem[];
}

export function loadAllSeeds(): SeedItem[] {
  const seedsPath = path.resolve(process.cwd(), 'data', 'seeds.json');
  if (!fs.existsSync(seedsPath)) return [];
  return JSON.parse(fs.readFileSync(seedsPath, 'utf-8')) as SeedItem[];
}

export function loadGeneratedPages(): PageProfileData[] {
  const pagesDir = path.resolve(process.cwd(), 'src', 'data', 'pages');
  if (!fs.existsSync(pagesDir)) return [];
  const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.json'));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(pagesDir, file), 'utf-8');
    return JSON.parse(raw) as PageProfileData;
  });
}

export function loadGeneratedSlugsSet(): Set<string> {
  const pages = loadGeneratedPages();
  return new Set(pages.map((p) => p.slug));
}
