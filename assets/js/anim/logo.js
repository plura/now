const REMOVALS = '[id$="-x"]';
const LEGS     = '[id*="-leg-"]';

const SEGMENT_ORDER = [
	'arc-tl', 'line-left', 'arc-bl', 'line-bottom',
	'arc-br', 'line-right', 'arc-tr', 'line-top',
];

const SEQUENCE_START = {
	p: 'arc-tl',
	l: 'arc-bl',
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

const HEADER_SEG_DURATION = 0.15;

export function getCapOverhang(path) {
	const svg = path.closest('svg');
	const scale = svg.viewBox.baseVal.width / svg.getBoundingClientRect().width;
	return (parseFloat(getComputedStyle(path).strokeWidth) || 0) * scale / 2;
}

function initPaths(logo, capOverhang) {
	logo.querySelectorAll('path').forEach(el => {
		const len = el.getTotalLength();
		// Set dasharray as a raw SVG attribute — two-value strings can confuse GSAP's parser
		el.setAttribute('stroke-dasharray', `${len} ${DASH_GAP}`);
		gsap.set(el, { strokeDashoffset: len + capOverhang, visibility: 'visible' });
	});
}

export function animatePluraLogoIntro(logo) {
	const capOverhang = getCapOverhang(logo.querySelector('path'));
	initPaths(logo, capOverhang);

	const master = gsap.timeline();

	// Phase 1 — all letters draw in simultaneously
	for (const [letter, startSeg] of Object.entries(SEQUENCE_START)) {
		const startIdx = SEGMENT_ORDER.indexOf(startSeg);
		const orderedSegs = [
			...SEGMENT_ORDER.slice(startIdx),
			...SEGMENT_ORDER.slice(0, startIdx),
		];

		const letterTl = gsap.timeline({ paused: true });

		for (const seg of orderedSegs) {
			const el =
				logo.querySelector(`#plura-anim-l-${letter}-${seg}`) ??
				logo.querySelector(`#plura-anim-l-${letter}-${seg}-x`);
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
		const startIdx = SEGMENT_ORDER.indexOf(startSeg);
		const orderedSegs = [
			...SEGMENT_ORDER.slice(startIdx),
			...SEGMENT_ORDER.slice(0, startIdx),
		];

		const removalEls = orderedSegs
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
			const el = logo.querySelector('#plura-anim-l-u-line-top');
			if (el) master.to(el, { strokeDashoffset: 0, ease: 'power2.inOut', duration: INTRO_DRAW_DURATION }, 'phase4b');
			continue;
		}

		const startIdx = SEGMENT_ORDER.indexOf(startSeg);
		const orderedSegs = [
			...SEGMENT_ORDER.slice(startIdx),
			...SEGMENT_ORDER.slice(0, startIdx),
		].reverse();

		const letterTl = gsap.timeline({ paused: true });

		for (const seg of orderedSegs) {
			const el = logo.querySelector(`#plura-anim-l-${letter}-${seg}`);
			if (!el) continue;
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

	const tl = gsap.timeline({ repeat: -1, yoyo: true });

	// Letters sequentially, segment by segment — removal segments skipped
	for (const [letter, startSeg] of Object.entries(SEQUENCE_START)) {
		const startIdx = SEGMENT_ORDER.indexOf(startSeg);
		const orderedSegs = [
			...SEGMENT_ORDER.slice(startIdx),
			...SEGMENT_ORDER.slice(0, startIdx),
		];

		for (const seg of orderedSegs) {
			const el = logo.querySelector(`#plura-anim-l-${letter}-${seg}`);
			if (!el) continue;
			tl.to(el, { strokeDashoffset: 0, ease: 'power2.inOut', duration: HEADER_SEG_DURATION });
		}
	}

	// Legs after all letters
	logo.querySelectorAll(`path${LEGS}`).forEach(el => {
		tl.to(el, { strokeDashoffset: 0, ease: 'power2.inOut', duration: HEADER_SEG_DURATION });
	});

	return tl;
}
