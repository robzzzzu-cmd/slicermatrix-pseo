#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SEEDS_FILE = path.join(ROOT_DIR, 'data', 'seeds.json');
const PAGES_DIR = path.join(ROOT_DIR, 'src', 'data', 'pages');

const BATCH_SIZE = Number(process.env.BATCH_SIZE || 50);
const SLEEP_MS = Number(process.env.SLEEP_MS || 4500);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    compatibilityVerdict: {
      type: Type.STRING,
      enum: ['Optimal Match', 'Requires Upgrade', 'Advanced Setup'],
      description: 'Engineering verdict on whether this printer can print this filament out of the box or needs upgrades/enclosure.',
    },
    heroSummary: {
      type: Type.STRING,
      description: 'Direct 2-sentence engineering summary answering how well this printer handles this exact filament and what max speed it hits.',
    },
    retractionDistanceMm: {
      type: Type.NUMBER,
      description: 'Retraction length in mm tuned for Direct Drive (0.4-1.0mm) or Bowden (3.0-5.0mm) and material viscosity.',
    },
    retractionSpeedMmS: {
      type: Type.NUMBER,
      description: 'Retraction speed in mm/s (typically 25-45 mm/s).',
    },
    coolingFanMinPct: {
      type: Type.INTEGER,
      description: 'Minimum part cooling fan percentage (0-100).',
    },
    coolingFanMaxPct: {
      type: Type.INTEGER,
      description: 'Maximum part cooling fan percentage (0-100).',
    },
    firstLayerSpeedMmS: {
      type: Type.INTEGER,
      description: 'Recommended first layer print speed in mm/s (typically 25-50 mm/s).',
    },
    bedSurfaceRecommendation: {
      type: Type.STRING,
      description: 'Recommended build plate surface and release agent/adhesive (e.g., "Textured PEI Plate + Glue Stick release agent").',
    },
    slicerTweaks: {
      type: Type.ARRAY,
      description: '4 specific, actionable OrcaSlicer setting tips for this exact printer + filament combination.',
      items: {
        type: Type.STRING,
      },
    },
    troubleshootingMatrix: {
      type: Type.ARRAY,
      description: '3 common failure modes with root cause and exact slicer/hardware fix.',
      items: {
        type: Type.OBJECT,
        properties: {
          issue: { type: Type.STRING },
          rootCause: { type: Type.STRING },
          exactFix: { type: Type.STRING },
        },
        required: ['issue', 'rootCause', 'exactFix'],
      },
    },
    faq: {
      type: Type.ARRAY,
      description: '4 specific frequently asked questions and concise engineering answers.',
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING },
        },
        required: ['question', 'answer'],
      },
    },
  },
  required: [
    'compatibilityVerdict',
    'heroSummary',
    'retractionDistanceMm',
    'retractionSpeedMmS',
    'coolingFanMinPct',
    'coolingFanMaxPct',
    'firstLayerSpeedMmS',
    'bedSurfaceRecommendation',
    'slicerTweaks',
    'troubleshootingMatrix',
    'faq',
  ],
};

