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
// Each column's first and last laid-out item gets marker classes:
//   plura-masonry-col-start / plura-masonry-col-end       (any column)
//   plura-masonry-col{N}-start / plura-masonry-col{N}-end (N = 1-based column)
// so CSS can target column edges (e.g. trim the trailing border on column ends)
// — which :first-child / :last-child can't, since the visible set excludes
// filtered items and masonry order ≠ source order.
//
// Lays out on init and auto-refreshes when the container's width changes
// (via ResizeObserver). Call refresh() manually for content changes that
// don't alter width (e.g. filtering). Re-running repositions in place —
// items are never moved in the DOM. destroy() stops observing.
//
// observe:false  — skip the internal ResizeObserver (for a nested masonry
//                  whose parent drives its refresh).
// onMeasure(item) — called after an item's width is set and before its height
//                  is read, so nested content can reflow at the right width.

export function initMasonry(container, { selector, columns = 2, gap = 0, observe = true, onMeasure } = {}) {
	let lastWidth;

	function refresh() {
		lastWidth = container.clientWidth;

		// No usable width — container is display:none or otherwise unrendered.
		// Nothing to lay out; self-heals on the next refresh once it has width
		// again (lastWidth is now 0, so the width-change observer will fire).
		if (!lastWidth) return;

		const cs     = getComputedStyle(container);
		const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
		const num = (name, fallback) => {
			const raw = cs.getPropertyValue(name).trim();
			const v   = parseFloat(raw);
			if (Number.isNaN(v)) return fallback;
			return raw.endsWith('rem') ? v * rootPx : v;  // rem → px; px/unitless → as-is
		};

		const cols     = num('--plura-masonry-columns', columns);
		const gapPx    = num('--plura-masonry-gap', gap);
		const items    = [...container.querySelectorAll(selector)];
		const colWidth = (lastWidth - (cols - 1) * gapPx) / cols;
		const heights  = new Array(cols).fill(0);

		container.style.position = 'relative';

		const firstInCol = new Array(cols);
		const lastInCol  = new Array(cols);

		items.forEach(item => {
			item.style.position = 'absolute';
			item.style.width = `${colWidth}px`;

			// Let nested content reflow at this width before we read the item's
			// height (used for nesting — e.g. an inner masonry inside each item).
			onMeasure?.(item);

			// drop column-edge classes from a previous layout before re-marking
			[...item.classList]
				.filter(cl => cl.startsWith('plura-masonry-col'))
				.forEach(cl => item.classList.remove(cl));

			const c = heights.indexOf(Math.min(...heights));
			item.style.left = `${c * (colWidth + gapPx)}px`;
			item.style.top = `${heights[c]}px`;
			heights[c] += item.offsetHeight + gapPx;  // offsetHeight is read at colWidth

			firstInCol[c] ??= item;
			lastInCol[c]    = item;
		});

		// Mark each column's first and last item — generic + per-column (1-based) —
		// so CSS can target column edges (e.g. trim the trailing border on col ends).
		firstInCol.forEach((item, c) => item?.classList.add('plura-masonry-col-start', `plura-masonry-col${c + 1}-start`));
		lastInCol.forEach((item, c) => item?.classList.add('plura-masonry-col-end', `plura-masonry-col${c + 1}-end`));

		// Height from the actual laid-out bottoms, measured AFTER marking — the
		// col-start/end classes can change item heights (e.g. trimmed padding),
		// so the running `heights` (measured during placement) may be stale.
		const bottom = lastInCol.reduce(
			(max, item) => item ? Math.max(max, item.offsetTop + item.offsetHeight) : max,
			0
		);
		container.style.height = `${bottom}px`;
	}

	refresh();

	// Re-layout on width change (any cause). Ignore height-only changes —
	// including the height we set ourselves — to avoid a feedback loop.
	// Skip when observe:false (e.g. a nested masonry driven by its parent).
	let ro;
	if (observe) {
		ro = new ResizeObserver(() => {
			if (container.clientWidth !== lastWidth) refresh();
		});
		ro.observe(container);
	}

	return { refresh, destroy: () => ro?.disconnect() };
}
