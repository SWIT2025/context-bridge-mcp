import { parse as parsePdf } from '../../src/domain/pdf';
import { parse as parseDocx } from '../../src/domain/docx';
import pdf from '@cedrugs/pdf-parse';
import mammoth from 'mammoth';

// Mock libraries
jest.mock('@cedrugs/pdf-parse', () => jest.fn());
jest.mock('mammoth');

describe('Parsers', () => {
    describe('PDF Parser', () => {
        test('Success returns text', async () => {
            (pdf as unknown as jest.Mock).mockResolvedValue({ text: 'Hello PDF' });
            const result = await parsePdf(Buffer.from(''));
            expect(result).toBe('Hello PDF');
        });

        test('Failure throws error', async () => {
            (pdf as unknown as jest.Mock).mockRejectedValue(new Error('Corrupt PDF'));
            await expect(parsePdf(Buffer.from(''))).rejects.toThrow('Corrupt PDF');
        });
    });

    describe('DOCX Parser', () => {
        test('Success returns text', async () => {
            (mammoth.extractRawText as jest.Mock).mockResolvedValue({ value: 'Hello DOCX' });
            const result = await parseDocx(Buffer.from(''));
            expect(result).toBe('Hello DOCX');
        });

        test('Failure throws error', async () => {
            (mammoth.extractRawText as jest.Mock).mockRejectedValue(new Error('Corrupt DOCX'));
            await expect(parseDocx(Buffer.from(''))).rejects.toThrow('Failed to parse DOCX');
        });
    });
});
