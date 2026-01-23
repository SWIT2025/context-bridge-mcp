const pdf = require('pdf-parse');

/**
 * Parses PDF.
 * 
 * @param buffer - File.
 * @returns Text.
 */
export async function parse(buffer: Buffer): Promise<string> {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : String(error)}`);
    }
}
