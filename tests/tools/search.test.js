"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("../../src/tools/search");
const list_1 = require("../../src/tools/list");
const document_1 = require("../../src/domain/document");
jest.mock('../../src/tools/list');
jest.mock('../../src/domain/document');
const mockedList = list_1.list;
const mockedExtract = document_1.extract;
describe('Search Tool', () => {
    test('search_KeywordExists_ReturnsMatch', async () => {
        mockedList.mockResolvedValue([
            { path: '/test/doc1.txt', name: 'doc1.txt', size: 10, extension: 'txt', modified: new Date() }
        ]);
        mockedExtract.mockResolvedValue('Hello world this is a test');
        const results = await (0, search_1.search)('world', '/test');
        expect(results).toHaveLength(1);
        expect(results[0]?.path).toBe('/test/doc1.txt');
        expect(results[0]?.hits[0]).toContain('Hello world');
    });
    test('search_KeywordAbsent_ReturnsEmpty', async () => {
        mockedList.mockResolvedValue([
            { path: '/test/doc2.txt', name: 'doc2.txt', size: 10, extension: 'txt', modified: new Date() }
        ]);
        mockedExtract.mockResolvedValue('Another document');
        const results = await (0, search_1.search)('foobar', '/test');
        expect(results).toHaveLength(0);
    });
    test('search_CaseInsensitive_ReturnsMatch', async () => {
        mockedList.mockResolvedValue([
            { path: '/test/doc1.txt', name: 'doc1.txt', size: 10, extension: 'txt', modified: new Date() }
        ]);
        mockedExtract.mockResolvedValue('Hello world');
        const results = await (0, search_1.search)('WORLD', '/test');
        expect(results).toHaveLength(1);
    });
});
//# sourceMappingURL=search.test.js.map