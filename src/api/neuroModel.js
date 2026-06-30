/*
  api/neuroModel.js
  ────────────────────────────────────────────────────────────────────────────
  THIS IS THE ONLY FILE YOU NEED TO EDIT TO CONNECT YOUR REAL MODEL.

  Right now MOCK_MODE is true, so analyseScan() returns realistic fake data
  after a short delay — this lets every screen in the app work end-to-end
  without a backend.

  When your TensorFlow model is ready:
    1. Build a small backend (FastAPI is recommended — see the framework
       outline at the bottom of this file in the comment block).
    2. Set MOCK_MODE = false below.
    3. Set API_BASE_URL to wherever your backend runs.
    4. Nothing else in the app needs to change — every page calls
       analyseScan() and expects the AnalysisResult shape documented below.
  ────────────────────────────────────────────────────────────────────────────
*/

// ── Configuration ───────────────────────────────────────────────────────────
export const MOCK_MODE     = true;
export const API_BASE_URL  = 'http://localhost:8000';  // your FastAPI server


/*
  AnalysisResult shape — every page in the app expects exactly this object
  back from analyseScan(). Keep your backend's JSON response matching this
  shape and the frontend requires zero changes.

  {
    id:          string            // unique report id
    subjectId:   string
    date:        string            // display-formatted date
    topCondition:string            // 'none' | 'mild' | 'moderate'
    confidence:  'High' | 'Medium' | 'Low'
    entropy:     number            // 0–1, lower = more certain
    conditionProbs: {               // softmax output, sums to 1.0
      none:     number,
      mild:     number,
      moderate: number,
    },
    wellbeing: {                    // regression head output (raw + z-score)
      neuroticism:    { raw: number, zscore: number },
      traitAnxiety:   { raw: number, zscore: number },
      chronicStress:  { raw: number, zscore: number },
    },
    regions: [                      // Grad-CAM top activated regions
      { name: string, score: number }   // score 0–1
    ],
    summary: string,                // plain-language paragraph
  }
*/


// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Analyse a brain scan and return wellbeing + condition predictions.
 *
 * @param {File} file          - the uploaded scan file
 * @param {Object} subjectMeta - { id, age, sex, notes }
 * @returns {Promise<AnalysisResult>}
 */
export async function analyseScan(file, subjectMeta) {
  if (MOCK_MODE) {
    return mockAnalyse(file, subjectMeta);
  }
  return realAnalyse(file, subjectMeta);
}

/**
 * Fetch the full history of analyses for the current user.
 * Returns [] in mock mode unless you wire it to localStorage/a real DB.
 */
export async function fetchHistory() {
  if (MOCK_MODE) {
    return MOCK_HISTORY;
  }
  const res = await fetch(`${API_BASE_URL}/api/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

/**
 * Health check — used to show a "model offline" banner if the backend
 * isn't reachable. Call this once when the app loads.
 */
export async function checkModelStatus() {
  if (MOCK_MODE) {
    return { online: true, mode: 'mock', modelVersion: 'mock-v0' };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { online: false };
    const data = await res.json();
    return { online: true, mode: 'live', ...data };
  } catch {
    return { online: false };
  }
}


// ── Real backend call (used once MOCK_MODE = false) ───────────────────────────

async function realAnalyse(file, subjectMeta) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('subject_id', subjectMeta.id || '');
  formData.append('age', subjectMeta.age || '');
  formData.append('sex', subjectMeta.sex || '');
  formData.append('notes', subjectMeta.notes || '');

  const res = await fetch(`${API_BASE_URL}/api/analyse`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Analysis failed (${res.status}): ${errText}`);
  }

  return res.json();
}


// ── Mock implementation — realistic fake data, used until backend exists ──────

