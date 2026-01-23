"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdf_1 = require("../../src/domain/pdf");
const docx_1 = require("../../src/domain/docx");
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const mammoth_1 = __importDefault(require("mammoth"));
// Mock libraries
jest.mock('pdf-parse', () => ({
    __esModule: true,
    default: jest.fn()
}));
jest.mock('mammoth');
describe('Parsers', () => {
    describe('PDF Parser', () => {
        test('Success returns text', async () => {
            pdf_parse_1.default.mockResolvedValue({ text: 'Hello PDF' });
            const result = await (0, pdf_1.parse)(Buffer.from(''));
            expect(result).toBe('Hello PDF');
        });
        test('Failure throws error', async () => {
            pdf_parse_1.default.mockRejectedValue(new Error('Corrupt PDF'));
            await expect((0, pdf_1.parse)(Buffer.from(''))).rejects.toThrow('Corrupt PDF');
        });
    });
    describe('DOCX Parser', () => {
        test('Success returns text', async () => {
            mammoth_1.default.extractRawText.mockResolvedValue({ value: 'Hello DOCX' });
            const result = await (0, docx_1.parse)(Buffer.from(''));
            expect(result).toBe('Hello DOCX');
        });
        test('Failure throws error', async () => {
            mammoth_1.default.extractRawText.mockRejectedValue(new Error('Corrupt DOCX'));
            await expect((0, docx_1.parse)(Buffer.from(''))).rejects.toThrow('Failed to parse DOCX');
        });
    });
});
//# sourceMappingURL=parsers.test.js.map