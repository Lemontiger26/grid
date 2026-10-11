import { fmt } from './grid';

// TigerGrid is the open-source way in to TigerTrack ("your development activity, across tools
// and projects"). It shows local activity and points to what Track adds: history across machines,
// projects, and work linked to issues. It never promises hours or billing: those belong to Track's
// optional Ledger module. Both links can be turned off with --no-promo.

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
 * uses the user's own commit count and asks the question Track answers (which issues and
 * projects that work belongs to); without it, it offers history beyond this machine.
 *
 * @returns the sentence without the link, e.g. "→ 939 commits in view. Link them to issues and projects at".
 * Called by: cli.
 * Calls: fmt.
 */
export function footerText(commits: number | null): string {
	if (commits) return `→ ${fmt(commits)} commits in view. Link them to issues and projects at`;
	return '→ Keep this history across machines and projects at';
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
