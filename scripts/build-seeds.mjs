#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SEEDS_FILE = path.join(ROOT_DIR, 'data', 'seeds.json');
const PAGES_DIR = path.join(ROOT_DIR, 'src', 'data', 'pages');

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/\+/g, '-plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

// ---------------------------------------------------------------------------
// 1. BUILT-IN ENGINEERING-ACCURATE DATASET (25 Printers × 40 Filaments)
// ---------------------------------------------------------------------------
const BUILTIN_PRINTERS = [
  {
    name: 'Bambu Lab P1S',
    slug: 'bambu-lab-p1s',
    vendor: 'Bambu Lab',
    maxNozzleTempC: 300,
    maxBedTempC: 100,
    enclosed: true,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Stainless Steel',
    maxVolumetricFlowBaseline: 24,
  },
  {
    name: 'Bambu Lab A1',
    slug: 'bambu-lab-a1',
    vendor: 'Bambu Lab',
    maxNozzleTempC: 300,
    maxBedTempC: 100,
    enclosed: false,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Stainless Steel',
    maxVolumetricFlowBaseline: 24,
  },
  {
    name: 'Bambu Lab X1C',
    slug: 'bambu-lab-x1c',
    vendor: 'Bambu Lab',
    maxNozzleTempC: 300,
    maxBedTempC: 110,
    enclosed: true,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Hardened Steel',
    maxVolumetricFlowBaseline: 26,
  },
  {
    name: 'Bambu Lab A1 Mini',
    slug: 'bambu-lab-a1-mini',
    vendor: 'Bambu Lab',
    maxNozzleTempC: 300,
    maxBedTempC: 80,
    enclosed: false,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Stainless Steel',
    maxVolumetricFlowBaseline: 24,
  },
  {
    name: 'Bambu Lab P1P',
    slug: 'bambu-lab-p1p',
    vendor: 'Bambu Lab',
    maxNozzleTempC: 300,
    maxBedTempC: 100,
    enclosed: false,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Stainless Steel',
    maxVolumetricFlowBaseline: 24,
  },
  {
    name: 'Creality K1 Max',
    slug: 'creality-k1-max',
    vendor: 'Creality',
    maxNozzleTempC: 300,
    maxBedTempC: 100,
    enclosed: true,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Hardened Steel',
    maxVolumetricFlowBaseline: 28,
  },
  {
    name: 'Creality K1C',
    slug: 'creality-k1c',
    vendor: 'Creality',
    maxNozzleTempC: 300,
    maxBedTempC: 100,
    enclosed: true,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Hardened Steel',
    maxVolumetricFlowBaseline: 26,
  },
  {
    name: 'Creality Ender 3 V3 SE',
    slug: 'creality-ender-3-v3-se',
    vendor: 'Creality',
    maxNozzleTempC: 260,
    maxBedTempC: 100,
    enclosed: false,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Brass',
    maxVolumetricFlowBaseline: 15,
  },
  {
    name: 'Creality Ender 3 V3 KE',
    slug: 'creality-ender-3-v3-ke',
    vendor: 'Creality',
    maxNozzleTempC: 300,
    maxBedTempC: 100,
    enclosed: false,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Brass',
    maxVolumetricFlowBaseline: 22,
  },
  {
    name: 'Creality K2 Plus',
    slug: 'creality-k2-plus',
    vendor: 'Creality',
    maxNozzleTempC: 350,
    maxBedTempC: 120,
    enclosed: true,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Hardened Steel',
    maxVolumetricFlowBaseline: 32,
  },
  {
    name: 'Prusa MK4S',
    slug: 'prusa-mk4s',
    vendor: 'Prusa Research',
    maxNozzleTempC: 290,
    maxBedTempC: 120,
    enclosed: false,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Brass',
    maxVolumetricFlowBaseline: 27,
  },
  {
    name: 'Prusa CORE One',
    slug: 'prusa-core-one',
    vendor: 'Prusa Research',
    maxNozzleTempC: 290,
    maxBedTempC: 120,
    enclosed: true,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Brass',
    maxVolumetricFlowBaseline: 28,
  },
  {
    name: 'Prusa XL',
    slug: 'prusa-xl',
    vendor: 'Prusa Research',
    maxNozzleTempC: 290,
    maxBedTempC: 120,
    enclosed: false,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Brass',
    maxVolumetricFlowBaseline: 24,
  },
  {
    name: 'Qidi Plus 4',
    slug: 'qidi-plus-4',
    vendor: 'Qidi Tech',
    maxNozzleTempC: 370,
    maxBedTempC: 120,
    enclosed: true,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Hardened Steel',
    maxVolumetricFlowBaseline: 30,
  },
  {
    name: 'Qidi Q1 Pro',
    slug: 'qidi-q1-pro',
    vendor: 'Qidi Tech',
    maxNozzleTempC: 350,
    maxBedTempC: 120,
    enclosed: true,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Hardened Steel',
    maxVolumetricFlowBaseline: 28,
  },
  {
    name: 'Anycubic Kobra 3',
    slug: 'anycubic-kobra-3',
    vendor: 'Anycubic',
    maxNozzleTempC: 300,
    maxBedTempC: 110,
    enclosed: false,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Brass',
    maxVolumetricFlowBaseline: 24,
  },
  {
    name: 'Anycubic Kobra S1',
    slug: 'anycubic-kobra-s1',
    vendor: 'Anycubic',
    maxNozzleTempC: 320,
    maxBedTempC: 120,
    enclosed: true,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Hardened Steel',
    maxVolumetricFlowBaseline: 26,
  },
  {
    name: 'Elegoo Neptune 4 Pro',
    slug: 'elegoo-neptune-4-pro',
    vendor: 'Elegoo',
    maxNozzleTempC: 300,
    maxBedTempC: 110,
    enclosed: false,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Brass',
    maxVolumetricFlowBaseline: 22,
  },
  {
    name: 'Elegoo Neptune 4 Max',
    slug: 'elegoo-neptune-4-max',
    vendor: 'Elegoo',
    maxNozzleTempC: 300,
    maxBedTempC: 85,
    enclosed: false,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Brass',
    maxVolumetricFlowBaseline: 22,
  },
  {
    name: 'Elegoo Centauri Carbon',
    slug: 'elegoo-centauri-carbon',
    vendor: 'Elegoo',
    maxNozzleTempC: 320,
    maxBedTempC: 110,
    enclosed: true,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Hardened Steel',
    maxVolumetricFlowBaseline: 28,
  },
  {
    name: 'Voron 2.4',
    slug: 'voron-2-4',
    vendor: 'Voron Design',
    maxNozzleTempC: 300,
    maxBedTempC: 115,
    enclosed: true,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Hardened Steel',
    maxVolumetricFlowBaseline: 28,
  },
  {
    name: 'Voron Trident',
    slug: 'voron-trident',
    vendor: 'Voron Design',
    maxNozzleTempC: 300,
    maxBedTempC: 115,
    enclosed: true,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Hardened Steel',
    maxVolumetricFlowBaseline: 28,
  },
  {
    name: 'FlashForge Adventurer 5M Pro',
    slug: 'flashforge-adventurer-5m-pro',
    vendor: 'FlashForge',
    maxNozzleTempC: 280,
    maxBedTempC: 110,
    enclosed: true,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Stainless Steel',
    maxVolumetricFlowBaseline: 24,
  },
  {
    name: 'Sovol SV08',
    slug: 'sovol-sv08',
    vendor: 'Sovol',
    maxNozzleTempC: 300,
    maxBedTempC: 100,
    enclosed: false,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Brass',
    maxVolumetricFlowBaseline: 26,
  },
  {
    name: 'FLSUN T1 Pro',
    slug: 'flsun-t1-pro',
    vendor: 'FLSUN',
    maxNozzleTempC: 300,
    maxBedTempC: 110,
    enclosed: true,
    extruderType: 'Direct Drive',
    defaultNozzleMaterial: 'Hardened Steel',
    maxVolumetricFlowBaseline: 34,
  },
];

