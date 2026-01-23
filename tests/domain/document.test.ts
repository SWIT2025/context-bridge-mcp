import { extract, match } from '../../src/domain/document';
import { parse as parsePdf } from '../../src/domain/pdf';
import { parse as parseDocx } from '../../src/domain/docx';
import { readFile } from 'node:fs/promises';

// Mock dependencies
jest.mock('node:fs/promises');
jest.mock('../../src/domain/pdf');
jest.mock('../../src/domain/docx');

const mockedReadFile = readFile as jest.Mock;
const mockedPdf = parsePdf as jest.Mock;
const mockedDocx = parseDocx as jest.Mock;

describe('Document Domain', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Match tests (keeping existing logic)
    describe('match', () => {
        test('Returns true for supported extensions', () => {
            expect(match('test.pdf')).toBe(true);
            expect(match('test.docx')).toBe(true);
            expect(match('test.md')).toBe(true);
            expect(match('test.txt')).toBe(true);
        });

        test('Returns false for unsupported', () => {
            expect(match('test.exe')).toBe(false);
        });
    });

    // Extract tests
    describe('extract', () => {
        test('Calls PDF parser for .pdf', async () => {
            mockedReadFile.mockResolvedValue(Buffer.from('fake-pdf'));
            mockedPdf.mockResolvedValue('PDF Content');

            const result = await extract('/path/to/file.pdf');

            expect(mockedReadFile).toHaveBeenCalledWith('/path/to/file.pdf');
            expect(mockedPdf).toHaveBeenCalled();
            expect(result).toBe('PDF Content');
        });

        test('Calls DOCX parser for .docx', async () => {
            mockedReadFile.mockResolvedValue(Buffer.from('fake-docx'));
            mockedDocx.mockResolvedValue('DOCX Content');

            const result = await extract('/path/to/file.docx');

            expect(mockedDocx).toHaveBeenCalled();
            expect(result).toBe('DOCX Content');
        });

        test('Reads text directly for .md/.txt', async () => {
            mockedReadFile.mockResolvedValue(Buffer.from('Markdown Content'));

            const result = await extract('/path/to/file.md');

            expect(mockedPdf).not.toHaveBeenCalled();
            expect(mockedDocx).not.toHaveBeenCalled();
            expect(result).toBe('Markdown Content');
        });

        test('Throws error for unsupported format', async () => {
            mockedReadFile.mockResolvedValue(Buffer.from('binary'));
            
            await expect(extract('file.exe')).rejects.toThrow('Unsupported');
        });
    });
});
