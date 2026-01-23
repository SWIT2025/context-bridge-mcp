import { parse as pdf } from './pdf';
import { parse as docx } from './docx';
import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';

/**
 * Extracts text.
 * 
 * @param path - File.
 * @returns Text.
 */
export async function extract(path: string): Promise<string> {
    const ext = extname(path).toLowerCase();
    const data = await readFile(path);

    switch (ext) {
        case '.pdf':
            return pdf(data);
        case '.docx':
            return docx(data);
        case '.md':
        case '.txt':
            return data.toString('utf8');
        default:
            throw new Error(`Unsupported: ${ext}`);
    }
}

/**
 * Matches extension.
 * 
 * @param path - File.
 * @returns Boolean.
 */
export function match(path: string): boolean {
    const extensions = ['.pdf', '.docx', '.md', '.txt'];
    return extensions.includes(extname(path).toLowerCase());
}