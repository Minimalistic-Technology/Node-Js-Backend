"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateOtp(length = 6) {
    return Math.floor(100000 + Math.random() * 900000)
        .toString()
        .slice(0, length);
}
exports.default = generateOtp;
