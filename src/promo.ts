import { fmt } from './grid';

// TigerGrid is the open-source way in to TigerTrack. It shows activity and points to Track for
// what that activity is worth; it never computes billable value itself. Both links can be
// turned off with --no-promo.

export const SITE = 'https://tigertrack.dev';

/**
 * Link to TigerTrack, tagged so Track's analytics can tell which surface sent the visitor.
 *
 * @returns the tigertrack.dev URL with utm_source=tigergrid and the given medium.
 * Called by: cli (terminal footer), render/svg.renderSvg (credit).
 * Calls: nothing.
 */
export const promoUrl = (medium: 'cli' | 'svg'): string => `${SITE}/?utm_source=tigergrid&utm_medium=${medium}`;

/**
 * The footer sentence under the terminal summary, ending where the link goes. With git data it
 * uses the user's own commit count, which makes the step to Track concrete.
 *
 * @returns the sentence without the link, e.g. "→ 939 commits in view. See them as billable hours at".
 * Called by: cli.
 * Calls: fmt.
 */
export function footerText(commits: number | null): string {
	if (commits) return `→ ${fmt(commits)} commits in view. See them as billable hours at`;
	return '→ See your agent work as billable hours at';
}

/**
 * The credit line on the SVG card, sized to the card: the full line when there's room next to
 * the legend, just the domain on narrow cards, nothing on tiny ones.
 *
 * @returns the credit text, or null when the card is too narrow for any.
 * Called by: render/svg.renderSvg.
 * Calls: nothing.
 */
export function creditText(cardWidth: number): string | null {
	if (cardWidth >= 420) return 'Made with TigerGrid · tigertrack.dev';
	if (cardWidth >= 260) return 'tigertrack.dev';
	return null;
}
