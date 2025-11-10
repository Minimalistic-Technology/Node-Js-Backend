"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordService = void 0;
const argon2 = __importStar(require("argon2"));
const ARGON2_ALGO = 'argon2id_v1';
const ARGON2_OPTIONS = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 65536 KiB
    hashLength: 50,
    parallelism: 1,
    timeCost: 2,
};
exports.passwordService = {
    /**
     * Hashes a password using Argon2id.
     */
    hash: async (password) => {
        const hash = await argon2.hash(password, ARGON2_OPTIONS);
        return {
            hash,
            algo: ARGON2_ALGO,
        };
    },
    /**
     * Verifies a password against a hash.
     */
    verify: async (hash, password) => {
        return argon2.verify(hash, password);
    },
    /**
     * Checks if a hash needs to be upgraded.
     * (e.g., if you change ARGON2_OPTIONS)
     */
    needsRehash: (hash) => {
        return argon2.needsRehash(hash, ARGON2_OPTIONS);
    },
};
