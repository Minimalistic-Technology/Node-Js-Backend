"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBMI = calculateBMI;
exports.classifyBMI = classifyBMI;
function calculateBMI(weight, height, unit) {
    let bmi = 0;
    if (unit === 'metric') {
        bmi = weight / ((height / 100) ** 2); // cm to m
    }
    else {
        bmi = (703 * weight) / (height ** 2);
    }
    return parseFloat(bmi.toFixed(2));
}
function classifyBMI(bmi) {
    if (bmi < 18.5)
        return 'Underweight';
    if (bmi < 24.9)
        return 'Normal weight';
    if (bmi < 29.9)
        return 'Overweight';
    return 'Obese';
}
