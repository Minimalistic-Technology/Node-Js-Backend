export function calculateBMI(weight: number, height: number, unit: 'metric' | 'imperial') {
  let bmi = 0;

  if (unit === 'metric') {
    bmi = weight / ((height / 100) ** 2); // cm to m
  } else {
    bmi = (703 * weight) / (height ** 2);
  }

  return parseFloat(bmi.toFixed(2));
}

export function classifyBMI(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 24.9) return 'Normal weight';
  if (bmi < 29.9) return 'Overweight';
  return 'Obese';
}
