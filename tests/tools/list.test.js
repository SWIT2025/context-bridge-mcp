"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const list_1 = require("../../src/tools/list");
const glob_1 = require("glob");
const promises_1 = require("node:fs/promises");
// Mock dependencies
jest.mock('glob');
jest.mock('node:fs/promises');
jest.mock('../../src/domain/document', () => ({
    match: jest.fn((path) => path.endsWith('.txt') || path.endsWith('.pdf'))
}));
const mockedGlob = glob_1.glob;
const mockedStat = promises_1.stat;
describe('List Tool', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('list_ReturnsFilteredFilesWithMetadata', async () => {
        // Setup mocks
        const mockFiles = [
            '/root/doc1.txt',
            '/root/image.png', // Should be filtered out by match mock logic if we used real match, but here we control match
            '/root/doc2.pdf'
        ];
        // glob returns promise resolving to file list
        mockedGlob.mockResolvedValue(mockFiles);
        // stat returns file info
        mockedStat.mockResolvedValue({
            size: 1024,
            mtime: new Date('2023-01-01')
        });
        const results = await (0, list_1.list)('/root');
        expect(mockedGlob).toHaveBeenCalled();
        // Since we mocked match to accept txt and pdf
        expect(results).toHaveLength(2);
        expect(results[0]).toEqual({
            name: 'doc1.txt',
            path: '/root/doc1.txt',
            size: 1024,
            extension: 'txt',
            modified: expect.any(Date)
        });
        expect(results[1].name).toBe('doc2.pdf');
    });
    test('list_RecursiveFlag_PassesToGlob', async () => {
        mockedGlob.mockResolvedValue([]);
        await (0, list_1.list)('/root', true);
        expect(mockedGlob).toHaveBeenCalledWith('**/*', expect.objectContaining({
            cwd: expect.stringContaining('/root') // approximate check
        }));
    });
});
//# sourceMappingURL=list.test.js.map