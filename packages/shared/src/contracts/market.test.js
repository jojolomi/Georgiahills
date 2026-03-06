import { test } from 'node:test';
import assert from 'node:assert';
import { isSupportedMarket, normalizeSourceLang } from './market.js';

test('isSupportedMarket', async (t) => {
  await t.test('returns true for valid lowercase market codes', () => {
    assert.strictEqual(isSupportedMarket('sa'), true);
    assert.strictEqual(isSupportedMarket('ae'), true);
    assert.strictEqual(isSupportedMarket('qa'), true);
    assert.strictEqual(isSupportedMarket('kw'), true);
    assert.strictEqual(isSupportedMarket('eg'), true);
  });

  await t.test('returns true for valid uppercase market codes', () => {
    assert.strictEqual(isSupportedMarket('SA'), true);
    assert.strictEqual(isSupportedMarket('AE'), true);
  });

  await t.test('returns true for valid mixed case market codes', () => {
    assert.strictEqual(isSupportedMarket('sA'), true);
    assert.strictEqual(isSupportedMarket('Ae'), true);
  });

  await t.test('returns false for invalid market codes', () => {
    assert.strictEqual(isSupportedMarket('uk'), false);
    assert.strictEqual(isSupportedMarket('us'), false);
    assert.strictEqual(isSupportedMarket('invalid'), false);
  });

  await t.test('returns false for null/undefined/empty input', () => {
    assert.strictEqual(isSupportedMarket(null), false);
    assert.strictEqual(isSupportedMarket(undefined), false);
    assert.strictEqual(isSupportedMarket(''), false);
    assert.strictEqual(isSupportedMarket('   '), false);
  });
});

test('normalizeSourceLang', async (t) => {
  await t.test('returns "ar" when input is "ar"', () => {
    assert.strictEqual(normalizeSourceLang('ar'), 'ar');
  });

  await t.test('returns "en" when input is "en"', () => {
    assert.strictEqual(normalizeSourceLang('en'), 'en');
  });

  await t.test('returns "en" for other inputs', () => {
    assert.strictEqual(normalizeSourceLang('fr'), 'en');
    assert.strictEqual(normalizeSourceLang(null), 'en');
    assert.strictEqual(normalizeSourceLang(undefined), 'en');
    assert.strictEqual(normalizeSourceLang(''), 'en');
  });
});
