import * as crypto from 'node:crypto';

export function generateRandomHexString(size: number): string {
  return crypto
    .randomBytes(Math.ceil(size / 2))
    .toString('hex')
    .substring(0, size);
}

const PASSWORD_CHARSET =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?';

export function generateSecurePassword(size: number) {
  return Array.from(crypto.randomBytes(size))
    .map((x) => x % PASSWORD_CHARSET.length)
    .map((x) => PASSWORD_CHARSET[x])
    .join('');
}

// export function generateRandomHexString(size: number): string {
//   return [...Array(size)]
//     .map(() => Math.floor(Math.random() * 16).toString(16))
//     .join('');
// }
