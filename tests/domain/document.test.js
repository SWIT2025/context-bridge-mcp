"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const document_1 = require("../../src/domain/document");
const pdf_1 = require("../../src/domain/pdf");
const docx_1 = require("../../src/domain/docx");
const promises_1 = require("node:fs/promises");
// Mock dependencies
jest.mock('node:fs/promises');
jest.mock('../../src/domain/pdf');
jest.mock('../../src/domain/docx');
const mockedReadFile = promises_1.readFile;
const mockedPdf = pdf_1.parse;
const mockedDocx = docx_1.parse;
describe('Document Domain', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // Match tests (keeping existing logic)
    describe('match', () => {
        test('Returns true for supported extensions', () => {
            expect((0, document_1.match)('test.pdf')).toBe(true);
            expect((0, document_1.match)('test.docx')).toBe(true);
            expect((0, document_1.match)('test.md')).toBe(true);
            expect((0, document_1.match)('test.txt')).toBe(true);
        });
        test('Returns false for unsupported', () => {
            expect((0, document_1.match)('test.exe')).toBe(false);
        });
    });
    // Extract tests
    describe('extract', () => {
        test('Calls PDF parser for .pdf', async () => {
            mockedReadFile.mockResolvedValue(Buffer.from('fake-pdf'));
            mockedPdf.mockResolvedValue('PDF Content');
            const result = await (0, document_1.extract)('/path/to/file.pdf');
            expect(mockedReadFile).toHaveBeenCalledWith('/path/to/file.pdf');
            expect(mockedPdf).toHaveBeenCalled();
            expect(result).toBe('PDF Content');
        });
        test('Calls DOCX parser for .docx', async () => {
            mockedReadFile.mockResolvedValue(Buffer.from('fake-docx'));
            mockedDocx.mockResolvedValue('DOCX Content');
            const result = await (0, document_1.extract)('/path/to/file.docx');
            expect(mockedDocx).toHaveBeenCalled();
            expect(result).toBe('DOCX Content');
        });
        test('Reads text directly for .md/.txt', async () => {
            mockedReadFile.mockResolvedValue(Buffer.from('Markdown Content'));
            const result = await (0, document_1.extract)('/path/to/file.md');
            expect(mockedPdf).not.toHaveBeenCalled();
            expect(mockedDocx).not.toHaveBeenCalled();
            expect(result).toBe('Markdown Content');
        });
        test('Throws error for unsupported format', async () => {
            mockedReadFile.mockResolvedValue(Buffer.from('binary'));
            await expect((0, document_1.extract)('file.exe')).rejects.toThrow('Unsupported');
        });
    });
});
//# sourceMappingURL=document.test.js.map