const CONDITION_PROFILES = {
  none: {
    conditionProbs: { none: 0.82, mild: 0.14, moderate: 0.04 },
    wellbeing: {
      neuroticism:   { raw: 1.8, zscore: -0.6 },
      traitAnxiety:  { raw: 34,  zscore: -0.7 },
      chronicStress: { raw: 14,  zscore: -0.5 },
    },
    regions: [
      { name: 'Amygdala (L)',       score: 0.21 },
      { name: 'Anterior cingulate', score: 0.18 },
      { name: 'Insula (R)',         score: 0.15 },
    ],
    summary: 'No significant indicators of elevated stress or anxiety detected. Activation patterns across limbic and prefrontal regions are within the typical range for this population.',
  },
  mild: {
    conditionProbs: { none: 0.22, mild: 0.61, moderate: 0.17 },
    wellbeing: {
      neuroticism:   { raw: 2.6, zscore: 0.4 },
      traitAnxiety:  { raw: 46,  zscore: 0.5 },
      chronicStress: { raw: 24,  zscore: 0.6 },
    },
    regions: [
      { name: 'Amygdala (L)',       score: 0.58 },
      { name: 'Anterior cingulate', score: 0.51 },
      { name: 'Insula (R)',         score: 0.44 },
      { name: 'vmPFC',              score: 0.33 },
    ],
    summary: 'Mild elevation in limbic reactivity is present, with the left amygdala and anterior cingulate showing above-average activation. This pattern is consistent with mild stress or low-level trait anxiety rather than a clinical condition.',
  },
  moderate: {
    conditionProbs: { none: 0.06, mild: 0.21, moderate: 0.73 },
    wellbeing: {
      neuroticism:   { raw: 3.4, zscore: 1.6 },
      traitAnxiety:  { raw: 58,  zscore: 1.8 },
      chronicStress: { raw: 34,  zscore: 1.9 },
    },
    regions: [
      { name: 'Amygdala (L)',       score: 0.88 },
      { name: 'Anterior cingulate', score: 0.79 },
      { name: 'Insula (R)',         score: 0.71 },
      { name: 'vmPFC',              score: 0.63 },
      { name: 'dlPFC (L)',          score: 0.41 },
    ],
    summary: 'Substantially elevated activation across the limbic-prefrontal stress network. Left amygdala and anterior cingulate activity are markedly above the population mean, a pattern frequently associated with chronic stress and elevated trait anxiety.',
  },
};

function mockAnalyse(file, subjectMeta) {
  return new Promise(resolve => {
    setTimeout(() => {
      // Pick a profile based on a hash of the filename so results feel
      // consistent for the same file rather than fully random each time
      const seed    = (file?.name || 'default').length % 3;
      const profile = seed === 0 ? 'none' : seed === 1 ? 'mild' : 'moderate';
      const data    = CONDITION_PROFILES[profile];

      const topProb = Math.max(...Object.values(data.conditionProbs));
      const entropy = 1 - topProb;   // crude proxy for the mock

      resolve({
        id:            `RPT-${Date.now()}`,
        subjectId:     subjectMeta?.id || 'SUB-000',
        date:          new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        topCondition:  profile,
        confidence:    entropy < 0.3 ? 'High' : entropy < 0.55 ? 'Medium' : 'Low',
        entropy:       Number(entropy.toFixed(2)),
        conditionProbs: data.conditionProbs,
        wellbeing:      data.wellbeing,
        regions:        data.regions,
        summary:        data.summary,
      });
    }, 0); // delay handled by the ProcessingPage's own step timers
  });
}

const MOCK_HISTORY = [
  {
    id: 'RPT-2026-06-19-039', subjectId: 'SUB-039', date: '19 Jun 2026',
    topCondition: 'none', confidence: 'High', entropy: 0.18,
    conditionProbs: CONDITION_PROFILES.none.conditionProbs,
    wellbeing: CONDITION_PROFILES.none.wellbeing,
    regions: CONDITION_PROFILES.none.regions,
    summary: CONDITION_PROFILES.none.summary,
  },
  {
    id: 'RPT-2026-06-14-035', subjectId: 'SUB-035', date: '14 Jun 2026',
    topCondition: 'mild', confidence: 'Medium', entropy: 0.39,
    conditionProbs: CONDITION_PROFILES.mild.conditionProbs,
    wellbeing: CONDITION_PROFILES.mild.wellbeing,
    regions: CONDITION_PROFILES.mild.regions,
    summary: CONDITION_PROFILES.mild.summary,
  },
];


