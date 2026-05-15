import { runIntroAnimation } from './anim.js';
import { imgs2svg } from './utils.js';

const DEV = new URLSearchParams(location.search).get('dev') === '1';

await imgs2svg();

const tl = runIntroAnimation();
if (DEV) tl.progress(1);
