import { resolve, isAbsolute } from 'node:path';

/**
 * Normalizes and validates a path.
 * 
 * @param path - The path to normalize.
 * @param rootDir - The optional root directory to resolve against.
 * @returns The absolute path.
 */
export function normalizePath(path: string, rootDir: string = process.cwd()): string {
    if (isAbsolute(path)) {
        return resolve(path);
    }
    return resolve(rootDir, path);
}
