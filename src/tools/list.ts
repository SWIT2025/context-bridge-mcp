import { glob } from 'glob';
import { stat } from 'node:fs/promises';
import { basename } from 'node:path';
import { match } from '../domain/document';
import { normalizePath } from '../utils/pathValidator';

interface Info {
    name: string;
    path: string;
    size: number;
    extension: string;
    modified: Date;
}

/**
 * Lists documents.
 * 
 * @param path - Directory.
 * @param recurse - Flag.
 * @returns List.
 */
export async function list(path: string, recurse: boolean = false): Promise<Info[]> {
    const root = normalizePath(path);
    const pattern = recurse ? '**/*' : '*';
    
    const files = await glob(pattern, {
        cwd: root,
        absolute: true,
        nodir: true,
        ignore: ['**/node_modules/**', '**/.git/**']
    });

    const items: Info[] = [];

    for (const file of files) {
        if (match(file)) {
            const stats = await stat(file);
            items.push({
                name: basename(file),
                path: file,
                size: stats.size,
                extension: file.split('.').pop() || '',
                modified: stats.mtime
            });
        }
    }

    return items;
}
