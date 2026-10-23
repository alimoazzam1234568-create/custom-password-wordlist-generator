// Character sets
export const CHAR_SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*',
  special: '()-_=+[]{}|;:\'",.<>?/`~',
};

export type CharSetKey = keyof typeof CHAR_SETS;

export interface GeneratorConfig {
  baseWord: string;
  passwordLength: number;
  mode: 'all' | 'custom';
  customLimit: number;
  charSets: CharSetKey[];
  position: 'prefix' | 'suffix' | 'both';
  caseMutations: boolean;
  leetSpeak: boolean;
}

const LEET_MAP: Record<string, string[]> = {
  a: ['@', '4'],
  e: ['3'],
  i: ['1', '!'],
  o: ['0'],
  s: ['$', '5'],
  t: ['7'],
  l: ['1'],
  g: ['9'],
  b: ['8'],
};

function getCaseMutations(word: string): string[] {
  const results = new Set<string>();
  results.add(word);
  results.add(word.toLowerCase());
  results.add(word.toUpperCase());
  // Capitalize first letter
  results.add(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  // Random-ish casing patterns
  let alt1 = '';
  let alt2 = '';
  for (let i = 0; i < word.length; i++) {
    alt1 += i % 2 === 0 ? word[i].toUpperCase() : word[i].toLowerCase();
    alt2 += i % 2 === 0 ? word[i].toLowerCase() : word[i].toUpperCase();
  }
  results.add(alt1);
  results.add(alt2);
  return Array.from(results);
}

function getLeetVariants(word: string): string[] {
  const results: string[] = [word];
  const lowerWord = word.toLowerCase();

  // Generate leet speak variants
  function generate(current: string, index: number) {
    if (index >= lowerWord.length) {
      results.push(current);
      return;
    }
    const ch = lowerWord[index];
    if (LEET_MAP[ch]) {
      for (const replacement of LEET_MAP[ch]) {
        generate(current + replacement, index + 1);
      }
    }
    generate(current + word[index], index + 1);
  }

  generate('', 0);
  return [...new Set(results)];
}

function buildCharPool(charSets: CharSetKey[]): string {
  let pool = '';
  for (const key of charSets) {
    pool += CHAR_SETS[key];
  }
  return [...new Set(pool.split(''))].join('');
}

// Generate all combinations of given length from a character pool
function* generateCombinations(pool: string, length: number): Generator<string> {
  if (length === 0) {
    yield '';
    return;
  }
  if (length === 1) {
    for (const ch of pool) {
      yield ch;
    }
    return;
  }

  const indices = new Array(length).fill(0);
  const poolLen = pool.length;
  const total = Math.pow(poolLen, length);

  for (let i = 0; i < total; i++) {
    let str = '';
    for (let j = 0; j < length; j++) {
      str += pool[indices[j]];
    }
    yield str;

    // Increment indices (like counting in base poolLen)
    for (let j = length - 1; j >= 0; j--) {
      indices[j]++;
      if (indices[j] < poolLen) break;
      indices[j] = 0;
    }
  }
}

// Shuffle using Fisher-Yates for custom/random mode
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate random string from pool
function randomString(pool: string, length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += pool[Math.floor(Math.random() * pool.length)];
  }
  return result;
}

export function calculateTotalCombinations(config: GeneratorConfig): number {
  const { baseWord, passwordLength, charSets, position, caseMutations, leetSpeak } = config;
  const pool = buildCharPool(charSets);
  if (pool.length === 0) return 0;

  let wordVariants = [baseWord];
  if (caseMutations) {
    wordVariants = getCaseMutations(baseWord);
  }
  if (leetSpeak) {
    const allVariants: string[] = [];
    for (const w of wordVariants) {
      allVariants.push(...getLeetVariants(w));
    }
    wordVariants = [...new Set(allVariants)];
  }

  let totalPerVariant = 0;

  for (const variant of wordVariants) {
    const remainingLength = passwordLength - variant.length;
    if (remainingLength < 0) continue;
    if (remainingLength === 0) {
      totalPerVariant += 1;
      continue;
    }

    const combos = Math.pow(pool.length, remainingLength);

    if (position === 'both') {
      // For 'both', we can place the word at different positions
      totalPerVariant += combos * 2; // prefix + suffix
    } else {
      totalPerVariant += combos;
    }
  }

  return totalPerVariant;
}