const BUILTIN_FILAMENTS = [
  {
    name: 'Polymaker PolyLite PETG',
    slug: 'polymaker-polylite-petg',
    brand: 'Polymaker',
    materialType: 'PETG',
    minNozzleTempC: 230,
    maxNozzleTempC: 250,
    minBedTempC: 70,
    maxBedTempC: 80,
    volumetricFlowLimitMm3s: 14,
    isAbrasive: false,
    isHygroscopic: true,
    requiresEnclosure: false,
  },
  {
    name: 'Polymaker PolyTerra PLA',
    slug: 'polymaker-polyterra-pla',
    brand: 'Polymaker',
    materialType: 'PLA',
    minNozzleTempC: 195,
    maxNozzleTempC: 225,
    minBedTempC: 50,
    maxBedTempC: 60,
    volumetricFlowLimitMm3s: 21,
    isAbrasive: false,
    isHygroscopic: false,
    requiresEnclosure: false,
  },
  {
    name: 'eSUN PLA+',
    slug: 'esun-pla-plus',
    brand: 'eSUN',
    materialType: 'PLA+',
    minNozzleTempC: 205,
    maxNozzleTempC: 225,
    minBedTempC: 55,
    maxBedTempC: 65,
    volumetricFlowLimitMm3s: 22,
    isAbrasive: false,
    isHygroscopic: false,
    requiresEnclosure: false,
  },
  {
    name: 'Bambu PLA-CF',
    slug: 'bambu-pla-cf',
    brand: 'Bambu Lab',
    materialType: 'PLA-CF',
    minNozzleTempC: 210,
    maxNozzleTempC: 240,
    minBedTempC: 45,
    maxBedTempC: 65,
    volumetricFlowLimitMm3s: 16,
    isAbrasive: true,
    isHygroscopic: true,
    requiresEnclosure: false,
  },
  {
    name: 'Overture TPU 95A',
    slug: 'overture-tpu-95a',
    brand: 'Overture',
    materialType: 'TPU',
    minNozzleTempC: 215,
    maxNozzleTempC: 235,
    minBedTempC: 40,
    maxBedTempC: 60,
    volumetricFlowLimitMm3s: 4.5,
    isAbrasive: false,
    isHygroscopic: true,
    requiresEnclosure: false,
  },
  {
    name: 'Sunlu PETG',
    slug: 'sunlu-petg',
    brand: 'Sunlu',
    materialType: 'PETG',
    minNozzleTempC: 230,
    maxNozzleTempC: 250,
    minBedTempC: 70,
    maxBedTempC: 85,
    volumetricFlowLimitMm3s: 15,
    isAbrasive: false,
    isHygroscopic: true,
    requiresEnclosure: false,
  },
  {
    name: 'Eryone Silk PLA',
    slug: 'eryone-silk-pla',
    brand: 'Eryone',
    materialType: 'Silk PLA',
    minNozzleTempC: 205,
    maxNozzleTempC: 225,
    minBedTempC: 55,
    maxBedTempC: 65,
    volumetricFlowLimitMm3s: 12,
    isAbrasive: false,
    isHygroscopic: false,
    requiresEnclosure: false,
  },
  {
    name: 'Polymaker PA6-CF',
    slug: 'polymaker-pa6-cf',
    brand: 'Polymaker',
    materialType: 'PA6-CF',
    minNozzleTempC: 280,
    maxNozzleTempC: 300,
    minBedTempC: 40,
    maxBedTempC: 50,
    volumetricFlowLimitMm3s: 11,
    isAbrasive: true,
    isHygroscopic: true,
    requiresEnclosure: true,
  },
  {
    name: 'Prusament PC Blend',
    slug: 'prusament-pc-blend',
    brand: 'Prusament',
    materialType: 'PC',
    minNozzleTempC: 265,
    maxNozzleTempC: 285,
    minBedTempC: 105,
    maxBedTempC: 115,
    volumetricFlowLimitMm3s: 12,
    isAbrasive: false,
    isHygroscopic: true,
    requiresEnclosure: true,
  },
  {
    name: 'Sainsmart Glow TPU',
    slug: 'sainsmart-glow-tpu',
    brand: 'SainSmart',
    materialType: 'Glow TPU',
    minNozzleTempC: 215,
    maxNozzleTempC: 230,
    minBedTempC: 45,
    maxBedTempC: 60,
    volumetricFlowLimitMm3s: 4.0,
    isAbrasive: true,
    isHygroscopic: true,
    requiresEnclosure: false,
  },
  {
    name: 'Siraya Tech ABS-GF',
    slug: 'siraya-tech-abs-gf',
    brand: 'Siraya Tech',
    materialType: 'ABS-GF',
    minNozzleTempC: 250,
    maxNozzleTempC: 270,
    minBedTempC: 95,
    maxBedTempC: 110,
    volumetricFlowLimitMm3s: 15,
    isAbrasive: true,
    isHygroscopic: true,
    requiresEnclosure: true,
  },
  {
    name: 'Polymaker PolyLite ASA',
    slug: 'polymaker-polylite-asa',
    brand: 'Polymaker',
    materialType: 'ASA',
    minNozzleTempC: 240,
    maxNozzleTempC: 260,
    minBedTempC: 90,
    maxBedTempC: 105,
    volumetricFlowLimitMm3s: 17,
    isAbrasive: false,
    isHygroscopic: true,
    requiresEnclosure: true,
  },
  {
    name: 'Polymaker PolyLite ABS',
    slug: 'polymaker-polylite-abs',
    brand: 'Polymaker',
    materialType: 'ABS',
    minNozzleTempC: 245,
    maxNozzleTempC: 265,
    minBedTempC: 90,
    maxBedTempC: 105,
    volumetricFlowLimitMm3s: 18,
    isAbrasive: false,
    isHygroscopic: true,
    requiresEnclosure: true,
  },
  {
    name: 'Polymaker PolyMax PETG',
    slug: 'polymaker-polymax-petg',
    brand: 'Polymaker',
    materialType: 'PETG',
    minNozzleTempC: 235,
    maxNozzleTempC: 250,
    minBedTempC: 70,
    maxBedTempC: 80,
    volumetricFlowLimitMm3s: 14,
    isAbrasive: false,
    isHygroscopic: true,
    requiresEnclosure: false,
  },
  {
    name: 'Polymaker Fiberon PA612-CF15',
    slug: 'polymaker-fiberon-pa612-cf15',
    brand: 'Polymaker',
    materialType: 'PA612-CF',
    minNozzleTempC: 275,
    maxNozzleTempC: 295,
    minBedTempC: 45,
    maxBedTempC: 55,
    volumetricFlowLimitMm3s: 12,
    isAbrasive: true,
    isHygroscopic: true,
    requiresEnclosure: true,
  },
  {
    name: 'Bambu PETG HF',
    slug: 'bambu-petg-hf',
    brand: 'Bambu Lab',
    materialType: 'PETG',
    minNozzleTempC: 230,
    maxNozzleTempC: 260,
    minBedTempC: 65,
    maxBedTempC: 75,
    volumetricFlowLimitMm3s: 21,
    isAbrasive: false,
    isHygroscopic: true,
    requiresEnclosure: false,
  },
  {
    name: 'Bambu PETG-CF',
    slug: 'bambu-petg-cf',
    brand: 'Bambu Lab',
    materialType: 'PETG-CF',
    minNozzleTempC: 240,
    maxNozzleTempC: 270,
    minBedTempC: 65,
    maxBedTempC: 80,
    volumetricFlowLimitMm3s: 15,
    isAbrasive: true,
    isHygroscopic: true,
    requiresEnclosure: false,
  },
  {
    name: 'Bambu PAHT-CF',
    slug: 'bambu-paht-cf',
    brand: 'Bambu Lab',
    materialType: 'PAHT-CF',
    minNozzleTempC: 275,
    maxNozzleTempC: 295,
    minBedTempC: 90,
    maxBedTempC: 105,
    volumetricFlowLimitMm3s: 11,
    isAbrasive: true,
    isHygroscopic: true,
    requiresEnclosure: true,
  },
  {
    name: 'Bambu ASA-CF',
    slug: 'bambu-asa-cf',
    brand: 'Bambu Lab',
    materialType: 'ASA-CF',
    minNozzleTempC: 255,
    maxNozzleTempC: 280,
    minBedTempC: 90,
    maxBedTempC: 105,
    volumetricFlowLimitMm3s: 15,
    isAbrasive: true,
    isHygroscopic: true,
    requiresEnclosure: true,
  },
  {
    name: 'eSUN PETG',
    slug: 'esun-petg',
    brand: 'eSUN',
    materialType: 'PETG',
    minNozzleTempC: 230,
    maxNozzleTempC: 250,
    minBedTempC: 70,
    maxBedTempC: 85,
    volumetricFlowLimitMm3s: 14,
    isAbrasive: false,
    isHygroscopic: true,
    requiresEnclosure: false,
  },
  {
    name: 'eSUN ABS+',
    slug: 'esun-abs-plus',
    brand: 'eSUN',
    materialType: 'ABS+',
    minNozzleTempC: 240,
    maxNozzleTempC: 260,
    minBedTempC: 90,
    maxBedTempC: 105,
    volumetricFlowLimitMm3s: 18,
    isAbrasive: false,
    isHygroscopic: true,
    requiresEnclosure: true,
  },
  {
    name: 'eSUN ePA-CF',
    slug: 'esun-epa-cf',
    brand: 'eSUN',
    materialType: 'PA-CF',
    minNozzleTempC: 265,
    maxNozzleTempC: 285,
    minBedTempC: 75,
    maxBedTempC: 90,
    volumetricFlowLimitMm3s: 11,
    isAbrasive: true,
    isHygroscopic: true,
    requiresEnclosure: true,
  },
  {
    name: 'eSUN eTPU-95A',
    slug: 'esun-etpu-95a',
    brand: 'eSUN',
    materialType: 'TPU',
    minNozzleTempC: 210,
    maxNozzleTempC: 230,
    minBedTempC: 45,
    maxBedTempC: 60,
    volumetricFlowLimitMm3s: 4.5,
    isAbrasive: false,
    isHygroscopic: true,
    requiresEnclosure: false,
  },
  {
    name: 'Overture PLA Professional',
    slug: 'overture-pla-professional',
    brand: 'Overture',
    materialType: 'PLA+',
    minNozzleTempC: 200,
    maxNozzleTempC: 220,
    minBedTempC: 50,
    maxBedTempC: 65,
    volumetricFlowLimitMm3s: 21,
    isAbrasive: false,
    isHygroscopic: false,
    requiresEnclosure: false,
  },
  {
    name: 'Overture PETG',
    slug: 'overture-petg',
    brand: 'Overture',
    materialType: 'PETG',
    minNozzleTempC: 230,
    maxNozzleTempC: 250,
    minBedTempC: 75,
    maxBedTempC: 85,
    volumetricFlowLimitMm3s: 14,
    isAbrasive: false,
    isHygroscopic: true,
    requiresEnclosure: false,
  },
  {
    name: 'Overture Rock PLA',
    slug: 'overture-rock-pla',
    brand: 'Overture',
    materialType: 'Matte PLA',
    minNozzleTempC: 195,
    maxNozzleTempC: 220,
    minBedTempC: 50,
    maxBedTempC: 60,
    volumetricFlowLimitMm3s: 16,
    isAbrasive: true,
    isHygroscopic: false,
    requiresEnclosure: false,
  },
  {
    name: 'Sunlu PLA+ 2.0',
    slug: 'sunlu-pla-plus-2-0',
    brand: 'Sunlu',
    materialType: 'PLA+',
    minNozzleTempC: 205,
    maxNozzleTempC: 230,
    minBedTempC: 55,
    maxBedTempC: 65,
    volumetricFlowLimitMm3s: 24,
    isAbrasive: false,
    isHygroscopic: false,
    requiresEnclosure: false,
  },
  {
    name: 'Sunlu High Speed PLA',
    slug: 'sunlu-high-speed-pla',
    brand: 'Sunlu',
    materialType: 'HS-PLA',
    minNozzleTempC: 210,
    maxNozzleTempC: 235,
    minBedTempC: 55,
    maxBedTempC: 65,
    volumetricFlowLimitMm3s: 26,
    isAbrasive: false,
    isHygroscopic: false,
    requiresEnclosure: false,
  },
  {
    name: 'Sunlu ASA',
    slug: 'sunlu-asa',
    brand: 'Sunlu',
    materialType: 'ASA',
    minNozzleTempC: 245,
    maxNozzleTempC: 265,
    minBedTempC: 90,
    maxBedTempC: 105,
    volumetricFlowLimitMm3s: 17,
    isAbrasive: false,
    isHygroscopic: true,
    requiresEnclosure: true,
  },
  {
    name: 'Prusament PLA',
    slug: 'prusament-pla',
    brand: 'Prusament',
    materialType: 'PLA',
    minNozzleTempC: 205,
    maxNozzleTempC: 220,
    minBedTempC: 55,
    maxBedTempC: 60,
    volumetricFlowLimitMm3s: 20,
    isAbrasive: false,
    isHygroscopic: false,
    requiresEnclosure: false,
  },
  {
    name: 'Prusament PETG',
    slug: 'prusament-petg',
    brand: 'Prusament',
    materialType: 'PETG',
    minNozzleTempC: 240,
    maxNozzleTempC: 255,
    minBedTempC: 75,
    maxBedTempC: 90,
    volumetricFlowLimitMm3s: 15,
    isAbrasive: false,
    isHygroscopic: true,
    requiresEnclosure: false,
  },
  {
    name: 'Hatchbox PLA',
    slug: 'hatchbox-pla',
    brand: 'Hatchbox',
    materialType: 'PLA',
    minNozzleTempC: 195,
    maxNozzleTempC: 215,
    minBedTempC: 50,
    maxBedTempC: 60,
    volumetricFlowLimitMm3s: 19,
    isAbrasive: false,
    isHygroscopic: false,
    requiresEnclosure: false,
  },
  {
    name: 'Hatchbox PETG',
    slug: 'hatchbox-petg',
    brand: 'Hatchbox',
    materialType: 'PETG',
    minNozzleTempC: 230,
    maxNozzleTempC: 245,
    minBedTempC: 70,
    maxBedTempC: 85,
    volumetricFlowLimitMm3s: 14,
    isAbrasive: false,
    isHygroscopic: true,
    requiresEnclosure: false,
  },
  {
    name: 'Hatchbox Wood PLA',
    slug: 'hatchbox-wood-pla',
    brand: 'Hatchbox',
    materialType: 'Wood PLA',
    minNozzleTempC: 195,
    maxNozzleTempC: 220,
    minBedTempC: 50,
    maxBedTempC: 60,
    volumetricFlowLimitMm3s: 11,
    isAbrasive: true,
    isHygroscopic: true,
    requiresEnclosure: false,
  },
  {
    name: 'Elegoo Rapid PLA+',
    slug: 'elegoo-rapid-pla-plus',
    brand: 'Elegoo',
    materialType: 'HS-PLA+',
    minNozzleTempC: 210,
    maxNozzleTempC: 230,
    minBedTempC: 55,
    maxBedTempC: 65,
    volumetricFlowLimitMm3s: 25,
    isAbrasive: false,
    isHygroscopic: false,
    requiresEnclosure: false,
  },
  {
    name: 'Elegoo Rapid PETG',
    slug: 'elegoo-rapid-petg',
    brand: 'Elegoo',
    materialType: 'PETG',
    minNozzleTempC: 230,
    maxNozzleTempC: 255,
    minBedTempC: 70,
    maxBedTempC: 85,
    volumetricFlowLimitMm3s: 20,
    isAbrasive: false,
    isHygroscopic: true,
    requiresEnclosure: false,
  },
  {
    name: 'Amolen Glow in the Dark PLA',
    slug: 'amolen-glow-in-the-dark-pla',
    brand: 'Amolen',
    materialType: 'Glow PLA',
    minNozzleTempC: 205,
    maxNozzleTempC: 225,
    minBedTempC: 55,
    maxBedTempC: 65,
    volumetricFlowLimitMm3s: 14,
    isAbrasive: true,
    isHygroscopic: true,
    requiresEnclosure: false,
  },
  {
    name: 'Proto-pasta High Temp Carbon Fiber PLA',
    slug: 'proto-pasta-high-temp-carbon-fiber-pla',
    brand: 'Proto-pasta',
    materialType: 'PLA-CF',
    minNozzleTempC: 210,
    maxNozzleTempC: 230,
    minBedTempC: 55,
    maxBedTempC: 65,
    volumetricFlowLimitMm3s: 13,
    isAbrasive: true,
    isHygroscopic: true,
    requiresEnclosure: false,
  },
  {
    name: 'ColorFabb XT-CF20',
    slug: 'colorfabb-xt-cf20',
    brand: 'ColorFabb',
    materialType: 'PETG-CF',
    minNozzleTempC: 245,
    maxNozzleTempC: 265,
    minBedTempC: 70,
    maxBedTempC: 80,
    volumetricFlowLimitMm3s: 12,
    isAbrasive: true,
    isHygroscopic: true,
    requiresEnclosure: false,
  },
  {
    name: 'NinjaTek NinjaFlex 85A',
    slug: 'ninjatek-ninjaflex-85a',
    brand: 'NinjaTek',
    materialType: 'TPU 85A',
    minNozzleTempC: 225,
    maxNozzleTempC: 240,
    minBedTempC: 40,
    maxBedTempC: 55,
    volumetricFlowLimitMm3s: 2.8,
    isAbrasive: false,
    isHygroscopic: true,
    requiresEnclosure: false,
  },
];

