function download(content, filename, type) {
  const blob = new Blob([content], { type });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportCohortCsv(history) {
  const headers = [
    'ID', 'SubjectID', 'Date', 'Condition', 'Confidence', 'Entropy',
    'P(none)', 'P(mild)', 'P(moderate)',
    'Neuroticism_raw', 'Neuroticism_z',
    'TraitAnxiety_raw', 'TraitAnxiety_z',
    'ChronicStress_raw', 'ChronicStress_z',
    'PHQ9_score', 'PHQ9_severity',
    'GAD7_score', 'GAD7_severity',
    'PSS10_score',
    'Systolic', 'Diastolic', 'HeartRate', 'HRV', 'SleepHours', 'ExerciseFreq',
  ];

  const rows = history.map(r => [
    r.id, r.subjectId, r.date, r.topCondition, r.confidence, r.entropy,
    r.conditionProbs?.none ?? '', r.conditionProbs?.mild ?? '', r.conditionProbs?.moderate ?? '',
    r.wellbeing?.neuroticism?.raw ?? '', r.wellbeing?.neuroticism?.zscore ?? '',
    r.wellbeing?.traitAnxiety?.raw ?? '', r.wellbeing?.traitAnxiety?.zscore ?? '',
    r.wellbeing?.chronicStress?.raw ?? '', r.wellbeing?.chronicStress?.zscore ?? '',
    r.questionnaire?.phq9?.score ?? '', r.questionnaire?.phq9?.severity ?? '',
    r.questionnaire?.gad7?.score ?? '', r.questionnaire?.gad7?.severity ?? '',
    r.questionnaire?.pss10?.score ?? '',
    r.physiological?.systolic ?? '', r.physiological?.diastolic ?? '',
    r.physiological?.heartRate ?? '', r.physiological?.hrv ?? '',
    r.physiological?.sleepHours ?? '', r.physiological?.exerciseFrequency ?? '',
  ]);

  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  download(csv, `neuroinsight_cohort_${Date.now()}.csv`, 'text/csv');
}

export function exportCohortJson(history) {
  download(JSON.stringify(history, null, 2), `neuroinsight_cohort_${Date.now()}.json`, 'application/json');
}
