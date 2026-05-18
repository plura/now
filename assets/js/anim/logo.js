// Stroke width in CSS px — must match the stroke-width in style.css.
export const LOGO_STROKE_WIDTH = 4;

// Segments suffixed with '-x' are removal segments: drawn in phase 1, then undrawn in phase 3.
// A given segment is always one or the other — never both variants coexist.
const REMOVALS = '[id$="-x"]';
const LEGS     = '[id*="-leg-"]';

const SEGMENT_ORDER = [
	'arc-tl', 'line-left', 'arc-bl', 'line-bottom',
	'arc-br', 'line-right', 'arc-tr', 'line-top',
];

// Start segment per letter — determines both draw order (phase 1) and undraw order (phase 4)
const SEQUENCE_START = {
	p: 'arc-tl',
	l: 'arc-tl', // arc-tl gives correct undraw continuity given L's missing segments
	u: 'arc-br',
	r: 'line-top',
	a: 'arc-tr',
};

// Large gap prevents the dash pattern from repeating within any path,
// eliminating round-cap dot artifacts at the hidden boundary.
const DASH_GAP = 1e6;

const INTRO_DRAW_DURATION   = 3;
const INTRO_BETWEEN_DELAY   = 0.5;
const INTRO_PHASE3_DURATION = 1;
const INTRO_PHASE4_DELAY    = 0.5;

const HEADER_DRAW_DURATION = 1.5;
const HEADER_LEG_DURATION  = 0.5;


// ─── Utils ───────────────────────────────────────────────────

// Returns SEGMENT_ORDER rotated so startSeg is first, wrapping around.
function getOrderedSegs(startSeg) {
	const i = SEGMENT_ORDER.indexOf(startSeg);
	return [...SEGMENT_ORDER.slice(i), ...SEGMENT_ORDER.slice(0, i)];
}

// Returns half the stroke-width in SVG user units — used to extend dashoffset
// so round caps don't leave a visible dot at the hidden end of a path.
export function getCapOverhang(path) {
	const svg = path.closest('svg');
	const scale = svg.viewBox.baseVal.width / svg.getBoundingClientRect().width;
	return (parseFloat(getComputedStyle(path).strokeWidth) || 0) * scale / 2;
}

// Hides all paths via dashoffset and makes them visible so GSAP can animate them in.
function initPaths(logo, capOverhang) {
	logo.querySelectorAll('path').forEach(el => {
		const len = el.getTotalLength();
		// Set dasharray as a raw SVG attribute — two-value strings can confuse GSAP's parser
		el.setAttribute('stroke-dasharray', `${len} ${DASH_GAP}`);
		gsap.set(el, { strokeDashoffset: len + capOverhang, visibility: 'visible' });
	});
}


// ─── Animations ──────────────────────────────────────────────

export function animatePluraLogoIntro(logo) {
	const capOverhang = getCapOverhang(logo.querySelector('path'));
	initPaths(logo, capOverhang);

	const master = gsap.timeline();

	// Phase 1 — all letters draw in simultaneously
	for (const [letter, startSeg] of Object.entries(SEQUENCE_START)) {
		const letterTl = gsap.timeline({ paused: true });

		for (const seg of getOrderedSegs(startSeg)) {
			const el = logo.querySelector(`[id*="${letter}-${seg}"]`);
			if (!el) continue;
			letterTl.to(el, { strokeDashoffset: 0, ease: 'none', duration: 1 });
		}

		// Tween the sub-timeline's progress so the overall easing is power2.inOut
		master.to(letterTl, { progress: 1, ease: 'power2.inOut', duration: INTRO_DRAW_DURATION }, 0);
	}

	// Phase 2 — brief pause
	master.addLabel('phase3', `+=${INTRO_BETWEEN_DELAY}`);

	// Phase 3 — legs draw in, removal segments draw out, same duration
	logo.querySelectorAll(`path${LEGS}`).forEach(el => {
		master.to(el, { strokeDashoffset: 0, ease: 'power2.inOut', duration: INTRO_PHASE3_DURATION }, 'phase3');
	});

	for (const [letter, startSeg] of Object.entries(SEQUENCE_START)) {
		const removalEls = getOrderedSegs(startSeg)
			.map(seg => logo.querySelector(`#plura-anim-l-${letter}-${seg}-x`))
			.filter(Boolean)
			.reverse();

		if (!removalEls.length) continue;

		const removalTl = gsap.timeline({ paused: true });
		removalEls.forEach(el => {
			const len = el.getTotalLength();
			removalTl.to(el, { strokeDashoffset: len + capOverhang, ease: 'none', duration: 1 });
		});

		master.to(removalTl, { progress: 1, ease: 'power2.inOut', duration: INTRO_PHASE3_DURATION }, 'phase3');
	}

	// Phase 4 — brief pause, then reversal
	master.addLabel('phase4a', `+=${INTRO_PHASE4_DELAY}`);

	// Phase 4a — legs undraw simultaneously
	logo.querySelectorAll(`path${LEGS}`).forEach(el => {
		const len = el.getTotalLength();
		master.to(el, { strokeDashoffset: len + capOverhang, ease: 'power2.inOut', duration: INTRO_PHASE3_DURATION }, 'phase4a');
	});

	master.addLabel('phase4b', `phase4a+=${INTRO_PHASE3_DURATION}`);

	// Phase 4b — letters undraw simultaneously, segment by segment in reverse
	// Exception: U only draws its closing line-top segment
	for (const [letter, startSeg] of Object.entries(SEQUENCE_START)) {
		if (letter === 'u') {
			const el = logo.querySelector(`[id*="${letter}-line-top"]`);
			if (el) master.to(el, { strokeDashoffset: 0, ease: 'power2.inOut', duration: INTRO_DRAW_DURATION }, 'phase4b');
			continue;
		}

		const drawnEls = getOrderedSegs(startSeg)
			.map(seg => logo.querySelector(`#plura-anim-l-${letter}-${seg}`))
			.filter(Boolean)
			.reverse();

		const letterTl = gsap.timeline({ paused: true });
		for (const el of drawnEls) {
			const len = el.getTotalLength();
			letterTl.to(el, { strokeDashoffset: len + capOverhang, ease: 'none', duration: 1 });
		}

		master.to(letterTl, { progress: 1, ease: 'power2.inOut', duration: INTRO_DRAW_DURATION }, 'phase4b');
	}

	return master;
}

export function animatePluraLogoHeader(logo) {
	const capOverhang = getCapOverhang(logo.querySelector('path'));
	initPaths(logo, capOverhang);

	const tl = gsap.timeline();

	// All letters draw in simultaneously, segment by segment — removal segments skipped
	for (const [letter, startSeg] of Object.entries(SEQUENCE_START)) {
		const letterTl = gsap.timeline({ paused: true });

		for (const seg of getOrderedSegs(startSeg)) {
			const el = logo.querySelector(`#plura-anim-l-${letter}-${seg}`);
			if (!el) continue;
			letterTl.to(el, { strokeDashoffset: 0, ease: 'none', duration: 1 });
		}

		tl.to(letterTl, { progress: 1, ease: 'power2.inOut', duration: HEADER_DRAW_DURATION }, 0);
	}

	// Legs after letters, all simultaneously
	const legsTl = gsap.timeline({ paused: true });
	logo.querySelectorAll(`path${LEGS}`).forEach(el => {
		legsTl.to(el, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0);
	});
	tl.to(legsTl, { progress: 1, ease: 'power2.inOut', duration: HEADER_LEG_DURATION });

	return tl;
}
