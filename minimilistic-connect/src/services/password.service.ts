import * as argon2 from 'argon2';

const ARGON2_ALGO = 'argon2id_v1';
const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16, // 65536 KiB
  hashLength: 50,
  parallelism: 1,
  timeCost: 2,
};

export const passwordService = {
  /**
   * Hashes a password using Argon2id.
   */
  hash: async (password: string): Promise<{ hash: string; algo: string }> => {
    const hash = await argon2.hash(password, ARGON2_OPTIONS);
    return {
      hash,
      algo: ARGON2_ALGO,
    };
  },

  /**
   * Verifies a password against a hash.
   */
  verify: async (hash: string, password: string): Promise<boolean> => {
    return argon2.verify(hash, password);
  },

  /**
   * Checks if a hash needs to be upgraded.
   * (e.g., if you change ARGON2_OPTIONS)
   */
  needsRehash: (hash: string): boolean => {
    return argon2.needsRehash(hash, ARGON2_OPTIONS);
  },
};

