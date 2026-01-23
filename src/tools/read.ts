import { extract } from '../domain/document';
import { normalizePath } from '../utils/pathValidator';

const MAX_CONTENT_LENGTH = 50000;

/**
 * Reads document.
 * 
 * @param path - File.
 * @returns Result.
 */
export async function read(path: string): Promise<{ content: string; flag: boolean }> {
    const target = normalizePath(path);
    let content = await extract(target);
    
    let flag = false;
    if (content.length > MAX_CONTENT_LENGTH) {
        content = content.substring(0, MAX_CONTENT_LENGTH);
        flag = true;
    }

    return { content, flag };
}
