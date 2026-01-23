import { search } from '../../src/tools/search';
import { list } from '../../src/tools/list';
import { extract } from '../../src/domain/document';

jest.mock('../../src/tools/list');
jest.mock('../../src/domain/document');

const mockedList = list as jest.MockedFunction<typeof list>;
const mockedExtract = extract as jest.MockedFunction<typeof extract>;

describe('Search Tool', () => {
    test('search_KeywordExists_ReturnsMatch', async () => {
        mockedList.mockResolvedValue([
            { path: '/test/doc1.txt', name: 'doc1.txt', size: 10, extension: 'txt', modified: new Date() }
        ]);
        mockedExtract.mockResolvedValue('Hello world this is a test');

        const results = await search('world', '/test');
        
        expect(results).toHaveLength(1);
        expect(results[0]?.path).toBe('/test/doc1.txt');
        expect(results[0]?.hits[0]).toContain('Hello world');
    });

    test('search_KeywordAbsent_ReturnsEmpty', async () => {
        mockedList.mockResolvedValue([
            { path: '/test/doc2.txt', name: 'doc2.txt', size: 10, extension: 'txt', modified: new Date() }
        ]);
        mockedExtract.mockResolvedValue('Another document');

        const results = await search('foobar', '/test');
        
        expect(results).toHaveLength(0);
    });

    test('search_CaseInsensitive_ReturnsMatch', async () => {
        mockedList.mockResolvedValue([
            { path: '/test/doc1.txt', name: 'doc1.txt', size: 10, extension: 'txt', modified: new Date() }
        ]);
        mockedExtract.mockResolvedValue('Hello world');

        const results = await search('WORLD', '/test');
        
        expect(results).toHaveLength(1);
    });
});
