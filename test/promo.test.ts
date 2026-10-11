import { describe, expect, test } from 'bun:test';
import { creditText, footerText, promoUrl } from '../src/promo';

describe('promoUrl', () => {
	test('tags the link with source and medium', () => {
		expect(promoUrl('cli')).toBe('https://tigertrack.dev/?utm_source=tigergrid&utm_medium=cli');
		expect(promoUrl('svg')).toBe('https://tigertrack.dev/?utm_source=tigergrid&utm_medium=svg');
	});
});

describe('footerText', () => {
	test("uses the user's own commit count when there is one", () => {
		expect(footerText(939)).toBe('→ 939 commits in view. See them as billable hours at');
		expect(footerText(12_400)).toBe('→ 12.4k commits in view. See them as billable hours at');
	});

	test('falls back to a generic line without git data or commits', () => {
		expect(footerText(null)).toBe('→ See your agent work as billable hours at');
		expect(footerText(0)).toBe('→ See your agent work as billable hours at');
	});
});

describe('creditText', () => {
	test('shrinks with the card: full line, domain only, nothing', () => {
		expect(creditText(822)).toBe('Made with TigerGrid · tigertrack.dev');
		expect(creditText(420)).toBe('Made with TigerGrid · tigertrack.dev');
		expect(creditText(419)).toBe('tigertrack.dev');
		expect(creditText(260)).toBe('tigertrack.dev');
		expect(creditText(259)).toBeNull();
	});
});