// ---------------------------------------------------------------------------
// 2. ORCASLICER REPO PARSER MODE (If ORCASLICER_PATH is passed)
// ---------------------------------------------------------------------------
function readAllJsonFilesRecursively(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...readAllJsonFilesRecursively(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      try {
        const raw = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        results.push({ fullPath, data: raw });
      } catch {
        // Ignore non-profile or malformed JSON files
      }
    }
  }
  return results;
}

function resolveInherits(item, byNameMap, visited = new Set()) {
  if (!item.inherits || visited.has(item.inherits)) return item;
  visited.add(item.inherits);
  const parent = byNameMap.get(item.inherits);
  if (!parent) return item;
  const resolvedParent = resolveInherits(parent, byNameMap, visited);
  return { ...resolvedParent, ...item };
}

function parseOrcaSlicerProfiles(orcaPath) {
  console.log(`[OrcaSlicer Mode] Scanning profiles directory: ${orcaPath}`);
  const allJson = readAllJsonFilesRecursively(orcaPath);
  const byName = new Map();
  for (const { data } of allJson) {
    if (data && data.name) {
      byName.set(data.name, data);
    }
  }

  const printers = [];
  const filaments = [];

  for (const { data } of allJson) {
    if (!data || !data.type || data.instantiation === 'false') continue;
    const resolved = resolveInherits(data, byName);

    if (resolved.type === 'machine_model') {
      const name = resolved.name;
      const vendor = resolved.family || resolved.vendor || name.split(' ')[0] || 'Generic';
      const nozzleMat = String(resolved.nozzle_type || 'Brass').toLowerCase().includes('hardened')
        ? 'Hardened Steel'
        : 'Brass';
      printers.push({
        name,
        slug: slugify(name),
        vendor,
        maxNozzleTempC: Number(Array.isArray(resolved.nozzle_temperature_range_high) ? resolved.nozzle_temperature_range_high[0] : 300) || 300,
        maxBedTempC: Number(Array.isArray(resolved.bed_temperature_range_high) ? resolved.bed_temperature_range_high[0] : 110) || 110,
        enclosed: Boolean(resolved.machine_enclosed || /x1|p1s|k1|voron|plus 4|adventurer/i.test(name)),
        extruderType: resolved.extruder_type || 'Direct Drive',
        defaultNozzleMaterial: nozzleMat,
        maxVolumetricFlowBaseline: 24,
      });
    } else if (resolved.type === 'filament') {
      const name = resolved.name.replace(/@.*$/, '').trim();
      if (!name || name.toLowerCase().includes('generic')) continue;
      const mat = Array.isArray(resolved.filament_type) ? resolved.filament_type[0] : (resolved.filament_type || 'PLA');
      const minNoz = Number(Array.isArray(resolved.nozzle_temperature_range_low) ? resolved.nozzle_temperature_range_low[0] : 200) || 200;
      const maxNoz = Number(Array.isArray(resolved.nozzle_temperature_range_high) ? resolved.nozzle_temperature_range_high[0] : 230) || 230;
      const bedTemp = Number(Array.isArray(resolved.hot_plate_temp) ? resolved.hot_plate_temp[0] : 60) || 60;
      const vFlow = Number(Array.isArray(resolved.filament_max_volumetric_speed) ? resolved.filament_max_volumetric_speed[0] : 15) || 15;
      const isAbrasive = /cf|gf|glow|wood|metal|carbon|glass/i.test(name) || /cf|gf/i.test(mat);
      const isHygroscopic = /petg|pa|nylon|pc|tpu|abs|asa|cf|gf|pva/i.test(mat);
      const requiresEnclosure = /abs|asa|pc|pa|nylon/i.test(mat);

      filaments.push({
        name,
        slug: slugify(name),
        brand: resolved.filament_vendor || name.split(' ')[0] || 'Brand',
        materialType: String(mat),
        minNozzleTempC: minNoz,
        maxNozzleTempC: maxNoz,
        minBedTempC: Math.max(35, bedTemp - 5),
        maxBedTempC: bedTemp + 5,
        volumetricFlowLimitMm3s: vFlow,
        isAbrasive,
        isHygroscopic,
        requiresEnclosure,
      });
    }
  }

  // Deduplicate by slug
  const uniquePrinters = Array.from(new Map(printers.map((p) => [p.slug, p])).values());
  const uniqueFilaments = Array.from(new Map(filaments.map((f) => [f.slug, f])).values());

  if (uniquePrinters.length > 0 && uniqueFilaments.length > 0) {
    console.log(`[OrcaSlicer Mode] Resolved ${uniquePrinters.length} printers and ${uniqueFilaments.length} filaments.`);
    return { printers: uniquePrinters, filaments: uniqueFilaments };
  }

  console.warn('[OrcaSlicer Mode] Insufficient profiles found in path, falling back to Instant Bootstrap dataset.');
  return { printers: BUILTIN_PRINTERS, filaments: BUILTIN_FILAMENTS };
}

