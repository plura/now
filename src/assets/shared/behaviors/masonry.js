// ─── Masonry ──────────────────────────────────────────────────
// initMasonry(container, { selector, columns, gap }) → { refresh, destroy }
//
// Absolute-positioning masonry: items stay as direct children of the
// container in source order (tab/reading order preserved) and are
// positioned into the currently-shortest column. Items are measured at
// column width, so text wrapping / aspect ratios are accounted for.
//
// columns and gap are read from CSS vars on the container each refresh
// (--plura-masonry-columns, --plura-masonry-gap), falling back to the JS
// args. So they can be responsive via media queries with no re-wiring,
// while the args stay as sensible defaults.
//
// Lays out on init and auto-refreshes when the container's width changes
// (via ResizeObserver). Call refresh() manually for content changes that
// don't alter width (e.g. filtering). Re-running repositions in place —
// items are never moved in the DOM. destroy() stops observing.

export function initMasonry(container, { selector, columns = 2, gap = 0 } = {}) {
	let lastWidth;

	function refresh() {
		const cs  = getComputedStyle(container);
		const num = (name, fallback) => {
			const v = parseFloat(cs.getPropertyValue(name));
			return Number.isNaN(v) ? fallback : v;
		};

		const cols     = num('--plura-masonry-columns', columns);
		const gapPx    = num('--plura-masonry-gap', gap);
		const items    = [...container.querySelectorAll(selector)];
		const colWidth = (container.clientWidth - (cols - 1) * gapPx) / cols;
		const heights  = new Array(cols).fill(0);

		lastWidth = container.clientWidth;
		container.style.position = 'relative';

		items.forEach(item => {
			item.style.position = 'absolute';
			item.style.width = `${colWidth}px`;

			const c = heights.indexOf(Math.min(...heights));
			item.style.left = `${c * (colWidth + gapPx)}px`;
			item.style.top = `${heights[c]}px`;

			heights[c] += item.offsetHeight + gapPx;  // offsetHeight is read at colWidth
		});

		container.style.height = `${Math.max(0, Math.max(...heights) - gapPx)}px`;
	}

	refresh();

	// Re-layout on width change (any cause). Ignore height-only changes —
	// including the height we set ourselves — to avoid a feedback loop.
	const ro = new ResizeObserver(() => {
		if (container.clientWidth !== lastWidth) refresh();
	});
	ro.observe(container);

	return { refresh, destroy: () => ro.disconnect() };
}