export interface GeneratorProgress {
  generated: number;
  total: number;
  passwords: string[];
  done: boolean;
}

export function generateWordlist(
  config: GeneratorConfig,
  onProgress: (progress: GeneratorProgress) => void,
  abortSignal?: { aborted: boolean }
): void {
  const { baseWord, passwordLength, mode, customLimit, charSets, position, caseMutations, leetSpeak } = config;
  const pool = buildCharPool(charSets);

  if (pool.length === 0 || baseWord.length === 0) {
    onProgress({ generated: 0, total: 0, passwords: [], done: true });
    return;
  }

  let wordVariants = [baseWord];
  if (caseMutations) {
    wordVariants = getCaseMutations(baseWord);
  }
  if (leetSpeak) {
    const allVariants: string[] = [];
    for (const w of wordVariants) {
      allVariants.push(...getLeetVariants(w));
    }
    wordVariants = [...new Set(allVariants)];
  }

  const passwords: string[] = [];
  const seen = new Set<string>();
  let totalTarget = mode === 'custom' ? customLimit : Infinity;

  if (mode === 'all') {
    // Generate ALL combinations systematically
    for (const variant of wordVariants) {
      if (abortSignal?.aborted) break;

      const remainingLength = passwordLength - variant.length;
      if (remainingLength < 0) continue;

      if (remainingLength === 0) {
        if (!seen.has(variant)) {
          seen.add(variant);
          passwords.push(variant);
        }
        continue;
      }

      const positions = position === 'both' ? ['prefix', 'suffix'] : [position];

      for (const pos of positions) {
        if (abortSignal?.aborted) break;

        const combGen = generateCombinations(pool, remainingLength);
        let batchCount = 0;

        for (const combo of combGen) {
          if (abortSignal?.aborted) break;

          const pw = pos === 'prefix' ? variant + combo : combo + variant;

          if (!seen.has(pw)) {
            seen.add(pw);
            passwords.push(pw);
            batchCount++;

            // Report progress every 5000 passwords
            if (batchCount % 5000 === 0) {
              onProgress({
                generated: passwords.length,
                total: -1, // unknown for 'all'
                passwords: [],
                done: false,
              });
            }

            // Safety limit to prevent browser crash
            if (passwords.length >= 500000) {
              onProgress({
                generated: passwords.length,
                total: passwords.length,
                passwords,
                done: true,
              });
              return;
            }
          }
        }
      }
    }

    onProgress({
      generated: passwords.length,
      total: passwords.length,
      passwords,
      done: true,
    });
  } else {
    // Custom mode - generate random unique passwords up to limit
    const maxAttempts = totalTarget * 10;
    let attempts = 0;

    while (passwords.length < totalTarget && attempts < maxAttempts) {
      if (abortSignal?.aborted) break;
      attempts++;

      const variant = wordVariants[Math.floor(Math.random() * wordVariants.length)];
      const remainingLength = passwordLength - variant.length;

      if (remainingLength < 0) continue;
      if (remainingLength === 0) {
        if (!seen.has(variant)) {
          seen.add(variant);
          passwords.push(variant);
        }
        continue;
      }

      const combo = randomString(pool, remainingLength);
      const pos = position === 'both'
        ? (Math.random() > 0.5 ? 'prefix' : 'suffix')
        : position;

      const pw = pos === 'prefix' ? variant + combo : combo + variant;

      if (!seen.has(pw)) {
        seen.add(pw);
        passwords.push(pw);

        if (passwords.length % 1000 === 0) {
          onProgress({
            generated: passwords.length,
            total: totalTarget,
            passwords: [],
            done: false,
          });
        }
      }
    }

    onProgress({
      generated: passwords.length,
      total: totalTarget,
      passwords: shuffleArray(passwords),
      done: true,
    });
  }
}
