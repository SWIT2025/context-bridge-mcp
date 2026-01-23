import { list } from './list';
import { extract } from '../domain/document';

interface Result {
    path: string;
    hits: string[];
}

/**
 * Searches documents.
 * 
 * @param query - Term.
 * @param path - Directory.
 * @param mode - Flag.
 * @returns Results.
 */
export async function search(query: string, path: string, mode: boolean = false): Promise<Result[]> {
    const docs = await list(path, mode);
    const results: Result[] = [];
    const term = query.toLowerCase();

    for (const doc of docs) {
        try {
            const content = await extract(doc.path);
            const text = content.toLowerCase();
            
            if (text.includes(term)) {
                const hits: string[] = [];
                let pos = text.indexOf(term);
                
                while (pos !== -1 && hits.length < 3) {
                    const start = Math.max(0, pos - 50);
                    const end = Math.min(content.length, pos + query.length + 50);
                    hits.push(`...${content.substring(start, end).replace(/\n/g, ' ')}...`);
                    pos = text.indexOf(term, pos + 1);
                }

                results.push({ path: doc.path, hits });
            }
        } catch (error) {
            console.error(`Search error in ${doc.path}:`, error);
        }
    }

    return results;
}