import { list } from '../../src/tools/list';
import { glob } from 'glob';
import { stat } from 'node:fs/promises';
import { join } from 'path';

// Mock dependencies
jest.mock('glob');
jest.mock('node:fs/promises');
jest.mock('../../src/domain/document', () => ({
    match: jest.fn((path) => path.endsWith('.txt') || path.endsWith('.pdf'))
}));

const mockedGlob = glob as unknown as jest.Mock;
const mockedStat = stat as jest.Mock;

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

        const results = await list('/root');

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
        await list('/root', true);
        
        expect(mockedGlob).toHaveBeenCalledWith('**/*', expect.objectContaining({
            cwd: expect.stringContaining('/root') // approximate check
        }));
    });
});
