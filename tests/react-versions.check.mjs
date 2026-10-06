import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const { dependencies } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('react and react-dom have the same version', () => {
	assert.equal(dependencies['react-dom'], dependencies.react);
});
