import { normalizePath } from '../../src/utils/pathValidator';
import { resolve, join } from 'path';

describe('Path Validator', () => {
    test('normalizePath_AbsolutePath_ReturnsSame', () => {
        const absPath = resolve('/tmp/test');
        expect(normalizePath(absPath)).toBe(absPath);
    });

    test('normalizePath_RelativePath_ResolvesToCwd', () => {
        const relPath = 'docs/readme.md';
        const expected = join(process.cwd(), relPath);
        expect(normalizePath(relPath)).toBe(expected);
    });

    test('normalizePath_Dot_ReturnsCwd', () => {
        expect(normalizePath('.')).toBe(process.cwd());
    });
});
