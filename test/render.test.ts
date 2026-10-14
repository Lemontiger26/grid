import { describe, expect, test } from 'bun:test';
import type { Days } from '../types/days';
import { day } from '../src/days';
import { buildGrid, summarize } from '../src/grid';
import { renderSvg } from '../src/render/svg';

// The terminal renderer decides on colour at import time; force plain output first.
process.env.NO_COLOR = '1';
const { renderGrid } = await import('../src/render/terminal');

const TODAY = new Date(2026, 8, 12); // Saturday
const days: Days = new Map();
for (const [key, count] of Object.entries({
	'2026-09-08': 2,
	'2026-09-09': 2,
	'2026-09-10': 1,
	'2026-09-11': 1,
	'2026-09-12': 1
})) {
	day(days, key).prompts.claude = count;
}
const grid = buildGrid(days, 'prompts', 'all', 2, TODAY);

describe('renderGrid (no colour)', () => {
	// Weeks of 08-31 and 09-07. "Aug" is dropped (no room before "Sep"); Sunday 09-13 is still in the future.
	test('wide: three columns per week, gaps between days and weeks', () => {
		expect(renderGrid(grid, 'prompts', { cells: 'wide', theme: 'light' })).toBe(
			[
				'        Sep',
				'Mon  ·  · ',
				'     · ▓▓ ',
				'Wed  · ▓▓ ',
				'     · ░░ ',
				'Fri  · ░░ ',
				'     · ░░ ',
				'     ·    '
			].join('\n')
		);
	});

	test('matrix (default): two columns per week, no legend', () => {
		expect(renderGrid(grid, 'prompts', { cells: 'matrix', theme: 'dark' })).toBe(
			['       Sep', 'Mon  · ·', '     · ▓', 'Wed  · ▓', '     · ░', 'Fri  · ░', '     · ░', '     ·  '].join('\n')
		);
	});
});

describe('renderSvg', () => {
	const svg = renderSvg(grid, 'prompts', summarize(grid), 'Agent activity · A & B <test>');

	test('is a standalone SVG with a light default and a dark media query', () => {
		expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
		expect(svg).toContain('@media (prefers-color-scheme:dark)');
		expect(svg.trimEnd().endsWith('</svg>')).toBe(true);
	});

	test('draws one cell per past day plus five legend swatches', () => {
		const cells = svg.match(/<rect class="l\d"/g) ?? [];
		expect(cells).toHaveLength(13 + 5);
	});

	test('gives each day a tooltip', () => {
		expect(svg).toContain('<title>2026-09-08: 2 prompts</title>');
		expect(svg).toContain('<title>2026-09-01: 0 prompts</title>');
		expect(svg).not.toContain('2026-09-13');
	});

	test('escapes the title and shows the summary', () => {
		expect(svg).toContain('Agent activity · A &#38; B &#60;test&#62;');
		expect(svg).toContain('<tspan class="v">7</tspan> prompts');
		expect(svg).toContain('<tspan class="v">5</tspan> active days');
	});
});

describe('renderSvg credit', () => {
	/** Render an empty grid of `weeks` columns, with or without the credit. */
	const svgOf = (weeks: number, credit = true) => {
		const sized = buildGrid(days, 'prompts', 'all', weeks, TODAY);
		return renderSvg(sized, 'prompts', summarize(sized), 'Agent activity', credit);
	};

	test('a wide card gets the full credit line, linked to TigerTrack with UTM tags', () => {
		const svg = svgOf(30);
		expect(svg).toContain('>Made with TigerGrid · tigertrack.dev</text></a>');
		expect(svg).toContain('<a href="https://tigertrack.dev/?utm_source=tigergrid&#38;utm_medium=svg"');
		expect(svg).toContain('xmlns:xlink="http://www.w3.org/1999/xlink"');
	});

	test('a narrow card gets just the domain, a tiny one nothing', () => {
		expect(svgOf(14)).toContain('>tigertrack.dev</text></a>');
		expect(svgOf(14)).not.toContain('Made with');
		expect(svgOf(2)).not.toContain('tigertrack.dev');
	});

	test('credit=false leaves it out', () => {
		expect(svgOf(30, false)).not.toContain('tigertrack.dev');
	});
});