// ---------------------------------------------------------------------------
// 3. DETERMINISTIC ENGINEERING MATH
// ---------------------------------------------------------------------------
export function computeDeterministicMath(printer, filament) {
  const midpointNozzle = Math.round((filament.minNozzleTempC + filament.maxNozzleTempC) / 2);
  const recommendedNozzleTempC = Math.min(midpointNozzle, printer.maxNozzleTempC);

  const midpointBed = Math.round((filament.minBedTempC + filament.maxBedTempC) / 2);
  const recommendedBedTempC = Math.min(midpointBed, printer.maxBedTempC);

  const effectiveVolumetricFlowMm3s = Number(
    Math.min(printer.maxVolumetricFlowBaseline, filament.volumetricFlowLimitMm3s).toFixed(1)
  );

  // Standard 0.4mm nozzle at 0.20mm layer height and 0.42mm line width
  const calculatedMaxPrintSpeedMmS = Math.round(effectiveVolumetricFlowMm3s / (0.20 * 0.42));

  const requiresHardenedNozzleUpgrade = Boolean(
    filament.isAbrasive && printer.defaultNozzleMaterial !== 'Hardened Steel'
  );
  const requiresFilamentDryer = Boolean(filament.isHygroscopic);
  const enclosureWarning = Boolean(filament.requiresEnclosure && !printer.enclosed);

  return {
    recommendedNozzleTempC,
    recommendedBedTempC,
    effectiveVolumetricFlowMm3s,
    calculatedMaxPrintSpeedMmS,
    requiresHardenedNozzleUpgrade,
    requiresFilamentDryer,
    enclosureWarning,
  };
}

