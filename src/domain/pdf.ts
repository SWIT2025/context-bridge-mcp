import PdfParse from 'pdf-parse';

/**
 * Parses PDF.
 * 
 * @param buffer - File.
 * @returns Text.
 */
export async function parse(buffer: Buffer): Promise<string> {
    const data = await (PdfParse as any)(buffer);
    return data.text;
}
