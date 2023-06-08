import fs from 'fs';

import { prompt } from './lib/util';

const REQUIRED_ENV_VARS_RE: Record<string, RegExp> = {
  GOERLI_PRIVATE_KEY: /[0-9a-f]{64}/i,
  GOERLI_PROVIDER_URL: /[0-9a-z]+/i,
  BUGGY_ESCROW_ADDRESS: /0x[0-9a-f]{40}/i,
};

/**
 * Look for required environment variables and prompt for any that are missing.
 */
export async function ensureEnv(): Promise<void> {
  const lines = [];
  for (const varName in REQUIRED_ENV_VARS_RE) {
    if (!process.env[varName]) {
      const regex = REQUIRED_ENV_VARS_RE[varName];
      let response: string | null = null;
      while (response === null) {
        response = await prompt(`${varName}: `);
        response = response.trim();
        if (!response.trim().match(regex)) {
          console.error(`Expected ${varName} to match regex: ${regex}`);
          response = null;
        }
      }

      lines.push(`${varName}=${response}`);
    }
  }
  if (lines.length !== 0) {
    fs.appendFileSync('./.env', Buffer.from(lines.join('\n') + '\n'));
    console.log('Wrote config out to .env');
    console.log('Exiting.');
    process.exit(0);
  }
}

/**
 * Look for required environment variables and throw if any are missing.
 */
export function requireEnv(): void {
  for (const varName in REQUIRED_ENV_VARS_RE) {
    if (!process.env[varName]) {
      throw new Error(`Missing required env var ${varName}`);
    }
  }
}
