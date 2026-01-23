import mammoth from 'mammoth';

/**
 * Parses DOCX.
 * 
 * @param buffer - File.
 * @returns Text.
 */
export async function parse(buffer: Buffer): Promise<string> {
    try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } catch (error) {
        throw new Error(`Failed to parse DOCX: ${error instanceof Error ? error.message : String(error)}`);
    }
}