function buildPrompt(item) {
  const { printer, filament, deterministicMath } = item;
  return `You are a Senior 3D Printing Materials & OrcaSlicer Process Engineer.
Generate an exact, production-ready OrcaSlicer profile & troubleshooting guide for printing **${filament.name}** (${filament.materialType}) on the **${printer.name}**.

### Deterministic Hardware & Material Constraints (MUST RESPECT):
- Printer: ${printer.name} (${printer.vendor})
- Extruder Type: ${printer.extruderType}
- Stock Nozzle Material: ${printer.defaultNozzleMaterial}
- Printer Max Nozzle Temp: ${printer.maxNozzleTempC}°C | Max Bed Temp: ${printer.maxBedTempC}°C
- Enclosed Chamber: ${printer.enclosed ? 'Yes (Enclosed)' : 'No (Open Frame)'}
- Filament: ${filament.name} (${filament.brand} ${filament.materialType})
- Filament Nozzle Range: ${filament.minNozzleTempC}°C - ${filament.maxNozzleTempC}°C (Target: ${deterministicMath.recommendedNozzleTempC}°C)
- Filament Bed Range: ${filament.minBedTempC}°C - ${filament.maxBedTempC}°C (Target: ${deterministicMath.recommendedBedTempC}°C)
- Effective Max Volumetric Flow: ${deterministicMath.effectiveVolumetricFlowMm3s} mm³/s
- Calculated Safe Max Print Speed (0.4mm nozzle, 0.2mm layer, 0.42mm width): ${deterministicMath.calculatedMaxPrintSpeedMmS} mm/s
- Abrasive Filament: ${filament.isAbrasive} (Requires Hardened Nozzle Upgrade: ${deterministicMath.requiresHardenedNozzleUpgrade})
- Hygroscopic Filament: ${filament.isHygroscopic}
- Enclosure Warning: ${deterministicMath.enclosureWarning}

### Instructions:
1. If "Requires Hardened Nozzle Upgrade" is true, set compatibilityVerdict to "Requires Upgrade". If "Enclosure Warning" is true or material is PA/PC/ABS-GF, set compatibilityVerdict to "Advanced Setup" (or "Requires Upgrade" if nozzle is also unhardened). Otherwise use "Optimal Match".
2. In heroSummary, write 2 crisp sentences referencing the exact ${deterministicMath.calculatedMaxPrintSpeedMmS} mm/s speed (${deterministicMath.effectiveVolumetricFlowMm3s} mm³/s flow) and any critical nozzle/enclosure hardware requirements.
3. Provide 4 specific OrcaSlicer settings tweaks in slicerTweaks, 3 troubleshooting items in troubleshootingMatrix, and 4 high-intent user questions in faq.`;
}

async function main() {
  if (!fs.existsSync(SEEDS_FILE)) {
    console.error(`[generate-batch] Seeds file not found at ${SEEDS_FILE}. Run "node scripts/build-seeds.mjs" first.`);
    process.exit(1);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[generate-batch] Missing GEMINI_API_KEY environment variable.');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });
  const seeds = JSON.parse(fs.readFileSync(SEEDS_FILE, 'utf-8'));
  const pendingItems = seeds.filter((item) => item.status === 'pending').slice(0, BATCH_SIZE);

  if (pendingItems.length === 0) {
    console.log('[generate-batch] No pending seed items remaining. Queue is 100% complete!');
    return;
  }

  fs.mkdirSync(PAGES_DIR, { recursive: true });
  console.log(`[generate-batch] Processing ${pendingItems.length} pending items with gemini-2.5-flash...`);

  let processedCount = 0;

  for (let i = 0; i < pendingItems.length; i++) {
    const item = pendingItems[i];
    console.log(`[${i + 1}/${pendingItems.length}] Generating ${item.slug}...`);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: buildPrompt(item),
        config: {
          responseMimeType: 'application/json',
          responseSchema,
          temperature: 0.3,
        },
      });

      const rawText = response.text;
      if (!rawText) {
        throw new Error('Empty response text from Gemini API');
      }

      const aiData = JSON.parse(rawText);

      // Ensure fixed lengths for arrays
      aiData.slicerTweaks = (aiData.slicerTweaks || []).slice(0, 4);
      aiData.troubleshootingMatrix = (aiData.troubleshootingMatrix || []).slice(0, 3);
      aiData.faq = (aiData.faq || []).slice(0, 4);

      const mergedPage = {
        ...item,
        status: 'completed',
        generatedAt: new Date().toISOString(),
        ...aiData,
      };

      const pagePath = path.join(PAGES_DIR, `${item.slug}.json`);
      fs.writeFileSync(pagePath, JSON.stringify(mergedPage, null, 2) + '\n', 'utf-8');

      // Update status in master seeds array and persist immediately so progress is saved
      item.status = 'completed';
      fs.writeFileSync(SEEDS_FILE, JSON.stringify(seeds, null, 2) + '\n', 'utf-8');
      processedCount++;
      console.log(`  ✓ Saved src/data/pages/${item.slug}.json`);
    } catch (err) {
      console.error(`  ✗ Error generating ${item.slug}:`, err?.message || err);
    }

    if (i < pendingItems.length - 1) {
      await sleep(SLEEP_MS);
    }
  }

  console.log(`[generate-batch] Completed ${processedCount}/${pendingItems.length} pages in this batch.`);
}

main();