/*
  ════════════════════════════════════════════════════════════════════════════
  BACKEND FRAMEWORK — build this once your TensorFlow model is trained
  ════════════════════════════════════════════════════════════════════════════

  Minimal FastAPI server that wraps your Keras model and matches the
  AnalysisResult shape this file expects. Save as backend/main.py.

  ────────────────────────────────────────────────────────────────────────────
  from fastapi import FastAPI, File, UploadFile, Form
  from fastapi.middleware.cors import CORSMiddleware
  import tensorflow as tf
  import numpy as np
  import nibabel as nib
  from nilearn import image as nli
  import tempfile, os, uuid
  from datetime import datetime

  app = FastAPI()

  # Allow the React dev server to call this API
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["http://localhost:3000"],
      allow_methods=["*"], allow_headers=["*"],
  )

  # Load your trained model once at startup
  model = tf.keras.models.load_model("checkpoints/best_model.keras")

  CONDITION_NAMES = ["none", "mild", "moderate"]
  WB_NAMES        = ["neuroticism", "traitAnxiety", "chronicStress"]
  # These come from your training set — paste the actual values you printed
  # in Cell 3 / Cell 6 of the notebook (wb_mean, wb_std)
  WB_MEAN = np.array([2.4, 42.0, 19.0])
  WB_STD  = np.array([0.7, 11.0, 8.5])

  TARGET_SHAPE  = (48, 48, 32)
  TARGET_AFFINE = np.diag([3.5, 3.5, 3.5, 1])

  REGION_COORDS = {
      "Amygdala (L)":        (-24, -4, -20),
      "Anterior cingulate":  (0, 40, 4),
      "Insula (R)":          (38, 2, 2),
      "vmPFC":                (0, 54, -12),
      "dlPFC (L)":            (-44, 28, 28),
  }

  def preprocess(nii_path):
      img      = nib.load(nii_path)
      mean_img = nli.mean_img(img)
      resampled = nli.resample_img(
          mean_img, target_affine=TARGET_AFFINE, target_shape=TARGET_SHAPE,
      )
      data = resampled.get_fdata().astype(np.float32)
      data = (data - data.mean()) / (data.std() + 1e-8)
      return data[np.newaxis, ..., np.newaxis]   # add batch + channel dims

  @app.get("/api/health")
  def health():
      return {"modelVersion": "NeuroCNN-MPILEMON-v1", "status": "ready"}

  @app.post("/api/analyse")
  async def analyse(
      file: UploadFile = File(...),
      subject_id: str = Form(""),
      age: str = Form(""),
      sex: str = Form(""),
      notes: str = Form(""),
  ):
      # Save upload to a temp file so nibabel can read it
      with tempfile.NamedTemporaryFile(suffix=".nii.gz", delete=False) as tmp:
          tmp.write(await file.read())
          tmp_path = tmp.name

      try:
          x = preprocess(tmp_path)
          preds = model.predict(x)

          cond_probs = preds["depression_output"][0]      # (3,)
          wb_raw_z   = preds["wellbeing_output"][0]        # (3,) z-scored
          wb_raw     = wb_raw_z * WB_STD + WB_MEAN          # back to real units

          top_idx       = int(np.argmax(cond_probs))
          top_condition = CONDITION_NAMES[top_idx]
          entropy       = float(1 - cond_probs[top_idx])
          confidence    = "High" if entropy < 0.3 else "Medium" if entropy < 0.55 else "Low"

          # Grad-CAM region scores — see your notebook's Cell 12 logic,
          # adapted to map onto named regions via REGION_COORDS
          regions = compute_region_scores(model, x, top_idx)  # implement using your GradCAM code

          return {
              "id":            f"RPT-{uuid.uuid4().hex[:8]}",
              "subjectId":     subject_id or "SUB-000",
              "date":          datetime.now().strftime("%d %b %Y"),
              "topCondition":  top_condition,
              "confidence":    confidence,
              "entropy":       round(entropy, 2),
              "conditionProbs": {
                  CONDITION_NAMES[i]: float(p) for i, p in enumerate(cond_probs)
              },
              "wellbeing": {
                  WB_NAMES[i]: {
                      "raw": float(wb_raw[i]),
                      "zscore": float(wb_raw_z[i]),
                  } for i in range(3)
              },
              "regions": regions,
              "summary": build_summary(top_condition, cond_probs[top_idx]),
          }
      finally:
          os.unlink(tmp_path)

  def build_summary(condition, prob):
      templates = {
          "none":     f"No significant indicators of elevated stress detected (confidence {prob:.0%}).",
          "mild":     f"Mild elevation in stress-related brain activity detected (confidence {prob:.0%}).",
          "moderate": f"Substantial elevation in stress-related activation detected (confidence {prob:.0%}).",
      }
      return templates[condition]

  # Run with: uvicorn main:app --reload --port 8000
  ────────────────────────────────────────────────────────────────────────────
*/
