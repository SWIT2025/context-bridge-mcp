"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pathValidator_1 = require("../../src/utils/pathValidator");
const path_1 = require("path");
describe('Path Validator', () => {
    test('normalizePath_AbsolutePath_ReturnsSame', () => {
        const absPath = (0, path_1.resolve)('/tmp/test');
        expect((0, pathValidator_1.normalizePath)(absPath)).toBe(absPath);
    });
    test('normalizePath_RelativePath_ResolvesToCwd', () => {
        const relPath = 'docs/readme.md';
        const expected = (0, path_1.join)(process.cwd(), relPath);
        expect((0, pathValidator_1.normalizePath)(relPath)).toBe(expected);
    });
    test('normalizePath_Dot_ReturnsCwd', () => {
        expect((0, pathValidator_1.normalizePath)('.')).toBe(process.cwd());
    });
});
//# sourceMappingURL=pathValidator.test.js.map