// ---------------------------------------------------------------------------
// 4. PRE-GENERATED SAMPLE PAGES (3 rich engineering profiles out-of-the-box)
// ---------------------------------------------------------------------------
function getSampleGeneratedPayload(seed) {
  const { slug, printer, filament, deterministicMath } = seed;

  if (slug === 'bambu-lab-p1s-polymaker-polylite-petg-settings') {
    return {
      ...seed,
      status: 'completed',
      generatedAt: '2026-10-26T06:00:00.000Z',
      compatibilityVerdict: 'Optimal Match',
      heroSummary:
        'The enclosed Bambu Lab P1S pairs exceptionally well with Polymaker PolyLite PETG, sustaining a 14 mm³/s volumetric flow ceiling for reliable 167 mm/s outer wall and infill speeds without thermal drafts or layer delamination.',
      retractionDistanceMm: 0.8,
      retractionSpeedMmS: 35,
      coolingFanMinPct: 30,
      coolingFanMaxPct: 60,
      firstLayerSpeedMmS: 35,
      bedSurfaceRecommendation: 'Textured PEI Plate + Liquid Glue / Glue Stick release agent',
      slicerTweaks: [
        'Disable "Reduce infill retraction" in OrcaSlicer under Others → Special Mode to stop PETG blobs from accumulating on the nozzle tip during high-speed grid travel.',
        'Switch infill pattern from Grid to Gyroid or 3D Honeycomb at 15% density so the nozzle never crosses existing extruded PETG lines on the same layer.',
        'Set Max Volumetric Speed to 14 mm³/s in the Filament tab; stock Bambu Generic PETG profiles often push 18+ mm³/s which causes matte under-extrusion with PolyLite PETG.',
        'Configure Auxiliary Part Cooling Fan to 0% for the entire print to eliminate asymmetric chamber drafts that cause corner lifting on large flat functional parts.',
      ],
      troubleshootingMatrix: [
        {
          issue: 'Wispy cobweb stringing on travel moves and Z-seams',
          rootCause: 'Moisture absorption in hygroscopic PolyLite PETG combined with excessive nozzle dwell heat.',
          exactFix: 'Dry the spool at 65°C for 6 hours before printing, set retraction length to 0.8mm at 35 mm/s, and enable Wipe while retracting (1.5mm wipe distance).',
        },
        {
          issue: 'Infill crumbs and nozzle scraping mid-print',
          rootCause: 'Crossing infill paths (Grid/Triangles) cause molten PETG buildup on the stainless steel nozzle cone.',
          exactFix: 'Change Sparse Infill Pattern to Gyroid, lower infill flow ratio to 0.96, and increase Z-hop when retracting to 0.4mm Spiral.',
        },
        {
          issue: 'PETG fusing permanently to the build plate',
          rootCause: 'Direct high-temperature PETG bond with bare PEI coating during cooling contraction.',
          exactFix: 'Apply a thin barrier coat of liquid glue stick on the Textured PEI plate and let the bed cool below 40°C before flexing parts off.',
        },
      ],
      faq: [
        {
          question: 'Do I need to open the Bambu Lab P1S door when printing Polymaker PolyLite PETG?',
          answer: 'No. Unlike low-temp PLA which can suffer heat creep in a closed chamber, PolyLite PETG has a ~80°C glass transition temperature and prints cleanly with both the front door and top glass closed.',
        },
        {
          question: 'Can I use Polymaker PolyLite PETG cardboard spools in the Bambu Lab AMS?',
          answer: 'Modern PolyLite spools include factory sealed edge-glue that runs smoothly in the AMS, though printing snap-on plastic rim adapters prevents cardboard dust buildup on the AMS rollers.',
        },
        {
          question: 'What is the ideal nozzle temperature for PolyLite PETG on the P1S?',
          answer: '240°C is the sweet spot for balanced inter-layer adhesion and minimal stringing at 167 mm/s print speeds on the P1S all-metal hotend.',
        },
        {
          question: 'Should I upgrade the stock P1S nozzle for Polymaker PolyLite PETG?',
          answer: 'The stock 0.4mm Stainless Steel nozzle handles standard non-filled PolyLite PETG without accelerated wear, though upgrading to a Hardened Steel nozzle is recommended if you also print CF or glow variants.',
        },
      ],
    };
  }

  if (slug === 'bambu-lab-a1-bambu-pla-cf-settings') {
    return {
      ...seed,
      status: 'completed',
      generatedAt: '2026-10-26T06:00:00.000Z',
      compatibilityVerdict: 'Requires Upgrade',
      heroSummary:
        'Bambu Lab A1 prints Bambu PLA-CF with outstanding matte surface quality up to 190 mm/s (16 mm³/s volumetric limit), but you MUST swap the stock 0.4mm Stainless Steel quick-swap nozzle for a Hardened Steel hotend assembly to avoid rapid nozzle bore erosion and clogs.',
      retractionDistanceMm: 0.6,
      retractionSpeedMmS: 30,
      coolingFanMinPct: 80,
      coolingFanMaxPct: 100,
      firstLayerSpeedMmS: 40,
      bedSurfaceRecommendation: 'Textured PEI Plate (no glue required at 55°C)',
      slicerTweaks: [
        'Install the Bambu Lab A1 0.4mm (or 0.6mm) Hardened Steel Hotend and select "Hardened Steel" in the A1 device screen settings before sending the OrcaSlicer job.',
        'Cap Filament Max Volumetric Speed at 16 mm³/s so chopped carbon fibers align smoothly through the melt zone without tearing the outer wall finish.',
        'Increase minimum layer time to 8 seconds and keep part cooling between 80%–100% for crisp overhangs on functional brackets.',
        'Avoid 0.08mm ultra-fine layer heights; stick to 0.16mm–0.24mm layer heights to prevent carbon fiber particle bridging inside the nozzle orifice.',
      ],
      troubleshootingMatrix: [
        {
          issue: 'Sudden mid-print under-extrusion or partial nozzle clog',
          rootCause: 'Chopped carbon fibers bunching up inside a 0.4mm nozzle at very low layer heights or excessive retraction distance.',
          exactFix: 'Keep retraction distance at or below 0.6mm, maintain a minimum 0.16mm layer height, or step up to a 0.6mm Hardened Steel A1 hotend for heavy structural prints.',
        },
        {
          issue: 'Dimensional drift and rough top surfaces after a few spools',
          rootCause: 'Running abrasive carbon fiber filament through the factory A1 Stainless Steel nozzle enlarges and ovalizes the orifice.',
          exactFix: 'Replace the worn Stainless Steel nozzle with the official A1 Hardened Steel quick-swap hotend and re-run full flow dynamics calibration.',
        },
        {
          issue: 'Brittle filament snapping in the PTFE feed tube or AMS Lite',
          rootCause: 'Moisture absorption increases stiffness and brittleness in carbon-fiber reinforced PLA.',
          exactFix: 'Dry the Bambu PLA-CF spool at 55°C for 8 hours in an active filament dryer and use smooth, wide-radius PTFE routing into the A1 toolhead.',
        },
      ],
      faq: [
        {
          question: 'Can I print Bambu PLA-CF with the stock Bambu Lab A1 nozzle?',
          answer: 'The stock A1 ships with a 0.4mm Stainless Steel nozzle, which will wear out prematurely when printing abrasive carbon-fiber filaments. Upgrade to the A1 0.4mm or 0.6mm Hardened Steel hotend first.',
        },
        {
          question: 'Is Bambu PLA-CF compatible with the AMS Lite on the A1?',
          answer: 'It can feed through the AMS Lite if properly dried, but abrasive carbon-fiber strands will gradually wear the plastic AMS Lite funnel entry—using dry-box direct feed or TPU funnel savers is recommended.',
        },
        {
          question: 'What layer height works best for Bambu PLA-CF on the A1?',
          answer: 'A 0.20mm layer height with a 0.42mm–0.45mm line width completely hides layer lines thanks to the matte carbon texture while preventing fiber jams.',
        },
        {
          question: 'Does Bambu PLA-CF require an enclosure on the Bambu Lab A1?',
          answer: 'No enclosure is required. Carbon fiber reinforcement actually reduces thermal shrinkage compared to standard PLA, so it prints flat on the open-frame A1 bed at 55°C.',
        },
      ],
    };
  }

  // Third sample: creality-k1-max-polymaker-pa6-cf-settings
  return {
    ...seed,
    status: 'completed',
    generatedAt: '2026-10-26T06:00:00.000Z',
    compatibilityVerdict: 'Advanced Setup',
    heroSummary:
      'Equipped with a 300°C Unicorn/Hardened Steel nozzle and full enclosure, the Creality K1 Max is well-suited for structural Polymaker PA6-CF parts at up to 131 mm/s (11 mm³/s volumetric limit), provided the spool is actively printed from a 70°C filament dryer.',
    retractionDistanceMm: 0.5,
    retractionSpeedMmS: 30,
    coolingFanMinPct: 0,
    coolingFanMaxPct: 15,
    firstLayerSpeedMmS: 30,
    bedSurfaceRecommendation: 'Smooth PEI / Engineering Plate at 45°C + Magigoo PA or PVP Glue',
    slicerTweaks: [
      'Keep bed temperature strictly at 45°C–50°C per Polymaker Fiberon/Warp-Free™ technology; heating the bed above 65°C keeps the nylon above its glass transition and induces post-print creep warping.',
      'Disable part cooling fan (0% constant, max 15% only on steep overhangs) in OrcaSlicer to maximize crystalline inter-layer weld strength.',
      'Limit Max Volumetric Speed to 11 mm³/s and set outer wall speed to 60 mm/s for uniform matte carbon surface finish and maximum tensile strength.',
      'Feed the filament directly from a heated dry box (70°C) via a continuous PTFE bowden tube into the K1 Max extruder—PA6 absorbs atmospheric moisture within 45 minutes.',
    ],
    troubleshootingMatrix: [
      {
        issue: 'Popping sounds at the nozzle and fuzzy, pitted outer walls',
        rootCause: 'Nylon 6 (PA6) rapidly absorbs moisture from ambient air, turning water into steam inside the 290°C melt zone.',
        exactFix: 'Dry the PA6-CF spool at 80°C–90°C for 12 hours prior to printing and feed continuously from an active filament dryer during the entire print.',
      },
      {
        issue: 'Part warping or lifting off the build plate mid-print',
        rootCause: 'Bed temperature set too high (>70°C) or insufficient PA-specific liquid adhesive on the build plate.',
        exactFix: 'Drop bed temperature to 45°C, apply a uniform layer of Magigoo PA or PVA glue stick, and add an 8mm outer brim with 0.05mm brim-object gap.',
      },
      {
        issue: 'Weak layer adhesion along the Z-axis on functional brackets',
        rootCause: 'Nozzle temperature too low or part cooling fan kicking on during short layer times.',
        exactFix: 'Print at 290°C nozzle temperature, set both main and side auxiliary cooling fans to 0%, and pre-heat the K1 Max enclosed chamber for 15 minutes.',
      },
    ],
    faq: [
      {
        question: 'Why does Polymaker PA6-CF recommend a 45°C bed temperature instead of 100°C?',
        answer: 'Polymaker PA6-CF uses Warp-Free™ fiber distribution; keeping the bed at 45°C–50°C (below the glass transition point) locks the bottom layers rigid immediately and prevents crystallization warping.',
      },
      {
        question: 'Can the Creality K1 Max stock nozzle handle Polymaker PA6-CF?',
        answer: 'Yes. The Creality K1 Max ships with a hardened steel nozzle rated to 300°C, which resists the heavy abrasion of 20% chopped carbon fiber reinforcement.',
      },
      {
        question: 'Do I need to anneal Polymaker PA6-CF parts after printing on the K1 Max?',
        answer: 'For maximum heat deflection temperature (up to 215°C HDT) and stiffness, anneal finished prints in a convection oven at 90°C for 6 hours after printing.',
      },
      {
        question: 'What nozzle diameter is safest for continuous PA6-CF production?',
        answer: 'While a 0.4mm hardened steel nozzle works well with a 0.20mm layer height, stepping up to a 0.6mm hardened nozzle eliminates any risk of carbon fiber cluster clogs on multi-day prints.',
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 5. MAIN EXECUTION
// ---------------------------------------------------------------------------
function main() {
  const orcaPath = process.env.ORCASLICER_PATH || process.argv[2] || '';
  const { printers, filaments } = orcaPath
    ? parseOrcaSlicerProfiles(orcaPath)
    : { printers: BUILTIN_PRINTERS, filaments: BUILTIN_FILAMENTS };

  fs.mkdirSync(path.dirname(SEEDS_FILE), { recursive: true });
  fs.mkdirSync(PAGES_DIR, { recursive: true });

  // Preserve any existing completed statuses if seeds.json already exists
  const existingStatusMap = new Map();
  if (fs.existsSync(SEEDS_FILE)) {
    try {
      const existing = JSON.parse(fs.readFileSync(SEEDS_FILE, 'utf-8'));
      for (const item of existing) {
        if (item.slug && item.status === 'completed') {
          existingStatusMap.set(item.slug, 'completed');
        }
      }
    } catch {
      // Ignore corrupt file
    }
  }

  const pregeneratedSlugs = new Set([
    'bambu-lab-p1s-polymaker-polylite-petg-settings',
    'bambu-lab-a1-bambu-pla-cf-settings',
    'creality-k1-max-polymaker-pa6-cf-settings',
  ]);

  const seeds = [];

  for (const printer of printers) {
    for (const filament of filaments) {
      const slug = `${printer.slug}-${filament.slug}-settings`;
      const deterministicMath = computeDeterministicMath(printer, filament);
      const isSample = pregeneratedSlugs.has(slug);
      const status = isSample
        ? 'completed'
        : existingStatusMap.get(slug) || 'pending';

      const seedItem = {
        slug,
        status,
        printer,
        filament,
        deterministicMath,
      };

      seeds.push(seedItem);

      if (isSample) {
        const pageFile = path.join(PAGES_DIR, `${slug}.json`);
        const fullPageData = getSampleGeneratedPayload(seedItem);
        fs.writeFileSync(pageFile, JSON.stringify(fullPageData, null, 2) + '\n', 'utf-8');
      }
    }
  }

  fs.writeFileSync(SEEDS_FILE, JSON.stringify(seeds, null, 2) + '\n', 'utf-8');

  console.log(
    `[build-seeds] Generated ${seeds.length} combinatorial seed items (${printers.length} printers × ${filaments.length} filaments) in data/seeds.json.`
  );
  console.log(
    `[build-seeds] Pre-populated ${pregeneratedSlugs.size} complete sample pages in src/data/pages/.`
  );
}

main();
