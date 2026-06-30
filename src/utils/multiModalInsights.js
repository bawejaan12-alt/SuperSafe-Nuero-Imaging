// Assign a tercile (0=low, 1=mid, 2=high) for each signal.
function tercile(value, low, high) {
  if (value <= low) return 0;
  if (value >= high) return 2;
  return 1;
}

const MESSAGES = {
  anxiety: {
    concordant: 'Your brain activity and self-reported anxiety are in agreement — consistent activation in the amygdala and anterior cingulate matches what your questionnaire suggests.',
    discordant: 'Interesting finding: there is a mismatch between your brain activity and your self-reported anxiety. This can indicate emotional suppression, lack of interoceptive awareness, or that questionnaire responses reflect a good day.',
  },
  stress: {
    concordant: 'Chronic stress indicators from your brain scan align with your perceived stress score — both suggest a similar level of overall stress burden.',
    discordant: 'Your perceived stress score and fMRI stress indicators diverge. Biological stress markers sometimes accumulate before they are consciously felt, or vice versa.',
  },
  depression: {
    concordant: 'Your mood-related questionnaire responses and fMRI patterns are consistent — both point to a similar level of depressive symptomatology.',
    discordant: 'Your PHQ-9 responses and neural depression markers tell different stories. This is worth exploring further with a qualified clinician.',
  },
  cardiovascular: {
    concordant: 'Heart rate and blood pressure readings are consistent with the autonomic tone suggested by your scan.',
    discordant: 'Your cardiovascular indicators and brain-based autonomic estimates differ, which can reflect situational factors like recent activity or measurement timing.',
  },
};

export function computeMultiModalInsights(fmriProfile, questionnaireScores, physioValues) {
  const insights = [];

  if (questionnaireScores) {
    const { phq9, gad7, pss10 } = questionnaireScores;

    // Anxiety domain
    const fmriAnxiety = fmriProfile.amygdalaScore || 0.5;
    const qAnxiety = gad7 ? gad7.score / 21 : 0.5;
    const tFmri = tercile(fmriAnxiety, 0.33, 0.66);
    const tQ    = tercile(qAnxiety, 0.33, 0.66);
    const anxietyAlign = Math.abs(tFmri - tQ) <= 0 ? 'concordant' : 'discordant';
    insights.push({
      domain: 'Anxiety',
      fmriSignal: fmriAnxiety,
      questionnaireScore: qAnxiety,
      physioScore: physioValues ? Math.min(physioValues.heartRate / 100, 1) : null,
      alignment: anxietyAlign,
      insight: MESSAGES.anxiety[anxietyAlign],
    });

    // Stress domain
    const fmriStress = fmriProfile.cinglateScore || 0.5;
    const qStress = pss10 ? pss10.score / 40 : 0.5;
    const tFS = tercile(fmriStress, 0.33, 0.66);
    const tQS = tercile(qStress, 0.33, 0.66);
    const stressAlign = Math.abs(tFS - tQS) <= 0 ? 'concordant' : 'discordant';
    insights.push({
      domain: 'Stress',
      fmriSignal: fmriStress,
      questionnaireScore: qStress,
      physioScore: physioValues ? Math.min(physioValues.hrv / 80, 1) : null,
      alignment: stressAlign,
      insight: MESSAGES.stress[stressAlign],
    });

    // Depression domain
    const fmriDepression = fmriProfile.vmPfcScore || 0.5;
    const qDepression = phq9 ? phq9.score / 27 : 0.5;
    const tFD = tercile(fmriDepression, 0.33, 0.66);
    const tQD = tercile(qDepression, 0.33, 0.66);
    const depAlign = Math.abs(tFD - tQD) <= 0 ? 'concordant' : 'discordant';
    insights.push({
      domain: 'Depression',
      fmriSignal: fmriDepression,
      questionnaireScore: qDepression,
      physioScore: null,
      alignment: depAlign,
      insight: MESSAGES.depression[depAlign],
    });
  }

  if (physioValues) {
    const fmriAuto = fmriProfile.insulaScore || 0.5;
    const cardio = Math.min(
      ((physioValues.systolic || 120) - 90) / 60, 1
    );
    const tFAuto = tercile(fmriAuto, 0.33, 0.66);
    const tCard  = tercile(cardio, 0.33, 0.66);
    const cardioAlign = Math.abs(tFAuto - tCard) <= 0 ? 'concordant' : 'discordant';
    insights.push({
      domain: 'Cardiovascular',
      fmriSignal: fmriAuto,
      questionnaireScore: null,
      physioScore: cardio,
      alignment: cardioAlign,
      insight: MESSAGES.cardiovascular[cardioAlign],
    });
  }

  return insights;
}
